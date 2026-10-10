import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { t } from '../../i18n';
import { Revelacao } from './Revelacao';
import type { Reveal } from './revealView';
import type { CreationInput } from '../../engine/player';

// T49i (SPEC 7, v2.34): a revelação do jogador num <dialog> modal de vidro. O jsdom não tem showModal: o teste o simula,
// e o componente só o chama quando o navegador o oferece (MDN: Chrome 37, Safari 15.4, Firefox 98).
const REVEAL: Reveal = {
  overall: 41, isDiamond: false, fortes: ['drible', 'mental', 'passe'],
  bands: [
    { id: 'finalizacao', band: 'fraco' }, { id: 'passe', band: 'regular' }, { id: 'habilidade', band: 'regular' }, { id: 'drible', band: 'bom' },
    { id: 'forca', band: 'fraco' }, { id: 'velocidade', band: 'regular' }, { id: 'fisico', band: 'fraco' }, { id: 'marcacao', band: 'fraco' },
    { id: 'mental', band: 'bom' }, { id: 'jogoAereo', band: 'fraco' },
  ],
};
const INPUT: CreationInput = {
  name: 'Dudu Maestro', shirtNumber: 10, state: 'RJ', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 178, build: 'atletico' }, temperament: 'lider', origin: 'peneira', foot: 'esquerda', heartClub: null,
};
/** v2.81: os pontos fortes e os dez atributos ficam no verso do card */
const virar = () => { fireEvent.click(screen.getByRole('button', { name: t('ui.revelacao.virar') })); };
const show = (reveal = REVEAL, onContinue = vi.fn()) => {
  render(<Revelacao input={INPUT} visual="visual-03" reveal={reveal} onContinue={onContinue} />);
  return onContinue;
};

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: vi.fn(function (this: HTMLDialogElement) { this.setAttribute('open', ''); }) });
});
afterEach(() => { Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal'); });

describe('revelação do jogador (T49i)', () => {
  it('abre como modal, com o título como nome e o foco no título (v2.69: em 360 px o título não some rolando até o botão)', () => {
    show();
    const dialog = screen.getByRole('dialog', { name: t('ui.revelacao.titulo') });
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(dialog).toHaveClass('revelacao');
    expect(within(dialog).getByRole('heading', { level: 1, name: t('ui.revelacao.titulo') })).toHaveFocus();
  });

  it('v2.69: os 3 pontos fortes em destaque; os dez atributos ficam em "Ver todos" (v2.81: no verso do card)', () => {
    show();
    virar();
    const fortes = screen.getByRole('list', { name: t('ui.revelacao.fortes') });
    expect(within(fortes).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['drible', 'mental', 'passe'].map((id) => t(`attributes.attribute.${id}`)));
    expect(screen.getByText(t('ui.revelacao.verTodos'))).toBeInTheDocument();
  });

  it('v2.69: a faixa mais baixa aparece como "Cru" na revelação (quem começa ainda não é fraco, é cru)', () => {
    show();
    virar();
    const list = screen.getByRole('list', { name: t('ui.revelacao.atributos') });
    expect(within(list).getAllByRole('listitem')[0]).toHaveTextContent(t('ui.revelacao.cru'));
    expect(list.textContent).not.toContain(t('attributes.band.fraco'));
  });

  // v2.81 (Álbum): a revelação é a página 1 do álbum, em papel; a cena do vestiário atrás do vidro (v2.69) saiu
  it('v2.81: página de papel, sem cena nem vidro atrás', () => {
    const { container } = render(<Revelacao input={INPUT} visual="visual-03" reveal={REVEAL} onContinue={() => {}} />);
    expect(container.querySelector('.revelacao__palco .cena')).toBeNull();
    expect(container.querySelector('.vidro')).toBeNull();
  });

  it('a figurinha com moldura traz o Over do sorteio; a camisa é neutra (ainda sem clube)', () => {
    show();
    const dialog = screen.getByRole('dialog');
    const fig = dialog.querySelector('.revelacao__figurinha .figurinha--moldura') as HTMLElement;
    expect(fig).not.toBeNull();
    expect(fig.querySelector('.figurinha__over-grande')).toHaveTextContent('41');
    expect(within(fig).getByText('Dudu Maestro')).toBeInTheDocument();
  });

  it('o nome completo aparece no subtítulo (a tarja da figurinha pode cortar nomes longos)', () => {
    show();
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription(t('ui.revelacao.subtitulo', { nome: 'Dudu Maestro' }));
    expect(t('ui.revelacao.subtitulo', { nome: 'Dudu Maestro' })).toContain('Dudu Maestro');
  });

  it('os dez atributos em faixa (palavra e barra), sem nenhum número', () => {
    show();
    virar();
    const list = screen.getByRole('list', { name: t('ui.revelacao.atributos') });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(10);
    expect(items[3]).toHaveTextContent(t('attributes.band.bom'));
    expect(list.textContent).not.toMatch(/\d/);
  });

  it('o selo "Diamante bruto" só aparece para o diamante', () => {
    show();
    expect(screen.queryByText(t('ui.revelacao.diamante'))).not.toBeInTheDocument();
  });

  it('diamante bruto: o selo dourado aparece, com a frase dele', () => {
    show({ ...REVEAL, isDiamond: true });
    const selo = screen.getByText(t('ui.revelacao.diamante')).closest('.revelacao__selo');
    expect(selo).not.toBeNull();
    expect(selo).toHaveTextContent(t('ui.revelacao.diamanteFrase'));
  });

  it('"Escolher o ritmo" segue; Esc (cancel do dialog) também segue, uma vez só', () => {
    const onContinue = show();
    const dialog = screen.getByRole('dialog');
    const esc = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(esc);
    expect(esc.defaultPrevented).toBe(true);
    expect(onContinue).toHaveBeenCalledTimes(1);
    fireEvent.click(within(dialog).getByRole('button', { name: t('ui.revelacao.seguir') }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('sem showModal (navegador antigo), o diálogo abre assim mesmo, sem modal, para a tela nunca ficar vazia', () => {
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    show();
    expect(screen.getByRole('dialog', { name: t('ui.revelacao.titulo') })).toHaveAttribute('open');
  });

  it('CSS: figurinha limitada pela altura da tela (cabe com o selo do diamante)', () => {
    const css = readFileSync(resolve(__dirname, 'Revelacao.css'), 'utf8');
    expect(css).toMatch(/\.revelacao__figurinha\s*\{[^}]*inline-size:\s*min\([^)]*dvh\)/);
  });

  it('CSS: a figurinha "cola" com animação, que some com prefers-reduced-motion; o fundo é o papel (v2.81)', () => {
    const css = readFileSync(resolve(__dirname, 'Revelacao.css'), 'utf8');
    expect(css).toMatch(/@keyframes\s+colar/);
    expect(css).toMatch(/\.revelacao__figurinha\s*\{[^}]*animation:[^;]*colar/);
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^@]*\.revelacao__figurinha\s*\{[^}]*animation:\s*none/);
    expect(css).toMatch(/::backdrop\s*\{[^}]*background:\s*var\(--cor-fundo\)/);
  });
});

// v2.71 (momento 1): o Over conta até o valor sorteado e um reflexo passa pela figurinha; sem movimento, o valor final direto.
describe('revelação com o Over contando (v2.71)', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('com movimento, o número começa baixo e conta até o Over', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
    vi.stubGlobal('requestAnimationFrame', () => 0);
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const { container } = render(<Revelacao input={INPUT} visual="visual-03" reveal={{ ...REVEAL, overall: 66 }} onContinue={() => {}} />);
    expect(container.querySelector('.figurinha__over-grande')).toHaveTextContent('1');
  });

  it('sem movimento, o Over final direto', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q }));
    const { container } = render(<Revelacao input={INPUT} visual="visual-03" reveal={{ ...REVEAL, overall: 66 }} onContinue={() => {}} />);
    expect(container.querySelector('.figurinha__over-grande')).toHaveTextContent('66');
  });

  it('CSS: o reflexo passa pela figurinha uma vez', () => {
    const css = readFileSync(resolve(__dirname, 'Revelacao.css'), 'utf8');
    expect(css).toMatch(/\.revelacao__figurinha::after\s*\{[^}]*animation:\s*revelacao-reflexo/);
  });
});
