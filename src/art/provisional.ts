// T47: arte provisória em SVG, no formato final (briefing 4–5), gerada por script determinístico. Visual propositalmente simples.
export interface ProvisionalInput {
  scenes: { cenas: string[]; poses: string[]; detalhes: string[]; trofeus: string[]; definicoes: Record<string, { pose: string; companheiros: number }> };
  styles: { hair: string[]; beards: string[]; expressions: string[] };
  celebrations: string[];
  /** Clubes com emblema próprio (src/data/emblems.json); todo o resto usa o escudo genérico. */
  emblems: string[];
}

const K = { pele: '#FF00FF', peleS: '#B000B0', u1: '#00FF00', u1s: '#00B000', u2: '#0000FF', u2s: '#0000B0', cab: '#FF8000', cabS: '#B05800', boot: '#00FFFF', acc: '#FFFF00' };
const P = { cal: '#F2F4EF', mar: '#14213D', ama: '#FFC21A', ver: '#1E7B4F', verm: '#D62839', cin: '#C9CFC6' };
const svg = (vb: string, body: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>\n`;
const rot = (a: number, x: number, y: number) => (a ? ` transform="rotate(${a} ${x} ${y})"` : '');
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const rect = (x: number, y: number, w: number, h: number, fill: string, rx = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx ? ` rx="${rx}"` : ''} fill="${fill}"${extra}/>`;

// ---------- corpo ----------
interface PoseSpec { aB: number; aF: number; lB: number; lF: number; angle: string; headY?: number }
const POSES: Record<string, PoseSpec> = {
  'em-pe': { aB: 0, aF: 0, lB: 0, lF: 0, angle: 'frente' },
  correndo: { aB: -40, aF: 40, lB: -30, lF: 25, angle: 'tres-quartos' },
  chutando: { aB: -30, aF: 30, lB: 5, lF: -55, angle: 'perfil' },
  cabeceando: { aB: 50, aF: -50, lB: 20, lF: -20, angle: 'perfil' },
  comemorando: { aB: 150, aF: -150, lB: 10, lF: -10, angle: 'frente' },
  'goleiro-mergulhando': { aB: 120, aF: -120, lB: 70, lF: -60, angle: 'tres-quartos' },
  sentado: { aB: 10, aF: -10, lB: -90, lF: -90, angle: 'tres-quartos' },
  'aperto-de-mao': { aB: 0, aF: -80, lB: 0, lF: 0, angle: 'perfil' },
  'erguendo-taca': { aB: 160, aF: -160, lB: 5, lF: -5, angle: 'frente' },
  cabisbaixo: { aB: 0, aF: 0, lB: 0, lF: 0, angle: 'frente', headY: 150 },
};
const GOALKEEPER_POSES = ['em-pe', 'correndo', 'goleiro-mergulhando', 'sentado', 'erguendo-taca', 'cabisbaixo'];
const arm = (id: string, x: number, px: number, a: number, skin = true) =>
  `<g id="${id}" data-pivo="${px},305"><g${rot(a, px, 305)}>${rect(x, 300, 40, 190, K.pele, 20)}${skin ? rect(x, 300, 40, 70, K.u1, 20) : ''}</g></g>`;
const leg = (id: string, x: number, px: number, a: number) =>
  `<g id="${id}" data-pivo="${px},520"><g${rot(a, px, 520)}>${rect(x, 520, 50, 260, K.pele, 14)}${rect(x, 660, 50, 80, K.u1)}${rect(x - 5, 740, 60, 40, K.boot, 12)}</g></g>`;

function pose(id: string, s: PoseSpec): string {
  const gk = GOALKEEPER_POSES.includes(id)
    ? `<g id="mangas-longas"><g${rot(s.aB, 150, 305)}>${rect(130, 300, 40, 190, K.u1, 20)}</g><g${rot(s.aF, 250, 305)}>${rect(230, 300, 40, 190, K.u1, 20)}</g></g>`
      + `<g id="luvas"><g${rot(s.aB, 150, 305)}>${rect(128, 465, 44, 34, K.u2, 14)}</g><g${rot(s.aF, 250, 305)}>${rect(228, 465, 44, 34, K.u2, 14)}</g></g>`
    : '';
  return svg('0 0 400 800',
    arm('braco-tras', 130, 150, s.aB) + leg('perna-tras', 155, 180, s.lB)
    + `<g id="tronco">${rect(140, 290, 120, 170, K.u1, 26)}${rect(140, 420, 120, 40, K.u1s)}${rect(145, 440, 110, 100, K.u2, 14)}${rect(145, 510, 110, 30, K.u2s, 10)}</g>`
    + `<g id="pescoco">${rect(185, 255, 30, 45, K.pele)}${rect(185, 285, 30, 15, K.peleS)}</g>`
    + leg('perna-frente', 195, 220, s.lF) + arm('braco-frente', 230, 250, s.aF) + gk
    + `<g id="cabeca-ancora" data-angulo="${s.angle}">${rect(150, s.headY ?? 110, 100, 150, 'none')}</g>`);
}

const PATTERNS: Record<string, string> = {
  lisa: '',
  'listras-verticais': [150, 178, 206, 234].map((x) => rect(x, 292, 14, 150, K.u2)).join(''),
  'faixa-diagonal': `<path d="M140 380 L260 330 L260 372 L140 422Z" fill="${K.u2}"/>`,
  metade: rect(200, 292, 60, 150, K.u2, 0),
  'gola-contraste': `<path d="M175 290 L225 290 L200 330Z" fill="${K.u2}"/>${rect(140, 440, 120, 8, K.u2)}`,
};
const uniforme = (name: string) => svg('0 0 400 800', `<g id="padrao">${PATTERNS[name]}</g>`);

interface CelSpec { aB: number; aF: number; extra?: string }
const CELEBRATIONS: Record<string, CelSpec> = {
  aviaozinho: { aB: 90, aF: -90 },
  dancinha: { aB: 140, aF: -30 },
  'punho-cerrado': { aB: 0, aF: -160, extra: `<circle cx="214" cy="120" r="16" fill="${K.pele}"/>` },
  'coracao-maos': { aB: 70, aF: -70, extra: `<path d="M200 380 C170 350 160 400 200 420 C240 400 230 350 200 380Z" fill="${P.verm}"/>` },
  cambalhota: { aB: 170, aF: -170 },
  'aponta-ceu': { aB: 0, aF: -170, extra: rect(279, 20, 8, 40, K.pele, 4) },
  'beija-alianca': { aB: 0, aF: -150, extra: `<circle cx="226" cy="190" r="9" fill="none" stroke="${P.ama}"/>` },
  'chuteira-telefone': { aB: 0, aF: -140, extra: rect(240, 150, 56, 28, K.boot, 10) },
};
const comemoracao = (c: CelSpec) => svg('0 0 400 800', arm('braco-tras', 130, 150, c.aB) + arm('braco-frente', 230, 250, c.aF) + (c.extra ?? ''));

// ---------- cabeça (viewBox 100 × 150) ----------
const VB_HEAD = '0 0 100 150';
const CX: Record<string, number> = { frente: 50, 'tres-quartos': 54, perfil: 46 };
const SHIFT: Record<string, string> = { frente: '', 'tres-quartos': 'translate(4 0)', perfil: 'translate(10 0) scale(0.85 1)' };
const wrap = (angle: string, body: string) => (SHIFT[angle] ? `<g transform="${SHIFT[angle]}">${body}</g>` : body);

const rosto = (a: string) => svg(VB_HEAD, `<g id="cabeca">${wrap(a, `<ellipse cx="50" cy="80" rx="40" ry="55" fill="${K.pele}"/>${rect(4, 74, 10, 24, K.pele, 5)}${rect(86, 74, 10, 24, K.pele, 5)}<ellipse cx="50" cy="128" rx="30" ry="14" fill="${K.peleS}" opacity="0.35"/>`)}${a === 'perfil' ? `<path d="M78 76 L94 96 L78 98Z" fill="${K.pele}"/>` : ''}</g>`);
const EYES: Record<string, number[]> = { frente: [34, 66], 'tres-quartos': [40, 70], perfil: [66] };
function expressao(a: string, e: string): string {
  const c = CX[a]!;
  const eyes = EYES[a]!.map((x) => `<circle cx="${x}" cy="72" r="5" fill="${P.mar}"/>`).join('');
  const brows = e === 'concentrada' ? EYES[a]!.map((x) => `<path d="M${x - 9} 58 L${x + 9} 62" stroke="${P.mar}" stroke-width="4"/>`).join('') : '';
  const mouth = { neutra: `M${c - 14} 106 L${c + 14} 106`, alegre: `M${c - 16} 100 Q${c} 124 ${c + 16} 100`, triste: `M${c - 14} 108 Q${c} 94 ${c + 14} 108`, concentrada: `M${c - 12} 106 L${c + 12} 104` }[e] ?? '';
  return svg(VB_HEAD, `<g id="expressao">${wrap(a, eyes + brows + `<path d="${mouth}" stroke="${P.mar}" stroke-width="5" stroke-linecap="round" fill="none"/>`)}</g>`);
}
const CAP = `M8 72 Q50 -6 92 72 Q74 40 50 40 Q26 40 8 72Z`;
const bumps = (r: number, ys: number[]) => ys.flatMap((y, i) => [14, 32, 50, 68, 86].map((x) => `<circle cx="${x + (i % 2) * 6}" cy="${y}" r="${r}" fill="${K.cab}"/>`)).join('');
const HAIR: Record<string, { tras?: string; frente: string }> = {
  raspado: { frente: `<path d="M12 66 Q50 18 88 66 Q70 56 50 56 Q30 56 12 66Z" fill="${K.cab}"/>` },
  curto: { frente: `<path d="${CAP}" fill="${K.cab}"/>` },
  cacheado: { frente: `<path d="${CAP}" fill="${K.cab}"/>${bumps(9, [30, 44])}` },
  crespo: { frente: `<path d="${CAP}" fill="${K.cab}"/>${bumps(11, [24, 38])}` },
  'black-power': { tras: `<circle cx="50" cy="50" r="52" fill="${K.cabS}"/>`, frente: `<path d="${CAP}" fill="${K.cab}"/>` },
  dread: { tras: [8, 22, 36, 50, 64, 78].map((x) => rect(x, 40, 11, 95, K.cabS, 5)).join(''), frente: `<path d="${CAP}" fill="${K.cab}"/>` },
  moicano: { frente: `${rect(43, 0, 14, 62, K.cab, 7)}${rect(38, 40, 24, 12, K.cabS, 5)}` },
  longo: { tras: `<path d="M4 60 Q50 -10 96 60 L100 148 L0 148Z" fill="${K.cabS}"/>`, frente: `<path d="${CAP}" fill="${K.cab}"/>` },
};
const ENTRADAS = `<path d="M8 72 L26 48 L32 76Z" fill="${K.pele}"/><path d="M92 72 L74 48 L68 76Z" fill="${K.pele}"/>`;
const cabelo = (a: string, style: string, entradas: boolean) => {
  const h = HAIR[style]!;
  return svg(VB_HEAD, `<g id="cabelo-tras">${wrap(a, h.tras ?? '')}</g><g id="cabelo-frente">${wrap(a, h.frente + (entradas ? ENTRADAS : ''))}</g>`);
};
const BEARDS: Record<string, string> = {
  rala: `<path d="M12 90 Q50 160 88 90 L88 108 Q50 150 12 108Z" fill="${K.cab}" opacity="0.5"/>`,
  cavanhaque: `<ellipse cx="50" cy="120" rx="10" ry="14" fill="${K.cab}"/>`,
  bigode: `<path d="M30 92 Q50 84 70 92 Q50 100 30 92Z" fill="${K.cab}"/>`,
  cheia: `<path d="M10 88 Q50 168 90 88 L90 112 Q50 152 10 112Z" fill="${K.cab}"/>`,
};
const barba = (a: string, b: string) => svg(VB_HEAD, `<g id="barba">${wrap(a, BEARDS[b]!)}</g>`);
const rugas = (a: string) => svg(VB_HEAD, `<g id="rugas">${wrap(a, [48, 56, 64].map((y) => `<path d="M24 ${y} Q50 ${y - 6} 76 ${y}" stroke="${P.mar}" stroke-width="2" fill="none" opacity="0.4"/>`).join(''))}</g>`);
const acessorio = (a: string) => svg(VB_HEAD, `<g id="acessorio">${wrap(a, rect(6, 52, 88, 12, K.acc, 6))}</g>`);

// ---------- detalhes (viewBox 100 × 100) ----------
const VB_DET = '0 0 100 100';
const cup = (scale: number, stars: number, band: boolean) =>
  `<g transform="translate(${50 - 50 * scale} ${50 - 50 * scale}) scale(${scale})"><path d="M28 14 H72 V44 Q72 66 50 70 Q28 66 28 44Z" fill="${P.ama}"/><path d="M28 22 Q8 22 12 42 Q16 52 30 50" fill="none" stroke="${P.ama}" stroke-width="6"/><path d="M72 22 Q92 22 88 42 Q84 52 70 50" fill="none" stroke="${P.ama}" stroke-width="6"/>${rect(44, 68, 12, 14, P.ama)}${rect(32, 82, 36, 10, P.mar, 3)}${band ? rect(28, 36, 44, 6, P.mar) : ''}${Array.from({ length: stars }, (_, i) => `<circle cx="${50 + (i - (stars - 1) / 2) * 12}" cy="28" r="3.5" fill="${P.mar}"/>`).join('')}</g>`;
const globe = `<circle cx="50" cy="38" r="26" fill="${P.ama}"/><path d="M26 38 H74 M50 12 V64" stroke="${P.mar}" stroke-width="3" fill="none"/>${rect(44, 62, 12, 14, P.ama)}${rect(30, 76, 40, 12, P.mar, 3)}`;
const salver = `<ellipse cx="50" cy="56" rx="42" ry="14" fill="${P.ama}"/><ellipse cx="50" cy="52" rx="32" ry="8" fill="${P.cal}"/>${rect(44, 66, 12, 14, P.ama)}${rect(32, 80, 36, 10, P.mar, 3)}`;
const ball = `<circle cx="50" cy="44" r="28" fill="${P.ama}"/><path d="M50 30 L62 40 L57 54 H43 L38 40Z" fill="${P.mar}"/>${rect(36, 76, 28, 12, P.mar, 3)}`;
const medal = `<path d="M34 6 L50 40 L66 6Z" fill="${P.verm}"/><circle cx="50" cy="58" r="26" fill="${P.ama}"/><circle cx="50" cy="58" r="16" fill="none" stroke="${P.mar}" stroke-width="3"/>`;
const glove = `<rect x="30" y="30" width="40" height="46" rx="12" fill="${P.ama}"/>${[32, 44, 56].map((x) => rect(x, 12, 9, 26, P.ama, 4)).join('')}${rect(34, 76, 32, 12, P.mar, 3)}`;
const star = `<path d="M50 8 L61 36 L92 38 L68 58 L76 88 L50 72 L24 88 L32 58 L8 38 L39 36Z" fill="${P.ama}"/>`;
const TROPHY: Record<string, string> = {
  estadual: cup(0.7, 0, false), 'serie-a': cup(1, 1, false), 'serie-b': cup(0.9, 0, true), 'serie-c': cup(0.8, 0, true), 'serie-d': cup(0.7, 0, true),
  'copa-do-brasil': salver, 'copa-do-nordeste': cup(0.8, 3, false), 'continental-principal': cup(1, 3, true), 'continental-secundaria': cup(0.9, 2, true),
  'copa-do-mundo': globe, 'copa-america': cup(0.9, 2, false), 'olimpiadas-medalha': medal, 'liga-europeia': cup(1, 2, false),
  'copa-europeia': cup(1, 3, false), 'premio-melhor-jogador': ball, 'premio-artilheiro': ball + `<circle cx="80" cy="20" r="6" fill="${P.mar}"/>`,
  'premio-melhor-goleiro': glove, 'premio-revelacao': star,
};
const DETAIL: Record<string, string> = {
  taca: cup(1, 0, false),
  bola: `<circle cx="50" cy="50" r="34" fill="${P.cal}" stroke="${P.mar}" stroke-width="4"/><path d="M50 30 L66 42 L60 62 H40 L34 42Z" fill="${P.mar}"/>`,
  placar: `${rect(4, 24, 92, 52, P.mar, 6)}${rect(22, 36, 14, 28, P.cal)}${rect(64, 36, 14, 28, P.cal)}${rect(46, 48, 8, 4, P.ama)}`,
  'faixa-capitao': `${rect(10, 36, 80, 28, P.ama, 8)}${rect(10, 46, 80, 4, P.mar)}`,
  bandeirao: `${rect(14, 6, 6, 90, P.mar)}${rect(20, 12, 66, 44, K.u1)}${rect(20, 28, 66, 12, K.u2)}`,
  microfone: `<circle cx="50" cy="28" r="18" fill="${P.cin}"/>${rect(44, 44, 12, 46, P.mar, 5)}`,
  celular: `${rect(30, 8, 40, 84, P.mar, 8)}${rect(35, 18, 30, 56, P.cal, 3)}`,
  maca: `${rect(6, 40, 88, 14, P.cin, 4)}${rect(14, 54, 6, 30, P.mar)}${rect(80, 54, 6, 30, P.mar)}<circle cx="17" cy="88" r="7" fill="${P.mar}"/><circle cx="83" cy="88" r="7" fill="${P.mar}"/>`,
  'contrato-caneta': `${rect(16, 10, 56, 80, P.cal, 3)}${[26, 38, 50, 62].map((y) => rect(24, y, 40, 4, P.mar)).join('')}<path d="M60 80 L90 36 L96 40 L66 84Z" fill="${P.ama}"/>`,
  mala: `${rect(14, 30, 72, 56, P.ver, 8)}${rect(36, 14, 28, 16, 'none')}<path d="M36 30 V18 H64 V30" fill="none" stroke="${P.mar}" stroke-width="5"/>${rect(14, 54, 72, 5, P.mar)}`,
};

// ---------- cenários (viewBox 1000 × 600) ----------
const stands = () => rect(0, 150, 1000, 260, P.cin) + Array.from({ length: 25 }, (_, i) => rect(i * 40, 190 + (i % 3) * 50, 36, 28, i % 2 ? K.u1 : K.u2, 8)).join('');
const GROUND = (y: number, c: string) => rect(0, y, 1000, 600 - y, c) + rect(0, y - 4, 1000, 8, P.cal);
const goal = rect(300, 230, 400, 8, P.cal) + rect(300, 230, 8, 170, P.cal) + rect(692, 230, 8, 170, P.cal);
const SCENES: Record<string, [string, string]> = {
  varzea: [rect(0, 0, 1000, 600, P.cal), GROUND(400, P.ver) + rect(80, 300, 8, 100, P.mar) + rect(240, 300, 8, 100, P.mar)],
  'rua-do-bairro': [rect(0, 0, 1000, 600, P.cal), rect(0, 420, 1000, 180, P.cin) + rect(40, 200, 220, 220, P.ama) + rect(300, 160, 260, 260, P.verm) + rect(600, 220, 340, 200, P.cin)],
  peneira: [rect(0, 0, 1000, 600, P.cal), GROUND(380, P.ver) + [100, 300, 700, 900].map((x) => `<path d="M${x} 400 l14 -36 l14 36Z" fill="${P.ama}"/>`).join('')],
  treino: [rect(0, 0, 1000, 600, P.cal), GROUND(380, P.ver) + [150, 450, 850].map((x) => `<path d="M${x} 400 l14 -36 l14 36Z" fill="${P.ama}"/>`).join('')],
  vestiario: [rect(0, 0, 1000, 600, P.cin), rect(0, 440, 1000, 160, P.mar) + [40, 200, 700, 860].map((x) => rect(x, 120, 100, 300, P.mar, 6)).join('') + rect(260, 420, 440, 30, P.cal)],
  'banco-de-reservas': [rect(0, 0, 1000, 600, P.cal), stands() + GROUND(430, P.ver) + rect(120, 400, 760, 24, P.cin)],
  'reuniao-comissao': [rect(0, 0, 1000, 600, P.cal), rect(0, 480, 1000, 120, P.cin) + rect(120, 120, 300, 180, P.mar) + rect(160, 400, 680, 30, P.mar)],
  'sala-empresario': [rect(0, 0, 1000, 600, P.cal), rect(0, 480, 1000, 120, P.cin) + rect(600, 80, 300, 220, P.cin) + rect(180, 420, 640, 36, P.mar)],
  'assinatura-contrato': [rect(0, 0, 1000, 600, P.cal), rect(0, 480, 1000, 120, P.cin) + rect(220, 430, 560, 30, P.mar) + rect(780, 120, 180, 240, P.ama)],
  aeroporto: [rect(0, 0, 1000, 600, P.cal), rect(0, 440, 1000, 160, P.cin) + rect(0, 80, 1000, 260, P.cin) + `<path d="M700 200 l200 20 l-200 30Z" fill="${P.cal}"/>`],
  estadio: [rect(0, 0, 1000, 600, P.cal), stands() + GROUND(410, P.ver)],
  gol: [rect(0, 0, 1000, 600, P.cal), stands() + GROUND(410, P.ver) + goal],
  cabecada: [rect(0, 0, 1000, 600, P.cal), stands() + GROUND(410, P.ver) + goal],
  penalti: [rect(0, 0, 1000, 600, P.cal), stands() + GROUND(410, P.ver) + goal + `<circle cx="500" cy="500" r="8" fill="${P.cal}"/>`],
  titulo: [rect(0, 0, 1000, 600, P.cal), stands() + GROUND(430, P.ver) + rect(380, 400, 240, 60, P.ama)],
  convocacao: [rect(0, 0, 1000, 600, P.cal), rect(0, 480, 1000, 120, P.cin) + rect(120, 100, 200, 140, P.ver) + rect(120, 160, 200, 20, P.ama)],
  hospital: [rect(0, 0, 1000, 600, P.cal), rect(0, 480, 1000, 120, P.cin) + rect(90, 360, 280, 40, P.cin) + `<path d="M830 90 h40 v40 h40 v40 h-40 v40 h-40 v-40 h-40 v-40 h40Z" fill="${P.verm}"/>`],
  fisioterapia: [rect(0, 0, 1000, 600, P.cal), rect(0, 480, 1000, 120, P.cin) + rect(650, 380, 300, 40, P.cin) + rect(40, 140, 12, 340, P.mar) + rect(40, 140, 220, 12, P.mar)],
  festa: [rect(0, 0, 1000, 600, P.mar), rect(0, 480, 1000, 120, P.cin) + [[120, 100, P.ama], [320, 140, K.u1], [680, 100, K.u2], [880, 150, P.ama]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="40" fill="${c}"/>`).join('')],
  entrevista: [rect(0, 0, 1000, 600, P.mar), rect(0, 480, 1000, 120, P.cin) + [0, 1, 2, 3, 4].map((i) => rect(60 + i * 180, 80, 160, 300, i % 2 ? K.u1 : P.cal)).join('')],
  classico: [rect(0, 0, 1000, 600, P.cal), stands() + GROUND(410, P.ver)],
  vaia: [rect(0, 0, 1000, 600, P.cal), stands() + GROUND(430, P.ver)],
  copa: [rect(0, 0, 1000, 600, P.cal), stands() + GROUND(410, P.ver) + [100, 400, 700].map((x) => rect(x, 60, 8, 120, P.mar) + rect(x + 8, 60, 70, 40, P.ver)).join('')],
  'casa-familia': [rect(0, 0, 1000, 600, P.cal), rect(0, 480, 1000, 120, P.cin) + rect(780, 120, 160, 220, P.ama) + rect(80, 140, 160, 160, P.cin)],
  despedida: [rect(0, 0, 1000, 600, P.cal), GROUND(430, P.ver) + rect(380, 150, 240, 280, P.mar, 120)],
};
const MATE_SLOTS: [number, number, number][] = [[90, 130, 0.9], [710, 130, 0.9], [230, 160, 0.75], [590, 160, 0.75]];
function cenario(id: string, def: { pose: string; companheiros: number }): string {
  const [fundo, meio] = SCENES[id]!;
  const slot = (name: string, x: number, y: number, h: number, esc: number, p: string) =>
    `<g id="${name}" data-escala="${esc}" data-pose-sugerida="${p}">${rect(x, y, 200, h, 'none')}</g>`;
  const mates = MATE_SLOTS.slice(0, def.companheiros).map(([x, y, e], i) => slot(`slot-companheiro-${i + 1}`, x, y, 460 - (y - 130), e, 'em-pe')).join('');
  return svg('0 0 1000 600', `<g id="fundo">${fundo}</g><g id="meio">${meio}</g>${slot('slot-jogador', 400, 120, 460, 1, def.pose)}${mates}<g id="frente">${rect(0, 580, 1000, 20, P.mar)}</g>`);
}

/** Todas as peças provisórias: caminho relativo (`categoria/arquivo.svg`) → SVG. Determinístico. */
// ---------- emblemas (viewBox 100 × 100; T49d) ----------
// uniforme1 = primeira cor da camisa, uniforme2 = segunda (ou o detalhe): o código troca pelas cores do clube.
const VB_EMB = '0 0 100 100';
const SHIELD = 'M12 8h76v44c0 22-17 36-38 44C29 88 12 74 12 52z';
const FLAME = 'M50 16c4 12 16 18 14 34-1 10-8 16-14 18-8-2-15-9-14-20 1-9 7-12 8-20 3 5 2 10 6 12 2-8-3-16 0-24z';
const HEX = 'M50 4 92 28v44L50 96 8 72V28z';
const EMBLEM: Record<string, { completo: string; simples: string }> = {
  flamengo: {
    completo: `<clipPath id="flamengo-escudo"><path d="${SHIELD}"/></clipPath><path d="${SHIELD}" fill="${K.u2}"/><g clip-path="url(#flamengo-escudo)"><path d="M0 76 100 50v8L0 84zM0 90 100 64v7L0 97z" fill="${K.u1}"/></g><path d="${FLAME}" fill="${K.u1}"/>`
      + `<path d="M50 38c3 6 8 9 7 17-1 5-4 8-7 9-4-1-7-5-7-10 0-5 4-7 5-11 1 2 1 4 3 5 0-3-2-6-1-10z" fill="${P.cal}"/><path d="${SHIELD}" fill="none" stroke="${K.u1}" stroke-width="6"/>`,
    simples: `<path d="${SHIELD}" fill="${K.u2}" stroke="${K.u1}" stroke-width="9"/><path d="${FLAME}" fill="${K.u1}"/>`,
  },
  santos: {
    completo: `<circle cx="50" cy="50" r="46" fill="${K.u2}"/><circle cx="50" cy="50" r="39" fill="none" stroke="${K.u1}" stroke-width="3"/><path d="M52 16V66H26zM57 26V66H74z" fill="${K.u1}"/>`
      + `<path d="M20 72c10-6 20 6 30 0s20-6 30 0" fill="none" stroke="${P.cin}" stroke-width="5" stroke-linecap="round"/><path d="M24 82c9-5 17 5 26 0s17-5 26 0" fill="none" stroke="${K.u1}" stroke-width="4" stroke-linecap="round"/>`,
    simples: `<circle cx="50" cy="50" r="45" fill="${K.u2}" stroke="${K.u1}" stroke-width="6"/><path d="M54 18V70H24zM60 30V70H78z" fill="${K.u1}"/>`,
  },
  palmeiras: {
    completo: `<path d="${HEX}" fill="${K.u1}"/><path d="M50 11 86 31v38L50 89 14 69V31z" fill="none" stroke="${K.u2}" stroke-width="3"/><circle cx="50" cy="30" r="12" fill="${K.u2}"/><path d="M48 36h4l2 46h-8z" fill="${K.u2}"/>`
      + `<path d="M50 38C40 26 28 28 20 36c10-2 20 0 30 4zM50 38c10-12 22-10 30-2-10-2-20 0-30 4zM50 38c-8-4-18 0-24 10 8-6 16-8 24-6zM50 38c8-4 18 0 24 10-8-6-16-8-24-6z" fill="${K.u2}"/><path d="M14 76c14-8 30-10 36-8 8-2 22 0 36 8v-4c-14-8-28-10-36-8-8-2-22 0-36 8z" fill="${K.u1s}"/>`,
    simples: `<path d="${HEX}" fill="${K.u1}" stroke="${K.u2}" stroke-width="6"/><path d="M46 40h8l3 42H43z" fill="${K.u2}"/><path d="M50 42C40 26 26 28 18 40c12-4 22-2 32 4zM50 42c10-16 24-14 32-2-12-4-22-2-32 4zM50 42c-2-12 0-20 0-26 3 9 3 18 0 26z" fill="${K.u2}"/>`,
  },
  coritiba: {
    completo: `${rect(5, 5, 90, 90, K.u1, 20)}${rect(13, 13, 74, 74, K.u2, 14)}<path d="M13 70c14-10 26-12 37-6 12-6 24-4 37 6v17H13z" fill="${K.u1s}"/>${rect(47, 30, 6, 46, K.u1)}`
      + `<path d="M28 40c4-6 14-6 20-2H28zM52 38c6-4 16-4 20 2H52zM24 52c4-6 16-6 24-2H24zM52 50c8-4 20-4 24 2H52zM36 30c4-6 12-8 14-2 2-6 10-4 14 2z" fill="${K.u1}" stroke="${K.u1}" stroke-width="5" stroke-linejoin="round"/>`,
    simples: `${rect(6, 6, 88, 88, K.u1, 20)}${rect(46, 34, 8, 48, K.u2)}<path d="M22 50c6-10 22-10 28-4H22zM50 46c6-6 22-6 28 4H50zM32 34c6-10 30-10 36 0z" fill="${K.u2}" stroke="${K.u2}" stroke-width="7" stroke-linejoin="round"/>`,
  },
  // escudo genérico (clube sem emblema próprio): formato e faixas nas cores do clube; a sigla vem do código, fora da peça
  generico: {
    completo: `<path d="M12 8h76v50c0 18-14 30-38 38C26 88 12 76 12 58z" fill="${P.cal}"/><path d="M12 8h25v66L12 58zM63 8h25v50L63 76z" fill="${K.u1}"/><path d="M37 8h26v82l-13 6-13-6z" fill="${K.u2}"/>`
      + `<path d="M12 8h76v50c0 18-14 30-38 38C26 88 12 76 12 58z" fill="none" stroke="${P.mar}" stroke-width="5"/>`,
    simples: `<path d="M12 8h38v86C26 86 12 76 12 58z" fill="${K.u1}"/><path d="M50 8h38v50c0 18-14 28-38 36z" fill="${K.u2}"/><path d="M12 8h76v50c0 18-14 30-38 38C26 88 12 76 12 58z" fill="none" stroke="${P.mar}" stroke-width="8"/>`,
  },
};

export function generateProvisional(i: ProvisionalInput): Record<string, string> {
  const out: Record<string, string> = {};
  const put = (cat: string, name: string, content: string) => { out[`${cat}/${name}.svg`] = content; };
  for (const id of i.scenes.poses) put('pose', `pose__${id}`, pose(id, POSES[id]!));
  for (const [n] of Object.entries(PATTERNS)) put('uniforme', `uniforme__${n}`, uniforme(n));
  for (const c of i.celebrations.map(kebab)) put('comemoracao', `comemoracao__${c}`, comemoracao(CELEBRATIONS[c]!));
  for (const a of ['frente', 'perfil', 'tres-quartos']) {
    put('rosto', `rosto__base__${a}`, rosto(a));
    put('rugas', `rugas__base__${a}`, rugas(a));
    put('acessorio', `acessorio__faixa-de-cabelo__${a}`, acessorio(a));
    for (const e of i.styles.expressions) put('expressao', `expressao__${e}__${a}`, expressao(a, e));
    for (const b of i.styles.beards) put('barba', `barba__${b}__${a}`, barba(a, b));
    for (const h of i.styles.hair) {
      put('cabelo', `cabelo__${h}__${a}`, cabelo(a, h, false));
      if (h !== 'raspado') put('cabelo', `cabelo__${h}-entradas__${a}`, cabelo(a, h, true));
    }
  }
  for (const id of i.scenes.cenas) put('cenario', `cenario__${id}`, cenario(id, i.scenes.definicoes[id]!));
  for (const id of i.scenes.detalhes) put('detalhe', `detalhe__${id}`, svg(VB_DET, `<g id="detalhe">${DETAIL[id]!}</g>`));
  for (const id of i.scenes.trofeus) put('detalhe', `detalhe__trofeu-${id}`, svg(VB_DET, `<g id="detalhe">${TROPHY[id]!}</g>`));
  for (const id of [...i.emblems, 'generico']) {
    for (const v of ['completo', 'simples'] as const) put('emblema', `emblema__${id}-${v}`, svg(VB_EMB, `<g id="emblema">${EMBLEM[id]![v]}</g>`));
  }
  return out;
}
