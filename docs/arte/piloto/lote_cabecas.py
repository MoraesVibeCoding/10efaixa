"""Fase 2 do plano de cenas (aprovada pelo usuário em 2026-10-16): cabeças de costas pela API nas cenas com base pronta.
Cenas 01–09 (base do Athletico, lote 01) e 17, 18 (sem clube, base genérica curta): 11 cenas × 5 formatos = 55 imagens.
Só o formato do cabelo muda; a referência é o retrato aprovado (docs/arte/visuais-base). Cor e pele seguem por código.
Uso: python lote_cabecas.py --listar   (não chama a API)
     python lote_cabecas.py            (gera o que falta; pula o que já existe; 1 tentativa por imagem)"""
import base64, os, sys, json, concurrent.futures as cf

R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))) + '/'
L = R + 'docs/arte/lote01/athletico-pr/'
G = R + 'docs/arte/cenas/'
V = R + 'docs/arte/visuais-base/'
OUT = R + 'docs/arte/piloto/saida-cabecas/'
CENAS = {
    '01-titulo': L + '01-titulo.webp', '02-vestiario': L + '02-vestiario.webp',
    '03-assinatura-contrato': L + '03-assinatura-contrato.webp', '04-penalti': L + '04-penalti.webp',
    '05-varzea': L + '05-varzea.webp', '06-sala-empresario': L + '06-sala-empresario.webp',
    '07-reuniao-comissao': L + '07-reuniao.webp', '08-casa-familia': L + '08-casa-familia.webp',
    '09-despedida': L + '09-despedida.webp',
    '17-rua-do-bairro': G + '17-rua-do-bairro/curto/imagem.jpeg', '18-peneira': G + '18-peneira/curto/imagem.jpeg',
}
FORMATOS = {
    'raspado': ('v1-raspado', 'a very short buzz cut, almost shaved, the scalp shape visible through the hair'),
    'medio-ondulado': ('v1-medio', 'medium-length wavy, tousled hair covering the top and the back of the head down to the nape'),
    'longo-liso': ('v1-longo', 'long straight hair falling past the neck onto the upper back and shoulders, over the collar'),
    'cacheado-medio': ('v3-medio', 'medium curly hair, tight springy curls with volume on top and at the back'),
    'cacheado-grande': ('v3-longo', 'a large voluminous curly afro-style mass of curls, wide and round around the whole head'),
}
PRECO = 0.087  # US$ por imagem entregue (piloto.json, painel da OpenAI, 2026-10-14)


def prompt(desc):
    return ("Edit image 1. Change ONLY the hairstyle of the main player (the young footballer, the protagonist of the scene) so it becomes "
            f"{desc}, matching the haircut shape of the person in image 2 as it would look from the camera angle of image 1. "
            "Keep the hair color exactly as in image 1 (medium brown) and keep the skin tone of image 1. "
            "Keep everything else identical: composition, camera, pose, head position and size, clothing, every other person, objects, "
            "lighting, background, any dark gradient and the painted illustration style. No beard. No text.")


def jobs():
    return [(c, f) for c in CENAS for f in FORMATOS if not os.path.exists(f'{OUT}{c}-{f}.png')]


def gera(cli, cena, forma):
    ref, desc = FORMATOS[forma]
    fs = [open(CENAS[cena], 'rb'), open(V + ref + '.webp', 'rb')]
    try:
        r = cli.images.edit(model='gpt-image-2', image=fs, prompt=prompt(desc), size='1024x1536')
        open(f'{OUT}{cena}-{forma}.png', 'wb').write(base64.b64decode(r.data[0].b64_json))
        return cena, forma, 'ok'
    except Exception as e:  # erro conta, não repete sozinho (custo)
        return cena, forma, f'erro: {type(e).__name__}: {e}'[:300]
    finally:
        for f in fs: f.close()


if __name__ == '__main__':
    faltam = [c for c in CENAS.values() if not os.path.exists(c)]
    if faltam: sys.exit(f'base faltando: {faltam}')
    js = jobs()
    print(f'{len(js)} imagens, cerca de US$ {len(js) * PRECO:.2f}')
    if '--listar' in sys.argv:
        for c, f in js: print(c, f)
        sys.exit(0)
    from openai import OpenAI
    cli = OpenAI()
    os.makedirs(OUT, exist_ok=True)
    rel = {}
    with cf.ThreadPoolExecutor(5) as ex:
        for c, f, s in ex.map(lambda j: gera(cli, *j), js):
            rel[f'{c}-{f}'] = s
            print(c, f, s, flush=True)
    ok = sum(1 for s in rel.values() if s == 'ok')
    print(f'entregues {ok}/{len(js)}, cerca de US$ {ok * PRECO:.2f}')
    json.dump(rel, open(OUT + 'relatorio-lote.json', 'w'), indent=1, ensure_ascii=False)
