import base64, sys, json, concurrent.futures as cf
from openai import OpenAI
R='/home/user/10efaixa/'
CENA=R+'docs/arte/lote01/athletico-pr/11-treino.webp'
V=R+'docs/arte/visuais-base/'
OUT=sys.argv[1]
FORMATOS={
 'raspado':('v1-raspado','a very short buzz cut, almost shaved, the scalp shape visible through the hair'),
 'medio-ondulado':('v1-medio','medium-length wavy, tousled hair covering the top and the back of the head down to the nape'),
 'longo-liso':('v1-longo','long straight hair falling past the neck onto the upper back and shoulders, over the collar'),
 'cacheado-medio':('v3-medio','medium curly hair, tight springy curls with volume on top and at the back'),
 'cacheado-grande':('v3-longo','a large voluminous curly afro-style mass of curls, wide and round around the whole head'),
}
def prompt(desc):
    return ("Edit image 1. Change ONLY the hairstyle of the main player in the center (seen from behind) so it becomes "
      f"{desc}, matching the haircut shape of the person in image 2 as it would look seen from behind. "
      "Keep the hair color exactly as in image 1 (medium brown) and keep the skin tone of image 1. "
      "Keep everything else identical: composition, camera, pose, head position and size, kit, coach, other players, cones, ball, lighting, "
      "the dark gradient at the bottom and the painted illustration style. No beard. No text.")
cli=OpenAI()
def gera(nome):
    ref,desc=FORMATOS[nome]
    fs=[open(CENA,'rb'),open(V+ref+'.webp','rb')]
    try:
        r=cli.images.edit(model='gpt-image-2',image=fs,prompt=prompt(desc),size='1024x1536')
        open(f'{OUT}/{nome}.png','wb').write(base64.b64decode(r.data[0].b64_json)); return nome,'ok'
    except Exception as e: return nome,f'erro: {type(e).__name__}: {e}'[:300]
    finally:
        for f in fs: f.close()
with cf.ThreadPoolExecutor(5) as ex:
    for n,s in ex.map(gera,FORMATOS): print(n,s,flush=True)
