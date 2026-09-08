# Vitale Produtos Naturais

Loja online responsiva para catálogo, carrinho e finalização de pedidos pelo WhatsApp, com painel administrativo protegido.

## Recursos

- Catálogo com busca, categorias, ordenação, disponibilidade e promoções.
- Produtos por unidade, pacote ou peso, com variações e preço automático.
- Carrinho persistente no dispositivo e mensagem consolidada para o WhatsApp.
- Pedidos registrados no banco D1 com acompanhamento de status.
- Painel administrativo para produtos, categorias, pedidos e configurações da loja.
- Autenticação do painel pelo acesso seguro do OpenAI Sites.
- SEO básico, sitemap, robots.txt e experiência responsiva.

## Desenvolvimento

```bash
npm install
npm run db:generate
npm run dev
```

O catálogo inicial é demonstrativo e está claramente identificado. Depois de aplicar as migrações, entre em `/admin`, importe os dados de demonstração e substitua-os por informações reais e verificadas.

## Configuração da loja

No painel administrativo, cadastre o número de WhatsApp com DDI e DDD, por exemplo `5543999999999`. O número não fica espalhado pelo código e é lido das configurações persistidas no banco.
