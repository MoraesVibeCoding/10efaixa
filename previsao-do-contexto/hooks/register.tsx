import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Previsao } from '../types'
import { TURNOS, comSinal, emK, grafico, percentualDe, tempoDe } from './previsao'

const previsao = atom(
  { plugin: 'previsao-do-contexto', key: 'previsao' } as const,
  null,
)

async function medir($: EngineInterface, contaTurno: boolean): Promise<void> {
  const { context } = await $.session.usage()
  const { tokens, window: janela } = context

  await update($, previsao, (anterior): Previsao | null => {
    if (tokens === undefined) {
      return anterior === null ? null : { ...anterior, janela, temLeitura: false }
    }

    const somas = anterior?.somas ?? []

    return {
      tokens,
      janela,
      somas: contaTurno
        ? [...somas, tokens - (anterior?.tokens ?? 0)].slice(-TURNOS)
        : somas,
      temLeitura: true,
    }
  })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await medir($, false)

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    // Só os turnos da conversa principal enchem a janela que a linha mostra.
    if (e.agentId === undefined) {
      await medir($, true)
    }

    return next(e)
  })

  on('session.end', async ($, e, next) => {
    if (e.reason === 'clear') {
      await update($, previsao, () => null)
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const atual = await read($, previsao)

    if (atual === null || !atual.temLeitura) {
      return (
        <Box>
          <Text dimColor wrap="truncate-end">
            Previsão do contexto: aguardando o próximo turno
          </Text>
        </Box>
      )
    }

    const percentual = percentualDe(atual.tokens, atual.janela)
    const tempo = tempoDe(percentual)
    const ultima = atual.somas.at(-1)
    const rotulo = tempo.simbolo === '' ? tempo.palavra : `${tempo.simbolo} ${tempo.palavra}`

    return (
      <Box>
        <Text wrap="truncate-end">
          <Text color={tempo.cor} bold>
            {rotulo}
          </Text>
          <Text>
            {`  ${percentual}%  ${emK(atual.tokens)} / ${emK(atual.janela)}`}
          </Text>
          {ultima === undefined ? null : (
            <Text color={tempo.cor}>
              {`  ${grafico(atual.somas)}`}
            </Text>
          )}
          {ultima === undefined ? null : (
            <Text dimColor>
              {`  ${comSinal(ultima)} no último turno`}
            </Text>
          )}
        </Text>
      </Box>
    )
  })
}
