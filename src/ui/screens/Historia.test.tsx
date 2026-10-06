import { fireEvent, render, screen } from '@testing-library/react';
import { simulateCareer } from '../../engine/career';
import { createPrng } from '../../engine/prng';
import { randomInput } from '../../engine/simulation';
import { storyOf } from '../../engine/story';
import { Historia } from './Historia';
import { storyText } from './storyText';

// T55b: tela "Sua história", antes do cartão final.
const result = simulateCareer(randomInput(createPrng(3)), 3);

describe('"Sua história" (T55b)', () => {
  it('lista as frases da carreira em ordem, como lista ordenada, e segue para o cartão', () => {
    const onContinue = vi.fn();
    render(<Historia result={result} onContinue={onContinue} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Sua história' })).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    const story = storyOf({ ...result, origin: result.player.origin });
    expect(items.map((li) => li.textContent)).toEqual(story.map(storyText));
    fireEvent.click(screen.getByRole('button', { name: 'Ver meu cartão' }));
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it('texto com clube, competição e singular', () => {
    expect(storyText({ id: 'europa', age: 24, clubId: 'benfica' })).toBe('Atravessou o oceano aos 24 para vestir a camisa do Benfica');
    expect(storyText({ id: 'primeiroTitulo', age: 21, competition: 'copaDoMundo' })).toBe('Ergueu a primeira taça aos 21: Mundial de Seleções');
    expect(storyText({ id: 'lesoes', age: 33, n: 1 })).toBe('Voltou de uma lesão grave');
    expect(storyText({ id: 'lesoes', age: 33, n: 2 })).toBe('Voltou de 2 lesões graves');
  });
});
