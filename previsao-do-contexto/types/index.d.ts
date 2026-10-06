export type Previsao = {
  /** Tokens na janela na última leitura. */
  tokens: number
  /** Tamanho da janela de contexto do modelo, em tokens. */
  janela: number
  /** Quanto cada um dos últimos turnos somou, o mais recente por último. */
  somas: number[]
  /** Falso logo após uma compactação, até a próxima resposta. */
  temLeitura: boolean
}

declare module 'claude-code' {
  interface PluginState {
    'previsao-do-contexto': { previsao: Previsao | null }
  }
}
