import { creationScene } from './cenaArte';
import { sceneArt } from './cenaArte';

// T60b: a cena pintada ao fundo de cada passo da criação (referência de layout da v2.12: cena ao fundo, painel por cima).
describe('cena da criação (T60b)', () => {
  it('cada passo tem a sua cena; no tipo de início, a cena segue a origem marcada', () => {
    expect(creationScene('quemE', null)).toBe('vestiario');
    expect(creationScene('emCampo', null)).toBe('treino');
    expect(creationScene('origem', 'varzea')).toBe('varzea');
    expect(creationScene('origem', 'peneira')).toBe('peneira');
    expect(creationScene('origem', 'baseGrande')).toBe('treino');
  });

  it('toda cena da criação existe nos 6 cortes', () => {
    for (const [step, origin] of [['quemE', null], ['visual', null], ['emCampo', null], ['origem', null], ['origem', 'varzea'], ['origem', 'peneira'], ['origem', 'baseGrande']] as const) {
      expect(sceneArt(creationScene(step, origin), 'curto'), `${step}/${origin}`).not.toBeNull();
    }
  });
});
