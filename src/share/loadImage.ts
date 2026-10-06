/** Carrega uma imagem para desenhar no canvas; sem endereço ou com erro, devolve undefined (o cartão sai sem retrato). */
export function loadImage(src: string | undefined): Promise<HTMLImageElement | undefined> {
  if (!src) return Promise.resolve(undefined);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { resolve(img); };
    img.onerror = () => { resolve(undefined); };
    img.src = src;
  });
}
