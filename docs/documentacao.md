# Documentação – OBS Config & Scene Calculator

Ferramenta criada por **Yonasan** ([YouTube](https://www.youtube.com/@YonasanErihhi/)). Documentação revisada em **24/10/2026**.

---

## 1. Visão geral

Página única (`index.html`) que ajuda iniciantes a configurar o **OBS Studio**:

1. **Preset de configurações:** gera valores recomendados (resolução, FPS, encoder, bitrate, etc.) e um **perfil do OBS** para importar.
2. **Coleção de cenas (Beta):** gera um arquivo **.json** com cenas e fontes básicas para importar no OBS.

Tudo é calculado e gerado **no navegador**. Não há servidor nem banco de dados.

---

## 2. Aba "Preset de configurações"

### 2.1 Presets rápidos
Você escolhe o nível do PC e o objetivo:

| Nível | Presets |
|-------|---------|
| 🥔 PC Fraco | Só Conversa · Gameplay Leve · VTuber Minimal · Só Vertical (TikTok/Reels) |
| 💻 PC Intermediário | Só Conversa · Gameplay Normal · Gameplay + VTuber · Dual Stream · Gravação YouTube |
| 🚀 PC Top | Só Conversa Pro · Gameplay Ultra · VTuber Full Power · Dual + VTuber · Gravação 4K / Master · Competitive / Low Latency |

### 2.2 Configuração manual
Campos usados para o cálculo: **GPU** (fabricante e porte/VRAM), **CPU** (nível), **RAM**, **upload da internet (Mbps)**, **formato/estilo da transmissão** e **recursos extras em uso**.

### 2.3 Resultado
- Resumo da configuração (encoder, resolução, FPS, bitrate, etc.)
- Dicas rápidas para a configuração escolhida
- Botões para **copiar**, **compartilhar** e **salvar** (a última configuração salva pode ser recarregada)

### 2.4 Perfil do OBS (.zip)
O download contém:

| Arquivo | Conteúdo |
|---------|----------|
| `basic.ini` | resolução, FPS, modo Avançado, encoder |
| `streamEncoder.json` | bitrate CBR, keyframe de 2 s, preset |
| `recordEncoder.json` | gravação em CQP/CRF (qualidade local) |
| Instruções de importação | passo a passo (menu do OBS ou cópia manual para a pasta de perfis) |

**Não inclui:** chave de stream ou conta Twitch/YouTube, cenas e fontes, caminhos de gravação.

---

## 3. Aba "Coleção de cenas" (Beta)

1. Defina o **nome da coleção**.
2. Escolha **como você aparece**: webcam (captura de dispositivo de vídeo) ou VTuber/avatar (captura de jogo com transparência: VSeeFace, VTube Studio, Warudo, etc.).
3. Marque as **cenas**: Início da live · Volto já · Principal (gameplay + você) · Só conversa · React / janela · Tchau. Os textos podem ser editados.
4. Extras opcionais: slot de **navegador** (chat/alertas) e slot de **overlay HTML**.
5. Clique em **Gerar e baixar coleção (.json)** e importe em *OBS → Coleção de Cenas → Importar*.

Tipos de fonte usados no arquivo: imagem, texto, captura de jogo, captura de janela, dispositivo de vídeo e navegador. As transições incluídas são **Esmaecer** e **Cortar**.

Depois de importar, é preciso apontar imagens, webcam, jogo/janela e o **microfone** (o mixer de áudio não vem no template).

---

## 4. Privacidade e dados

- Nenhuma configuração é enviada a servidor: os arquivos são gerados localmente.
- A configuração salva fica no `localStorage` do navegador, na chave `obs_config_calculator`.
- Quando o Google Analytics estiver ativo, ele (que pode usar cookies) mede acessos e eventos de forma anônima, sem acesso a dados pessoais da configuração.

### Eventos medidos
`preset_applied`, `tier_selected`, `generate_clicked`, `config_copied`, `config_shared`, `config_shared_fallback`, `config_saved`, `config_loaded`, `profile_downloaded`, `profile_help_opened`, `tab_switched`, `scene_builder_download`.

---

## 5. Termos de uso (resumo)

- Uso **gratuito**, sem cadastro.
- Os arquivos gerados são um **ponto de partida**, oferecidos "como estão", sem garantia de resultado em todos os PCs. Teste antes de ir ao vivo.
- Você é responsável por revisar as configurações e pelo conteúdo que transmite.
- Não redistribua a ferramenta como se fosse sua nem use o nome, a imagem ou a identidade do canal para enganar ninguém.
- Valores de assinatura/apoio citados podem mudar. Confira sempre no YouTube (texto revisado em 24/10/2026).

---

## 6. Estrutura do projeto

| Arquivo | Função |
|---------|--------|
| `index.html` | A ferramenta inteira (HTML, CSS e JavaScript) |
| `README.md` | Visão geral |
| `docs/documentacao.md` | Este arquivo |

Dependências por CDN: **Tailwind CSS** (`cdn.tailwindcss.com`) e **JSZip** (`cdnjs.cloudflare.com`). Sem internet, a página não carrega estilos nem gera o .zip.

---

## 7. Pendências antes de publicar

- Ativar o **Google Analytics** (ver instruções no guia de Analytics) e **remover o `track('page_view')` manual** no fim do script.
- Trocar os links de apoio **placeholder** (PIX, Ko-fi, LivePix/Membro e o link "YouTube" do rodapé).
- Revisar a frase "100% gratuita e sem anúncio invasivo" se a ferramenta passar a ser exclusiva para membros.
- Para um site de produção, considerar compilar o Tailwind em vez do CDN.

---

## 8. Contato

- Canal: [youtube.com/@YonasanErihhi](https://www.youtube.com/@YonasanErihhi/)
- Redes: [linktr.ee/yonasan](https://linktr.ee/yonasan)
