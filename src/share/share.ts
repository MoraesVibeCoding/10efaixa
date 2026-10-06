import { t } from '../i18n';
import type { CardModel } from './cardModel';

// T56 (SPEC 6.15): compartilhar o cartão. API conferida na MDN (mdn/content, Navigator.share e Navigator.canShare):
// share() pede um toque do usuário (transient activation) e, para arquivo, testa-se canShare({ files }) antes;
// AbortError = a pessoa cancelou. Sem suporte ou bloqueado, a imagem é baixada.
export type ShareOutcome = 'compartilhado' | 'cancelado' | 'baixado';
export interface ShareNavigator { canShare?: (data: ShareData) => boolean; share?: (data: ShareData) => Promise<void> }

/** Texto pronto para WhatsApp (e para acompanhar a imagem no compartilhamento nativo). */
export const shareText = (m: CardModel): string =>
  t('ui.compartilhar.texto', { nome: m.nome, apelido: m.apelido, veredito: m.veredito, codigo: m.codigo });

/** Nome do arquivo: só o código da carreira, nunca o nome digitado (privacidade, CLAUDE.md). */
export const cardFileName = (codigo: string) => `10efaixa-${codigo}.png`;

export async function shareCard(file: File, text: string, nav: ShareNavigator, download: (file: File) => void): Promise<ShareOutcome> {
  const data = { files: [file], text };
  if (nav.share && nav.canShare?.(data)) {
    try {
      await nav.share(data);
      return 'compartilhado';
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'cancelado';
    }
  }
  download(file);
  return 'baixado';
}

/** Baixa o arquivo pelo navegador (link temporário com `download`). */
export function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const a = Object.assign(document.createElement('a'), { href: url, download: file.name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => { URL.revokeObjectURL(url); }, 0);
}
