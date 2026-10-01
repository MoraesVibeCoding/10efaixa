import raw from '../data/clubs.json';
import creation from '../data/creation.json';
import leagues from '../data/leagues.json';

// Seções 6.9 e 11: nomes reais, escudo estilizado (sigla + cores). Schema = tipo + validateClubs.
export interface Club {
  id: string; nome: string; sigla: string; uf: string; cidade: string;
  cores: [string, string]; reputacao: number; divisao: string; rivais: string[];
}

const HEX = /^#[0-9A-F]{6}$/i;
const isStr = (x: unknown): x is string => typeof x === 'string' && x.length > 0;

/** Lista de erros; vazia = válido. Rivalidade precisa existir e ser simétrica. */
export function validateClubs(data: unknown, states: string[]): string[] {
  if (!Array.isArray(data)) return ['clubes: esperado array'];
  const errors: string[] = [];
  const ids = new Set<string>();
  const siglas = new Set<string>();
  const divisions = Object.keys(leagues.leagues);
  const items = data.map((x: unknown) => (x ?? {}) as Record<string, unknown>);
  items.forEach((c, i) => {
    const at = `clube[${i}] ${String(c.id ?? '')}`;
    if (!isStr(c.id) || ids.has(c.id)) errors.push(`${at}: id ausente ou repetido`);
    else ids.add(c.id);
    if (!isStr(c.sigla) || !/^[A-Z]{3}$/.test(c.sigla) || siglas.has(c.sigla)) errors.push(`${at}: sigla (3 letras) ausente ou repetida`);
    else siglas.add(c.sigla);
    if (!isStr(c.nome) || !isStr(c.cidade)) errors.push(`${at}: nome/cidade ausente`);
    if (!states.includes(c.uf as string)) errors.push(`${at}: UF inválida`);
    if (!Array.isArray(c.cores) || c.cores.length !== 2 || !c.cores.every((x) => HEX.test(String(x)))) errors.push(`${at}: cores precisam ser 2 hex`);
    if (!Number.isInteger(c.reputacao) || (c.reputacao as number) < 1 || (c.reputacao as number) > 100) errors.push(`${at}: reputação fora de 1–100`);
    if (!divisions.includes(c.divisao as string)) errors.push(`${at}: divisão desconhecida`);
    if (!Array.isArray(c.rivais) || !c.rivais.every(isStr)) errors.push(`${at}: rivais inválido`);
  });
  const byId = new Map(items.filter((c) => isStr(c.id)).map((c) => [c.id as string, c]));
  for (const c of items) {
    for (const r of Array.isArray(c.rivais) ? (c.rivais as string[]) : []) {
      const other = byId.get(r);
      if (!other) errors.push(`${String(c.id)}: rival inexistente ${r}`);
      else if (!(other.rivais as string[] | undefined)?.includes(c.id as string)) errors.push(`${String(c.id)}: rivalidade com ${r} não é simétrica`);
    }
  }
  return errors;
}

const errors = validateClubs(raw.clubs, creation.states);
if (errors.length) throw new Error(`clubs.json inválido:\n${errors.join('\n')}`);

export const CLUBS = raw.clubs as Club[];
export const clubsIn = (div: string) => CLUBS.filter((c) => c.divisao === div);
export const areRivals = (a: string, b: string) => CLUBS.find((c) => c.id === a)?.rivais.includes(b) ?? false;
