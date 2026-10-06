import { fireEvent, render, screen, within } from '@testing-library/react';
import { t } from '../../i18n';
import { Ritmo } from './Ritmo';

// T53a (SPEC 6.16): o ritmo é escolhido depois da revelação. Normal já vem marcado.
describe('tela de ritmo (T53a)', () => {
  const group = () => screen.getByRole('radiogroup', { name: t('ui.ritmo.titulo') });

  it('três ritmos, cada um com o nome e a frase (duração e como decide)', () => {
    render(<Ritmo onChoose={() => {}} onBack={() => {}} />);
    const radios = within(group()).getAllByRole('radio');
    expect(radios).toHaveLength(3);
    for (const id of ['rapido', 'normal', 'completo']) {
      const radio = within(group()).getByRole('radio', { name: t(`ui.ritmo.${id}.nome`) });
      expect(radio).toHaveAccessibleDescription(t(`ui.ritmo.${id}.detalhe`));
    }
  });

  it('Normal vem marcado; trocar e começar entrega o ritmo escolhido', () => {
    const onChoose = vi.fn();
    render(<Ritmo onChoose={onChoose} onBack={() => {}} />);
    expect(within(group()).getByRole('radio', { name: t('ui.ritmo.normal.nome') })).toBeChecked();
    fireEvent.click(within(group()).getByRole('radio', { name: t('ui.ritmo.rapido.nome') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.ritmo.comecar') }));
    expect(onChoose).toHaveBeenCalledWith('rapido');
  });

  it('"Voltar" volta para a revelação', () => {
    const onBack = vi.fn();
    render(<Ritmo onChoose={() => {}} onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
