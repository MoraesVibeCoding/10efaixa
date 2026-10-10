import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { CreationInput } from '../../engine/player';
import { t } from '../../i18n';
import { Revelacao } from './Revelacao';
import type { Reveal } from './revealView';

// v2.81 (direção "Álbum", aprovada pelo usuário em 2026-10-10): "Nasce um jogador" é um card grande de frente e verso na
// página 1 do álbum. Frente: a figurinha com o Over, o selo da origem, a linha (posição, estado, 16 anos) e as duas metas do
// jogo ainda vazias (a 10 e a faixa). Verso: a ficha (camisa, origem, estilo e pé, físico, temperamento), os pontos fortes
// em estrelas (nunca número) e o sonho (o clube de coração). "Virar o card" alterna; nada inclinado.
const INPUT: CreationInput = {
  name: 'Dudu Maestro', shirtNumber: 7, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 174, build: 'franzino' }, temperament: 'frio', origin: 'varzea', foot: 'direita', heartClub: 'bahia',
};
const REVEAL: Reveal = {
  overall: 48, isDiamond: false, fortes: ['passe', 'drible', 'mental'],
  bands: [{ id: 'passe', band: 'bom' }, { id: 'drible', band: 'regular' }, { id: 'mental', band: 'regular' }],
};
beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: vi.fn(function (this: HTMLDialogElement) { this.setAttribute('open', ''); }) });
});
afterEach(() => { cleanup(); Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal'); });
const show = (input = INPUT) => render(<Revelacao input={input} visual="visual-01" reveal={REVEAL} onContinue={() => {}} />);
const frente = () => document.querySelector('.nasce__frente') as HTMLElement;
const verso = () => document.querySelector('.nasce__verso') as HTMLElement;
const css = readFileSync(resolve(__dirname, 'Revelacao.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

describe('card "Nasce um jogador" (v2.81)', () => {
  it('é a página 1 do álbum', () => {
    show();
    expect(document.querySelector('.pagina__topo')).toHaveTextContent(t('ui.pagina.numero', { n: 1 }));
  });

  it('frente: selo da origem, a linha do jogador e as duas metas vazias', () => {
    show();
    expect(frente()).toHaveTextContent(t('ui.revelacao.origem.varzea'));
    expect(frente()).toHaveTextContent(t('ui.revelacao.linha', { posicao: t('positions.meia'), estado: t('creation.state.BA'), idade: 16 }));
    const metas = within(frente()).getByRole('list', { name: t('ui.revelacao.metas.titulo') });
    expect(within(metas).getAllByRole('listitem').map((li) => li.querySelector('.nasce__meta-texto')?.textContent)).toEqual([t('ui.revelacao.metas.dez'), t('ui.revelacao.metas.faixa')]);
  });

  it('começa pela frente; "Virar o card" mostra o verso e volta', () => {
    show();
    const virar = screen.getByRole('button', { name: t('ui.revelacao.virar') });
    expect(document.querySelector('.nasce')).toHaveAttribute('data-lado', 'frente');
    expect(verso()).toHaveAttribute('aria-hidden', 'true');
    fireEvent.click(virar);
    expect(document.querySelector('.nasce')).toHaveAttribute('data-lado', 'verso');
    expect(virar).toHaveAttribute('aria-pressed', 'true');
    expect(frente()).toHaveAttribute('aria-hidden', 'true');
    fireEvent.click(virar);
    expect(document.querySelector('.nasce')).toHaveAttribute('data-lado', 'frente');
  });

  it('verso: a ficha, os pontos fortes em estrelas (sem número) e o sonho do clube de coração', () => {
    show();
    fireEvent.click(screen.getByRole('button', { name: t('ui.revelacao.virar') }));
    const v = verso();
    expect(v).toHaveTextContent(t('ui.revelacao.ficha.camisa', { n: 7 }));
    expect(v).toHaveTextContent(t('ui.revelacao.ficha.estiloValor', { estilo: t('archetypes.archetype.classico10'), pe: t('ui.revelacao.ficha.pe.direita') }));
    expect(v).toHaveTextContent(t('ui.revelacao.ficha.fisicoValor', { altura: '1,74', compleicao: t('creation.build.franzino').toLowerCase() }));
    expect(v).toHaveTextContent(t('creation.temperamentDica.frio'));
    const fortes = within(v).getByRole('list', { name: t('ui.revelacao.fortes') });
    const passe = within(fortes).getByText(t('attributes.attribute.passe')).closest('li') as HTMLElement;
    expect(passe.querySelector('[role="img"]')).toHaveAccessibleName(t('attributes.band.bom'));
    expect(fortes.textContent).not.toMatch(/\d/);
    expect(v.querySelector('.nasce__sonho')).toHaveTextContent(/Bahia/);
    cleanup();
    show({ ...INPUT, heartClub: null });
    expect(verso().querySelector('.nasce__sonho')).toHaveTextContent(t('ui.revelacao.ficha.semSonho'));
  });

  it('CSS: o card vira em 3D (verso de costas), sem nada inclinado; a figurinha cola sem girar', () => {
    expect(css).toMatch(/\.nasce\[data-lado='verso'\] \.nasce__card \{[^}]*transform:\s*rotateY\(180deg\)/);
    expect(css).toMatch(/backface-visibility:\s*hidden/);
    expect(css).not.toMatch(/rotate\((?!.)|rotate\(-?\d/);
    expect(css).not.toMatch(/rotateZ|rotate:/);
  });
});
