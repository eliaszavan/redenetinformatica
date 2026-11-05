# Implementação de privacidade e cookies — RedeNet Informática

Este pacote é uma CÓPIA do ZIP original com as novas páginas, estilos, scripts e links. O projeto original não foi alterado. A pasta `.git` não foi incluída.

## Alterações realizadas

- `index.html`: acrescentado `css/cookies.css` no `<head>`, links reais para políticas no rodapé, botão "Preferências de cookies" e script `js/cookies.js` no final.
- `privacidade.html`: nova página de Política de Privacidade.
- `cookies.html`: nova página de Política de Cookies.
- `css/legal.css`: estilos das duas páginas.
- `css/cookies.css`: estilos do painel e do banner de consentimento.
- `js/cookies.js`: preferências de cookies e preparação do Analytics com bloqueio antes do consentimento.

## ATENÇÃO — antes de publicar

1. **Identificação da empresa:** editar em `privacidade.html` o campo explícito de RAZÃO SOCIAL/CNPJ e confirmar o nome jurídico, endereço, e-mail, atividades, retenção de dados e fornecedores com o responsável pela loja.
2. **Checagem técnica:** inspecionar o site publicado em Chrome > DevTools > Application > Cookies / Local Storage e Network para descobrir cookies e requisições da hospedagem/terceiros, pois não é possível verificar pelo ZIP.
3. **Revisão jurídica:** o texto fornecido é um modelo informativo, não substitui validação de quem conhece as operações reais da empresa.
4. **Atualização das políticas:** se instalar WhatsApp embutido, mapa incorporado, pixels, anúncios, outros formulários ou quaisquer sistemas que coletem dados, rever textos e configurações de consentimento.

## Como testar agora

1. Abra `index.html` usando um servidor local, por exemplo Live Server no VS Code.
2. Role até o rodapé e clique em **Política de Privacidade**; depois, em **Política de Cookies**.
3. Clique em **Preferências de cookies**. O painel abre, mas o Analytics aparece como indisponível, pois NÃO está instalado.
4. Volte à página inicial. O aviso de consentimento NÃO aparece sozinho, porque ainda não há analytics opcional para autorizar.

## Quando instalar Google Analytics 4

1. No Google Analytics, obtenha seu ID de medição `G-XXXXXXXXXX`.
2. Abra `js/cookies.js` e substitua `const ANALYTICS_ID = '';` por `const ANALYTICS_ID = 'G-SEU-ID-REAL';`.
3. Não coloque a tag padrão do GA4 diretamente no `<head>`: o código em `js/cookies.js` carrega o Google Analytics somente após a autorização.
4. Atualize `cookies.html` e `privacidade.html` para descrever o GA4 real, retenção, finalidade, provedores e direitos.
5. Teste em uma janela anônima: o banner aparece, **Rejeitar** não deve carregar `gtag/js` nem gravar `_ga`; **Aceitar** deve permitir o script; **Preferências de cookies** permite revogar.
6. Se houver publicidade ou integração avançada, avalie o Google Consent Mode e uma plataforma especializada antes de ativar outras tags.

## Observação

A página atual usa uma fonte de ícones de terceiros (`cdnjs.cloudflare.com`). As requisições podem envolver dados técnicos mesmo sem cookies analíticos. Esta implementação não consegue bloquear cookies de servidores/hospedagem ou scripts adicionais inseridos fora dela. A conformidade depende da configuração efetiva do site publicado e das práticas internas da empresa.
