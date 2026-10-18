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

## 4. Pendência de acesso — Vercel (preparado, não executado)
Sem token/painel da Vercel nesta máquina. Instruções exatas na conta dona do projeto `fabricadesoftware-master` (vercel.com/dashboard):
1. **Desconectar automático** em seguida: Project `fabricadesoftware-master` → **Settings → Git → Connected Repository → Disconnect**.
   - Importante: desconectar o Git **NÃO entrega o site do ar** — o último deploy continua servindo.
2. **Encerrar publicação** (mecanismo suportado): Project → **Settings → General → Delete Project** — isso derruba `fabricadesoftware-master.vercel.app` (futuras visitas: 404 `DEPLOYMENT_NOT_FOUND`).
   - Diferenciação: não remova dominios de outros projetos da conta; o subdomínio `.vercel.app` só sai do ar com a exclusão do projeto.
3. **Domains**: em Account → Domains, confirme que nem `fabricadesoftwarerj.com` nem `fabricadesoftware.com` estão vinculados a projeto algum da Vercel (o principal não está — verificado por DNS/host; o antigo `fabricadesoftware.com` não é atendido pela Vercel hoje).
4. Reversão (se precisar republishing antigo): recriar projeto conectando o repo `tarcisioprogramador/fabricadesoftware` — o histórico e o código continuam no GitHub.

## 5. Referências do site revisadas nesta fase
- Canonical, sitemap, OG e schema: já normalizados para `www.fabricadesoftwarerj.com` na fase anterior (sem referências aos hosts antigos — verificado por varredura; `seo-agencia/` eliminada).
- Não há dependência de redirect mantido em host antigo: redirect de caminhos legados é servido **na própria Hostinger** (`.htaccess`) — o encerramento da Vercel/Pages não interrompe nenhum redirect em uso.

## 6. Reversão (procedimento)
- GitHub Pages: Settings → Pages → Source: Deploy from branch → `master`, `/ (root)` (ou `gh api -X POST /repos/tarcisioprogramador/fabricadesoftware/pages -f "source[branch]=master"`).
- CNAME: restaurar arquivo com conteúdo `www.fabricadesoftwarerj.com` (commit histórico `ec0557c` tem o arquivo).
- Apex redirect: reverter a regra do item 1 do `.htaccess` (condição `!^(www\.)?fabricadesoftwarerj\.com$`) e publicar via FTP.
- Commits envolvidos: `ec0557c` (fase anterior) e `fd8b9a2` (esta desconnecting). `git revert fd8b9a2` desfaz Pages-auxiliares (CNAME + apex), Pages reativa-se pelo painel passo acima.
