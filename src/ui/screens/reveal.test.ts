import { revealChecked } from './reveal';

// jsdom não calcula layout: as medidas são definidas à mão.
const row = (checkedAt: number) => {
  const list = document.createElement('div');
  for (let i = 0; i < 10; i++) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio'; input.name = 'g'; input.checked = i === checkedAt;
    label.append(input);
    Object.defineProperties(label, { offsetLeft: { value: i * 50 }, offsetWidth: { value: 48 } });
    list.append(label);
  }
  Object.defineProperty(list, 'clientWidth', { value: 200 });
  return list;
};

describe('revealChecked (T50)', () => {
  it('rola a faixa até centralizar a opção marcada que está fora da vista', () => {
    const list = row(8);
    revealChecked(list);
    expect(list.scrollLeft).toBe(8 * 50 - 100 + 24);
  });

  it('não mexe quando a opção marcada já aparece', () => {
    const list = row(1);
    revealChecked(list);
    expect(list.scrollLeft).toBe(0);
  });

  it('sem faixa ou sem opção marcada, não faz nada', () => {
    expect(() => revealChecked(null)).not.toThrow();
    const list = row(-1);
    revealChecked(list);
    expect(list.scrollLeft).toBe(0);
  });
});
