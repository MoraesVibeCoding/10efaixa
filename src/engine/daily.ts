import { fnv1a } from './careerCode';

// T57a (SPEC 6.15, v2.49): semente do desafio do dia. Pura: quem chama passa a data (o motor nunca lê o relógio).
// O fuso é o de Brasília, UTC−3 fixo (o Brasil não tem horário de verão desde 2019), para todo mundo virar o dia junto.
const BRASILIA_OFFSET_MS = -3 * 60 * 60 * 1000;
const DAY_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** "AAAA-MM-DD" do instante no fuso de Brasília. */
export function dayKeyBR(instant: Date): string {
  return new Date(instant.getTime() + BRASILIA_OFFSET_MS).toISOString().slice(0, 10);
}

/** Semente de 32 bits (sem sinal) do dia "AAAA-MM-DD"; lança erro se a data não existe no calendário. */
export function dailySeed(day: string): number {
  const m = DAY_KEY.exec(day);
  const real = m ? new Date(Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!)).toISOString().slice(0, 10) : null;
  if (real !== day) throw new Error(`Data do desafio inválida: "${day}"`);
  return fnv1a(`10efaixa-diario-${day}`, 0x811c9dc5);
}
