import { expect, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'

const FAIXA = {
  plugin: 'previsao-do-contexto',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 100,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
  },
} as const

const TURNO = {
  answer: 'ok',
  durationMs: 1000,
  isAborted: false,
  reason: 'answer',
} as const

// A linha inteira como desenhada, e a cor da palavra do tempo.
async function linha(
  $: Engine,
  surface: 'terminal' | 'desktop',
): Promise<{ texto: string; cor: unknown }> {
  const ui = await $.ui.mount({ ...FAIXA, surface })
  const texto = (await ui.find({ type: 'Box' }))?.text ?? ''
  const partes = await ui.findAll({ type: 'Text' })
  const cor = partes.find(parte => parte.props.bold === true)?.props.color
  await ui.unmount()

  return { texto, cor }
}

test('a linha acompanha a janela turno a turno', async ($, on) => {
  let tokens: number | undefined

  on('session.usage', () => ({
    value: { startedAt: 0, context: { tokens, window: 200_000 }, rateLimits: [] },
  }))
  on('session.end', (_, e) => ({ sessionId: e.sessionId }))
  on('turn.complete', (_, e) => ({ text: e.answer }))

  for (const surface of ['terminal', 'desktop'] as const) {
    tokens = undefined
    await $.session.end({ reason: 'clear', sessionId: 's' })
    expect((await linha($, surface)).texto).toBe(
      'Previsão do contexto: aguardando o próximo turno',
    )

    tokens = 36_000
    await $.turn.complete({ ...TURNO, turnId: 't1' })
    expect(await linha($, surface)).toEqual({
      texto: '☼ Limpo  18%  36k / 200k  █  +36k no último turno',
      cor: 'yellow',
    })

    tokens = 60_000
    await $.turn.complete({ ...TURNO, turnId: 't2' })
    expect(await linha($, surface)).toEqual({
      texto: '≈ Nublado  30%  60k / 200k  █▆  +24k no último turno',
      cor: 'cyan',
    })

    tokens = 134_000
    await $.turn.complete({ ...TURNO, turnId: 't3' })
    expect(await linha($, surface)).toEqual({
      texto: '∩ Chuva  67%  134k / 200k  ▄▃█  +74k no último turno',
      cor: 'blue',
    })

    // Um turno de subagente não conta.
    tokens = 199_000
    await $.turn.complete({ ...TURNO, turnId: 't4', agentId: 'a1' })
    expect((await linha($, surface)).texto).toContain('67%  134k / 200k')

    tokens = 160_000
    await $.turn.complete({ ...TURNO, turnId: 't5' })
    expect(await linha($, surface)).toEqual({
      texto: '! Tempestade  80%  160k / 200k  ▄▃█▃  +26k no último turno',
      cor: 'magenta',
    })

    tokens = 184_000
    await $.turn.complete({ ...TURNO, turnId: 't6' })
    expect(await linha($, surface)).toEqual({
      texto: 'Compacta logo  92%  184k / 200k  ▄▃█▃▃  +24k no último turno',
      cor: 'red',
    })

    // Depois de compactar a janela encolhe: soma negativa, barra mais baixa.
    tokens = 40_000
    await $.turn.complete({ ...TURNO, turnId: 't7' })
    expect(await linha($, surface)).toEqual({
      texto: '☼ Limpo  20%  40k / 200k  ▄▃█▃▃▁  -144k no último turno',
      cor: 'yellow',
    })
  }
})

test('o gráfico guarda só os últimos 12 turnos', async ($, on) => {
  let tokens = 0

  on('session.usage', () => ({
    value: { startedAt: 0, context: { tokens, window: 1_000_000 }, rateLimits: [] },
  }))
  on('turn.complete', (_, e) => ({ text: e.answer }))

  for (let turno = 1; turno <= 15; turno += 1) {
    tokens += 1000 * turno
    await $.turn.complete({ ...TURNO, turnId: `t${turno}` })
  }

  expect((await linha($, 'terminal')).texto).toBe(
    '☼ Limpo  12%  120k / 1M  ▃▃▄▄▅▅▆▆▇▇██  +15k no último turno',
  )
})
