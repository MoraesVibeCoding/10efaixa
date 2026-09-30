import { t } from './index';

describe('i18n pt-BR', () => {
  it('lê chaves aninhadas por arquivo', () => {
    expect(t('attributes.band.muitoBom')).toBe('Muito bom');
    expect(t('positions.goleiro')).toBe('Goleiro');
  });

  it('lê chaves que contêm ponto (erros da criação)', () => {
    expect(t('creation.error.name.blocked')).toBe('Esse nome não pode ser usado. Escolha outro.');
  });

  it('interpola parâmetros', () => {
    expect(t('archetypes.inspiracao', { lenda: 'Zico' })).toBe('Estilo de jogo como o de Zico');
  });

  it('chave inexistente ou que não é texto dá erro', () => {
    expect(() => t('creation.nada')).toThrow();
    expect(() => t('arquivoInexistente.x')).toThrow();
    expect(() => t('creation.error')).toThrow();
  });

  it('parâmetro faltando dá erro (não mostra {lenda} ao jogador)', () => {
    expect(() => t('archetypes.inspiracao')).toThrow();
  });
});

describe('guarda: nenhum texto de interface fora do i18n', () => {
  it('arquivos .tsx não têm texto solto em JSX', () => {
    const files = import.meta.glob<string>(['../**/*.tsx', '!../**/*.test.tsx'], {
      query: '?raw', import: 'default', eager: true,
    });
    const offenders = Object.entries(files).flatMap(([path, src]) =>
      [...src.matchAll(/>([^<>{}]*\p{L}{2,}[^<>{}]*)</gu)].map((m) => `${path}: "${m[1]!.trim()}"`));
    expect(offenders).toEqual([]);
  });
});
