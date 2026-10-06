import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { t } from '../../i18n';
import { Reuniao, ReuniaoResposta } from './Reuniao';

// T52 (SPEC 6.5, v2.40): a reunião com a comissão. Foco principal e secundário (10 atributos, bola parada, perna
// ruim), abrindo com a sugestão do preparador; depois, a resposta da comissão.
const group = (k: 'principal' | 'secundario') => screen.getByRole('radiogroup', { name: t(`ui.reuniao.${k}`) });
const focusName = (f: string) => (f === 'bolaParada' || f === 'pernaRuim' ? t(`ui.reuniao.foco.${f}`) : t(`attributes.attribute.${f}`));

describe('tela da reunião (T52)', () => {
  it('título, a sugestão do preparador por escrito e os dois grupos com os 12 focos, já marcados com a sugestão', () => {
    render(<Reuniao sugestao="passe|drible" onChoose={() => {}} />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })).toBeInTheDocument();
    expect(screen.getByText(t('ui.reuniao.sugestao', { principal: focusName('passe'), secundario: focusName('drible') }))).toBeInTheDocument();
    for (const k of ['principal', 'secundario'] as const) expect(within(group(k)).getAllByRole('radio')).toHaveLength(12);
    expect(within(group('principal')).getByRole('radio', { name: focusName('passe') })).toBeChecked();
    expect(within(group('secundario')).getByRole('radio', { name: focusName('drible') })).toBeChecked();
  });

  it('"Propor ao técnico" manda "principal|secundário"', () => {
    const onChoose = vi.fn();
    render(<Reuniao sugestao="passe|drible" onChoose={onChoose} />);
    fireEvent.click(within(group('principal')).getByRole('radio', { name: focusName('bolaParada') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') }));
    expect(onChoose).toHaveBeenCalledWith('bolaParada|drible');
  });

  it('principal e secundário nunca ficam iguais: marcar no principal o que era o secundário troca os dois', () => {
    const onChoose = vi.fn();
    render(<Reuniao sugestao="passe|drible" onChoose={onChoose} />);
    fireEvent.click(within(group('principal')).getByRole('radio', { name: focusName('drible') }));
    expect(within(group('secundario')).getByRole('radio', { name: focusName('passe') })).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') }));
    expect(onChoose).toHaveBeenCalledWith('drible|passe');
  });

  it('nenhum número de atributo na tela', () => {
    render(<Reuniao sugestao="passe|drible" onChoose={() => {}} />);
    expect(screen.getByRole('main').textContent).not.toMatch(/\d/);
  });
});

describe('resposta da comissão (T52)', () => {
  it('aceita: diz os dois focos combinados', () => {
    render(<ReuniaoResposta resposta={{ response: 'aceita', focus: { main: 'passe', secondary: 'drible' } }} onDone={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: t('ui.reuniao.resposta.aceita.titulo') });
    expect(dialog).toHaveTextContent(t('ui.reuniao.resposta.aceita.texto', { principal: focusName('passe'), secundario: focusName('drible') }));
  });

  it('contrapropõe: o clube precisa de outra coisa, e o pedido fica como secundário', () => {
    render(<ReuniaoResposta resposta={{ response: 'contrapropoe', focus: { main: 'marcacao', secondary: 'passe' } }} onDone={() => {}} />);
    expect(screen.getByRole('dialog', { name: t('ui.reuniao.resposta.contrapropoe.titulo') })).toHaveTextContent(t('ui.reuniao.resposta.contrapropoe.texto', { principal: focusName('marcacao'), secundario: focusName('passe') }));
  });

  it('recusa: o motivo em palavras (moral, relação com o técnico ou momento); "Seguir" fecha, uma vez só', () => {
    const onDone = vi.fn();
    render(<ReuniaoResposta resposta={{ response: 'recusa', reason: 'relacao', focus: {} }} onDone={onDone} />);
    const dialog = screen.getByRole('dialog', { name: t('ui.reuniao.resposta.recusa.titulo') });
    expect(dialog).toHaveTextContent(t('ui.reuniao.resposta.recusa.relacao'));
    const seguir = within(dialog).getByRole('button', { name: t('ui.resultado.seguir') });
    expect(seguir).toHaveFocus();
    fireEvent.click(seguir);
    fireEvent.click(seguir);
    expect(onDone).toHaveBeenCalledOnce();
  });
});

describe('layout da reunião (T52)', () => {
  it('CSS: os 12 focos aparecem todos, quebrando em linhas (sem a faixa que desliza da criação)', () => {
    const css = readFileSync(resolve(__dirname, 'Reuniao.css'), 'utf8');
    expect(css).toMatch(/\.reuniao \.escolhas__lista\s*\{[^}]*flex-wrap:\s*wrap/);
    expect(css).toMatch(/\.reuniao \.escolhas__lista\s*\{[^}]*overflow:\s*visible/);
  });
});
