export const TURNOS = 12

const BARRAS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'] as const

export type Tempo = { simbolo: string; palavra: string; cor: string }

export function tempoDe(percentual: number): Tempo {
  if (percentual >= 90) {
    return { simbolo: '', palavra: 'Compacta logo', cor: 'red' }
  }

  if (percentual >= 75) {
    return { simbolo: '!', palavra: 'Tempestade', cor: 'magenta' }
  }

  if (percentual >= 50) {
    return { simbolo: '∩', palavra: 'Chuva', cor: 'blue' }
  }

  if (percentual >= 25) {
    return { simbolo: '≈', palavra: 'Nublado', cor: 'cyan' }
  }

  return { simbolo: '☼', palavra: 'Limpo', cor: 'yellow' }
}

export function percentualDe(tokens: number, janela: number): number {
  return janela > 0 ? Math.floor((tokens / janela) * 100) : 0
}

export function emK(tokens: number): string {
  const absoluto = Math.abs(tokens)
  const sinal = tokens < 0 ? '-' : ''

  if (absoluto >= 1_000_000) {
    const milhoes = Math.round(absoluto / 100_000) / 10

    return `${sinal}${String(milhoes).replace('.', ',')}M`
  }

  if (absoluto >= 1000) {
    return `${sinal}${Math.round(absoluto / 1000)}k`
  }

  return `${sinal}${absoluto}`
}

export function comSinal(soma: number): string {
  return soma < 0 ? emK(soma) : `+${emK(soma)}`
}

// Uma barrinha por turno, na escala do maior turno mostrado; um turno que
// encolheu a janela (compactação) fica na barra mais baixa.
export function grafico(somas: readonly number[]): string {
  const ultimas = somas.slice(-TURNOS)
  const maior = Math.max(1, ...ultimas)

  return ultimas
    .map(soma => {
      const nivel = Math.round((Math.max(0, soma) / maior) * (BARRAS.length - 1))

      return BARRAS[nivel] ?? BARRAS[0]
    })
    .join('')
}
