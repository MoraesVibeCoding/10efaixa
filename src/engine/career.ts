import { ATTRIBUTES } from './attributes';
import { ARCHETYPES } from './archetypes';
import { CLUBS, clubsIn, rivalsOf } from './clubs';
import { semesterClubLife } from './clubLife';
import { FOREIGN, brazilQualifiers, copaDoBrasil, copaDoBrasilEntrants, copaDoNordeste, foreignQualifiers, libertadores, nordesteGroups, sulAmericana } from './cups';
import { evolveSemester, type EvoState } from './evolution';
import { afterClassico, afterSemester, afterTransfer, type Idolatry } from './idolatry';
import { staffMeeting } from './meeting';
import { minutesShare, squadLevel, updateForm, updateMorale, type Role } from './minutes';
import { overall } from './overall';
import { createPlayer, type CreationInput, type Player } from './player';
import { createPrng, type Prng } from './prng';
import { simulateSeason, type ClubInfo, type Div, type Divisions } from './season';
import { assignNumber, canGetArmband, canGetTen, rosterNumbers } from './shirt';
import { baseOffers, copinha, promotion, runPeneira, runVarzea } from './start';
import { initialStates, simulateStates, type StateWorld } from './states';
import { progressTraits, type TraitState } from './traits';
import cfg from '../data/career.json';
import cups from '../data/cups.json';

// T24b: uma carreira completa ligando todos os sistemas, ano a ano. Provisórios (T28 mercado, T34 aposentadoria) marcados.
export interface ClubSpell { clubId: string; fromAge: number; toAge: number; number: number; loan: boolean }
export interface Title { year: number; competition: string; clubId: string }
export interface CareerResult {
  player: Player; spells: ClubSpell[]; titles: Title[]; peakOverall: number; peakAge: number; endAge: number;
  wearsTen: boolean; captain: boolean; idolatry: Record<string, number>;
  seasons: { year: number; clubId: string; division: string | null; minutes: number; overall: number }[];
}

const REP = new Map<string, number>([...CLUBS.map((c) => [c.id, c.reputacao] as const), ...FOREIGN.map((c) => [c.id, c.reputacao] as const)]);
const UF = new Map(CLUBS.map((c) => [c.id, c.uf]));
const DIVS: Div[] = ['A', 'B', 'C', 'D'];
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const divisionOf = (d: Divisions, id: string) => DIVS.find((k) => d[k].includes(id)) ?? null;

function roleFor(ov: number, squad: number, age: number): Role {
  const rel = ov - squad;
  if (rel >= cfg.papel.titular) return 'titular';
  if (rel >= cfg.papel.rodizio) return 'rodizio';
  return age <= cfg.papel.promessaIdadeMax ? 'promessa' : 'reserva';
}

// ponytail: transferência provisória por nível até a T28 (mercado): sobe para o clube de nível mais próximo do overall.
function provisionalTransfer(ov: number, current: string): string | null {
  const t = cfg.transferenciaProvisoria;
  if (ov < squadLevel(REP.get(current)!) + t.margem) return null;
  const target = CLUBS.filter((c) => c.divisao !== null && c.reputacao > REP.get(current)!
    && Math.abs(squadLevel(c.reputacao) - ov) <= t.janela)
    .sort((a, b) => b.reputacao - a.reputacao || (a.id < b.id ? -1 : 1))[0];
  return target?.id ?? null;
}

export function simulateCareer(input: CreationInput, seed: number, startYear = 2026): CareerResult {
  const rng = createPrng(seed);
  const created = createPlayer(input, rng);
  if (!created.ok) throw new RangeError(`criação inválida: ${created.errors.join(', ')}`);
  const player = created.player;
  const arch = ARCHETYPES.find((a) => a.id === input.archetypeId)!;
  const ov = (s: EvoState) => overall(s.attributes, input.position, arch.overallWeightBonus);
  const [focusMain, focusSecond] = [...ATTRIBUTES].sort((a, b) => arch.distribution[b] - arch.distribution[a]);

  // Mundo
  let divs: Divisions = { A: clubsIn('A').map((c) => c.id), B: clubsIn('B').map((c) => c.id), C: clubsIn('C').map((c) => c.id), D: clubsIn('D').map((c) => c.id) };
  let states: StateWorld = initialStates();
  let holders = [cfg.campeoesContinentais2025.libertadores, cfg.campeoesContinentais2025.sulAmericana];
  let prevTable = [...divs.A].sort((a, b) => REP.get(b)! - REP.get(a)!);
  let prevCdb = { champion: prevTable[5]!, vice: prevTable[6]! };
  let prevChamps: string[] = [];
  let cdnGroups = cups.copaDoNordeste.participantes2026;

  // Jogador
  let evo: EvoState = {
    age: 16, attributes: player.attributes, baseCaps: player.baseCaps, caps: player.caps,
    predictedHeightCm: player.biotype.heightCm, growth: player.growth, build: player.biotype.build,
    originalBuild: player.biotype.build, buildPush: 0, growthBonus: player.growthBonus,
  };
  let traits: TraitState = { position: input.position, traits: [...arch.traits.slice(0, 1)], latentTrait: arch.latentTrait, progress: {} };
  let form = 0.5;
  let morale = 0.6;
  let coachRelation = 0.5;
  let salaryDelays = 0;
  let idol: Idolatry = {};
  const spells: ClubSpell[] = [];
  const titles: Title[] = [];
  const seasons: CareerResult['seasons'] = [];
  let peakOverall = ov(evo);
  let peakAge = 16;
  let wearsTen = false;
  let captain = false;
  let seasonsAtClub = 0;

  let clubId: string | null = null;
  let inYouth = false;
  let varzeaLeft = 0;
  let varzeaClub: string | null = null;
  let parent: string | null = null;
  let loanLeft = 0;
  let pendingMove: { id: string; loan: boolean } | null = null;

  const join = (id: string, loan: boolean, r: Prng) => {
    const from = clubId;
    clubId = id;
    seasonsAtClub = 0;
    idol = afterTransfer(idol, from, id, input.heartClub);
    spells.push({ clubId: id, fromAge: evo.age, toAge: evo.age, number: assignNumber(input.shirtNumber, rosterNumbers(r)), loan });
  };

  if (input.origin === 'baseGrande') {
    const offers = baseOffers({ state: input.state, heartClub: input.heartClub }, rng);
    join((offers.find((o) => o.heartClub) ?? offers[0]!).clubId, false, rng);
    inYouth = true;
  } else if (input.origin === 'peneira') {
    join(runPeneira({ state: input.state, startingOverall: player.startingOverall }, rng).clubId, false, rng);
  } else {
    const v = runVarzea({ state: input.state, startingOverall: player.startingOverall }, rng);
    varzeaLeft = v.semesters;
    varzeaClub = v.clubId;
  }

  for (let year = startYear, k = 0; evo.age < cfg.idadeFinalProvisoria; year++, k++) {
    const yr = createPrng(Math.imul(seed + 1, 0x9e3779b1) ^ Math.imul(k + 1, 0x85ebca6b));
    const ySeed = (seed * 1009 + k) >>> 0;

    // Base: Copinha em janeiro e promoção (17–20).
    if (inYouth && clubId) {
      const c = copinha(REP.get(clubId)!, ov(evo), yr);
      const p = promotion({ age: evo.age, overall: ov(evo), clubId, highlight: c.highlight });
      if (p.promoted) inYouth = false;
      else if (p.released) { inYouth = false; join(runPeneira({ state: input.state, startingOverall: ov(evo) }, yr).clubId, false, yr); }
    }

    // Temporada do mundo; o clube do jogador recebe o efeito dele.
    const boost = clubId && !inYouth
      ? clamp((ov(evo) - squadLevel(REP.get(clubId)!)) * cfg.impactoJogador.porPonto, 0, cfg.impactoJogador.max) : 0;
    const club: ClubInfo = (id) => ({ strength: (REP.get(id) ?? 50) + (id === clubId ? boost : 0), uf: UF.get(id) ?? '' });
    const season = simulateSeason(divs, club, ySeed);
    const st = simulateStates(states, club, ySeed);
    const cdb = copaDoBrasil(copaDoBrasilEntrants(divs.A, prevChamps), prevChamps, divs.A, club, ySeed);
    const cdn = copaDoNordeste(cdnGroups, club, ySeed);
    const br = brazilQualifiers(prevTable, prevCdb.champion, prevCdb.vice, holders);
    const fq = foreignQualifiers(yr, holders);
    const lib = libertadores({ groups: [...holders, ...fq.libGroups, ...br.libGroups], f2: [...fq.libF2, ...br.libF2], f1: fq.libF1 }, club, ySeed);
    const sud = sulAmericana({ groups: [...fq.sudGroups, ...br.sud], national: fq.sudNational }, lib.f3Losers, lib.thirds, club, ySeed);

    // Dois semestres do jogador.
    const seasonClub = clubId ?? varzeaClub!;
    const division = divisionOf(divs, seasonClub);
    const table = division ? season.phases[division][0]!.groups!.flat().map((r) => r.id) : [];
    const actualRank = Math.max(1, table.indexOf(seasonClub) + 1) || 10;
    const expectedRank = division ? [...divs[division]].sort((a, b) => REP.get(b)! - REP.get(a)!).indexOf(seasonClub) + 1 : 10;
    const teamResult = clamp((expectedRank - actualRank) / 10, -1, 1);
    let minutesSum = 0;

    for (let sem = 0; sem < 2; sem++) {
      let minutes: number;
      let role: Role = 'promessa';
      let staffQuality = 0.8;
      if (varzeaLeft > 0) {
        minutes = cfg.minutosBase;
      } else {
        const rep = REP.get(clubId!)!;
        staffQuality = clamp(0.8 + (rep / 100) * 0.4, 0.8, 1.2);
        role = roleFor(ov(evo), squadLevel(rep), evo.age);
        minutes = inYouth ? cfg.minutosBase : minutesShare({ overall: ov(evo), clubRep: rep, role, form }, yr);
        form = updateForm(form, ov(evo), rep, yr);
      }
      morale = updateMorale(morale, minutes, role, teamResult);
      const clubNeed = ATTRIBUTES[yr.int(0, ATTRIBUTES.length - 1)]!;
      const { focus } = staffMeeting({ proposal: { main: focusMain!, secondary: focusSecond! }, morale, coachRelation, nationalTeamStatus: 0, clubNeed });
      evo = evolveSemester(evo, { focus, staffQuality, minutes, morale }, yr);
      const tr = progressTraits(traits, focus);
      traits = { position: tr.position, traits: tr.traits, latentTrait: tr.latentTrait, progress: tr.progress };

      if (varzeaLeft > 0) {
        if (--varzeaLeft === 0) join(varzeaClub!, false, yr);
      } else if (!inYouth && clubId) {
        minutesSum += minutes;
        const perf = clamp(form * 2 - 1, -1, 1);
        idol = afterSemester(idol, clubId, minutes, perf, input.temperament);
        const div = divisionOf(divs, clubId);
        if (div && rivalsOf(clubId).some((r) => divs[div].includes(r))) {
          idol = afterClassico(idol, clubId, clamp(perf + (yr.next() * 2 - 1) * 0.5, -1, 1), input.temperament, input.heartClub);
        }
        const life = semesterClubLife({ clubId, coachRelation, salaryDelays, age: evo.age, minutes, expectedRank, actualRank }, yr);
        coachRelation = life.coachRelation;
        salaryDelays = life.salaryDelays;
        if (life.loanOffer && !parent && !pendingMove) pendingMove = { id: life.loanOffer, loan: true };
      }
      const o = ov(evo);
      if (o > peakOverall) { peakOverall = o; peakAge = evo.age; }
      if (spells.length) spells.at(-1)!.toAge = evo.age;
    }

    // Títulos do clube do jogador com minutos suficientes.
    const avgMinutes = minutesSum / 2;
    if (clubId && clubId === seasonClub && avgMinutes >= cfg.minutosParaTitulo) {
      const won = (competition: string, champ: string) => { if (champ === clubId) titles.push({ year, competition, clubId: clubId! }); };
      if (division) won(`serie${division}`, season.champions[division]);
      const uf = UF.get(clubId)!;
      if (st.champions[uf]) won('estadual', st.champions[uf]!);
      won('copaDoBrasil', cdb.champion);
      won('copaDoNordeste', cdn.champion);
      won('libertadores', lib.champion);
      won('sulAmericana', sud.champion);
    }
    seasons.push({ year, clubId: seasonClub, division, minutes: avgMinutes, overall: ov(evo) });

    // Camisa 10 e faixa do clube por evento.
    if (clubId && !inYouth) {
      seasonsAtClub++;
      const squad = squadLevel(REP.get(clubId)!);
      const idolatry = idol[clubId] ?? 0;
      if (canGetTen({ overall: ov(evo), squadLevel: squad, idolatry })) wearsTen = true;
      if (canGetArmband({ overall: ov(evo), squadLevel: squad, idolatry, age: evo.age, seasonsAtClub, temperament: input.temperament })) captain = true;
    }

    // Fim de temporada: volta de empréstimo, empréstimo aceito ou transferência provisória.
    if (parent && --loanLeft <= 0) { const back = parent; parent = null; join(back, false, yr); }
    else if (pendingMove) {
      if (pendingMove.loan) { parent = clubId; loanLeft = cfg.emprestimoTemporadas; }
      join(pendingMove.id, pendingMove.loan, yr);
    } else if (clubId && !inYouth && !parent) {
      const target = provisionalTransfer(ov(evo), clubId);
      if (target) join(target, false, yr);
    }
    pendingMove = null;

    // Mundo do ano seguinte.
    prevTable = season.phases.A[0]!.groups![0]!.map((r) => r.id);
    prevCdb = { champion: cdb.champion, vice: cdb.runnerUp };
    prevChamps = [cdn.champion, season.champions.C, season.champions.D];
    holders = [lib.champion, sud.champion];
    divs = season.next;
    states = st.next;
    cdnGroups = nordesteGroups(yr);
  }

  return { player, spells, titles, peakOverall, peakAge, endAge: evo.age, wearsTen, captain, idolatry: idol, seasons };
}
