import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import type { SeasonSummary } from '../../engine/seasonSummary';
import type { MeetingOptions } from '../../engine/meetingOptions';
import type { ProposalView } from '../../engine/proposals';
import { t } from '../../i18n';
import { Propostas } from './Propostas';
import { Reuniao, ReuniaoResposta } from './Reuniao';
import { ResumoTemporada } from './ResumoTemporada';

// v2.81 (direção "Álbum", PR 2): o resumo da temporada, a resposta da reunião e as propostas (transferência, empréstimo e
// renovação) são cards que sobem do pé por cima da página da história ("folha"), não telas soltas. A reunião e as
// propostas ganham a linha da página, como a decisão.
afterEach(cleanup);

const PLAYER = { name: 'Dudu', position: 'meia', clubId: 'santos', overall: 74, titles: [] as string[], role: 'titularRegular', monthlySalary: { amount: 180_000, currency: 'BRL' as const } };
const RESUMO: SeasonSummary = {
  year: 2032, age: 24, clubId: 'santos', division: 'BRA-A', partidas: 34, gols: 9, assistencias: 5, semSofrerGol: 0, goleiro: false, overallDe: 72, overallPara: 76, pct: 6,
  mudancas: [], titulos: [], comentario: { evolucao: 'grande', minutos: 'muitos', destaque: null, titulo: false },
};
const IDEIAS: MeetingOptions = {
  obvia: { proposal: { main: 'fisico', secondary: 'passe' }, agrado: 'muito' },
  mescla: { proposal: { main: 'fisico', secondary: 'drible' }, agrado: 'possivel' },
  ousada: { proposal: { main: 'drible', secondary: 'finalizacao' }, agrado: 'pouco' },
};
const PROPOSTA: ProposalView = {
  clubId: 'porto', league: 'POR', currency: 'EUR', annualSalary: 1_140_000, years: 3, role: 'titularRegular', staffQuality: 1.1, offAxis: false,
  minutosFaixa: 'muitos', nivelClube: 'alta', marca: null, salarioMensal: 95_000, salarioPct: { pct: 140, sentido: 'sobe' }, valorProjetadoEUR: 9_500_000, valorPct: { pct: 15, sentido: 'sobe' }, minutosVs: 'mais',
};
const PAGINA = { ano: 2032, numero: 7 };
const scene = { src: 'c.webp', alt: 'cena' };
const css = (f: string) => readFileSync(resolve(__dirname, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

describe('cards sobre a história (v2.81)', () => {
  it('resumo da temporada: folha que sobe do pé, por cima da página', () => {
    render(<ResumoTemporada resumo={RESUMO} onClose={() => {}} />);
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveClass('folha');
    expect(dialog.parentElement).toHaveClass('folha__fundo');
  });

  it('resposta da reunião: a mesma folha', () => {
    render(<ReuniaoResposta resposta={{ response: 'aceita', focus: { main: 'passe', secondary: 'drible' } }} onDone={() => {}} />);
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveClass('folha');
    expect(dialog.parentElement).toHaveClass('folha__fundo');
  });

  it('propostas: os cartões sobem numa folha por cima da página; a cena fica atrás, escurecida', () => {
    render(<Propostas propostas={[PROPOSTA]} podeFicar player={PLAYER} age={24} progress={0.4} pagina={PAGINA} scene={scene} onChoose={() => {}} />);
    expect(screen.getByRole('group', { name: t('ui.proposta.cartoes') }).closest('form')).toHaveClass('folha', 'folha--pagina');
    expect(document.querySelector('.decisao__foto')).toHaveClass('decisao__foto--atras');
  });

  it('reunião e propostas têm a linha da página', () => {
    render(<Reuniao ideias={IDEIAS} player={PLAYER} age={24} progress={0.4} semestre={1} pagina={PAGINA} scene={scene} onChoose={() => {}} />);
    expect(document.querySelector('.pagina__topo')).toHaveTextContent(t('ui.pagina.numero', { n: 7 }));
    cleanup();
    render(<Propostas propostas={[PROPOSTA]} podeFicar player={PLAYER} age={24} progress={0.4} pagina={PAGINA} scene={scene} onChoose={() => {}} />);
    expect(document.querySelector('.pagina__topo')).toHaveTextContent(t('ui.pagina.temporada', { ano: 2032 }));
  });

  it('a folha sobe em 250 ms e desce em 150 ms; reta, sem rebote', () => {
    const f = css('../folha.css');
    expect(f).toMatch(/\.folha \{[^}]*animation:\s*folha-sobe 250ms ease-out/);
    expect(f).toMatch(/\[data-saindo\] \.folha \{[^}]*animation:\s*folha-desce 150ms ease-out/);
    expect(f).toMatch(/@keyframes folha-sobe \{ from \{ transform: translateY\(100%\); \}/);
    expect(f).not.toMatch(/rotate/);
  });
});

// v2.81: a folha entra deslizando de baixo (translateY 100%); o foco no título ao abrir não pode rolar a página até a posição
// de entrada da folha (no ritmo, a página ficava rolada ~460 px depois da animação)
describe('foco ao abrir uma folha não rola a página (v2.81)', () => {
  it('ritmo, propostas e resumo focam sem rolar', async () => {
    const { Ritmo } = await import('./Ritmo');
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    render(<Ritmo onChoose={() => {}} onBack={() => {}} />);
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    cleanup();
    render(<Propostas propostas={[PROPOSTA]} podeFicar player={PLAYER} age={24} progress={0.4} scene={scene} onChoose={() => {}} />);
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    cleanup();
    render(<ResumoTemporada resumo={RESUMO} onClose={() => {}} />);
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    focus.mockRestore();
  });
});
