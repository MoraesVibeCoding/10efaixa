import type { CareerResult } from './career';
import { CLUBS } from './clubs';
import { EUROPE } from './europe';
import europe from '../data/europe.json';
import idolatry from '../data/idolatry.json';
import cfg from '../data/story.json';

// T55b (SPEC 6.15, v2.31/v2.42): "Sua história" em frases, montada do resultado da carreira (a memória da T25d ainda não existe).
// O motor só diz o que aconteceu e quando; o texto sai do i18n (legacy.historia) na tela.
export type StoryInput = Pick<CareerResult, 'spells' | 'titles' | 'peakAge' | 'peakClubId' | 'endAge' | 'idolatry' | 'awards' | 'injuries' | 'farewell' | 'seasons'>
  & { origin: string; selection: Pick<CareerResult['selection'], 'caps' | 'tournaments'> };
export interface StoryBeat { id: string; age: number; clubId?: string; n?: number; competition?: string }

const BRAZIL = new Set(CLUBS.map((c) => c.id));
const EUROPEAN = new Set([...EUROPE.map((c) => c.id), ...europe.outros.clubs.map((c) => c.id)]);
const WEIGHTS = cfg.pesos as Record<string, number>;

export function storyOf(r: StoryInput): StoryBeat[] {
  const firstYear = r.seasons[0]?.year ?? 0;
  // a primeira temporada é jogada na idade do primeiro clube; o endAge já é o ano seguinte à última temporada
  const startAge = r.spells[0]?.fromAge ?? r.endAge - r.seasons.length;
  const ageAt = (year: number) => startAge + (year - firstYear);
  const beats: StoryBeat[] = [{ id: `inicio_${r.origin}`, age: startAge, clubId: r.spells[0]?.clubId }];

  const firstTitle = [...r.titles].sort((a, b) => a.year - b.year)[0];
  if (firstTitle) beats.push({ id: 'primeiroTitulo', age: ageAt(firstTitle.year), competition: firstTitle.competition });
  const abroad = r.spells.find((s) => !BRAZIL.has(s.clubId));
  if (abroad) beats.push({ id: EUROPEAN.has(abroad.clubId) ? 'europa' : 'exterior', age: abroad.fromAge, clubId: abroad.clubId });
  beats.push({ id: 'auge', age: r.peakAge, clubId: r.peakClubId });

  const best = r.awards.filter((a) => a.award === 'melhorDoMundo').sort((a, b) => a.year - b.year)[0];
  if (best) beats.push({ id: 'melhorDoMundo', age: ageAt(best.year) });
  const tours = [...r.selection.tournaments].sort((a, b) => a.year - b.year);
  if (r.selection.caps > 0) beats.push({ id: 'selecao', age: tours[0] ? ageAt(tours[0].year) : r.peakAge, n: r.selection.caps });
  const worldCups = tours.filter((t) => t.tournament === 'copaDoMundo');
  const won = worldCups.find((t) => t.stage === 'campeao');
  const hero = worldCups.find((t) => t.hero);
  if (won) beats.push({ id: 'campeaoMundial', age: ageAt(won.year), competition: 'copaDoMundo' });
  else if (hero) beats.push({ id: 'heroiMundial', age: ageAt(hero.year), competition: 'copaDoMundo' });

  for (const [clubId, v] of Object.entries(r.idolatry)) {
    if (v < idolatry.limites.idolo) continue;
    const years = r.seasons.filter((s) => s.clubId === clubId).map((s) => s.year);
    if (years.length) beats.push({ id: 'idolo', age: ageAt(Math.max(...years)), clubId, n: years.length });
  }
  if (r.injuries.grave > 0) beats.push({ id: 'lesoes', age: r.endAge, n: r.injuries.grave });

  // ordem estável por idade; a despedida fecha a história mesmo empatada em idade
  const sorted = beats.map((b, i) => [b, i] as const).sort(([a, i], [b, j]) => a.age - b.age || i - j).map(([b]) => b);
  return [...sorted, { id: r.farewell ? `despedida_${r.farewell}` : 'aposentadoria', age: r.endAge, clubId: r.spells.at(-1)?.clubId }];
}

/** Frases do cartão narrativo: as de maior peso (empate: a mais antiga), até `maxNoCartao`, de volta à ordem de idade. */
export function storyHighlights(story: StoryBeat[]): StoryBeat[] {
  const picked = new Set(story.map((b, i) => [b, i] as const)
    .sort(([a, i], [b, j]) => (WEIGHTS[b.id] ?? 0) - (WEIGHTS[a.id] ?? 0) || i - j)
    .slice(0, cfg.maxNoCartao).map(([b]) => b));
  return story.filter((b) => picked.has(b));
}
