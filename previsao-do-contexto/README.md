# Previsão do contexto

Faixa acima do prompt do Claude Code que mostra a ocupação da janela de contexto como previsão do tempo (Limpo, Nublado, Chuva, Tempestade, Compacta logo), com os tokens usados, um gráfico dos últimos 12 turnos e quanto o último turno somou.

## Instalar

No prompt de uma sessão do Claude Code no terminal:

```
/plugin install previsao-do-contexto --marketplace MoraesVibeCoding/10efaixa
```

Responda `y` para adicionar o marketplace e escolha o escopo (usuário vale para todas as sessões).

## Testar

```
claude plugin validate previsao-do-contexto
claude plugin test previsao-do-contexto
```
