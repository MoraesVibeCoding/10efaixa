import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { t } from '../../i18n';
import { Revelacao } from './Revelacao';
import type { Reveal } from './revealView';

// T49i (SPEC 7, v2.34): a revelação do jogador num <dialog> modal de vidro. O jsdom não tem showModal: o teste o simula,
// e o componente só o chama quando o navegador o oferece (MDN: Chrome 37, Safari 15.4, Firefox 98).
const REVEAL: Reveal = {
  overall: 41, isDiamond: false,
  bands: [
    { id: 'finalizacao', band: 'fraco' }, { id: 'passe', band: 'regular' }, { id: 'habilidade', band: 'regular' }, { id: 'drible', band: 'bom' },
    { id: 'forca', band: 'fraco' }, { id: 'velocidade', band: 'regular' }, { id: 'fisico', band: 'fraco' }, { id: 'marcacao', band: 'fraco' },
    { id: 'mental', band: 'bom' }, { id: 'jogoAereo', band: 'fraco' },
  ],
};
const show = (reveal = REVEAL, onContinue = vi.fn()) => {
  render(<Revelacao name="Dudu Maestro" number={10} visual="visual-03" reveal={reveal} onContinue={onContinue} />);
  return onContinue;
};

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: vi.fn(function (this: HTMLDialogElement) { this.setAttribute('open', ''); }) });
});
afterEach(() => { Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal'); });

describe('revelação do jogador (T49i)', () => {
  it('abre como modal, com o título como nome e o foco no botão de começar', () => {
    show();
    const dialog = screen.getByRole('dialog', { name: t('ui.revelacao.titulo') });
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(dialog).toHaveClass('vidro');
    expect(within(dialog).getByRole('button', { name: t('ui.revelacao.comecar') })).toHaveFocus();
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

  it('"Começar carreira" segue; Esc (cancel do dialog) também segue, uma vez só', () => {
    const onContinue = show();
    const dialog = screen.getByRole('dialog');
    const esc = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(esc);
    expect(esc.defaultPrevented).toBe(true);
    expect(onContinue).toHaveBeenCalledTimes(1);
    fireEvent.click(within(dialog).getByRole('button', { name: t('ui.revelacao.comecar') }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('sem showModal (navegador antigo), o diálogo abre assim mesmo, sem modal, para a tela nunca ficar vazia', () => {
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    show();
    expect(screen.getByRole('dialog', { name: t('ui.revelacao.titulo') })).toHaveAttribute('open');
  });

  it('CSS: cabe sem rolar mesmo com o selo do diamante (medido: até 91 px a mais): figurinha limitada pela altura; no computador, duas colunas', () => {
    const css = readFileSync(resolve(__dirname, 'Revelacao.css'), 'utf8');
    expect(css).toMatch(/\.revelacao__figurinha\s*\{[^}]*inline-size:\s*min\([^)]*dvh\)/);
    expect(css).toMatch(/@media\s*\(min-width:\s*64rem\)\s*\{[^@]*grid-template-areas/);
  });

  it('CSS: a figurinha "cola" com animação, que some com prefers-reduced-motion; o fundo usa o scrim do vidro', () => {
    const css = readFileSync(resolve(__dirname, 'Revelacao.css'), 'utf8');
    expect(css).toMatch(/@keyframes\s+colar/);
    expect(css).toMatch(/\.revelacao__figurinha\s*\{[^}]*animation:[^;]*colar/);
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^@]*\.revelacao__figurinha\s*\{[^}]*animation:\s*none/);
    expect(css).toMatch(/::backdrop\s*\{[^}]*background:\s*var\(--vidro-scrim\)/);
  });
});
