import avatarData from './avatar.json';
import visuais from './visuais.json';
import { t } from '../i18n';

// T50g (SPEC v2.36): os 10 visuais prontos da criação. Dados e arte provisória validados aqui.
type Visual = { id: string; n: number; look: { skin: string; hairStyle: string; hairColor: string; beard: string | null; headband: string | null; boots: string } };
const LIST = visuais.visuais as Visual[];
const ART = import.meta.glob('../assets/visuais/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const ALLOWED_KEYS = ['id', 'n', 'look'];

describe('visuais prontos (T50g, v2.36)', () => {
  it('são 10, numerados de 1 a 10 em ordem, com id visual-NN único', () => {
    expect(LIST).toHaveLength(10);
    expect(LIST.map((v) => v.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(LIST.map((v) => v.id)).toEqual(LIST.map((v) => `visual-${String(v.n).padStart(2, '0')}`));
    expect(new Set(LIST.map((v) => v.id)).size).toBe(10);
  });

  it('só id, número e peças da arte provisória: sem nome nem texto livre (o nome é "Visual N", no i18n)', () => {
    for (const v of LIST) expect(Object.keys(v).sort(), v.id).toEqual([...ALLOWED_KEYS].sort());
    expect(t('ui.criacao.visuais.nome', { n: 3 })).toBe('Visual 3');
  });

  it('as peças de cada visual existem em avatar.json e não há dois visuais iguais', () => {
    const skins = avatarData.skinTones.map((o) => o.id);
    const colors = avatarData.hairColors.map((o) => o.id);
    const faixas = avatarData.escolhas.faixas.map((o) => o.id);
    const boots = avatarData.escolhas.chuteiras.map((o) => o.id);
    for (const { id, look } of LIST) {
      expect(skins, `${id} pele`).toContain(look.skin);
      expect(avatarData.styles.hair, `${id} cabelo`).toContain(look.hairStyle);
      expect(colors, `${id} cor`).toContain(look.hairColor);
      expect([null, ...avatarData.styles.beards], `${id} barba`).toContain(look.beard);
      expect([null, ...faixas], `${id} faixa`).toContain(look.headband);
      expect(boots, `${id} chuteira`).toContain(look.boots);
    }
    expect(new Set(LIST.map((v) => JSON.stringify(v.look))).size).toBe(10);
  });

  it('cada visual tem a imagem provisória visual-NN.webp, em 4:5', () => {
    for (const v of LIST) expect(Object.keys(ART), v.id).toContain(`../assets/visuais/${v.id}.webp`);
    expect(Object.keys(ART)).toHaveLength(10);
  });
});
