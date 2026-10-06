#!/usr/bin/env python3
"""Cores dos clubes sem informação (SPEC v2.38, decisão do usuário: "pode ser sorteado, ou as cores da cidade").

Para cada clube da lista `desconhecida` de src/data/coresRevisao.json, sorteia duas cores diferentes da bandeira do
estado (UF) ou do país. O sorteio é determinístico: FNV-1a de 32 bits sobre o id do clube (nada de aleatório puro),
então rodar de novo dá o mesmo resultado. Bandeiras de cidade ficaram de fora: o assistente não as conhece com
segurança para os municípios; as dos estados e países, sim.

Uso: python3 docs/dados/sortear-cores.py   (reescreve as cores nos JSON de clubes e atualiza coresRevisao.json)
"""
import json
import os
import re

R, K, W, G, B, Y, OR = '#C8102E', '#000000', '#FFFFFF', '#00843D', '#0047AB', '#FFD100', '#F37021'
BANDEIRAS = {
    'AC': [Y, G], 'AL': [R, W, B], 'AP': [B, G, Y], 'AM': [B, W, R], 'BA': [R, W, B], 'CE': [G, Y, W], 'DF': [W, G, Y],
    'ES': [B, W], 'GO': [G, Y, B], 'MA': [R, W, K], 'MT': [B, W, G, Y], 'MS': [G, W, B], 'MG': [W, R], 'PA': [R, W, B],
    'PB': [K, R], 'PR': [G, W], 'PE': [B, W, R, Y], 'PI': [G, Y, B], 'RJ': [B, W], 'RN': [G, W], 'RS': [G, R, Y],
    'RO': [B, G, Y], 'RR': [B, W, G], 'SC': [R, W, G], 'SP': [K, W, R], 'SE': [G, Y, B], 'TO': [B, Y, W],
    'ECU': [Y, B, R], 'PAR': [R, W, B], 'PER': [R, W], 'BOL': [R, Y, G], 'VEN': [Y, B, R], 'AZE': [B, R, G],
    'ARM': [R, B, OR], 'POR': [G, R],
}


def fnv1a(text):
    h = 0x811C9DC5
    for byte in text.encode('utf-8'):
        h = ((h ^ byte) * 0x01000193) & 0xFFFFFFFF
    return h


def sortear(club_id, cores):
    """Duas cores diferentes da bandeira, escolhidas pelo hash do id: a primeira é a da camisa."""
    h = fnv1a(club_id)
    n = len(cores)
    a = h % n
    b = (a + 1 + (h // n) % (n - 1)) % n
    return [cores[a], cores[b]]


def main():
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'src', 'data')
    rev_path = os.path.join(root, 'coresRevisao.json')
    rev = json.load(open(rev_path))
    todo = rev.get('desconhecida') or rev.get('sorteada', [])  # rodar de novo não apaga o registro
    files = ['clubs.json', 'foreignClubs.json', 'europe.json']
    clubs = {}
    for f in files:
        d = json.load(open(os.path.join(root, f)))
        lists = [d['clubs']] + ([d['outros']['clubs'], d['foraDoEixo']['clubs']] if f == 'europe.json' else [])
        for lst in lists:
            for c in lst:
                clubs[c['id']] = c
    novas = {}
    for cid in todo:
        c = clubs[cid]
        lugar = c.get('uf') or c.get('pais')
        novas[cid] = sortear(cid, BANDEIRAS[lugar])
    for f in files:
        p = os.path.join(root, f)
        s = open(p).read()
        for cid, (c1, c2) in novas.items():
            pat = re.compile(r'("id": "' + re.escape(cid) + r'",(?:(?!"id":).)*?"cores": \[\s*)"#14213D",(\s*)"#FFFFFF"', re.S)
            s = pat.sub(lambda m: f'{m.group(1)}"{c1}",{m.group(2)}"{c2}"', s, count=1)
        json.loads(s)
        open(p, 'w').write(s)
    rev = {
        '_nota': ("Cores dos clubes (SPEC v2.37/v2.38, T50j). Preenchidas pelo assistente em 2026-10-06, sem fonte conferida "
                  "(estimativa). As 60 prováveis foram aprovadas pelo usuário em 2026-10-06. 'sorteada': clubes sem informação, "
                  "com duas cores da bandeira do estado ou do país, sorteadas por hash do id (docs/dados/sortear-cores.py); "
                  "trocar pelas reais quando o usuário informar. Lista legível em docs/revisao-cores-clubes.md."),
        'data': rev['data'], 'aprovadasEm': '2026-10-06', 'provavel': [], 'sorteada': todo, 'bandeiras': BANDEIRAS,
    }
    open(rev_path, 'w').write(json.dumps(rev, ensure_ascii=False, indent=1) + '\n')
    print(f'{len(novas)} clubes sorteados')


if __name__ == '__main__':
    main()
