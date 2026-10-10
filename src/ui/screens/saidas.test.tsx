import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import events from '../../data/events.json';
import type { SeasonSummary } from '../../engine/seasonSummary';
import { t } from '../../i18n';
import { MOTION } from '../motion';
import { Decision } from './Decision';
import { Palco } from './Palco';
import { ResumoTemporada } from './ResumoTemporada';

// v2.72 (web-animation-design): os cards saem em 150 ms (resultado, resumo, palco, gaveta) antes de sumir; a gaveta sobe do pé;
// fundo e card entram no mesmo tempo. Pelo teclado (Esc) fecha na hora: ação de teclado não anima.
const EVENT = 'salario-atrasado';
const OPCAO = events.eventos.find((e) => e.id === EVENT)!.opcoes[0]!.id;
const PLAYER = { name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 70, titles: [], role: 'titularRegular', monthlySalary: { amount: 1, currency: 'BRL' as const } };
const RESUMO: SeasonSummary = {
  year: 2030, age: 22, clubId: 'santos', division: 'BRA-A', partidas: 34, gols: 9, assistencias: 5, semSofrerGol: 0, goleiro: false, overallDe: 70, overallPara: 74, pct: 6,
  mudancas: [], titulos: [], comentario: { evolucao: 'grande', minutos: 'muitos', destaque: 'passe', titulo: false },
};
const css = (f: string) => readFileSync(resolve(__dirname, f), 'utf8');

describe('saídas dos cards (v2.72)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
    vi.stubGlobal('requestAnimationFrame', () => 0);
    vi.stubGlobal('cancelAnimationFrame', () => {});
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it('resultado: "Seguir" marca a saída e só segue depois dela', () => {
    const onContinue = vi.fn();
    render(<Decision eventId={EVENT} age={20} progress={0.3} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} onContinue={onContinue} />);
    fireEvent.click(document.querySelector(`[data-opcao-id="${OPCAO}"]`)!);
    fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.resultado.seguir') }));
    expect(document.querySelector('.resultado')).toHaveAttribute('data-saindo');
    expect(onContinue).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(MOTION.saidaMs); });
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('resumo: "Continuar" sai antes de fechar; Esc fecha na hora', () => {
    const onClose = vi.fn();
    const { unmount } = render(<ResumoTemporada resumo={RESUMO} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.resumoTemporada.continuar') }));
    expect(document.querySelector('.resumo__fundo')).toHaveAttribute('data-saindo');
    expect(onClose).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(MOTION.saidaMs); });
    expect(onClose).toHaveBeenCalledTimes(1);
    unmount();
    const onEsc = vi.fn();
    render(<ResumoTemporada resumo={RESUMO} onClose={onEsc} />);
    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' });
    expect(onEsc).toHaveBeenCalledTimes(1);
  });

  it('palco: "Seguir" sai antes de fechar', () => {
    const onClose = vi.fn();
    render(<Palco titulos={['serieA']} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.palco.seguir') }));
    expect(document.querySelector('.palco')).toHaveAttribute('data-saindo');
    act(() => { vi.advanceTimersByTime(MOTION.saidaMs); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('gaveta "Minha carreira": o botão fecha depois da saída', () => {
    render(<Decision eventId={EVENT} age={20} progress={0.3} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} />);
    fireEvent.click(document.querySelector('.card-jogador__carreira')!);
    fireEvent.click(screen.getByRole('button', { name: t('ui.carreira.fechar') }));
    expect(document.querySelector('.gaveta')).toHaveAttribute('data-saindo');
    act(() => { vi.advanceTimersByTime(MOTION.saidaMs); });
    expect(document.querySelector('.gaveta')).toBeNull();
  });
});

describe('CSS das entradas e saídas (v2.72)', () => {
  const ms = (s: string) => Number(/(\d+)ms/.exec(s)![1]);
  const anim = (src: string, sel: string) => {
    const i = src.lastIndexOf(`\n${sel} {`);
    expect(i, sel).toBeGreaterThanOrEqual(0);
    return /animation:[^;]+/.exec(src.slice(i, src.indexOf('}', i)))![0];
  };

  it('a gaveta sobe do pé, com o fundo no mesmo tempo', () => {
    const d = css('Decision.css');
    expect(anim(d, '.gaveta__folha')).toMatch(/gaveta-sobe \d+ms ease-out/);
    expect(ms(anim(d, '.gaveta'))).toBe(ms(anim(d, '.gaveta__folha')));
  });

  it('o resumo: fundo e card no mesmo tempo', () => {
    const r = css('ResumoTemporada.css');
    expect(ms(anim(r, '.resumo__fundo'))).toBe(ms(anim(r, '.resumo')));
  });

  it('cada card tem a saída com a duração de saidaMs', () => {
    const all = css('Decision.css') + css('ResumoTemporada.css') + css('Palco.css');
    for (const sel of ['.resultado[data-saindo]', '.gaveta[data-saindo]', '.resumo__fundo[data-saindo]', '.palco[data-saindo]']) {
      expect(all, sel).toMatch(new RegExp(`${sel.replace(/[[\]]/g, '\\$&')} \\{[^}]*animation:[^;]*${MOTION.saidaMs}ms`));
    }
  });
});
