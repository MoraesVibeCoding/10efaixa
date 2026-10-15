import { cleanup, render, screen } from '@testing-library/react';
import { t } from '../../i18n';
import { Decision } from './Decision';

// v3.10 (pedido do usuário em 2026-10-15): a proposta de mudança de posição diz qual posição, no texto e nas opções,
// e mostra o over em cada uma (o overall pode ir em número na tela de decisão, v2.16).
const PLAYER = {
  name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 82, titles: [], role: 'titularRegular', monthlySalary: { amount: 4_000, currency: 'BRL' as const },
  textoParams: { posicao: 'volante', posicaoAtual: 'meia' }, posicaoOferecida: { de: 'meia', para: 'volante', overDe: 82, overPara: 84 },
};

describe('mudança de posição na tela (v3.10)', () => {
  afterEach(cleanup);

  it('o texto e as opções dizem a posição oferecida', () => {
    render(<Decision eventId="mudanca-posicao" age={31} progress={0.6} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} />);
    expect(screen.getByText(/Falta gente para jogar como volante/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(t('events.mudanca-posicao.opcoes.aceitar', PLAYER.textoParams)) })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /seu lugar é como meia/ })).toBeInTheDocument();
  });

  it('mostra o over em cada posição', () => {
    render(<Decision eventId="mudanca-posicao" age={31} progress={0.6} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} />);
    expect(screen.getByText(t('ui.decisao.posicaoOferecida', { de: 'Meia', overDe: 82, para: 'Volante', overPara: 84 }))).toBeInTheDocument();
  });
});
