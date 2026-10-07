import { fireEvent, render, screen, within } from '@testing-library/react';
import market from '../../data/market.json';
import { simulateCareer } from '../../engine/career';
import { createPrng } from '../../engine/prng';
import { randomInput } from '../../engine/simulation';
import { timelineOf } from '../../engine/timeline';
import { t } from '../../i18n';
import { LinhaDoTempo, divisionLabel } from './LinhaDoTempo';
import { storyText } from './storyText';

// T55h (SPEC 6.15, v2.51): tela "Sua carreira", antes do cartão final: uma linha por temporada.
const result = simulateCareer(randomInput(createPrng(3)), 3);

describe('"Sua carreira" (T55h)', () => {
  it('título, uma linha por temporada em lista ordenada, e segue para o cartão', () => {
    const onContinue = vi.fn();
    render(<LinhaDoTempo result={result} onContinue={onContinue} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Sua carreira' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(result.seasons.length);
    fireEvent.click(screen.getByRole('button', { name: 'Ver meu cartão' }));
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it('cada linha lê idade, clube, divisão e Over; títulos só na linha do ano; auge uma vez', () => {
    render(<LinhaDoTempo result={result} onContinue={() => {}} />);
    const rows = timelineOf(result);
    const items = screen.getAllByRole('listitem');
    rows.forEach((r, i) => {
      const text = items[i]!.textContent ?? '';
      expect(text).toContain(`${r.age} anos`);
      expect(text).toContain(`Over ${r.overall}`);
      for (const c of r.titles) expect(text).toContain(t(`ui.titulo.${c}`));
      expect(text.includes(t('ui.linhaDoTempo.auge'))).toBe(r.peak);
    });
    expect(screen.getAllByText(t('ui.linhaDoTempo.auge'))).toHaveLength(1);
  });

  it('cada temporada de profissional mostra gols e assistências do ano; nas categorias de base, não (v2.60)', () => {
    render(<LinhaDoTempo result={result} onContinue={() => {}} />);
    const rows = timelineOf(result);
    const items = screen.getAllByRole('listitem');
    expect(rows.some((r) => r.division !== null)).toBe(true);
    rows.forEach((r, i) => {
      const text = items[i]!.textContent ?? '';
      if (r.division === null) {
        expect(text).not.toContain('Gols');
        expect(text).not.toContain('Assistências');
      } else {
        expect(text).toContain(t('ui.linhaDoTempo.gols', { n: r.goals }));
        expect(text).toContain(t('ui.linhaDoTempo.assistencias', { n: r.assists }));
      }
    });
  });

  it('cada título do ano ganha a miniatura do troféu (decorativa) junto do nome', () => {
    const { container } = render(<LinhaDoTempo result={result} onContinue={() => {}} />);
    const rows = timelineOf(result);
    const items = screen.getAllByRole('listitem');
    expect(rows.some((r) => r.titles.length > 0)).toBe(true);
    rows.forEach((r, i) => {
      const imgs = items[i]!.querySelectorAll('img.trofeu__arte');
      expect(imgs, `ano ${r.year}`).toHaveLength(r.titles.length);
      imgs.forEach((img) => expect(img).toHaveAttribute('alt', ''));
    });
    expect(container.querySelectorAll('[role="img"]')).toHaveLength(0);
  });

  it('o emblema é decorativo (o nome do clube já está no texto da linha)', () => {
    const { container } = render(<LinhaDoTempo result={result} onContinue={() => {}} />);
    expect(container.querySelectorAll('[role="img"]')).toHaveLength(0);
    const first = within(screen.getAllByRole('listitem')[0]!);
    expect(first.getByText(/anos/)).toBeInTheDocument();
  });

  it('toda divisão que o mercado conhece tem nome (a tela nunca quebra por divisão nova)', () => {
    for (const d of Object.keys(market.ligas)) expect(divisionLabel(d).length).toBeGreaterThan(0);
    expect(divisionLabel(null)).toBe('');
    expect(divisionLabel('LIGA-NOVA').length).toBeGreaterThan(0);
  });

  it('as frases antigas seguem existindo para o cartão narrativo (storyText)', () => {
    expect(storyText({ id: 'europa', age: 24, clubId: 'benfica' })).toBe('Atravessou o oceano aos 24 para vestir a camisa do Benfica');
    expect(storyText({ id: 'primeiroTitulo', age: 21, competition: 'copaDoMundo' })).toBe('Ergueu a primeira taça aos 21: Mundial de Seleções');
    expect(storyText({ id: 'lesoes', age: 33, n: 1 })).toBe('Voltou de uma lesão grave');
    expect(storyText({ id: 'lesoes', age: 33, n: 2 })).toBe('Voltou de 2 lesões graves');
  });
});
