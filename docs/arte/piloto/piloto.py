#!/usr/bin/env python3
"""Piloto de cenas pela API (SPEC v3.00): a cena sai pintada inteira, com o visual do jogador e o uniforme do clube.

Entrada:  docs/arte/cenas/<cena>/curto/prompt.md (o prompt de hoje), docs/arte/visuais/visual-NN/{prompt.md,Image.jpeg},
          docs/arte/piloto/kit-<clube>/*.jpeg e docs/arte/piloto/piloto.json (escopo e limite de chamadas).
Saída:    docs/arte/piloto/saida/<cena>-v<NN>.png (2:3 da API), <cena>-v<NN>.webp (4:5 para o jogo) e relatorio.json.

O prompt de hoje é reaproveitado: magenta e ciano (as cores-chave do recolor) viram "club", o plano de cores sai, e um
cabeçalho diz o que é o kit do clube e quem é o jogador. A conferência reprova sobra de magenta ou ciano e faixa de baixo
clara (os painéis do jogo ficam ali); escudo, texto e camisa fora do time ficam para a sua revisão.
Uso:       OPENAI_API_KEY=... uv run --with pillow --with numpy --with openai python docs/arte/piloto/piloto.py
           depois de revisar: ... piloto.py publicar  (copia as aprovadas para src/assets/piloto)
           v3.01: ... piloto.py generico  (todas as cenas, visual de generico.json, uniforme magenta e ciano)
Autoteste: uv run --with pillow --with numpy --with pytest python -m pytest docs/arte/piloto
"""
import base64
import json
import os
import re
import sys

import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, '..', '..', '..'))

# limites da conferência (frações e níveis 0..255)
SOBRA_MAX = 0.0005          # até 0,05% dos pixels com cor-chave passa (ruído de compressão)
FAIXA_DE_BAIXO = 0.3        # os 30% de baixo recebem os painéis do jogo
FAIXA_LUZ_MAX = 70          # luminância média máxima dessa faixa


def extrai_bloco(md):
    """Conteúdo do primeiro bloco de código (``` ou ````) de um prompt.md."""
    m = re.search(r'(`{3,4})[^\n]*\n(.*?)\n\1', md, re.S)
    return m.group(2).strip() if m else md.strip()


def _primeira_frase(md, rotulo):
    m = re.search(rf'^- {rotulo}:\s*(.+)$', md, re.M)
    return m.group(1).split('. ')[0].rstrip('.') if m else ''


def tracos_visual(md):
    """Pele, cabelo e barba do retrato do visual (primeira frase de cada linha)."""
    return {'pele': _primeira_frase(md, 'Skin'), 'cabelo': _primeira_frase(md, 'Hair'),
            'barba': _primeira_frase(md, 'Facial hair')}


def montar_prompt(cena, visual, kit):
    """Prompt da cena com o kit do clube no lugar de magenta e ciano e o jogador do visual.
    Sem kit (modo genérico, v3.01): magenta e ciano ficam, para o uniforme ser aplicado depois; só o jogador muda."""
    if kit is None:
        return ('REFERENCE IMAGES\n'
                '- Image 1: the main character. Match this exact person: same skin tone, same hair (colour, length, '
                f"texture and cut) and same facial hair. Skin: {visual['pele']}. Hair: {visual['cabelo']}. "
                f"Facial hair: {visual['barba']}. This overrides any other description of his skin or hair below.\n"
                '- Image 2: painting style, palette and level of detail only (ignore its people and clothes).\n\n'
                + cena.strip())
    texto = re.sub(r'COLOUR PLAN.*?(?=\n[A-Z][A-Z ,\-]{3,}\n|\Z)', '', cena, flags=re.S)
    texto = re.sub(r'(plain )?(bright )?magenta-and-cyan', 'club', texto, flags=re.I)
    # costas lisas eram para o recolor; com o kit pintado, as costas mostram o desenho do clube (o número segue livre)
    texto = re.sub(r'one smooth, flat, evenly lit (?:plain )?(?:bright )?magenta surface with nothing printed on it',
                   'showing the club jersey design, with no number or text printed on it', texto, flags=re.I)
    texto = re.sub(r'(plain )?(bright )?(magenta|cyan)', 'club', texto, flags=re.I)
    texto = re.sub(r'\n{3,}', '\n\n', texto)
    cabecalho = (
        'REFERENCE IMAGES\n'
        '- Image 1: painting style, palette and level of detail only (ignore its people and clothes).\n'
        f"- Image 2: the main character. Skin: {visual['pele']}. Hair: {visual['cabelo']}. "
        f"Facial hair: {visual['barba']}. This overrides any other description of his skin or hair below.\n"
        '- Images 3 to 6: the club kit. Wherever the text says "club", use this kit, following the body, folds, '
        f"light and shadow: jersey {kit['camisa']}; shorts {kit['calcao']}; socks {kit['meiao']}. "
        'Only the main character and his team-mates wear it; opponents, goalkeeper, staff and crowd keep the '
        'clothes described below. No crest, no logo, no sponsor, no text, no numbers.\n\n')
    return cabecalho + texto.strip()


def conferir(img, generico=False):
    """Motivos de reprovação de uma cena (HxWx3 uint8); lista vazia quando passa. No modo genérico, magenta e ciano
    são o uniforme esperado e não reprovam."""
    a = img.astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    motivos = []
    magenta = (r > 150) & (b > 150) & (g < 0.5 * np.minimum(r, b))
    ciano = (g > 150) & (b > 150) & (r < 0.5 * np.minimum(g, b))
    if not generico and magenta.mean() > SOBRA_MAX:
        motivos.append('magenta')
    if not generico and ciano.mean() > SOBRA_MAX:
        motivos.append('ciano')
    baixo = a[int(a.shape[0] * (1 - FAIXA_DE_BAIXO)):]
    luz = (0.2126 * baixo[..., 0] + 0.7152 * baixo[..., 1] + 0.0722 * baixo[..., 2]).mean()
    if luz > FAIXA_LUZ_MAX:
        motivos.append('faixa-clara')
    return motivos


def _peso_cor(a, chave):
    """Quanto cada pixel é da cor-chave (0..1) pelo matiz (magenta ~300°, ciano ~185°) e pela saturação, com borda
    suave para o contorno antialiasado e as áreas de sombra e reflexo."""
    r, g, b = a[..., 0] / 255, a[..., 1] / 255, a[..., 2] / 255
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    d = mx - mn + 1e-6
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    sat = d / (mx + 1e-6)
    centro, largura = (305, 50) if chave == 'magenta' else (187, 28)
    dist = np.abs((h - centro + 180) % 360 - 180)
    w_h = np.clip((largura - dist) / 12, 0, 1)
    w_s = np.clip((sat - 0.18) / 0.17, 0, 1) * (mx > 0.12)
    w = w_h * w_s
    # contorno: a luz de borda deixa um filete rosado em volta da peça; até 4 px fora dela, ainda no tom, também troca
    from scipy import ndimage as ndi
    # só as peças de roupa: pontos soltos no tom (céu, janela, sombra azulada) ficam como estão
    rot, n = ndi.label(w > 0.5)
    if n:
        tam = ndi.sum(np.ones_like(w), rot, range(1, n + 1))
        grandes = np.isin(rot, 1 + np.nonzero(tam >= max(50, 0.05 * tam.max()))[0])
    else:
        grandes = np.zeros_like(w, bool)
    w = w * ndi.binary_dilation(grandes, iterations=2)
    # a borda cresce a partir da peça só por vizinhos no tom (até 8 px): pega a luz salmão do contorno e para no
    # fundo (céu laranja, sombra marrom), que não encosta no tom
    tom = (dist < largura + 15) * (sat > 0.2) * (mx > 0.15)
    borda = ndi.binary_dilation(grandes, iterations=8, mask=tom | grandes)
    return np.maximum(w, borda.astype(float))


def recolorir(img, magenta=None, ciano=None):
    """v3.04: troca magenta e ciano por cores lisas (RGB), mantendo a luz e a sombra da pintura; o resto fica igual.
    A sombra vem do brilho de cada pixel em relação ao mais claro da peça."""
    a = img.astype(float)
    out = a.copy()
    for chave, cor in (('magenta', magenta), ('ciano', ciano)):
        if cor is None:
            continue
        w = _peso_cor(a, chave)
        if not w.any():
            continue
        brilho = a.max(axis=-1)
        ref = np.percentile(brilho[w > 0.5], 95) if (w > 0.5).any() else 255
        luz = np.clip(brilho / max(ref, 1), 0, 1.15)[..., None]
        alvo = np.array(cor, float)
        # cor escura: sobe um pouco com a luz para o tecido não virar uma mancha chapada
        pintado = alvo * luz + (np.clip(luz - 0.6, 0, None) * 60 if alvo.max() < 60 else 0)
        out = out * (1 - w[..., None]) + np.clip(pintado, 0, 255) * w[..., None]
    return out.round().astype(np.uint8)


def recorta_4x5(img):
    """De 2:3 para 4:5 cortando embaixo (a ação fica nos 60% de cima; a faixa de baixo é escura)."""
    h, w = img.shape[:2]
    return img[:min(h, round(w * 5 / 4))]


def custo_estimado(imagens, por_imagem):
    """Custo em US$ de um lote, pelo valor por imagem entregue de piloto.json (as falhas já estão no valor)."""
    return round(imagens * por_imagem, 2)


def destino_no_jogo(cena, visual, clube):
    """Caminho em src/assets/piloto: a cena sem o número da pasta de arte, o clube e o id do visual."""
    return f"{cena.split('-', 1)[1]}/{clube}/visual-{visual:02d}.webp"


def publicar():
    """Copia as cenas aprovadas (relatório sem motivos) para src/assets/piloto, onde o jogo as encontra."""
    import shutil
    cfg = json.load(open(os.path.join(AQUI, 'piloto.json')))
    relatorio = json.load(open(os.path.join(AQUI, 'saida', 'relatorio.json')))
    for cena in cfg['cenas']:
        for v in cfg['visuais']:
            nome = f"{cena}-v{v:02d}"
            if relatorio.get(nome, {}).get('motivos') != []:
                continue
            alvo = os.path.join(RAIZ, 'src/assets/piloto', destino_no_jogo(cena, v, cfg['clube']))
            os.makedirs(os.path.dirname(alvo), exist_ok=True)
            shutil.copyfile(os.path.join(AQUI, 'saida', nome + '.webp'), alvo)
            print('publicada', alvo)


def _gerar(cliente, prompt, imagens, saida):
    arquivos = [open(p, 'rb') for p in imagens]
    try:
        r = cliente.images.edit(model='gpt-image-2', image=arquivos, prompt=prompt, size='1024x1536')
    finally:
        for f in arquivos:
            f.close()
    with open(saida, 'wb') as f:
        f.write(base64.b64decode(r.data[0].b64_json))


def main():
    from openai import OpenAI
    from PIL import Image
    cfg = json.load(open(os.path.join(AQUI, 'piloto.json')))
    kit_dir = os.path.join(AQUI, cfg['kit']['pasta'])
    kit_imgs = [os.path.join(kit_dir, f) for f in cfg['kit']['imagens']]
    saida = os.path.join(AQUI, 'saida')
    os.makedirs(saida, exist_ok=True)
    rel_path = os.path.join(saida, 'relatorio.json')
    relatorio = json.load(open(rel_path)) if os.path.exists(rel_path) else {}
    chamadas = sum(x['tentativas'] for x in relatorio.values())
    cliente = OpenAI()
    for cena in cfg['cenas']:
        bloco = extrai_bloco(open(os.path.join(RAIZ, 'docs/arte/cenas', cena, 'curto/prompt.md')).read())
        for v in cfg['visuais']:
            nome = f"{cena}-v{v:02d}"
            if relatorio.get(nome, {}).get('motivos') == []:
                continue
            vdir = os.path.join(RAIZ, f'docs/arte/visuais/visual-{v:02d}')
            prompt = montar_prompt(bloco, tracos_visual(open(os.path.join(vdir, 'prompt.md')).read()), cfg['kit']['texto'])
            imagens = [os.path.join(RAIZ, cfg['estilo']), os.path.join(vdir, 'Image.jpeg'), *kit_imgs]
            item = relatorio.get(nome, {'tentativas': 0, 'motivos': None})
            while item['tentativas'] < cfg['tentativasPorImagem'] and item['motivos'] != []:
                if chamadas >= cfg['limiteDeChamadas']:
                    print('limite de chamadas atingido'); break
                png = os.path.join(saida, nome + '.png')
                try:
                    _gerar(cliente, prompt, imagens, png)
                    item['motivos'] = conferir(np.asarray(Image.open(png).convert('RGB')))
                except Exception as e:  # erro da API conta como tentativa e fica no relatório
                    item['motivos'] = [f'erro: {type(e).__name__}: {e}'[:200]]
                item['tentativas'] += 1
                chamadas += 1
                print(nome, item)
            if item['motivos'] == []:
                img = recorta_4x5(np.asarray(Image.open(os.path.join(saida, nome + '.png')).convert('RGB')))
                Image.fromarray(img).save(os.path.join(saida, nome + '.webp'), quality=82)
            relatorio[nome] = item
            json.dump(relatorio, open(rel_path, 'w'), indent=1, ensure_ascii=False)
    entregues = sum(1 for x in relatorio.values() if x['motivos'] == [])
    print('chamadas:', chamadas, '| entregues:', entregues,
          '| custo estimado: US$', custo_estimado(entregues, cfg['custo']['porImagemUSD']))


def main_generico():
    """v3.01: todas as cenas com o visual de generico.json e o uniforme magenta e ciano, para o kit entrar depois."""
    from openai import OpenAI
    from PIL import Image
    cfg = json.load(open(os.path.join(AQUI, 'generico.json')))
    saida = os.path.join(AQUI, 'saida-generico')
    os.makedirs(saida, exist_ok=True)
    rel_path = os.path.join(saida, 'relatorio.json')
    relatorio = json.load(open(rel_path)) if os.path.exists(rel_path) else {}
    chamadas = sum(x['tentativas'] for x in relatorio.values())
    v = cfg['visual']
    vdir = os.path.join(RAIZ, f'docs/arte/visuais/visual-{v:02d}')
    visual = tracos_visual(open(os.path.join(vdir, 'prompt.md')).read())
    imagens = [os.path.join(vdir, 'Image.jpeg'), os.path.join(RAIZ, cfg['estilo'])]
    cliente = OpenAI()
    cenas = sorted(d for d in os.listdir(os.path.join(RAIZ, 'docs/arte/cenas')) if d[:2].isdigit())
    for cena in cenas:
        nome = f"{cena}-v{v:02d}"
        item = relatorio.get(nome, {'tentativas': 0, 'motivos': None})
        prompt = montar_prompt(extrai_bloco(open(os.path.join(RAIZ, 'docs/arte/cenas', cena, 'curto/prompt.md')).read()),
                               visual, None)
        while item['tentativas'] < cfg['tentativasPorImagem'] and item['motivos'] != []:
            if chamadas >= cfg['limiteDeChamadas']:
                print('limite de chamadas atingido'); break
            png = os.path.join(saida, nome + '.png')
            try:
                _gerar(cliente, prompt, imagens, png)
                item['motivos'] = conferir(np.asarray(Image.open(png).convert('RGB')), generico=True)
            except Exception as e:  # erro da API conta como tentativa e fica no relatório
                item['motivos'] = [f'erro: {type(e).__name__}: {e}'[:200]]
            item['tentativas'] += 1
            chamadas += 1
            print(nome, item, flush=True)
        relatorio[nome] = item
        json.dump(relatorio, open(rel_path, 'w'), indent=1, ensure_ascii=False)
    entregues = sum(1 for x in relatorio.values() if x['motivos'] == [])
    print('chamadas:', chamadas, '| entregues:', entregues,
          '| custo estimado: US$', custo_estimado(entregues, json.load(open(os.path.join(AQUI, 'piloto.json')))['custo']['porImagemUSD']))


if __name__ == '__main__':
    acao = sys.argv[1:]
    sys.exit(publicar() if acao == ['publicar'] else main_generico() if acao == ['generico'] else main())
