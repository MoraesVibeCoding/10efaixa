import { fireEvent, render, screen, within } from '@testing-library/react';
import type { SeasonSummary } from '../../engine/seasonSummary';
import { t } from '../../i18n';
import { ResumoTemporada } from './ResumoTemporada';

// v2.61 (SPEC 6.15): o card "Resumo da temporada" por cima da próxima tela, no Normal e no Completo.
const BASE: SeasonSummary = {
  year: 2030, age: 22, clubId: 'santos', division: 'BRA-A', partidas: 34, gols: 9, assistencias: 5, overallDe: 70, overallPara: 74, pct: 6,
  mudancas: [{ atributo: 'passe', sentido: 'sobe', forte: true }, { atributo: 'fisico', sentido: 'desce', forte: false }], titulos: ['estadual'],
  comentario: { evolucao: 'grande', minutos: 'muitos', destaque: 'passe', titulo: true },
};
const setup = (resumo: SeasonSummary = BASE, onClose = vi.fn()) => { render(<ResumoTemporada resumo={resumo} onClose={onClose} />); return onClose; };
const dialog = () => screen.getByRole('alertdialog', { name: t('ui.resumoTemporada.titulo') });

describe('card do resumo da temporada (v2.61)', () => {
  it('abre como alertdialog com o título, o clube e a idade, e o foco no botão Continuar', () => {
    setup();
    expect(dialog()).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog()).getByText(/Santos/)).toBeInTheDocument();
    expect(within(dialog()).getByText(t('ui.resumoTemporada.idade', { n: 22 }), { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t('ui.resumoTemporada.continuar') })).toHaveFocus();
  });

  it('mostra jogos, gols e assistências do ano com os rótulos', () => {
    setup();
    const nums = within(dialog()).getByRole('list', { name: t('ui.resumoTemporada.numeros') });
    expect(nums).toHaveTextContent(`${t('ui.resumoTemporada.partidas')}34`);
    expect(nums).toHaveTextContent(`${t('ui.resumoTemporada.gols')}9`);
    expect(nums).toHaveTextContent(`${t('ui.resumoTemporada.assistencias')}5`);
  });

  it('mostra o Over de-para e a variação em %, com sinal; estável e queda têm texto próprio', () => {
    const { unmount } = render(<ResumoTemporada resumo={BASE} onClose={() => {}} />);
    expect(screen.getByText(t('ui.resumoTemporada.over', { de: 70, para: 74 }))).toBeInTheDocument();
    expect(screen.getByText(t('ui.resumoTemporada.variacaoSobe', { pct: 6 }))).toBeInTheDocument();
    unmount();
    const { unmount: u2 } = render(<ResumoTemporada resumo={{ ...BASE, overallPara: 66, pct: -6 }} onClose={() => {}} />);
    expect(screen.getByText(t('ui.resumoTemporada.variacaoDesce', { pct: 6 }))).toBeInTheDocument();
    u2();
    render(<ResumoTemporada resumo={{ ...BASE, overallPara: 70, pct: 0 }} onClose={() => {}} />);
    expect(screen.getByText(t('ui.resumoTemporada.variacaoEstavel'))).toBeInTheDocument();
  });

  it('atributos só em palavras (nunca número) e o comentário do técnico de até 3 frases, com título e destaque', () => {
    setup();
    const attrs = within(dialog()).getByRole('list', { name: t('ui.resumoTemporada.atributos') });
    expect(attrs).toHaveTextContent(t('ui.evolucao.sobeForte', { atributo: t('ui.evolucao.atributo.passe') }));
    expect(attrs).toHaveTextContent(t('ui.evolucao.desce', { atributo: t('ui.evolucao.atributo.fisico') }));
    expect(attrs.textContent).not.toMatch(/\d/);
    const fala = within(dialog()).getByTestId('comentario');
    expect(fala).toHaveTextContent(t('ui.resumoTemporada.comentario.evolucao.grande'));
    expect(fala).toHaveTextContent(t('ui.resumoTemporada.comentario.minutos.muitos'));
    expect(fala).toHaveTextContent(t('ui.resumoTemporada.comentario.titulo'));
    expect((fala.textContent ?? '').split(/(?<=[.!?])\s+/).length).toBeLessThanOrEqual(3);
  });

  it('sem título, a terceira frase fala do destaque; sem nenhum dos dois, o comentário tem 2 frases; sem atributo que mudou, a lista some', () => {
    const { unmount } = render(<ResumoTemporada resumo={{ ...BASE, titulos: [], comentario: { ...BASE.comentario, titulo: false } }} onClose={() => {}} />);
    expect(screen.getByTestId('comentario')).toHaveTextContent(t('ui.resumoTemporada.comentario.destaque', { atributo: t('ui.evolucao.atributo.passe') }));
    unmount();
    render(<ResumoTemporada resumo={{ ...BASE, mudancas: [], titulos: [], comentario: { evolucao: 'estavel', minutos: 'poucos', destaque: null, titulo: false } }} onClose={() => {}} />);
    expect((screen.getByTestId('comentario').textContent ?? '').split(/(?<=[.!?])\s+/)).toHaveLength(2);
    expect(screen.queryByRole('list', { name: t('ui.resumoTemporada.atributos') })).toBeNull();
  });

  it('Continuar e Esc fecham; Tab não sai do card', () => {
    const onClose = setup();
    const btn = screen.getByRole('button', { name: t('ui.resumoTemporada.continuar') });
    fireEvent.keyDown(btn, { key: 'Tab' });
    expect(btn).toHaveFocus();
    fireEvent.keyDown(dialog(), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(btn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
