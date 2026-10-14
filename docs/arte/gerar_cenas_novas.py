#!/usr/bin/env python3
"""Prompts das cenas novas, por FORMATO de cabelo (SPEC v2.96): docs/arte/cenas-novas/<NN-nome>/<formato>/prompt.md.

Como as cenas são de costas, pele e cor do cabelo saem por código (máscaras + recolor sobre a pintura de pele marrom e cabelo
castanho-escuro); só o formato do cabelo precisa ser pintado. São 9 formatos: os 6 que já existem (curto, cacheado médio, liso médio,
cacheado grande, liso grande, careca) e 3 novos (degradê alto, tranças, coque).
  - cenas 01 a 21 (já têm os 6 formatos pintados): só os 3 formatos novos  -> 63 prompts
  - cenas 22 a 39 (sem imagem nenhuma):            os 9 formatos           -> 162 prompts
Cada prompt é o do corte `curto` da mesma cena (docs/arte/cenas/<cena>/curto/prompt.md) com o cabelo e o título trocados; o resto
(cena, estilo, plano de cor, composição) fica idêntico. A pele continua marrom e o cabelo castanho-escuro de propósito: é a base
que o código recolore.

Uso:  python3 docs/arte/gerar_cenas_novas.py [pasta de saída]   (padrão: docs/arte/cenas-novas)
Autoteste:  python3 docs/arte/test_gerar_cenas_novas.py
"""
import glob
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CENAS = os.path.join(HERE, 'cenas')

CABELO_CURTO = 'short curly dark-brown hair, cut close to the head'

FORMATOS = {
    'curto': ('Curto', CABELO_CURTO),
    'cacheado-medio': ('Cacheado médio', 'medium-length curly dark-brown hair with soft volume, covering the top of his ears and ending at the nape of his neck'),
    'liso-medio': ('Liso médio', 'medium-length straight dark-brown hair, covering the top of his ears and ending at the nape of his neck'),
    'cacheado-grande': ('Cacheado grande', 'long, voluminous curly dark-brown hair, loose and not tied, that falls to his shoulders and ends there'),
    'liso-grande': ('Liso grande', 'long, straight dark-brown hair, loose and not tied (no ponytail, no bun), that falls to his shoulders and ends there'),
    'careca': ('Careca', 'a completely shaved, smooth bald head with no hair at all'),
    'degrade-alto': ('Degradê alto', 'a short high fade in dark-brown hair: the sides and back of the head are faded down to the skin up to the temples, and the top is short and textured, about 3 cm'),
    'trancas': ('Tranças', 'long dark-brown braids: tight cornrow braids run back across the top of the head and the braid ends gather behind the head and end at shoulder height'),
    'coque': ('Coque', 'long dark-brown hair pulled up and gathered into a neat bun at the crown of the head, with the back of the neck and both ears clear'),
}
FORMATOS_NOVOS = ['degrade-alto', 'trancas', 'coque']
SOLTO_NAO_VALE = ('careca', 'degrade-alto', 'trancas', 'coque')  # nestes formatos "solto, sem prender" contradiz o cabelo
PRIMEIRA_LEVA = ['11-treino', '21-estadio', '02-vestiario', '08-casa-familia', '12-gol']  # as 5 cenas mais usadas (62% das decisões)


def cenas():
    return sorted(os.path.basename(os.path.dirname(os.path.dirname(p))) for p in glob.glob(os.path.join(CENAS, '*', 'curto', 'prompt.md')))


def prompt(cena, formato):
    t = open(os.path.join(CENAS, cena, 'curto', 'prompt.md'), encoding='utf-8').read()
    nome, cabelo = FORMATOS[formato]
    assert t.count(CABELO_CURTO) == 1, f'{cena}: a frase do cabelo curto mudou'
    assert t.splitlines()[0].endswith('corte Curto'), f'{cena}: o título do corte curto mudou'
    t = t.replace(CABELO_CURTO, cabelo)
    if formato in SOLTO_NAO_VALE:
        t = t.replace(' The hair is loose, not tied.', '')  # só os prompts escritos à mão (lotes 1 e 2) trazem esta frase
    return t.replace('corte Curto', f'formato {nome}', 1)


def formatos_da(cena):
    return list(FORMATOS) if int(cena[:2]) >= 22 else FORMATOS_NOVOS


def readme(total):
    linhas = [f'| {c}/{f} | {FORMATOS[f][0]} |' for c in PRIMEIRA_LEVA for f in FORMATOS_NOVOS]
    return f'''# Cenas novas por formato de cabelo (SPEC v2.96)

**{total} imagens a gerar.** Cada pasta `<NN-nome>/<formato>/` tem um `prompt.md`; salve a imagem gerada na mesma pasta como `imagem.jpeg`.

- Cenas 01 a 21: já têm os 6 formatos pintados no jogo; aqui só os 3 formatos novos (degradê alto, tranças, coque): 63 imagens.
- Cenas 22 a 39: ainda sem imagem; aqui os 9 formatos: 162 imagens. Estes prompts **substituem** os de `docs/arte/cenas/22` a `39`.
- **Não mude pele nem cor do cabelo no prompt.** A pintura é sempre de pele marrom e cabelo castanho-escuro; o jogo recolore por código (4 tons de pele, qualquer cor de cabelo).
- Sem acessórios (faixa, boné, óculos).

## Primeira leva (15 imagens, as 5 cenas mais usadas)

| Pasta | Formato |
|---|---|
''' + '\n'.join(linhas) + '\n'


def gerar(saida):
    total = 0
    for cena in cenas():
        for formato in formatos_da(cena):
            pasta = os.path.join(saida, cena, formato)
            os.makedirs(pasta, exist_ok=True)
            with open(os.path.join(pasta, 'prompt.md'), 'w', encoding='utf-8') as f:
                f.write(prompt(cena, formato))
            total += 1
    with open(os.path.join(saida, 'README.md'), 'w', encoding='utf-8') as f:
        f.write(readme(total))
    return total


if __name__ == '__main__':
    saida = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'cenas-novas')
    print('ok', gerar(saida), 'prompts em', os.path.relpath(saida, os.getcwd()))
