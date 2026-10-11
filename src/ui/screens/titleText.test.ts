import { describe, expect, it } from 'vitest';
import { TITLE_COUNTRIES } from '../../engine/titleId';
import { t } from '../../i18n';
import { tituloNome } from './titleText';

describe('tituloNome (v2.90): liga e copa nacional com o nome do país', () => {
  it('Europa, fora do eixo e América do Sul', () => {
    expect(tituloNome('ligaNacional:ENG')).toBe('Liga Inglesa');
    expect(tituloNome('copaNacional:ESP')).toBe('Copa da Espanha');
    expect(tituloNome('ligaNacional:SAU')).toBe('Liga Saudita');
    expect(tituloNome('ligaNacional:ARG')).toBe('Liga Argentina');
  });

  it('sem país (save antigo) ou outra competição: o nome de sempre', () => {
    expect(tituloNome('ligaNacional')).toBe(t('ui.titulo.ligaNacional'));
    expect(tituloNome('serieA')).toBe(t('ui.titulo.serieA'));
  });

  it('todo país em que dá para ser campeão tem nome de liga', () => {
    for (const p of TITLE_COUNTRIES) expect(tituloNome(`ligaNacional:${p}`), p).not.toBe(t('ui.titulo.ligaNacional'));
  });
});
