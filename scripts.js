/* ════════════════════════════════════════
   MANDATO — Motor completo
════════════════════════════════════════ */
const PAISES={
  venezuela:{n:'Venezuela',f:'🇻🇪',dfc:'dfh',dft:'Difícil',
    s:{popularidad:35,economia:22,estabilidad:32,relaciones:28,corrupcion:72},
    tr:['eco_fragil','petroleo_dep','corrupcion_enraizada']},
  argentina:{n:'Argentina',f:'🇦🇷',dfc:'dfm',dft:'Medio',
    s:{popularidad:50,economia:37,estabilidad:44,relaciones:54,corrupcion:52},
    tr:['ciclo_politico','default_historico','sociedad_activa']},
  eeuu:{n:'Estados Unidos',f:'🇺🇸',dfc:'dfe',dft:'Fácil',
    s:{popularidad:58,economia:80,estabilidad:72,relaciones:76,corrupcion:25},
    tr:['potencia_global','dolar_hegemonia','polarizacion']},
  china:{n:'China',f:'🇨🇳',dfc:'dfm',dft:'Medio',
    s:{popularidad:64,economia:78,estabilidad:80,relaciones:55,corrupcion:42},
    tr:['control_estatal','manufactura_mundial','censura_activa']},
  rusia:{n:'Rusia',f:'🇷🇺',dfc:'dfm',dft:'Medio',
    s:{popularidad:54,economia:57,estabilidad:65,relaciones:30,corrupcion:58},
    tr:['potencia_militar','aislamiento_diplomatico','recursos_naturales']},
  espana:{n:'España',f:'🇪🇸',dfc:'dfe',dft:'Fácil',
    s:{popularidad:57,economia:64,estabilidad:68,relaciones:73,corrupcion:32},
    tr:['democracia_consolidada','turismo_dep','tension_regional']}
};

// Catálogo de traits: modificadores que afectan efectos de decisiones
const TRAITS = {
  // ─ Venezuela ─
  eco_fragil:{
    n:'Economía frágil', i:'📉', col:'#ff5533',
    desc:'Las pérdidas económicas se amplifican. Recuperarse es más costoso.',
    mod:(fx)=>{ if(fx.economia<0) fx.economia=Math.round(fx.economia*1.45); return fx; }
  },
  petroleo_dep:{
    n:'Dependencia del petróleo', i:'🛢️', col:'#ffaa00',
    desc:'Los eventos económicos relacionados con recursos tienen mayor impacto.',
    mod:(fx,evId)=>{ if(['petroleo','litio','energia'].includes(evId)&&fx.economia) fx.economia=Math.round(fx.economia*1.5); return fx; }
  },
  corrupcion_enraizada:{
    n:'Corrupción enraizada', i:'🔓', col:'#bb44ff',
    desc:'Reducir la corrupción cuesta el doble. Aumentarla es gratis.',
    mod:(fx)=>{ if(fx.corrupcion>0) fx.corrupcion=Math.round(fx.corrupcion*1.3); if(fx.corrupcion<0) fx.corrupcion=Math.round(fx.corrupcion*0.6); return fx; }
  },
  // ─ Argentina ─
  ciclo_politico:{
    n:'Ciclo político volátil', i:'🎢', col:'#ffaa00',
    desc:'La popularidad sube y baja con el doble de intensidad.',
    mod:(fx)=>{ if(fx.popularidad) fx.popularidad=Math.round(fx.popularidad*1.4); return fx; }
  },
  default_historico:{
    n:'Historial de default', i:'💸', col:'#ff5533',
    desc:'Las crisis económicas tienen consecuencias internacionales inmediatas.',
    mod:(fx,evId)=>{ if(['fmi','deficit','colapso','crisis_banco'].includes(evId)&&fx.relaciones) fx.relaciones=Math.round(fx.relaciones*1.5); return fx; }
  },
  sociedad_activa:{
    n:'Sociedad civil activa', i:'✊', col:'#00e5a0',
    desc:'Las protestas generan más presión pero también más legitimidad si dialogas.',
    mod:(fx,evId)=>{ if(['protestas','prot_fmi','rebelion'].includes(evId)){ if(fx.popularidad>0) fx.popularidad=Math.round(fx.popularidad*1.3); if(fx.estabilidad<0) fx.estabilidad=Math.round(fx.estabilidad*1.3); } return fx; }
  },
  // ─ EEUU ─
  potencia_global:{
    n:'Potencia global', i:'🌐', col:'#4488ff',
    desc:'Las decisiones internacionales tienen el doble de impacto positivo.',
    mod:(fx,evId)=>{ if(fx.relaciones>0) fx.relaciones=Math.round(fx.relaciones*1.5); return fx; }
  },
  dolar_hegemonia:{
    n:'Hegemonía del dólar', i:'💵', col:'#00e5a0',
    desc:'Las crisis económicas globales afectan menos a tu economía.',
    mod:(fx,evId)=>{ if(['cr_financiero','colapso','fmi'].includes(evId)&&fx.economia<0) fx.economia=Math.round(fx.economia*0.55); return fx; }
  },
  polarizacion:{
    n:'Polarización extrema', i:'⚡', col:'#ff3355',
    desc:'Cada decisión política divide más al electorado.',
    mod:(fx,evId)=>{ if(fx.t==='Política'||['escandalo','prensa','legislativo'].includes(evId)){ if(fx.popularidad>0) fx.popularidad=Math.round(fx.popularidad*0.7); if(fx.popularidad<0) fx.popularidad=Math.round(fx.popularidad*1.3); } return fx; }
  },
  // ─ China ─
  control_estatal:{
    n:'Control estatal total', i:'🏛️', col:'#4488ff',
    desc:'La estabilidad mejora más con medidas de control. La corrupción es más fácil de ocultar.',
    mod:(fx)=>{ if(fx.estabilidad>0) fx.estabilidad=Math.round(fx.estabilidad*1.4); if(fx.corrupcion>0) fx.corrupcion=Math.round(fx.corrupcion*0.7); return fx; }
  },
  manufactura_mundial:{
    n:'Manufactura mundial', i:'🏭', col:'#00e5a0',
    desc:'Los acuerdos económicos y comerciales rinden más.',
    mod:(fx,evId)=>{ if(['tratado','multinacional','energia'].includes(evId)&&fx.economia>0) fx.economia=Math.round(fx.economia*1.4); return fx; }
  },
  censura_activa:{
    n:'Censura activa', i:'📵', col:'#ff5533',
    desc:'Los escándalos de corrupción impactan menos en popularidad, pero las relaciones internacionales sufren más.',
    mod:(fx,evId)=>{ if(['escandalo','prensa','datos','espionaje'].includes(evId)){ if(fx.popularidad<0) fx.popularidad=Math.round(fx.popularidad*0.5); if(fx.relaciones<0) fx.relaciones=Math.round(fx.relaciones*1.4); } return fx; }
  },
  // ─ Rusia ─
  potencia_militar:{
    n:'Potencia militar', i:'⚔️', col:'#ff6644',
    desc:'Las respuestas militares cuestan menos estabilidad y convencen más.',
    mod:(fx,evId)=>{ if(['conflicto','cr_guerra','rebelion','aut_excepcion'].includes(evId)&&fx.estabilidad>0) fx.estabilidad=Math.round(fx.estabilidad*1.5); return fx; }
  },
  aislamiento_diplomatico:{
    n:'Aislamiento diplomático', i:'🚫', col:'#ff3355',
    desc:'Las sanciones y críticas internacionales te afectan menos porque ya estás acostumbrado.',
    mod:(fx,evId)=>{ if(['sanciones','denuncia','denuncia_intl'].includes(evId)&&fx.relaciones<0) fx.relaciones=Math.round(fx.relaciones*0.55); return fx; }
  },
  recursos_naturales:{
    n:'Ricos en recursos', i:'⛏️', col:'#ffd700',
    desc:'Los ingresos por recursos naturales amortiguan las crisis económicas.',
    mod:(fx,evId)=>{ if(fx.economia<0&&['sequia','cr_financiero','colapso'].includes(evId)) fx.economia=Math.round(fx.economia*0.65); return fx; }
  },
  // ─ España ─
  democracia_consolidada:{
    n:'Democracia consolidada', i:'🗳️', col:'#00e5a0',
    desc:'La corrupción es más fácil de combatir y las instituciones resisten mejor.',
    mod:(fx)=>{ if(fx.corrupcion<0) fx.corrupcion=Math.round(fx.corrupcion*1.4); if(fx.estabilidad>0) fx.estabilidad=Math.round(fx.estabilidad*1.2); return fx; }
  },
  turismo_dep:{
    n:'Dependencia del turismo', i:'✈️', col:'#4488ff',
    desc:'Las crisis de imagen y sanitarias dañan más la economía.',
    mod:(fx,evId)=>{ if(['cr_pandemia','pandemia','cr_nuclear','denuncia'].includes(evId)&&fx.economia<0) fx.economia=Math.round(fx.economia*1.4); return fx; }
  },
  tension_regional:{
    n:'Tensión territorial', i:'🗺️', col:'#ffaa00',
    desc:'La estabilidad interna es más volátil ante eventos políticos extremos.',
    mod:(fx,evId)=>{ if(['rebelion','cconst','legislativo'].includes(evId)&&fx.estabilidad<0) fx.estabilidad=Math.round(fx.estabilidad*1.5); return fx; }
  },
};
const PR={
  aut:{n:'Autoritario',i:'⚔️',c:'#ff6644',cls:'pwaut',b:'baut'},
  dip:{n:'Diplomático',i:'🤝',c:'#4488ff',cls:'pwdip',b:'bdip'},
  ref:{n:'Reformista',i:'🌱',c:'#00e5a0',cls:'pwref',b:'bref'},
  cor:{n:'Corrupto',i:'🐍',c:'#bb44ff',cls:'pwcor',b:'bcor'},
};
const LOGROS=[
  {id:'p80',i:'❤️',n:'Amado por el pueblo',c:(e,p)=>e.popularidad>=80},
  {id:'p95',i:'👑',n:'El pueblo te idolatra',c:(e,p)=>e.popularidad>=95},
  {id:'e80',i:'💹',n:'Economía de acero',c:(e,p)=>e.economia>=80},
  {id:'e95',i:'🏦',n:'Potencia económica',c:(e,p)=>e.economia>=95},
  {id:'c20',i:'🧼',n:'Manos limpias',c:(e,p)=>e.corrupcion<=20},
  {id:'c10',i:'💎',n:'Incorruptible',c:(e,p)=>e.corrupcion<=10},
  {id:'r80',i:'🕊️',n:'Maestro diplomático',c:(e,p)=>e.relaciones>=80},
  {id:'es90',i:'🗿',n:'Roca de Gibraltar',c:(e,p)=>e.estabilidad>=90},
  {id:'bal',i:'⚖️',n:'Equilibrista',c:(e,p)=>['popularidad','economia','estabilidad','relaciones'].every(k=>e[k]>=55)},
  {id:'d100',i:'🛡️',n:'100 días en el poder',c:(e,p)=>e.dia>=100},
  {id:'d200',i:'🎖️',n:'Veterano político',c:(e,p)=>e.dia>=200},
  {id:'la',i:'⚔️',n:'El Autoritario',c:(e,p)=>p.aut>=8},
  {id:'ld',i:'🤝',n:'El Diplomático',c:(e,p)=>p.dip>=8},
  {id:'lr',i:'🌱',n:'El Reformista',c:(e,p)=>p.ref>=8},
  {id:'lc',i:'🐍',n:'El Corrupto',c:(e,p)=>p.cor>=8},
  {id:'lp',i:'🎯',n:'Pragmático total',c:(e,p)=>Object.values(p).every(v=>v>=3)},
  {id:'caos30',i:'🔴',n:'Superviviente del Caos',c:(e,p)=>e.dia>=30&&MODO_CAOS},
  {id:'caos100',i:'💀',n:'Leyenda del Caos',c:(e,p)=>e.dia>=100&&MODO_CAOS},
];
// Abreviaciones en eventos: t=tipo,i=icono,p=peso,rp=requiere_pers,o=opciones
// En opciones: tx=texto,fx=efectos,pr=personalidad,fd=efecto_diferido{en,im,ms},db=desbloquea,fl=flag
const EV=[
{id:'inflacion',t:'Economía',i:'📈',p:5,tx:'La inflación mensual superó el 12%. Las familias no pueden comprar alimentos básicos y hay desabastecimiento.',o:[
  {tx:'Controlar precios por decreto',fx:{economia:-4,popularidad:6,estabilidad:3},pr:'aut',fd:{en:4,im:{economia:-8,estabilidad:-5},ms:'El control de precios provocó escasez severa'}},
  {tx:'Subir tasas de interés',fx:{economia:5,popularidad:-8,relaciones:4},pr:'ref',fd:{en:3,im:{economia:6},ms:'Las tasas altas frenaron la inflación gradualmente'}},
  {tx:'Inyectar subsidios masivos',fx:{popularidad:10,economia:-6},fd:{en:5,im:{economia:-12},ms:'El déficit por subsidios desestabilizó las finanzas'},db:'deficit'}]},
{id:'petroleo',t:'Economía',i:'🛢️',p:3,tx:'El precio del petróleo cayó un 28%. El presupuesto pierde su principal fuente de ingresos.',o:[
  {tx:'Recortar gasto público inmediatamente',fx:{economia:4,popularidad:-10,estabilidad:-6},fd:{en:3,im:{economia:5},ms:'Los recortes mantuvieron el equilibrio fiscal'}},
  {tx:'Endeudarse para sostener servicios',fx:{popularidad:7,economia:-3},fd:{en:5,im:{economia:-10,relaciones:-5},ms:'La deuda externa empezó a generar presión'}},
  {tx:'Diversificar la economía de urgencia',fx:{economia:-3,estabilidad:5,relaciones:4},fd:{en:8,im:{economia:10},ms:'La diversificación económica empieza a dar frutos'}}]},
{id:'multinacional',t:'Economía',i:'🏭',p:3,tx:'Una multinacional ofrece invertir $6.000 millones a cambio de concesiones fiscales y acceso a recursos naturales.',o:[
  {tx:'Aceptar todas las condiciones',fx:{economia:14,relaciones:5,corrupcion:8},pr:'cor',fd:{en:6,im:{popularidad:-8},ms:'Comunidades locales denuncian impacto ambiental'},db:'prot_min'},
  {tx:'Negociar términos más equitativos',fx:{economia:7,relaciones:6,estabilidad:3},pr:'dip'},
  {tx:'Rechazar la inversión',fx:{economia:-5,popularidad:7,relaciones:-6},pr:'ref'}]},
{id:'crisis_banco',t:'Economía',i:'🏦',p:2,tx:'El principal banco privado reporta una crisis de liquidez. Hay riesgo de corrida bancaria.',o:[
  {tx:'Rescate con fondos públicos',fx:{economia:10,estabilidad:8,corrupcion:6},pr:'cor',fd:{en:4,im:{popularidad:-6},ms:'El rescate fue criticado por favorecer a élites'}},
  {tx:'Dejar que el mercado actúe',fx:{economia:-14,estabilidad:-12,popularidad:-10},db:'colapso'},
  {tx:'Nacionalizar el banco',fx:{economia:-4,popularidad:8,relaciones:-10},pr:'ref'}]},
{id:'fmi',t:'Economía',i:'📊',p:3,tx:'El FMI exige un ajuste fiscal drástico: eliminar subsidios, recortar pensiones y privatizar empresas estatales.',o:[
  {tx:'Aplicar el ajuste completo',fx:{economia:16,popularidad:-22,estabilidad:-8},pr:'aut',fd:{en:3,im:{popularidad:-8},ms:'Las medidas del FMI generaron ola de protestas'},db:'prot_fmi'},
  {tx:'Negociar un ajuste gradual',fx:{economia:7,popularidad:-8,relaciones:5},pr:'dip'},
  {tx:'Rechazar las condiciones',fx:{economia:-8,relaciones:-12,popularidad:12},pr:'ref'}]},
{id:'deficit',t:'Economía',i:'💸',p:3,tx:'El déficit fiscal alcanzó un nivel crítico. Los mercados desconfían del manejo económico del país.',o:[
  {tx:'Subir impuestos a empresas y ricos',fx:{economia:5,popularidad:6,relaciones:-5}},
  {tx:'Emitir bonos de deuda pública',fx:{economia:8,estabilidad:-5,relaciones:-4},fd:{en:6,im:{economia:-10},ms:'El pago de intereses de la deuda empieza a pesar'}},
  {tx:'Recortar gasto social',fx:{economia:10,popularidad:-15,estabilidad:-8}}]},
{id:'sequia',t:'Economía',i:'🌾',p:3,tx:'Una sequía histórica destruyó el 38% de la cosecha nacional. El abastecimiento de alimentos está en riesgo.',o:[
  {tx:'Importar alimentos con subsidio',fx:{popularidad:10,economia:-9,estabilidad:6}},
  {tx:'Activar reservas estratégicas',fx:{estabilidad:8,economia:-4,popularidad:6}},
  {tx:'Dejar que el mercado regule',fx:{economia:4,popularidad:-14,estabilidad:-9}}]},
{id:'colapso',t:'Economía',i:'📉',p:1,tx:'La economía está en caída libre. La moneda perdió el 45% de su valor en una semana. Es la peor crisis en décadas.',o:[
  {tx:'Solicitar rescate internacional urgente',fx:{economia:12,relaciones:10,popularidad:-10}},
  {tx:'Aplicar control de capitales',fx:{economia:4,estabilidad:-6,relaciones:-12},fd:{en:4,im:{economia:-6},ms:'El control de capitales profundizó la recesión'}}]},
{id:'energia',t:'Economía',i:'☀️',p:3,tx:'Una empresa propone construir la mayor planta solar del país. Requiere inversión estatal inicial significativa.',o:[
  {tx:'Inversión estatal total',fx:{economia:-8,estabilidad:8,relaciones:6},pr:'ref',fd:{en:7,im:{economia:12},ms:'La planta solar genera ingresos y reduce costos energéticos'}},
  {tx:'Alianza público-privada al 50%',fx:{economia:-4,relaciones:5,estabilidad:4}},
  {tx:'Rechazar por costos inmediatos',fx:{economia:3,estabilidad:-3,relaciones:-4}}]},
{id:'pension',t:'Economía',i:'👴',p:3,tx:'El sistema de pensiones está quebrado. Sin reforma, colapsará en 3 años.',o:[
  {tx:'Reforma estructural completa',fx:{economia:12,popularidad:-16,estabilidad:-5},pr:'ref',fd:{en:8,im:{economia:8},ms:'La reforma de pensiones estabilizó las finanzas a largo plazo'}},
  {tx:'Aumentar cotizaciones laborales',fx:{economia:6,popularidad:-10,relaciones:-4}},
  {tx:'Posponer la reforma un año más',fx:{popularidad:6,economia:-8},fd:{en:4,im:{economia:-10},ms:'La deuda del sistema de pensiones se aceleró sin reforma'}}]},
{id:'protestas',t:'Social',i:'✊',p:5,tx:'Decenas de miles marchan en la capital exigiendo mejoras salariales. La manifestación bloquea el centro económico.',o:[
  {tx:'Dialogar con líderes del movimiento',fx:{popularidad:12,estabilidad:6,corrupcion:-3},pr:'dip'},
  {tx:'Dispersar con fuerzas de seguridad',fx:{estabilidad:5,popularidad:-16,relaciones:-8},pr:'aut',fl:'reprimio',db:'denuncia'},
  {tx:'Ignorar las protestas',fx:{popularidad:-12,estabilidad:-10,economia:-3}}]},
{id:'huelga',t:'Social',i:'👨‍⚕️',p:4,tx:'Los médicos del sector público inician huelga indefinida. Los hospitales operan al 30% de capacidad.',o:[
  {tx:'Atender demandas con aumento salarial',fx:{popularidad:13,economia:-9,estabilidad:7}},
  {tx:'Negociar un aumento parcial',fx:{popularidad:5,economia:-4,estabilidad:4}},
  {tx:'Declarar la huelga ilegal',fx:{popularidad:-16,estabilidad:-8,corrupcion:7},pr:'aut',db:'ddhh'}]},
{id:'educacion',t:'Social',i:'📚',p:4,tx:'El 42% de los jóvenes abandonó el sistema educativo. Sin intervención, la crisis afectará el futuro económico.',o:[
  {tx:'Inversión pública en educación +20%',fx:{popularidad:10,economia:-8,estabilidad:8},pr:'ref'},
  {tx:'Atraer inversión privada educativa',fx:{economia:5,popularidad:-4,estabilidad:4}},
  {tx:'Posponer la reforma',fx:{popularidad:-6,estabilidad:-7,corrupcion:4}}]},
{id:'prot_min',t:'Social',i:'⛏️',p:3,tx:'Comunidades indígenas bloquean carreteras denunciando contaminación por minería aprobada por tu gobierno.',o:[
  {tx:'Suspender operaciones y dialogar',fx:{popularidad:9,economia:-7,relaciones:5},pr:'dip'},
  {tx:'Negociar compensaciones económicas',fx:{popularidad:4,economia:-4,estabilidad:5}},
  {tx:'Desalojar bloqueos con fuerza',fx:{estabilidad:4,popularidad:-14,relaciones:-8,corrupcion:6},pr:'aut',db:'denuncia'}]},
{id:'prot_fmi',t:'Social',i:'🔥',p:3,tx:'Las medidas de austeridad desataron protestas violentas en 12 ciudades. La situación es crítica.',o:[
  {tx:'Revertir parte de las medidas',fx:{popularidad:14,economia:-8,relaciones:-6}},
  {tx:'Mantener las medidas y pedir calma',fx:{popularidad:-10,estabilidad:-8,economia:5}},
  {tx:'Decretar estado de emergencia',fx:{estabilidad:8,popularidad:-16,corrupcion:8,relaciones:-10},pr:'aut'}]},
{id:'pandemia',t:'Social',i:'🦠',p:2,tx:'Un brote de enfermedad infecciosa se expande por el país. Los hospitales están desbordados y hay pánico.',o:[
  {tx:'Cuarentena estricta con apoyo económico',fx:{estabilidad:10,economia:-12,popularidad:6}},
  {tx:'Cuarentena parcial por sectores',fx:{estabilidad:5,economia:-6,popularidad:3}},
  {tx:'Priorizar la economía sobre la salud',fx:{economia:4,popularidad:-14,estabilidad:-10},pr:'aut',fd:{en:3,im:{popularidad:-8,estabilidad:-5},ms:'La crisis sanitaria sin control provocó más muertes y caos'}}]},
{id:'ddhh',t:'Social',i:'⚖️',p:2,tx:'Organizaciones de derechos humanos presentan un informe demoledor sobre abusos durante protestas recientes.',o:[
  {tx:'Reconocer los abusos y abrir investigación',fx:{corrupcion:-12,popularidad:8,relaciones:10},pr:'ref'},
  {tx:'Negar las acusaciones públicamente',fx:{corrupcion:8,popularidad:-8,relaciones:-12},pr:'aut',db:'sanciones'},
  {tx:'Crear comisión independiente',fx:{corrupcion:-5,relaciones:6,popularidad:4},pr:'dip'}]},
{id:'policia',t:'Social',i:'🚔',p:4,tx:'Policías denuncian corrupción interna masiva. Algunos amenazan con revelar operaciones encubiertas.',o:[
  {tx:'Depurar la policía con investigación civil',fx:{corrupcion:-14,estabilidad:6,popularidad:10},pr:'ref'},
  {tx:'Dejar que la institución se autorregule',fx:{corrupcion:8,estabilidad:4,popularidad:-6},pr:'aut'},
  {tx:'Sobornar a los denunciantes',fx:{corrupcion:18,estabilidad:8,popularidad:-12},pr:'cor'}]},
{id:'dengue',t:'Social',i:'🦟',p:3,tx:'Un brote de dengue afecta a 200.000 personas. Los hospitales desbordados señalan al gobierno por falta de prevención.',o:[
  {tx:'Plan de emergencia sanitaria nacional',fx:{popularidad:12,economia:-10,estabilidad:8}},
  {tx:'Campaña de fumigación masiva',fx:{estabilidad:6,economia:-5,popularidad:6}},
  {tx:'Minimizar públicamente el brote',fx:{popularidad:-16,estabilidad:-8,relaciones:-6},pr:'aut'}]},
{id:'universidad',t:'Social',i:'🎓',p:3,tx:'Los rectores declaran emergencia académica: presupuesto insuficiente, fuga de cerebros y huelgas estudiantiles.',o:[
  {tx:'Triplicar el presupuesto universitario',fx:{popularidad:14,economia:-10,estabilidad:6},pr:'ref'},
  {tx:'Reforma con autonomía y austeridad',fx:{estabilidad:5,economia:-4,popularidad:5}},
  {tx:'Ignorar hasta que pase la presión',fx:{popularidad:-10,estabilidad:-8,corrupcion:4}}]},
{id:'rebelion',t:'Social',i:'🔥',p:2,tx:'Una región históricamente marginada declara autonomía unilateral y moviliza a 500.000 personas.',o:[
  {tx:'Intervención militar para restablecer el orden',fx:{estabilidad:10,popularidad:-18,relaciones:-14},pr:'aut',db:'denuncia'},
  {tx:'Negociar autonomía constitucional',fx:{popularidad:10,estabilidad:5,economia:-5},pr:'dip'},
  {tx:'Proponer referéndum de autonomía',fx:{popularidad:8,estabilidad:-6,relaciones:6},pr:'ref'}]},
{id:'escandalo',t:'Política',i:'💼',p:4,tx:'Tres ministros de tu gabinete son señalados en un escándalo de contratos irregulares. La prensa lo cubre ampliamente.',o:[
  {tx:'Destituir y entregar a la justicia',fx:{corrupcion:-16,popularidad:12,estabilidad:-4},pr:'ref'},
  {tx:'Abrir investigación interna',fx:{corrupcion:-6,popularidad:4,estabilidad:3},pr:'dip'},
  {tx:'Defender a los implicados públicamente',fx:{corrupcion:16,popularidad:-20,relaciones:-8},pr:'cor',db:'ddhh'}]},
{id:'prensa',t:'Política',i:'📰',p:4,tx:'Un influyente medio publica una investigación que expone contratos irregulares en obras de infraestructura.',o:[
  {tx:'Garantizar libertad de prensa',fx:{corrupcion:-10,popularidad:13,relaciones:8},pr:'ref'},
  {tx:'Demandar al medio por difamación',fx:{estabilidad:3,popularidad:-12,relaciones:-8},pr:'aut'},
  {tx:'Presionar para retirar la publicación',fx:{corrupcion:14,popularidad:-18,relaciones:-12},pr:'cor',db:'denuncia'}]},
{id:'legislativo',t:'Política',i:'🏛️',p:3,tx:'El parlamento rechaza tu reforma económica clave. La oposición exige elecciones anticipadas.',o:[
  {tx:'Convocar referéndum ciudadano',fx:{popularidad:9,estabilidad:-8,relaciones:4},pr:'ref'},
  {tx:'Negociar una versión reformada',fx:{estabilidad:8,corrupcion:5,popularidad:3},pr:'dip'},
  {tx:'Gobernar por decreto ejecutivo',fx:{estabilidad:-12,corrupcion:10,popularidad:-9},pr:'aut',db:'cconst'}]},
{id:'espionaje',t:'Política',i:'🕵️',p:2,tx:'Tu jefe de inteligencia ofrece acceso a las comunicaciones privadas del partido opositor. La fuente es ilegal.',o:[
  {tx:'Rechazar y denunciar internamente',fx:{corrupcion:-14,popularidad:8,estabilidad:5},pr:'ref'},
  {tx:'Rechazar pero no denunciar',fx:{corrupcion:-4,estabilidad:3}},
  {tx:'Aceptar la información',fx:{corrupcion:18,popularidad:5,estabilidad:-4},pr:'cor',fd:{en:4,im:{corrupcion:8,popularidad:-14},ms:'El espionaje fue filtrado a la prensa y generó escándalo'}}]},
{id:'cconst',t:'Política',i:'📜',p:1,tx:'El tribunal constitucional declara inconstitucionales tus últimas medidas ejecutivas. Se abre una grave crisis institucional.',o:[
  {tx:'Acatar el fallo y rectificar',fx:{estabilidad:12,popularidad:6,corrupcion:-8},pr:'ref'},
  {tx:'Desafiar el fallo públicamente',fx:{estabilidad:-16,corrupcion:12,relaciones:-14},pr:'aut',db:'sanciones'}]},
{id:'elecciones',t:'Política',i:'🗳️',p:4,tx:'Las elecciones regionales se acercan. Un aliado clave amenaza con salir de la coalición si no obtiene más cargos.',o:[
  {tx:'Ceder ministerios al aliado',fx:{estabilidad:9,corrupcion:8,popularidad:-4},pr:'cor'},
  {tx:'Buscar nuevos socios políticos',fx:{estabilidad:4,popularidad:5,relaciones:4},pr:'dip'},
  {tx:'Afrontar las elecciones sin coalición',fx:{estabilidad:-10,popularidad:10,corrupcion:-5},pr:'ref'}]},
{id:'datos',t:'Política',i:'📱',p:3,tx:'Una empresa tecnológica ofrece pagar millones por acceder a los datos personales de los ciudadanos en bases estatales.',o:[
  {tx:'Vender el acceso sin informar al público',fx:{economia:14,corrupcion:16,estabilidad:-5},pr:'cor',fd:{en:4,im:{popularidad:-18,relaciones:-10},ms:'Se filtró la venta de datos ciudadanos a empresa extranjera'}},
  {tx:'Rechazar y legislar protección de datos',fx:{corrupcion:-10,popularidad:12,relaciones:8},pr:'ref'},
  {tx:'Negociar acceso anonimizado',fx:{economia:6,corrupcion:4,relaciones:4}}]},
{id:'tratado',t:'Internacional',i:'🤝',p:4,tx:'Una potencia económica propone un tratado de libre comercio. Beneficiaría exportaciones pero amenazaría la industria local.',o:[
  {tx:'Firmar el tratado completo',fx:{economia:12,relaciones:14,popularidad:-8},pr:'dip'},
  {tx:'Negociar cláusulas de protección',fx:{economia:6,relaciones:7,estabilidad:3},pr:'ref'},
  {tx:'Rechazar el tratado',fx:{economia:-8,relaciones:-13,popularidad:7},pr:'aut'}]},
{id:'sanciones',t:'Internacional',i:'🚫',p:3,tx:'Un bloque de países impone sanciones económicas alegando violaciones a derechos humanos y democracia.',o:[
  {tx:'Reformar y negociar levantamiento',fx:{economia:8,relaciones:18,popularidad:-5},pr:'ref'},
  {tx:'Buscar aliados alternativos',fx:{economia:-4,relaciones:-4,estabilidad:4}},
  {tx:'Responder con contra-sanciones',fx:{economia:-13,relaciones:-18,popularidad:5},pr:'aut',fd:{en:4,im:{economia:-8},ms:'Las contra-sanciones profundizaron el aislamiento económico'}}]},
{id:'denuncia',t:'Internacional',i:'🌐',p:3,tx:'El Consejo de DDHH de la ONU votó condenar al país por represión de protestas. Es una humillación diplomática.',o:[
  {tx:'Aceptar visita de observadores',fx:{relaciones:14,corrupcion:-8,popularidad:5},pr:'ref'},
  {tx:'Rechazar la condena como injerencia',fx:{relaciones:-16,estabilidad:-5,popularidad:5},pr:'aut'},
  {tx:'Comprometerse a reformas graduales',fx:{relaciones:6,corrupcion:-4,estabilidad:4},pr:'dip'}]},
{id:'conflicto',t:'Internacional',i:'⚔️',p:2,tx:'Un conflicto armado en la región amenaza con extenderse. Aliados te piden unirte a una coalición militar.',o:[
  {tx:'Unirse a la coalición militar',fx:{relaciones:13,estabilidad:-10,economia:-8},pr:'aut'},
  {tx:'Neutralidad y mediación',fx:{relaciones:6,popularidad:8,estabilidad:5},pr:'dip'},
  {tx:'Rechazar toda participación',fx:{relaciones:-10,popularidad:5,estabilidad:4}}]},
{id:'migracion',t:'Internacional',i:'🛂',p:3,tx:'Una crisis humanitaria lleva a miles de refugiados a cruzar tu frontera semanalmente.',o:[
  {tx:'Política de acogida abierta',fx:{relaciones:14,popularidad:-8,economia:-6},pr:'dip'},
  {tx:'Admisión controlada y regulada',fx:{relaciones:5,estabilidad:5,economia:-3}},
  {tx:'Cierre de fronteras',fx:{relaciones:-18,popularidad:4,estabilidad:-8},pr:'aut'}]},
{id:'ayuda_hum',t:'Internacional',i:'🤜',p:3,tx:'Un país vecino fue devastado por un terremoto. Pide asistencia urgente. El mundo observa tu respuesta.',o:[
  {tx:'Enviar ayuda humanitaria generosa',fx:{relaciones:18,popularidad:8,economia:-8},pr:'dip'},
  {tx:'Contribución simbólica',fx:{relaciones:5,popularidad:3,economia:-2}},
  {tx:'Declinar por prioridades internas',fx:{relaciones:-14,popularidad:-5,economia:3}}]},
{id:'clima',t:'Internacional',i:'🌍',p:3,tx:'Una cumbre climática global te invita a firmar compromisos de reducción de emisiones que limitarían industrias clave.',o:[
  {tx:'Firmar compromisos ambiciosos',fx:{relaciones:16,popularidad:8,economia:-8},pr:'dip'},
  {tx:'Firmar con cláusulas de excepción',fx:{relaciones:6,economia:-3,popularidad:4}},
  {tx:'No firmar el acuerdo',fx:{relaciones:-12,popularidad:5,economia:5},pr:'aut'}]},
{id:'ciber',t:'Inesperado',i:'💻',p:2,tx:'Un sofisticado ciberataque paralizó los sistemas financieros y de salud del país durante 48 horas.',o:[
  {tx:'Invertir en ciberseguridad estatal',fx:{estabilidad:8,economia:-6,relaciones:4}},
  {tx:'Acusar públicamente a un país rival',fx:{relaciones:-14,estabilidad:4,popularidad:5},pr:'aut'},
  {tx:'Minimizar y no divulgar',fx:{corrupcion:8,estabilidad:-6,popularidad:-5},pr:'cor'}]},
{id:'litio',t:'Inesperado',i:'⛏️',p:2,tx:'Geólogos descubren uno de los mayores yacimientos de litio del mundo en territorio nacional.',o:[
  {tx:'Explotación estatal soberana',fx:{economia:8,relaciones:-5,popularidad:10},pr:'ref',fd:{en:6,im:{economia:15},ms:'La explotación de litio genera ingresos significativos'}},
  {tx:'Concesión a empresas extranjeras',fx:{economia:16,relaciones:10,popularidad:-8,corrupcion:6},pr:'cor'},
  {tx:'Moratoria y estudio del caso',fx:{estabilidad:5,relaciones:-4,popularidad:5},pr:'dip'}]},
{id:'terremoto',t:'Inesperado',i:'🏗️',p:2,tx:'Un terremoto de 6.9 grados destruye parcialmente dos ciudades importantes. La respuesta del gobierno es crucial.',o:[
  {tx:'Movilización masiva de recursos',fx:{popularidad:18,economia:-14,estabilidad:6}},
  {tx:'Solicitar ayuda internacional',fx:{relaciones:12,popularidad:9,economia:-5},pr:'dip'},
  {tx:'Respuesta limitada por presupuesto',fx:{popularidad:-20,estabilidad:-14,economia:3}}]},
{id:'vacuna',t:'Inesperado',i:'🔬',p:2,tx:'Una universidad pública descubrió una vacuna contra una enfermedad crónica que afecta a millones en el mundo.',o:[
  {tx:'Patentar y licenciar a nivel global',fx:{economia:16,relaciones:12,popularidad:10},pr:'ref'},
  {tx:'Donar la patente como bien público',fx:{relaciones:20,popularidad:16,economia:-5},pr:'dip'},
  {tx:'Vender exclusividad a farmacéutica',fx:{economia:20,corrupcion:10,relaciones:-8},pr:'cor'}]},
// ─── PERSONALIDAD ───
{id:'aut_medios',t:'Política',i:'📡',p:3,rp:'aut',tx:'Tu equipo propone crear una agencia estatal que supervise el "contenido dañino" en medios y redes sociales.',o:[
  {tx:'Crear la agencia con plenos poderes',fx:{estabilidad:12,popularidad:-8,relaciones:-10,corrupcion:6},pr:'aut'},
  {tx:'Crear la agencia con límites legales',fx:{estabilidad:6,corrupcion:3,popularidad:-4},pr:'aut'},
  {tx:'Rechazar la propuesta',fx:{popularidad:8,relaciones:6,estabilidad:-4},pr:'ref'}]},
{id:'aut_excepcion',t:'Política',i:'🚨',p:2,rp:'aut',tx:'El orden público se deteriora en tres regiones. El ministro propone decretar estado de excepción por 90 días.',o:[
  {tx:'Declarar estado de excepción total',fx:{estabilidad:18,popularidad:-14,relaciones:-12,corrupcion:5},pr:'aut'},
  {tx:'Medidas de seguridad reforzadas',fx:{estabilidad:8,popularidad:-4},pr:'aut'},
  {tx:'Privilegiar el diálogo ciudadano',fx:{estabilidad:4,popularidad:8,relaciones:5},pr:'dip'}]},
{id:'aut_reeleccion',t:'Política',i:'🏆',p:2,rp:'aut',tx:'Tus asesores proponen modificar la constitución para eliminar el límite de mandatos y gobernar indefinidamente.',o:[
  {tx:'Impulsar la reforma constitucional',fx:{estabilidad:-10,popularidad:5,corrupcion:14,relaciones:-12},pr:'aut',fd:{en:5,im:{relaciones:-10},ms:'La comunidad internacional condena la reforma constitucional'}},
  {tx:'Rechazar públicamente la propuesta',fx:{popularidad:12,relaciones:10,corrupcion:-8},pr:'ref'}]},
{id:'dip_cumbre',t:'Internacional',i:'🌐',p:3,rp:'dip',tx:'Propones organizar una cumbre regional histórica para resolver conflictos limítrofes entre cinco países.',o:[
  {tx:'Liderar la cumbre personalmente',fx:{relaciones:20,popularidad:10,economia:-6,estabilidad:5},pr:'dip'},
  {tx:'Organizar pero delegar la presidencia',fx:{relaciones:10,popularidad:4},pr:'dip'},
  {tx:'Solo proponer sin comprometerse',fx:{relaciones:4,popularidad:3}}]},
{id:'dip_mediacion',t:'Internacional',i:'🕊️',p:3,rp:'dip',tx:'Dos países en conflicto te piden actuar como mediador neutral. Requiere tiempo y recursos significativos.',o:[
  {tx:'Aceptar la mediación de forma activa',fx:{relaciones:18,popularidad:8,economia:-5},pr:'dip',fd:{en:6,im:{relaciones:12},ms:'La mediación logró un acuerdo de paz provisional'}},
  {tx:'Participar de forma consultiva',fx:{relaciones:8,economia:-2},pr:'dip'},
  {tx:'Declinar y priorizar asuntos internos',fx:{relaciones:-5,popularidad:4}}]},
{id:'dip_alianza',t:'Internacional',i:'🤝',p:3,rp:'dip',tx:'Una alianza estratégica regional ofrece membresía plena: ceder soberanía en política exterior a cambio de protección.',o:[
  {tx:'Unirse con plena adhesión',fx:{relaciones:22,economia:10,estabilidad:6,popularidad:-8},pr:'dip'},
  {tx:'Membresía parcial negociada',fx:{relaciones:12,economia:5},pr:'dip'},
  {tx:'Rechazar por soberanía nacional',fx:{relaciones:-8,popularidad:10},pr:'aut'}]},
{id:'ref_transp',t:'Política',i:'🔍',p:3,rp:'ref',tx:'Tu gobierno propone una ley de transparencia total: todos los contratos públicos y salarios de funcionarios serán públicos.',o:[
  {tx:'Aprobar sin excepciones',fx:{corrupcion:-20,popularidad:14,relaciones:8,estabilidad:-4},pr:'ref'},
  {tx:'Aprobar con excepciones de seguridad',fx:{corrupcion:-10,popularidad:8,relaciones:4},pr:'ref'},
  {tx:'Archivar la propuesta',fx:{corrupcion:8,popularidad:-10},pr:'cor'}]},
{id:'ref_justicia',t:'Política',i:'⚖️',p:3,rp:'ref',tx:'Presentas una reforma judicial que haría los tribunales completamente independientes del poder ejecutivo.',o:[
  {tx:'Impulsar la reforma completa',fx:{corrupcion:-18,estabilidad:10,popularidad:12,relaciones:8},pr:'ref',fd:{en:4,im:{estabilidad:6},ms:'Los tribunales independientes empiezan a fallar sin presión política'}},
  {tx:'Reforma parcial manteniendo algo de influencia',fx:{corrupcion:-7,estabilidad:5,popularidad:5}},
  {tx:'Retirar la reforma por resistencia',fx:{corrupcion:6,popularidad:-8,relaciones:-5},pr:'cor'}]},
{id:'ref_anticor',t:'Política',i:'🧹',p:3,rp:'ref',tx:'Una fiscalía quiere investigar contratos millonarios de los últimos 10 años. Algunos implicados son aliados tuyos.',o:[
  {tx:'Garantizar plena independencia fiscal',fx:{corrupcion:-22,popularidad:16,estabilidad:-6},pr:'ref'},
  {tx:'Apoyar sin interferir en aliados',fx:{corrupcion:-8,popularidad:6,estabilidad:3}},
  {tx:'Limitar el alcance de la investigación',fx:{corrupcion:12,popularidad:-12,relaciones:-8},pr:'cor'}]},
{id:'cor_contrato',t:'Política',i:'📋',p:3,rp:'cor',tx:'Un empresario cercano ofrece financiar tu campaña a cambio de contratos de infraestructura sin licitación pública.',o:[
  {tx:'Aceptar el acuerdo privado',fx:{economia:8,corrupcion:18,popularidad:-5},pr:'cor',fd:{en:5,im:{corrupcion:8,popularidad:-14},ms:'Los contratos irregulares salieron a la luz pública'}},
  {tx:'Aceptar con licitación simulada',fx:{economia:5,corrupcion:10,estabilidad:3},pr:'cor'},
  {tx:'Rechazar y mantener licitación real',fx:{corrupcion:-12,popularidad:8,estabilidad:5},pr:'ref'}]},
{id:'cor_cargos',t:'Política',i:'🕴️',p:3,rp:'cor',tx:'Puedes asignar cargos clave del Estado a personas que pagarán por ellos. Nadie lo sabrá a corto plazo.',o:[
  {tx:'Vender los cargos al mejor postor',fx:{corrupcion:20,economia:5,estabilidad:-8},pr:'cor',fd:{en:6,im:{estabilidad:-12,popularidad:-10},ms:'El tráfico de cargos colapsó la eficiencia del Estado'}},
  {tx:'Asignar por cuotas políticas',fx:{corrupcion:8,estabilidad:-3},pr:'cor'},
  {tx:'Asignar por mérito y concurso',fx:{corrupcion:-10,estabilidad:8,popularidad:8},pr:'ref'}]},
{id:'cor_fondos',t:'Política',i:'💰',p:2,rp:'cor',tx:'Tu tesorero puede "redirigir" fondos públicos de proyectos sociales a cuentas opacas antes de la auditoría.',o:[
  {tx:'Autorizar la operación',fx:{corrupcion:24,economia:10,popularidad:-8},pr:'cor',fd:{en:4,im:{corrupcion:10,relaciones:-15,popularidad:-16},ms:'La auditoría internacional destapó el desvío de fondos'},db:'sanciones'},
  {tx:'Rechazar y destituir al tesorero',fx:{corrupcion:-16,popularidad:10,estabilidad:5},pr:'ref'}]},
// ─── EVENTOS EXCLUSIVOS MODO CAOS ────────────────────────────────────────
{id:'motin',t:'Social',i:'⛓️',p:4,chaos:true,tx:'15 cárceles del país están en manos de los presos. Hay rehenes, muertos y los medios internacionales lo transmiten en vivo.',o:[
  {tx:'Asalto militar total sin negociación',fx:{estabilidad:18,popularidad:-22,relaciones:-18,corrupcion:10},pr:'aut',fd:{en:3,im:{popularidad:-14,relaciones:-12},ms:'Las imágenes del asalto generan condena internacional masiva'}},
  {tx:'Negociar con líderes presos: concesiones totales',fx:{popularidad:8,estabilidad:-18,corrupcion:14,relaciones:-8},fd:{en:4,im:{estabilidad:-10},ms:'Las concesiones generaron oleada de nuevos motines en cárceles menores'}},
  {tx:'Cortar agua y luz: rendición por hambre',fx:{estabilidad:6,relaciones:-22,popularidad:-8,corrupcion:6},pr:'aut',fd:{en:2,im:{estabilidad:8,popularidad:-16},ms:'Muertos por deshidratación: la ONU abre investigación formal'}}]},
{id:'traicion',t:'Política',i:'🗡️',p:3,chaos:true,tx:'Tu vicepresidente y cuatro ministros anuncian en cadena nacional que se suman a la oposición. Te acusan de corrupción sistémica.',o:[
  {tx:'Destituirlos en tiempo real y arrestarlos',fx:{estabilidad:8,popularidad:-20,relaciones:-16,corrupcion:8},pr:'aut',fd:{en:3,im:{relaciones:-14,popularidad:-8},ms:'El arresto de funcionarios electos desata crisis constitucional'}},
  {tx:'Convocar rueda de prensa y contraatacar con pruebas',fx:{popularidad:12,corrupcion:-8,estabilidad:-6},pr:'ref',fd:{en:4,im:{popularidad:8},ms:'El duelo mediático galvaniza a tus simpatizantes'}},
  {tx:'Negociar en silencio: cederles ministerios de nuevo',fx:{estabilidad:10,corrupcion:22,popularidad:-10},pr:'cor',fd:{en:5,im:{corrupcion:12,popularidad:-18},ms:'La negociación secreta fue filtrada: escándalo de proporciones históricas'}}]},
{id:'hiperinflacion',t:'Economía',i:'💸',p:2,chaos:true,tx:'La moneda perdió el 87% de su valor en 72 horas. Las tiendas cerraron. La gente quema billetes en la calle. Es el colapso total.',o:[
  {tx:'Dolarización de emergencia: adoptar otra moneda',fx:{economia:-5,estabilidad:12,relaciones:10,popularidad:-24},pr:'dip',fd:{en:6,im:{economia:18},ms:'La dolarización estabiliza los precios pero destruye soberanía monetaria'}},
  {tx:'Control total de precios y racionamiento',fx:{economia:-14,estabilidad:-8,popularidad:6,corrupcion:14},pr:'aut',fd:{en:4,im:{economia:-12,corrupcion:8},ms:'El mercado negro florece: los controles agravan la escasez'}},
  {tx:'Imprimir dinero para pagar deudas inmediatas',fx:{economia:-22,popularidad:-16,estabilidad:-18},fd:{en:3,im:{economia:-16,estabilidad:-12},ms:'La hiperinflación se convierte en colapso monetario definitivo'}}]},
{id:'magnicidio',t:'Política',i:'🎯',p:2,chaos:true,tx:'Atentado fallido contra tu vida. Un francotirador hirió a dos guardaespaldas. Los servicios de inteligencia señalan a dos grupos distintos.',o:[
  {tx:'Declarar estado de sitio y suspender garantías',fx:{estabilidad:16,popularidad:-14,relaciones:-20,corrupcion:8},pr:'aut',fd:{en:5,im:{estabilidad:-8,relaciones:-14},ms:'La suspensión de garantías atrae sanciones de bloque regional'}},
  {tx:'Aparecer públicamente al día siguiente: desafío simbólico',fx:{popularidad:22,estabilidad:8,relaciones:6},fd:{en:3,im:{popularidad:10},ms:'El gesto de valentía dispara tu aprobación a niveles históricos'}},
  {tx:'Investigación discreta: no revelar nada al público',fx:{corrupcion:10,estabilidad:5,popularidad:-8},fd:{en:6,im:{corrupcion:14,popularidad:-18},ms:'La verdad sobre los autores sale a la luz: eres acusado de encubrimiento'}}]},
{id:'quiebra_estado',t:'Economía',i:'🏚️',p:2,chaos:true,tx:'El Estado no tiene fondos para pagar salarios de maestros, médicos ni militares esta semana. El Tesoro está vacío.',o:[
  {tx:'Imprimir dinero sin respaldo',fx:{economia:-18,popularidad:4,estabilidad:-14},fd:{en:3,im:{economia:-20},ms:'La emisión masiva dispara la inflación a niveles de crisis'}},
  {tx:'Préstamo de emergencia de fondo soberano extranjero',fx:{economia:10,relaciones:-14,popularidad:-6,corrupcion:12},fd:{en:6,im:{economia:8},ms:'Los términos del préstamo trascienden: el país cedió activos estratégicos'}},
  {tx:'Confiscar reservas privadas de bancos',fx:{economia:14,estabilidad:-16,relaciones:-20,popularidad:-10},pr:'aut',fd:{en:4,im:{relaciones:-16,economia:-8},ms:'Los bancos cierran en masa: colapso del sistema financiero privado'}}]},
{id:'rebelion_militar',t:'Política',i:'🎖️',p:2,chaos:true,tx:'Generales de alto rango emiten un comunicado exigiendo tu renuncia en 48 horas. El ejército está dividido.',o:[
  {tx:'Negociar con los generales: cederles control de ministerios',fx:{estabilidad:10,corrupcion:24,popularidad:-16,relaciones:-12},pr:'cor',fd:{en:5,im:{corrupcion:14,estabilidad:-12},ms:'Los militares en el gobierno generan denuncias de militarización del Estado'}},
  {tx:'Movilizar a tu guardia leal y arrestar a los rebeldes',fx:{estabilidad:14,popularidad:8,relaciones:-18,corrupcion:10},pr:'aut',fd:{en:4,im:{estabilidad:-8,relaciones:-10},ms:'El juicio a los generales divide al ejército en facciones irreconciliables'}},
  {tx:'Convocar referéndum: que el pueblo decida',fx:{popularidad:18,estabilidad:-14,relaciones:10},pr:'ref',fd:{en:5,im:{popularidad:12,estabilidad:-6},ms:'El referéndum te salva pero debilita la cadena de mando militar'}}]},
{id:'pandemia_caos',t:'Social',i:'☠️',p:2,chaos:true,tx:'Un brote de patógeno desconocido con mortalidad del 12% ya tiene 80.000 casos. Los hospitales colapsaron. No hay vacuna. El pánico es total.',o:[
  {tx:'Cierre total hermético: fronteras, ciudades, todo',fx:{economia:-22,estabilidad:14,popularidad:8},fd:{en:8,im:{economia:-12},ms:'El confinamiento extremo frenó el contagio pero destruyó la economía'}},
  {tx:'Quarentena por zonas: proteger la economía parcialmente',fx:{economia:-10,estabilidad:6,popularidad:-4},fd:{en:5,im:{popularidad:12,estabilidad:8},ms:'La gestión por zonas logró controlar la curva sin colapso total'}},
  {tx:'Negar la gravedad públicamente para evitar el pánico',fx:{popularidad:-24,estabilidad:-20,relaciones:-16,corrupcion:12},pr:'aut',fd:{en:4,im:{popularidad:-18,estabilidad:-14},ms:'La mentira oficial se derrumba: cifras reales exponen la catástrofe sanitaria'}}]},
];
const IDX={};EV.forEach(e=>IDX[e.id]=e);

/* ═══ TRAITS DEL PAÍS ═══ */

// Aplica modificadores de traits al objeto fx antes de ejecutarlo
function aplicarTraits(fx, evId){
  const p = PAISES[pid];
  if(!p||!p.tr) return fx;
  let fxMod = {...fx};
  p.tr.forEach(tId=>{
    const tr = TRAITS[tId];
    if(tr && tr.mod) fxMod = tr.mod(fxMod, evId || '');
  });
  return fxMod;
}

// Construye el widget de traits en el sidebar
function buildTraitsSidebar(){
  const w = $('traits-wrap');
  if(!w) return;
  const p = PAISES[pid];
  if(!p||!p.tr){ w.innerHTML=''; return; }
  w.innerHTML = '<div class="traits-lbl">Rasgos del país</div>';
  p.tr.forEach(tId=>{
    const tr = TRAITS[tId];
    if(!tr) return;
    const d = document.createElement('div');
    d.className = 'trait-chip';
    d.style.borderColor = tr.col + '33';
    d.innerHTML = `
      <span class="trait-ico">${tr.i}</span>
      <div class="trait-body">
        <span class="trait-name" style="color:${tr.col}">${tr.n}</span>
        <span class="trait-desc">${tr.desc}</span>
      </div>`;
    w.appendChild(d);
  });
}

// Añade chips de traits en las tarjetas de selección de país
function buildTraitsEnPaises(){
  const g = $('gp'); if(!g) return;
  g.innerHTML = '';
  Object.entries(PAISES).forEach(([id,p])=>{
    const d = document.createElement('div');
    d.className = 'pc'; d.onclick = ()=>iniciarJuego(id);
    const s = p.s;
    const trChips = (p.tr||[]).map(tId=>{
      const tr = TRAITS[tId];
      return tr ? `<span class="pc-trait"><span class="pc-trait-ico">${tr.i}</span>${tr.n}</span>` : '';
    }).join('');
    d.innerHTML = `
      <div class="pcfl">${p.f}</div>
      <div class="pcnm">${p.n}</div>
      <span class="pcdf ${p.dfc}">${p.dft}</span>
      <div class="mst">
        ${ms('Economía',s.economia,'#00e5a0')}
        ${ms('Popularidad',s.popularidad,'#ff6b9d')}
        ${ms('Corrupción',s.corrupcion,'#ff5533')}
        ${ms('Estabilidad',s.estabilidad,'#ffd700')}
      </div>
      ${trChips ? `<div class="pc-traits">${trChips}</div>` : ''}`;
    g.appendChild(d);
  });
}

// Muestra qué trait se activó en el evento actual (nota debajo de opciones)
function mostrarTraitActivado(evId){
  document.querySelectorAll('.trait-ev-note').forEach(el=>el.remove());
  const p = PAISES[pid]; if(!p||!p.tr) return;
  const wrap = $('ops'); if(!wrap) return;
  // Verificar si algún trait tiene lógica específica para este evento
  const activados = (p.tr||[]).filter(tId=>{
    const tr = TRAITS[tId];
    if(!tr) return false;
    // Evaluar si el mod haría algo en un fx de prueba con valores no cero
    const test = {economia:-5,popularidad:5,estabilidad:-3,relaciones:3,corrupcion:2};
    const mod  = tr.mod({...test}, evId);
    return JSON.stringify(mod) !== JSON.stringify(test);
  });
  if(activados.length === 0) return;
  const tr = TRAITS[activados[0]];
  const note = document.createElement('div');
  note.className = 'trait-ev-note';
  note.innerHTML = `<span class="trait-ev-ico">${tr.i}</span><span><strong style="color:${tr.col}">${tr.n}</strong> — ${tr.desc}</span>`;
  wrap.after(note);
}

/* ═══ ESTADO ═══ */
let G={},pid=null,activo=false,evActual='';
let hist=[],qEfx=[],qEnc=[],flags=new Set(),logros=new Set(),pers={aut:0,dip:0,ref:0,cor:0};
let _sv=null;
let MODO_CAOS=false;

/* ═══ HELPERS ═══ */
const $=id=>document.getElementById(id);
const tx=(id,t)=>{const e=$(id);if(e)e.textContent=t};
const vis=id=>{const e=$(id);if(e)e.classList.add('vis')};
const hid=id=>{const e=$(id);if(e)e.classList.remove('vis')};

/* ═══ PAÍSES ═══ */
function buildPaises(){ buildTraitsEnPaises(); }
function ms(n,v,c){return`<div class="msr"><span class="msl">${n}</span><div class="msb"><div class="msf" style="width:${v}%;background:${c}"></div></div><span class="msv">${v}</span></div>`}

/* ═══ NAVEGACIÓN ═══ */
function mostrarSel(){$('mp').style.display='none';const s=$('selp');s.classList.add('vis');s.scrollIntoView({behavior:'smooth',block:'start'})}
function ocultarSel(){$('selp').classList.remove('vis');$('mp').style.display=''}
function mostrarInicio(){const pi=$('si');pi.style.display='';pi.style.opacity='0';pi.style.transition='opacity .35s ease';requestAnimationFrame(()=>requestAnimationFrame(()=>pi.style.opacity='1'));setTimeout(()=>pi.style.transition='',380);aplicarVisCaos()}

/* ═══ MODO CAOS ═══ */
function toggleCaos(){
  MODO_CAOS=!MODO_CAOS;
  if(MODO_CAOS)else
  aplicarVisCaos();
}
function aplicarVisCaos(){
  document.body.classList.toggle('modo-caos',MODO_CAOS);
  const btn=$('btn-caos');
  if(btn){
    btn.textContent=MODO_CAOS?'🔴 CAOS ACTIVO':'💀 Modo Caos';
    btn.classList.toggle('caos-on',MODO_CAOS);
  }
  const ind=$('caos-ind');
  if(ind)ind.style.display=MODO_CAOS?'flex':'none';
}

/* ═══ INICIAR ═══ */
function iniciarJuego(id){
  const p=PAISES[id];if(!p)return;
  pid=id;G={...p.s,dia:1};logros=new Set();hist=[];qEfx=[];qEnc=[];flags=new Set();
  pers={aut:0,dip:0,ref:0,cor:0};crisisUsadas=new Set();ultimaCrisisDia=-99;activo=true;
  $('si').style.display='none';hid('scl');vis('sg');
  tx('sbfl',p.f);tx('sbco',p.n);tx('dn',1);$('logev').innerHTML='';
  buildStats();renderPers();buildTraitsSidebar();buildLogros();actualizarFase();actualizarCola();
  buildTicker();renderCaosInd();
  sigEv();addLog(`Iniciaste tu mandato en ${p.n}${MODO_CAOS?' [MODO CAOS]':''}`,'pos');
}

/* ═══ STATS ═══ */
const SD=[{k:'popularidad',n:'Popularidad',c:'spop'},{k:'economia',n:'Economía',c:'seco'},{k:'estabilidad',n:'Estabilidad',c:'sest'},{k:'relaciones',n:'Relac. Intl.',c:'srel'},{k:'corrupcion',n:'Corrupción',c:'scor'}];
function buildStats(){
  const w=$('stw');w.innerHTML='';
  SD.forEach(s=>{
    const v=G[s.k]??50,d=document.createElement('div');
    d.className=`sti ${s.c}`;d.id=`sti-${s.k}`;
    d.innerHTML=`<div class="str"><span class="stn">${s.n}</span><span class="sta" id="sta-${s.k}"></span></div><div class="sttr"><div class="stf" id="stf-${s.k}" style="width:${v}%"></div></div>`;
    w.appendChild(d);
  });
}
function actualizarStats(){SD.forEach(s=>{const f=$(`stf-${s.k}`);if(f)f.style.width=G[s.k]+'%'});tx('dn',G.dia);actualizarFase();actualizarCola()}
function mostrarFlechas(fx){
  Object.entries(fx).forEach(([k,d])=>{
    if(!d)return;const el=$(`sta-${k}`);if(!el)return;
    const cor=k==='corrupcion',b=(d>0&&!cor)||(d<0&&cor),f=Math.abs(d)>=8;
    el.textContent=b?(f?'↑↑':'↑'):(f?'↓↓':'↓');el.className='sta';void el.offsetWidth;
    el.className+=' '+(b?(f?'au2':'au'):(f?'ad2':'ad'));
  });
}
function actualizarFase(){
  const el=$('sbph');if(!el)return;const d=G.dia;
  if(d<=10){el.textContent='Fase: Inicio';el.className='sbph'}
  else if(d<=30){el.textContent='Fase: Presión';el.className='sbph alta'}
  else if(d<=60){el.textContent='Fase: Crisis';el.className='sbph critica'}
  else{el.textContent='Fase: Caos';el.className='sbph critica'}
}
function actualizarCola(){
  const tot=qEfx.length+qEnc.length,b=$('cb');if(!b)return;
  if(tot>0){b.classList.add('vis');tx('ct',`${tot} consecuencia${tot>1?'s':''} pendiente${tot>1?'s':''}`);}
  else b.classList.remove('vis');
}

/* ═══ PERSONALIDAD ═══ */
function dom(){const e=Object.entries(pers).sort((a,b)=>b[1]-a[1]);return e[0][1]===0?'neu':e[0][0]}
function renderPers(){
  const d=dom(),w=$('pw');if(!w)return;
  w.className='pw '+(d==='neu'?'pwneu':PR[d].cls);
  tx('pwic',d==='neu'?'🎭':PR[d].i);tx('pwnm',d==='neu'?'Neutral':PR[d].n);
  const tot=Math.max(1,Object.values(pers).reduce((a,v)=>a+v,0));
  const COL={aut:'#ff6644',dip:'#4488ff',ref:'#00e5a0',cor:'#bb44ff'};
  const b=$('pwbars');b.innerHTML='';
  Object.entries(pers).forEach(([k,v])=>{
    const pct=Math.round((v/tot)*100);
    b.innerHTML+=`<div class="pbr"><span class="pbl">${PR[k].n}</span><div class="pbtr"><div class="pbfi" style="width:${pct}%;background:${COL[k]}"></div></div></div>`;
  });
}
function regPers(op){if(!op.pr)return;const t=Array.isArray(op.pr)?op.pr:[op.pr];t.forEach(k=>{if(pers[k]!==undefined)pers[k]++});renderPers()}

/* ═══ LOGROS ═══ */
function renderCaosInd(){
  const w=$('caos-ind');if(!w)return;
  w.style.display=MODO_CAOS?'flex':'none';
}

function buildLogros(){
  const w=$('low');w.innerHTML='<div class="lowt">Logros</div>';
  LOGROS.forEach(l=>{const d=document.createElement('div');d.className=`lor ${logros.has(l.id)?'ok':''}`;d.id=`lr-${l.id}`;d.innerHTML=`<span>${l.i}</span><span>${l.n}</span>`;w.appendChild(d)});
}
function checkLogros(){
  LOGROS.forEach(l=>{
    if(!logros.has(l.id)&&l.c(G,pers)){
      logros.add(l.id);const el=$(`lr-${l.id}`);if(el)el.classList.add('ok');notif('nlo',l.i,'Logro Desbloqueado',l.n);
    }
  });
}

/* ═══ LOG ═══ */
function addLog(t,c=''){
  const log=$('logev'),d=document.createElement('div');
  d.className=`ll ${c}`;d.textContent=`◆ ${t}`;log.prepend(d);
  while(log.children.length>6)log.removeChild(log.lastChild);
}

/* ═══ EFECTOS ═══ */
function aplicarEfx(imp, mult=1, evId=''){
  const fxMod = aplicarTraits({...imp}, evId);
  const ap={};
  Object.entries(fxMod).forEach(([k,v])=>{
    if(G[k]===undefined)return;const d=Math.round(v*mult);G[k]=Math.max(0,Math.min(100,G[k]+d));ap[k]=d;
  });
  mostrarFlechas(ap);actualizarStats();
}
function calcMult(){const d=G.dia;let m;if(d<=10)m=.65;else if(d<=20)m=.85;else if(d<=35)m=1;else if(d<=55)m=1.2;else m=1.4;return MODO_CAOS?m*1.65:m}
function programarEfx(op){if(!op.fd)return;qEfx.push({turno:G.dia+op.fd.en,imp:op.fd.im,msg:op.fd.ms||'Consecuencia pasada'});actualizarCola()}
function procesarEfxDif(){
  const hoy=G.dia,ok=qEfx.filter(e=>e.turno<=hoy),no=qEfx.filter(e=>e.turno>hoy);qEfx=no;
  if(ok.length>0){const ef=ok.shift();ok.forEach(p=>qEfx.unshift(p));return ef}return null;
}
function desbloquearEv(id){if(IDX[id]&&!qEnc.includes(id)){qEnc.push(id);actualizarCola()}}

/* ═══ SELECCIÓN EVENTO ═══ */
function elegirEv(){
  const d=G.dia,dm=dom();
  if(qEnc.length>0){const id=qEnc.shift();actualizarCola();if(IDX[id])return IDX[id]}
  const pool=EV.filter(ev=>{
    if(hist.slice(-6).includes(ev.id))return false;
    if(d<=10&&ev.p===1)return false;
    if(ev.rp&&ev.rp!==dm)return false;
    if(ev.chaos&&!MODO_CAOS)return false;
    return true;
  });
  const bolsa=[];
  pool.forEach(ev=>{let r=ev.p||3;if(ev.rp===dm)r+=2;for(let i=0;i<r;i++)bolsa.push(ev)});
  if(bolsa.length===0){const fb=EV.filter(e=>!e.rp);return fb[Math.floor(Math.random()*fb.length)]}
  return bolsa[Math.floor(Math.random()*bolsa.length)];
}

/* ═══ RENDERIZAR EVENTO ═══ */
function sigEv(){
  if(!activo)return;
  const dif=procesarEfxDif();
  if(dif){notif('ndi','⏳','⚠️ Consecuencia diferida',dif.msg);addLog(dif.msg,'war');renderEv(dif,true);return}
  if(debeDispararseCrisis()){dispararCrisis();return}
  const ev=elegirEv();
  evActual=ev.id;
  hist.push(ev.id);if(hist.length>8)hist.shift();
  renderEv(ev,false);
}
function renderEv(ev,esDif){
  const card=$('ce');card.classList.remove('dif');card.classList.add('salir');
  setTimeout(()=>{
    card.classList.remove('salir');card.style.animation='none';void card.offsetWidth;card.style.animation='';
    const ob=card.querySelector('.epb');if(ob)ob.remove();
    if(esDif){
      card.classList.add('dif');
      $('ed').className='ed w';tx('et','⏳ Consecuencia Diferida');tx('eic','⚠️');tx('etx',ev.msg||'Una decisión pasada tiene consecuencias ahora.');
      const aw=$('asesor-wrap');if(aw)aw.innerHTML='';
      const ow=$('ops');ow.innerHTML='';
      const btn=document.createElement('button');btn.className='bo';
      btn.innerHTML=`<div class="ot">Aceptar las consecuencias</div><div class="oa">${arrs(ev.imp)}</div>`;
      btn.onclick=()=>{aplicarEfx(ev.imp,calcMult());avanzar()};ow.appendChild(btn);
    }else{
      $('ed').className='ed';tx('et',ev.t||'Evento');tx('eic',ev.i||'⚡');tx('etx',ev.tx);
      if(ev.rp&&PR[ev.rp]){
        const pd=PR[ev.rp],badge=document.createElement('div');
        badge.className=`epb ${pd.b}`;badge.innerHTML=`${pd.i} Evento ${pd.n}`;
        $('etx').before(badge);
      }
      const ow=$('ops');ow.innerHTML='';
      ev.o.forEach(op=>{
        const btn=document.createElement('button');btn.className='bo';
        btn.innerHTML=`<div class="ot">${op.tx}</div><div class="oa">${arrs(op.fx)}</div>`;
        btn.onclick=()=>elegir(op);ow.appendChild(btn);
      });
      mostrarTraitActivado(ev.id);
      mostrarAsesor(ev);
    }
  },295);
}
function arrs(fx){
  const NM={popularidad:'Pop',economia:'Eco',estabilidad:'Est',relaciones:'Rel',corrupcion:'Cor'};
  return Object.entries(fx).map(([k,v])=>{
    if(!v)return'';const cor=k==='corrupcion',b=(v>0&&!cor)||(v<0&&cor),f=Math.abs(v)>=8;
    const arrow=b?(f?'↑↑':'↑'):(f?'↓↓':'↓');const cls=b?(f?'fps':'fpw'):(f?'fns':'fnw');
    return`<span class="ft ${cls}">${NM[k]} ${arrow}</span>`;
  }).join('');
}

/* ═══ DECISIÓN ═══ */
function elegir(op){
  if(!activo)return;
  document.querySelectorAll('.bo').forEach(b=>b.classList.add('dis'));
  aplicarEfx(op.fx,calcMult(),evActual||'');
  if(op.fd)programarEfx(op);
  if(op.db)desbloquearEv(op.db);
  if(op.fl)flags.add(op.fl);
  regPers(op);
  addLog(`→ "${op.tx.substring(0,50)}${op.tx.length>50?'…':''}"`, '');
  avanzar();
}
function avanzar(){
  G.dia++;tx('dn',G.dia);guardar();checkLogros();
  if(checkGO())return;
  if(G.dia%5===0)buildTicker();
  // Elecciones cada ELEC_CADA días
  if(G.dia % ELEC_CADA === 0){
    addLog(`⚡ ¡Día ${G.dia}! Se convocan elecciones presidenciales`, 'war');
    notif('ndi','🗳️','Elecciones presidenciales',`Día ${G.dia} — elige tu estrategia`);
    setTimeout(abrirEleccion, 420);
    return;
  }
  setTimeout(sigEv,370);
}

/* ═══ GAME OVER ═══ */
const GOTIT={popularidad:'Has sido derrocado por el pueblo',economia:'Colapso económico total',estabilidad:'El Estado se desintegró',relaciones:'Aislamiento internacional total',corrupcion:'Corrupción fuera de control'};
const GOICO={popularidad:'✊',economia:'📉',estabilidad:'💥',relaciones:'🌐',corrupcion:'🔓'};
const GOCAUSA={
  popularidad:'La popularidad llegó a cero. Perdiste las elecciones y el pueblo dejó de apoyarte. Tu mandato terminó democráticamente.',
  economia:'La economía colapsó completamente. El país está en quiebra y no hay fondos para servicios básicos.',
  estabilidad:'El Estado se desintegró. Poderes paralelos controlan el territorio. Perdiste el control del país.',
  relaciones:'El aislamiento fue total. Sin aliados ni comercio exterior, el país no puede funcionar.',
  corrupcion:'La corrupción llegó al 100%. El Estado fue completamente capturado por intereses privados.'
};
const GOSD=[{k:'popularidad',n:'Popularidad',c:'linear-gradient(90deg,#ff6b9d,#ff2266)'},{k:'economia',n:'Economía',c:'linear-gradient(90deg,#00e5a0,#00c8e0)'},{k:'estabilidad',n:'Estabilidad',c:'linear-gradient(90deg,#ffd700,#ff9900)'},{k:'relaciones',n:'Relaciones',c:'linear-gradient(90deg,#4488ff,#8855ff)'},{k:'corrupcion',n:'Corrupción',c:'linear-gradient(90deg,#ff5533,#ff2200)'}];
function checkGO(){
  let cKey=null;
  for(const k of['popularidad','economia','estabilidad','relaciones'])if(G[k]<=0){cKey=k;break}
  if(!cKey&&G.corrupcion>=100)cKey='corrupcion';
  if(!cKey)return false;
  activo=false;
  const p=PAISES[pid],d=dom();
  tx('goic',GOICO[cKey]||'💀');tx('gotit',GOTIT[cKey]||'MANDATO TERMINADO');
  tx('gopf',p?.f||'🌍');tx('gopn',p?.n||'—');tx('godn',G.dia);tx('goct',GOCAUSA[cKey]||'El gobierno colapsó.');
  const fase=G.dia<=10?'Inicio':G.dia<=30?'Presión':G.dia<=60?'Crisis':'Caos';
  $('gopp').textContent=d!=='neu'?`${PR[d].i} ${PR[d].n} · Fase: ${fase}`:`Fase: ${fase}`;
  const sg=$('gosg');sg.innerHTML='';
  GOSD.forEach(s=>{const v=G[s.k]??0,cor=s.k==='corrupcion',mal=cor?v>=70:v<=22;
    sg.innerHTML+=`<div class="gosr"><div class="gostr"><span class="gosn">${s.n}</span><span class="gosv" style="color:${mal?'var(--dan)':'var(--txt)'}">${v}</span></div><div class="gostt"><div class="gosf" style="width:${v}%;background:${s.c}"></div></div></div>`;});
  const gl=$('gols');gl.innerHTML='';
  const li=LOGROS.filter(l=>logros.has(l.id));
  if(li.length>0)LOGROS.forEach(l=>{const d=document.createElement('div');d.className=`golo ${logros.has(l.id)?'ok':''}`;d.textContent=`${l.i} ${l.n}`;gl.appendChild(d)});
  else gl.innerHTML='<span class="goln">Sin logros en esta partida</span>';vis('sgo');localStorage.removeItem('mandato_save');return true;
}
function reintentar(){hid('sgo');if(pid&&PAISES[pid])iniciarJuego(pid);else irInicio()}
function irInicio(){hid('sgo');hid('sg');ocultarSel();buildPaises();mostrarInicio()}

/* ═══ MODAL REINICIO ═══ */
function abrirMR(){vis('mr')}
function cerrarMR(){hid('mr')}
function ejecutarReinicio(){
  cerrarMR();localStorage.removeItem('mandato_save');activo=false;
  const bc=$('bcont');if(bc)bc.disabled=true;$('msp')?.classList.remove('vis');
  hid('sg');ocultarSel();buildPaises();mostrarInicio();
}
$('mr').addEventListener('click',function(e){if(e.target===this)cerrarMR()});

/* ═══ GUARDAR ═══ */
function guardar(){
  if(!pid||!activo)return;
  try{
    localStorage.setItem('mandato_save',JSON.stringify({
      estado:{...G},pais:pid,logros:[...logros],
      hist,qEfx,qEnc,flags:[...flags],pers:{...pers},
      crisisUsadas:[...crisisUsadas],ultimaCrisisDia,
      modoCaos:MODO_CAOS,savedAt:Date.now()
    }));
    const b=$('bsv');if(b){b.textContent='✓ Guardado';setTimeout(()=>b.textContent='💾 Guardar Partida',1600)}
  }catch(e){console.warn(e)}
}

/* ═══ SAVE DETECTION ═══ */
function detectarSave(){
  const raw=localStorage.getItem('mandato_save');if(!raw){mostrarInicio();return}
  try{
    const d=JSON.parse(raw);if(!d?.pais||!d?.estado)throw new Error();
    const p=PAISES[d.pais];if(!p)throw new Error();
    _sv=d;montarCarga(d,p);activarCont(d,p);vis('scl');
  }catch(e){localStorage.removeItem('mandato_save');mostrarInicio()}
}
function montarCarga(d,p){
  const es=d.estado;tx('scpf',p.f);tx('scpn',p.n);tx('scpd',es.dia);
  const fe=$('scfase');const fa=es.dia<=10?['Inicio','fi']:es.dia<=30?['Presión','fp']:es.dia<=60?['Crisis','fc']:['Caos','fca'];
  fe.textContent=`⬤  Fase: ${fa[0]}`;fe.className=`scfase ${fa[1]}`;
  const pg=d.pers||{aut:0,dip:0,ref:0,cor:0};const dp=Object.entries(pg).sort((a,b)=>b[1]-a[1])[0];
  const pe=$('scpers');
  if(dp&&dp[1]>0&&PR[dp[0]]){const pd=PR[dp[0]];pe.innerHTML=`<span style="font-size:1.2rem">${pd.i}</span><span style="color:var(--dim)">Perfil:</span><span style="font-weight:700;color:var(--txt)">${pd.n}</span>`}
  else pe.innerHTML=`<span>🎭</span><span style="color:var(--dim)">Perfil: Neutral</span>`;
  const SDEF=[{k:'popularidad',n:'Popularidad',c:'linear-gradient(90deg,#ff6b9d,#ff2266)'},{k:'economia',n:'Economía',c:'linear-gradient(90deg,#00e5a0,#00c8e0)'},{k:'estabilidad',n:'Estabilidad',c:'linear-gradient(90deg,#ffd700,#ff9900)'},{k:'relaciones',n:'Relaciones',c:'linear-gradient(90deg,#4488ff,#8855ff)'},{k:'corrupcion',n:'Corrupción',c:'linear-gradient(90deg,#ff5533,#ff2200)'}];
  const sg=$('scsg');sg.innerHTML='';
  SDEF.forEach(s=>{const v=es[s.k]??50,cor=s.k==='corrupcion',mal=cor?v>=70:v<=25;
    sg.innerHTML+=`<div class="scst"><div class="scstr"><span class="scsn">${s.n}</span><span class="scsv" style="color:${mal?'var(--dan)':'var(--txt)'}">${v}</span></div><div class="sctr"><div class="scfi" style="width:${v}%;background:${s.c}"></div></div></div>`;});
  const ls=new Set(d.logros||[]),cl=$('sclo');cl.innerHTML='';
  const li=LOGROS.filter(l=>ls.has(l.id));
  if(li.length>0)li.forEach(l=>{const sp=document.createElement('span');sp.className='sclc';sp.textContent=`${l.i} ${l.n}`;cl.appendChild(sp)});
  else cl.innerHTML='<span class="scln">Sin logros aún</span>';
  if(d.savedAt){const f=new Date(d.savedAt),z=n=>String(n).padStart(2,'0');tx('scts',`Guardado el ${z(f.getDate())}/${z(f.getMonth()+1)}/${f.getFullYear()} — ${z(f.getHours())}:${z(f.getMinutes())}`)}
}
function activarCont(d,p){
  const bc=$('bcont');if(bc)bc.disabled=false;
  const prev=$('msp');if(prev){tx('mspf',p.f);tx('mspn',p.n);tx('mspd',d.estado?.dia??'?');prev.classList.add('vis')}
}
function ejecutarCarga(){
  const d=_sv;if(!d){mostrarInicio();return}
  const p=PAISES[d.pais];if(!p){mostrarInicio();return}
  const sl=$('scl');sl.style.opacity='0';sl.style.transition='opacity .32s ease';
  setTimeout(()=>{
    hid('scl');sl.style.opacity='';sl.style.transition='';
    pid=d.pais;G=d.estado;logros=new Set(d.logros||[]);hist=d.hist||[];
    qEfx=d.qEfx||[];qEnc=d.qEnc||[];flags=new Set(d.flags||[]);pers=d.pers||{aut:0,dip:0,ref:0,cor:0};
    crisisUsadas=new Set(d.crisisUsadas||[]);ultimaCrisisDia=d.ultimaCrisisDia??-99;
    MODO_CAOS=d.modoCaos||false;
    aplicarVisCaos();
    activo=true;
    $('si').style.display='none';vis('sg');
    tx('sbfl',p.f);tx('sbco',p.n);tx('dn',G.dia);$('logev').innerHTML='';
    buildStats();renderPers();buildTraitsSidebar();buildLogros();actualizarFase();actualizarCola();
    buildTicker();renderCaosInd();
    sigEv();addLog(`Partida cargada — Día ${G.dia}`,'pos');_sv=null;
  },340);
}
function descartarYNueva(){
  localStorage.removeItem('mandato_save');_sv=null;
  const bc=$('bcont');if(bc)bc.disabled=true;$('msp')?.classList.remove('vis');
  const sl=$('scl');sl.style.opacity='0';sl.style.transition='opacity .28s ease';
  setTimeout(()=>{hid('scl');sl.style.opacity='';sl.style.transition='';mostrarInicio()},300);
}

/* ═══ NOTIFS ═══ */
function notif(tipo,ico,tag,nom){
  const st=$('ns'),d=document.createElement('div');
  d.className=`nt ${tipo}`;d.innerHTML=`<div class="ntic">${ico}</div><div><div class="nttg">${tag}</div><div class="ntnm">${nom}</div></div>`;
  st.appendChild(d);
  setTimeout(()=>{d.classList.add('out');setTimeout(()=>{if(d.parentNode)d.parentNode.removeChild(d)},420)},4000);
}

/* ═══ CRISIS ESPECIALES ═══ */
// Probabilidad base por día (solo desde día 15, solo si no hubo crisis reciente)
const CRISIS_PROB_BASE  = 0.022;   // ~2.2% por decisión
const CRISIS_COOLDOWN   = 20;      // mínimo X días entre crisis
let   ultimaCrisisDia   = -99;
let   crisisUsadas      = new Set();

const CRISIS = [
  /* ── PANDEMIA ── */
  {
    id:'cr_pandemia', nombre:'PANDEMIA GLOBAL',
    ico:'🦠', color:'#bb44ff',
    impactoInmediato:'Las fronteras se cierran. El sistema sanitario colapsa en 72 horas.',
    tx:`Una cepa viral desconocida se propaga a velocidad exponencial. En menos de una semana hay miles de infectados. El sistema de salud está al límite y la economía empieza a paralizarse. El mundo te mira.`,
    o:[
      {
        tx:'Confinamiento total con apoyo económico',
        fx:{economia:-18,popularidad:+8,estabilidad:+12},
        fd:{en:8,im:{economia:-10},ms:'El coste económico del confinamiento empieza a pasar factura'},
      },
      {
        tx:'Cuarentena selectiva y rastreo masivo',
        fx:{economia:-10,estabilidad:+6,popularidad:+4},
        fd:{en:5,im:{popularidad:+8,estabilidad:+4},ms:'La gestión controlada de la pandemia mejora tu imagen'},
      },
      {
        tx:'Priorizar la economía, sin confinamiento',
        fx:{economia:+5,popularidad:-14,estabilidad:-16},
        fd:{en:4,im:{popularidad:-12,estabilidad:-10},ms:'La segunda oleada de contagios destruye la confianza ciudadana'},
      },
    ],
  },
  /* ── GUERRA REGIONAL ── */
  {
    id:'cr_guerra', nombre:'GUERRA EN LA REGIÓN',
    ico:'💣', color:'#ff6644',
    impactoInmediato:'Misiles detectados a 80 km de la frontera. Estado de alerta máxima.',
    tx:`Un conflicto armado estalló entre dos países vecinos y ya hay incursiones en tu territorio. Tienes 24 horas para tomar la decisión más importante de tu mandato. Las fuerzas armadas esperan órdenes.`,
    o:[
      {
        tx:'Declarar la guerra y defender el territorio',
        fx:{estabilidad:+10,popularidad:+14,economia:-20,relaciones:-10},
        fd:{en:10,im:{popularidad:-18,estabilidad:-14,economia:-12},ms:'La guerra se prolonga y el coste humano es insoportable'},
      },
      {
        tx:'Activar defensa y buscar mediación internacional',
        fx:{estabilidad:+6,relaciones:+12,economia:-8},
        fd:{en:6,im:{relaciones:+10,estabilidad:+6},ms:'La mediación diplomática logra un alto al fuego provisional'},
      },
      {
        tx:'Negociar una rendición territorial a cambio de paz',
        fx:{relaciones:+5,estabilidad:+8,popularidad:-20,corrupcion:+5},
      },
    ],
  },
  /* ── COLAPSO FINANCIERO ── */
  {
    id:'cr_financiero', nombre:'COLAPSO FINANCIERO',
    ico:'📉', color:'#ffaa00',
    impactoInmediato:'La bolsa cae un 38% en una hora. Los bancos suspenden operaciones.',
    tx:`El sistema financiero nacional implosionó. Los bancos suspendieron operaciones, la moneda perdió el 60% de su valor en horas y hay colas en los cajeros. El FMI exige medidas inmediatas. Es la peor crisis en 50 años.`,
    o:[
      {
        tx:'Rescate estatal masivo con austeridad severa',
        fx:{economia:+18,popularidad:-25,estabilidad:-8},
        fd:{en:5,im:{economia:+10},ms:'El rescate estabilizó el sistema pero la deuda pública es récord'},
      },
      {
        tx:'Solicitar rescate internacional urgente',
        fx:{economia:+10,relaciones:+8,popularidad:-12,estabilidad:-5},
        fd:{en:4,im:{economia:+8,relaciones:+5},ms:'El rescate internacional llegó pero con condiciones duras'},
      },
      {
        tx:'Dejar caer el sistema y reiniciar desde cero',
        fx:{economia:-20,popularidad:-18,estabilidad:-20},
        fd:{en:12,im:{economia:+18,popularidad:+12},ms:'El reset económico forzado empieza a dar señales de recuperación'},
      },
    ],
  },
  /* ── TERREMOTO DEVASTADOR ── */
  {
    id:'cr_terremoto', nombre:'TERREMOTO CATASTRÓFICO',
    ico:'🌋', color:'#ff9900',
    impactoInmediato:'Magnitud 8.1. Tres ciudades destruidas. Miles de víctimas.',
    tx:`Un terremoto de magnitud 8.1 devastó tres ciudades en cuestión de segundos. Hay miles de muertos confirmados, millones de desplazados y la infraestructura crítica ha colapsado. El mundo espera tu respuesta.`,
    o:[
      {
        tx:'Movilización total del Estado: ejército, hospitales y fondos de emergencia',
        fx:{popularidad:+20,economia:-18,estabilidad:+10},
        fd:{en:6,im:{popularidad:+8,estabilidad:+5},ms:'La respuesta rápida y coordinada se convierte en símbolo de liderazgo'},
      },
      {
        tx:'Pedir ayuda internacional y coordinar con ONGs',
        fx:{relaciones:+18,popularidad:+12,economia:-8},
        fd:{en:4,im:{popularidad:+6,estabilidad:+4},ms:'La cooperación internacional acelera la reconstrucción'},
      },
      {
        tx:'Respuesta institucional limitada por falta de recursos',
        fx:{popularidad:-24,estabilidad:-16,economia:+4},
        fd:{en:5,im:{popularidad:-10,estabilidad:-8},ms:'La inacción gubernamental genera protestas masivas y crisis política'},
      },
    ],
  },
  /* ── GOLPE DE ESTADO ── */
  {
    id:'cr_golpe', nombre:'INTENTO DE GOLPE',
    ico:'⚔️', color:'#ff3355',
    impactoInmediato:'Tanques en las calles. Facciones militares rebeldes toman el aeropuerto.',
    tx:`Un sector del ejército, aliado con grupos políticos radicales, lanzó un golpe de Estado. Tienen el aeropuerto y dos bases militares. Tienes pocas horas para actuar antes de que controlen la capital.`,
    o:[
      {
        tx:'Contraataque militar con fuerzas leales',
        fx:{estabilidad:+16,popularidad:+10,economia:-12,relaciones:-8},
        fd:{en:5,im:{estabilidad:+10,popularidad:+8},ms:'El golpe fue aplastado. Tu autoridad se reforzó, pero quedan heridas'},
      },
      {
        tx:'Negociar con los golpistas para repartir el poder',
        fx:{estabilidad:+8,corrupcion:+18,popularidad:-14,relaciones:-10},
        fd:{en:7,im:{corrupcion:+12,estabilidad:-8},ms:'El acuerdo con los golpistas corrompió las instituciones del Estado'},
      },
      {
        tx:'Exiliarte y pedir sanciones internacionales',
        fx:{relaciones:+12,popularidad:-20,estabilidad:-20},
        fd:{en:10,im:{relaciones:+14},ms:'La presión internacional forzó negociaciones para tu retorno'},
      },
    ],
  },
  /* ── CRISIS ENERGÉTICA ── */
  {
    id:'cr_energia', nombre:'APAGÓN NACIONAL',
    ico:'⚡', color:'#ffd700',
    impactoInmediato:'Red eléctrica nacional fuera de servicio. Hospitales en reserva.',
    tx:`El sistema eléctrico nacional colapsó por un ataque coordinado a las plantas generadoras. Los hospitales funcionan con generadores, la industria está paralizada y la temperatura cae. Hay pánico en las ciudades.`,
    o:[
      {
        tx:'Emergencia nacional: recursos militares a proteger infraestructura',
        fx:{estabilidad:+10,economia:-10,popularidad:+6},
        fd:{en:4,im:{economia:+8,estabilidad:+6},ms:'La red eléctrica se restaura paulatinamente con apoyo militar'},
      },
      {
        tx:'Contratar empresas extranjeras para recuperación urgente',
        fx:{economia:-14,relaciones:+8,estabilidad:+8},
        fd:{en:3,im:{economia:+6,popularidad:+6},ms:'La electricidad volvió en tiempo récord gracias a la ayuda exterior'},
      },
      {
        tx:'Racionamiento energético sin fecha de normalización',
        fx:{popularidad:-18,estabilidad:-12,economia:-6},
        fd:{en:6,im:{popularidad:-10},ms:'El racionamiento prolongado genera caos social e industrial'},
      },
    ],
  },
  /* ── ESCÁNDALO NUCLEAR ── */
  {
    id:'cr_nuclear', nombre:'AMENAZA NUCLEAR',
    ico:'☢️', color:'#44ff88',
    impactoInmediato:'Filtración radioactiva detectada. Zona de exclusión de 50 km.',
    tx:`Una planta nuclear con décadas de fallas ocultas tuvo un accidente grave. Hay una filtración radioactiva que amenaza a tres regiones. Organismos internacionales ya están monitoreando la situación.`,
    o:[
      {
        tx:'Evacuación masiva y transparencia total con la ONU',
        fx:{relaciones:+16,popularidad:+10,economia:-15,estabilidad:-8},
        fd:{en:6,im:{relaciones:+8,popularidad:+6},ms:'La gestión honesta de la crisis nuclear mejoró la imagen internacional'},
      },
      {
        tx:'Contener la información y minimizar públicamente',
        fx:{corrupcion:+16,popularidad:-8,relaciones:-14},
        fd:{en:4,im:{corrupcion:+10,popularidad:-18,relaciones:-14},ms:'La ocultación fue descubierta: escándalo internacional sin precedentes'},
      },
      {
        tx:'Clausurar la planta y solicitar ayuda técnica internacional',
        fx:{relaciones:+10,economia:-10,estabilidad:+6},
        fd:{en:5,im:{economia:-5,relaciones:+6},ms:'La cooperación técnica internacional permitió controlar la fuga'},
      },
    ],
  },
  /* ══ CRISIS EXCLUSIVAS MODO CAOS ══ */
  {
    id:'cr_revolucion', nombre:'REVOLUCIÓN POPULAR',
    ico:'🔥', color:'#ff2200',
    chaos:true,
    impactoInmediato:'Las ciudades están en llamas. El gobierno perdió el control de tres capitales.',
    tx:`Lo que empezó como una protesta se convirtió en insurrección. Barricadas en 14 ciudades, edificios gubernamentales tomados y milicias populares armadas. El ejército no sabe a quién obedecer.`,
    o:[
      {
        tx:'Abdicación simbólica: ofrecer elecciones inmediatas',
        fx:{popularidad:+18,estabilidad:-14,relaciones:+12,corrupcion:-10},
        fd:{en:6,im:{popularidad:+14,estabilidad:+8},ms:'La oferta de elecciones desinfló el movimiento y te reposicionó como demócrata'},
      },
      {
        tx:'Represión total: ejército y estado de guerra interno',
        fx:{estabilidad:+8,popularidad:-30,relaciones:-25,corrupcion:+12},
        fd:{en:5,im:{estabilidad:-16,popularidad:-14,relaciones:-18},ms:'La represión masiva convirtió la revolución en guerra civil de baja intensidad'},
      },
      {
        tx:'Aliarte con líderes del movimiento: gobierno de unidad',
        fx:{estabilidad:+6,corrupcion:-8,popularidad:+12,relaciones:+8},
        fd:{en:7,im:{estabilidad:+10,popularidad:+8},ms:'El gobierno de unidad logró estabilizar la situación con concesiones históricas'},
      },
    ],
  },
  {
    id:'cr_estado_fallido', nombre:'ESTADO EN COLAPSO',
    ico:'🏚️', color:'#ff6600',
    chaos:true,
    impactoInmediato:'Tres ministerios sin funcionarios. El Estado dejó de funcionar.',
    tx:`Renuncia masiva de funcionarios públicos. Los ministros huyeron. No hay policía en las calles, los hospitales operan sin dirección y la administración está paralizada. El vacío de poder es total.`,
    o:[
      {
        tx:'Llamar a tecnócratas internacionales para gestionar el Estado',
        fx:{economia:+10,relaciones:+14,popularidad:-16,estabilidad:+8},
        fd:{en:8,im:{economia:+12,estabilidad:+8},ms:'Los tecnócratas estabilizan el aparato estatal pero el resentimiento crece'},
      },
      {
        tx:'Militarizar la administración: ejército gestiona servicios',
        fx:{estabilidad:+12,corrupcion:+18,popularidad:-10,relaciones:-14},
        fd:{en:5,im:{corrupcion:+14,estabilidad:-8},ms:'La militarización genera corrupción sistémica en servicios básicos'},
      },
      {
        tx:'Descentralizar: cada región se autogobierna temporalmente',
        fx:{estabilidad:-16,popularidad:+8,relaciones:+6,corrupcion:-6},
        fd:{en:10,im:{estabilidad:-10,popularidad:+12},ms:'La descentralización de emergencia evita el colapso total pero fragmenta el país'},
      },
    ],
  },
];

function debeDispararseCrisis() {
  if (!activo) return false;
  const minDia  = MODO_CAOS ? 8  : 15;
  const cooldown= MODO_CAOS ? 10 : CRISIS_COOLDOWN;
  const capEsc  = MODO_CAOS ? 5  : 2.5;
  const base    = MODO_CAOS ? CRISIS_PROB_BASE * 3.2 : CRISIS_PROB_BASE;
  if (G.dia < minDia) return false;
  if ((G.dia - ultimaCrisisDia) < cooldown) return false;
  const disponibles = CRISIS.filter(c => !crisisUsadas.has(c.id) && (!c.chaos || MODO_CAOS));
  if (disponibles.length === 0) return false;
  const escalaTime = Math.min(capEsc, 1 + (G.dia - minDia) / (MODO_CAOS ? 35 : 80));
  return Math.random() < (base * escalaTime);
}

function dispararCrisis() {
  const disponibles = CRISIS.filter(c => !crisisUsadas.has(c.id) && (!c.chaos || MODO_CAOS));
  if (disponibles.length === 0) return;

  const crisis = disponibles[Math.floor(Math.random() * disponibles.length)];
  crisisUsadas.add(crisis.id);
  ultimaCrisisDia = G.dia;

  // Flash de pantalla
  const fl = $('crisis-flash');
  fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');

  // Notificación dramática
  notif('ncr', crisis.ico, '🚨 CRISIS ESPECIAL', crisis.nombre);
  addLog(`🚨 CRISIS: ${crisis.nombre}`, 'neg');
  buildTicker();  // regenerar ticker con contexto de crisis

  // Renderizar en la tarjeta de evento como crisis
  renderCrisis(crisis);
}

function renderCrisis(crisis) {
  const card = $('ce');
  // Quitar clases previas, añadir crisis
  card.className = 'crisis';
  card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';

  // Limpiar badge de personalidad y asesor
  const ob = card.querySelector('.epb'); if (ob) ob.remove();
  const aw = $('asesor-wrap'); if (aw) aw.innerHTML = '';

  // Tipo row
  $('ed').className = 'ed';
  $('ed').style.background = crisis.color;
  $('ed').style.boxShadow = `0 0 6px ${crisis.color}`;
  tx('et', '🚨 CRISIS ESPECIAL');

  // Ícono
  tx('eic', crisis.ico);

  // Banner de crisis
  const bannerHTML = `
    <div class="crisis-banner">
      <div class="crisis-banner-ico">${crisis.ico}</div>
      <div class="crisis-banner-body">
        <div class="crisis-label">Crisis especial · Impacto máximo</div>
        <div class="crisis-name">${crisis.nombre}</div>
        <div class="crisis-fase">Día ${G.dia} del mandato</div>
      </div>
    </div>
    <div class="crisis-impacto">${crisis.impactoInmediato}</div>`;

  tx('etx', crisis.tx);
  // Insertar banner antes del texto
  const etxEl = $('etx');
  etxEl.insertAdjacentHTML('beforebegin', bannerHTML);

  // Opciones
  const ow = $('ops'); ow.innerHTML = '';
  crisis.o.forEach(op => {
    const btn = document.createElement('button');
    btn.className = 'bo';
    btn.innerHTML = `<div class="ot">${op.tx}</div><div class="oa">${arrs(op.fx)}</div>`;
    btn.onclick = () => {
      // Limpiar banners de crisis antes de procesar
      document.querySelectorAll('.crisis-banner,.crisis-impacto').forEach(el => el.remove());
      card.className = '';  // reset clase crisis
      $('ed').style.background = '';
      $('ed').style.boxShadow = '';
      elegir(op);
    };
    ow.appendChild(btn);
  });
}

/* ═══ SISTEMA DE ELECCIONES ═══ */
// Elecciones cada 30 días (día 30, 60, 90…)
const ELEC_CADA = 30;
let elecPendiente = false;   // bloquea sigEv mientras hay elección activa

// Calcula % voto base antes de elegir estrategia de campaña
function calcVotoBase() {
  // Popularidad pesa 40%, economía 30%, estabilidad 20%, relaciones 10%
  // Corrupción penaliza
  const raw = (G.popularidad * .4) + (G.economia * .3) + (G.estabilidad * .2) + (G.relaciones * .1);
  const penalty = (G.corrupcion / 100) * 12;   // hasta -12 pts por corrupción alta
  // Cada vez que pasamos una elección, la base baja ligeramente (fatiga)
  const fatiga  = Math.floor(G.dia / ELEC_CADA - 1) * 2;
  return Math.max(18, Math.min(74, Math.round(raw - penalty - fatiga)));
}

// Opciones de campaña electoral
const ELEC_CAMPAÑAS = [
  {
    id:'limpia',
    title:'🌿 Campaña limpia',
    desc:'Debates honestos, propuestas concretas y cero manipulación. Tu imagen queda intacta sin importar el resultado.',
    tags:[{t:'Corrupción −8',c:'pos'},{t:'Popularidad ±variado',c:'war'},{t:'Sin riesgos',c:'pos'}],
    aplicar(base) {
      // Bono pequeño de popularidad por percepción de honestidad
      aplicarEfx({corrupcion:-8, popularidad:+5}, 1);
      return base + 4;   // leve ventaja real
    },
  },
  {
    id:'maquinaria',
    title:'⚙️ Maquinaria política',
    desc:'Movilización del aparato del Estado, prebendas y clientelismo. Efectivo, pero deja rastros.',
    tags:[{t:'Economía −6',c:'neg'},{t:'Corrupción +10',c:'neg'},{t:'Voto +8%',c:'pos'}],
    aplicar(base) {
      aplicarEfx({economia:-6, corrupcion:+10}, 1);
      return base + 8;
    },
  },
  {
    id:'fraude',
    title:'🗃️ Fraude electoral',
    desc:'Actas adulteradas, urnas rellenas y presión sobre los organismos electorales. Garantiza más votos, pero el riesgo de escándalo es alto.',
    tags:[{t:'Corrupción +20',c:'neg'},{t:'Relaciones −10',c:'neg'},{t:'Voto +16%',c:'pos'},{t:'Riesgo escándalo',c:'war'}],
    aplicar(base) {
      aplicarEfx({corrupcion:+20, relaciones:-10}, 1);
      // 30% de probabilidad de escándalo que penaliza popularidad gravemente
      if (Math.random() < .30) {
        aplicarEfx({popularidad:-22, estabilidad:-10}, 1);
        addLog('¡El fraude fue denunciado por observadores internacionales!','neg');
        notif('ncr','🔴','Escándalo electoral','El fraude fue expuesto públicamente');
        return base + 6;   // escándalo reduce ventaja
      }
      return base + 16;
    },
  },
];

// Factores contextuales que se muestran al jugador
function calcFactores(base) {
  const fs = [];
  if (G.popularidad >= 65) fs.push({t:'Alta popularidad',c:'pos'});
  else if (G.popularidad <= 35) fs.push({t:'Baja popularidad',c:'neg'});
  if (G.economia >= 65)    fs.push({t:'Economía fuerte',c:'pos'});
  else if (G.economia <= 35) fs.push({t:'Crisis económica',c:'neg'});
  if (G.corrupcion >= 60)  fs.push({t:'Escándalos de corrupción',c:'neg'});
  else if (G.corrupcion <= 25) fs.push({t:'Imagen limpia',c:'pos'});
  if (G.estabilidad >= 65) fs.push({t:'País estable',c:'pos'});
  else if (G.estabilidad <= 35) fs.push({t:'Inestabilidad social',c:'neg'});
  if (flags.has('reprimio'))  fs.push({t:'Represión pasada',c:'neg'});
  if (base >= 55) fs.push({t:'Favorito en encuestas',c:'pos'});
  else if (base < 45) fs.push({t:'Candidato en desventaja',c:'neg'});
  else fs.push({t:'Carrera muy reñida',c:'war'});
  return fs;
}

function abrirEleccion() {
  elecPendiente = true;
  activo = false;   // pausa el juego mientras dura la elección

  const base = calcVotoBase();
  const factores = calcFactores(base);
  const oponente = 100 - base;
  const p = PAISES[pid];

  tx('ec-flag', p?.f || '🌍');
  tx('ec-title', `Elecciones en ${p?.n || '—'}`);
  tx('ec-dia', `Día ${G.dia} · Mandato en curso`);

  const body = $('ec-body');
  body.innerHTML = '';

  // ── Bloque de pronóstico ──
  const youW = Math.max(5, Math.min(90, base));
  const opW  = 100 - youW;

  const forecast = document.createElement('div');
  forecast.className = 'ec-forecast';
  forecast.innerHTML = `
    <div class="ec-fl">Pronóstico electoral</div>
    <div class="ec-bar-wrap">
      <div class="ec-bar-you" style="width:${youW*.9}%"></div>
      <div class="ec-vs">VS</div>
      <div class="ec-bar-op"  style="width:${opW*.9}%"></div>
    </div>
    <div class="ec-bar-labels">
      <span class="ec-you-lbl">Tú</span>
      <span class="ec-op-lbl">Oposición</span>
    </div>
    <div class="ec-pct-row">
      <span class="ec-pct-you">${base}%</span>
      <span class="ec-margin">${Math.abs(base-oponente) < 6 ? '⚠️ Demasiado reñida' : ''}</span>
      <span class="ec-pct-op">${oponente}%</span>
    </div>`;
  body.appendChild(forecast);

  // ── Factores ──
  if (factores.length > 0) {
    const fwrap = document.createElement('div');
    fwrap.innerHTML = `<div class="ec-factors">${factores.map(f=>`<span class="ec-fac ${f.c}">${f.t}</span>`).join('')}</div>`;
    body.appendChild(fwrap);
  }

  // ── Opciones de campaña ──
  const lblDiv = document.createElement('div');
  lblDiv.className = 'ec-opts-lbl';
  lblDiv.textContent = 'Estrategia de campaña';
  body.appendChild(lblDiv);

  const optsDiv = document.createElement('div');
  optsDiv.className = 'ec-opts';
  ELEC_CAMPAÑAS.forEach(camp => {
    const btn = document.createElement('button');
    btn.className = 'ec-op';
    btn.innerHTML = `
      <div class="ec-op-title">${camp.title}</div>
      <div class="ec-op-desc">${camp.desc}</div>
      <div class="ec-op-fx">${camp.tags.map(t=>`<span class="ec-op-tag ${t.c}">${t.t}</span>`).join('')}</div>`;
    btn.onclick = () => resolverEleccion(camp, base);
    optsDiv.appendChild(btn);
  });
  body.appendChild(optsDiv);

  vis('modal-elec');
}

function resolverEleccion(camp, baseOriginal) {
  // Aplicar efectos de la campaña y obtener voto final
  const votoFinal = Math.max(15, Math.min(92, camp.aplicar(baseOriginal)));
  const oponenteFinal = 100 - votoFinal;
  const victoria = votoFinal > 50;
  const reñida   = Math.abs(votoFinal - oponenteFinal) <= 8;

  const p = PAISES[pid];
  const body = $('ec-body');
  body.innerHTML = '';

  let ico, titleTxt, titleCls, desc;
  if (victoria && !reñida) {
    ico = '🎉'; titleTxt = '¡REELECCIÓN!'; titleCls = 'win';
    desc = `Has ganado las elecciones con el ${votoFinal}% de los votos. El pueblo te ha dado un nuevo mandato. Continúas en el poder.`;
    aplicarEfx({popularidad:+10, estabilidad:+8}, 1);
    addLog(`Victoria electoral: ${votoFinal}% de los votos`, 'pos');
    notif('nlo','🎉','Victoria electoral',`${votoFinal}% · Reelecto`);
  } else if (victoria && reñida) {
    ico = '😤'; titleTxt = 'VICTORIA AJUSTADA'; titleCls = 'close';
    desc = `Has ganado por un margen mínimo: ${votoFinal}% vs ${oponenteFinal}%. El país está profundamente dividido. Continúas gobernando, pero con legitimidad debilitada.`;
    aplicarEfx({popularidad:+3, estabilidad:-5}, 1);
    addLog(`Victoria reñida: ${votoFinal}% vs ${oponenteFinal}%`, 'war');
    notif('ndi','😤','Victoria ajustada',`${votoFinal}% — división social`);
  } else {
    ico = '💔'; titleTxt = 'DERROTA ELECTORAL'; titleCls = 'lose';
    desc = `Has perdido las elecciones con el ${votoFinal}% frente al ${oponenteFinal}% de la oposición. Tu mandato llega a su fin de forma democrática.`;
    addLog(`Derrota electoral: ${votoFinal}% vs ${oponenteFinal}%`, 'neg');
    notif('ncr','💔','Derrota electoral',`${votoFinal}% — fin del mandato`);
  }

  // Construir pantalla de resultado
  const resDiv = document.createElement('div');
  resDiv.className = 'ec-result';
  resDiv.innerHTML = `
    <div class="ec-res-ico">${ico}</div>
    <div class="ec-res-title ${titleCls}">${titleTxt}</div>
    <div class="ec-res-pcts">
      <div class="ec-res-you"><div class="ec-res-n">${votoFinal}%</div><div class="ec-res-l">Tú</div></div>
      <div class="ec-res-op" ><div class="ec-res-n">${oponenteFinal}%</div><div class="ec-res-l">Oposición</div></div>
    </div>
    <div class="ec-res-desc">${desc}</div>
    <button class="btn-ec-ok" onclick="cerrarEleccion(${victoria})">${victoria ? 'Continuar gobernando' : 'Aceptar el resultado'}</button>`;
  body.appendChild(resDiv);

  // Si perdió: game over tras cerrar
  if (!victoria) {
    // Marcamos la derrota electoral como causa especial
    window._elecDerrota = true;
  }
}

function cerrarEleccion(victoria) {
  hid('modal-elec');
  elecPendiente = false;
  activo = true;

  if (window._elecDerrota) {
    window._elecDerrota = false;
    // Simular game over por popularidad (derrota electoral)
    G.popularidad = 0;
    checkGO();
    return;
  }
  setTimeout(sigEv, 400);
}

/* ═══ SISTEMA DE ASESORES ═══ */
const ASESORES = {
  eco:{
    nom:'Min. de Economía', ico:'📊', cls:'aeco', cargo:'Ministerio de Economía',
    buenas:[
      'He revisado los indicadores. Esta opción minimiza el riesgo fiscal a mediano plazo.',
      'Los modelos econométricos apuntan a que este camino estabiliza las cuentas.',
      'Nuestros técnicos coinciden: esta medida tiene el mejor ratio costo-beneficio.',
      'Los mercados reaccionarán mejor ante esta decisión, según mis contactos.',
      'Es la opción más ortodoxa. Los organismos internacionales la aprobarán.',
    ],
    malas:[
      'Mis socios en el sector financiero me han dado su respaldo para esta opción.',
      'Personalmente tengo interés en que esto prospere, pero creo que es lo correcto.',
      'Los números pueden interpretarse de varias formas… yo prefiero esta lectura.',
      'Algunos contratos pendientes de aprobación hacen que esta opción sea ideal.',
      'He hablado con los inversores. Ellos prefieren esta alternativa, y yo también.',
    ],
  },
  mil:{
    nom:'Asesor Militar', ico:'⚔️', cls:'amil', cargo:'Jefatura de Fuerzas Armadas',
    buenas:[
      'Las fuerzas de seguridad están listas. Esta opción garantiza el orden rápidamente.',
      'Desde el punto de vista táctico, esta es la respuesta más efectiva y proporcional.',
      'El mando conjunto lo respalda unánimemente. Tenemos capacidad para ejecutarlo.',
      'La inteligencia militar sugiere que esta decisión disuadirá futuros conflictos.',
      'Es la respuesta que esperan las instituciones. Mantiene la cadena de mando.',
    ],
    malas:[
      'Necesitamos ampliar el presupuesto de defensa. Esta opción lo justificaría.',
      'Con todo respeto, la debilidad siempre invita más problemas que la firmeza.',
      'Mis generales llevan semanas presionando para esto. Sería bueno complacerles.',
      'La imagen de autoridad del ejército se refuerza con esta clase de decisiones.',
      'Ciertos contratos de armamento dependen de que el presupuesto no se recorte.',
    ],
  },
  pol:{
    nom:'Consejero Político', ico:'🗣️', cls:'apol', cargo:'Gabinete de la Presidencia',
    buenas:[
      'Las encuestas internas favorecen esta opción entre los votantes que nos importan.',
      'Políticamente, esto consolida nuestra base electoral para las próximas elecciones.',
      'He hablado con los líderes de opinión. Es lo que esperan de usted esta semana.',
      'Los medios afines cubrirán muy positivamente esta decisión. Es el momento.',
      'Nuestra coalición necesita esta señal para mantenerse unida. Se lo recomiendo.',
    ],
    malas:[
      'Mi partido tiene compromisos previos que hacen preferible esta alternativa.',
      'Confidencialmente: algunos financiadores de campaña están detrás de esta opción.',
      'Esta decisión me ayuda a mantener mis alianzas internas. Es lo que le pido.',
      'Si elegimos otra opción, perderé apoyos importantes. Le ruego que lo considere.',
      'Mis contactos en la oposición me aseguran que no atacarán esta decisión.',
    ],
  },
  dip:{
    nom:'Canciller', ico:'🌐', cls:'adip', cargo:'Ministerio de Relaciones Exteriores',
    buenas:[
      'Los canales diplomáticos me indican que esta respuesta será bien recibida.',
      'He consultado con embajadores aliados. Es el camino menos conflictivo exterior.',
      'La comunidad internacional espera exactamente esta clase de señal de nuestra parte.',
      'Esta opción refuerza nuestros compromisos con los tratados vigentes.',
      'He negociado en privado. Si tomamos esta decisión, recibiremos apoyo externo.',
    ],
    malas:[
      'Tengo compromisos personales con algunas delegaciones que apuntan a esto.',
      'Mi carrera diplomática depende de mantener buenas relaciones con ciertos actores.',
      'Algunos socios comerciales me han presionado mucho para inclinarme por esto.',
      'La cancillería tiene intereses institucionales en que esta opción prevalezca.',
      'Hay compromisos previos a su mandato que hacen que esto sea lo "esperado".',
    ],
  },
};

// Qué asesor aplica por tipo de evento
const ASESOR_TIPO = {
  'Economía':'eco', 'Social':'pol', 'Política':'pol',
  'Internacional':'dip', 'Inesperado':'pol',
};
const IDS_MIL = new Set(['rebelion','conflicto','aut_excepcion','pandemia','protestas','prot_fmi','prot_min','huelga','ddhh','policia']);

function mejorOpIdx(ev, tipo) {
  // Calcula la opción "óptima" según el enfoque del asesor
  let best = 0, bestScore = -Infinity;
  ev.o.forEach((op, i) => {
    const fx = op.fx;
    let sc = 0;
    if (tipo === 'eco') sc = (fx.economia||0)*2 - (fx.corrupcion||0) + (fx.estabilidad||0)*.5;
    else if (tipo === 'mil') sc = (fx.estabilidad||0)*2 - Math.abs(fx.popularidad||0)*.4;
    else if (tipo === 'pol') sc = (fx.popularidad||0)*2 - (fx.corrupcion||0) + (fx.estabilidad||0)*.5;
    else if (tipo === 'dip') sc = (fx.relaciones||0)*2 - (fx.corrupcion||0) + (fx.popularidad||0)*.3;
    if (sc > bestScore) { bestScore = sc; best = i; }
  });
  return best;
}

function peorOpIdx(ev) {
  // Asesor con agenda oculta recomienda la peor opción neta para el jugador
  let worst = 0, worstScore = Infinity;
  ev.o.forEach((op, i) => {
    const fx = op.fx;
    const sc = Object.entries(fx).reduce((a,[k,v]) => {
      return a + (k === 'corrupcion' ? -v : v);
    }, 0);
    if (sc < worstScore) { worstScore = sc; worst = i; }
  });
  return worst;
}

function mostrarAsesor(ev) {
  const wrap = $('asesor-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';

  // 18% de probabilidad de no aparecer ningún asesor (silencio dramático)
  if (Math.random() < 0.18) return;
  // No mostrar asesor en eventos diferidos
  if (!ev.o) return;

  // Determinar tipo
  let tipo = IDS_MIL.has(ev.id) ? 'mil' : (ASESOR_TIPO[ev.t] || 'pol');
  const asesor = ASESORES[tipo];

  // ¿Tiene agenda oculta? 22% de probabilidad
  const oculta = Math.random() < 0.22;

  // Índice de opción recomendada
  const idxRec = oculta ? peorOpIdx(ev) : mejorOpIdx(ev, tipo);
  const opTx = ev.o[idxRec]?.tx || '';

  // Frase
  const pool = oculta ? asesor.malas : asesor.buenas;
  const frase = pool[Math.floor(Math.random() * pool.length)];

  // Construir card
  const card = document.createElement('div');
  card.className = `acard ${asesor.cls}`;
  card.innerHTML = `
    <div class="a-ico">${asesor.ico}</div>
    <div class="a-body">
      <div class="a-name">
        <span class="a-nom">${asesor.nom}</span>
        <span class="a-tag">${asesor.cargo}</span>
      </div>
      <div class="a-quote">"${frase}"</div>
      <div class="a-rec">
        <span class="a-dot"></span>
        Recomienda: "${opTx.substring(0,48)}${opTx.length>48?'…':''}"
      </div>
    </div>`;
  wrap.appendChild(card);

  // Resaltar opción recomendada sutilmente (después del render de botones)
  setTimeout(() => {
    const bots = document.querySelectorAll('.bo');
    if (bots[idxRec]) bots[idxRec].classList.add('recom');
  }, 340);
}

/* ═══ TICKER DE NOTICIAS ═══ */
// Titulares dinámicos basados en el estado actual del juego
const NOTICIAS_BASE = [
  // Economía crítica
  {cond:e=>e.economia<=20,  txt:'Economía al borde del colapso: expertos piden intervención urgente',    tono:'neg'},
  {cond:e=>e.economia<=35,  txt:'Inflación record paraliza el consumo interno en todo el país',           tono:'neg'},
  {cond:e=>e.economia<=50,  txt:'Inversores extranjeros advierten riesgo elevado en el mercado local',    tono:'war'},
  {cond:e=>e.economia>=75,  txt:'PIB crece por tercer trimestre consecutivo según datos oficiales',       tono:'pos'},
  {cond:e=>e.economia>=90,  txt:'Agencias internacionales elevan calificación crediticia del país',       tono:'pos'},
  // Popularidad crítica
  {cond:e=>e.popularidad<=20, txt:'Encuestas: aprobación presidencial cae a mínimo histórico del 12%',   tono:'neg'},
  {cond:e=>e.popularidad<=35, txt:'Protestas frente al palacio de gobierno superan las 50.000 personas', tono:'neg'},
  {cond:e=>e.popularidad<=50, txt:'Sondeos muestran descontento creciente con la gestión actual',        tono:'war'},
  {cond:e=>e.popularidad>=80, txt:'Presidente alcanza 78% de aprobación, el más alto en cinco años',     tono:'pos'},
  {cond:e=>e.popularidad>=90, txt:'Ciudadanos celebran en las calles el primer aniversario del mandato', tono:'pos'},
  // Estabilidad
  {cond:e=>e.estabilidad<=20, txt:'Estado de emergencia no descartado ante creciente inestabilidad',     tono:'neg'},
  {cond:e=>e.estabilidad<=40, txt:'Fuentes militares confirman tensión interna en varias regiones',      tono:'neg'},
  {cond:e=>e.estabilidad>=80, txt:'Informe ONU destaca estabilidad institucional como modelo regional',  tono:'pos'},
  // Relaciones internacionales
  {cond:e=>e.relaciones<=20, txt:'Embajadores de cuatro países retiran misiones diplomáticas',           tono:'neg'},
  {cond:e=>e.relaciones<=40, txt:'Tensión diplomática con socios comerciales amenaza exportaciones',     tono:'war'},
  {cond:e=>e.relaciones>=80, txt:'Firma de acuerdo multilateral refuerza posición en el escenario global', tono:'pos'},
  // Corrupción
  {cond:e=>e.corrupcion>=80, txt:'Transparencia Internacional rebaja índice de integridad a nivel crítico', tono:'neg'},
  {cond:e=>e.corrupcion>=60, txt:'Fiscalía recibe 340 denuncias por irregularidades en contratos públicos', tono:'war'},
  {cond:e=>e.corrupcion<=15, txt:'País asciende 30 puestos en ranking mundial de anticorrupción',         tono:'pos'},
  // Días de mandato
  {cond:e=>e.dia>=100, txt:'El mandato cumple 100 días: análisis de los primeros resultados de gobierno', tono:'neu'},
  {cond:e=>e.dia>=50,  txt:'A mitad del primer año: el balance de aciertos y errores del gobierno',       tono:'neu'},
  {cond:e=>e.dia>=30,  txt:'Primer mes en el poder: el gobierno define sus prioridades de gestión',       tono:'neu'},
  // Siempre visibles (genéricas)
  {cond:()=>true, txt:'Mercados atentos a las próximas decisiones del ejecutivo nacional',                tono:'neu'},
  {cond:()=>true, txt:'Oposición parlamentaria exige mayor transparencia en el gasto público',            tono:'neu'},
  {cond:()=>true, txt:'Analistas debaten el rumbo económico del país en foro internacional',              tono:'neu'},
  {cond:()=>true, txt:'Organizaciones sociales presentan propuestas al gobierno para reducir pobreza',    tono:'neu'},
  {cond:()=>true, txt:'Banco central mantiene política monetaria a la espera de nuevos indicadores',      tono:'neu'},
  {cond:()=>true, txt:'Cumbre regional convocada para tratar crisis migratoria en el continente',         tono:'war'},
  {cond:()=>true, txt:'Medios internacionales siguen de cerca la evolución política del país',            tono:'neu'},
  {cond:()=>true, txt:'Sindicatos nacionales anuncian jornada de movilización para la próxima semana',    tono:'war'},
  {cond:()=>true, txt:'Sector empresarial pide estabilidad de reglas para retomar inversiones',           tono:'neu'},
  {cond:()=>true, txt:'ONU publica informe sobre desarrollo humano: el país mantiene posición media',     tono:'neu'},
];

function buildTicker(){
  const track = $('ticker-track');
  if(!track || !activo) return;

  // Filtrar titulares que aplican al estado actual
  const activas = NOTICIAS_BASE.filter(n => n.cond(G));
  // Tomar máximo 14, mezclar un poco
  const selec = activas.sort(()=>Math.random()-.5).slice(0,14);

  // Duplicar para scroll infinito sin saltos
  const all = [...selec, ...selec];
  track.innerHTML = all.map(n =>
    `<span class="tn tn${n.tono}"><span class="tn-dot"></span>${n.txt}</span>`
  ).join('');

  // Ajustar duración según cantidad de noticias (aprox 8s por titular)
  const dur = selec.length * 5;
  track.style.animation = 'none';
  void track.offsetWidth;
  track.style.animation = `tickerScroll ${dur}s linear infinite`;
}

/* ═══ INIT ═══ */
$('si').style.display='none';
buildPaises();
detectarSave();
/* ═══ CONTROLES DE AUDIO ═══ */
function toggleMusica(){
  const on=
  const btn=$('btn-mus');
  if(btn){btn.textContent=on?'🎵':'🔇';btn.classList.toggle('aud-off',!on)}
}
function toggleSfx(){
  const on=
  const btn=$('btn-sfx');
  if(btn){btn.textContent=on?'🔊':'🔈';btn.classList.toggle('aud-off',!on)}
}
