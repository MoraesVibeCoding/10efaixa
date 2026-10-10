import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import events from '../../data/events.json';
import previewCfg from '../../data/preview.json';
import { runUntilDecision } from '../../state/careerRun';
import type { CreationInput } from '../../engine/player';
import { t } from '../../i18n';
import { toDecisionPlayer } from './careerView';
import { Decision } from './Decision';

// Pedidos do usuário (2026-10-10) depois do PR 3 do Álbum:
// 1. "Não deveria ser necessário confirmar de novo": tocar numa opção marca e, se ele não trocar em 1 s, ela vale sozinha;
//    tocar de novo na marcada decide na hora. O botão "Confirmar escolha" sai.
// 2. "Quando o texto é muito grande e faz a página descer, a fonte deveria diminuir": o texto encolhe até caber.
// 3. Eventos da Seleção dizem a categoria (Sub-17, Sub-20, olímpica); na principal, nada.
afterEach(cleanup);
const EVENT = 'salario-atrasado';
const [A, B] = events.eventos.find((e) => e.id === EVENT)!.opcoes.map((o) => o.id);
const PLAYER = { name: 'Zé', position: 'meia', clubId: 'santos', overall: 70, titles: [], role: 'titularRegular', monthlySalary: { amount: 1, currency: 'BRL' as const } };
const option = (id: string) => screen.getByRole('button', { name: new RegExp(t(`events.${EVENT}.opcoes.${id}`)) });
const css = readFileSync(resolve(__dirname, 'Decision.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

describe('1. a marcada vale sozinha em 2 s (sem "Confirmar escolha")', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });
  const show = () => { const onChoose = vi.fn(); render(<Decision eventId={EVENT} age={24} progress={0.4} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} onChoose={onChoose} />); return onChoose; };

  it('o tempo vem dos dados (2 s) e não há mais o botão de confirmar', () => {
    // pedido do usuário: subir de 1 s para 2 s antes de mesclar
    expect(previewCfg.decideMs).toBe(2000);
    show();
    expect(screen.queryByRole('button', { name: /Confirmar escolha/i })).toBeNull();
  });

  it('marcar e esperar o tempo decide; antes disso, não', () => {
    const onChoose = show();
    fireEvent.click(option(A!));
    expect(option(A!)).toHaveAttribute('aria-pressed', 'true');
    act(() => { vi.advanceTimersByTime(previewCfg.decideMs - 1); });
    expect(onChoose).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1); });
    expect(onChoose).toHaveBeenCalledWith(A);
  });

  it('trocar de opção recomeça o tempo; vale a última', () => {
    const onChoose = show();
    fireEvent.click(option(A!));
    act(() => { vi.advanceTimersByTime(previewCfg.decideMs - 400); });
    fireEvent.click(option(B!));
    act(() => { vi.advanceTimersByTime(previewCfg.decideMs - 1); });
    expect(onChoose).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1); });
    expect(onChoose).toHaveBeenCalledOnce();
    expect(onChoose).toHaveBeenCalledWith(B);
  });

  it('tocar de novo na marcada decide na hora', () => {
    const onChoose = show();
    fireEvent.click(option(A!));
    fireEvent.click(option(A!));
    expect(onChoose).toHaveBeenCalledWith(A);
    act(() => { vi.advanceTimersByTime(previewCfg.decideMs); });
    expect(onChoose).toHaveBeenCalledOnce();
  });

  it('a marcada mostra o tempo correndo (barra), que some sem movimento', () => {
    show();
    fireEvent.click(option(A!));
    expect(option(A!).querySelector('.opcao__prazo')).not.toBeNull();
    expect(css).toMatch(/\.opcao__prazo \{[^}]*animation:\s*opcao-prazo var\(--decide-ms/);
  });
});

describe('2. texto longo encolhe em vez de a página rolar', () => {
  it('a decisão mede se transborda e reduz a escala do texto, nunca abaixo de 14 px', () => {
    expect(css).toMatch(/\.decisao__historia \{[^}]*font-size:\s*max\(0\.875rem, calc\(var\(--tipo-historia\) \* var\(--texto-escala, 1\)\)\)/);
    expect(css).toMatch(/\.opcao__rotulo \{[^}]*font-size:\s*max\(0\.875rem, calc\(var\(--tipo-opcao\) \* var\(--texto-escala, 1\)\)\)/);
  });

  it('com a página mais alta que a tela, a escala desce até caber', () => {
    const alturas = { tela: 600, pagina: 900 };
    vi.stubGlobal('innerHeight', alturas.tela);
    const sh = vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockImplementation(() => alturas.pagina);
    render(<Decision eventId={EVENT} age={24} progress={0.4} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const escala = Number((screen.getByRole('main') as HTMLElement).style.getPropertyValue('--texto-escala'));
    expect(escala).toBeLessThan(1);
    expect(escala).toBeGreaterThanOrEqual(0.8);
    sh.mockRestore();
    vi.unstubAllGlobals();
  });
});

describe('3. categoria da Seleção nos eventos dela', () => {
  it('Sub-20 aparece acima do título; sem categoria, nada', () => {
    render(<Decision eventId="primeira-convocacao" age={18} progress={0.1} player={{ ...PLAYER, categoriaSelecao: 'sub20' }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    expect(document.querySelector('.decisao__categoria')).toHaveTextContent(t('ui.linhaDoTempo.selecao.degrau.sub20'));
    cleanup();
    render(<Decision eventId="primeira-convocacao" age={18} progress={0.1} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} />);
    expect(document.querySelector('.decisao__categoria')).toBeNull();
  });

  it('toDecisionPlayer: categoria só em evento da Seleção e só nos degraus de base', () => {
    const INPUT: CreationInput = {
      name: 'Dudu', shirtNumber: 11, state: 'BA', position: 'meia', archetypeId: 'classico10', biotype: { heightCm: 180, build: 'atletico' },
      temperament: 'frio', origin: 'baseGrande', foot: 'direita', heartClub: null,
    };
    const step = runUntilDecision(INPUT, 3, []);
    if (step.kind !== 'decision') throw new Error('esperava decisão');
    const LOOK = { skin: 't6', hairStyle: 'curto', hairColor: 'preto', beard: null, headband: null, boots: 'preta' };
    const com = (degrau: string, id: string) => toDecisionPlayer({ ...step.view, selecaoDegrau: degrau as never }, INPUT, LOOK, undefined, id).categoriaSelecao;
    expect(com('sub17', 'primeira-convocacao')).toBe('sub17');
    expect(com('olimpica', 'copa-penalti')).toBe('olimpica');
    expect(com('titular', 'primeira-convocacao')).toBeUndefined();
    expect(com('sub20', EVENT)).toBeUndefined();
  });
});
