// T50: faixas de escolha que deslizam para o lado (Creation.tsx).

/** A faixa rola até a opção marcada (sorteio ou valor inicial fora da vista), sem mexer no foco nem na página. */
export function revealChecked(list: HTMLElement | null) {
  const label = list?.querySelector('input:checked')?.closest('label');
  if (!list || !label) return;
  const inView = label.offsetLeft >= list.scrollLeft && label.offsetLeft + label.offsetWidth <= list.scrollLeft + list.clientWidth;
  if (!inView) list.scrollLeft = label.offsetLeft - list.clientWidth / 2 + label.offsetWidth / 2;
}
