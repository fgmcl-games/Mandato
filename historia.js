/* ═══════════════════════════════════════════════════════════
   MANDATO — MODO HISTORIA v3
   Cinemática jugable: Acto I → Juegas → Acto II → Juegas
   FGMCL GAMES
═══════════════════════════════════════════════════════════ */

/* ══ ESTADO GLOBAL ══════════════════════════════════════════ */
let MODO_HISTORIA_ACTIVO = false;
let MH_PAIS   = null;
let MH_CAP    = null;
let MH_BONUS  = {};
let MH_TYPING = false;
let MH_TYP_T  = null;
let MH_IDX    = 0;

const H = id => document.getElementById(id);

/* ══ DATOS: VENEZUELA CAP 1 ════════════════════════════════ */
const HISTORIA = {
  venezuela: {
    disponible: true,
    capitulos: [
      {
        id: 've_cap1',
        numero: 1,
        titulo: 'EL PESO DEL DESPACHO',
        año: '2016',
        descripcion: 'Los primeros catorce días de un mandato al borde del abismo. Economía en caída libre, gabinete dividido, calles que arden.',
        /* Checkpoints: después del día X se dispara el acto Y */
        checkpoints: [
          { dia: 7,  acto: 'acto2' },
          { dia: 14, acto: 'fin'   },
        ],
        actos: {
          /* ── ACTO 1: antes de jugar días 1-7 ── */
          acto1: [
            { t:'ambiente', color:'#f5c518', texto:'CARACAS, VENEZUELA', sub:'2016 · 03:17 a.m.' },
            { t:'titulo', pais:'VENEZUELA', cap:'CAPÍTULO I', titcap:'EL PESO DEL DESPACHO', color:'#f5c518' },
            { t:'tension', texto:'El país lleva meses en caída libre.\nNadie lo dice en voz alta todavía.', color:'#ff3344' },
            { t:'narr', fondo:'despacho', hora:'03:17 a.m.',
              txt:'El reloj marca las tres de la madrugada. El despacho presidencial huele a cigarrillo frío y a decisiones que ya no tienen marcha atrás.' },
            { t:'narr', fondo:'despacho',
              txt:'Delante de Julián Márquez, las carpetas rojas se apilan como muros. Cada una es un incendio. Juntas, son un país que se consume.' },
            { t:'classified', titulo:'INFORME CONFIDENCIAL — BCV', datos:[
                { ico:'📈', label:'Inflación anual',       val:'+218%',   color:'#ff3344' },
                { ico:'🛒', label:'Alimentos: reservas',   val:'15 días', color:'#ff8800' },
                { ico:'💊', label:'Medicamentos críticos',  val:'DÉFICIT', color:'#ff3344' },
                { ico:'⛽', label:'Divisas para combustible',val:'< 60 días', color:'#ff8800'},
              ]},
            { t:'dial', emoji:'🧑‍💼', nom:'CARLOS VEGA', rol:'Jefe de Gabinete',
              txt:'Presidente... los datos del BCV son peores que los preliminares. La caída de la producción supera todo lo estimado.' },
            { t:'dial', emoji:'🧑‍💼', nom:'CARLOS VEGA', rol:'Jefe de Gabinete',
              txt:'Si esto sigue así, en menos de dos meses no tendremos divisas para importar combustible. El país se detiene.' },
            { t:'dial', emoji:'👤', nom:'MÁRQUEZ', rol:'Presidente de la República',
              txt:'¿La gente sabe esto?' },
            { t:'dial', emoji:'🧑‍💼', nom:'CARLOS VEGA', rol:'Jefe de Gabinete',
              txt:'No oficialmente. Pero lo sienten. Los mercados están vacíos, señor Presidente. La gente lo sabe aunque nadie se lo diga.' },
            { t:'ventana', txt:'Afuera, Caracas duerme mal. Pocas luces. Mucho silencio. El tipo de silencio que viene antes del ruido.' },
            { t:'separador', dia:'DÍA 3', titulo:'GABINETE DIVIDIDO', color:'#4488ff' },
            { t:'narr', fondo:'sala',
              txt:'La sala de reuniones huele a café viejo y a guerra fría. Los ministros llevan una hora sin ponerse de acuerdo en nada.' },
            { t:'dial', emoji:'📊', nom:'MIN. ECONOMÍA', rol:'Ministerio de Economía',
              txt:'¡Los controles de precios están matando el mercado! Los productos desaparecen porque no hay incentivo para vender. Hay que liberar, aunque duela.' },
            { t:'dial', emoji:'🏪', nom:'MIN. COMERCIO', rol:'Ministerio de Comercio',
              txt:'¿Liberar? ¿Ahora? Si soltamos los controles hoy, mañana un litro de aceite vale lo que un salario. La gente no puede comer ideología.' },
            { t:'tension', texto:'Nadie tiene la respuesta.\nPero todos actúan como si la tuvieran.', color:'#ff8800' },
            { t:'dec',
              ctx:'El debate lleva una hora en círculos. El gabinete está paralizado. Todos te miran.',
              preg:'Como Presidente, ¿cómo rompes el impasse?',
              ops:[
                { txt:'Exigir dos planes concretos para mañana. Sin tomar partido aún.',
                  res:'Tu neutralidad genera respeto... y frustración. Ambos bandos sienten que no los respaldas.',
                  bonus:{estabilidad:3}, col:'#4488ff' },
                { txt:'Respaldar la liberación gradual. El mercado debe respirar.',
                  res:'El Ministro de Economía sale fortalecido. El sector popular te mira con recelo.',
                  bonus:{economia:5,popularidad:-4}, col:'#f5c518' },
                { txt:'Defender el control estatal. El Estado no puede ceder en crisis.',
                  res:'La Ministra de Comercio te agradece. Los empresarios empiezan a preocuparse.',
                  bonus:{popularidad:5,economia:-3}, col:'#ff8800' },
              ]},
            { t:'separador', dia:'DÍA 5', titulo:'LAS CALLES HABLAN', color:'#ff3344' },
            { t:'narr', fondo:'calle',
              txt:'La realidad no espera decretos. En el oeste de Caracas, las colas para comprar harina empiezan antes del amanecer.' },
            { t:'dial', emoji:'🛡️', nom:'SEGURIDAD', rol:'Director de Seguridad Nacional',
              txt:'Señor Presidente, la situación en tres zonas del oeste es crítica. Hubo disturbios esta madrugada por falta de alimentos. Hay heridos.' },
            { t:'dial', emoji:'👤', nom:'MÁRQUEZ', rol:'Presidente',
              txt:'¿Cuánto tiempo tenemos antes de que esto escale?' },
            { t:'dial', emoji:'🛡️', nom:'SEGURIDAD', rol:'Director de Seguridad Nacional',
              txt:'Cuarenta y ocho horas, con optimismo. Si el camión de distribución no llega mañana a esos barrios, no respondo por lo que pase.' },
            { t:'dec',
              ctx:'Los disturbios son pequeños todavía. Pero el informe habla de 48 horas antes de que escalen.',
              preg:'¿Cómo respondes a la crisis de abastecimiento en el oeste?',
              ops:[
                { txt:'Desplegar Guardia Nacional para mantener el orden en los mercados.',
                  res:'Se restablece el orden, pero las imágenes de soldados en supermercados impactan internacionalmente.',
                  bonus:{estabilidad:5,relaciones:-5}, col:'#ff3344' },
                { txt:'Activar distribución de emergencia con camiones del Estado.',
                  res:'La respuesta llega tarde y con fallas logísticas, pero es bien recibida por la gente.',
                  bonus:{popularidad:5,economia:-3}, col:'#4488ff' },
                { txt:'Reunirte personalmente con líderes comunitarios de las zonas afectadas.',
                  res:'El gesto es visto como cercano y humano. La tensión baja en esas comunidades.',
                  bonus:{popularidad:7,estabilidad:3}, col:'#f5c518' },
              ]},
            { t:'transicion',
              txt:'Los primeros siete días son tuyos.\nCada decisión pesa.',
              sub:'El mandato comienza ahora.', color:'#f5c518' },
          ],

          /* ── ACTO 2: después de día 7, antes de días 8-14 ── */
          acto2: [
            { t:'tension', texto:'Han pasado siete días.\nNada mejoró.\nTodo empeoró.', color:'#ff3344' },
            { t:'separador', dia:'DÍA 7', titulo:'INFRAESTRUCTURA', color:'#00ffcc' },
            { t:'narr', fondo:'apagon',
              txt:'Un apagón masivo golpea el centro y el occidente. No es mala suerte — es el sistema colapsando en cámara lenta.' },
            { t:'narr', fondo:'apagon',
              txt:'Hospitales con generadores que fallan. Incubadoras apagadas. Cirugías canceladas. Personas que dependían de una máquina para vivir.' },
            { t:'dial', emoji:'🏥', nom:'MIN. SALUD', rol:'Ministerio de Salud',
              txt:'Presidente, perdimos a tres pacientes en las últimas horas por el apagón. Los generadores no dan abasto. Necesitamos respuesta ahora.' },
            { t:'tension', texto:'El Estado prometió luz.\nEl Estado prometió agua.\nEl Estado prometió.', color:'#00ffcc' },
            { t:'separador', dia:'DÍA 9', titulo:'EL MUNDO MIRA', color:'#ff8800' },
            { t:'narr', fondo:'ventana',
              txt:'Desde Washington y Bruselas, la presión llega en forma de comunicados diplomáticos. Las palabras son corteses. Las intenciones, no.' },
            { t:'dial', emoji:'🌐', nom:'CANCILLER', rol:'Ministerio de Relaciones Exteriores',
              txt:'Nos amenazan con sanciones selectivas. Bloqueo de cuentas de funcionarios, restricciones comerciales. Quieren que admitamos que fallamos.' },
            { t:'dial', emoji:'👤', nom:'MÁRQUEZ', rol:'Presidente',
              txt:'¿Y si no cedemos?' },
            { t:'dial', emoji:'🌐', nom:'CANCILLER', rol:'Ministerio de Relaciones Exteriores',
              txt:'El aislamiento total. Las pocas alianzas que nos quedan no tienen músculo real para ayudarnos. Estaríamos solos.' },
            { t:'separador', dia:'DÍA 11', titulo:'LA CHISPA', color:'#ff5500' },
            { t:'narr', fondo:'protesta',
              txt:'Lo que empezó como concentraciones pequeñas se convirtió en algo más difícil de ignorar. Las consignas ya no hablan de comida — hablan de poder.' },
            { t:'cita', txt:'"¡Queremos comer!"\n"¡Fuera!"\n"No más mentiras."', color:'#ff5500' },
            { t:'dial', emoji:'⚔️', nom:'MIN. DEFENSA', rol:'Ministerio de Defensa',
              txt:'Las fuerzas del orden están al límite, señor Presidente. Si esto crece un veinte por ciento más, no puedo garantizar contención sin consecuencias graves.' },
            { t:'tension', texto:'Los puntos rojos en el mapa se multiplican.\nCada uno es un barrio.\nCada barrio, una furia acumulada.', color:'#ff5500' },
            { t:'narr', fondo:'despacho',
              txt:'Márquez está de nuevo en su despacho. De noche. Ya no hay sorpresa — solo la certeza fría de que el control se escapa.' },
            { t:'cita', txt:'"El país no está colapsando de golpe.\nEstá cediendo.\nPoco a poco.\nComo todo lo que dura demasiado en quebrarse."', color:'#aaaaaa', firma:'— Julián Márquez, día 13' },
            { t:'transicion',
              txt:'Los últimos siete días del capítulo.\nLo que hagas ahora define el legado.',
              sub:'El mandato continúa.', color:'#ff3344' },
          ],

          /* ── FIN: después de día 14 ── */
          fin: [
            { t:'tension', texto:'Catorce días.\nUn país al borde.', color:'#aaaaaa' },
            { t:'ambiente', color:'#f5c518', texto:'FIN DEL CAPÍTULO I', sub:'El mandato real apenas comienza.' },
            { t:'fincard' },
          ],
        }
      }
    ]
  },
  argentina: { disponible:false, capitulos:[] },
  eeuu:      { disponible:false, capitulos:[] },
  china:     { disponible:false, capitulos:[] },
  rusia:     { disponible:false, capitulos:[] },
  espana:    { disponible:false, capitulos:[] },
};

/* ══ ABRIR / CERRAR ════════════════════════════════════════ */
function abrirHistoria() {
  H('sh').style.display = 'flex';
  requestAnimationFrame(() => H('sh').classList.add('sh-vis'));
  pantallaSeleccionPaises();
}
function cerrarHistoria() {
  H('sh').classList.remove('sh-vis');
  setTimeout(() => { H('sh').style.display='none'; }, 380);
}

/* ══ PANTALLA SELECCIÓN DE PAÍS ═══════════════════════════ */
function pantallaSeleccionPaises() {
  MH_PAIS=null; MH_CAP=null; MH_BONUS={};
  const FLAGS  = {venezuela:'🇻🇪',argentina:'🇦🇷',eeuu:'🇺🇸',china:'🇨🇳',rusia:'🇷🇺',espana:'🇪🇸'};
  const NOMBRES= {venezuela:'Venezuela',argentina:'Argentina',eeuu:'Estados Unidos',china:'China',rusia:'Rusia',espana:'España'};
  const c = H('sh-content');
  c.className = 'sh-content sh-screen';
  c.innerHTML = `
    <div class="sh-hdr">
      <button class="sh-back" onclick="cerrarHistoria()">✕ Cerrar</button>
      <div class="sh-hdr-titulo">MODO HISTORIA</div>
      <div class="sh-hdr-sub">Cada país. Una crisis real.</div>
    </div>
    <div class="sh-paises-grid" id="sh-grid"></div>
  `;
  const grid = H('sh-grid');
  Object.entries(HISTORIA).forEach(([id,data]) => {
    const div = document.createElement('div');
    div.className = `sh-pais ${data.disponible?'sh-pais-ok':'sh-pais-lock'}`;
    const caps = data.disponible ? data.capitulos.length : 0;
    div.innerHTML = `
      <div class="sh-pais-flag">${FLAGS[id]}</div>
      <div class="sh-pais-nom">${NOMBRES[id]}</div>
      <div class="sh-pais-info">${data.disponible ? caps+' capítulo'+(caps!==1?'s':'') : 'Próximamente'}</div>
      ${data.disponible ? '<div class="sh-pais-cta">Comenzar →</div>' : '<div class="sh-pais-lock-ico">🔒</div>'}
    `;
    if(data.disponible) div.onclick = () => pantallaCapitulos(id);
    grid.appendChild(div);
  });
}

/* ══ PANTALLA SELECCIÓN DE CAPÍTULO ══════════════════════ */
function pantallaCapitulos(id) {
  MH_PAIS = id;
  const FLAGS  = {venezuela:'🇻🇪',argentina:'🇦🇷',eeuu:'🇺🇸',china:'🇨🇳',rusia:'🇷🇺',espana:'🇪🇸'};
  const NOMBRES= {venezuela:'Venezuela',argentina:'Argentina',eeuu:'Estados Unidos',china:'China',rusia:'Rusia',espana:'España'};
  const data   = HISTORIA[id];
  const c      = H('sh-content');
  c.className  = 'sh-content sh-screen';
  c.innerHTML  = `
    <div class="sh-hdr">
      <button class="sh-back" onclick="pantallaSeleccionPaises()">← Países</button>
      <div class="sh-hdr-titulo">${FLAGS[id]} ${NOMBRES[id]}</div>
      <div class="sh-hdr-sub">Selecciona un capítulo</div>
    </div>
    <div class="sh-caps-lista" id="sh-caps"></div>
  `;
  const lista = H('sh-caps');
  data.capitulos.forEach((cap,i) => {
    const div = document.createElement('div');
    div.className = 'sh-cap';
    div.innerHTML = `
      <div class="sh-cap-num">CAPÍTULO ${cap.numero} · ${cap.año}</div>
      <div class="sh-cap-tit">${cap.titulo}</div>
      <div class="sh-cap-desc">${cap.descripcion}</div>
      <div class="sh-cap-flujo">🎬 Cinemática → ⚔️ Juegas 7 días → 🎬 Cinemática → ⚔️ Juegas 7 días</div>
    `;
    div.onclick = () => lanzarActo(id, i, 'acto1');
    lista.appendChild(div);
  });
}

/* ══ LANZAR UN ACTO ═══════════════════════════════════════ */
function lanzarActo(paisId, capIdx, actoId) {
  MH_PAIS   = paisId;
  MH_CAP    = capIdx;
  MH_IDX    = 0;
  MH_TYPING = false;
  clearTimeout(MH_TYP_T);
  const c = H('sh-content');
  c.className = 'sh-content sh-cin';
  renderEscena(actoId);
}

/* ══ RENDER DE ESCENA ══════════════════════════════════════ */
function renderEscena(actoId) {
  const cap   = HISTORIA[MH_PAIS].capitulos[MH_CAP];
  const escenas = cap.actos[actoId];
  const esc   = escenas[MH_IDX];
  if(!esc) return;

  const c = H('sh-content');
  c.innerHTML = '';
  c.className = `sh-content sh-cin sh-fondo-${esc.fondo||'default'}`;

  // Scanlines persistentes
  const sl = document.createElement('div'); sl.className='sh-scanlines'; c.appendChild(sl);
  // Viñeta de color
  const vig = document.createElement('div'); vig.className='sh-vignet'; c.appendChild(vig);

  // Barra de progreso
  const pct = ((MH_IDX+1)/escenas.length*100).toFixed(1);
  const prog = document.createElement('div');
  prog.className='sh-prog';
  prog.innerHTML=`<div class="sh-prog-f" style="width:${pct}%;background:${esc.color||'rgba(255,255,255,.3)'}"></div>`;
  c.appendChild(prog);

  const main = document.createElement('div');
  main.className = 'sh-main';
  c.appendChild(main);

  switch(esc.t) {
    case 'ambiente':   renderAmbiente(main,esc); break;
    case 'titulo':     renderTitulo(main,esc);   break;
    case 'tension':    renderTension(main,esc);  break;
    case 'narr':       renderNarr(main,esc);     break;
    case 'classified': renderClassified(main,esc);break;
    case 'dial':       renderDial(main,esc);     break;
    case 'ventana':    renderVentana(main,esc);  break;
    case 'separador':  renderSep(main,esc);      break;
    case 'dec':        renderDec(main,esc,actoId);break;
    case 'cita':       renderCita(main,esc);     break;
    case 'transicion': renderTransicion(main,esc,actoId);break;
    case 'fincard':    renderFinCard(main,cap);  break;
  }

  // Botones de nav (excepto en decisión y transición y fincard)
  if(!['dec','transicion','fincard'].includes(esc.t)) {
    const nav = document.createElement('div');
    nav.className = 'sh-nav-row';
    const esUltima = MH_IDX === escenas.length-1;
    nav.innerHTML = `
      <button class="sh-skip" onclick="saltarActo('${actoId}')">Saltar acto</button>
      ${!esUltima ? `<button class="sh-next" style="border-color:${esc.color||'rgba(255,255,255,.3)'};color:${esc.color||'rgba(255,255,255,.6)'}" onclick="avanzarEscena('${actoId}')">Continuar →</button>` : ''}
    `;
    c.appendChild(nav);
  }
}

/* ── Tipos de escena ──────────────────────────────────────── */

function renderAmbiente(el, esc) {
  el.innerHTML = `
    <div class="sh-ambiente">
      <div class="sh-amb-linea"></div>
      <div class="sh-amb-txt sh-glitch" data-text="${esc.texto}" style="color:${esc.color}">${esc.texto}</div>
      <div class="sh-amb-sub">${esc.sub||''}</div>
      <div class="sh-amb-linea"></div>
    </div>`;
}

function renderTitulo(el, esc) {
  el.innerHTML = `
    <div class="sh-titulo-wrap">
      <div class="sh-tit-pre">MANDATO · MODO HISTORIA</div>
      <div class="sh-tit-pais sh-glitch" data-text="${esc.pais}" style="color:${esc.color}">${esc.pais}</div>
      <div class="sh-tit-sep" style="background:${esc.color}"></div>
      <div class="sh-tit-cap">${esc.cap}</div>
      <div class="sh-tit-nom">${esc.titcap}</div>
    </div>`;
}

function renderTension(el, esc) {
  el.innerHTML = `<div class="sh-tension" style="--tc:${esc.color}"><p class="sh-tension-txt">${esc.texto.replace(/\n/g,'<br>')}</p></div>`;
}

function renderNarr(el, esc) {
  el.innerHTML = `
    <div class="sh-narr-wrap">
      ${esc.hora ? `<div class="sh-hora">${esc.hora}</div>` : ''}
      <p class="sh-narr-txt" id="sh-txt"></p>
    </div>`;
  tw(H('sh-txt'), esc.txt, 26);
}

function renderClassified(el, esc) {
  const items = esc.datos.map((d,i) =>
    `<div class="sh-cl-item" style="animation-delay:${.3+i*.28}s">
      <span class="sh-cl-ico">${d.ico}</span>
      <span class="sh-cl-label">${d.label}</span>
      <span class="sh-cl-val" style="color:${d.color}">${d.val}</span>
    </div>`).join('');
  el.innerHTML = `
    <div class="sh-classified">
      <div class="sh-cl-stamp">CONFIDENCIAL</div>
      <div class="sh-cl-titulo">${esc.titulo}</div>
      <div class="sh-cl-grid">${items}</div>
      <div class="sh-cl-footer">BCV · CLASIFICADO · ACCESO RESTRINGIDO</div>
    </div>`;
}

function renderDial(el, esc) {
  el.innerHTML = `
    <div class="sh-dial-wrap">
      <div class="sh-char">
        <div class="sh-char-av">${esc.emoji}</div>
        <div>
          <div class="sh-char-nom">${esc.nom}</div>
          <div class="sh-char-rol">${esc.rol}</div>
        </div>
      </div>
      <div class="sh-burbuja"><p class="sh-dial-txt" id="sh-txt"></p></div>
    </div>`;
  tw(H('sh-txt'), esc.txt, 20);
}

function renderVentana(el, esc) {
  el.innerHTML = `
    <div class="sh-ventana-wrap">
      <div class="sh-ventana-luz"></div>
      <p class="sh-ventana-txt" id="sh-txt"></p>
    </div>`;
  tw(H('sh-txt'), esc.txt, 30);
}

function renderSep(el, esc) {
  el.innerHTML = `
    <div class="sh-sep-wrap">
      <div class="sh-sep-dia" style="color:${esc.color}">${esc.dia}</div>
      <div class="sh-sep-tit">${esc.titulo}</div>
      <div class="sh-sep-line" style="background:${esc.color}"></div>
    </div>`;
}

function renderCita(el, esc) {
  const firma = esc.firma ? `<div class="sh-cita-firma">${esc.firma}</div>` : '';
  el.innerHTML = `
    <div class="sh-cita-wrap">
      <div class="sh-cita-comilla" style="color:${esc.color||'#fff'}">❝</div>
      <div class="sh-cita-txt" style="color:${esc.color||'rgba(255,255,255,.85)'}">${esc.txt.replace(/\n/g,'<br>')}</div>
      ${firma}
    </div>`;
}

function renderDec(el, esc, actoId) {
  const ops = esc.ops.map((op,i) =>
    `<button class="sh-op" style="--oc:${op.col}" data-idx="${i}">
      <div class="sh-op-txt">${op.txt}</div>
    </button>`).join('');
  el.innerHTML = `
    <div class="sh-dec-wrap">
      <div class="sh-dec-ctx">${esc.ctx}</div>
      <div class="sh-dec-preg">▶ ${esc.preg}</div>
      <div class="sh-dec-ops" id="sh-ops">${ops}</div>
    </div>`;
  el.querySelectorAll('.sh-op').forEach(btn => {
    btn.onclick = () => elegirCinema(parseInt(btn.dataset.idx), esc, actoId);
  });
}

function elegirCinema(idx, esc, actoId) {
  const op = esc.ops[idx];
  if(op.bonus) Object.entries(op.bonus).forEach(([k,v]) => MH_BONUS[k]=(MH_BONUS[k]||0)+v);
  const ops = H('sh-ops');
  ops.querySelectorAll('.sh-op').forEach((b,i) => {
    b.disabled=true;
    if(i===idx) b.classList.add('sh-op-sel');
  });
  const res = document.createElement('div');
  res.className='sh-resultado'; res.textContent=op.res;
  ops.appendChild(res);
  const nav = document.createElement('div');
  nav.className='sh-nav-row';
  nav.innerHTML=`<button class="sh-next" style="border-color:${op.col};color:${op.col}" onclick="avanzarEscena('${actoId}')">Continuar →</button>`;
  H('sh-content').appendChild(nav);
}

function renderTransicion(el, esc, actoId) {
  el.innerHTML = `
    <div class="sh-trans-wrap">
      <div class="sh-trans-txt" style="color:${esc.color}">${esc.txt.replace(/\n/g,'<br>')}</div>
      <div class="sh-trans-sub">${esc.sub}</div>
      <button class="sh-trans-btn" style="border-color:${esc.color};color:${esc.color}" onclick="terminarActoEIniciarJuego('${actoId}')">
        ▶ Comenzar a jugar
      </button>
    </div>`;
}

function renderFinCard(el, cap) {
  const bonusKeys = Object.keys(MH_BONUS);
  const bonusHTML = bonusKeys.length > 0 ? `
    <div class="sh-fin-bonus">
      <div class="sh-fin-bonus-tit">Tus decisiones modificaron el inicio</div>
      ${bonusKeys.map(k=>`<div class="sh-fin-bonus-row" style="color:${MH_BONUS[k]>0?'#44ff88':'#ff4455'}">${k} ${MH_BONUS[k]>0?'+':''}${MH_BONUS[k]}</div>`).join('')}
    </div>` : '';
  el.innerHTML = `
    <div class="sh-fin-wrap">
      <div class="sh-fin-cap-label">FIN DEL CAPÍTULO ${cap.numero}</div>
      <div class="sh-fin-tit">${cap.titulo}</div>
      ${bonusHTML}
      <button class="sh-fin-btn" onclick="cerrarHistoria()">← Volver al menú</button>
    </div>`;
}

/* ══ NAVEGACIÓN ════════════════════════════════════════════ */
function avanzarEscena(actoId) {
  if(MH_TYPING){ finTW(); return; }
  const cap = HISTORIA[MH_PAIS].capitulos[MH_CAP];
  const escenas = cap.actos[actoId];
  MH_IDX++;
  if(MH_IDX >= escenas.length) return; // No debería ocurrir en escenas normales
  const c = H('sh-content');
  c.classList.add('sh-fade-out');
  setTimeout(() => { c.classList.remove('sh-fade-out'); renderEscena(actoId); }, 250);
}

function saltarActo(actoId) {
  // Ir a la última escena del acto (transición)
  const cap = HISTORIA[MH_PAIS].capitulos[MH_CAP];
  const escenas = cap.actos[actoId];
  MH_IDX = escenas.length - 1;
  const c = H('sh-content');
  c.classList.add('sh-fade-out');
  setTimeout(() => { c.classList.remove('sh-fade-out'); renderEscena(actoId); }, 250);
}

/* ══ TERMINAR ACTO E INICIAR JUEGO ════════════════════════ */
function terminarActoEIniciarJuego(actoId) {
  MODO_HISTORIA_ACTIVO = true;
  cerrarHistoria();
  setTimeout(() => {
    // Primera vez: iniciar partida nueva
    if(actoId === 'acto1') {
      iniciarJuego(MH_PAIS);
      // Aplicar bonus acumulados
      if(Object.keys(MH_BONUS).length > 0) {
        setTimeout(() => {
          Object.entries(MH_BONUS).forEach(([k,v]) => {
            if(G[k] !== undefined) G[k] = Math.max(5, Math.min(100, G[k]+v));
          });
          buildStats();
          addLog('📖 Tus decisiones en la cinemática afectaron el estado inicial.','pos');
          MH_BONUS = {};
        }, 600);
      }
    } else {
      // Acto 2 en adelante: solo resumir el juego
      activo = true;
      addLog('📖 La historia continúa — el mandato sigue.','pos');
      sigEv();
    }
  }, 400);
}

/* ══ CHECKPOINT: llamado desde scripts.js ═════════════════ */
function verificarCheckpointHistoria(dia) {
  if(!MODO_HISTORIA_ACTIVO || !MH_PAIS || MH_CAP === null) return false;
  const cap = HISTORIA[MH_PAIS].capitulos[MH_CAP];
  const cp  = cap.checkpoints.find(c => c.dia === dia);
  if(!cp) return false;
  // Pausar el juego y lanzar el acto correspondiente
  activo = false;
  MH_IDX = 0;
  setTimeout(() => {
    H('sh').style.display = 'flex';
    requestAnimationFrame(() => H('sh').classList.add('sh-vis'));
    lanzarActo(MH_PAIS, MH_CAP, cp.acto);
    // Si es el acto fin, no hay más juego
    if(cp.acto === 'fin') {
      setTimeout(() => { MODO_HISTORIA_ACTIVO = false; }, 500);
    }
  }, 600);
  return true;
}

/* ══ TYPEWRITER ════════════════════════════════════════════ */
function tw(el, txt, spd) {
  if(!el) return;
  MH_TYPING=true; let i=0; el.textContent='';
  function step() {
    if(i<txt.length){ el.textContent+=txt[i++]; MH_TYP_T=setTimeout(step,spd); }
    else MH_TYPING=false;
  }
  step();
}
function finTW() {
  clearTimeout(MH_TYP_T); MH_TYPING=false;
  const el=H('sh-txt');
  if(!el) return;
  const cap=HISTORIA[MH_PAIS].capitulos[MH_CAP];
  // Buscar texto en acto activo
  for(const actoId of Object.keys(cap.actos)) {
    const esc=cap.actos[actoId][MH_IDX];
    if(esc && (esc.txt||esc.texto)) { el.textContent=esc.txt||esc.texto; break; }
  }
}
