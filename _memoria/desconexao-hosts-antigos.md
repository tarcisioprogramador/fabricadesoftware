# Desconexão das publicações antigas — GitHub Pages e Vercel (18/10/2026)

Objetivo: manter o site principal em `https://www.fabricadesoftwarerj.com/` (Hostinger) e desconectar as publicações antigas, preservando repositório, código, histórico, domínio e e-mail.

## 1. Hospedagem atual confirmada
- Domínio principal servindo em **Hostinger** (header `Server: hcdn`, upload via FTP local, `.htaccess` Apache/LiteSpeed ativo — testado).
- Zona DNS autoritativa: NS `hyperion.dns-parking.com` / `atlas.dns-parking.com` (Hostinger DNS Parking). **Nenhuma troca de nameserver necessária.**
- MX preservados: `mx1/mx2.hostinger.com` (e-mail intocado).
- A / www → IP Hostinger CDN; o apex (sem www) respondia 200 duplicado antes do fix de hoje (item 3).

## 2. Estado anterior (para reversão)
- **GitHub Pages**: ativa no repo `tarcisioprogramador/fabricadesoftware`, `build_type: legacy`, branch `master`, pasta `/`, `cname: www.fabricadesoftwarerj.com` (via GET `/repos/.../pages` antes da mudança).
- **CNAME** no repositório apontando `www.fabricadesoftwarerj.com` (definido nesta fase).
- **URL github.io**: `tarcisioprogramador.github.io/fabricadesoftware/` publicada.
- **Vercel**: projeto `fabricadesoftware-master` ainda no ar (server Vercel, cache HIT) servindo o site antigo; sem acesso de painel nesta máquina. Nenhum vínculo do domínio principal detectado pela Vercel (DNS e certificado da produção respondem só do Hostinger — a Vercel atende apenas pelo subdomínio `.vercel.app`).
- **Apex sem www**: `fabricadesoftwarerj.com/` servia 200 duplicado (mesmo Hostinger, hcdn) — canonicalização inconsistente.

## 3. Ações efetivamente aplicadas (testadas)
1. **GitHub Pages desativada** via API (`DELETE /repos/tarcisioprogramador/fabricadesoftware/pages` → HTTP 204; GET seguinte → 404). Repositório, código e histórico **preservados**.
2. **CNAME removido do repositório** (commit `fd8b9a2`) — sem Pages ativa, o arquivo não influencia nada, e retirar evita re-ativação silenciosa do domínio no Pages.
3. **`.htaccess`: apex → www 301** aplicado e publicado (commit `fd8b9a2` + FTP). `https://fabricadesoftwarerj.com/` agora responde 301 → `https://www.fabricadesoftwarerj.com/` (**testado `,cb` cache-buster**).
4. **Revalidação ao vivo**: www 200 com HTTPS; paths 200; github.io raiz **404** (desativada).
5. Snapshot de deploy local (`.audit/deploy/`) sincronizado sem CNAME.

Obs.: ao desativar Pages, o edge do GitHub mantém por algum tempo um 301 em cache na URL antiga `.../fabricadesoftware/index.html` (para `http://www.fabricadesoftwarerj.com/index.html`, que por sua vez 301a raiz canônica) — cadeia sem ciclo, expira sozinha. A partir de agora **nenhum novo deploy publica o site antigo** pois a origem (Pages) foi desativada e o CNAME removido.

## 4. Vercel — EXECUTADO (18/10/2026, via API com token do usuário, revogável)
Confirmado: projeto antigo `fabricadesoftware-master` já não existia (URLs 404 `DEPLOYMENT_NOT_FOUND`).

Escopo confirmado pelo dono: excluir apenas os projetos da Fábrica, preservando os demais negócios e os 8 domínios registrados na conta.

**10 projetos excluídos (DELETE /v2/projects → 204):**
`fabricasoftware-blog`, `fabricaseo`, `fabrica-de-software-seo`, `fabrica-de-software`, `fabricadesoftware2-0`, `fabricadesoftware2-0-bdxr`, `blog-fabrica`, `criacao-de-sites-rio-de-janeiro`, `trafegopago`, `site-gbp`.
- Cada um verificado ao vivo: título de conteúdo Fábrica antes da exclusão (site-gbp e trafegopago eram landings da Fábrica; trafegopago servia `gestordetrafego.app`).

**Preservados (conforme confirmação do dono):** 28 projetos da conta (zapflow, copyzap, rendaextracomia.com.br, catalogo-sonho-dos-moveis, lavajatoguia, lomapet, entre outros) e os 8 domínios registrados (juliooliveira.app, rendaextracomia.com.br, fabricasoftwarerj.app/.com.br, fabricadesoftware.com, agencia-de-seo.app, criacao-de-sites-rio-de-janeiro.app, gestordetrafego.app — nenhum com projectId vinculado).

**Validação pós-exclusão:** todas as URLs `.vercel.app` excluídas retornam **404** (fabricadesoftware-master, fabrica-de-software, fabricadesoftware2-0, fabricasoftware-blog, site-gbp spot-check). Produção Hostinger intacta: www 200, apex 301→www, case 200.

**Ação do usuário pendente:** revogar o token da Vercel usado na operação (vercel.com/account/tokens).

## 5. Referências do site revisadas nesta fase
- Canonical, sitemap, OG e schema: já normalizados para `www.fabricadesoftwarerj.com` na fase anterior (sem referências aos hosts antigos — verificado por varredura; `seo-agencia/` eliminada).
- Não há dependência de redirect mantido em host antigo: redirect de caminhos legados é servido **na própria Hostinger** (`.htaccess`) — o encerramento da Vercel/Pages não interrompe nenhum redirect em uso.

## 6. Reversão (procedimento)
- GitHub Pages: Settings → Pages → Source: Deploy from branch → `master`, `/ (root)` (ou `gh api -X POST /repos/tarcisioprogramador/fabricadesoftware/pages -f "source[branch]=master"`).
- CNAME: restaurar arquivo com conteúdo `www.fabricadesoftwarerj.com` (commit histórico `ec0557c` tem o arquivo).
- Apex redirect: reverter a regra do item 1 do `.htaccess` (condição `!^(www\.)?fabricadesoftwarerj\.com$`) e publicar via FTP.
- Commits envolvidos: `ec0557c` (fase anterior) e `fd8b9a2` (esta desconnecting). `git revert fd8b9a2` desfaz Pages-auxiliares (CNAME + apex), Pages reativa-se pelo painel passo acima.
