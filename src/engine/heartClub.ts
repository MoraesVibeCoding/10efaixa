import { CLUBS } from './clubs';

// 6.18: lista do clube de coração — clubes do estado natal primeiro, depois os demais; cada bloco por reputação.
export const heartClubOptions = (state: string): string[] =>
  [...CLUBS]
    .sort((a, b) => Number(b.uf === state) - Number(a.uf === state) || b.reputacao - a.reputacao)
    .map((c) => c.id);
