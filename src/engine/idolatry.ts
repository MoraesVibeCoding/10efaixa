import { areRivals } from './clubs';
import cfg from '../data/idolatry.json';

// T22: idolatria por clube (−100 a 100). Temperamento (6.17) e clube de coração (6.18) mudam o peso.
export type Idolatry = Record<string, number>;
type Temp = keyof typeof cfg.temperamento;

const clamp = (x: number) => Math.max(-100, Math.min(100, Math.round(x * 10) / 10));
const add = (s: Idolatry, club: string, delta: number): Idolatry => ({ ...s, [club]: clamp((s[club] ?? 0) + delta) });
/** Ganhos (positivos) passam pelo fator do temperamento: o Frio demora a conquistar a torcida. */
const gain = (delta: number, temp: string) => {
  const t = cfg.temperamento[temp as Temp] as { ganho?: number } | undefined;
  return delta > 0 ? delta * (t?.ganho ?? 1) : delta;
};

export const status = (v: number): 'idolo' | 'vilao' | 'neutro' =>
  v >= cfg.limites.idolo ? 'idolo' : v <= cfg.limites.vilao ? 'vilao' : 'neutro';

/** Semestre: minutos (0–1) × desempenho (−1 a 1). */
export const afterSemester = (s: Idolatry, club: string, minutes: number, perf: number, temp: string): Idolatry =>
  add(s, club, gain(minutes * perf * cfg.semestre.peso, temp));

/** Clássico: desempenho (−1 a 1). Esquentado amplifica nos dois sentidos; clube de coração vale o dobro. */
export function afterClassico(s: Idolatry, club: string, perf: number, temp: string, heart: string | null): Idolatry {
  const t = cfg.temperamento[temp as Temp] as { classico?: number } | undefined;
  const delta = perf * cfg.classico.peso * (t?.classico ?? 1) * (club === heart ? cfg.coracao.classico : 1);
  return add(s, club, gain(delta, temp));
}

/** Transferência: rival do clube antigo = vilão; rival do clube de coração = traição; chegar ao clube de coração = bônus. */
export function afterTransfer(s: Idolatry, from: string | null, to: string, heart: string | null): Idolatry {
  let out = s;
  if (from && areRivals(from, to)) out = { ...out, [from]: clamp(Math.min(out[from] ?? 0, 0) + cfg.irParaRival) };
  if (heart && to !== heart && areRivals(heart, to)) out = add(out, heart, cfg.coracao.traicao);
  if (heart && to === heart) out = add(out, heart, cfg.coracao.chegada);
  return out;
}
