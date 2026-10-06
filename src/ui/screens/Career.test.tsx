import { fireEvent, render, screen } from '@testing-library/react';
import type { CreationInput } from '../../engine/player';
import { simulateCareer } from '../../engine/career';
import { autoChoice } from '../../engine/events';
import { t } from '../../i18n';
import { Career } from './Career';

// T51 (b): a carreira jogada na tela, do primeiro momento ao resumo final.
const INPUT: CreationInput = {
  name: 'Dudu Maestro', shirtNumber: 10, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia',
};
const LOOK = { skin: 't6', hairStyle: 'curto', hairColor: 'preto', beard: null, headband: null, boots: 'preta' };

describe('carreira na tela (T51b)', () => {
  it('mostra a primeira decisão com o jogador de verdade', () => {
    // no Rápido não há reunião na tela: a primeira tela é uma decisão
    render(<Career input={INPUT} look={LOOK} seed={11} ritmo="rapido" onRestart={() => {}} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Dudu Maestro', { selector: '.figurinha__tarja-nome' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: t('ui.decisao.ficha') })).toBeInTheDocument();
  });

  it('jogando com as escolhas do temperamento, termina no mesmo resumo que a simulação', { timeout: 60_000 }, () => {
    const onRestart = vi.fn();
    const onProgress = vi.fn();
    render(<Career input={INPUT} look={LOOK} seed={11} onRestart={onRestart} onProgress={onProgress} />);
    for (let guard = 0; guard < 400 && !screen.queryByRole('heading', { level: 1, name: t('ui.fim.titulo') }); guard++) {
      // T52: resposta da comissão por cima da tela; reunião aceita a sugestão do preparador (o mesmo do automático)
      const resposta = document.querySelector('dialog.reuniao__resposta');
      if (resposta) { fireEvent.click(resposta.querySelector('button')!); continue; }
      if (screen.queryByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })) { fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') })); continue; }
      const eventId = document.querySelector('[data-evento]')!.getAttribute('data-evento')!;
      const choice = autoChoice(eventId, document.querySelector('[data-temperamento]')!.getAttribute('data-temperamento')!);
      fireEvent.click(document.querySelector(`[data-opcao-id="${choice}"]`)!);
      fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
      fireEvent.click(screen.getByRole('button', { name: t('ui.resultado.seguir') }));
    }
    const result = simulateCareer(INPUT, 11);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.fim.titulo') })).toBeInTheDocument();
    expect(screen.getByText(t(`legacy.veredito.${result.legacy.verdict}`))).toBeInTheDocument();
    expect(screen.getByText(result.headline)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: t('ui.fim.novaCarreira') }));
    expect(onRestart).toHaveBeenCalledOnce();
    // T54: salvou ao começar e a cada decisão; no fim avisa que terminou (o App apaga o save)
    expect(onProgress.mock.calls[0]).toEqual([[], false]);
    expect(onProgress.mock.calls.some((c) => (c[0] as string[]).some((x) => x.includes('|')))).toBe(true); // houve reunião
    expect(onProgress.mock.calls.at(-1)![1]).toBe(true);
    expect(onProgress.mock.calls.filter((c) => !c[1]).length).toBe(onProgress.mock.calls.at(-1)![0].length);
  });

  it('no Normal, a reunião do meio do ano abre com a sugestão; depois de propor, vem a resposta da comissão por cima da tela', () => {
    render(<Career input={INPUT} look={LOOK} seed={11} ritmo="normal" onRestart={() => {}} />);
    for (let guard = 0; guard < 60 && !screen.queryByRole('heading', { level: 1, name: t('ui.reuniao.titulo') }); guard++) {
      const eventId = document.querySelector('[data-evento]')!.getAttribute('data-evento')!;
      fireEvent.click(document.querySelector(`[data-opcao-id="${autoChoice(eventId, document.querySelector('[data-temperamento]')!.getAttribute('data-temperamento')!)}"]`)!);
      fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
      fireEvent.click(screen.getByRole('button', { name: t('ui.resultado.seguir') }));
    }
    expect(screen.getByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') }));
    const dialog = document.querySelector('dialog.reuniao__resposta') as HTMLElement;
    expect(dialog).not.toBeNull();
    expect(dialog.querySelector('h2')!.textContent).toMatch(new RegExp([t('ui.reuniao.resposta.aceita.titulo'), t('ui.reuniao.resposta.contrapropoe.titulo'), t('ui.reuniao.resposta.recusa.titulo')].join('|')));
    fireEvent.click(dialog.querySelector('button')!);
    expect(document.querySelector('dialog.reuniao__resposta')).toBeNull();
  });

  it('a linha "Neste semestre" aparece só na primeira decisão depois de cada semestre (T51b)', { timeout: 60_000 }, () => {
    render(<Career input={INPUT} look={LOOK} seed={11} ritmo="completo" onRestart={() => {}} />);
    const seen = new Set<string>();
    let shownCount = 0;
    for (let guard = 0; guard < 120 && !screen.queryByRole('heading', { level: 1, name: t('ui.fim.titulo') }); guard++) {
      const resposta = document.querySelector('dialog.reuniao__resposta');
      if (resposta) { fireEvent.click(resposta.querySelector('button')!); continue; }
      if (screen.queryByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })) { fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') })); continue; }
      const key = document.querySelector('.carreira')!.getAttribute('data-semestre') ?? '';
      const line = document.querySelector('.decisao__semestre');
      if (seen.has(key)) expect(line, `repetiu ${key}`).toBeNull();
      if (line) shownCount++;
      seen.add(key);
      const eventId = document.querySelector('[data-evento]')!.getAttribute('data-evento')!;
      fireEvent.click(document.querySelector(`[data-opcao-id="${autoChoice(eventId, document.querySelector('[data-temperamento]')!.getAttribute('data-temperamento')!)}"]`)!);
      fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
      fireEvent.click(screen.getByRole('button', { name: t('ui.resultado.seguir') }));
    }
    expect(shownCount).toBeGreaterThan(3);
  });
});
