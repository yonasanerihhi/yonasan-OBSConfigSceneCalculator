# OBS Config & Scene Calculator

Ferramenta **grátis** para quem quer começar no OBS Studio sem sofrer: escolha o seu PC e o tipo de live, e ela monta um **preset de configurações** (perfil do OBS) e uma **coleção de cenas** prontas para importar. Tudo roda **no seu navegador**.

Criada por [**Yonasan**](https://www.youtube.com/@YonasanErihhi/)

**👉 Abrir a ferramenta:** _(link do GitHub Pages: adicionar depois de publicar)_

---

## ✨ O que dá para fazer

### ⚡ Preset de configurações
- Escolha o nível do PC (**Fraco**, **Intermediário** ou **Top**) e o que você quer fazer: conversa, gameplay, VTuber, live vertical, dual stream, gravação ou competitivo
- Ou monte do zero informando GPU, VRAM, CPU, RAM, upload da internet, formato da live e recursos extras
- Veja o resumo com resolução, FPS, encoder, bitrate e dicas rápidas para a sua configuração
- **Copiar**, **compartilhar** ou **salvar** a configuração (fica guardada só no seu navegador)
- **Baixar o perfil do OBS** (.zip) com `basic.ini`, `streamEncoder.json` e `recordEncoder.json`, mais um passo a passo de importação

### 🎬 Coleção de cenas (Beta)
- Escolha como você aparece: **webcam** ou **VTuber/avatar**
- Marque as cenas que quer: **Início da live**, **Volto já**, **Principal (gameplay + você)**, **Só conversa**, **React / janela** e **Tchau**
- Edite os textos das cenas, adicione slots de navegador (chat/alertas) e de overlay HTML
- Baixe um **.json** limpo e importe em *OBS → Coleção de Cenas → Importar*

---

## 🚀 Como usar

1. Abra a ferramenta e escolha o nível do seu PC e o tipo de live
2. Ajuste o que precisar e gere a configuração
3. Baixe o perfil (.zip) e/ou a coleção de cenas (.json)
4. Importe no OBS (instruções dentro do próprio .zip e na página)
5. Conecte a sua conta em **Configurações → Transmissão**, aponte a webcam, o jogo e o microfone, e faça um teste de 5 a 10 minutos antes de ir ao vivo

> ⚠️ O perfil e a coleção são um **ponto de partida**. Eles **não** trazem chave de stream, login, caminhos de gravação nem as suas fontes (imagens, mic, captura). Revise antes de ir ao vivo.

---

## 🔒 Privacidade

- Nada do que você escolhe é enviado a servidor: os arquivos são gerados no seu navegador
- A última configuração salva fica no `localStorage` do seu navegador e pode ser apagada limpando os dados do site
- _(Se o Google Analytics estiver ativo)_ usamos o Google Analytics, que pode usar cookies, só para medir acessos e cliques de forma anônima

---

## ❤️ Apoie

A ferramenta é e continua gratuita. Se ela te poupou tempo, você pode apoiar o canal:

- [Seja membro no YouTube](https://www.youtube.com/@YonasanErihhi/join)
- [LivePix](https://livepix.gg/yonasan)

<sub>Valores de assinatura/apoio mudam com o tempo e dependem do YouTube e do autor. Confira sempre o valor atual na página de membros do canal. (Texto revisado em 24/10/2026.)</sub>

---

## 🧰 Tecnologias

HTML + JavaScript em um único arquivo (`index.html`), com [Tailwind CSS](https://tailwindcss.com/) e [JSZip](https://stuk.github.io/jszip/) carregados por CDN. Por isso a primeira abertura precisa de internet.

## 📄 Documentação

Detalhes de funcionamento, estrutura e manutenção em [docs/documentacao.md](docs/documentacao.md).

**© Yonasan** · Uso pessoal e legítimo
