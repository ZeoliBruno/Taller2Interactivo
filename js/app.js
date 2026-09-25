/* Capítulos de la navegación (orden = línea de tiempo del Figma) */
const CAPITULOS = [
  {id:'home',     icono:'🏠', titulo:'Inicio'},
  {id:'cap-1914', icono:'⚙️', titulo:'1914 El Ajedrecista'},
  {id:'cap-1997', icono:'♜', titulo:'1997 DeepBlue'},
  {id:'jeopardy', icono:'📖', titulo:'2011 Watson'},
  {id:'cap-2016', icono:'🧠', titulo:'2016 AlphaGo'},
  {id:'cap-2017', icono:'🂡', titulo:'2017 Libratus'},
  {id:'cap-2018', icono:'🎮', titulo:'2018 OpenAI Five'},
  {id:'resumen',  icono:'📊', titulo:'Resumen'},
];
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

function mostrar(id){
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  const cur = CAPITULOS.findIndex(c => c.id === id);
  $('#nav').hidden = cur < 1;              // sin línea de tiempo en home, intro y Nobby
  if (cur >= 1) armarNav(cur);
  if (id === 'nobby') { nbHist = []; nbVis.clear(); nb('intro'); }
  if (id === 'cap-1914') activarPaso(1);
  if (id === 'jeopardy') activarJP(0);
  history.replaceState(null, '', '#' + id);
}
/* ===== Línea de tiempo (basada en Group_49.svg): pasos activos hasta la pantalla actual ===== */
const TL_PNG = [null,'gears','rook','book','brain','cards','gamepad',null];   // assets/tl/*.png
const TL_IC  = [0,106,205,304,403,503,602,698];                                 // x de cada ícono
const TL_HOME = 'M25 43V27.8235H35V43H47.5V22.7647H55L30 0L5 22.7647H12.5V43H25Z';
const TL_CHART = 'M717.458 43.5H706V18.5H717.458V43.5ZM732.562 6H721.104V43.5H732.562V6ZM747.667 22.6667H736.208V43.5H747.667V22.6667Z';
function armarNav(cur = 0){
  const G = 'filter="url(#tlg)"';
  let s = `<svg class="tl" viewBox="0 0 750 104"><defs><filter id="tlg" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#F5F539"/></filter>` +
    TL_PNG.map((p,i) => p ? `<mask id="tlm${i}" maskUnits="userSpaceOnUse" x="${TL_IC[i]}" y="0" width="50" height="50" style="mask-type:alpha"><image href="assets/tl/${p}.png" x="${TL_IC[i]}" y="0" width="50" height="50"/></mask>` : '').join('') + '</defs>';
  for (let i = 0; i < 7; i++) { const x = 10 + 99.13*i, on = i < cur; s += `<line class="ln ${on ? 'on' : ''}" x1="${x+44}" y1="77.5" x2="${x+99.13}" y2="77.5" ${on ? G : ''}/>`; }
  CAPITULOS.forEach((c,i) => {
    const on = i <= cur, x = 10 + 99.13*i, gl = on ? G : '';
    const ico = i === 0 ? `<path class="ic" d="${TL_HOME}" ${gl}/>` : i === 7 ? `<path class="ic" d="${TL_CHART}" ${gl}/>` : `<rect class="ic" x="${TL_IC[i]}" y="0" width="50" height="50" mask="url(#tlm${i})" ${gl}/>`;
    s += `<g class="st ${on ? 'on' : ''}" data-go="${c.id}"><title>${c.titulo}</title>${ico}<rect class="bx" x="${x}" y="58" width="44.13" height="43.3"/>` +
      (on ? `<rect class="bs" x="${x+1}" y="59" width="42.13" height="41.3" ${G}/>` : '') + '</g>';
  });
  $('#nav').innerHTML = s + '</svg>';
}
/* 1914: 3 pasos con foco (click o scroll) */
let paso = 1;
function activarPaso(n){
  paso = Math.max(1, Math.min(3, n));
  $$('#pasos-1914 .paso').forEach(p => p.classList.toggle('on', +p.dataset.paso === paso));
}
/* ===== 1914: diagramas SVG de la máquina (pasos 1-3) ===== */
const chk = (x,y,s) => { let r=''; for(let i=0;i<8;i++) for(let k=0;k<8;k++) r += `<rect x="${x+i*s}" y="${y+k*s}" width="${s}" height="${s}" fill="${(i+k)%2?'#333':'#4a4a4a'}"/>`; return r; };
const rey = (x,y,c) => `<text x="${x}" y="${y}" font-size="15" text-anchor="middle" fill="${c}">♚</text>`;
const REYES = rey(67.5,103,'#fff') + rey(112.5,88,'#111');
const T = (x,y,t,c='') => `<text class="lb ${c}" x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
const MAQ = {
  1: chk(30,60,15) + REYES + `<circle cx="75" cy="135" r="9" fill="none" stroke="#f5ee3a" stroke-width="1.5"/><circle cx="75" cy="135" r="5" fill="none" stroke="#f5ee3a"/>` + T(90,190,'Entrada de información','y'),
  2: `<circle cx="35" cy="4" r="9" fill="none" stroke="#f5ee3a" stroke-width="1.3"/><text x="35" y="8" font-size="11" text-anchor="middle" fill="#f5ee3a">⚠</text>` +
      `<path d="M40 16H160M40 16V46M160 16V46" stroke="#ccc" stroke-width="2" fill="none"/><rect x="35" y="16" width="10" height="34" rx="5" fill="#ddd"/><rect x="155" y="16" width="10" height="34" rx="5" fill="#ddd"/>` + T(100,12,'Engranaje de unión') + T(22,40,'Filas') + T(178,40,'Columnas') +
      [40,60,80,110,140,160].map(x => `<line x1="${x<100?40:160}" y1="52" x2="${x}" y2="60" stroke="#aaa" stroke-width=".6"/>`).join('') + chk(30,60,15) + REYES +
      `<rect x="60" y="88" width="15" height="15" fill="none" stroke="#f5ee3a"/><circle cx="75" cy="135" r="10" fill="none" stroke="#f5ee3a" stroke-width="1.5"/>` + T(100,196,'Detección de la pieza','y'),
  3: `<circle cx="180" cy="16" r="13" fill="none" stroke="#f5ee3a" stroke-width="1.3"/><text x="180" y="21" font-size="14" text-anchor="middle" fill="#f5ee3a">⚙</text>` +
      `<rect x="22" y="52" width="136" height="136" fill="none" stroke="#666" stroke-width="4"/>` + chk(30,60,15) + REYES +
      `<rect x="108" y="92" width="72" height="5" fill="#fff"/><rect x="102" y="88" width="10" height="13" fill="#fff"/><rect x="172" y="52" width="12" height="136" rx="6" fill="#666"/><circle cx="178" cy="46" r="8" fill="#888"/><circle cx="178" cy="190" r="5" fill="#000"/>` +
      T(105,80,'Extremo imantado') + T(150,112,'Brazo móvil') + T(178,200,'Sistema de rieles') + T(100,45,'Ejecución de Jaque Mate','y')
};
$$('#pasos-1914 .paso').forEach(p => { $('.tablero', p).innerHTML = `<svg viewBox="0 0 200 205">${MAQ[p.dataset.paso]}</svg>`; });

/* Scroll: sub-pasos dentro de un capítulo (1914, Jeopardy) y luego entre capítulos */
const PASOS = {'cap-1914':{get:()=>paso, set:activarPaso, min:1, max:3}, 'jeopardy':{get:()=>jp, set:n=>activarJP(n), min:0, max:4}};
let bloqueo = false;
addEventListener('wheel', e => {
  if (bloqueo) return;
  const actual = $('.screen.active').id, dir = Math.sign(e.deltaY);
  if (!dir) return;
  bloqueo = true; setTimeout(() => bloqueo = false, 700);
  if (actual === 'ajedrez-intro') { if (dir > 0) mostrar('cap-1914'); else mostrar('home'); return; }
  const i = CAPITULOS.findIndex(c => c.id === actual);
  if (i < 1) return;
  const p = PASOS[actual];
  if (p && p.get() + dir >= p.min && p.get() + dir <= p.max) p.set(p.get() + dir);
  else if (CAPITULOS[i + dir]) mostrar(CAPITULOS[i + dir].id);
});
document.addEventListener('click', e => {
  const go = e.target.closest('[data-go]');
  if (go) mostrar(go.dataset.go);
  const p = e.target.closest('.paso');
  if (p) activarPaso(+p.dataset.paso);
});
/* ===== 1997: jugada elegida vs. planeación humana ===== */
const FEN97 = ['rnbqkbnr','pppp.ppp','........','....p...','...P....','........','PPP.PPPP','RNBQKBNR'];
const PZ = {r:'♜',n:'♞',b:'♝',q:'♛',k:'♚',p:'♟',R:'♖',N:'♘',B:'♗',Q:'♕',K:'♔',P:'♙'};
function dibujarTablero97(){
  $('#tab97').innerHTML = FEN97.map((f,y) => [...f].map((c,x) =>
    `<i class="${(x+y)%2?'osc':'cla'}">${PZ[c]||''}</i>`).join('')).join('');
}
function planHumana(jug){
  const cols = ['Atacar','Avanzar','Retroceder'], x = [45,95,145], i = cols.indexOf(jug);
  $('#j97-plan').innerHTML = `<svg viewBox="0 0 180 72"><line x1="12" y1="12" x2="12" y2="68" stroke="#f5ee3a"/>` +
    cols.map((c,k) => `<text class="lb" x="${x[k]}" y="9" text-anchor="middle">${c}</text>`).join('') +
    [24,42,60].map((y,t) => `<text class="lb" x="6" y="${y+2}" text-anchor="end">${t?'':'Turno'}</text>`).join('') +
    `<polyline points="95,24 ${x[i]},42 ${x[i]},60" fill="none" stroke="#fff" stroke-width="1"/><circle cx="95" cy="24" r="2.5" fill="#fff"/><circle cx="${x[i]}" cy="42" r="2.5" fill="#fff"/><circle cx="${x[i]}" cy="60" r="3" fill="#f5ee3a"/></svg>`;
}
$('#j97-btns').addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') return;
  const jugada = e.target.textContent;
  planHumana(jugada);
  $('#tab97').classList.remove('perdido');
  $('#j97-res').innerHTML = '';
  if (jugada === 'Atacar') { // supuesto: "Atacar" = misma jugada que la IA (pantalla Ajedrez 76)
    $('#j97-lbl').textContent = 'Utilizaste la misma jugada que la IA';
    $('#j97-txt').innerHTML = '<b class="y">Buen Movimiento</b>';
    return;
  }
  $('#j97-lbl').textContent = 'Planeación humana';
  $('#j97-txt').innerHTML = `elegiste <b class="y">${jugada}</b>`;
  setTimeout(() => {
    $('#j97-res').innerHTML = 'Kasparov pudo contrarrestar esta jugada.<br><b class="y">Caballo perdido</b>';
    $('#tab97').classList.add('perdido');
  }, 1200);
});
dibujarTablero97();

/* ===== 2016: tablero de Go 9x9, AlphaGo responde ===== */
const BUSCA = (() => { let s = '<div class="busca" hidden><svg viewBox="0 0 100 100"><g stroke="#fff" stroke-width=".8" fill="none">', n = '';
  for (let k = 0; k < 8; k++) { const a = k*Math.PI/4, x = 50+38*Math.cos(a), y = 50+38*Math.sin(a); s += `<path d="M50 50L${x.toFixed(1)} ${y.toFixed(1)}"/>`; n += `<circle class="nodo" style="animation-delay:${k*.12}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#fff"/>`; }
  return s + '</g>' + n + '<circle cx="50" cy="50" r="11" fill="#fff"/><text x="50" y="54" font-size="12" text-anchor="middle">🧠</text><text x="50" y="97" font-size="5.5" text-anchor="middle" fill="#222">Búsqueda web de jugadas</text></svg></div>'; })();
const N = 9;
function iniciarGo(){
  const g = $('#go'); g.innerHTML = '';
  g.insertAdjacentHTML('beforeend', BUSCA);
  for (let i = 0; i < N*N; i++) g.insertAdjacentHTML('beforeend', '<b></b>');
  $('#go-lbl').textContent = 'Colocá una pieza ●';
}
$('#go').addEventListener('click', e => {
  const c = e.target;
  if (c.tagName !== 'B' || c.className || $('#go').dataset.espera) return;
  c.className = 'w';
  const libres = $$('#go b:not([class])');
  if (!libres.length) return;
  $('#go').dataset.espera = 1;
  $('#go-lbl').textContent = 'Búsqueda web de jugadas…'; $('#go .busca').hidden = false;
  setTimeout(() => {
    libres[Math.floor(Math.random()*libres.length)].className = 'k';
    $('#go .busca').hidden = true; delete $('#go').dataset.espera;
    $('#go-lbl').textContent = '(AlphaGo recordará este movimiento)';
  }, 1600);
});
$('#go-reset').addEventListener('click', iniciarGo);
$('#go-dots').innerHTML = Array.from({length:100}, (_,i) => `<i class="${i === 37 ? 'sel' : ''}"></i>`).join('');
$('#go-tabs').addEventListener('click', e => {
  const t = e.target.dataset.t; if (t === undefined) return;
  $$('#go-tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === t));
  $('#go-p0').hidden = t !== '0'; $('#go-p1').hidden = t === '0';
  $('#go-t1').textContent = t === '1' ? 'Probabilidad de las jugadas' : 'Elección de las jugadas';
});
iniciarGo();

/* ===== Helpers: barras y línea de tiempo ===== */
function barras(el, filas){
  el.innerHTML = filas.map(f => `<div class="fila"><span>${f[0]}</span><div class="barra"><i class="${f[2] >= 95 ? 'top' : ''} ${f[3] || ''}" style="width:${f[2]}%"></i></div>${f[1] ? `<em>${f[1]}</em>` : ''}</div>`).join('');
}
function linea(el, etiquetas, cb, prefijo){
  el.innerHTML = (prefijo ? `<span class="dia">${prefijo}</span>` : '') + etiquetas.map((t,i) => `<button data-i="${i}"><i></i>${t}</button>`).join('');
  const set = n => { $$('button', el).forEach((b,i) => b.classList.toggle('on', i <= n)); cb(n); };
  el.onclick = e => { const b = e.target.closest('button'); if (b) set(+b.dataset.i); };
  set(0);
}

/* ===== Jeopardy 2011 ===== */
const CATS = ['A MAN, A PLAN, A CANAL…ERIE!', 'CHICKS DIG ME', "CHILDREN'S BOOK TITLES"];
const GAN = [['w','w','w','w','k'], ['b','k','k','k','w'], ['b','k','w','b','w']]; // k=Ken w=Watson b=Brad
const JP_PTS = [['','',''], ['+ $1000','+ $2000','+ $0'], ['+ $1800','+ $1000','+ $200'], ['+ $400','+ $1600','+ $1000'], ['$3400','$4400','$1200']];
const JP_QUIEN = [['Ken Jennings','k','👤'], ['IBM Watson','w','🖥'], ['Brad Rutter','b','👤']];
const JP_TXT = [
  'La máquina ya no necesitaba limitarse a un tablero: podía interpretar lenguaje natural y responder preguntas en el juego televisivo “Jeopardy!”',
  'En la categoría “A man, a plan, a canal…erie!” <b class="w">Watson</b> fue el que más respuestas correctas tuvo.',
  'En la categoría “Chicks dig me” <b class="k">Ken Jennings</b> fue el que más respuestas correctas tuvo',
  'En la categoría “Children’s book titles” tanto <b class="w">Watson</b> como <b class="b">Brad Rutter</b> tuvieron la misma cantidad de respuestas correctas.',
  'Al finalizar la ronda, los resultados quedaron así: <br><br>Podés ver la ronda completa acá: <a class="y" target="_blank" href="https://youtu.be/WFR3lOm_xhE">youtu.be/WFR3lOm_xhE</a>',
];
let jp = 0;
function activarJP(n){
  jp = n;
  $('#jp-txt').innerHTML = JP_TXT[n];
  $('#jp-conc').innerHTML = JP_QUIEN.map((q,i) => `<div class="conc ${q[1]}"><em>${JP_PTS[n][i]}</em><span class="av">${q[2]}</span><div class="atril"></div><b>${q[0]}</b></div>`).join('');
  if (n === 4) $('#jp-conc').innerHTML = `<div class="podio">${JP_QUIEN.map((q,i) => `<div class="pd p${i}"><b class="${q[1]}">${q[0]}<br>(${JP_PTS[4][i]})</b><span class="av">${q[2]}</span><div class="blq"></div></div>`).join('')}</div>`;
  $('#jp-tab').innerHTML = CATS.map((c,ci) => `<div class="jc ${n === ci+1 ? 'sel' : ''}">${c}</div>`).join('') +
    [0,1,2,3,4].map(r => CATS.map((c,ci) => {
      const s = (ci === n-1 || n === 4) ? GAN[ci][r] : '';
      return `<div class="jv ${s}">${n === 0 || s ? '$' + (r+1)*200 : ''}</div>`;
    }).join('')).join('');
}

/* ===== 2017 Libratus: adivinar la carta ♥ (3 rondas) ===== */
const lib = {r:0, ok:0, h:0, esp:false};
const APUESTAS = [['Libratus','-$10K',5], ['Dong Kim','-$200K',100], ['Jason Les','-$100K',55], ['Jimmi Chou','-$100K',50], ['Daniel','-$100K',50]];
function libRonda(){
  lib.h = Math.floor(Math.random()*3); lib.esp = false;
  $('#lib-cartas').innerHTML = '<button class="carta" data-i="0"></button><button class="carta" data-i="1"></button><button class="carta" data-i="2"></button>';
  $('#lib-txt').innerHTML = `Adiviná la carta <span class="rojo">♥</span> de Libratus ${lib.r+1}/3`;
  $('#lib-fin').textContent = '';
}
function libFinal(){
  const todo = lib.ok === 3; lib.r = 0; lib.ok = 0;
  $('#lib-cartas').innerHTML = '<div class="flujo">AI ⟶ ⚠ ⟶ 🧠 ⟶ ✓</div>';
  $('#lib-txt').innerHTML = `${todo ? '¡Adivinaste todo! <span class="rojo">♥</span>' : 'No lograste divinar todo'}<button class="rehacer" id="lib-rehacer" title="Reintentar">↻</button>`;
  $('#lib-fin').innerHTML = 'Libratus aprendió de sus errores<br><button class="reiniciar" id="lib-re">Reintentar</button>';
  $('#lib-rehacer').onclick = $('#lib-re').onclick = libRonda;
}
$('#lib-cartas').addEventListener('click', e => {
  const b = e.target.closest('.carta'); if (!b || lib.esp) return;
  lib.esp = true;
  const i = +b.dataset.i, palos = ['♣','♠']; let k = 0;
  if (i === lib.h) lib.ok++;
  $$('#lib-cartas .carta').forEach((c,j) => {
    c.classList.add('vista'); c.classList.toggle('elegida', j === i);
    c.innerHTML = j === lib.h ? '<span class="rojo">♥</span>' : palos[k++ % 2];
  });
  $('#lib-fin').textContent = i === lib.h ? '¡Acertaste!' : 'Perdiste… Libratus aprendió de tu elección';
  setTimeout(() => { if (++lib.r < 3) libRonda(); else libFinal(); }, 1500);
});
libRonda();
linea($('#lib-linea'), ['5','10','15','20'], n => barras($('#lib-barras'), APUESTAS.map((f,i) => [f[0], f[1], f[2]*(n+1)/4, 'p'+i])), 'Día');

/* ===== 2018 OpenAI Five: partidas por unidad de tiempo ===== */
const OA = [['1 Seg','24,5 partidas','0 partidas',1,0], ['1 Min','1.460 partidas','0 partidas',3,0], ['1 Hora','87.600 partidas','1,5 partidas',8,1], ['1 Día','3.000.000 partidas','3 partidas',16,2]];
let vos = null; // {p: partidas, pads: iconos} según el tiempo elegido (supuesto: 3 / 12 / 24 partidas)
const TIEMPOS = [['1-3 horas','3 partidas',1],['4-6 horas','12 partidas',3],['7-12 horas','24 partidas',6]];
function graficoOA(n){
  const o = OA[n], v = n === 3 && vos ? vos : {t:o[2], p:o[4]};
  $('#oa-graf').innerHTML = `<div class="fila"><span>OpenAI</span><div class="pads">${'🎮'.repeat(o[3])}</div><em>${o[1]}</em></div><div class="fila"><span class="y">Vos</span><div class="pads">${'🎮'.repeat(v.p)}</div><em>${v.t}</em></div>` +
    (n === 3 ? `<p class="y" style="margin-top:1rem">Si tuvieras todo el día libre… ¿cuánto tiempo jugarías?</p><div class="btns" id="oa-t">${TIEMPOS.map((t,i) => `<button data-i="${i}">${t[0]}</button>`).join('')}</div>` : '');
}
linea($('#oa-linea'), OA.map(o => o[0]), graficoOA);
$('#oa-graf').addEventListener('click', e => {
  const b = e.target.closest('#oa-t button'); if (!b) return;
  const t = TIEMPOS[+b.dataset.i]; vos = {t:t[1], p:t[2]}; graficoOA(3);
});

/* ===== Resumen: barras por pestaña (valores aproximados del Figma) ===== */
const RN = ['⚙ Ajedrecista','♜ DeepBlue','▤ Watson','◍ AlphaGo','🂡 Libratus','🎮 OpenIAFive'];
const RES = {calculo:[8,100,70,85,90,70], aprendizaje:[1,5,70,100,90,100], busqueda:[3,100,85,85,100,10]};
function tabResumen(k){
  $$('#res-tabs button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  barras($('#res-barras'), RN.map((n,i) => [n, '', RES[k][i]]));
}
$('#res-tabs').addEventListener('click', e => { if (e.target.dataset.k) tabResumen(e.target.dataset.k); });
tabResumen('calculo');

/* ===== Nobby: "¿Cuándo empezó la IA a entendernos?" (pantallas del zip) ===== */
let nbId = 'intro', nbHist = []; const nbVis = new Set();
const CAB = {
  term:'<h4>ELIZA</h4>',
  parry:'<div class="rfc"><span>Network Working Group<br>Request for comments: 287<br>NIC: 4311</span><span>ICEMT<br>SU-ERL<br>21 January 1973</span></div><h4>PARRY</h4>',
  jabb:'<img class="jl" src="assets/nobby/jabb-logo.png" alt="jabberwacky.com"><img class="ja" src="assets/nobby/jabb-avatar.png" alt="Jabberwacky">'};
const P1 = 'Buen dia.<br>Contame tus problemas. Por favor, termina el mensaje con un punto o signo de pregunta.';
const P2 = 'Fui desarrollado en 1972 por el psiquiatra Kenneth Colby, en Stanford. Mi objetivo era simular mediante computadora a una persona con pensamiento paranoide.';
const P3 = '*¿Podes entenderme?<br><br>¿Por qué queres saber eso?';
const PJ = [['¿Quien es Jabb?','sigJ'],['¿Quien es Alice?','sigA']];
const EL = 'ELIZA:Hola soy ELIZA un programa creado por Joseph Weizenbaum en el MIT capaz de mantener conversaciones escritas con personas.';
const JH = 'Hola, soy Jabberwacky, de que te gustaria hablar?';
const ALICE_LOGO = '<svg viewBox="0 0 100 100" class="alice-logo-svg"><defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a5cf0"/><stop offset="1" stop-color="#3ac2e6"/></linearGradient></defs><path d="M50 8C74 8 90 30 90 55 90 80 70 92 50 92 30 92 10 80 10 55 10 30 26 8 50 8Z" fill="none" stroke="url(#ag)" stroke-width="8"/></svg>';
const WAVE = '<svg viewBox="0 0 60 40" class="wave-ic"><g fill="#3ac2e6"><rect x="0" y="14" width="6" height="12" rx="3"/><rect x="10" y="8" width="6" height="24" rx="3"/><rect x="20" y="2" width="6" height="36" rx="3"/><rect x="30" y="10" width="6" height="20" rx="3"/><rect x="40" y="6" width="6" height="28" rx="3"/><rect x="50" y="12" width="6" height="16" rx="3"/></g></svg>';
// c = tipo de pantalla · b = burbujas ("@img" = imagen) · t = texto del panel · btn = [texto, destino, clase] · bd = botones a la derecha · art = imágenes · say = texto amarillo
const NB = {
  intro:{c:'chat', b:['Hola! soy Nobby, un chatbot y hoy quiero contarte sobre nosotros','¿Por dónde empezamos?'], btn:[['¿Cuándo nacieron?','turing'],['¿Como funcionan?','nodos']], art:['nobby-big']},
  turing:{c:'chat', b:['Alan Turing propone una prueba para evaluar si una máquina puede hacerse pasar por un humano mediante una conversación.','@turing-foto','Este es el inicio de todo'], bd:1,
    btn:[['¿Como funcionan?','nodos'],['¿Cual fue el primero?','eliza']], say:'¡Sigamos explorando!', art:['nobby-dato','nobby-lee']},
  eliza:{c:'term', t:[EL], btn:[['¿Podes entenderme?','eliza2']], say:'Te presento a ELIZA!', art:['nobby-eliza']},
  eliza2:{c:'term', t:[EL,'USUARIO:¿Podes entenderme?.','ELIZA:No entiendo realmente lo que decís.<br>Busco palabras clave, detecto patrones y transformo tu frase en una respuesta siguiendo reglas preestablecidas.','ELIZA:Quizas Parry o Jabb si puedan.'], btn:[['¿Quien es Parry?','furby'],['¿Quien es Jabb?','jabb']]},
  parry:{c:'parry', t:[P1], btn:[['Contame sobre vos.','parry2']], say:'El es Parry, es un poco complicado pero es bueno', art:['nobby-parry']},
  parry2:{c:'parry', t:[P1,'*Contame sobre vos.',P2], btn:[['¿Podes entenderme?','parry3']]},
  parry3:{c:'parry', t:[P2,P3], btn:[['Por curiosidad.','parryCur'],['Para conocerte.','parryCon']]},
  parryCon:{c:'parry', t:[P3,'*Para conocerte.','No me interesa que me conozcas, hablá con Jabb o Alice mejor.'], btn:PJ},
  parryCur:{c:'parry', t:[P3,'*Por curiosidad.','Al igual que ELIZA, funciono mediante reglas y procesamiento simbólico, pero incorporo algo más elaborado: un modelo de creencias y estados internos que influye en mis respuestas. Por eso puedo mantener una personalidad más consistente durante una conversación.','Ya me cansé, habla con Jabb o Alice.'], btn:PJ},
  jabb:{c:'jabb', t:[JH], btn:[['¿Quien te creo?','jabb2']], say:'Hola Jabb!<br>Este es uno de mis favoritos', art:['nobby-jabb']},
  jabb2:{c:'jabb', t:[JH,'¿Quien te creo?','Fui creado por Rollo Carpenter en 1988 aunque estoy disponible en internet desde 1997 soy un chatbot conversacional basado en aprendizaje a partir de interacciones.'], btn:[['¿Como funcionas?','jabb3'],['¿Me entiendes?','jabb4']]},
  jabb3:{c:'jabb', t:['¿Como funcionas?','Guardo conversaciones anteriores y utilizo esas interacciones como una base de datos para generar nuevas respuestas. Cuando una persona escribe algo, busco conversaciones previas con frases o contextos similares y selecciono una respuesta que pueda encajar.'], btn:[['¿Tenes voz?','jabb5']]},
  jabb4:{c:'jabb', t:['¿Me entiendes?','No comprendo el significado de las palabras ni construyo las respuestas desde una comprensión semántica del lenguaje. Mi funcionamiento depende de encontrar asociaciones y respuestas almacenadas antes. Por eso puedo producir respuestas sorprendentemente humanas, pero también respuestas absurdas o fuera de contexto.'], btn:[['¿Tenes voz?','jabb5']]},
  jabb5:{c:'jabb', t:['¿Tenes voz?','Lamentablemente mi modelo no cuenta con voz que puedas escuchar.<br>Pero Alice puede ayudarte con eso.'], btn:[['¿Quien es ALICE?','sigA']]},
  furby:{c:'chat', b:['En 1998 Dave Hamptom y Caleb Chung crean Furby, la primera mascota robótica doméstica','@furby-video','Este video te cuenta todo'], bd:1,
    say:'¡Sigamos explorando!<br>Ahora quiero presentarte a Parry.', btn:[['Conocer a Parry.','sigP']], art:['nobby-furby']},
  nodos:{c:'chat', b:['Como todas las IAs en general, usamos redes neuronales, conectando distintos nodos de información','Aca podés explorar algunos'], btn:[['Seguir explorando →','@jeopardy']], art:['nodos','nobby-nodos']},

  /* ¿Cuándo empezó la IA a entendernos? → ALICE (voz) */
  alice:{c:'alice', logo:true, t:['Hola! Soy ALice tu asistente virtual.'], btn:[['Reproducir voz','alice2']]},
  alice2:{c:'alice', audio:true, t:['Alice AI (Алиса) es un asistente virtual desarrollado por Yandex y presentado en 2017. Inicialmente funcionaba como asistente para tareas como búsquedas, clima y conversación, pero posteriormente evolucionó hacia sistemas basados en modelos neuronales y capacidades generativas.'], btn:[['¿Sos la unica que tiene voz?','alice3']]},
  alice3:{c:'alice', audio:true, q:'¿Sos la unica que tiene voz?', t:['En la actualidad, la mayoria de chatbots podemos entender voces humanas, podemos leer textos en voz alta, y nuestras versiones mas modernas pueden conversar con naturalidad con cualquier ser humano.','Te dejo con el experto en eso.'], say:'¡Al fin llegamos!<br>Conozcamos al mas moderno.', art:['alice-masc'], btn:[['Conocer a ChatGPT','chatgpt']]},

  /* ChatGPT + resúmen final */
  chatgpt:{c:'gpt', t:['¡Hola! 👋 soy ChatGPT.','Estuve viendo que estuviste recorriendo la historia de los chatbots y descubriste cómo fueron cambiando con el tiempo.','Desde las primeras conversaciones basadas en reglas hasta las inteligencias artificiales capaces de generar texto, imágenes y mucho más.','¿En qué te gustaría profundizar?'], btn:[['Haceme un resúmen','nbres1']]},
  nbres1:{c:'gpt', q:'Haceme un resúmen', t:['Genial, empecemos por ELIZA.','Contaba con:','• 50 palabras clave que podía reconocer','• 128 espacios para organizarlas','La poca cantidad hacia que las respuestas se sientan vacías con el tiempo.'], chart:'res1', btn:[['¿Y si agregamos mas palabras y reglas?','nbres2']]},
  nbres2:{c:'gpt', q:'¿Y si agregamos mas palabras y reglas?', t:['Ahi es cuando empiezan a tener “personalidad” y naturalizar su lenguaje.','En una prueba de 1972, 33 psiquiatras tuvieron que distinguir entre transcripciones de personas reales y PARRY.','PARRY simulaba el comportamiento de una persona con paranoia mediante un modelo de creencias y estrategias conversacionales.'], chart:'res2', btn:[['¿Y despues que vino?','nbres3']]},
  nbres3:{c:'gpt', q:'¿Y despues que vino?', t:['Apareció una nueva idea: ¿y si el chatbot pudiera aprender de las conversaciones que tenía?','Jabberwacky empezó online en 1997 con unas 20.000 entradas y alcanzó 1 millón de interacciones en 2003.','Su creador, Rollo Carpenter, describió justamente la idea como un ciclo de retroalimentación: las conversaciones de hoy ayudaban a construir las de mañana.'], chart:'res3', btn:[['¿Y en mayor escala?','nbres4']]},
  nbres4:{c:'gpt', q:'¿Y en mayor escala?', t:['Más reglas significaban más posibilidades de conversación…','Una fuente académica describe a ALICE con más de 40.000 categorías de conocimiento, frente a unas 200 en ELIZA.'], chart:'res4', btn:[['¿Y en la actualidad?','nbres5']]},
  nbres5:{c:'gpt', q:'¿Y en la actualidad?', t:['Llegamos a un cambio importante: los chatbots ya no solo buscan una respuesta. Ahora pueden generarla a partir del contexto.','OpenAI señala que alcanzó 1 millón de usuarios en 5 días y 100 millones en 2 meses desde su lanzamiento.'], chart:'res5', say:'Llegamos a la actualidad!<br>Espero que hayas disfrutado el viaje', art:['resumen-masc'], btn:[['Volver al inicio.','@home']]},
};
const NB_DEST = { sigJ:() => nbVis.has('jabb') ? 'nodos' : 'jabb', sigP:() => nbVis.has('parry') ? 'nodos' : 'parry', sigA:() => nbVis.has('alice') ? 'nodos' : 'alice' };
/* ===== gráficos del resúmen de ChatGPT ===== */
function gptBars(el, filas){ el.innerHTML = `<div class="gb">${filas.map(f => `<div class="gb-row"><span>${f[0]}</span><div class="gb-bar"><i style="width:${f[1]}%"></i></div></div>`).join('')}</div>`; }
function gptPie(el, pct, leg){ el.innerHTML = `<div class="gb-pie" style="background:conic-gradient(#3a5fc9 0 ${pct}%, #6b6b6b ${pct}% 100%)"></div><div class="gb-leg">${leg.map(l => `<span><i></i>${l}</span>`).join('')}</div>`; }
function gptLine(el, pts, xl){
  const W = 560, H = 200, pad = 36, maxV = Math.max(...pts);
  const xs = pts.map((_,i) => pad + i*((W-pad-10)/(pts.length-1)));
  const ys = pts.map(v => H-pad-(v/maxV)*(H-pad-14));
  const poly = xs.map((x,i) => `${x},${ys[i]}`).join(' ');
  const gY = [0,.25,.5,.75,1].map(k => { const y = H-pad-k*(H-pad-14); return `<line x1="${pad}" y1="${y}" x2="${W-6}" y2="${y}" stroke="#2a2a2a"/><text x="2" y="${y+3}" font-size="9" fill="#888">${Math.round(maxV*k/1000)}k</text>`; }).join('');
  const gX = xl.map((l,i) => `<text x="${xs[i]}" y="${H-10}" font-size="9" fill="#888" text-anchor="middle">${l}</text>`).join('');
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="gline">${gY}${gX}<polyline points="${poly}" fill="none" stroke="#3a5fc9" stroke-width="2"/>${xs.map((x,i) => `<circle cx="${x}" cy="${ys[i]}" r="3.5" fill="#3a5fc9"/>`).join('')}</svg>`;
}
const GCHART = {
  res1: el => gptBars(el, [['Palabras clave', 25], ['Posiciones del diccionario', 75]]),
  res2: el => gptPie(el, 52, ['No acertaron (52%)', 'Acertaron (48%)']),
  res3: el => gptLine(el, [20000, 350000, 650000, 950000], ['1997', '1999', '2001', '2003']),
  res4: el => gptBars(el, [['ELIZA', 1], ['A.L.I.C.E.', 92]]),
  res5: el => gptLine(el, [1000, 30000000, 65000000, 100000000], ['Día 5', 'Semana 3', 'Semana 6', 'Mes 2']),
};
const nbImg = n => `<img class="nbi" src="assets/nobby/${n}.png" alt="">`;
function nb(id, atras){
  const s = NB[id]; if (!s) return;
  if (!atras && id !== nbId) nbHist.push(nbId);
  nbId = id;
  if (id.startsWith('parry')) nbVis.add('parry'); if (id.startsWith('jabb')) nbVis.add('jabb'); if (id.startsWith('alice')) nbVis.add('alice');
  const btns = `<div class="nb-btns">${(s.btn || []).map(b => `<button class="nb-b ${b[2] || ''}" data-nb="${b[1]}">${b[0]}</button>`).join('')}</div>`;
  const say = s.say ? `<p class="say">${s.say}</p>` : '', art = (s.art || []).map(nbImg).join('');
  if (s.c === 'chat') {
    $('#nb-body').innerHTML = `<div class="nb-izq">${s.b.map(x => x[0] === '@' ? `<div class="burb im">${nbImg(x.slice(1))}</div>` : `<div class="burb">${x}</div>`).join('')}${s.bd ? '' : btns}</div><div class="nb-der">${say}${s.bd ? btns : ''}${art}</div>`;
  } else if (s.c === 'gpt') {
    $('#nb-body').innerHTML = `<div class="gpt-wrap">${s.q ? `<div class="gpt-q">${s.q}</div>` : ''}<div class="gpt-a">${s.t.map(x => `<p>${x}</p>`).join('')}${s.chart ? '<div class="gchart"></div>' : ''}</div>${s.say ? `<div class="gpt-masc">${art}<p class="say">${s.say}</p></div>` : ''}${btns}</div>`;
    if (s.chart) GCHART[s.chart]($('#nb-body .gchart'));
  } else if (s.c === 'alice') {
    $('#nb-body').innerHTML = `<div class="alice-wrap ${s.logo ? 'centro' : ''}">${s.q ? `<div class="gpt-q">${s.q}</div>` : ''}${s.logo ? `<div class="alice-logo">${ALICE_LOGO}</div>` : ''}${s.audio ? `${WAVE}<p class="transc">(transcripción de audio)</p>` : ''}<div class="alice-a">${s.t.map(x => `<p>${x}</p>`).join('')}</div>${s.say ? `<div class="gpt-masc">${art}<p class="say">${s.say}</p></div>` : ''}${btns}</div>`;
  } else {
    $('#nb-body').innerHTML = `<div class="nb-lado">${say}${art}</div><div class="pnl ${s.c}"><div class="cab">${CAB[s.c]}</div><div class="txt">${s.t.map(x => `<p>${x}</p>`).join('')}</div>${btns}</div><div class="nb-lado"></div>`;
  }
  $('#nb-body').className = 'nb-body ' + s.c;
}
$('#nobby').addEventListener('click', e => {
  const b = e.target.closest('[data-nb]'); if (!b) return;
  const t = b.dataset.nb, d = NB_DEST[t] ? NB_DEST[t]() : t;
  d[0] === '@' ? mostrar(d.slice(1)) : nb(d);
});
$('#nb-back').addEventListener('click', () => nbHist.length ? nb(nbHist.pop(), true) : mostrar('home'));

mostrar(location.hash.slice(1) || 'home');
