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

/* ===== Navegación Nobby (pantallas n-*) ===== */
let nActual = null, nPila = [], nVolviendo = false;
function ajustarNobby(){
  $('#nobby').style.setProperty('--k', Math.min(innerWidth/1920, innerHeight/1080));
}
function nobbyMostrar(id){
  const el = document.getElementById(id);
  if (!el || !el.classList.contains('ns')) return false;
  if (nActual && nActual !== id && !nVolviendo) nPila.push(nActual);
  if (!nActual) nPila = [];
  nActual = id;
  $$('#nobby .ns').forEach(s => s.classList.toggle('on', s === el));
  $('#nobby').style.background = el.dataset.bg;
  $('.ngraph').hidden = el.hasAttribute('data-nograph');
  ajustarNobby();
  return true;
}
addEventListener('resize', ajustarNobby);
document.addEventListener('click', e => {
  if (!e.target.closest('[data-back]')) return;
  nVolviendo = true;
  mostrar(nPila.length ? nPila.pop() : 'home');
  nVolviendo = false;
});

function mostrar(id){
  const esN = id.startsWith('n-');
  if (esN && !nobbyMostrar(id)) { id = 'home'; }              // pantallas del chatbot (n-*)
  const pantalla = id.startsWith('n-') ? 'nobby' : id;
  if (!id.startsWith('n-')) { nActual = null; nPila = []; }
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === pantalla));
  const cur = CAPITULOS.findIndex(c => c.id === id);
  $('#nav').hidden = cur < 1;              // sin línea de tiempo en home, intro y chatbot
  if (cur >= 1) armarNav(cur);
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
  $('#jp-foto').hidden = n !== 0;
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
  $('#lib-cartas').innerHTML = [0,1,2].map(i => `<button class="carta" data-i="${i}"><span class="giro"><span class="cara atras"></span><span class="cara frente"></span></span></button>`).join('');
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
    $('.frente', c).innerHTML = j === lib.h ? '<span class="rojo">♥</span>' : palos[k++ % 2];
    c.classList.toggle('elegida', j === i);
    setTimeout(() => c.classList.add('vista'), j*120);          // las cartas se dan vuelta una tras otra
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

/* menú del Dota (Early game / Starting items / Late game) */
$('#dota-menu').addEventListener('click', e => {
  const b = e.target.closest('.dota-b'); if (!b) return;
  $$('#dota-menu .dota-b').forEach(x => x.classList.toggle('on', x === b));
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

mostrar(location.hash.slice(1) || 'home');

/* ===== Nobby: gráficos de las pantallas "Resumen" (SVG generados con datos) ===== */
(function(){
  const T = (x,y,t,sz,o={}) => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${o.a||'start'}"${o.b?' font-weight="700"':''} fill="#fff">${t}</text>`;
  const GH = (x1,x2,y) => `<line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="#2c2c2c" stroke-dasharray="1 3"/>`;
  const GV = (x,y1,y2) => `<line x1="${x}" x2="${x}" y1="${y1}" y2="${y2}" stroke="#2c2c2c" stroke-dasharray="1 3"/>`;
  const DEFS = '<defs><linearGradient id="gbar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f4d93"/><stop offset="1" stop-color="#1c4786"/></linearGradient></defs>';
  const LINE = '#1d4a8f';
  const dot = (x,y) => `<circle cx="${x}" cy="${y}" r="4.6" fill="#1f4e97" stroke="#22304a" stroke-width="2"/>`;
  const svg = (w,h,inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Roboto,'Segoe UI',sans-serif">${DEFS}${inner}</svg>`;

  const CHARTS = {
    /* ELIZA: 50 palabras clave / 128 posiciones del diccionario */
    1: () => {
      const y = v => 236 - v/140*179;
      let s = T(6,15,'Dentro de ELIZA',11.2,{b:1}) + T(6,35,'Dos cifras que muestran cómo estaba estructurado el sistema de palabras clave de ELIZA en 1966.',9.2);
      [0,35,70,105,140].forEach(v => { s += GH(36,505,y(v)) + T(30,y(v)+3.5,v,9.2,{a:'end'}); });
      [[113,50,'Palabras clave'],[345,128,'Posiciones del diccionario']].forEach(([x,v,l]) => {
        s += `<rect x="${x}" y="${y(v)}" width="80" height="${236-y(v)}" rx="6" fill="url(#gbar)"/>` + T(x+40,251,l,9.2,{a:'middle'});
      });
      return svg(508,256,s);
    },
    /* PARRY: 33 psiquiatras, 52% no acertaron */
    2: () => {
      const cx=228, cy=143, r=139, a=2*Math.PI*0.48;
      const px = cx + r*Math.sin(a), py = cy - r*Math.cos(a);
      return svg(495,341,
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#384871"/>` +
        `<path d="M${cx} ${cy} L${cx} ${cy-r} A${r} ${r} 0 0 1 ${px.toFixed(1)} ${py.toFixed(1)} Z" fill="#444"/>` +
        `<circle cx="19" cy="321" r="14.5" fill="#384871"/><circle cx="299" cy="321" r="14.5" fill="#444"/>` +
        T(39,329,'No acertaron (52%)',22.5) + T(319,329,'Acertaron (48%)',22.5));
    },
    /* Jabberwacky: 20.000 entradas (1997) -> 1 millón (2003) */
    3: () => {
      const y = v => 349 - v/1200000*293;
      let s = T(6,19,'Evolución de las entradas/interacciones mencionadas por Rollo Carpenter.',14.8);
      [[0,'0'],[300000,'300 k'],[600000,'600 k'],[900000,'900 k'],[1200000,'1.2 M']].forEach(([v,l]) => { s += GH(63,818,y(v)) + T(52,y(v)+(v===1200000?9:4),l,11.5,{a:'end'}); });
      [[75.8,'1997'],[316,'1,999'],[557,'2,001'],[800,'2003']].forEach(([x,l]) => s += T(x,368,l,11.5,{a:'middle'}));
      return svg(820,377, s + `<line x1="75.8" y1="${y(20000)}" x2="800" y2="${y(1000000)}" stroke="${LINE}" stroke-width="2.2"/>` + dot(75.8,y(20000)) + dot(800,y(1000000)));
    },
    /* ELIZA (200) vs A.L.I.C.E. (40.000) */
    4: () => {
      const x = v => 73.5 + v/45000*687.5;
      let s = T(6,19,'De 200 a más de 40.000',16.6,{b:1}) + T(6,48,'Comparación aproximada de categorías de conocimiento entre ELIZA y A.L.I.C.E.',14.4);
      [[0,'0',73],[15000,'15 k',303],[30000,'30 k',532.5],[45000,'45 k',756]].forEach(([v,l,lx]) => { s += GV(x(v),82,345) + T(lx,362,l,11.5,{a:'middle'}); });
      s += T(64,151,'ELIZA',11,{a:'end'}) + T(63,279,'A.L.I.C.E.',11,{a:'end'});
      s += `<rect x="73.5" y="122" width="4" height="48" rx="2" fill="#1f4d93"/><rect x="73.5" y="252" width="${(x(40000)-73.5).toFixed(1)}" height="49" rx="9" fill="url(#gbar)"/>`;
      return svg(774,367,s);
    },
    /* ChatGPT: 0 -> 1 M (día 5) -> 100 M (día 60) */
    5: () => {
      const y = v => 332 - v/120*256, x = d => 70 + d*(628/60);
      let s = T(6,19,'ChatGPT: millones en cuestión de semanas',14.8,{b:1}) + T(6,45,'Hitos iniciales de adopción reportados por OpenAI.',13.2);
      [0,30,60,90,120].forEach(v => { s += GH(60,716,y(v)) + T(50,y(v)+(v===120?8:4),v?v+' M':'0',11.2,{a:'end'}); });
      [0,15,30,45,60].forEach(d => s += T(x(d),350,d,11.2,{a:'middle'}));
      const pts = [[0,0],[5,1],[60,100]];
      return svg(716,356, s + `<polyline points="${pts.map(p=>x(p[0]).toFixed(1)+','+y(p[1]).toFixed(1)).join(' ')}" fill="none" stroke="${LINE}" stroke-width="2.2"/>` + pts.map(p=>dot(x(p[0]),y(p[1]))).join(''));
    },
  };
  document.querySelectorAll('#nobby .chart').forEach(el => { el.innerHTML = CHARTS[el.dataset.chart](); });
})();
