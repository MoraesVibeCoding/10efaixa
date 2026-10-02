# Esboço aprovado da v2.26 (referência para T49c e T49d)

Telas em HTML estático usadas para aprovar o layout com o usuário (imagens em `docs/telas/v2.26-*.jpg`). **Não é código do jogo:** é referência de medidas, cores e comportamento.

- `pecas.js`: emblemas originais em SVG (Flamengo, Santos, Palmeiras, Coritiba, nas versões completa e simplificada, e o escudo genérico) e a troca de cor da arte (verde-recorte vira transparente, magenta vira a cor do clube), feita em canvas.
- `layout.css`: paleta creme, figurinha com fundo de faixas e recorte de álbum, tarja de risco.
- As páginas carregam imagens por caminho absoluto (`file:///home/user/10efaixa/...`) e só abrem num Chromium com `--allow-file-access-from-files`.
