import { ATTRIBUTES, type Attributes } from './attributes';
import { agentSemester, changeAgent, createAgent, type Agent } from './agent';
import { ARCHETYPES } from './archetypes';
import { CLUBS, clubsIn, rivalsOf } from './clubs';
import { semesterClubLife } from './clubLife';
import { investmentReturn, leaderEffects, matureTemperament, offFieldFlags, semesterCards } from './discipline';
import { addToWealth, makeContract, renew, seasonEarnings, toBRL, type Contract } from './contracts';
import { brazilQualifiers, copaDoBrasil, copaDoBrasilEntrants, copaDoNordeste, foreignQualifiers, libertadores, nordesteGroups, sulAmericana } from './cups';
import { EUROPE, areEuroRivals, effectiveRep } from './europe';
import { initialEuroTables, simulateEuropeSeason, type EuroTables } from './europeSeason';
import { applyOption, autoChoice } from './events';
import { callUp, coachFor, isPrincipal, selectionEffect, updatePrestige, visibility, type CallUp, type Rung } from './nationalTeam';
import { evolveSemester, type EvoState, type Focus } from './evolution';
import { projectValue, salaryChange, valueChange } from './contractCard';
import { semesterFeedback, type Feedback } from './feedback';
import { mentalityEffects } from './mentality';
import { afterClassico, afterSemester, afterTransfer, type Idolatry } from './idolatry';
import { decayRelapse, graveDecision, semesterInjury } from './injuries';
import { FORCE_EXIT, generateOffers, negotiate, rankOffers, leagueOf, marketValue, salaryFor, type Offer } from './market';
import { MEETING_EVENT, autoProposal, encodeProposal, meetingScore, parseProposal, staffMeeting, type MeetingResult } from './meeting';
import { MEETING_IDEAS, TRUST, drawClubNeed, ideaOf, meetingOptions, type Idea, type MeetingOptions } from './meetingOptions';
import { clubLevelBand, minutesShare, roleFor, squadLevel, updateForm, updateMorale, type Role } from './minutes';
import { overall, type Position } from './overall';
import { coachProposal } from './positionChange';
import { createPlayer, type CreationInput, type Player } from './player';
import { createPrng, type Prng } from './prng';
import { TOURNAMENTS, eligible, playTournament, type NTournament } from './tournaments';
import { isEditionYear } from './calendar';
import tcfg from '../data/nationalTournaments.json';
import { cutOffset, invited, residenceCountry, teamName, teamStrength } from './dualNationality';
import dual from '../data/dualNationality.json';
import { seasonAwards, type Award } from './awards';
import { ZERO_STATS, addStats, seasonStats, type SeasonStats } from './stats';
import { headlineOf } from './headline';
import { legacyOf, type Legacy } from './legacy';
import { honorFacts, honorsOf } from './honors';
import { generateNickname } from './nickname';
import { PROPOSAL_EVENT, RAISE, RENEW, STAY, acceptChoice, loveChoice, parseProposalChoice, proposalViewOf, type CurrentClubView, type ProposalView } from './proposals';
import { farewellOffer, retirementCheck, type RetireReason } from './retirement';
import { simulateSeason, type ClubInfo, type Div, type Divisions, type Row } from './season';
import { assignNumber, canGetArmband, canGetTen, rosterNumbers } from './shirt';
import { baseOffers, copinha, promotion, runPeneira, runVarzea } from './start';
import { initialStates, simulateStates, type StateWorld } from './states';
import { progressTraits, type TraitState } from './traits';
import cfg from '../data/career.json';
import cups from '../data/cups.json';
import europe from '../data/europe.json';

// T24b: uma carreira completa ligando todos os sistemas, ano a ano. A aposentadoria ainda é provisória (T34).
export interface ClubSpell { clubId: string; fromAge: number; toAge: number; number: number; loan: boolean }
export interface Title { year: number; competition: string; clubId: string }
export interface CareerResult {
  player: Player; spells: ClubSpell[]; titles: Title[]; peakOverall: number; peakAge: number; endAge: number;
  /** T55a: o auge revelado no cartão final (atributos e clube) e as honrarias. */
  peakAttributes: Attributes; peakClubId: string; honors: string[];
  wearsTen: boolean; captain: boolean; idolatry: Record<string, number>;
  wealthBRL: number; agentProfile: string; contracts: number;
  injuries: { leve: number; media: number; grave: number };
  finalPosition: Position; positionChanges: number;
  /** Seleção: semestres convocado por degrau; caps = convocações para a principal. */
  selection: { callUps: Record<Exclude<Rung, 'nenhum'>, number>; caps: number; ten: number; captain: number;
    tournaments: { year: number; tournament: NTournament; team: string; stage: string; hero: boolean; villain: boolean }[];
    /** Dupla nacionalidade (T38): seleção defendida e a resposta ao convite. */
    nationality: string; dual: 'aceitou' | 'recusou' | null; oriundoCampeao: boolean; esperouOBrasil: boolean;
  };
  /** Números da carreira e prêmios individuais (T39). */
  stats: SeasonStats; awards: { year: number; award: Award }[];
  /** Tudo o que entrou no bolso (antes de gastos e perdas) e clássicos decisivos — usados pelos rótulos (T40). */
  earnedBRL: number; decisiveDerbies: number;
  legacy: Legacy;
  /** T41: apelido dado pelo jogo, manchete séria e comentário com zoeira. */
  nickname: string; headline: string; comment: string;
  retirement: RetireReason; farewell: 'formador' | 'coracao' | null;
  cards: { yellows: number; reds: number }; finalTemperament: string; houseBought: boolean; discipline: number;
  /** `age` (v2.51): idade em que jogou a temporada (a de `evo.age` já avançou um ano ao registrar); para a linha do tempo. */
  /** T28e (v2.50): as vezes em que o empresário negociou uma proposta, e como terminou. */
  negotiations: { year: number; clubId: string; result: 'melhorou' | 'igual' | 'sumiu' }[];
  /** T28e: saídas forçadas (antes do fim do contrato) e se o jogador virou vilão da torcida do clube que deixou. */
  forcedExits: { year: number; fromClubId: string; toClubId: string; villain: boolean }[];
  seasons: { year: number; age: number; clubId: string; division: string | null; minutes: number; overall: number }[];
}

/** T51: o momento de uma decisão, para a tela mostrar o jogador como ele está ali. */
export interface DecisionView {
  year: number; age: number; clubId: string | null; position: Position; overall: number; role: Role; temperament: string;
  /** Valor de mercado em € (v2.33): a regra do mercado, com o efeito Seleção. */
  marketValueEUR: number;
  /** Salário do mês pelo contrato atual (sem contrato, na várzea: zero). */
  monthlySalary: { amount: number; currency: 'BRL' | 'EUR' };
  /** Número da camisa no clube atual. */
  number: number;
  /** Atributos de agora; a tela mostra só em faixas (CLAUDE.md). */
  attributes: EvoState['attributes'];
  /** Estado que o evento lê e muda (moral, idolatria, patrimônio...), já com o que aconteceu neste semestre. */
  state: Record<string, number | string | boolean>;
  seasons: CareerResult['seasons']; titles: Title[];
  /** T52: as reuniões com a comissão até agora (ano, semestre e resposta); a tela mostra a resposta da que o jogador fez. */
  meetings: ({ year: number; semestre: 1 | 2; ideia?: Idea } & MeetingResult)[];
  /** T52c (v2.53): na decisão da reunião, as 3 ideias (óbvia, mescla, ousada); a escolha é uma delas. */
  reuniao?: MeetingOptions;
  /** T51b: o último semestre fechado e o que mais mudou nele (até 2 frases, sem número). */
  ultimoSemestre?: { year: number; semestre: 1 | 2; frases: Feedback[] };
  /** T51b: idolatria (−100 a 100) em cada clube por onde passou; a tela mostra só a faixa. */
  idolatrias: Record<string, number>;
  /** T28b (v2.50): na decisão `proposta-clube`, as até 3 propostas mostradas (a escolha é "aceitar:<clube>" ou "ficar"). */
  propostas?: ProposalView[];
  /** T28j (v2.54): o clube atual como primeiro cartão da tela de propostas, com a renovação quando o contrato acaba. */
  atual?: CurrentClubView;
  /** Seleção que o jogador defende agora ("brasil" ou o país da dupla nacionalidade aceita): a camisa nos eventos da Seleção (v2.37). */
  nationality: string;
}
/** Quem decide: o temperamento (simulação, ritmo Rápido) ou o jogador (tela). `view` só é montada se pedida. */
export type Decider = (eventId: string, temperament: string, view: () => DecisionView) => string;
/** Decisão automática (simulação e eventos fora da tela): na reunião, a sugestão do preparador; nos eventos, o temperamento. */
export const autoDecide: Decider = (eventId, temperament, view) => (eventId === MEETING_EVENT || eventId === PROPOSAL_EVENT ? String(view().state.sugestao) : autoChoice(eventId, temperament));
const AUTO = autoDecide;

const UF = new Map(CLUBS.map((c) => [c.id, c.uf]));
const BRAZIL = new Set(CLUBS.map((c) => c.id));
const EURO_LEAGUE = new Map(EUROPE.map((c) => [c.id, c.liga]));
const UEFA_POOL = new Set(europe.outros.clubs.map((c) => c.id));
const DIVS: Div[] = ['A', 'B', 'C', 'D'];
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const divisionOf = (d: Divisions, id: string) => DIVS.find((k) => d[k].includes(id)) ?? null;

export function simulateCareer(input: CreationInput, seed: number, startYear = 2026, decide: Decider = AUTO): CareerResult {
  const rng = createPrng(seed);
  const created = createPlayer(input, rng);
  if (!created.ok) throw new RangeError(`criação inválida: ${created.errors.join(', ')}`);
  const player = created.player;
  const arch = ARCHETYPES.find((a) => a.id === input.archetypeId)!;
  let temp = input.temperament; // pode amadurecer (T33)
  let position: Position = input.position;
  let positionChanges = 0;
  // O bônus de peso do arquétipo só vale na posição de origem (6.6: depois vira "estilo de origem").
  const ov = (s: EvoState) => overall(s.attributes, position, position === input.position ? arch.overallWeightBonus : undefined);

  // Mundo
  let divs: Divisions = { A: clubsIn('A').map((c) => c.id), B: clubsIn('B').map((c) => c.id), C: clubsIn('C').map((c) => c.id), D: clubsIn('D').map((c) => c.id) };
  let states: StateWorld = initialStates();
  let holders = [cfg.campeoesContinentais2025.libertadores, cfg.campeoesContinentais2025.sulAmericana];
  let prevTable = [...divs.A].sort((a, b) => effectiveRep(b) - effectiveRep(a));
  let prevCdb = { champion: prevTable[5]!, vice: prevTable[6]! };
  let prevChamps: string[] = [];
  let cdnGroups = cups.copaDoNordeste.participantes2026;
  let euroTables: EuroTables = initialEuroTables();

  // Jogador
  let evo: EvoState = {
    age: 16, attributes: player.attributes, baseCaps: player.baseCaps, caps: player.caps,
    predictedHeightCm: player.biotype.heightCm, growth: player.growth, build: player.biotype.build,
    originalBuild: player.biotype.build, buildPush: 0, growthBonus: player.growthBonus, ...mentalityEffects(input.mentality).evo,
  };
  let traits: TraitState = { position: input.position, traits: [...arch.traits.slice(0, 1)], latentTrait: arch.latentTrait, progress: {} };
  let agent: Agent = createAgent((cfg.empresarioPorTemperamento as Record<string, string>)[temp] ?? 'agenteLocal', rng);
  let form = 0.5;
  let morale = 0.6;
  let coachRelation = 0.5;
  let salaryDelays = 0;
  let idol: Idolatry = {};
  let wealth = 0;
  let contract: Contract | null = null;
  let contractOverall = 0;
  let contracts = 0;
  const spells: ClubSpell[] = [];
  const titles: Title[] = [];
  const seasons: CareerResult['seasons'] = [];
  let peakOverall = ov(evo);
  let peakAge = 16;
  let peakAttributes = { ...evo.attributes };
  let peakClubId: string | null = null;
  let wearsTen = false;
  let captain = false;
  let seasonsAtClub = 0;
  const injuries = { leve: 0, media: 0, grave: 0 };
  let relapseRisk = 0;
  let outLeft = 0; // semestres ainda fora por lesão grave
  const cards = { yellows: 0, reds: 0 };
  let suspended = 0; // fração de minutos perdida por suspensão no próximo semestre
  let discipline = 0.6;
  let houseBought = false;
  const physical = (e: EvoState) => (e.attributes.velocidade + e.attributes.fisico) / 2;
  let peakPhysical = physical(evo);
  let retirement: RetireReason = 'idadeLimite';
  let farewell: CareerResult['farewell'] = null;
  let farewellAsked = false;
  let sel: CallUp = { rung: 'nenhum', ten: false, captain: false };
  let prestige = 0;
  const selection: CareerResult['selection'] = { callUps: { sub17: 0, sub20: 0, olimpica: 0, lista: 0, reserva: 0, titular: 0 }, caps: 0, ten: 0, captain: 0, tournaments: [], nationality: 'brasil', dual: null, oriundoCampeao: false, esperouOBrasil: false };
  const heritage = player.dualNationality; // sorteada na criação (6.1); também pode ser descoberta por residência
  let nation: string | null = null; // null = Brasil
  let stats: SeasonStats = ZERO_STATS;
  let earned = 0;
  let decisiveDerbies = 0;
  let curYear = startYear;
  let curRole: Role = 'jovemPromessa';
  const meetings: DecisionView['meetings'] = [];
  let ultimoSemestre: DecisionView['ultimoSemestre'];
  /** Toda decisão passa por aqui (T51): o padrão é a escolha do temperamento, como antes. */
  const ask = (eventId: string, state: Record<string, number | string | boolean> = {}, who = temp, extra: Pick<DecisionView, 'propostas' | 'reuniao' | 'atual'> = {}) => decide(eventId, who, () => ({
    ...extra,
    year: curYear, age: evo.age, clubId, position, overall: ov(evo), role: curRole, temperament: who,
    marketValueEUR: Math.round(marketValue(ov(evo), evo.age) * selectionEffect(prestige, sel, sel.rung).marketMultiplier),
    monthlySalary: contract ? { amount: Math.round(contract.annualSalary / 12), currency: contract.currency } : { amount: 0, currency: 'BRL' },
    number: spells.at(-1)?.number ?? input.shirtNumber, attributes: { ...evo.attributes },
    state: {
      moral: morale, disciplina: discipline, relacaoTecnico: coachRelation, patrimonio: wealth, salarioFator: 1,
      idolatria: clubId ? idol[clubId] ?? 0 : 0, idolatriaCoracao: input.heartClub ? idol[input.heartClub] ?? 0 : 0, ...state,
    },
    seasons: [...seasons], titles: [...titles], nationality: selection.nationality, meetings: [...meetings], idolatrias: { ...idol }, ...(ultimoSemestre && { ultimoSemestre }),
  }));
  const earn = (amount: number, currency: Contract['currency']) => { const before = wealth; wealth = addToWealth(wealth, amount, currency, agent); earned += Math.max(0, wealth - before); };
  const awards: CareerResult['awards'] = [];
  const negotiations: CareerResult['negotiations'] = [];
  const forcedExits: CareerResult['forcedExits'] = [];

  let clubId: string | null = null;
  let inYouth = false;
  let varzeaLeft = 0;
  let varzeaClub: string | null = null;
  let parent: string | null = null;
  let loanLeft = 0;
  let loanTarget: string | null = null;

  const divOf = (id: string) => divisionOf(divs, id);
  const sign = (id: string, annualSalary: number, years: number) => {
    contract = makeContract({ clubId: id, annualSalary, years, agent });
    contractOverall = ov(evo);
    contracts++;
    earn(contract.signingBonus, contract.currency);
  };
  const join = (id: string, loan: boolean, r: Prng, offer?: Offer) => {
    const from = clubId;
    clubId = id;
    seasonsAtClub = 0;
    idol = afterTransfer(idol, from, id, input.heartClub);
    spells.push({ clubId: id, fromAge: evo.age, toAge: evo.age, number: assignNumber(input.shirtNumber, rosterNumbers(r)), loan });
    if (loan) return;
    if (offer) sign(id, offer.annualSalary, offer.years);
    else sign(id, salaryFor(marketValue(ov(evo), evo.age), leagueOf(id, divOf)), 2);
  };

  if (input.origin === 'baseGrande') {
    const offers = baseOffers({ state: input.state, heartClub: input.heartClub }, rng);
    join((offers.find((o) => o.heartClub) ?? offers[0]!).clubId, false, rng);
    inYouth = true;
  } else if (input.origin === 'peneira') {
    join(runPeneira({ state: input.state, startingOverall: player.startingOverall }, rng).clubId, false, rng);
    inYouth = true; // aprovado na peneira aos 16: entra na base do clube, como na base de clube grande
  } else {
    const v = runVarzea({ state: input.state, startingOverall: player.startingOverall }, rng);
    varzeaLeft = v.semesters;
    varzeaClub = v.clubId;
  }

  for (let year = startYear, k = 0; ; year++, k++) {
    curYear = year;
    const yr = createPrng(Math.imul(seed + 1, 0x9e3779b1) ^ Math.imul(k + 1, 0x85ebca6b));
    const ySeed = (seed * 1009 + k) >>> 0;

    // Base: Copinha em janeiro e promoção (17–20).
    if (inYouth && clubId) {
      const c = copinha(effectiveRep(clubId), ov(evo), yr);
      const p = promotion({ age: evo.age, overall: ov(evo), clubId, highlight: c.highlight });
      if (p.promoted) inYouth = false;
      else if (p.released) { inYouth = false; join(runPeneira({ state: input.state, startingOverall: ov(evo) }, yr).clubId, false, yr); }
    }

    // Temporada do mundo; o clube do jogador recebe o efeito dele.
    const boost = clubId && !inYouth
      ? clamp((ov(evo) - squadLevel(effectiveRep(clubId))) * cfg.impactoJogador.porPonto, 0, cfg.impactoJogador.max) : 0;
    const club: ClubInfo = (id) => ({ strength: effectiveRep(id) + (id === clubId ? boost : 0), uf: UF.get(id) ?? '' });
    const season = simulateSeason(divs, club, ySeed);
    const st = simulateStates(states, club, ySeed);
    const cdb = copaDoBrasil(copaDoBrasilEntrants(divs.A, prevChamps), prevChamps, divs.A, club, ySeed);
    const cdn = copaDoNordeste(cdnGroups, club, ySeed);
    const br = brazilQualifiers(prevTable, prevCdb.champion, prevCdb.vice, holders);
    const fq = foreignQualifiers(yr, holders);
    const lib = libertadores({ groups: [...holders, ...fq.libGroups, ...br.libGroups], f2: [...fq.libF2, ...br.libF2], f1: fq.libF1 }, club, ySeed);
    const sud = sulAmericana({ groups: [...fq.sudGroups, ...br.sud], national: fq.sudNational }, lib.f3Losers, lib.thirds, club, ySeed);
    // Europa: simulação média, só quando o jogador está lá.
    const seasonClub = clubId ?? varzeaClub!;
    const inEurope = EURO_LEAGUE.has(seasonClub) || UEFA_POOL.has(seasonClub);
    const eu = inEurope ? simulateEuropeSeason(euroTables, club, ySeed) : null;
    if (eu) euroTables = eu.next;

    // Classificação do clube do jogador na liga dele.
    const league = leagueOf(seasonClub, divOf);
    const division = divOf(seasonClub);
    const tableRows: Row[] = division ? season.phases[division][0]!.groups!.flat()
      : eu && EURO_LEAGUE.has(seasonClub) ? eu.leagues[EURO_LEAGUE.get(seasonClub)!]! : [];
    const table = tableRows.map((r) => r.id);
    const actualRank = table.includes(seasonClub) ? table.indexOf(seasonClub) + 1 : 10;
    const expectedRank = table.length ? [...table].sort((a, b) => effectiveRep(b) - effectiveRep(a)).indexOf(seasonClub) + 1 : 10;
    const wins = tableRows.find((r) => r.id === seasonClub)?.wins ?? cfg.ligaSimplificada.vitorias;
    const teamResult = clamp((expectedRank - actualRank) / 10, -1, 1);
    let minutesSum = 0;
    let worldCup: { stage: string; titular: boolean; hero: boolean } | null = null;
    let wantsOut = false;

    for (let sem = 0; sem < 2; sem++) {
      let minutes: number;
      let role: Role = 'jovemPromessa';
      let staffQuality = 0.8;
      if (varzeaLeft > 0) {
        minutes = cfg.minutosBase;
      } else {
        const rep = effectiveRep(clubId!);
        staffQuality = clamp(0.8 + (rep / 100) * 0.4, 0.8, 1.2);
        role = roleFor(ov(evo), rep, evo.age);
        curRole = role;
        minutes = inYouth ? cfg.minutosBase : minutesShare({ overall: ov(evo), clubRep: rep, role, form }, yr);
        form = updateForm(form, ov(evo), rep, yr);
      }
      // Efeito Seleção (6.11): prestígio dá minutos, peso na reunião e Mental; convocação ativa desgasta.
      const fx = selectionEffect(prestige, sel, sel.rung);
      if (varzeaLeft === 0 && !inYouth) minutes = clamp(minutes + fx.clubMinutes, 0, 1);
      morale = updateMorale(morale, minutes, role, teamResult);
      // T52c: com as 3 ideias, o clube precisa do que a posição pede (mesma quantidade de sorteios); antes, de qualquer um dos 10
      const clubNeed = MEETING_IDEAS ? drawClubNeed(position, yr) : ATTRIBUTES[yr.int(0, ATTRIBUTES.length - 1)]!;
      // T52: com clube, a reunião passa por quem decide (tela ou automática); a sugestão é a proposta automática
      const suggestion = autoProposal(evo.attributes, evo.caps, position, evo.age);
      let proposal: { main: Focus; secondary: Focus } = suggestion;
      const ideas = MEETING_IDEAS && clubId
        ? meetingOptions({ position, attrs: evo.attributes, caps: evo.caps, age: evo.age, score: meetingScore({ morale, coachRelation, nationalTeamStatus: fx.meetingStatus }) })
        : undefined;
      if (clubId) {
        const said = ask(MEETING_EVENT, { sugestao: encodeProposal(suggestion), semestre: sem + 1 }, temp, ideas ? { reuniao: ideas } : {});
        const parsed = parseProposal(said);
        if (!parsed) throw new RangeError(`proposta de reunião inválida: "${said}"`);
        proposal = parsed;
      }
      const meeting = staffMeeting({ proposal, morale, coachRelation, nationalTeamStatus: fx.meetingStatus, clubNeed });
      // T52c: a confiança do técnico muda com a ideia aceita (óbvia sobe, ousada desce) e com a contraproposta; recusa não muda
      const ideia = ideas ? ideaOf(ideas, proposal.main, proposal.secondary) : null;
      if (ideas) {
        if (meeting.response === 'aceita' && ideia) coachRelation = clamp(coachRelation + TRUST[ideia], 0, 1);
        else if (meeting.response === 'contrapropoe') coachRelation = clamp(coachRelation + TRUST.contraproposta, 0, 1);
      }
      if (clubId) meetings.push({ year: curYear, semestre: (sem + 1) as 1 | 2, ...meeting, ...(ideia && { ideia }) });
      const { focus, injuryRiskMultiplier } = meeting;
      // Lesões: tempo fora de uma grave anterior, depois o sorteio do semestre (só no profissional).
      if (outLeft > 0) { minutes *= 1 - Math.min(1, outLeft); outLeft = Math.max(0, outLeft - 1); }
      else if (!inYouth && varzeaLeft === 0) {
        const inj = semesterInjury({ age: evo.age, build: evo.build, minutes, riskMultiplier: injuryRiskMultiplier * fx.injuryRisk, relapseRisk }, yr);
        if (inj.severity !== 'nenhuma') {
          injuries[inj.severity]++;
          minutes *= 1 - inj.minutesLost;
          if (inj.severity === 'grave') {
            const d = graveDecision(ask('lesao-grave'));
            outLeft = Math.max(0, d.semestersOut - 1);
            relapseRisk = d.relapseRisk;
            const attrs = { ...evo.attributes };
            for (const a of d.attributes as (keyof typeof attrs)[]) attrs[a] = Math.max(1, attrs[a] - d.physicalLoss);
            evo = { ...evo, attributes: attrs };
          }
        }
      }
      relapseRisk = decayRelapse(relapseRisk);
      if (suspended > 0) { minutes *= 1 - Math.min(1, suspended); suspended = 0; }
      const leader = leaderEffects(temp, teamResult);
      evo = { ...evo, growthBonus: { ...player.growthBonus, mental: (player.growthBonus.mental ?? 1) * leader.mentalBonus * fx.mentalBonus } };
      coachRelation = clamp(coachRelation + leader.relationDelta, 0, 1);
      const antes = evo.attributes;
      evo = evolveSemester(evo, { focus, staffQuality, minutes, morale }, yr);
      ultimoSemestre = { year: curYear, semestre: (sem + 1) as 1 | 2, frases: semesterFeedback(antes, evo.attributes) };
      const tr = progressTraits(traits, focus);
      traits = { position: tr.position, traits: tr.traits, latentTrait: tr.latentTrait, progress: tr.progress };

      if (varzeaLeft > 0) {
        if (--varzeaLeft === 0) join(varzeaClub!, false, yr);
      } else if (!inYouth && clubId) {
        minutesSum += minutes;
        const perf = clamp(form * 2 - 1, -1, 1);
        idol = afterSemester(idol, clubId, minutes, perf, temp);
        const hasDerby = division ? rivalsOf(clubId).some((r) => divs[division].includes(r)) : table.some((id) => areEuroRivals(clubId!, id));
        if (hasDerby) {
          const derby = clamp(perf + (yr.next() * 2 - 1) * 0.5, -1, 1);
          idol = afterClassico(idol, clubId, derby, temp, input.heartClub);
          if (derby >= 0.5) decisiveDerbies++;
        }

        const life = semesterClubLife({ clubId, coachRelation, salaryDelays, age: evo.age, minutes, expectedRank, actualRank }, yr);
        coachRelation = life.coachRelation;
        salaryDelays = life.salaryDelays;
        if (life.canRequestLeave && ask('salario-atrasado') === 'pedir-saida') wantsOut = true;
        if (life.loanOffer && !parent && !loanTarget) loanTarget = life.loanOffer;

        // Disciplina: cartões pelo temperamento; suspensão tira minutos do próximo semestre.
        const cd = semesterCards({ temperament: temp, minutes }, yr);
        cards.yellows += cd.yellows;
        cards.reds += cd.reds;
        suspended = cd.minutesLost;
        // Vida fora de campo: dilemas resolvidos pela política do temperamento, com efeitos do catálogo.
        const flags = offFieldFlags({ temperament: temp, wealthBRL: wealth, houseBought }, yr);
        let st8 = { moral: morale, disciplina: discipline, idolatria: idol[clubId] ?? 0, relacaoTecnico: coachRelation, patrimonio: wealth, casaComprada: houseBought, investir: false } as Record<string, number | string | boolean>;
        if (flags.conviteFesta) st8 = applyOption(st8, 'festa', ask('festa', st8));
        if (flags.polemica) st8 = applyOption(st8, 'polemica-redes', ask('polemica-redes', st8));
        if (flags.podeComprarCasa) st8 = applyOption(st8, 'casa-da-familia', ask('casa-da-familia', st8));
        if (flags.conviteInvestir) st8 = applyOption(st8, 'investir', ask('investir', st8));
        // Amadurecimento do temperamento por idade ou suspensão longa (evento narrado).
        const matured = matureTemperament(temp, evo.age, cd.longSuspension);
        if (matured !== temp) { temp = matured; st8 = applyOption(st8, 'amadurecimento', ask('amadurecimento', st8, matured)); }
        morale = st8.moral as number;
        discipline = st8.disciplina as number;
        coachRelation = clamp((st8.relacaoTecnico as number) - (discipline < 0.3 ? 0.03 : 0), 0, 1);
        idol = { ...idol, [clubId]: st8.idolatria as number };
        houseBought = st8.casaComprada as boolean;
        wealth = Math.round(st8.patrimonio as number);
        if (st8.investir) wealth = Math.max(0, wealth + investmentReturn(wealth, yr));

        // Empresário: no máximo um evento por semestre, resolvido pela política do temperamento.
        const ag = agentSemester(agent, yr);
        if (ag.event === 'someDinheiro') {
          wealth = Math.max(0, Math.round(wealth * (1 - ag.moneyLossFraction)));
          if (ask('empresario-some-dinheiro') === 'trocar-empresario') {
            const ch = changeAgent(wealth, 'agenteLocal', yr);
            agent = ch.agent; wealth -= ch.cost; morale = clamp(morale + ch.moraleDelta, 0, 1);
          }
        } else if (ag.event === 'brigaClube') {
          coachRelation = applyOption({ relacaoTecnico: coachRelation }, 'empresario-briga-clube', ask('empresario-briga-clube')).relacaoTecnico as number;
        } else if (ag.event === 'forcaVenda') {
          const choice = ask('empresario-forca-venda');
          if (choice === 'aceitar-venda') wantsOut = true;
          else if (choice === 'trocar-empresario') {
            const ch = changeAgent(wealth, 'paiTio', yr);
            agent = ch.agent; wealth -= ch.cost; morale = clamp(morale + ch.moraleDelta, 0, 1);
          }
        }
      }
      // Convocação do semestre: segue a nota de visibilidade (sem clube, na várzea, não há convocação).
      if (clubId && varzeaLeft === 0) {
        const vis = visibility({ overall: ov(evo), form, minutes, league: leagueOf(clubId, divOf), reputation: effectiveRep(clubId), position }, coachFor(year, seed));
        const call = () => callUp({ age: evo.age, visibility: vis, position, caps: selection.caps, cutOffset: nation ? cutOffset(nation) : 0 });
        let next = call();
        // Dupla nacionalidade (6.11): convite único, só enquanto o Brasil não convocou; aceitar é definitivo.
        const country = heritage ?? Object.keys(dual.residencia.ligas).map((lg) => residenceCountry(lg, seasons.filter((x) => x.division === lg).length)).find(Boolean) ?? null;
        if (!nation && !isPrincipal(next.rung) && invited({ age: evo.age, brazilCaps: selection.caps, visibility: vis, country, decided: selection.dual !== null })) {
          const out = applyOption({ moral: morale, trocarSelecao: false }, 'dupla-nacionalidade', ask('dupla-nacionalidade'));
          morale = out.moral as number;
          selection.dual = out.trocarSelecao ? 'aceitou' : 'recusou';
          if (out.trocarSelecao) { nation = country; selection.nationality = country!; next = call(); }
        }
        morale = clamp(morale + selectionEffect(prestige, next, sel.rung).moraleDelta, 0, 1);
        prestige = updatePrestige(prestige, next);
        sel = next;
        if (next.rung !== 'nenhum') selection.callUps[next.rung]++;
        if (isPrincipal(next.rung)) selection.caps++;
        if (next.ten) selection.ten++;
        if (next.captain) selection.captain++;
      }
      // Torneios de seleções no meio do ano (calendário da T14); título com a Seleção é permanente.
      if (sem === 0) {
        for (const t of TOURNAMENTS) {
          if (!isEditionYear(t, year) || !eligible(t, sel.rung, evo.age, nation ? teamName(nation) : undefined)) continue;
          const tr = createPrng(Math.imul(seed + 7, 0x9e3779b1) ^ Math.imul(year, 0x85ebca6b) ^ TOURNAMENTS.indexOf(t));
          const res = playTournament({ tournament: t, rung: sel.rung, overall: ov(evo), mental: evo.attributes.mental, teamStrength: nation ? teamStrength(nation) : undefined }, (e) => ask(e), tr);
          const fxT = tcfg.efeitos;
          for (const d of res.decisions) morale = applyOption({ moral: morale }, d.event, d.option).moral as number;
          if (res.champion) { titles.push({ year, competition: t, clubId: 'selecao' }); morale = clamp(morale + fxT.titulo.moral, 0, 1); }
          if (res.hero) { prestige = Math.min(1, prestige + fxT.heroi.prestigio); morale = clamp(morale + fxT.heroi.moral, 0, 1); }
          if (res.villain) { prestige *= fxT.vilao.prestigioFator; morale = clamp(morale + fxT.vilao.moral, 0, 1); }
          if (res.injured) outLeft = Math.max(outLeft, fxT.lesaoSemestresFora);
          if (t === 'copaDoMundo') worldCup = { stage: res.stage, titular: sel.rung === 'titular', hero: res.hero };
          selection.tournaments.push({ year, tournament: t, team: selection.nationality, stage: res.stage, hero: res.hero, villain: res.villain });
        }
      }
      const o = ov(evo);
      if (o > peakOverall) { peakOverall = o; peakAge = evo.age; peakAttributes = { ...evo.attributes }; peakClubId = clubId; }
      peakPhysical = Math.max(peakPhysical, physical(evo));
      if (spells.length) spells.at(-1)!.toAge = evo.age;
    }

    // Títulos do clube do jogador com minutos suficientes, e ganhos do contrato.
    const avgMinutes = minutesSum / 2;
    if (clubId && clubId === seasonClub && avgMinutes >= cfg.minutosParaTitulo) {
      const won = (competition: string, champ: string | undefined) => { if (champ === clubId) titles.push({ year, competition, clubId: clubId! }); };
      if (division) {
        won(`serie${division}`, season.champions[division]);
        won('copaDoBrasil', cdb.champion);
        won('copaDoNordeste', cdn.champion);
      }
      if (BRAZIL.has(clubId)) won('estadual', st.champions[UF.get(clubId)!]);
      won('libertadores', lib.champion);
      won('sulAmericana', sud.champion);
      if (eu) {
        const liga = EURO_LEAGUE.get(clubId);
        if (liga) { won('ligaNacional', eu.champions[liga]); won('copaNacional', eu.cups[liga]!.champion); }
        won('champions', eu.ucl.champion);
        won('europaLeague', eu.uel.champion);
      }
      if (!division && !EURO_LEAGUE.has(clubId)) {
        const s = cfg.ligaSimplificada;
        const chance = clamp(s.chanceBase + (effectiveRep(clubId) - s.refReputacao) * s.porPontoReputacao, 0, s.max);
        if (yr.next() < chance) titles.push({ year, competition: 'ligaNacional', clubId });
      }
    }
    if (contract && clubId && !inYouth) {
      const c: Contract = contract;
      earn(seasonEarnings(c, Math.round(wins * avgMinutes)), c.currency);
    }
    // Números e prêmios da temporada (só no profissional).
    if (clubId && !inYouth) {
      const st = seasonStats({ position, overall: ov(evo), minutes: avgMinutes, league, teamResult, setPieceTaker: traits.traits.includes('cobrador') }, yr);
      stats = addStats(stats, st);
      const won = seasonAwards({
        age: evo.age - 1, overall: ov(evo), form, minutes: avgMinutes, league, goals: st.goals,
        titles: titles.filter((t) => t.year === year).map((t) => t.competition), worldCup,
      }, yr);
      for (const award of won) if (award !== 'revelacao' || !awards.some((a) => a.award === 'revelacao')) awards.push({ year, award });
    }
    seasons.push({ year, age: evo.age - 1, clubId: seasonClub, division: league, minutes: avgMinutes, overall: ov(evo) });

    // Camisa 10 e faixa do clube por evento.
    if (clubId && !inYouth) {
      seasonsAtClub++;
      const squad = squadLevel(effectiveRep(clubId));
      const idolatry = idol[clubId] ?? 0;
      if (canGetTen({ overall: ov(evo), squadLevel: squad, idolatry })) wearsTen = true;
      if (canGetArmband({ overall: ov(evo), squadLevel: squad, idolatry, age: evo.age, seasonsAtClub, temperament: temp })) captain = true;
    }

    // Mudança de posição proposta pelo técnico (6.6), decidida pela política do temperamento.
    if (clubId && !inYouth) {
      const target = coachProposal({ position, age: evo.age, attributes: evo.attributes });
      if (target && ask('mudanca-posicao') !== 'recusar') {
        position = target;
        positionChanges++;
        traits = { ...traits, position };
      }
    }

    // Fim de temporada: volta de empréstimo, empréstimo, mercado (duas janelas) ou renovação.
    if (parent && --loanLeft <= 0) {
      const back: string = parent;
      parent = null;
      const kept: Contract | null = contract;
      join(back, true, yr);
      spells.at(-1)!.loan = false;
      contract = kept;
    } else if (loanTarget) {
      parent = clubId;
      loanLeft = cfg.emprestimoTemporadas;
      join(loanTarget, true, yr);
    } else if (clubId && !inYouth && !parent) {
      const market = selectionEffect(prestige, sel, sel.rung);
      const me = { overall: ov(evo), age: evo.age, clubId, heartClub: input.heartClub, temperament: temp, valueMultiplier: market.marketMultiplier, extraOffers: market.extraOffers };
      const offers = [...generateOffers(me, 'brasil', agent, yr, divOf), ...generateOffers(me, 'europa', agent, yr, divOf)];
      const c = contract as Contract | null;
      const current = wantsOut || !c ? null : { annualSalaryBRL: toBRL(c.annualSalary, c.currency), role: roleFor(me.overall, effectiveRep(clubId), evo.age) };
      // Despedida (6.14/6.18): proposta única de encerrar a carreira no clube de coração ou no formador.
      const fw = farewellOffer({ age: evo.age, clubId, formativeClub: spells[0]?.clubId ?? null, heartClub: input.heartClub, done: farewellAsked }, yr);
      let goingHome = false;
      if (fw) {
        farewellAsked = true;
        const event = fw.kind === 'coracao' ? 'realizar-sonho' : 'retorno-formador';
        const out = applyOption({ moral: morale, idolatria: idol[fw.clubId] ?? 0, despedida: false }, event, ask(event));
        morale = out.moral as number;
        if (out.despedida) {
          goingHome = true;
          farewell = fw.kind;
          join(fw.clubId, false, yr);
          idol = { ...idol, [fw.clubId]: out.idolatria as number };
          salaryDelays = 0;
        }
      }
      // Em despedida, o jogador não sai mais: só renova.
      // "Ficar" sempre existe aqui (há clube): quem pediu para sair (current null) só sai se aceitar uma proposta; sem proposta aceita, fica.
      // T28b (v2.50): com propostas na janela, o jogador escolhe (ou o automático, que sugere a que vence "ficar" pela margem).
      let pick: Offer | null = null;
      let byLove = false;
      let forced = false;
      const todayValue = marketValue(ov(evo), evo.age);
      const cardContext = (o: Offer) => ({
        currentAnnualSalaryBRL: current?.annualSalaryBRL ?? null, todayValueEUR: todayValue,
        projectedValueEUR: projectValue({
          evo, position, bonus: position === input.position ? arch.overallWeightBonus : undefined, clubRep: effectiveRep(o.clubId),
          role: o.role, staffQuality: o.staffQuality, morale,
        }).valueEUR,
      });
      const canForce = !!c && c.years > 1;
      // T28j (v2.54): o clube atual é o primeiro cartão; com o contrato no fim, a renovação (e o pedido de aumento) saem dele.
      const due = !!c && c.years - 1 <= 1;
      const atualCard = (): CurrentClubView => {
        const k = c!;
        const rep = effectiveRep(clubId!);
        const role = roleFor(me.overall, rep, evo.age);
        const projected = projectValue({ evo, position, bonus: position === input.position ? arch.overallWeightBonus : undefined, clubRep: rep, role, staffQuality: clamp(0.8 + (rep / 100) * 0.4, 0.8, 1.2), morale }).valueEUR;
        const renewalOf = (raise: boolean) => {
          const r = renew(k, ov(evo) - contractOverall, raise);
          return { salarioMensal: Math.round(r.annualSalary / 12), salarioPct: salaryChange(r.annualSalary, k.annualSalary), anos: r.years };
        };
        return {
          clubId: clubId!, league: leagueOf(clubId!, divOf), currency: k.currency, salarioMensal: Math.round(k.annualSalary / 12), anosRestantes: Math.max(0, k.years - 1),
          role, nivelClube: clubLevelBand(rep), valorProjetadoEUR: projected, valorPct: valueChange(projected, todayValue),
          renovacao: due ? renewalOf(false) : null, aumento: due ? renewalOf(true) : null,
        };
      };
      let renewChoice: string | null = null; // saída forçada só com contrato por mais de um ano
      if (!goingHome && !farewell) {
        const { shown, pick: auto } = rankOffers(me, offers, current);
        pick = auto;
        if (shown.length > 0) {
          // a sugestão é a escolha automática; no clube de coração, "por amor" quando o jeito do jogador escolheria assim (events.json)
          const staying = due ? autoChoice('renovacao', temp) : null;
          const stayChoice = staying === 'renovar' ? RENEW : staying === 'pedir-aumento' ? RAISE : STAY;
          const sugestao = !auto ? stayChoice : auto.heartClub && autoChoice('proposta-coracao', temp) === 'aceitar-por-amor' ? loveChoice(auto.clubId) : acceptChoice(auto.clubId);
          const said = ask(PROPOSAL_EVENT, { sugestao, podeFicar: true, podeForcar: canForce, podeRenovar: due }, temp, { propostas: shown.map((o) => proposalViewOf(o, me.overall, cardContext(o))), ...(c ? { atual: atualCard() } : {}) });
          const chosen = parseProposalChoice(said, shown, true, (o) => o.heartClub, canForce, due);
          if (!chosen) throw new RangeError(`proposta inválida: "${said}"`);
          if (chosen.kind === 'renovar') renewChoice = 'renovar';
          else if (chosen.kind === 'aumento') renewChoice = 'pedir-aumento';
          else if (chosen.kind === 'ficar' && due) renewChoice = 'nao-renovar';
          pick = chosen.kind === 'ficar' || chosen.kind === 'renovar' || chosen.kind === 'aumento' ? null : chosen.offer;
          byLove = chosen.kind === 'amor';
          forced = chosen.kind === 'forcar';
          if (chosen.kind === 'negociar') {
            // o empresário negocia: a proposta pode sumir (o jogador fica), ficar igual ou melhorar o salário; o sorteio só roda se o jogador pediu
            const out = negotiate(chosen.offer, agent, yr);
            pick = out;
            negotiations.push({ year, clubId: chosen.offer.clubId, result: !out ? 'sumiu' : out.annualSalary > chosen.offer.annualSalary ? 'melhorou' : 'igual' });
          }
        }
      }
      if (goingHome) { /* contrato novo já assinado */ } else if (pick) {
        // clube do coração: salário, moral e idolatria vêm da opção escolhida (aceitar ou por amor), números em events.json
        let factor = 1;
        if (pick.heartClub) {
          const out = applyOption({ salarioFator: 1, moral: morale, idolatriaCoracao: idol[pick.clubId] ?? 0 }, 'proposta-coracao', byLove ? 'aceitar-por-amor' : 'aceitar');
          factor = out.salarioFator as number;
          morale = out.moral as number;
          idol = { ...idol, [pick.clubId]: out.idolatriaCoracao as number };
        }
        const from = clubId;
        join(pick.clubId, false, yr, factor === 1 ? pick : { ...pick, annualSalary: Math.round(pick.annualSalary * factor) });
        salaryDelays = 0;
        if (forced && from && c) {
          // T28e: forçar a saída: multa em meses de salário, idolatria perdida no clube que deixa, moral e relação com o técnico; risco de virar vilão (market.json)
          const f = FORCE_EXIT;
          wealth -= (toBRL(c.annualSalary, c.currency) / 12) * f.custoMesesSalario;
          morale = clamp(morale + f.moral, 0, 1);
          coachRelation = clamp(coachRelation + f.relacaoTecnico, 0, 1);
          const villain = yr.next() < f.chanceVilao;
          const lost = clamp((idol[from] ?? 0) + f.idolatria, -100, 100);
          idol = { ...idol, [from]: villain ? Math.min(lost, f.idolatriaVilao) : lost };
          forcedExits.push({ year, fromClubId: from, toClubId: pick.clubId, villain });
        }
      } else if (c) {
        c.years -= 1;
        if (c.years <= 1) {
          const choice = renewChoice ?? ask('renovacao');
          if (choice !== 'nao-renovar') { contract = renew(c, ov(evo) - contractOverall, choice === 'pedir-aumento'); contractOverall = ov(evo); contracts++; }
          else c.years = 1;
        }
      }
    }
    loanTarget = null;

    // Aposentadoria (6.14): o primeiro gatilho que valer encerra a carreira.
    const reason = retirementCheck({
      age: evo.age, overall: ov(evo), startingOverall: player.startingOverall, physical: physical(evo), peakPhysical,
      graveInjuries: injuries.grave, minutes: avgMinutes, temperament: temp,
    }, yr);
    if (reason) { retirement = reason; break; }

    // Mundo do ano seguinte.
    prevTable = season.phases.A[0]!.groups![0]!.map((r) => r.id);
    prevCdb = { champion: cdb.champion, vice: cdb.runnerUp };
    prevChamps = [cdn.champion, season.champions.C, season.champions.D];
    holders = [lib.champion, sud.champion];
    divs = season.next;
    states = st.next;
    cdnGroups = nordesteGroups(yr);
  }

  selection.oriundoCampeao = selection.dual === 'aceitou' && selection.tournaments.some((t) => t.stage === 'campeao' && t.team !== 'brasil');
  selection.esperouOBrasil = selection.dual === 'recusou' && selection.caps > 0;
  const result = {
    player, spells, titles, peakOverall, peakAge, peakAttributes, peakClubId: peakClubId ?? spells[0]?.clubId ?? '', endAge: evo.age, wearsTen, captain, idolatry: idol, negotiations, forcedExits,
    wealthBRL: Math.max(0, wealth), agentProfile: agent.profile, contracts, injuries, finalPosition: position, positionChanges, selection, stats, awards, retirement, farewell, cards, finalTemperament: temp, houseBought, discipline, seasons, earnedBRL: earned, decisiveDerbies,
  };
  // Sorteios novos ficam por último para não alterar nenhum resultado anterior da mesma semente.
  const nickname = generateNickname(player, rng);
  const legacy = legacyOf(result);
  return { ...result, honors: honorsOf(honorFacts(result)), nickname, legacy, ...headlineOf({ player, nickname, legacy }, rng) };
}
