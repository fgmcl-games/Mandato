/* ═══════════════════════════════════════════════════════════
   MANDATO — SISTEMA DE AUDIO
   Web Audio API pura. Sin dependencias externas.
   Jesús · FGMCL GAMES
═══════════════════════════════════════════════════════════ */

const Audio = (() => {
  let ctx = null;
  let masterGain = null;
  let musicGain = null;
  let sfxGain = null;
  let musicNodes = [];
  let musicPlaying = false;
  let enabled = true;
  let musicEnabled = true;
  let lastSfx = 0;

  /* ── Inicializar contexto (requiere gesto del usuario) ── */
  function init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain(); masterGain.gain.value = 0.7;
      musicGain  = ctx.createGain(); musicGain.gain.value  = 0.18;
      sfxGain    = ctx.createGain(); sfxGain.gain.value    = 0.72;
      musicGain.connect(masterGain);
      sfxGain.connect(masterGain);
      masterGain.connect(ctx.destination);
    } catch(e) { enabled = false; }
  }

  /* ── Utilidades de síntesis ── */
  function osc(type, freq, start, dur, gainPeak, dest, detune=0) {
    if (!ctx) return null;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    if (detune) o.detune.value = detune;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gainPeak, start + dur * 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    o.connect(g); g.connect(dest);
    o.start(start); o.stop(start + dur + 0.01);
    return o;
  }

  function noise(dur, gainPeak, dest, color = 'white') {
    if (!ctx) return;
    const bufSize = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = color === 'low' ? 'lowpass' : 'bandpass';
    filter.frequency.value = color === 'low' ? 220 : 800;
    g.gain.setValueAtTime(gainPeak, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(filter); filter.connect(g); g.connect(dest);
    src.start(); src.stop(ctx.currentTime + dur);
  }

  /* ══════════════════════════════════════
     MÚSICA AMBIENT GENERATIVA
  ══════════════════════════════════════ */

  // Escala pentatónica menor: intervalos de frecuencia base
  const SCALE = [1, 1.189, 1.335, 1.587, 1.782];
  const BASE_FREQ = 55; // A1

  function notaRandom(octava = 0) {
    return BASE_FREQ * Math.pow(2, octava) * SCALE[Math.floor(Math.random() * SCALE.length)];
  }

  function startAmbient() {
    if (!ctx || !musicEnabled || musicPlaying) return;
    musicPlaying = true;

    // ─ Drone (pedal tonal continuo) ─
    const drone1 = ctx.createOscillator();
    const drone2 = ctx.createOscillator();
    const droneG = ctx.createGain();
    const droneFilter = ctx.createBiquadFilter();
    drone1.type = 'sawtooth'; drone1.frequency.value = BASE_FREQ;
    drone2.type = 'sawtooth'; drone2.frequency.value = BASE_FREQ * 1.001; // leve detuning
    droneFilter.type = 'lowpass'; droneFilter.frequency.value = 320;
    droneFilter.Q.value = 1.2;
    droneG.gain.value = 0;
    droneG.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 3);
    drone1.connect(droneFilter); drone2.connect(droneFilter);
    droneFilter.connect(droneG); droneG.connect(musicGain);
    drone1.start(); drone2.start();
    musicNodes.push(drone1, drone2, droneG);

    // ─ Sub bass pulsante ─
    const sub = ctx.createOscillator();
    const subG = ctx.createGain();
    const lfo  = ctx.createOscillator();
    const lfoG = ctx.createGain();
    sub.type = 'sine'; sub.frequency.value = BASE_FREQ / 2;
    lfo.type = 'sine'; lfo.frequency.value = 0.12;
    lfoG.gain.value = 0.06;
    lfo.connect(lfoG); lfoG.connect(subG.gain);
    subG.gain.value = 0.22;
    sub.connect(subG); subG.connect(musicGain);
    sub.start(); lfo.start();
    musicNodes.push(sub, subG, lfo, lfoG);

    // ─ Notas melódicas aleatorias (arpa oscura) ─
    let melStep = 0;
    function tocarMelodia() {
      if (!musicPlaying || !ctx) return;
      const t = ctx.currentTime;
      const freq = notaRandom(Math.random() < 0.5 ? 1 : 2);
      const dur  = 2.4 + Math.random() * 3;
      const vol  = 0.04 + Math.random() * 0.08;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const rev = ctx.createConvolver();
      // reverb simple
      const revBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const revData = revBuf.getChannelData(0);
      for (let i = 0; i < revData.length; i++) revData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revData.length, 4);
      rev.buffer = revBuf;
      o.type = 'triangle'; o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(rev); rev.connect(musicGain);
      g.connect(musicGain); // dry
      o.start(t); o.stop(t + dur + 0.05);
      melStep++;
      const delay = 1200 + Math.random() * 3800;
      setTimeout(tocarMelodia, delay);
    }
    setTimeout(tocarMelodia, 800);

    // ─ Hit percusivo sutil (cada ~8s) ─
    function perc() {
      if (!musicPlaying || !ctx) return;
      const t = ctx.currentTime;
      noise(0.12, 0.04, musicGain, 'bandpass');
      setTimeout(perc, 6000 + Math.random() * 6000);
    }
    setTimeout(perc, 4000);
  }

  function stopAmbient() {
    musicPlaying = false;
    musicNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e){} });
    musicNodes = [];
  }

  function ambientCaos() {
    // Modo caos: subir pitch del drone, agregar tensión
    if (!ctx) return;
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 1.5);
  }

  function ambientNormal() {
    if (!ctx) return;
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.5);
  }

  /* ══════════════════════════════════════
     SONIDOS DE INTERFAZ
  ══════════════════════════════════════ */

  function sfxClick() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    osc('sine', 880, t, 0.07, 0.18, sfxGain);
    osc('sine', 1100, t + 0.03, 0.05, 0.08, sfxGain);
  }

  function sfxHover() {
    if (!ctx || !enabled) return;
    const now = Date.now();
    if (now - lastSfx < 80) return;
    lastSfx = now;
    const t = ctx.currentTime;
    osc('sine', 660, t, 0.04, 0.06, sfxGain);
  }

  function sfxDecision() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    // acorde de confirmación
    osc('triangle', 440, t,        0.25, 0.22, sfxGain);
    osc('triangle', 550, t + 0.04, 0.22, 0.18, sfxGain);
    osc('triangle', 660, t + 0.08, 0.28, 0.15, sfxGain);
    noise(0.06, 0.03, sfxGain, 'bandpass');
  }

  function sfxEvento() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    // whoosh + nota grave
    osc('sawtooth', 220, t,      0.18, 0.12, sfxGain);
    osc('sine',     330, t+0.06, 0.22, 0.15, sfxGain);
    noise(0.08, 0.025, sfxGain, 'low');
  }

  function sfxCrisis() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    // alarma descendente dramática
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = 'sawtooth';
    o1.frequency.setValueAtTime(660, t);
    o1.frequency.exponentialRampToValueAtTime(220, t + 0.6);
    g1.gain.setValueAtTime(0.32, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
    o1.connect(g1); g1.connect(sfxGain);
    o1.start(t); o1.stop(t + 0.7);
    // pulso de bajo
    setTimeout(() => {
      if (!ctx) return;
      const t2 = ctx.currentTime;
      osc('sine', 110, t2, 0.4, 0.38, sfxGain);
    }, 350);
    noise(0.18, 0.06, sfxGain, 'low');
  }

  function sfxStatPos() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    osc('sine', 523, t,       0.14, 0.14, sfxGain);
    osc('sine', 659, t+0.07, 0.12, 0.12, sfxGain);
  }

  function sfxStatNeg() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    osc('sine', 330, t,       0.14, 0.14, sfxGain);
    osc('sine', 220, t+0.07, 0.14, 0.12, sfxGain);
  }

  function sfxGameOver() {
    if (!ctx || !enabled) return;
    stopAmbient();
    const t = ctx.currentTime;
    // secuencia descendente fúnebre
    const notas = [440, 392, 349, 294, 262, 220];
    notas.forEach((f, i) => {
      osc('sawtooth', f, t + i * 0.28, 0.55, 0.26 - i * 0.03, sfxGain);
    });
    // reverb final
    setTimeout(() => {
      if (!ctx) return;
      const t2 = ctx.currentTime;
      osc('sine', 110, t2, 2.2, 0.22, sfxGain);
    }, 1700);
  }

  function sfxLogro() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    osc('triangle', 523, t,        0.18, 0.18, sfxGain);
    osc('triangle', 659, t+0.1,   0.18, 0.16, sfxGain);
    osc('triangle', 784, t+0.2,   0.22, 0.18, sfxGain);
    osc('triangle', 1047, t+0.32, 0.3,  0.2,  sfxGain);
  }

  function sfxEleccion() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    // fanfare política
    const seq = [523, 659, 784, 659, 784, 1047];
    seq.forEach((f, i) => {
      osc('square', f, t + i * 0.11, 0.18, 0.15, sfxGain);
    });
  }

  function sfxCaos() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    // glitch distorsionado
    for (let i = 0; i < 6; i++) {
      const f = 80 + Math.random() * 800;
      osc('sawtooth', f, t + i * 0.05, 0.09, 0.28, sfxGain, Math.random() * 200 - 100);
    }
    noise(0.35, 0.09, sfxGain, 'bandpass');
    ambientCaos();
  }

  function sfxCaosOff() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    osc('sine', 440, t,      0.2, 0.12, sfxGain);
    osc('sine', 330, t+0.1, 0.2, 0.08, sfxGain);
    ambientNormal();
  }

  function sfxMenuOpen() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    osc('sine', 660, t, 0.12, 0.1, sfxGain);
    osc('sine', 440, t+0.06, 0.1, 0.08, sfxGain);
  }

  function sfxNewGame() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;
    osc('triangle', 330, t,       0.3,  0.2, sfxGain);
    osc('triangle', 440, t+0.12,  0.28, 0.2, sfxGain);
    osc('triangle', 523, t+0.24,  0.28, 0.2, sfxGain);
    osc('triangle', 659, t+0.36,  0.45, 0.22, sfxGain);
    startAmbient();
  }

  /* ── Controls UI ── */
  function setMaster(v) { if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v)); }
  function setMusic(v)  { if (musicGain)  musicGain.gain.value  = Math.max(0, Math.min(1, v)) * 0.18 / 0.18; }
  function toggleEnabled()      { enabled = !enabled; return enabled; }
  function toggleMusic()        { musicEnabled = !musicEnabled; if (!musicEnabled) stopAmbient(); else startAmbient(); return musicEnabled; }

  return {
    init, startAmbient, stopAmbient,
    sfxClick, sfxHover, sfxDecision, sfxEvento, sfxCrisis,
    sfxStatPos, sfxStatNeg, sfxGameOver, sfxLogro,
    sfxEleccion, sfxCaos, sfxCaosOff, sfxMenuOpen, sfxNewGame,
    setMaster, setMusic, toggleEnabled, toggleMusic,
    isEnabled: () => enabled,
    isMusicOn: () => musicEnabled,
  };
})();
