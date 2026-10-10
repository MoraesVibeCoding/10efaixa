import { fireEvent, render, screen } from '@testing-library/react';
import { autoDecide } from '../../engine/career';
import { createPrng } from '../../engine/prng';
import { randomInput } from '../../engine/simulation';
import { t } from '../../i18n';
import { runUntilDecision } from '../../state/careerRun';
import { Career } from './Career';

// Revisão das telas: no ritmo Completo, ~8% das reuniões vêm logo depois de outra; a resposta da primeira aparecia por cima da
// segunda (duas telas iguais, uma sobre a outra). Agora a próxima reunião só entra quando a resposta fecha.
const LOOK = { skin: 't6', hairStyle: 'curto', hairColor: 'preto', beard: null, headband: null, boots: 'preta' };
const INPUT = randomInput(createPrng(1));

describe('resposta da reunião quando a próxima tela também é reunião', () => {
  it('a reunião seguinte espera a resposta fechar', () => {
    const first = runUntilDecision(INPUT, 1, [], 'completo');
    if (first.kind !== 'decision') throw new Error('esperava decisão');
    const start = [autoDecide(first.eventId, first.view.temperament, () => first.view)];
    render(<Career input={INPUT} look={LOOK} seed={1} ritmo="completo" initialChoices={start} onRestart={() => {}} />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('radio')[0]!);
    fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') }));
    const resposta = document.querySelector('.reuniao__resposta')!;
    expect(resposta).not.toBeNull();
    expect(screen.queryByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })).toBeNull();
    fireEvent.click(resposta.querySelector('button')!);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })).toBeInTheDocument();
  });
});
