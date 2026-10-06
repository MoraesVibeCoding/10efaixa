import { simulateCareer } from '../engine/career';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import { cardModel } from './cardModel';
import { cardFileName, shareCard, shareText } from './share';

// T56 (SPEC 6.15): compartilhamento nativo com a imagem, download como alternativa e texto pronto para WhatsApp.
const m = cardModel(simulateCareer(randomInput(createPrng(3)), 3), '10F-7K3Q-9M2X');
const file = new File(['png'], cardFileName(m.codigo), { type: 'image/png' });

describe('compartilhar o cartão (T56)', () => {
  it('texto pronto: nome, apelido, veredito e código', () => {
    const text = shareText(m);
    for (const s of [m.nome, m.apelido, m.veredito, m.codigo]) expect(text).toContain(s);
  });

  it('nome do arquivo só com o código (nada de dado pessoal)', () => {
    expect(cardFileName('10F-7K3Q-9M2X')).toBe('10efaixa-10F-7K3Q-9M2X.png');
  });

  it('com suporte a arquivo, usa o compartilhamento nativo com imagem e texto', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const download = vi.fn();
    const out = await shareCard(file, shareText(m), { canShare: () => true, share }, download);
    expect(out).toBe('compartilhado');
    expect(share).toHaveBeenCalledWith({ files: [file], text: shareText(m) });
    expect(download).not.toHaveBeenCalled();
  });

  it('sem suporte, baixa a imagem', async () => {
    const download = vi.fn();
    expect(await shareCard(file, 'x', {}, download)).toBe('baixado');
    expect(await shareCard(file, 'x', { canShare: () => false, share: vi.fn() }, download)).toBe('baixado');
    expect(download).toHaveBeenCalledTimes(2);
  });

  it('cancelar o compartilhamento não é erro nem baixa nada; outro erro cai no download', async () => {
    const download = vi.fn();
    const abort = Object.assign(new Error('x'), { name: 'AbortError' });
    expect(await shareCard(file, 'x', { canShare: () => true, share: vi.fn().mockRejectedValue(abort) }, download)).toBe('cancelado');
    expect(download).not.toHaveBeenCalled();
    const blocked = Object.assign(new Error('x'), { name: 'NotAllowedError' });
    expect(await shareCard(file, 'x', { canShare: () => true, share: vi.fn().mockRejectedValue(blocked) }, download)).toBe('baixado');
  });
});
