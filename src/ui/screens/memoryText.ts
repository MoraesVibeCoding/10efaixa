import { memKey, type Memory } from '../../engine/memory';
import type { Params } from '../../i18n';
import { clubName } from './clubText';

// T25d (SPEC 6.13c): o passado no texto do evento. Para cada memória que aconteceu, {mem_<id>_ano}, {mem_<id>_anos} (desde a última
// vez) e {mem_<id>_clube}. Quem cita precisa exigir a memória na condição do evento (teste de citação em memory.test.ts).
export function memoryTextParams(memories: readonly Memory[], year: number): Params {
  const out: Params = {};
  const last = new Map<string, Memory>();
  for (const x of memories) if (!last.has(x.id) || x.year >= last.get(x.id)!.year) last.set(x.id, x);
  for (const [id, x] of last) {
    out[`mem_${memKey(id)}_ano`] = x.year;
    out[`mem_${memKey(id)}_anos`] = year - x.year;
    out[`mem_${memKey(id)}_clube`] = clubName(x.clubId).nome;
  }
  return out;
}
