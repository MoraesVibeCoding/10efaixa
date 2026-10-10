import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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

  it('cada temporada de profissional mostra jogos, gols e assistências do ano; nas categorias de base, não (v2.60, v2.62)', () => {
    render(<LinhaDoTempo result={result} onContinue={() => {}} />);
    const rows = timelineOf(result);
    const items = screen.getAllByRole('listitem');
    expect(rows.some((r) => r.division !== null)).toBe(true);
    rows.forEach((r, i) => {
      // v2.65: os números da Seleção do ano ficam num bloco próprio; aqui contam só os do clube
      const clube = items[i]!.cloneNode(true) as HTMLElement;
      clube.querySelector('.linha__selecao')?.remove();
      const text = clube.textContent ?? '';
      if (r.division === null) {
        expect(text).not.toContain('Jogos');
        expect(text).not.toContain('Gols');
        expect(text).not.toContain('Assistências');
      } else {
        expect(text).toContain(t('ui.linhaDoTempo.jogos', { n: r.games }));
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

// v2.65: a Seleção ano a ano dentro do card do ano: degrau mais alto, jogos, gols, assistências e o torneio com a fase.
describe('"Sua carreira": Seleção no card do ano (v2.65)', () => {
  const careers = Array.from({ length: 60 }, (_, i) => simulateCareer(randomInput(createPrng(i + 1)), i + 1));
  const comSelecao = careers.find((r) => r.seasons.some((s) => s.selecao?.tournaments.length))!;

  it('o ano com convocação traz o bloco da Seleção; o ano sem convocação, não', () => {
    render(<LinhaDoTempo result={comSelecao} onContinue={() => {}} />);
    const items = screen.getAllByRole('listitem');
    comSelecao.seasons.forEach((s, i) => {
      const bloco = within(items[i]!).queryByRole('group', { name: t('ui.linhaDoTempo.selecao.titulo') });
      if (!s.selecao) { expect(bloco, `${s.year}`).toBeNull(); return; }
      expect(bloco, `${s.year}`).not.toBeNull();
      const text = bloco!.textContent ?? '';
      expect(text).toContain(t(`ui.linhaDoTempo.selecao.degrau.${s.selecao.rung}`));
      expect(text).toContain(t('ui.linhaDoTempo.jogos', { n: s.selecao.games }));
      expect(text).toContain(t('ui.linhaDoTempo.gols', { n: s.selecao.goals }));
      expect(text).toContain(t('ui.linhaDoTempo.assistencias', { n: s.selecao.assists }));
      for (const tr of s.selecao.tournaments) {
        expect(text).toContain(t('ui.linhaDoTempo.selecao.torneio', { torneio: t(`ui.linhaDoTempo.selecao.nomes.${tr.tournament}`), fase: t(`ui.linhaDoTempo.selecao.fase.${tr.stage}`) }));
      }
    });
  });

  it('todo degrau, torneio e fase tem texto', () => {
    for (const d of ['sub17', 'sub20', 'olimpica', 'lista', 'reserva', 'titular']) expect(t(`ui.linhaDoTempo.selecao.degrau.${d}`).length).toBeGreaterThan(0);
    for (const n of ['copaDoMundo', 'copaAmerica', 'olimpiadas']) expect(t(`ui.linhaDoTempo.selecao.nomes.${n}`).length).toBeGreaterThan(0);
    for (const f of ['grupos', 'dezesseis-avos', 'oitavas', 'quartas', 'semifinal', 'final', 'campeao']) expect(t(`ui.linhaDoTempo.selecao.fase.${f}`).length).toBeGreaterThan(0);
  });
});

// v2.66 (direção B, escolhida pelo usuário): placar da carreira no topo e a faixa do Over em cada ano.
describe('"Sua carreira" na direção B (v2.66)', () => {
  it('o placar do topo traz jogos, gols, títulos e o Over do auge da carreira', () => {
    render(<LinhaDoTempo result={result} onContinue={() => {}} />);
    const placar = screen.getByRole('group', { name: t('ui.linhaDoTempo.placar.titulo') });
    const text = placar.textContent ?? '';
    expect(text).toContain(`${result.stats.games.toLocaleString('pt-BR')}${t('ui.linhaDoTempo.placar.jogos')}`);
    expect(text).toContain(`${result.stats.goals.toLocaleString('pt-BR')}${t('ui.linhaDoTempo.placar.gols')}`);
    expect(text).toContain(`${result.titles.length}${t('ui.linhaDoTempo.placar.titulos')}`);
    expect(text).toContain(`${result.peakOverall}${t('ui.linhaDoTempo.placar.auge')}`);
  });

  it('cada ano tem a faixa do Over (decorativa, o número já está no texto) na largura do Over', () => {
    const { container } = render(<LinhaDoTempo result={result} onContinue={() => {}} />);
    const bars = container.querySelectorAll('.linha__faixa');
    expect(bars).toHaveLength(result.seasons.length);
    bars.forEach((b, i) => {
      expect(b).toHaveAttribute('aria-hidden', 'true');
      expect((b.firstElementChild as HTMLElement).style.inlineSize).toBe(`${timelineOf(result)[i]!.overall}%`);
    });
  });
});

// v2.71 (momento 9): o placar conta do zero e as faixas do Over crescem uma a uma; o leitor de tela recebe o número final.
describe('"Sua carreira" contando (v2.71)', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('com movimento, o placar começa no zero e o texto acessível já é o final', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
    vi.stubGlobal('requestAnimationFrame', () => 0);
    vi.stubGlobal('cancelAnimationFrame', () => {});
    render(<LinhaDoTempo result={result} onContinue={() => {}} />);
    const jogos = document.querySelector('.linha__placar-n b')!;
    expect(jogos.querySelector('[aria-hidden="true"]')).toHaveTextContent(/^0$/);
    expect(jogos.querySelector('.sr-only')).toHaveTextContent(result.stats.games.toLocaleString('pt-BR'));
  });

  it('as faixas crescem na ordem dos anos', () => {
    render(<LinhaDoTempo result={result} onContinue={() => {}} />);
    const faixas = [...document.querySelectorAll<HTMLElement>('.linha__faixa > span')];
    expect(faixas[1]!.style.getPropertyValue('--i')).toBe('1');
    const css = readFileSync(resolve(__dirname, 'LinhaDoTempo.css'), 'utf8');
    expect(css).toMatch(/\.linha__faixa > span\s*\{[^}]*animation:\s*linha-cresce[^}]*var\(--i/);
  });
});

describe('placar contando no tamanho certo (v2.71, regressão)', () => {
  it('CSS: o rótulo pequeno pega só o filho direto, não os números que contam dentro do <b>', () => {
    const css = readFileSync(resolve(__dirname, 'LinhaDoTempo.css'), 'utf8');
    expect(css).not.toMatch(/\.linha__placar-n span\s*\{/);
    expect(css).toMatch(/\.linha__placar-n > span\s*\{[^}]*font-size:/);
  });
});
