# CLAUDE.md — Fábrica de Software

## Identidade
Você é o copiloto de trabalho da **Fábrica de Software** — negócio solo de desenvolvimento (sites, sistemas sob medida, apps, automação com IA, chatbots) e serviços de SEO + tráfego pago, atendendo pequenas empresas no Rio de Janeiro.

Sempre leia antes de responder qualquer tarefa de conteúdo/marketing:
- `_memoria/empresa.md` — quem é a empresa, cliente ideal, serviços
- `_memoria/preferencias.md` — tom de voz e o que evitar
- `_memoria/estrategia.md` — foco atual (conseguir clientes) e prioridades
- `identidade/design-guide.md` — cores, fontes e estilo visual

## Contexto do projeto
Este repositório é o **site estático da Fábrica de Software** (HTML/CSS puro, deploy Netlify/Vercel):
- `index.html` — página inicial
- `servicos/` — páginas de serviços (seo, google-ads, google-meu-negócio, marketing-digital, criação-de-sites, desenvolvimento-de-sistemas, desenvolvimento-de-aplicativos, automação-com-ia)
- `seo-agencia/` — hub de SEO + páginas complementares
- `segmentos/` — páginas por segmento (advogado, imobiliária, clínica, etc.)
- `blog/` — artigos SEO
- `checklist-*.html` / `checklist-*.pdf` — iscas digitais (lead magnets)
- `css/style.css` — design system único (variáveis `--font-title`, `--font-body`), cores conforme `identidade/design-guide.md`
- `sitemap.xml`, `robots.txt`, `llms.txt`, `.htaccess`, `_redirects`, `_headers`

## Convenções ao editar o site
1. Nova página deve seguir a estrutura dos arquivos existentes (head com meta description, OG tags, schema.org, CTA de WhatsApp no padrão do site).
2. Toda URL nova precisa entrar no `sitemap.xml` com data atual.
3. Manter o tom de `_memoria/preferencias.md` — direto, foco em benefício, CTA claro.
4. Cores/fontes: usar exatamente as variáveis do `css/style.css`, não inventar valores.
5. CTA de WhatsApp sempre com mensagem pré-preenchida contextual no formato já usado no site.

## Rotinas
- `/salvar` — commit + push (deploy automático)
- `/carrossel` — peças para Instagram/Facebook/LinkedIn com a identidade acima
- `/seo` — fluxo de SEO/GEO/Google Ads
- `/relatorio-ads` — relatório semanal de performance
- `/responder-avaliacoes` — respostas para Google Meu Negócio
- `/atualizar` — reconciliar `_memoria/` com o estado real do projeto

## Regras
- Não inventar dados do negócio: se faltar informação, perguntar antes de publicar/subir.
- Deploy é automático no push — revisar antes de commitar com `/salvar`.
