import { fireEvent, render, screen, within } from '@testing-library/react';
import { App } from './App';
import { t } from './i18n';

// T51 (b): o app de ponta a ponta. Até a T49 ele abria numa decisão de amostra; agora começa na criação de verdade
// (a abertura, o sorteio e o ritmo da T48 ainda não têm tela).
const group = (k: string) => screen.getByRole('radiogroup', { name: t(`ui.criacao.${k}`) });
const advance = () => fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.avancar') }));

function createPlayer() {
  fireEvent.change(screen.getByLabelText(t('ui.criacao.quemE.nome')), { target: { value: 'Dudu Maestro' } });
  fireEvent.change(screen.getByLabelText(t('ui.criacao.quemE.estado')), { target: { value: 'BA' } });
  fireEvent.click(within(group('quemE.comemoracao')).getByRole('radio', { name: t('creation.celebration.aviaozinho') }));
  advance();
  advance(); // tela "seu visual" (v2.35): o visual já vem sorteado
  fireEvent.click(within(group('emCampo.posicao')).getByRole('radio', { name: t('positions.atacante') }));
  fireEvent.click(within(group('emCampo.estilo')).getByRole('radio', { name: t('archetypes.archetype.matador') }));
  fireEvent.click(within(group('emCampo.temperamento')).getByRole('radio', { name: t('creation.temperament.frio') }));
  advance();
  fireEvent.click(within(group('origem.titulo')).getByRole('radio', { name: t('creation.origin.varzea') }));
  advance();
}

describe('App (T51b): criação → carreira', () => {
  it('abre na criação, no passo "quem é ele"', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.criacao.passos.quemE') })).toBeInTheDocument();
  });

  it('ao concluir a criação, a carreira começa na primeira decisão do jogador criado', () => {
    const { container } = render(<App seed={11} />);
    createPlayer();
    expect(container.querySelector('main[data-evento]')).not.toBeNull();
    expect(screen.getByText('Dudu Maestro', { selector: '.figurinha__nome' })).toBeInTheDocument();
  });

  it('sem tela de abertura ainda, "Voltar" no primeiro passo recomeça a criação limpa', () => {
    render(<App />);
    const nome = screen.getByLabelText(t('ui.criacao.quemE.nome'));
    fireEvent.change(nome, { target: { value: 'Dudu Maestro' } });
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(screen.getByLabelText(t('ui.criacao.quemE.nome'))).toHaveValue('');
  });
});
