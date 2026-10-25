// ============================================================
// OBS CONFIG CALCULATOR — Core + Presets + Extras
// ============================================================

const $ = (id) => document.getElementById(id);

const inputs = {
  gpuVendor: $('gpuVendor'),
  gpuTier:   $('gpuTier'),
  cpuTier:   $('cpuTier'),
  ram:       $('ram'),
  upload:    $('upload'),
  format:    $('format'),
  targetRes: $('targetRes'),
  vtuber:    $('vtuber'),
  heavyGames:$('heavyGames'),
};

const outputs = {
  encoder:       $('outEncoder'),
  rateControl:   $('outRateControl'),
  bitrate:       $('outBitrate'),
  keyframe:      $('outKeyframe'),
  preset:        $('outPreset'),
  baseRes:       $('outBaseRes'),
  outputRes:     $('outOutputRes'),
  fps:           $('outFps'),
  audioBitrate:  $('outAudioBitrate'),
  sampleRate:    $('outSampleRate'),
};

const alertCard    = $('alertCard');
const alertIcon    = $('alertIcon');
const alertTitle   = $('alertTitle');
const alertMessage = $('alertMessage');
const tipsCard     = $('tipsCard');
const tipsList     = $('tipsList');
const copyBtn      = $('copyBtn');
const copyBtnText  = $('copyBtnText');
const shareBtn     = $('shareBtn');
const downloadProfileBtn = $('downloadProfileBtn');
const downloadProfileText = $('downloadProfileText');
const generateBtn  = $('generateBtn');
const presetGrid   = $('presetGrid');
const activeBadge  = $('activePresetBadge');
const activeName   = $('activePresetName');
const saveBtn      = $('saveBtn');
const loadSavedBtn = $('loadSavedBtn');
const toastEl      = $('toast');

let currentConfig = {};
let currentTier = 'weak';
let activePresetId = null;

// ---------- Toast helper ----------
function toast(msg, ms = 2200) {
  toastEl.textContent = msg;
  toastEl.classList.remove('opacity-0');
  toastEl.classList.add('opacity-100');
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => {
    toastEl.classList.add('opacity-0');
    toastEl.classList.remove('opacity-100');
  }, ms);
}

// ---------- Analytics helper (dispara se GA estiver ativo) ----------
function track(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
  // console.log('[track]', eventName, params); // debug
}

// ============================================================
// PRESETS
// ============================================================
const PRESETS = {
  weak: [
    { id: 'weak-chat', icon: '💬', title: 'Só Conversa', color: 'emerald',
      desc: 'Just Chatting, reação, podcast. Mínimo de carga.',
      help: 'Ideal pra conversar com o chat, reagir a vídeos leves ou podcast. Poucas fontes, sem jogo pesado. Funciona bem até em notebook fraco.',
      values: { gpuVendor: 'integrated', gpuTier: 'entry', cpuTier: 'entry', ram: '8', upload: 15, format: 'horizontal', targetRes: '720', vtuber: false, heavyGames: false } },
    { id: 'weak-game', icon: '🎮', title: 'Gameplay Leve', color: 'sky',
      desc: 'Roblox, Minecraft, indies, 2D, emuladores.',
      help: 'Pensado para Roblox, Minecraft, jogos indie, pixel art, emulador de SNES/PS1/N64 e afins. 720p60 costuma ser o ponto seguro em PC fraco.',
      values: { gpuVendor: 'nvidia', gpuTier: 'entry', cpuTier: 'entry', ram: '8', upload: 20, format: 'horizontal', targetRes: '720', vtuber: false, heavyGames: false } },
    { id: 'weak-vtuber', icon: '🦊', title: 'VTuber Minimal', color: 'violet',
      desc: 'Avatar 2D simples + conversa. Evita jogos pesados.',
      help: 'VTube Studio / Live2D leve + só conversa. Evite AAA juntos. Feche abas extras e use modelo com poucos parâmetros.',
      values: { gpuVendor: 'nvidia', gpuTier: 'entry', cpuTier: 'mid', ram: '16', upload: 20, format: 'horizontal', targetRes: '720', vtuber: true, heavyGames: false } },
    { id: 'weak-vertical', icon: '📱', title: 'Só Vertical (TikTok/Reels)', color: 'pink',
      desc: 'Live vertical 9:16. Menos pixels = menos dor.',
      help: 'Uma live só em 9:16 (TikTok, Reels, Shorts). Menos pixels que 1080p horizontal, alivia GPU e upload.',
      values: { gpuVendor: 'integrated', gpuTier: 'entry', cpuTier: 'entry', ram: '8', upload: 12, format: 'vertical', targetRes: '720', vtuber: false, heavyGames: false } },
  ],
  mid: [
    { id: 'mid-chat', icon: '💬', title: 'Só Conversa', color: 'emerald',
      desc: '1080p60 limpo. Várias fontes sem medo.',
      help: 'Conversa, reação e podcast em 1080p. Dá para overlay, alertas e browser sources com folga.',
      values: { gpuVendor: 'nvidia', gpuTier: 'mid', cpuTier: 'mid', ram: '16', upload: 25, format: 'horizontal', targetRes: '1080', vtuber: false, heavyGames: false } },
    { id: 'mid-game', icon: '🎮', title: 'Gameplay Normal', color: 'sky',
      desc: 'AAA atuais em 1080p30/60. Equilíbrio clássico.',
      help: 'Fortnite, Valorant, LoL, GTA, jogos atuais em qualidade média/alta. Se o jogo estiver pesado, a calculadora tende a 30 FPS ou preset mais rápido.',
      values: { gpuVendor: 'nvidia', gpuTier: 'mid', cpuTier: 'mid', ram: '16', upload: 30, format: 'horizontal', targetRes: '1080', vtuber: false, heavyGames: true } },
    { id: 'mid-vtuber', icon: '🦊', title: 'Gameplay + VTuber', color: 'violet',
      desc: 'Avatar + jogo. Exige mais VRAM.',
      help: 'Avatar (2D/3D) + captura de jogo. Mais VRAM e CPU. Evite dual canvas nesse nível se estiver apertado.',
      values: { gpuVendor: 'nvidia', gpuTier: 'mid', cpuTier: 'mid', ram: '16', upload: 30, format: 'horizontal', targetRes: '1080', vtuber: true, heavyGames: true } },
    { id: 'mid-dual', icon: '📺', title: 'Dual Stream', color: 'amber',
      desc: 'Horizontal + vertical ao mesmo tempo (ex.: YouTube + Shorts).',
      help: 'Dois canvases: 16:9 e 9:16. Serve para YouTube ao vivo + Shorts, ou Twitch + TikTok. Precisa de mais upload e CPU/GPU. Plugin Downstream Keyer ou 2ª instância do OBS ajudam.',
      values: { gpuVendor: 'nvidia', gpuTier: 'mid', cpuTier: 'high', ram: '16', upload: 40, format: 'dual', targetRes: '1080', vtuber: false, heavyGames: false } },
    { id: 'mid-record', icon: '🎬', title: 'Gravação YouTube', color: 'rose',
      desc: 'Offline, bitrate alto, qualidade de edição.',
      help: 'Não é live: grava local com qualidade alta (CQP/CRF no perfil). Bom para clips e upload depois no YouTube.',
      values: { gpuVendor: 'nvidia', gpuTier: 'mid', cpuTier: 'mid', ram: '16', upload: 50, format: 'recording', targetRes: '1080', vtuber: false, heavyGames: false } },
  ],
  high: [
    { id: 'high-chat', icon: '💬', title: 'Só Conversa Pro', color: 'emerald',
      desc: '1080p60 com folga e overlays pesados.',
      help: 'Setup confortável: várias browsers, alertas, mídia. Ainda assim teste o painel de Estatísticas.',
      values: { gpuVendor: 'nvidia', gpuTier: 'high', cpuTier: 'high', ram: '24', upload: 40, format: 'horizontal', targetRes: '1080', vtuber: false, heavyGames: false } },
    { id: 'high-game', icon: '🎮', title: 'Gameplay Ultra', color: 'sky',
      desc: 'AAA em alta + stream limpa.',
      help: 'Jogos pesados em alto detalhe com NVENC em qualidade. Se quiser 1440p, mude a qualidade alvo manualmente.',
      values: { gpuVendor: 'nvidia', gpuTier: 'high', cpuTier: 'high', ram: '24', upload: 50, format: 'horizontal', targetRes: '1080', vtuber: false, heavyGames: true } },
    { id: 'high-vtuber', icon: '🦊', title: 'VTuber Full Power', color: 'violet',
      desc: 'Avatar 3D + jogo + overlays.',
      help: 'VSeeFace/Warudo/3D + jogo. GPU high e RAM alta. Monitore VRAM.',
      values: { gpuVendor: 'nvidia', gpuTier: 'high', cpuTier: 'high', ram: '24', upload: 50, format: 'horizontal', targetRes: '1080', vtuber: true, heavyGames: true } },
    { id: 'high-dual', icon: '📺', title: 'Dual + VTuber', color: 'amber',
      desc: 'YouTube 16:9 + Shorts 9:16 com avatar.',
      help: 'O setup mais pesado: dual canvas + VTuber. Só faça com GPU forte e upload generoso.',
      values: { gpuVendor: 'nvidia', gpuTier: 'high', cpuTier: 'high', ram: '24', upload: 60, format: 'dual', targetRes: '1080', vtuber: true, heavyGames: false } },
    { id: 'high-record', icon: '🎬', title: 'Gravação 4K / Master', color: 'rose',
      desc: 'Arquivo local de alta qualidade.',
      help: 'Gravação local pesada. A ferramenta sugere 1080/1440 no perfil web; 4K puro depende do seu disco e GPU — ajuste no OBS se precisar.',
      values: { gpuVendor: 'nvidia', gpuTier: 'high', cpuTier: 'high', ram: '24', upload: 100, format: 'recording', targetRes: '1440', vtuber: false, heavyGames: false } },
    { id: 'high-competitive', icon: '⚡', title: 'Competitive / Low Latency', color: 'orange',
      desc: 'Prioriza FPS do jogo e latência baixa.',
      help: 'FPS competitivo: preset de encoder mais rápido, bitrate controlado, menos lookahead. Ideal Valorant, CS, Fortnite ranked.',
      values: { gpuVendor: 'nvidia', gpuTier: 'high', cpuTier: 'high', ram: '16', upload: 35, format: 'horizontal', targetRes: '1080', vtuber: false, heavyGames: true } },
  ],
};


const COLOR_MAP = {
  emerald: { border: 'border-emerald-700/50', hover: 'hover:border-emerald-500', bg: 'bg-emerald-950/30' },
  sky:     { border: 'border-sky-700/50',     hover: 'hover:border-sky-500',     bg: 'bg-sky-950/30' },
  violet:  { border: 'border-violet-700/50',  hover: 'hover:border-violet-500',  bg: 'bg-violet-950/30' },
  amber:   { border: 'border-amber-700/50',   hover: 'hover:border-amber-500',   bg: 'bg-amber-950/30' },
  pink:    { border: 'border-pink-700/50',    hover: 'hover:border-pink-500',    bg: 'bg-pink-950/30' },
  rose:    { border: 'border-rose-700/50',    hover: 'hover:border-rose-500',    bg: 'bg-rose-950/30' },
  cyan:    { border: 'border-cyan-700/50',    hover: 'hover:border-cyan-500',    bg: 'bg-cyan-950/30' },
};

function renderPresets(tier) {
  currentTier = tier;
  const list = PRESETS[tier] || [];
  presetGrid.innerHTML = '';

  list.forEach(p => {
    const c = COLOR_MAP[p.color] || COLOR_MAP.sky;
    const isActive = activePresetId === p.id;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `preset-btn text-left rounded-xl border p-4 ${c.border} ${c.hover} ${c.bg} transition group ${isActive ? 'ring-2 ring-obs-500 border-obs-500' : ''}`;
    btn.title = p.help || p.desc;
    btn.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-2xl shrink-0">${p.icon}</span>
        <div class="min-w-0">
          <div class="font-semibold text-sm text-white group-hover:text-obs-300 transition">${p.title}</div>
          <p class="text-xs text-slate-400 mt-1 leading-snug">${p.desc}</p>
          <p class="text-[10px] text-obs-400/80 mt-1.5 leading-snug line-clamp-3">${p.help || ''}</p>
        </div>
      </div>`;
    btn.addEventListener('click', () => applyPreset(p));
    presetGrid.appendChild(btn);
  });

  document.querySelectorAll('.tier-tab').forEach(tab => {
    const on = tab.dataset.tier === tier;
    tab.classList.toggle('bg-obs-600', on);
    tab.classList.toggle('border-obs-500', on);
    tab.classList.toggle('text-white', on);
    tab.classList.toggle('bg-slate-800', !on);
    tab.classList.toggle('border-slate-700', !on);
    tab.classList.toggle('text-slate-300', !on);
  });
}

function applyPreset(preset) {
  const v = preset.values;
  inputs.gpuVendor.value = v.gpuVendor;
  inputs.gpuTier.value   = v.gpuTier;
  inputs.cpuTier.value   = v.cpuTier;
  inputs.ram.value       = v.ram;
  inputs.upload.value    = v.upload;
  inputs.format.value    = v.format;
  if (inputs.targetRes && v.targetRes) inputs.targetRes.value = v.targetRes;
  inputs.vtuber.checked  = v.vtuber;
  inputs.heavyGames.checked = v.heavyGames;

  activePresetId = preset.id;
  activeBadge.classList.remove('hidden');
  activeName.textContent = `${preset.icon} ${preset.title}`;

  renderPresets(currentTier);
  calculate();
  track('preset_applied', { preset_id: preset.id, tier: currentTier });

  if (window.innerWidth < 1024) {
    alertCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ============================================================
// CÁLCULO
// ============================================================
function calculate() {
  const gpuVendor  = inputs.gpuVendor.value;
  const gpuTier    = inputs.gpuTier.value;
  const cpuTier    = inputs.cpuTier.value;
  const ram        = parseInt(inputs.ram.value, 10);
  const uploadMbps = Math.max(1, parseFloat(inputs.upload.value) || 20);
  const format     = inputs.format.value;
  const targetKey  = (inputs.targetRes && inputs.targetRes.value) || '1080';
  const vtuber     = inputs.vtuber.checked;
  const heavyGames = inputs.heavyGames.checked;

  let encoder = '';
  switch (gpuVendor) {
    case 'nvidia': encoder = 'NVIDIA NVENC H.264 (new)'; break;
    case 'amd':    encoder = 'AMD HW H.264 / AMF'; break;
    case 'intel':  encoder = 'Intel QuickSync H.264'; break;
    default:       encoder = 'x264 (Processador)'; break;
  }

  const availableMbps = uploadMbps * 0.70;
  const availableKbps = Math.floor(availableMbps * 1000);

  // Qualidade escolhida pelo usuário (base = canvas, saída = stream)
  const RES = {
    '720':  { h: '1280x720',  v: '720x1280',  minUp: 3,  bit60: 4500, bit30: 3500 },
    '1080': { h: '1920x1080', v: '1080x1920', minUp: 5,  bit60: 6000, bit30: 4500 },
    '1440': { h: '2560x1440', v: '1440x2560', minUp: 10, bit60: 9000, bit30: 7000 },
  };
  const resCfg = RES[targetKey] || RES['1080'];
  const isVert = format === 'vertical';
  let baseRes = isVert ? resCfg.v : resCfg.h;
  let outputRes = baseRes; // por padrão base = saída; dual mantém horizontal na saída principal
  let fps = 60;
  let maxBitrate = resCfg.bit60;
  let forcedDown = false;

  const weakGpu = gpuTier === 'entry';
  const lowRam  = ram < 16;
  const lowUpload = availableMbps < resCfg.minUp;

  // Ajustes de FPS / teto de bitrate conforme hardware — sem trocar a escolha do usuário sem avisar
  if (format === 'recording') {
    maxBitrate = Math.min(Math.max(availableKbps, resCfg.bit60), gpuTier === 'high' ? 20000 : 12000);
    fps = 60;
  } else if (format === 'dual') {
    // Dual: canvas principal 16:9; vertical é segundo canvas (plugin / 2ª instância)
    baseRes = resCfg.h;
    outputRes = resCfg.h;
    if (gpuTier === 'entry' || lowRam) {
      fps = 30;
      maxBitrate = Math.min(resCfg.bit30, 4000);
    } else if (gpuTier === 'mid') {
      fps = (heavyGames || vtuber) ? 30 : 60;
      maxBitrate = fps === 60 ? resCfg.bit60 : resCfg.bit30;
    } else {
      fps = 60;
      maxBitrate = resCfg.bit60;
    }
  } else {
    if (weakGpu || lowRam) {
      fps = (targetKey === '1440' || heavyGames || vtuber) ? 30 : 60;
      maxBitrate = fps === 60 ? Math.min(resCfg.bit60, 4500) : resCfg.bit30;
      if (targetKey === '1440' && gpuTier === 'entry') {
        // sugere baixar, mas respeita se o usuário insistir — aviso no alert
        forcedDown = false;
      }
    } else if (heavyGames || vtuber) {
      fps = gpuTier === 'high' ? 60 : 30;
      maxBitrate = fps === 60 ? resCfg.bit60 : resCfg.bit30;
    } else {
      fps = 60;
      maxBitrate = resCfg.bit60;
    }
    if (lowUpload) {
      fps = availableMbps < 4 ? 30 : fps;
      maxBitrate = Math.min(maxBitrate, availableMbps < 4 ? 2500 : 3500);
    }
  }

  if (activePresetId === 'high-competitive') {
    maxBitrate = Math.min(maxBitrate, 6000);
    fps = 60;
  }

  // Teto por upload real
  let bitrate = Math.min(availableKbps, maxBitrate);
  bitrate = Math.floor(bitrate / 50) * 50;
  if (bitrate < 1500) bitrate = 1500;

  let preset = '';
  if (encoder.startsWith('x264')) {
    if (cpuTier === 'high') preset = 'veryfast';
    else if (cpuTier === 'mid') preset = 'superfast';
    else preset = 'ultrafast';
  } else {
    if (activePresetId === 'high-competitive') {
      preset = 'P3 / P4 (Performance) — prioriza FPS do jogo';
    } else if (gpuTier === 'high' && cpuTier === 'high') {
      preset = 'P6 / P7 (High Quality)';
    } else if (gpuTier === 'high') {
      preset = 'P5 / P6 (Quality)';
    } else if (gpuTier === 'mid') {
      preset = 'P4 / P5 (Medium / Quality)';
    } else {
      preset = 'P3 / P4 (Performance)';
    }
    if (heavyGames && gpuTier !== 'high' && activePresetId !== 'high-competitive') {
      preset = 'P3 / P4 (Performance) — prioriza o jogo';
    }
  }

  // Áudio: 320 Kbps é leve no total e fica ótimo; em live apertada de upload ainda usamos 160–192
  let audioBitrate = '320 Kbps';
  if (format !== 'recording' && availableMbps < 5) audioBitrate = '160 Kbps';
  else if (format !== 'recording' && availableMbps < 8) audioBitrate = '192 Kbps';

  // Alerts
  const alerts = [];
  let alertLevel = 'ok';

  if (targetKey === '1440' && (gpuTier === 'entry' || availableMbps < 8)) {
    alerts.push('Você escolheu <strong>1440p</strong>, mas o PC/upload parece apertado. A config usa 1440p mesmo assim — se dropar frame, baixe para 1080p na qualidade alvo.');
    alertLevel = 'warn';
  }
  if (targetKey === '1080' && gpuTier === 'entry' && heavyGames) {
    alerts.push('1080p + jogo pesado em GPU de entrada: se o FPS do jogo cair, experimente 720p ou 30 FPS.');
    if (alertLevel === 'ok') alertLevel = 'warn';
  }
  if (lowUpload && format !== 'recording') {
    alerts.push('Upload efetivo baixo após a margem de segurança. Confira no Fast.com o valor de <strong>upload</strong> (em “Mostrar mais informações”), não o de download.');
    if (alertLevel === 'ok') alertLevel = 'warn';
  }


  if (format === 'dual' && vtuber && gpuTier !== 'high') {
    alerts.push('⚠️ <strong>Aviso de Gargalo de VRAM:</strong> Rodar Dual Canvas + VTube Studio em uma GPU com menos de 12GB de VRAM pode causar quedas severas de render no OBS. Recomendamos usar Canvas Único ou limitar o jogo a 60 FPS.');
    alertLevel = 'danger';
  }
  if (format === 'dual' && gpuTier === 'entry') {
    alerts.push('Dual Canvas em GPU de entrada é altamente desaconselhado. Prefira um único canvas 16:9 ou 9:16.');
    alertLevel = 'danger';
  }
  if (vtuber && heavyGames && gpuTier !== 'high') {
    alerts.push('VTube Studio + jogos atuais exigem bastante VRAM e CPU. Considere reduzir a qualidade do avatar ou o preset do encoder.');
    if (alertLevel !== 'danger') alertLevel = 'warn';
  }
  if (availableMbps < 6) {
    alerts.push(`Seu upload efetivo (~${availableMbps.toFixed(1)} Mbps) é baixo. A configuração foi forçada para 720p para evitar buffering nos espectadores.`);
    if (alertLevel === 'ok') alertLevel = 'warn';
  }
  if (encoder.startsWith('x264') && cpuTier === 'entry') {
    alerts.push('Você está usando encoding por software (x264) em um processador de entrada. O preset ultrafast ajuda, mas o jogo pode sofrer perda de FPS. Considere uma GPU dedicada com NVENC/AMF.');
    if (alertLevel === 'ok') alertLevel = 'warn';
  }
  if (ram === 8) {
    alerts.push('Com 8 GB de RAM o sistema pode ficar instável com navegador + OBS + jogo + VTube Studio. Feche abas desnecessárias e considere upgrade.');
    if (alertLevel === 'ok') alertLevel = 'warn';
  }
  if (alerts.length === 0) {
    alerts.push('✅ Hardware e conexão parecem adequados para a configuração sugerida. Monitore o uso de GPU/CPU no OBS durante a live.');
    alertLevel = 'ok';
  }

  // Tips dinâmicas
  const tips = [];
  if (encoder.includes('NVENC')) tips.push('No OBS, escolha “NVIDIA NVENC H.264 (new)” e deixe Look-ahead / Psycho Visual Tuning ligados se a GPU aguentar.');
  if (encoder.includes('x264')) tips.push('Feche Chrome e apps pesados. x264 come CPU — priorize o jogo e o OBS.');
  if (vtuber) tips.push('No VTube Studio, baixe a resolução do modelo e desative efeitos extras se estiver dropando frame.');
  if (format === 'dual') tips.push('Dual serve bem para YouTube horizontal + Shorts (vertical) ao mesmo tempo, ou Twitch + TikTok. Use o plugin “Downstream Keyer” ou uma 2ª instância do OBS só pro vertical.');
  if (fps === 30) tips.push('30 FPS ainda fica ótimo pra conversa e muitos jogos. Priorize estabilidade.');
  if (bitrate <= 3500) tips.push('Bitrate baixo: evite cenas muito movimentadas e overlays com partículas.');
  if (format === 'recording') tips.push('Na gravação você pode usar CQP/CRF em vez de CBR pra qualidade mais consistente.');
  if (tips.length === 0) tips.push('Depois de aplicar, faça um teste de 5–10 min e olhe o painel de Estatísticas do OBS.');

  tipsList.innerHTML = tips.map(t => `<li>${t}</li>`).join('');
  tipsCard.classList.remove('hidden');

  // UI outputs
  outputs.encoder.textContent      = encoder;
  outputs.rateControl.textContent  = 'CBR';
  outputs.bitrate.textContent      = `${bitrate} Kbps`;
  outputs.keyframe.textContent     = '2s';
  outputs.preset.textContent       = preset;
  outputs.baseRes.textContent      = baseRes;
  outputs.outputRes.textContent    = outputRes;
  outputs.fps.textContent          = `${fps} FPS`;
  outputs.audioBitrate.textContent = audioBitrate;
  outputs.sampleRate.textContent   = '48 kHz';

  alertCard.classList.remove('hidden', 'bg-emerald-950/60', 'border-emerald-700/50', 'bg-amber-950/60', 'border-amber-600/50', 'bg-red-950/60', 'border-red-600/50', 'alert-pulse');
  if (alertLevel === 'ok') {
    alertCard.classList.add('bg-emerald-950/60', 'border-emerald-700/50');
    alertIcon.textContent = '✅'; alertTitle.textContent = 'Tudo certo';
  } else if (alertLevel === 'warn') {
    alertCard.classList.add('bg-amber-950/60', 'border-amber-600/50');
    alertIcon.textContent = '⚠️'; alertTitle.textContent = 'Atenção';
  } else {
    alertCard.classList.add('bg-red-950/60', 'border-red-600/50', 'alert-pulse');
    alertIcon.textContent = '🚨'; alertTitle.textContent = 'Risco de Gargalo';
  }
  alertMessage.innerHTML = alerts.join('<br><br>');

  currentConfig = {
    encoder, rateControl: 'CBR', bitrate: `${bitrate} Kbps`, keyframe: '2s', preset,
    baseRes, outputRes, fps: `${fps} FPS`, audioBitrate, sampleRate: '48 kHz',
    format: inputs.format.options[inputs.format.selectedIndex].text,
    upload: `${uploadMbps} Mbps (efetivo ~${availableMbps.toFixed(1)} Mbps)`,
    notes: alerts.map(a => a.replace(/<[^>]+>/g, '')).join('\n'),
    presetName: activePresetId ? activeName.textContent : null,
  };
}

// ============================================================
// COPIAR / COMPARTILHAR / SALVAR
// ============================================================
function buildSummaryText() {
  if (!currentConfig.encoder) calculate();
  const c = currentConfig;
  return `
═══════════════════════════════════════
  OBS CONFIG CALCULATOR — RESUMO
═══════════════════════════════════════
${c.presetName ? `Preset: ${c.presetName}\n` : ''}
▶ ENCODER
  Codificador:          ${c.encoder}
  Controle de Taxa:     ${c.rateControl}
  Bitrate de Vídeo:     ${c.bitrate}
  Intervalo Keyframe:   ${c.keyframe}
  Preset:               ${c.preset}

▶ VÍDEO
  Resolução Base:       ${c.baseRes}
  Resolução de Saída:   ${c.outputRes}
  FPS:                  ${c.fps}

▶ ÁUDIO
  Bitrate:              ${c.audioBitrate}
  Sample Rate:          ${c.sampleRate}

▶ CONTEXTO
  Formato:              ${c.format}
  Upload informado:     ${c.upload}

▶ AVISOS
${c.notes}

───────────────────────────────────────
Gerado por OBS Config & Scene Calculator
Não substitui testes reais no OBS.
`.trim();
}

function copySummary() {
  const text = buildSummaryText();
  navigator.clipboard.writeText(text).then(() => {
    copyBtnText.textContent = 'Copiado! ✓';
    copyBtn.classList.add('bg-emerald-800', 'border-emerald-600');
    toast('Resumo copiado pro clipboard');
    track('config_copied');
    setTimeout(() => {
      copyBtnText.textContent = 'Copiar Resumo';
      copyBtn.classList.remove('bg-emerald-800', 'border-emerald-600');
    }, 2000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    toast('Resumo copiado');
  });
}

function shareConfig() {
  const text = buildSummaryText();
  if (navigator.share) {
    navigator.share({
      title: 'Minha config do OBS',
      text: text,
    }).then(() => track('config_shared')).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      toast('Resumo copiado (compartilhar não disponível)');
      track('config_shared_fallback');
    });
  }
}

function saveConfig() {
  const data = {
    gpuVendor: inputs.gpuVendor.value,
    gpuTier: inputs.gpuTier.value,
    cpuTier: inputs.cpuTier.value,
    ram: inputs.ram.value,
    upload: inputs.upload.value,
    format: inputs.format.value,
    targetRes: inputs.targetRes ? inputs.targetRes.value : '1080',
    vtuber: inputs.vtuber.checked,
    heavyGames: inputs.heavyGames.checked,
    activePresetId,
    currentTier,
    savedAt: Date.now(),
  };
  localStorage.setItem('obs_config_calculator', JSON.stringify(data));
  loadSavedBtn.classList.remove('hidden');
  toast('Configuração salva neste navegador');
  track('config_saved');
}

function loadSavedConfig() {
  try {
    const raw = localStorage.getItem('obs_config_calculator');
    if (!raw) return;
    const data = JSON.parse(raw);
    inputs.gpuVendor.value = data.gpuVendor || 'nvidia';
    inputs.gpuTier.value   = data.gpuTier || 'mid';
    inputs.cpuTier.value   = data.cpuTier || 'mid';
    inputs.ram.value       = data.ram || '16';
    inputs.upload.value    = data.upload || 20;
    inputs.format.value    = data.format || 'horizontal';
    if (inputs.targetRes) inputs.targetRes.value = data.targetRes || '1080';
    inputs.vtuber.checked  = !!data.vtuber;
    inputs.heavyGames.checked = !!data.heavyGames;
    activePresetId = data.activePresetId || null;
    currentTier = data.currentTier || 'mid';

    if (activePresetId) {
      const all = [...PRESETS.weak, ...PRESETS.mid, ...PRESETS.high];
      const found = all.find(p => p.id === activePresetId);
      if (found) {
        activeBadge.classList.remove('hidden');
        activeName.textContent = `${found.icon} ${found.title}`;
      } else {
        activePresetId = null;
        activeBadge.classList.add('hidden');
      }
    } else {
      activeBadge.classList.add('hidden');
    }

    renderPresets(currentTier);
    calculate();
    toast('Configuração carregada');
    track('config_loaded');
  } catch (e) {
    toast('Não foi possível carregar a config salva');
  }
}

// ============================================================
// GERADOR DE PERFIL OBS (basic.ini + streamEncoder.json + zip)
// Baseado na estrutura oficial de perfis do OBS Studio
// ============================================================

function getEncoderIds(gpuVendor) {
  // IDs usados pelo OBS 28+ (texture path)
  switch (gpuVendor) {
    case 'nvidia': return { stream: 'obs_nvenc_h264_tex', rec: 'obs_nvenc_h264_tex', simple: 'nvenc_h264' };
    case 'amd':    return { stream: 'h264_texture_amf',   rec: 'h264_texture_amf',   simple: 'amd' };
    case 'intel':  return { stream: 'obs_qsv11_v2',       rec: 'obs_qsv11_v2',       simple: 'qsv' };
    default:       return { stream: 'obs_x264',           rec: 'obs_x264',           simple: 'x264' };
  }
}

function mapNvencPreset(label) {
  // Converte texto amigável → valor do JSON do OBS
  if (!label) return 'p5';
  const l = label.toLowerCase();
  if (l.includes('p7') || l.includes('p6')) return 'p6';
  if (l.includes('p5')) return 'p5';
  if (l.includes('p4') || l.includes('p3')) return 'p4';
  if (l.includes('performance')) return 'p4';
  return 'p5';
}

function mapX264Preset(label) {
  if (!label) return 'veryfast';
  const l = label.toLowerCase();
  if (l.includes('ultrafast')) return 'ultrafast';
  if (l.includes('superfast')) return 'superfast';
  if (l.includes('veryfast')) return 'veryfast';
  if (l.includes('faster')) return 'faster';
  return 'veryfast';
}

function parseRes(str) {
  // "1920x1080" → { w: 1920, h: 1080 }
  const m = String(str || '1920x1080').match(/(\d+)\s*[x×]\s*(\d+)/i);
  return m ? { w: parseInt(m[1], 10), h: parseInt(m[2], 10) } : { w: 1920, h: 1080 };
}

function parseBitrateKbps(str) {
  const n = parseInt(String(str || '6000').replace(/[^\d]/g, ''), 10);
  return isNaN(n) ? 6000 : n;
}

function parseAudioKbps(str) {
  const n = parseInt(String(str || '160').replace(/[^\d]/g, ''), 10);
  return isNaN(n) ? 160 : n;
}

function parseFps(str) {
  const n = parseInt(String(str || '60').replace(/[^\d]/g, ''), 10);
  return isNaN(n) ? 60 : n;
}

function buildStreamEncoderJson(gpuVendor, bitrate, presetLabel) {
  if (gpuVendor === 'nvidia') {
    return {
      rate_control: 'CBR',
      bitrate: bitrate,
      keyint_sec: 2,
      preset: mapNvencPreset(presetLabel),
      profile: 'high',
      tune: 'hq',
      multipass: 'qres',
      lookahead: false,
      psycho_aq: true,
      bf: 2,
      gpu: 0,
    };
  }
  if (gpuVendor === 'amd') {
    return {
      rate_control: 'CBR',
      bitrate: bitrate,
      keyint_sec: 2,
      preset: 'quality',
      profile: 'high',
      bf: 0,
    };
  }
  if (gpuVendor === 'intel') {
    return {
      rate_control: 'CBR',
      bitrate: bitrate,
      keyint_sec: 2,
      target_usage: 'TU4',
      profile: 'high',
      bframes: 3,
    };
  }
  // x264
  return {
    rate_control: 'CBR',
    bitrate: bitrate,
    keyint_sec: 2,
    preset: mapX264Preset(presetLabel),
    profile: 'high',
    tune: 'zerolatency',
    x264opts: '',
  };
}

function buildRecordEncoderJson(gpuVendor) {
  // Gravação local: CQP/CRF pra qualidade constante
  if (gpuVendor === 'nvidia') {
    return {
      rate_control: 'CQP',
      cqp: 18,
      keyint_sec: 2,
      preset: 'p5',
      profile: 'high',
      tune: 'hq',
      multipass: 'qres',
      lookahead: false,
      psycho_aq: true,
      bf: 2,
      gpu: 0,
    };
  }
  if (gpuVendor === 'amd') {
    return {
      rate_control: 'CQP',
      cqp: 18,
      keyint_sec: 2,
      preset: 'quality',
      profile: 'high',
    };
  }
  if (gpuVendor === 'intel') {
    return {
      rate_control: 'ICQ',
      icq_quality: 18,
      keyint_sec: 2,
      target_usage: 'TU4',
      profile: 'high',
    };
  }
  return {
    rate_control: 'CRF',
    crf: 18,
    keyint_sec: 2,
    preset: 'veryfast',
    profile: 'high',
    tune: '',
  };
}

function buildBasicIni({ profileName, base, output, fps, bitrate, audioBitrate, encoderIds, format }) {
  // Perfil enxuto e compatível com OBS 28–31+
  // Não inclui stream key nem caminhos absolutos de usuário
  const isRecordingOnly = format === 'recording';

  return `[General]
Name=${profileName}

[Output]
Mode=Advanced
FilenameFormatting=%CCYY-%MM-%DD %hh-%mm-%ss
DelayEnable=false
DelaySec=1
DelayPreserve=true
Reconnect=true
RetryDelay=2
MaxRetries=25
BindIP=default
IPFamily=IPv4+IPv6
NewSocketLoopEnable=false
LowLatencyEnable=false

[Stream1]
IgnoreRecommended=false

[SimpleOutput]
VBitrate=${bitrate}
ABitrate=${audioBitrate}
UseAdvanced=false
Preset=veryfast
NVENCPreset2=p5
RecQuality=Stream
RecRB=true
RecRBTime=20
RecRBSize=512
RecRBPrefix=Replay
StreamAudioEncoder=aac
RecAudioEncoder=aac
RecTracks=1
StreamEncoder=${encoderIds.simple}
RecEncoder=${encoderIds.simple}

[AdvOut]
ApplyServiceSettings=true
UseRescale=false
TrackIndex=1
VodTrackIndex=2
Encoder=${encoderIds.stream}
RecType=Standard
RecFormat2=mkv
RecUseRescale=false
RecTracks=1
RecEncoder=${encoderIds.rec}
FLVTrack=1
StreamMultiTrackAudioMixes=1
FFOutputToFile=true
FFVBitrate=${bitrate}
FFVGOPSize=120
FFUseRescale=false
FFIgnoreCompat=false
FFABitrate=${audioBitrate}
FFAudioMixes=1
Track1Bitrate=${audioBitrate}
Track2Bitrate=${audioBitrate}
Track3Bitrate=160
Track4Bitrate=160
Track5Bitrate=160
Track6Bitrate=160
RecSplitFileTime=15
RecSplitFileSize=2048
RecRB=true
RecRBTime=120
RecRBSize=512
AudioEncoder=ffmpeg_aac
RecAudioEncoder=ffmpeg_aac
RecSplitFileType=Time

[Video]
BaseCX=${base.w}
BaseCY=${base.h}
OutputCX=${output.w}
OutputCY=${output.h}
FPSType=0
FPSCommon=${fps}
FPSInt=${fps}
FPSNum=${fps}
FPSDen=1
ScaleType=bicubic
ColorFormat=NV12
ColorSpace=709
ColorRange=Partial
SdrWhiteLevel=300
HdrNominalPeakLevel=1000

[Audio]
SampleRate=48000
ChannelSetup=Stereo
MeterDecayRate=23.53
PeakMeterType=0
`;
}

function buildImportReadme(profileName) {
  return `COMO IMPORTAR ESTE PERFIL NO OBS STUDIO
========================================

Perfil gerado por: OBS Config & Scene Calculator
Nome do perfil: ${profileName}

MÉTODO 1 — Import pelo menu (recomendado)
1. Abra o OBS Studio
2. No menu superior: Perfil (Profile) → Importar (Import)
3. Selecione a PASTA "${profileName}" (não o zip em si —
   extraia o .zip primeiro se necessário)
4. O perfil aparece na lista. Selecione-o.

MÉTODO 2 — Copiar manualmente
Windows:
  %APPDATA%\\obs-studio\\basic\\profiles\\
macOS:
  ~/Library/Application Support/obs-studio/basic/profiles/
Linux:
  ~/.config/obs-studio/basic/profiles/

Cole a pasta "${profileName}" dentro de "profiles" e reinicie o OBS.

O QUE ESTE PERFIL CONTÉM
- basic.ini ........ resolução, FPS, modo Avançado, encoder
- streamEncoder.json  bitrate CBR, keyframe 2s, preset
- recordEncoder.json  gravação em CQP/CRF (qualidade local)

NÃO INCLUI
- Chave de stream / conta Twitch/YouTube (conecte a sua)
- Cenas e fontes (use Coleção de Cenas separada)
- Caminhos de gravação (ajuste em Configurações → Saída)

DEPOIS DE IMPORTAR
1. Configurações → Transmissão → conecte sua conta ou cole a chave
2. Configurações → Saída → confira o caminho de gravação
3. Faça um teste de 5–10 minutos e olhe Estatísticas (FPS / encoding)

Gerado automaticamente — revise antes de ir ao vivo.
`;
}

async function downloadObsProfile() {
  if (!currentConfig.encoder) calculate();

  const gpuVendor = inputs.gpuVendor.value;
  const format = inputs.format.value;
  const bitrate = parseBitrateKbps(currentConfig.bitrate);
  const audioBitrate = parseAudioKbps(currentConfig.audioBitrate);
  const fps = parseFps(currentConfig.fps);
  const base = parseRes(currentConfig.baseRes);
  const output = parseRes(currentConfig.outputRes);
  const encoderIds = getEncoderIds(gpuVendor);
  const presetLabel = currentConfig.preset || '';

  const stamp = new Date().toISOString().slice(0, 10);
  const profileName = `OCC_${stamp}_${output.w}x${output.h}_${fps}fps`.replace(/\s+/g, '_');

  const basicIni = buildBasicIni({
    profileName, base, output, fps, bitrate, audioBitrate, encoderIds, format,
  });
  const streamEnc = JSON.stringify(buildStreamEncoderJson(gpuVendor, bitrate, presetLabel), null, 2);
  const recordEnc = JSON.stringify(buildRecordEncoderJson(gpuVendor), null, 2);
  const readme = buildImportReadme(profileName);

  try {
    if (typeof JSZip === 'undefined') {
      toast('JSZip não carregou. Recarregue a página.');
      return;
    }

    downloadProfileText.textContent = 'Gerando...';
    downloadProfileBtn.disabled = true;

    const zip = new JSZip();
    const folder = zip.folder(profileName);
    folder.file('basic.ini', basicIni);
    folder.file('streamEncoder.json', streamEnc);
    folder.file('recordEncoder.json', recordEnc);
    folder.file('COMO_IMPORTAR.txt', readme);

    // Resumo legível também na raiz do zip
    zip.file('resumo_config.txt', buildSummaryText());

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profileName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast('Perfil OBS baixado! Extraia e importe no OBS.');
    track('profile_downloaded', {
      encoder: encoderIds.stream,
      res: `${output.w}x${output.h}`,
      fps,
      bitrate,
    });
  } catch (err) {
    console.error(err);
    toast('Erro ao gerar o ZIP. Tente de novo.');
  } finally {
    downloadProfileText.textContent = 'Baixar Perfil OBS (.zip)';
    downloadProfileBtn.disabled = false;
  }
}

// ============================================================
// EVENTOS
// ============================================================
Object.values(inputs).forEach(el => {
  el.addEventListener('change', () => {
    activePresetId = null;
    activeBadge.classList.add('hidden');
    renderPresets(currentTier);
    calculate();
  });
  el.addEventListener('input', () => {
    activePresetId = null;
    activeBadge.classList.add('hidden');
    calculate();
  });
});

generateBtn.addEventListener('click', () => {
  calculate();
  track('generate_clicked');
  const target = alertCard?.classList.contains('hidden') ? $('outEncoder') : alertCard;
  (target || alertCard)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
copyBtn.addEventListener('click', copySummary);
shareBtn.addEventListener('click', shareConfig);
saveBtn.addEventListener('click', saveConfig);
loadSavedBtn.addEventListener('click', loadSavedConfig);
downloadProfileBtn?.addEventListener('click', downloadObsProfile);

// Modal de instruções do perfil
const profileHelpModal = $('profileHelpModal');
const openProfileHelp = () => {
  if (!profileHelpModal) return;
  profileHelpModal.classList.remove('hidden');
  profileHelpModal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  track('profile_help_opened');
};
const closeProfileHelp = () => {
  if (!profileHelpModal) return;
  profileHelpModal.classList.add('hidden');
  profileHelpModal.classList.remove('flex');
  document.body.style.overflow = '';
};

$('profileHelpBtn')?.addEventListener('click', openProfileHelp);
$('profileHelpClose')?.addEventListener('click', closeProfileHelp);
$('profileHelpClose2')?.addEventListener('click', closeProfileHelp);
$('profileHelpBackdrop')?.addEventListener('click', closeProfileHelp);
$('profileHelpDownload')?.addEventListener('click', () => {
  closeProfileHelp();
  downloadObsProfile();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && profileHelpModal && !profileHelpModal.classList.contains('hidden')) {
    closeProfileHelp();
  }
});

// ---------- Tabs (Calculadora / Cenas) ----------
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.app-tab').forEach(t => {
    t.classList.remove('active', 'border-obs-500', 'text-white');
    t.classList.add('border-transparent', 'text-slate-400');
  });
  const panel = document.getElementById('tab-' + tabId);
  if (panel) panel.classList.remove('hidden');
  const btn = document.querySelector(`.app-tab[data-tab="${tabId}"]`);
  if (btn) {
    btn.classList.add('active', 'border-obs-500', 'text-white');
    btn.classList.remove('border-transparent', 'text-slate-400');
  }
  track('tab_switched', { tab: tabId });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.querySelectorAll('.app-tab').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ---------- Montador de cenas (checklist → JSON) ----------
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function baseSourceProps() {
  return {
    prev_ver: 520093696,
    mixers: 0, sync: 0, flags: 0, volume: 1.0, balance: 0.5,
    enabled: true, muted: false, 'push-to-mute': false, 'push-to-mute-delay': 0,
    'push-to-talk': false, 'push-to-talk-delay': 0, hotkeys: {},
    deinterlace_mode: 0, deinterlace_field_order: 0, monitoring_type: 0,
    private_settings: {},
  };
}

function makeImagePlaceholder(name) {
  return {
    ...baseSourceProps(),
    name, uuid: uuid(),
    id: 'image_source', versioned_id: 'image_source',
    settings: { file: '', unload: true },
  };
}

function makeTextSource(name, text) {
  return {
    ...baseSourceProps(),
    name, uuid: uuid(),
    id: 'text_gdiplus', versioned_id: 'text_gdiplus_v3',
    settings: {
      text: text || '',
      font: { face: 'Arial', flags: 1, size: 64, style: 'Bold' },
      align: 'center', valign: 'center', bk_opacity: 0,
      color: 4294967295,
    },
  };
}

function makeGameCapture(name, allowTransparency) {
  return {
    ...baseSourceProps(),
    name, uuid: uuid(),
    id: 'game_capture', versioned_id: 'game_capture',
    mixers: 255,
    settings: { capture_mode: 'any_fullscreen', allow_transparency: !!allowTransparency },
    hotkeys: { 'libobs.mute': [], 'libobs.unmute': [], hotkey_start: [], hotkey_stop: [] },
  };
}

function makeWindowCapture(name) {
  return {
    ...baseSourceProps(),
    name, uuid: uuid(),
    id: 'window_capture', versioned_id: 'window_capture',
    mixers: 255,
    settings: { cursor: true },
    hotkeys: { 'libobs.mute': [], 'libobs.unmute': [] },
  };
}

function makeWebcamPlaceholder(name) {
  return {
    ...baseSourceProps(),
    name, uuid: uuid(),
    id: 'dshow_input', versioned_id: 'dshow_input',
    mixers: 255,
    settings: { video_device_id: 'default', resolution: '1920x1080', last_resolution: '1920x1080' },
    hotkeys: { 'libobs.mute': [], 'libobs.unmute': [] },
  };
}

function makeBrowserPlaceholder(name) {
  return {
    ...baseSourceProps(),
    name, uuid: uuid(),
    id: 'browser_source', versioned_id: 'browser_source',
    mixers: 255,
    settings: {
      url: 'https://',
      width: 1920,
      height: 1080,
      css: 'body { background-color: rgba(0,0,0,0); margin: 0; overflow: hidden; }',
    },
    hotkeys: { 'libobs.mute': [], 'libobs.unmute': [], 'ObsBrowser.Refresh': [] },
  };
}

function makeSceneItem(ref, id) {
  return {
    name: ref.name,
    source_uuid: ref.uuid,
    visible: true,
    locked: false,
    rot: 0.0,
    scale_ref: { x: 1920.0, y: 1080.0 },
    align: 5,
    bounds_type: 2,
    bounds_align: 0,
    bounds_crop: false,
    crop_left: 0, crop_top: 0, crop_right: 0, crop_bottom: 0,
    id,
    group_item_backup: false,
    pos: ref.pos || { x: 0.0, y: 0.0 },
    pos_rel: { x: 0.0, y: 0.0 },
    scale: { x: 1.0, y: 1.0 },
    scale_rel: { x: 1.0, y: 1.0 },
    bounds: ref.bounds || { x: 1920.0, y: 1080.0 },
    bounds_rel: { x: 1.0, y: 1.0 },
    scale_filter: 'disable',
    blend_method: 'default',
    blend_type: 'normal',
    show_transition: { duration: 0 },
    hide_transition: { duration: 0 },
    private_settings: {},
  };
}

function makeScene(name, itemRefs) {
  const items = itemRefs.map((ref, i) => makeSceneItem(ref, i + 1));
  return {
    ...baseSourceProps(),
    name, uuid: uuid(),
    id: 'scene', versioned_id: 'scene',
    settings: { custom_size: false, id_counter: items.length, items },
    hotkeys: { 'OBSBasic.SelectScene': [] },
  };
}

const SCENE_DEFS = {
  start: { label: '01 Início da live', txt: 'txt-start', kind: 'static' },
  brb:   { label: '02 Volto já',       txt: 'txt-brb',   kind: 'static' },
  main:  { label: '03 Principal',      txt: 'txt-main',  kind: 'main' },
  chat:  { label: '04 Só conversa',    txt: 'txt-chat',  kind: 'talk' },
  react: { label: '05 React',          txt: 'txt-react', kind: 'react' },
  end:   { label: '99 Tchau',          txt: 'txt-end',   kind: 'static' },
};

function getAppearMode() {
  const el = document.querySelector('input[name="appearMode"]:checked');
  return el ? el.value : 'webcam';
}

function buildCustomSceneCollection() {
  const colName = ($('sceneColName')?.value || 'Minha Live').trim() || 'Minha Live';
  const picked = [...document.querySelectorAll('.scene-pick:checked')].map(el => el.dataset.scene);
  if (picked.length === 0) {
    toast('Marque pelo menos uma cena');
    return null;
  }

  const mode = getAppearMode(); // webcam | vtuber
  const wantChatBrowser = $('optChatBrowser')?.checked;
  const wantOverlay = $('optOverlayBrowser')?.checked;

  const sources = [];
  const sceneOrder = [];
  let firstSceneName = null;

  // Fontes compartilhadas
  let personSrc = null;
  if (mode === 'vtuber') {
    personSrc = makeGameCapture('Avatar / VTuber (configure + transparência)', true);
  } else {
    personSrc = makeWebcamPlaceholder('Webcam (escolha o dispositivo)');
  }
  sources.push(personSrc);

  let gameSrc = makeGameCapture('Captura de jogo (configure a janela)', false);
  sources.push(gameSrc);

  let windowSrc = makeWindowCapture('Captura de janela / React (escolha a janela)');
  sources.push(windowSrc);

  let chatBrowser = null;
  let overlayBrowser = null;
  if (wantChatBrowser) {
    chatBrowser = makeBrowserPlaceholder('Navegador — Chat / Alertas (cole a URL)');
    sources.push(chatBrowser);
  }
  if (wantOverlay) {
    overlayBrowser = makeBrowserPlaceholder('Navegador — Overlay HTML (cole a URL)');
    sources.push(overlayBrowser);
  }

  // Layout helpers
  const full = { bounds: { x: 1920, y: 1080 }, pos: { x: 0, y: 0 } };
  const personCorner = { bounds: { x: 420, y: 315 }, pos: { x: 1460, y: 720 } };
  const personBig = { bounds: { x: 720, y: 540 }, pos: { x: 1100, y: 270 } };
  const textCenter = { bounds: { x: 1600, y: 240 }, pos: { x: 160, y: 420 } };

  picked.forEach(key => {
    const def = SCENE_DEFS[key];
    if (!def) return;
    const items = [];

    // Cenário (imagem) — sempre útil em static/talk; também atrás do main/react
    const img = makeImagePlaceholder(`Cenário — ${def.label}`);
    sources.push(img);
    items.push({ name: img.name, uuid: img.uuid, ...full });

    if (def.kind === 'main') {
      items.push({ name: gameSrc.name, uuid: gameSrc.uuid, ...full });
      items.push({ name: personSrc.name, uuid: personSrc.uuid, ...personCorner });
    } else if (def.kind === 'talk') {
      items.push({ name: personSrc.name, uuid: personSrc.uuid, ...personBig });
    } else if (def.kind === 'react') {
      items.push({ name: windowSrc.name, uuid: windowSrc.uuid, ...full });
      items.push({ name: personSrc.name, uuid: personSrc.uuid, ...personCorner });
    }

    // Texto (se preenchido)
    const txtVal = ($(def.txt)?.value || '').trim();
    if (txtVal) {
      const txt = makeTextSource(`Texto — ${def.label}`, txtVal);
      sources.push(txt);
      items.push({ name: txt.name, uuid: txt.uuid, ...textCenter });
    }

    // Chat/alertas e overlay nas cenas “vivas”
    if (chatBrowser && (def.kind === 'main' || def.kind === 'talk' || def.kind === 'react')) {
      items.push({
        name: chatBrowser.name, uuid: chatBrowser.uuid,
        bounds: { x: 400, y: 600 }, pos: { x: 20, y: 200 },
      });
    }
    if (overlayBrowser && (def.kind === 'main' || def.kind === 'talk' || def.kind === 'react')) {
      items.push({ name: overlayBrowser.name, uuid: overlayBrowser.uuid, ...full });
    }

    const scene = makeScene(def.label, items);
    sources.push(scene);
    sceneOrder.push({ name: scene.name });
    if (!firstSceneName) firstSceneName = scene.name;
  });

  return {
    name: colName,
    current_scene: firstSceneName,
    current_program_scene: firstSceneName,
    current_transition: 'Esmaecer',
    transition_duration: 300,
    preview_locked: false,
    scaling_enabled: false,
    scaling_level: 0,
    scaling_off_x: 0.0,
    scaling_off_y: 0.0,
    groups: [],
    scene_order: sceneOrder,
    transitions: [
      { name: 'Esmaecer', id: 'fade_transition', settings: {} },
      { name: 'Cortar', id: 'cut_transition', settings: {} },
    ],
    quick_transitions: [
      { name: 'Cortar', duration: 300, hotkeys: [], id: 1, fade_to_black: false },
      { name: 'Esmaecer', duration: 300, hotkeys: [], id: 2, fade_to_black: false },
    ],
    sources,
    modules: {
      'auto-scene-switcher': { interval: 300, non_matching_scene: '', switch_if_not_matching: false, active: false, switches: [] },
      captions: { source: '', enabled: false, lang_id: 1046, provider: 'mssapi' },
      'output-timer': {
        streamTimerHours: 0, streamTimerMinutes: 0, streamTimerSeconds: 30,
        recordTimerHours: 0, recordTimerMinutes: 0, recordTimerSeconds: 30,
        autoStartStreamTimer: false, autoStartRecordTimer: false, pauseRecordTimer: true,
      },
      'scripts-tool': [],
    },
  };
}

function downloadCustomScenes() {
  const data = buildCustomSceneCollection();
  if (!data) return;
  const safeName = data.name.replace(/[^\w\s\-à-úÀ-Ú]/gi, '').trim().replace(/\s+/g, '_') || 'OCC_Cenas';
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Coleção gerada! Importe em Coleção de Cenas → Importar');
  track('scene_builder_download', {
    mode: getAppearMode(),
    scenes: data.scene_order.map(s => s.name).join(','),
    count: data.scene_order.length,
  });
}

// Lápis: mostra/esconde input de texto da cena
document.querySelectorAll('.pencil-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const input = document.getElementById(btn.dataset.for);
    if (!input) return;
    input.classList.toggle('hidden');
    if (!input.classList.contains('hidden')) {
      input.focus();
      input.select();
    }
  });
});

$('buildScenesBtn')?.addEventListener('click', downloadCustomScenes);


document.querySelectorAll('.tier-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    activePresetId = null;
    activeBadge.classList.add('hidden');
    renderPresets(tab.dataset.tier);
    track('tier_selected', { tier: tab.dataset.tier });
  });
});

// PIX ainda é placeholder — avisa se o href continuar "#"
$('pixBtn')?.addEventListener('click', (e) => {
  const href = e.currentTarget.getAttribute('href') || '';
  if (!href || href === '#') {
    e.preventDefault();
    toast('Substitua o link do PIX pelo seu (chave ou QR)');
  }
});


// ---------- Termos de Uso ----------
const termsModal = document.getElementById('terms-modal');
function openTerms() {
  if (!termsModal) return;
  termsModal.hidden = false;
  termsModal.classList.remove('hidden');
  termsModal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  track('terms_opened');
}
function closeTerms() {
  if (!termsModal) return;
  termsModal.hidden = true;
  termsModal.classList.add('hidden');
  termsModal.classList.remove('flex');
  document.body.style.overflow = '';
}
document.querySelectorAll('.terms-open').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openTerms();
  });
});
document.getElementById('close-terms')?.addEventListener('click', closeTerms);
document.getElementById('terms-backdrop')?.addEventListener('click', closeTerms);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && termsModal && !termsModal.hidden) closeTerms();
});

// Watermark de fundo (estilo do canal)
const wmEl = document.getElementById('wm');
if (wmEl) wmEl.textContent = 'YONASAN '.repeat(90);

// Init
if (localStorage.getItem('obs_config_calculator')) {
  loadSavedBtn.classList.remove('hidden');
}
renderPresets('weak');
calculate();
