import bands from '../data/bands.json';

// Seção 6.3. Goleiro reusa as mesmas chaves com outro significado (tradução na UI/pesos).
export const ATTRIBUTES = [
  'finalizacao', 'passe', 'habilidade', 'drible',
  'forca', 'velocidade', 'fisico',
  'marcacao', 'mental', 'jogoAereo',
] as const;

export type Attribute = (typeof ATTRIBUTES)[number];
export type Attributes = Record<Attribute, number>;

export interface Band {
  key: string;
  stars: number;
}

/** Converte valor interno (inteiro 1–99) na faixa exibida ao jogador. */
export function toBand(value: number): Band {
  if (!Number.isInteger(value) || value < 1 || value > 99) {
    throw new RangeError(`atributo fora de 1–99: ${value}`);
  }
  const { key, stars } = bands.find((b) => value <= b.max)!;
  return { key, stars };
}
