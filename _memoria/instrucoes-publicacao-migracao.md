# Fase 1 — Consolidação de domínio, cases, LCP e GEO (18/10/2026)

> Documento de entrega. Tudo abaixo foi implementado no repositório e testado localmente.
> Publicação: ver \"Publicação e reversão\" no fim. Pendências externas listadas separadamente.
> Prévia local para revisão: `python -m http.server 8900` na raiz → http://127.0.0.1:8900/

## 1. O que foi revalidado dos achados de 18/10

| Achado auditoria | Status no código atual |
|---|---|
| 5 URLs da pasta /seo-agencia/ listadas no sitemap (antes bloqueadas) | CONFIRMADO e RESOLVIDO: retiradas do sitemap; pasta física removida; URLs servem 301 |
| robots.txt bloqueava páginas | REVALIDADO: robots.txt atual já permite tudo (User-agent: * Allow: /); manteve-se assim |
| Canonical/H1/títulos | OK em todas as páginas verificadas (nada alterado quanto a isso) |
| Dados estruturados parciais | MELHORADO: ver item 5 |
| GA + evento whatsapp_click | CONFIRMADO: G-GG1RG503V2 em todas as páginas testadas; evento único via delegação (js/main.js), sem duplicidade |
| LCP móvel 4,4s (lab) | MEDIDO DENOVO: LCP 6.2s ao vivo / 6.5s local antes da correção; ver item 4 |
| Cases com números sem fonte | CONFIRMADO e RESOLVIDO (item 3) |

## 2. Prioridade: consolidação de domínios e endereços antigos

### Endereço principal
`https://www.fabricadesoftwarerj.com/` — canônico em todo o site, robots e sitemap.

### Implementado no repositório (testado localmente)
- `_redirects` (Netlify): mapa completo da pasta legada + coringa `/seo-agencia/*` → `/servicos.html` + padronização `/index.html` → `/` e `/blog/index.html` → `/blog/`.
- `.htaccess` (Apache/LiteSpeed–Hostinger): regras equivalentes + regra de host: **todo host diferente de www.fabricadesoftwarerj.com → 301 para o domínio principal preservando o caminho** (cobre apex sem www e o domínio legado fabricadesoftware.com), + `ErrorDocument 404 /404.html`.
- **CNAME trocado**: `fabricadesoftware.com` → `www.fabricadesoftwarerj.com`. GitHub Pages passa a servir o domínio canônico e, com isso, redireciona automaticamente as visitas de `tarcisioprogramador.github.io/fabricadesoftware/*`.
- Pasta `/seo-agencia/` inteira **removida** (23 arquivos).
- `404.html` novo: redireciona por mapeamento (fallback para GitHub Pages e qualquer 404) com `<meta robots noindex>`.
- `sitemap.xml`: 5 URLs da pasta legada fora; novo `/cases/julio-seguranca-eletronica.html` dentro; lastmod 2026-10-18 nas páginas alteradas.
- `robots.txt`: mantido Allow all + sitemap.
- Limpam-se as referências: nenhum link interno para /seo-agencia/ restante (verificado por varredura).

### Mapa de redirecionamentos (cada destino confirmado existente)
| URL antiga | Destino |
|---|---|
| `/seo-agencia/index.html` | `/servicos.html` |
| `/seo-agencia/seo-para-empresas.html` | `/servicos/seo.html` |
| `/seo-agencia/criacao-de-sites-profissionais.html` | `/servicos/criacao-de-sites.html` |
| `/seo-agencia/gestao-de-trafego-pago.html` | `/servicos/google-ads.html` |
| `/seo-agencia/automacao-de-marketing.html` | `/servicos/automacao-com-ia.html` |
| `/seo-agencia/obrigado.html` | `/obrigado.html` |
| `/seo-agencia/*` (coringa, por último) | `/servicos.html` |
| URLs legadas de `/seo-agencia/blog/*` (14 regras anteriores) | mantidas as que já existiam |
| `/index.html` | `/` |
| `/blog/index.html` | `/blog/` |
| Qualquer host que não seja `www.fabricadesoftwarerj.com` | `https://www.fabricadesoftwarerj.com/<caminho>` (Apache/Hostinger) |

**Diferenciação importante (registrada):** os redirects HTTP 301 foram validados por consistência de mapa/destinos OFFLINE (parse + verificação de arquivo) porque os 301s de verdade dependem da hospedagem em produção. Nenhum 301 foi testado contra a produção — registrado como pendência do item de hosts.

### DEPENDÊNCIA EXTERNA — configuração pronta (não executável daqui)
1. **Netlify (fabricadesoftware-rj.netlify.app)**: se este repo gerenciar o Netlify, o `_redirects` já resolve. Se for outro site/remoto, aplicar o mesmo conteúdo de `_redirects` lá e configurar no painel: domínio custom `www.fabricadesoftwarerj.com` + `redirect de fabricadesoftware.com` (antes apontava canonical fora do domínio — removê-lo).
2. **Vercel (fabricadesoftware-master.vercel.app)**: criar `vercel.json` no projeto Vercel (não neste repo, a menos que o deploy principal seja Vercel):
```json
{
  \"redirects\": [
    { \"source\": \"/seo-agencia\", \"destination\": \"/servicos.html\", \"permanent\": true },
    { \"source\": \"/seo-agencia/:path*\", \"destination\": \"/servicos.html\", \"permanent\": true },
    { \"source\": \"/index.html\", \"destination\": \"/\", \"permanent\": true },
    { \"source\": \"/blog/index.html\", \"destination\": \"/blog/\", \"permanent\": true }
  ]
}
```
   E o projeto antigo da Vercel deve receber redirecionamento de domínio no painel ou ser desligado/reapontado (audit: já tinha canonical correto, mas continuava acessível).
3. **GitHub Pages (tarcisioprogramador.github.io)**: com o CNAME corrigido aqui, o Pages redireciona domínio automaticamente após o push. Verificar no painel do repo que Pages está apontando para a branch `master` corretamente.
4. **DNS**: apontar `www.fabricadesoftwarerj.com` (e apex) para a hospedagem ativa e **remover o DNS antigo de `fabricadesoftware.com`** para evitar servidor desatualizado no ar.
5. Depois do deploy, testar (uma vez): `curl -I https://www.fabricadesoftwarerj.com/seo-agencia/seo-para-empresas.html` → 301 → `/servicos/seo.html`; `/seo-agencia/index.html` → 301 → `/servicos.html`; `http://fabricadesoftwarerj.com/` → 301 → `https://www.fabricadesoftwarerj.com/`.

## 3. Cases, depoimentos e resultados (prioridade 4)

### Mudado
- `servicos/automacao-com-ia.html`: seção \"Cases de Sucesso\" → \"Escopos demonstrativos\". Cartões renomeados para \"(demonstração)\"; métricas sem fonte (+200 atendimentos/dia; −80% tempo manual) substituídas por escopo técnico/implantação típica. Nota explícita de que não são resultados medidos + link para o portfólio.
- `servicos/desenvolvimento-de-sistemas.html`: idem — \"Construtora ABC\" e \"Indústria XYZ\" viraram escopos demonstrativos; (+40% vendas, −60% erros) removidos.
- `servicos/desenvolvimento-de-aplicativos.html`: idem — \"Restaurante Sabor\" e \"Clínica Bem Estar\" viraram demonstrativos; (+5.000 downloads, +2.000 usuários) removidos. Alegação \"economia de 40%\" sem fonte removida (texto descritivo no lugar).
- `portfolio.html`: distingue já real/demonstrativo (mantido). Avaliação da Angélica Medeiros **reclassificada**: é prova do serviço de segurança do Júlio (exibida no site dele), com aviso visível de que não é depoimento sobre a Fábrica. Cartão do Júlio ganhou link para o estudo de caso completo.
- Página nova: **`/cases/julio-seguranca-eletronica.html`** — necessidade, escopo, decisões de dev/SEO, capturas REAIS (img/cases/julio-desktop.png e julio-mobile.png, tiradas em 18/10/2026 com 1440px e 390px), link do site publicado, resultados: apenas o fato verificável (site no ar; avaliações no HTML), com nota explícita de que métricas de tráfego aguardam Search Console do cliente. Próximas melhorias listadas.
- `servicos/criacao-de-sites.html` ganhou destaque do case real (além dos demonstrativos).
- `llms.txt` ganhou seção \"Case real publicado\".

### Pendência de comprovação (registro)
Depoimentos da home sem origem documentada (Carlos M., Fabiana A., Lucas P.) — a origem de Júlio O. está marcada (Avaliação do Google). O cliente tem que confirmar a origem dos outros tres (quais foram coletados e onde) antes de mais nada; não os removi porque nada prova que são fictícios, mas tampouco há fonte registrada. Clientes nomeados em audit (Saúde+/XYZ/ABC) ficaram como exemplos genéricos de escopo — não são clientes reclamados.
Search Console: sem acesso aqui — tratado como hipótese a diferenciação de conteúdo (item 6).

## 4. Desempenho no celular (prioridade 5)

### Medição reproduzível (Lighthouse v12, throttling mobile default, Chrome headless)
- Ao vivo (antes de qualquer mudança): FCP 4.2s / **LCP 6.2s** / TTFB 20ms / perf 0.64 — `.audit/lh-home-before.json`.
- Local, 2 medidas antes (sem a mudança, stash): FCP 4.45/4.41s, LCP 6.62/6.48s, perf 0.64/0.65 — `.audit/lh-local-before*.json`.
- Local, 2 medidas depois: **FCP 2.11/2.02s, LCP 2.26/2.26s, perf 0.96/0.94** — `.audit/lh-local-after*.json`.
- Θ elemento LCP: texto do hero (sem `<img>` grande — compatível com a auditoria); rede mostra na fila VeryHigh o CSS de Google Fonts (16.8KB render-blocking) + woff2 Inter, apontando a causa.

### Correção aplicada (justificada pela medição)
- CSS de Google Fonts saiu da cadeia crítica em **57 páginas**: `rel=preload as=style onload` + fallback `noscript` (mesmo pattern já usado no Font Awesome). Inter 400 removido do Request (não declarado no css/style.css — verificado).
- Pattern replicado por script (`.audit` acompanha); a segunda medida confirma a causa com LCP −65% sob condições iguais.
- NOTA: dados de usuários reais (CrUX/RUM) não disponíveis nesta etapa — não estimados. Após deploy, re-medir ao vivo com o mesmo comando para comparar antes/depois de produção.

## 5. Arquitetura e dados estruturados (prioridades 6 e 7)

- `@id` central: `#organization` na home (LocalBusiness) e `#website` (WebSite); 15 `provider` LocalBusiness e referências de schema ligados a esse mesmo `@id`.
- Autoria dos artigos: transformada de Organization para **Person Tarcísio** (30 artigos), com `worksFor` apontando para o `@id` da empresa; meta author padronizada (40 páginas); byline visível alinhada onde existia.
- Corrigido bug de BreadcrumbList: item \"Serviços\" apontava para `/Serviços/` (inexistente, com acento) — 8 páginas corrigidas p/ `/servicos.html`.
- Página CRM (`/desenvolvimento-de-crm/`): saiu de status órfão — entrada de link interno no `servicos.html` + prova própria (sistema usado internamente pela Fábrica) e link para artigo correspondente. FAQ/demonstração já existentes preservados.
- Landings locais \"rio-de-janeiro\" (3 páginas, raiz): 20 links quebrados cada (`../` escapando da raiz) corrigidos; e-mail mal-formado `tarcisioflow.dev.com` corrigido em 32 arquivos.
- Diferenciação de conteúdo registrada (sem migração adicional): `/criacao-de-sites-rio-de-janeiro.html` ganhou bloco base local RJ (Vila Isabel, case local, prova social); `servicos/criacao-de-sites.html` fica comercial genérico; blog guia educativo. Artigos de chatbot: escopos distintos com links cruzados (um explicativo, um de contratação).
- Ícone quebrado (`<i class fa-sync-alt>`) corrigido em desenvolvimento-de-sistemas.

## 6. Conversão e medição (prioridade 8)

- GA4 G-GG1RG503V2 presente nas páginas testadas; evento `whatsapp_click` com payload {cta_position, cta_text, page_location} — 1 clique = 1 evento, com fallback dataLayer. Mensagens WhatsApp pré-preenchidas padrão preservadas (novas mensagens contextuais no case).
- Nada alterado nos scripts de medição. Validação em produção (primeiro evento real recebido no GA + conversão configurada) é rodar depois do deploy.

## 7. Validação QA (o que foi rodado)

- **QA estático**: 0 links quebrados (antes: 113), 149 blocos JSON-LD todos válidos, sitemap 74 URLs = 74 arquivos existentes, 0 regressões conhecidas, 0 referências à pasta legada.
- **Visual local**: capturas Chrome headless em `.audit/capturas-equipe/`: home 390 e 1440, case 390, CRM 1440, landing RJ 360, automação IA 390. Larguras 360/390/768/1440 de menu/rodapé/WhatsApp/CTA visíveis nas capturas (768 visto via 1440 responsivo — registrar se necessária capta extra).
- **Console**: sem erros de JS de página nos dumps (só ruído interno do Chrome headless).
- **Lighthouse**: comparação antes/depois (item 4), 2 execuções cada para variação.

## 8. Pendências dependendo de acesso/comprovação

1. DNS e hosting: item \"DEPENDÊNCIA EXTERNA\" do fim da seção 2 (principal). Inclui testar 301 real em produção.
2. Search Console (cliente): confirmar acesso; depois, rodar checagem de indexação e canonical escolhido; coletar dados reais para o case Júlio (impressões/cliques).
3. Perfil da Empresa no Google: recomendar manter nome \"Fábrica de Software\", resposta de avaliações com o roteiro atual (skill /responder-avaliacoes), e confirmar que as informações (horário, telefone) batem com o site.
4. Origem dos depoimentos da home (Carlos M., Fabiana A., Lucas P.): confirmar ou retirar.
5. CrUX/RUM: sem dados de usuários reais nesta máquina — após deploy, monitorar PageSpeed Insights/ SeCrUX.
6. Testar 301/404 real pós-deploy (comandos curl listados).
7. GPTBot/OAI-SearchBot: robots.txt atual já permite; opcional registrar decisão explícita sobre GPTBot (treinamento) — requisito para Aparecer no ChatGPT não é permitir GPTBot.

## 9. Publicação e reversão

- **Preview/revisão**: servidor local rodando: `http://127.0.0.1:8900/` (`python -m http.server 8900`).
- **Publicar**: revisar `git status`, `/salvar` (commit + push – deploy automático). Deploy alcança Netlify e GitHub Pages (como já ocorre hoje).
- **Reverter**: `git revert <commit>` ou `git reset --hard ORIG_HEAD` antes do push; o stash LCP-antes está disponível via `git stash list` (\"fonte-async-lcp\") se quiser comparar o diff.
- **Risco controlado**: a remoção da pasta `/seo-agencia/` pode fazer 404 em hospedagens que não respeitem `_redirects`/`<http.ErrorDocument>` (Netlify e Apache/LiteSpeed têm: ok; Vercel antiga: pendência item 2; GitHub Pages: coberto por 404.html de fallback).
