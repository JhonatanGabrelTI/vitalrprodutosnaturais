# Vitale Produtos Naturais

Loja online responsiva para catálogo, carrinho e finalização de pedidos pelo WhatsApp, com painel administrativo protegido.

## Recursos

- Página inicial exclusiva em português e catálogo demonstrativo com 20 itens
  em 7 categorias, incluindo creatina, whey protein, snacks, castanhas, grãos,
  chás e ingredientes naturais.
- Busca, categorias, ordenação, disponibilidade e promoções.
- Produtos por unidade, pacote ou peso, com variações e preço automático.
- Botão “Comprar pelo WhatsApp” em cada produto, além do carrinho persistente e
  da mensagem consolidada do pedido.
- Pedidos registrados no banco D1 com acompanhamento de status.
- Painel administrativo para produtos, fotos, estoque, unidade/peso/pacote,
  variações de tamanho, categorias, pedidos e configurações da loja.
- Login administrativo por e-mail e senha, com sessão protegida por cookie
  assinado e pela camada privada da hospedagem.
- Animações suaves, SEO básico, sitemap, robots.txt e experiência responsiva.
- Instagram, localização e informações de contato integrados à página inicial.

## Desenvolvimento

```bash
npm install
npm run db:generate
npm run dev
```

O catálogo inicial é demonstrativo e está claramente identificado. Depois de aplicar as migrações, entre em `/admin`, importe os dados de demonstração e substitua-os por informações reais e verificadas.

## Configuração da loja

No painel administrativo, cadastre o número de WhatsApp com DDI e DDD, por exemplo `5543999999999`. O número não fica espalhado pelo código e é lido das configurações persistidas no banco.

## Acesso administrativo demonstrativo

- E-mail: `vitale.produtos.ibaiti@gmail.com`
- Senha: `Vitale@2026!`

Essas credenciais são fictícias. Antes do uso real, defina `ADMIN_EMAIL`,
`ADMIN_PASSWORD` e uma chave longa em `ADMIN_SESSION_SECRET` nas variáveis
protegidas da hospedagem.

No painel, a loja pode criar e editar produtos, trocar a categoria, enviar uma
foto (JPG, PNG ou WebP de até 1,5 MB), informar estoque, forma de venda
(unidade, peso ou pacote), unidade exibida e variações de tamanho/preço. Também
é possível criar, editar e remover categorias.

## Domínio personalizado

O projeto está preparado para domínio próprio por meio da variável
`NEXT_PUBLIC_SITE_URL`. Depois que o domínio for conectado ao provedor de
hospedagem e o DNS estiver apontado, defina essa variável com a URL final para
atualizar canonical, sitemap e robots automaticamente.
