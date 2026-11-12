# Estante: notas de design

Skill: identidade-roberto (modalidade **sistema web**, modo **Livre**). Versão 0.1, 2026-11-11.

## Assunto
Registro pessoal de leituras. Quem usa: uma pessoa que lê vários livros por ano e quer saber o que está lendo, o que já leu e o que quer ler. Tarefa principal: registrar um livro e atualizar a página em que parou.

## Ideia central
A própria estante é o elemento memorável. Cada livro é uma lombada:
- a largura vem do número de páginas;
- a cor é um tecido de encadernação, escolhido de forma estável pelo título;
- **Lido** = lombada cheia; **Lendo** = só o trecho lido é cheio, o resto é listrado, com uma fita marcadora; **Quero ler** = contorno tracejado (ainda não está na mão).

O resto da tela é quieto: lista em tabela, sem cartões nem sombras.

## Tokens
| Papel | Claro | Escuro |
|---|---|---|
| Papel (fundo) | #e9eeeb | #0e1714 |
| Folha (superfície) | #fafbfa | #16231e |
| Tinta (texto) | #16201c | #e3ebe7 |
| Verniz (ação, verde-garrafa) | #1d5c46 | #7dd3ae |
| Pendência (âmbar) | #8a5300 | #f2b84b |
| Madeira (prateleira) | #6b4a2e | #5a3f28 |

Tecidos das lombadas: #1d5c46 #24476b #7a2e2e #7a5a1c #44535c #5e3b5c #2a6262 #5b4a2f (todos com contraste AA para o título claro).

Tipo: Palatino Linotype (títulos de livro, números, cabeçalhos) + Segoe UI (interface). Fontes do sistema, funciona offline. Escala 1,25.

Movimento: um único momento (as lombadas sobem para a prateleira ao abrir). Livro novo sobe sozinho.

## Descartado
- Creme com terracota e serifa de alto contraste (clichê de IA).
- Cartões com sombra para cada livro (kit de SaaS).
- Números "01 02 03" e rótulos em caixa alta.
- Gráfico de barras de páginas por mês: a estante já mostra o volume.

## Para o próximo projeto em C:\basileus
Não repetir: verde-garrafa como cor principal, Palatino como fonte de títulos, metáfora de objeto físico como elemento central.
