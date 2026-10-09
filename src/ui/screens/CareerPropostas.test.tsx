import { fireEvent, render, screen } from '@testing-library/react';
import { autoChoice } from '../../engine/events';
import type { CreationInput } from '../../engine/player';
import { t } from '../../i18n';
import { Career } from './Career';

// T28d: com a proposta na tela ligada nos três ritmos (aqui por mock; em flow.json é o que a T28d entrega), a carreira jogada para na
// tela de propostas, o jogador escolhe e o jogo segue sem travar.
vi.mock('../../data/flow.json', async (original) => {
  const real = await original<{ default: Record<string, unknown> }>();
  return { default: { ...real.default, propostasNaTela: { rapido: true, normal: true, completo: true } } };
});

const INPUT: CreationInput = {
  name: 'Dudu Maestro', shirtNumber: 11, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia',
};
const LOOK = { skin: 't6', hairStyle: 'curto', hairColor: 'preto', beard: null, headband: null, boots: 'preta' };
const onProposalScreen = () => screen.queryByRole('heading', { level: 1, name: t('ui.proposta.titulo') });

/** Joga até a primeira tela de propostas (reunião aceita a sugestão, eventos com a escolha do temperamento). */
function playUntilProposals() {
  for (let guard = 0; guard < 400 && !onProposalScreen(); guard++) {
    const resposta = document.querySelector('.reuniao__resposta');
    if (resposta) { fireEvent.click(resposta.querySelector('button')!); continue; }
    if (screen.queryByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })) { fireEvent.click(screen.getAllByRole('radio')[0]!); fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') })); continue; }
    // v2.64: o empréstimo usa a tela de cartões; aqui ele fica (o primeiro cartão é o clube atual)
    if (screen.queryByRole('heading', { level: 1, name: t('ui.emprestimo.titulo') })) { fireEvent.click(screen.getAllByRole('radio', { name: /./ })[0]!); fireEvent.click(screen.getByRole('button', { name: t('ui.proposta.confirmar') })); continue; }
    const el = document.querySelector('[data-evento]');
    if (!el) break;
    const choice = autoChoice(el.getAttribute('data-evento')!, document.querySelector('[data-temperamento]')!.getAttribute('data-temperamento')!);
    fireEvent.click(document.querySelector(`[data-opcao-id="${choice}"]`)!);
    fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.resultado.seguir') }));
  }
}

describe('carreira com propostas na tela (T28d)', () => {
  it('chega à tela de contratos, o clube atual segue o jogo e a escolha entra no save', { timeout: 60_000 }, () => {
    const onProgress = vi.fn();
    render(<Career input={INPUT} look={LOOK} seed={11} ritmo="normal" onRestart={() => {}} onProgress={onProgress} />);
    playUntilProposals();
    expect(onProposalScreen()).not.toBeNull();
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(1);
    fireEvent.click(screen.getAllByRole('radio')[0]!);
    fireEvent.click(screen.getByRole('button', { name: t('ui.proposta.confirmar') }));
    expect(onProposalScreen()).toBeNull();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    // o primeiro cartão é o clube atual: ficar, ou renovar quando o contrato acaba
    expect(['ficar', 'renovar']).toContain((onProgress.mock.calls.at(-1)![0] as string[]).at(-1));
  });

  it('aceitar uma proposta leva ao clube dela e guarda "aceitar:<clube>"', { timeout: 60_000 }, () => {
    const onProgress = vi.fn();
    render(<Career input={INPUT} look={LOOK} seed={11} ritmo="normal" onRestart={() => {}} onProgress={onProgress} />);
    playUntilProposals();
    fireEvent.click(screen.getAllByRole('radio')[1]!);
    fireEvent.click(screen.getByRole('button', { name: t('ui.proposta.confirmar') }));
    expect(onProposalScreen()).toBeNull();
    expect((onProgress.mock.calls.at(-1)![0] as string[]).some((c) => c.startsWith('aceitar:'))).toBe(true);
  });
});
