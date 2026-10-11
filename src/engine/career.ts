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
import { summarizeSeason, type SeasonSummary } from './seasonSummary';
import { mentalityEffects } from './mentality';
import { afterClassico, afterSemester, afterTransfer, type Idolatry } from './idolatry';
import { decayRelapse, graveDecision, semesterInjury } from './injuries';
import { FORCE_EXIT, clubLevelOf, eliteValueFactor, generateOffers, negotiate, rankOffers, leagueOf, marketValue, salaryFor, type Offer } from './market';
import { drawCatalog, drawCount } from './contextDraw';
import { contextCtx, tagsOf } from './contextTags';
import contextCfg from '../data/context.json';
import { ONCE, memoryCtx, type Memory } from './memory';
import { EFFECTS, FACTS, fireMilestones, milestoneKey, type MilestoneFacts, type MilestoneMoment } from './milestones';
import { MEETING_EVENT, autoProposal, encodeProposal, meetingScore, parseProposal, staffMeeting, type MeetingResult } from './meeting';
import { MEETING_IDEAS, TRUST, drawClubNeed, ideaOf, meetingOptions, type Idea, type MeetingOptions } from './meetingOptions';
import { expectedMinutes, minutesShare, roleFor, squadLevel, updateForm, updateMorale, type Role } from './minutes';
import { overall, type Position } from './overall';
import { coachProposal } from './positionChange';
import { createPlayer, type CreationInput, type Player } from './player';
import { createPrng, type Prng } from './prng';
import { TOURNAMENTS, eligible, playTournament, type NTournament } from './tournaments';
import { addCallUp, addTournament, type CalledRung, type NationalYear } from './nationalYear';
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
import { LOAN_EVENT, PROPOSAL_EVENT, RAISE, RENEW, STAY, acceptChoice, loveChoice, parseProposalChoice, proposalViewOf, type CardContext, type CurrentClubView, type ProposalView } from './proposals';
import { farewellOffer, retirementCheck, type RetireReason } from './retirement';
import { simulateSeason, type ClubInfo, type Div, type Divisions, type Row } from './season';
import { assignNumber, canGetArmband, canGetTen, rosterNumbers } from './shirt';
import { baseOffers, copinha, promotion, runPeneira, runVarzea } from './start';
import { initialStates, simulateStates, type StateWorld } from './states';
import { progressTraits, type TraitState } from './traits';
import cfg from '../data/career.json';
import clubLifeCfg from '../data/clubLife.json';
import creationData from '../data/creation.json';
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
  /** v2.65: games, goals e assists somam todas as seleções (base inclusive); mainGames só a principal. */
  selection: { callUps: Record<Exclude<Rung, 'nenhum'>, number>; caps: number; ten: number; captain: number; games: number; goals: number; assists: number; mainGames: number;
    tournaments: { year: number; tournament: NTournament; team: string; stage: string; hero: boolean; villain: boolean }[];
    /** Dupla nacionalidade (T38): seleção defendida e a resposta ao convite. */
    nationality: string; dual: 'aceitou' | 'recusou' | null; oriundoCampeao: boolean; esperouOBrasil: boolean;
  };
  /** Números da carreira e prêmios individuais (T39). */
  stats: SeasonStats; awards: { year: number; award: Award }[];
  /** Tudo o que entrou no bolso (antes de gastos e perdas) e clássicos decisivos — usados pelos rótulos (T40). */
  earnedBRL: number; decisiveDerbies: number;
  /** T25c: os marcos vividos (primeiras vezes), com a opção escolhida; alimentam o álbum e a manchete. */
  marcos: { id: string; year: number; age: number; clubId: string; option: string }[];
  /** T25d: a memória da carreira (marcos e fatos: final perdida, lesão grave, troca pelo rival, recusa da Europa). */
  memorias: Memory[];
  legacy: Legacy;
  /** T41: apelido dado pelo jogo, manchete séria e comentário com zoeira. */
  nickname: string; headline: string; comment: string;
  retirement: RetireReason; farewell: 'formador' | 'coracao' | null;
  /** v2.68: a comemoração (do marco do primeiro gol, ou a padrão) e a mentalidade (do marco, ou null sem estreia profissional). */
  celebration: string; mentality: string | null;
  cards: { yellows: number; reds: number }; finalTemperament: string; houseBought: boolean; discipline: number;
  /** `age` (v2.51): idade em que jogou a temporada (a de `evo.age` já avançou um ano ao registrar); para a linha do tempo. */
  /** T28e (v2.50): as vezes em que o empresário negociou uma proposta, e como terminou. */
  negotiations: { year: number; clubId: string; result: 'melhorou' | 'igual' | 'sumiu' }[];
  /** T28e: saídas forçadas (antes do fim do contrato) e se o jogador virou vilão da torcida do clube que deixou. */
  forcedExits: { year: number; fromClubId: string; toClubId: string; villain: boolean }[];
  /** v2.65: `selecao` só no ano com convocação (degrau mais alto, jogos, gols, assistências e torneios do ano). */
  seasons: { year: number; age: number; clubId: string; division: string | null; minutes: number; overall: number; games: number; goals: number; assists: number; cleanSheets: number; selecao?: NationalYear }[];
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
  /** v2.61: o resumo da última temporada profissional fechada (a tela mostra num card no Normal e no Completo). */
  ultimaTemporada?: SeasonSummary;
  /** v2.63: capitão do clube atual (a faixa do clube); a tela mostra o selo "C". */
  capitao: boolean;
  /** T51b: idolatria (−100 a 100) em cada clube por onde passou; a tela mostra só a faixa. */
  idolatrias: Record<string, number>;
  /** T25c: os marcos já vividos, do mais antigo ao mais novo (álbum da carreira). */
  marcos: { id: string; year: number; clubId: string }[];
  /** T25d: a memória da carreira até aqui (marcos e fatos de história); no contexto do evento vira `mem.<id>` e `anos.<id>` em `state`. */
  memorias: Memory[];
  /** T25e: as etiquetas de contexto de agora, da mais forte para a mais fraca; escolhem a abertura e as frases de contexto do texto. */
  etiquetas: string[];
  /** T28b (v2.50): na decisão `proposta-clube`, as até 3 propostas mostradas (a escolha é "aceitar:<clube>" ou "ficar"). */
  propostas?: ProposalView[];
  /** T28j (v2.54): o clube atual como primeiro cartão da tela de propostas, com a renovação quando o contrato acaba. */
  atual?: CurrentClubView;
  /** Seleção que o jogador defende agora ("brasil" ou o país da dupla nacionalidade aceita): a camisa nos eventos da Seleção (v2.37). */
  nationality: string;
  /** Degrau da Seleção agora (sub17, sub20, olimpica, lista, reserva, titular ou nenhum): a tela diz a categoria nos eventos da Seleção de base. */
  selecaoDegrau: Rung;
  /** v2.84: a divisão do clube de agora (a da temporada em andamento), para carimbar acesso e rebaixamento na hora certa. */
  divisao: string | null;
}
/** Quem decide: o temperamento (simulação, ritmo Rápido) ou o jogador (tela). `view` só é montada se pedida. */
export type Decider = (eventId: string, temperament: string, view: () => DecisionView) => string;
/** Decisão automática (simulação e eventos fora da tela): na reunião, a sugestão do preparador; nos eventos, o temperamento. */
export const autoDecide: Decider = (eventId, temperament, view) => (eventId === MEETING_EVENT || eventId === PROPOSAL_EVENT || eventId === LOAN_EVENT ? String(view().state.sugestao) : autoChoice(eventId, temperament));
const AUTO = autoDecide;
/** v2.64: o empréstimo como decisão (aceite pelo temperamento no automático, custo de recusar) e a venda fechada pelo empresário. */
const LOAN = clubLifeCfg.emprestimo;
const SALE_EVENT = 'empresario-forca-venda';
/** v2.67: o "Primeiro passo" de cada origem, a primeira decisão da carreira. */
const START_EVENT: Record<string, string> = { varzea: 'primeiro-passo-varzea', peneira: 'primeiro-passo-peneira', baseGrande: 'primeiro-passo-base' };

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
  /** v2.63: a 10 vestida (depois do marco "camisa-10"); vale em todo clube seguinte. */
  let tenShirt = false;
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
  const selection: CareerResult['selection'] = { callUps: { sub17: 0, sub20: 0, olimpica: 0, lista: 0, reserva: 0, titular: 0 }, caps: 0, ten: 0, captain: 0, games: 0, goals: 0, assists: 0, mainGames: 0, tournaments: [], nationality: 'brasil', dual: null, oriundoCampeao: false, esperouOBrasil: false };
  const heritage = player.dualNationality; // sorteada na criação (6.1); também pode ser descoberta por residência
  let nation: string | null = null; // null = Brasil
  let stats: SeasonStats = ZERO_STATS;
  let earned = 0;
  let decisiveDerbies = 0;
  let lastMinutes = 0.6; // fração de minutos do semestre mais recente (etiqueta noBanco)
  const OFF_AXIS = new Set(europe.foraDoEixo.clubs.map((x) => x.id));
  // T25e: etiquetas de contexto a partir dos fatos de agora
  const contextNow = () => {
    const last2 = seasons.slice(-2);
    const div = (s?: { division: string | null }) => /^BRA-([A-D])$/.exec(s?.division ?? '')?.[1];
    const [pa, pb] = [div(last2[0]), div(last2[1])];
    const sameClub = last2.length === 2 && last2[0]!.clubId === last2[1]!.clubId && !!pa && !!pb;
    const facts = {
      idade: evo.age, moral: morale, idolatria: clubId ? idol[clubId] ?? 0 : 0, idolatriaCoracao: input.heartClub ? idol[input.heartClub] ?? 0 : 0,
      minutosFracao: lastMinutes, salarioAtrasos: salaryDelays, convocado: sel.rung !== 'nenhum',
      subiuDivisao: sameClub && pb! < pa!, caiuDivisao: sameClub && pb! > pa!, foraDoEixo: !!clubId && OFF_AXIS.has(clubId),
      empresarioPressiona: agent.influence >= contextCfg.empresarioInfluenciaMin, posicaoDisputada: curRole === 'disputa',
      noClubeDeCoracao: !!clubId && clubId === input.heartClub, capitao: !!clubId && captainAt.has(clubId),
      campeaoNoAno: !!clubId && titles.some((t) => t.year === curYear && t.clubId === clubId),
      iniciante: inYouth || varzeaLeft > 0 || curYear === startYear,
    };
    return contextCtx(facts, memorias, curYear);
  };
  const contextTags = (): string[] => tagsOf(contextNow());
  const usedCatalog = new Set<string>();
  // T25d: memória da carreira (id, ano, idade e clube); os marcos da T25c também entram
  const memorias: Memory[] = [];
  // v2.78: quem lembra no meio da temporada (marcos da chegada, da convocação, da Copa) passa a idade da temporada
  const remember = (id: string, club: string, age = Math.floor(evo.age - 1)) => { if (ONCE.has(id) && memorias.some((x) => x.id === id)) return; memorias.push({ id, year: curYear, age, clubId: club }); };
  // T25c: marcos da carreira (primeiras vezes)
  const marcos: CareerResult['marcos'] = [];
  const doneMarcos = new Set<string>();
  // v2.68: quem já trouxe a mentalidade da criação (save ou link antigo) não passa pelo marco dela
  if (input.mentality !== undefined) doneMarcos.add('mentalidade');
  let proSeasons = 0;
  const goalsAtClub: Record<string, number> = {};
  const captainAt = new Set<string>();
  let cobradorClub: string | null = null;
  let marcoMental = 1;
  // v2.68: comemoração e mentalidade vêm dos marcos; saves e links antigos ainda as trazem da criação
  let celebration = input.celebration ?? creationData.comemoracaoPadrao;
  let mentality: string | null = input.mentality ?? null;
  let mentalityGrowth: Partial<Attributes> = {};
  let curYear = startYear;
  let curRole: Role = 'jovemPromessa';
  const meetings: DecisionView['meetings'] = [];
  let ultimoSemestre: DecisionView['ultimoSemestre'];
  let ultimaTemporada: DecisionView['ultimaTemporada'];
  /** Toda decisão passa por aqui (T51): o padrão é a escolha do temperamento, como antes. */
  const ask = (eventId: string, state: Record<string, number | string | boolean> = {}, who = temp, extra: Pick<DecisionView, 'propostas' | 'reuniao' | 'atual'> = {}) => decide(eventId, who, () => ({
    ...extra,
    year: curYear, age: evo.age, clubId, position, overall: ov(evo), role: curRole, temperament: who,
    marketValueEUR: Math.round(marketValue(ov(evo), evo.age) * selectionEffect(prestige, sel, sel.rung).marketMultiplier),
    monthlySalary: contract ? { amount: Math.round(contract.annualSalary / 12), currency: contract.currency } : { amount: 0, currency: 'BRL' },
    number: spells.at(-1)?.number ?? input.shirtNumber, attributes: { ...evo.attributes },
    state: {
      moral: morale, disciplina: discipline, relacaoTecnico: coachRelation, patrimonio: wealth, salarioFator: 1,
      idolatria: clubId ? idol[clubId] ?? 0 : 0, idolatriaCoracao: input.heartClub ? idol[input.heartClub] ?? 0 : 0, ...memoryCtx(memorias, curYear), ...state,
    },
    seasons: [...seasons], titles: [...titles], marcos: marcos.map(({ id, year, clubId: club }) => ({ id, year, clubId: club })), memorias: memorias.map((x) => ({ ...x })), etiquetas: contextTags(), nationality: selection.nationality, selecaoDegrau: sel.rung, divisao: clubId ? leagueOf(clubId, divOf) : null, capitao: clubId ? captainAt.has(clubId) : false, meetings: [...meetings], idolatrias: { ...idol }, ...(ultimoSemestre && { ultimoSemestre }), ...(ultimaTemporada && { ultimaTemporada }),
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
    // v2.63: com a 10 conquistada ela vai junto; o sorteio do elenco acontece igual para não mudar os outros sorteios
    const number = assignNumber(input.shirtNumber, rosterNumbers(r));
    spells.push({ clubId: id, fromAge: evo.age, toAge: evo.age, number: tenShirt ? 10 : number, loan });
    if (loan) return;
    if (offer) sign(id, offer.annualSalary, offer.years);
    else sign(id, salaryFor(marketValue(ov(evo), evo.age), leagueOf(id, divOf)), 2);
  };

  // v2.64: os cartões da tela de propostas, também usados no empréstimo e na venda pelo empresário (o clube à vista)
  const cardContextOf = (o: Offer, currentAnnualSalaryBRL: number | null): CardContext => ({
    currentAnnualSalaryBRL, todayValueEUR: marketValue(ov(evo), evo.age),
    currentExpectedMinutes: clubId ? expectedMinutes(ov(evo), effectiveRep(clubId), roleFor(ov(evo), effectiveRep(clubId), evo.age)) : null,
    projectedValueEUR: projectValue({
      evo, position, bonus: position === input.position ? arch.overallWeightBonus : undefined, clubRep: effectiveRep(o.clubId),
      role: o.role, staffQuality: o.staffQuality, morale,
    }).valueEUR * eliteValueFactor(o.clubId),
  });
  /** T28j (v2.54): o clube atual como primeiro cartão; com o contrato no fim (`due`), a renovação (e o pedido de aumento) saem dele. */
  const currentCard = (k: Contract, due: boolean): CurrentClubView => {
    const rep = effectiveRep(clubId!);
    const role = roleFor(ov(evo), rep, evo.age);
    const projected = projectValue({ evo, position, bonus: position === input.position ? arch.overallWeightBonus : undefined, clubRep: rep, role, staffQuality: clamp(0.8 + (rep / 100) * 0.4, 0.8, 1.2), morale }).valueEUR * eliteValueFactor(clubId!);
    const renewalOf = (raise: boolean) => {
      const r = renew(k, ov(evo) - contractOverall, raise);
      return { salarioMensal: Math.round(r.annualSalary / 12), salarioPct: salaryChange(r.annualSalary, k.annualSalary), anos: r.years };
    };
    return {
      clubId: clubId!, league: leagueOf(clubId!, divOf), currency: k.currency, salarioMensal: Math.round(k.annualSalary / 12), anosRestantes: Math.max(0, k.years - 1),
      role, nivelClube: clubLevelOf(clubId!, rep), valorProjetadoEUR: projected, valorPct: valueChange(projected, marketValue(ov(evo), evo.age)),
      renovacao: due ? renewalOf(false) : null, aumento: due ? renewalOf(true) : null,
    };
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

  // v2.67: a primeira decisão é o "Primeiro passo" da origem, aos 16, antes de qualquer semestre (o Over ainda é o da revelação)
  {
    const id = START_EVENT[input.origin] ?? START_EVENT.varzea!;
    const st = { moral: morale, disciplina: discipline, relacaoTecnico: coachRelation, bonusMental: 0 };
    const out = applyOption(st, id, ask(id, st));
    morale = out.moral as number;
    discipline = out.disciplina as number;
    coachRelation = out.relacaoTecnico as number;
    marcoMental = Math.min(EFFECTS.bonusMentalMax, marcoMental + (out.bonusMental as number));
  }

  /**
   * Marcos da carreira (6.13b) de um momento da temporada (v2.78): cada um vira decisão e aplica os efeitos.
   * A chegada abre a temporada, a convocação e a Copa vêm na hora delas, o resto no fim (desempenho do ano).
   */
  const liveMilestones = (momento: MilestoneMoment, facts: MilestoneFacts, year: number, seasonAge: number) => {
    const clubId = facts.clubId;
    const { fired, silenced } = fireMilestones(facts, doneMarcos, momento);
    for (const k of silenced) doneMarcos.add(k);
    for (const m of fired) {
      doneMarcos.add(milestoneKey(m.id, m.escopo === 'clube' ? clubId : undefined));
      const before = { moral: morale, idolatria: idol[clubId] ?? 0, relacaoTecnico: coachRelation, bonusMental: 0, cobrador: false, comemoracao: '', mentalidade: '' } as Record<string, number | string | boolean>;
      const option = ask(m.id, before);
      const out = applyOption(before, m.id, option);
      morale = out.moral as number;
      idol = { ...idol, [clubId]: out.idolatria as number };
      coachRelation = clamp(out.relacaoTecnico as number, 0, 1);
      marcoMental = Math.min(EFFECTS.bonusMentalMax, marcoMental + (out.bonusMental as number));
      if (out.cobrador) cobradorClub = clubId;
      if (m.id === 'camisa-10') { tenShirt = true; spells.at(-1)!.number = 10; }
      // a comemoração escolhida na criação (save ou link antigo) continua valendo; sem ela, vale a do primeiro gol
      if (out.comemoracao && input.celebration === undefined) celebration = out.comemoracao as string;
      if (out.mentalidade) {
        // v2.68: a mentalidade passa a pesar na evolução daqui em diante (crescimento, ruído e declínio)
        mentality = out.mentalidade as string;
        const fxM = mentalityEffects(mentality);
        mentalityGrowth = fxM.growth;
        evo = { ...evo, ...fxM.evo };
      }
      marcos.push({ id: m.id, year, age: Math.floor(seasonAge), clubId, option });
      remember(m.id, clubId, Math.floor(seasonAge));
    }
  };
  /**
   * v2.78: a chegada a um clube do profissional. "Uma vez só" vem do registro dos marcos vividos (por carreira ou por clube),
   * então os fatos só dizem onde ele está: estreia no profissional, no clube e, fora do Brasil, no exterior.
   */
  const arrive = (club: string, year: number, seasonAge: number) =>
    liveMilestones('chegada', factsNow(club, { proDebut: true, clubDebut: true, exterior: !BRAZIL.has(club) }), year, seasonAge);
  /** Fatos de um momento do meio da temporada: só o que aquele momento olha (o resto fica neutro). */
  const factsNow = (clubId: string, over: Partial<MilestoneFacts>): MilestoneFacts => ({
    clubId, proDebut: false, clubDebut: false, titular: false, golsAno: 0, golsCarreira: 0, assistenciasCarreira: 0, golsNoClube: 0,
    cobrador: false, titulosCarreira: 0, finalAno: false, classico: false, capitao: false, camisa10: false, convocado: false,
    jogosSelecao: 0, golsSelecaoAno: 0, copa: false, exterior: false, estreouSelecao: false, ...over,
  });

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

    // v2.78: a idade da temporada (a mesma do resumo) e a chegada, que abre a temporada antes de qualquer decisão no clube
    const seasonAge = evo.age;
    if (clubId && !inYouth) arrive(clubId, year, seasonAge);

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
    // v2.64: no máximo uma decisão de transferência por temporada (empréstimo, venda pelo empresário ou tela de propostas)
    let transferAsked = false;
    let saleTarget: Offer | null = null;
    let derbyYear = false;
    // v2.65: a Seleção do ano, com gerador próprio para não deslocar os outros sorteios
    let natYear: NationalYear | null = null;
    const natRng = createPrng(((seed >>> 0) ^ Math.imul(year, 0x2c1b3c6d) ^ 0x5e1ec4) >>> 0);
    // v2.61: o começo do ano, para o resumo da temporada comparar o Over e os atributos
    const ovStart = ov(evo);
    const attrsStart = { ...evo.attributes };

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
      const ideas = MEETING_IDEAS && clubId
        ? meetingOptions({ position, attrs: evo.attributes, caps: evo.caps, age: evo.age, score: meetingScore({ morale, coachRelation, nationalTeamStatus: fx.meetingStatus }), need: clubNeed })
        : undefined;
      // v2.58: com as 3 ideias, a sugestão (e a reunião automática) é a proposta do técnico, o que o clube quer
      const suggestion = ideas ? ideas.obvia.proposal : autoProposal(evo.attributes, evo.caps, position, evo.age);
      let proposal: { main: Focus; secondary: Focus } = suggestion;
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
            remember('lesaoGrave', clubId!);
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
      const growth = { ...player.growthBonus };
      for (const [a, f] of Object.entries(mentalityGrowth)) growth[a as keyof Attributes] = (growth[a as keyof Attributes] ?? 1) * f;
      evo = { ...evo, growthBonus: { ...growth, mental: (growth.mental ?? 1) * leader.mentalBonus * fx.mentalBonus * marcoMental } };
      coachRelation = clamp(coachRelation + leader.relationDelta, 0, 1);
      const antes = evo.attributes;
      evo = evolveSemester(evo, { focus, staffQuality, minutes, morale }, yr);
      ultimoSemestre = { year: curYear, semestre: (sem + 1) as 1 | 2, frases: semesterFeedback(antes, evo.attributes) };
      const tr = progressTraits(traits, focus);
      traits = { position: tr.position, traits: tr.traits, latentTrait: tr.latentTrait, progress: tr.progress };

      if (varzeaLeft > 0) {
        if (--varzeaLeft === 0) {
          join(varzeaClub!, false, yr);
          // v2.78: saiu da várzea no meio do ano: a chegada é agora, não na temporada seguinte
          if (clubId && !inYouth) arrive(clubId, year, seasonAge);
        }
      } else if (!inYouth && clubId) {
        minutesSum += minutes;
        const perf = clamp(form * 2 - 1, -1, 1);
        idol = afterSemester(idol, clubId, minutes, perf, temp);
        const hasDerby = division ? rivalsOf(clubId).some((r) => divs[division].includes(r)) : table.some((id) => areEuroRivals(clubId!, id));
        if (hasDerby) {
          derbyYear = true;
          const derby = clamp(perf + (yr.next() * 2 - 1) * 0.5, -1, 1);
          idol = afterClassico(idol, clubId, derby, temp, input.heartClub);
          if (derby >= 0.5) decisiveDerbies++;
        }

        const life = semesterClubLife({ clubId, coachRelation, salaryDelays, age: evo.age, minutes, expectedRank, actualRank }, yr);
        coachRelation = life.coachRelation;
        salaryDelays = life.salaryDelays;
        if (life.canRequestLeave && ask('salario-atrasado') === 'pedir-saida') wantsOut = true;
        // v2.64: o empréstimo vira decisão, com o clube de destino à vista; oferecido no máximo uma vez por temporada
        if (life.loanOffer && !parent && !loanTarget && !transferAsked && contract) {
          transferAsked = true;
          const k: Contract = contract;
          const dest = life.loanOffer;
          const rep = effectiveRep(dest);
          const offer: Offer = {
            clubId: dest, league: leagueOf(dest, divOf), currency: k.currency, annualSalary: k.annualSalary, years: cfg.emprestimoTemporadas,
            role: roleFor(ov(evo), rep, evo.age), staffQuality: clamp(0.8 + (rep / 100) * 0.4, 0.8, 1.2),
            heartClub: dest === input.heartClub, rivalOfCurrent: false, rivalOfHeart: false, offAxis: false,
          };
          const sugestao = (LOAN.aceitaPorTemperamento as Record<string, boolean>)[temp] ? acceptChoice(dest) : STAY;
          const said = ask(LOAN_EVENT, { sugestao, podeFicar: true }, temp, { propostas: [proposalViewOf(offer, ov(evo), cardContextOf(offer, toBRL(k.annualSalary, k.currency)))], atual: currentCard(k, false) });
          if (said === acceptChoice(dest)) loanTarget = dest;
          else if (said === STAY) coachRelation = clamp(coachRelation + LOAN.recusa.relacaoTecnico, 0, 1);
          else throw new RangeError(`empréstimo inválido: "${said}"`);
        }

        // Disciplina: cartões pelo temperamento; suspensão tira minutos do próximo semestre.
        lastMinutes = minutes;
        const cd = semesterCards({ temperament: temp, minutes }, yr);
        cards.yellows += cd.yellows;
        cards.reds += cd.reds;
        suspended = cd.minutesLost;
        // Vida fora de campo: dilemas resolvidos pela política do temperamento, com efeitos do catálogo.
        const flags = offFieldFlags({ temperament: temp, wealthBRL: wealth, houseBought }, yr);
        let st8 = { moral: morale, disciplina: discipline, idolatria: idol[clubId] ?? 0, relacaoTecnico: coachRelation, patrimonio: wealth, casaComprada: houseBought, investir: false } as Record<string, number | string | boolean>;
        const tagsNow = contextTags(); // T25e: o contexto ajusta as consequências (events.json, ajustes)
        if (flags.conviteFesta) st8 = applyOption(st8, 'festa', ask('festa', st8), tagsNow);
        if (flags.polemica) st8 = applyOption(st8, 'polemica-redes', ask('polemica-redes', st8), tagsNow);
        if (flags.podeComprarCasa) st8 = applyOption(st8, 'casa-da-familia', ask('casa-da-familia', st8), tagsNow);
        if (flags.conviteInvestir) st8 = applyOption(st8, 'investir', ask('investir', st8), tagsNow);
        // Amadurecimento do temperamento por idade ou suspensão longa (evento narrado).
        const matured = matureTemperament(temp, evo.age, cd.longSuspension);
        if (matured !== temp) { temp = matured; st8 = applyOption(st8, 'amadurecimento', ask('amadurecimento', st8, matured), tagsNow); }
        // T25e: eventos de catálogo por contexto (events.json com sorteio: true), com gerador próprio para não deslocar os outros sorteios
        if (!inYouth && varzeaLeft === 0) {
          const storyRng = createPrng(((seed >>> 0) ^ Math.imul(year, 2654435761) ^ Math.imul(sem + 1, 40503)) >>> 0);
          for (const id of drawCatalog({ ctx: contextNow(), tags: tagsNow, temperament: temp, used: usedCatalog, count: drawCount(storyRng) }, storyRng)) {
            usedCatalog.add(id);
            st8 = applyOption(st8, id, ask(id, st8), tagsNow);
          }
        }
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
        } else if (ag.event === 'forcaVenda' && !transferAsked && !parent && contract) {
          // v2.64: o empresário vende para a proposta real de maior comissão para ele; sem proposta no mercado, não há venda.
          // Gerador próprio para não deslocar os outros sorteios do ano.
          const saleRng = createPrng(((seed >>> 0) ^ Math.imul(year, 0x27d4eb2d) ^ Math.imul(sem + 1, 0x165667b1)) >>> 0);
          const market = selectionEffect(prestige, sel, sel.rung);
          const me = { overall: ov(evo), age: evo.age, clubId, heartClub: input.heartClub, temperament: temp, valueMultiplier: market.marketMultiplier, extraOffers: market.extraOffers };
          const buyer = [...generateOffers(me, 'brasil', agent, saleRng, divOf), ...generateOffers(me, 'europa', agent, saleRng, divOf)]
            .reduce<Offer | null>((best, o) => (!best || toBRL(o.annualSalary, o.currency) > toBRL(best.annualSalary, best.currency) ? o : best), null);
          if (buyer) {
            transferAsked = true;
            const k: Contract = contract;
            const st = { moral: morale, relacaoTecnico: coachRelation, idolatria: idol[clubId] ?? 0, aceitarProposta: false, trocarEmpresario: false };
            const out = applyOption(st, SALE_EVENT, ask(SALE_EVENT, st, temp, { propostas: [proposalViewOf(buyer, ov(evo), cardContextOf(buyer, toBRL(k.annualSalary, k.currency)))] }));
            morale = out.moral as number;
            coachRelation = out.relacaoTecnico as number;
            idol = { ...idol, [clubId]: out.idolatria as number };
            if (out.aceitarProposta) saleTarget = buyer;
            if (out.trocarEmpresario) {
              const ch = changeAgent(wealth, 'paiTio', yr);
              agent = ch.agent; wealth -= ch.cost; morale = clamp(morale + ch.moraleDelta, 0, 1);
            }
          }
        }
      }
      // v2.67: no segundo semestre do primeiro ano, um evento de formação (base, várzea) do catálogo, com gerador próprio
      if (year === startYear && sem === 1) {
        const startRng = createPrng(((seed >>> 0) ^ 0x16a5e) >>> 0);
        const tagsNow = contextTags();
        for (const id of drawCatalog({ ctx: contextNow(), tags: tagsNow, temperament: temp, used: usedCatalog, count: 1 }, startRng)) {
          usedCatalog.add(id);
          const st = { moral: morale, disciplina: discipline, relacaoTecnico: coachRelation };
          const out = applyOption(st, id, ask(id, st), tagsNow);
          morale = out.moral as number;
          discipline = out.disciplina as number;
          coachRelation = out.relacaoTecnico as number;
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
        if (next.rung !== 'nenhum') natYear = addCallUp(natYear, { ...next, rung: next.rung }, position, ov(evo), natRng);
        // v2.78: a primeira convocação e a estreia pela Seleção na hora, antes das decisões da Seleção
        if (!inYouth) liveMilestones('convocacao', factsNow(clubId, { convocado: Object.values(selection.callUps).some((n) => n > 0), jogosSelecao: selection.caps }), year, seasonAge);
      }
      // Torneios de seleções no meio do ano (calendário da T14); título com a Seleção é permanente.
      if (sem === 0) {
        for (const t of TOURNAMENTS) {
          if (!isEditionYear(t, year) || !eligible(t, sel.rung, evo.age, nation ? teamName(nation) : undefined)) continue;
          // v2.78: a primeira Copa abre a Copa, antes das decisões dela
          if (t === 'copaDoMundo' && clubId && !inYouth) liveMilestones('copa', factsNow(clubId, { copa: true }), year, seasonAge);
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
          natYear = addTournament(natYear, { tournament: t, stage: res.stage, matches: res.matches, principal: tcfg.torneios[t].degrau === 'principal', rung: sel.rung as CalledRung }, position, ov(evo), natRng);
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
    let seasonGoals = 0;
    let seasonAssists = 0;
    let seasonGames = 0;
    let seasonCleanSheets = 0;
    if (clubId && !inYouth) {
      const raw = seasonStats({ position, overall: ov(evo), minutes: avgMinutes, league, teamResult, setPieceTaker: traits.traits.includes('cobrador') }, yr);
      // T25c: cobrador do time (marco "assumir a bola parada") faz alguns gols a mais; o goleiro cobrador segue stats.json
      const st = cobradorClub === clubId && position !== 'goleiro' ? { ...raw, goals: Math.round(raw.goals * (1 + EFFECTS.cobradorGolsExtra)) } : raw;
      seasonGoals = st.goals;
      seasonAssists = st.assists;
      seasonGames = st.games;
      seasonCleanSheets = st.cleanSheets;
      goalsAtClub[clubId] = (goalsAtClub[clubId] ?? 0) + st.goals;
      stats = addStats(stats, st);
      const won = seasonAwards({
        age: evo.age - 1, overall: ov(evo), form, minutes: avgMinutes, league, goals: st.goals,
        titles: titles.filter((t) => t.year === year).map((t) => t.competition), worldCup,
      }, yr);
      for (const award of won) if (award !== 'revelacao' || !awards.some((a) => a.award === 'revelacao')) awards.push({ year, award });
    }
    seasons.push({ year, age: evo.age - 1, clubId: seasonClub, division: league, minutes: avgMinutes, overall: ov(evo), games: seasonGames, goals: seasonGoals, assists: seasonAssists, cleanSheets: seasonCleanSheets, ...(natYear ? { selecao: natYear } : {}) });
    if (natYear) {
      selection.games += natYear.games; selection.goals += natYear.goals; selection.assists += natYear.assists; selection.mainGames += natYear.mainGames;
    }
    if (clubId && !inYouth) {
      ultimaTemporada = summarizeSeason({
        year, age: evo.age - 1, clubId: seasonClub, division: league, games: seasonGames, goals: seasonGoals, assists: seasonAssists, cleanSheets: seasonCleanSheets, goleiro: position === 'goleiro', minutes: avgMinutes,
        overallBefore: ovStart, overallAfter: ov(evo), attrsBefore: attrsStart, attrsAfter: evo.attributes, titles: titles.filter((t) => t.year === year).map((t) => t.competition),
      });
    }

    // Camisa 10 e faixa do clube por evento.
    if (clubId && !inYouth) {
      seasonsAtClub++;
      const squad = squadLevel(effectiveRep(clubId));
      const idolatry = idol[clubId] ?? 0;
      if (canGetTen({ overall: ov(evo), squadLevel: squad, idolatry })) wearsTen = true;
      if (canGetArmband({ overall: ov(evo), squadLevel: squad, idolatry, age: evo.age, seasonsAtClub, temperament: temp })) { captain = true; captainAt.add(clubId); }
    }

    // Marcos da carreira (6.13b): as primeiras vezes da temporada viram decisões, na ordem de prioridade dos dados (até o limite por temporada).
    if (clubId && !inYouth) {
      proSeasons++;
      const wonThisYear = titles.some((t) => t.year === year && t.clubId === clubId);
      if (!wonThisYear && cdb.runnerUp === clubId && avgMinutes >= cfg.minutosParaTitulo) remember('perdeuFinal', clubId);
      const facts: MilestoneFacts = {
        clubId, proDebut: proSeasons === 1, clubDebut: seasonsAtClub === 1, titular: avgMinutes >= FACTS.titularMinutos,
        golsAno: seasonGoals, golsCarreira: stats.goals, assistenciasCarreira: stats.assists, golsNoClube: goalsAtClub[clubId] ?? 0,
        cobrador: cobradorClub === clubId || traits.traits.includes('cobrador'), titulosCarreira: titles.length,
        finalAno: wonThisYear || cdb.runnerUp === clubId, classico: derbyYear, capitao: captainAt.has(clubId), camisa10: wearsTen,
        convocado: Object.values(selection.callUps).some((n) => n > 0), jogosSelecao: selection.caps,
        golsSelecaoAno: natYear?.mainGoals ?? 0,
        copa: worldCup !== null, exterior: !BRAZIL.has(clubId), estreouSelecao: selection.caps > 0,
      };
      liveMilestones('fim', facts, year, seasonAge);
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
    } else if (saleTarget) {
      // v2.64: a venda aceita leva exatamente ao clube comprador, com o contrato da proposta
      join(saleTarget.clubId, false, yr, saleTarget);
      salaryDelays = 0;
      if (saleTarget.rivalOfCurrent) remember('trocouPeloRival', saleTarget.clubId);
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
      const cardContext = (o: Offer) => cardContextOf(o, current?.annualSalaryBRL ?? null);
      const canForce = !!c && c.years > 1;
      // T28j (v2.54): o clube atual é o primeiro cartão; com o contrato no fim, a renovação (e o pedido de aumento) saem dele.
      const due = !!c && c.years - 1 <= 1;
      const atualCard = (): CurrentClubView => currentCard(c!, due);
      let renewChoice: string | null = null; // saída forçada só com contrato por mais de um ano
      if (!goingHome && !farewell && !transferAsked) {
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
          // T25d: a janela trouxe proposta de clube europeu e o jogador não foi para a Europa
          const isEurope = (id: string) => EURO_LEAGUE.has(id) || UEFA_POOL.has(id);
          if (shown.some((o) => isEurope(o.clubId)) && !(pick && isEurope(pick.clubId))) remember('recusouEuropa', clubId!);
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
        if (pick.rivalOfCurrent) remember('trocouPeloRival', pick.clubId);
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
    player, spells, titles, peakOverall, peakAge, peakAttributes, peakClubId: peakClubId ?? spells[0]?.clubId ?? '', endAge: evo.age, wearsTen: tenShirt, captain, idolatry: idol, negotiations, forcedExits,
    celebration, mentality, wealthBRL: Math.max(0, wealth), agentProfile: agent.profile, contracts, injuries, finalPosition: position, positionChanges, selection, stats, awards, retirement, farewell, cards, finalTemperament: temp, houseBought, discipline, seasons, earnedBRL: earned, decisiveDerbies, marcos, memorias,
  };
  // Sorteios novos ficam por último para não alterar nenhum resultado anterior da mesma semente.
  const nickname = generateNickname(player, rng);
  const legacy = legacyOf(result);
  return { ...result, honors: honorsOf(honorFacts(result)), nickname, legacy, ...headlineOf({ player, nickname, legacy, celebration }, rng) };
}
