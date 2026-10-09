import { render, screen } from '@testing-library/react';
import { kitOf, shirtPaint } from '../../art/kits';
import avatar from '../../data/avatar.json';
import events from '../../data/events.json';
import { CenaPintada, CUTS, cutForVisual, numberColor, sceneArt } from './CenaPintada';

// T60a: as cenas pintadas na decisão, com a camisa e o calção do clube e o número nas costas quando há uniforme.
describe('cenas pintadas (T60a)', () => {
  it('todo evento tem a sua cena pintada nos 6 cortes de cabelo', () => {
    for (const e of events.eventos) for (const cut of CUTS) expect(sceneArt(e.cena, cut), `${e.cena}/${cut}`).not.toBeNull();
  });

  it('o corte da cena segue o cabelo do visual (todo cabelo da criação tem corte)', () => {
    expect(cutForVisual('visual-05')).toBe('cacheado-grande'); // black power
    expect(cutForVisual('visual-03')).toBe('careca'); // raspado
    expect(cutForVisual(undefined)).toBe('curto');
    for (const style of avatar.styles.hair) expect(CUTS).toContain(cutForVisual(undefined, style));
  });

  it('pinta a camisa com o padrão do clube e põe o número nas costas na cena de uniforme ligada em cortes.json', () => {
    const { container } = render(<CenaPintada scene="gol" cut="curto" clubId="flamengo" number={9} numeroNasCenas={['gol']} alt="Zé comemora o gol" />);
    expect(screen.getByRole('img', { name: 'Zé comemora o gol' })).toBeInTheDocument();
    const camisa = container.querySelector('.cena__camisa') as HTMLElement;
    expect(camisa.style.getPropertyValue('--camisa-desenho')).toBe(shirtPaint(kitOf('flamengo')));
    expect(container.querySelector('.cena__calcao')).not.toBeNull();
    expect(container.querySelector('.cena__numero')).toHaveTextContent('9');
  });

  it('v2.62: o número nas costas fica desligado por padrão (lista numeroNasCenas vazia em cortes.json)', () => {
    const { container } = render(<CenaPintada scene="gol" cut="curto" clubId="flamengo" number={9} alt="x" />);
    expect(container.querySelector('.cena__numero')).toBeNull();
  });

  it('de camiseta (em casa com a família), sem número', () => {
    const { container } = render(<CenaPintada scene="casa-familia" cut="curto" clubId="flamengo" number={9} alt="x" />);
    expect(container.querySelector('.cena__numero')).toBeNull();
  });
});

describe('cor do número nas costas (T60a)', () => {
  it('escolhe entre o detalhe do clube, branco e marinho a cor de maior contraste com a camisa', () => {
    expect(numberColor({ padrao: 'lisa', camisa: ['#C8102E'], detalhe: '#C8102E', calcao: '#FFFFFF', meiao: '#000000' })).toBe('#FFFFFF');
    expect(numberColor({ padrao: 'lisa', camisa: ['#FFFFFF'], detalhe: '#F5F5F5', calcao: '#000000', meiao: '#000000' })).toBe('#14213D');
    expect(numberColor({ padrao: 'lisa', camisa: ['#FFDF00'], detalhe: '#009C3B', calcao: '#002776', meiao: '#FFFFFF' })).toBe('#14213D');
  });
});
