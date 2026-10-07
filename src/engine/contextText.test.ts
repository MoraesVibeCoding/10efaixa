import { CONTEXT_TAGS } from './contextTags';
import { LIMITS, composeText, layerErrors, worstCase, type Layers } from './contextText';

// T25e (SPEC 6.13c): texto em camadas = abertura (etiqueta mais forte que o evento conhece) + texto base + até 2 frases de contexto.
const L: Layers = {
  texto: 'O apito final soou.',
  abertura: { vilao: 'A torcida já não perdoa.', jovem: 'Você ainda é um moleque.' },
  contexto: { moralBaixa: 'A cabeça pesa.', noBanco: 'O banco virou rotina.', salarioAtrasado: 'O salário atrasou de novo.', veterano: 'Os joelhos avisam.' },
};

describe('texto em camadas (T25e)', () => {
  it('sem etiqueta, o texto é só o base (o evento de hoje não muda)', () => {
    expect(composeText(L, [])).toBe('O apito final soou.');
    expect(composeText({ texto: 'Só o base.' }, ['vilao', 'jovem'])).toBe('Só o base.');
  });

  it('a abertura vem da etiqueta mais forte que o evento conhece (as outras ficam de fora)', () => {
    expect(composeText(L, ['vilao', 'jovem'])).toBe('A torcida já não perdoa. O apito final soou.');
    expect(composeText(L, ['moralBaixa', 'jovem'])).toBe('Você ainda é um moleque. O apito final soou. A cabeça pesa.');
  });

  it('até 2 frases de contexto, por prioridade, sem repetir a etiqueta da abertura', () => {
    const out = composeText(L, ['salarioAtrasado', 'moralBaixa', 'noBanco', 'veterano']);
    expect(out).toBe('O apito final soou. O salário atrasou de novo. A cabeça pesa.');
  });

  it('etiqueta que o evento não conhece é ignorada', () => {
    expect(composeText(L, ['capitao', 'convocado'])).toBe('O apito final soou.');
  });

  it('o limite de frases de contexto vem dos dados', () => {
    expect(LIMITS.maxContexto).toBe(2);
  });

  describe('validação das camadas', () => {
    it('etiqueta inexistente, frase longa demais e aspas retas são erros', () => {
      expect(layerErrors('x', { texto: 'ok', abertura: { naoExiste: 'Frase.' } })).toHaveLength(1);
      expect(layerErrors('x', { texto: 'ok', abertura: { jovem: 'a'.repeat(LIMITS.aberturaMax + 1) } })).toHaveLength(1);
      expect(layerErrors('x', { texto: 'ok', contexto: { noBanco: 'b'.repeat(LIMITS.contextoMax + 1) } })).toHaveLength(1);
      expect(layerErrors('x', { texto: 'ok', contexto: { noBanco: 'Ele disse "oi".' } })).toHaveLength(1);
      expect(layerErrors('x', L)).toEqual([]);
    });

    it('o pior caso (base + maior abertura + 2 maiores contextos) cabe no limite de tamanho', () => {
      expect(worstCase(L)).toBeLessThanOrEqual(LIMITS.textoMax);
      const longo: Layers = { texto: 't'.repeat(280), abertura: { jovem: 'a'.repeat(LIMITS.aberturaMax) }, contexto: { noBanco: 'b'.repeat(LIMITS.contextoMax), moralBaixa: 'c'.repeat(LIMITS.contextoMax), veterano: 'd'.repeat(LIMITS.contextoMax) } };
      expect(worstCase(longo)).toBe(280 + LIMITS.aberturaMax + 2 * LIMITS.contextoMax + 3);
    });
  });

  it('todas as etiquetas usadas nos exemplos existem', () => {
    const ids = CONTEXT_TAGS.map((x) => x.id);
    for (const k of [...Object.keys(L.abertura!), ...Object.keys(L.contexto!)]) expect(ids).toContain(k);
  });
});
