import { fireEvent, render, screen } from '@testing-library/react';
import type { CreationInput } from '../../engine/player';
import { simulateCareer } from '../../engine/career';
import { autoChoice } from '../../engine/events';
import { t } from '../../i18n';
import { Career } from './Career';

// T51 (b): a carreira jogada na tela, do primeiro momento ao resumo final.
const INPUT: CreationInput = {
  name: 'Dudu Maestro', shirtNumber: 10, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia',
};
const LOOK = { skin: 't6', hairStyle: 'curto', hairColor: 'preto', beard: null, headband: null, boots: 'preta' };

describe('carreira na tela (T51b)', () => {
  it('mostra a primeira decisão com o jogador de verdade', () => {
    render(<Career input={INPUT} look={LOOK} seed={11} onRestart={() => {}} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Dudu Maestro', { selector: '.figurinha__tarja-nome' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: t('ui.decisao.ficha') })).toBeInTheDocument();
  });

  it('jogando com as escolhas do temperamento, termina no mesmo resumo que a simulação', { timeout: 60_000 }, () => {
    const onRestart = vi.fn();
    const onProgress = vi.fn();
    render(<Career input={INPUT} look={LOOK} seed={11} onRestart={onRestart} onProgress={onProgress} />);
    for (let guard = 0; guard < 300 && !screen.queryByRole('heading', { level: 1, name: t('ui.fim.titulo') }); guard++) {
      const eventId = document.querySelector('[data-evento]')!.getAttribute('data-evento')!;
      const choice = autoChoice(eventId, document.querySelector('[data-temperamento]')!.getAttribute('data-temperamento')!);
      fireEvent.click(document.querySelector(`[data-opcao-id="${choice}"]`)!);
      fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
      fireEvent.click(screen.getByRole('button', { name: t('ui.resultado.seguir') }));
    }
    const result = simulateCareer(INPUT, 11);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.fim.titulo') })).toBeInTheDocument();
    expect(screen.getByText(t(`legacy.veredito.${result.legacy.verdict}`))).toBeInTheDocument();
    expect(screen.getByText(result.headline)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: t('ui.fim.novaCarreira') }));
    expect(onRestart).toHaveBeenCalledOnce();
    // T54: salvou ao começar e a cada decisão; no fim avisa que terminou (o App apaga o save)
    expect(onProgress.mock.calls[0]).toEqual([[], false]);
    expect(onProgress.mock.calls.at(-1)![1]).toBe(true);
    expect(onProgress.mock.calls.filter((c) => !c[1]).length).toBe(onProgress.mock.calls.at(-1)![0].length);
  });
});
