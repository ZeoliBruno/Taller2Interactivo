/* =========================================================================
   Infografía interactiva — Evolución de la IA (a través del ajedrez)
   Estructura: 8 "movimientos" (1914 → 2018). Cada movimiento tiene:
     - una vista narrativa (año, título, texto, cita de la jugada)
     - una vista interactiva (foto, texto, casilla para hacer click)
   La partida está reconstruida con reglas de ajedrez válidas para poder
   animar cada pieza de una casilla a otra con precisión.
   ========================================================================= */

(function(){

  /* ---------------------------------------------------------------------
     1. Piezas: dibujadas en SVG plano (mismo estilo que el ícono del home)
     --------------------------------------------------------------------- */
  const PIECE_PATHS = {
    p: '<circle cx="50" cy="28" r="13"/><path d="M37 44c3-6 23-6 26 0l6 18c-12-5-26-5-38 0z"/><rect x="27" y="80" width="46" height="9" rx="3"/><rect x="19" y="90" width="62" height="8" rx="3"/>',
    r: '<rect x="29" y="16" width="9" height="15"/><rect x="46" y="16" width="9" height="15"/><rect x="63" y="16" width="9" height="15"/><rect x="27" y="29" width="47" height="13"/><path d="M31 42h39l-4 34h-31z"/><rect x="26" y="79" width="49" height="9" rx="3"/><rect x="18" y="90" width="65" height="8" rx="3"/>',
    n: '<path d="M66 14c-16-6-33 1-38 16-3 8-1 15 4 20-7 4-12 10-14 18l-3 12h14l2-9c2-7 7-12 14-14l7-2 5 9-8 5 4 9h29l2-13c2-11-2-21-10-27l3-10c2-6-1-13-6-16z"/><circle cx="57" cy="27" r="2.6" fill="#00000055"/><rect x="26" y="80" width="49" height="9" rx="3"/><rect x="18" y="90" width="65" height="8" rx="3"/>',
    b: '<circle cx="50" cy="17" r="5.5"/><path d="M50 26c15 9 21 24 16 39-3 9-10 15-16 19-6-4-13-10-16-19-5-15 1-30 16-39z"/><rect x="41" y="66" width="18" height="10" rx="2"/><rect x="27" y="80" width="46" height="9" rx="3"/><rect x="19" y="90" width="62" height="8" rx="3"/>',
    q: '<circle cx="27" cy="24" r="6"/><circle cx="50" cy="14" r="6.5"/><circle cx="73" cy="24" r="6"/><circle cx="38" cy="17" r="5"/><circle cx="62" cy="17" r="5"/><path d="M27 30h46l-6 40h-34z"/><rect x="27" y="72" width="46" height="9" rx="3"/><rect x="19" y="90" width="62" height="8" rx="3"/>',
    k: '<rect x="46" y="6" width="8" height="16" rx="2"/><rect x="39" y="12" width="22" height="7" rx="2"/><circle cx="50" cy="30" r="6"/><path d="M50 36c13 8 18 22 14 35-3 8-9 13-14 17-5-4-11-9-14-17-4-13 1-27 14-35z"/><rect x="27" y="80" width="46" height="9" rx="3"/><rect x="19" y="90" width="62" height="8" rx="3"/>'
  };

  function pieceSVG(type){
    return `<svg viewBox="0 0 100 100">${PIECE_PATHS[type]}</svg>`;
  }

  /* ---------------------------------------------------------------------
     2. Posición inicial (después del movimiento 1: 1.e4 e5, ya jugado)
     row 0 = fondo de blancas (arriba del tablero) ... row 7 = fondo de negras
     col 0 = columna 'a' ... col 7 = columna 'h'
     --------------------------------------------------------------------- */
  const INITIAL_PIECES = [
    {id:'wRa1',type:'r',color:'w',row:0,col:0},
    {id:'wNb1',type:'n',color:'w',row:0,col:1},
    {id:'wBc1',type:'b',color:'w',row:0,col:2},
    {id:'wQd1',type:'q',color:'w',row:0,col:3},
    {id:'wKe1',type:'k',color:'w',row:0,col:4},
    {id:'wBf1',type:'b',color:'w',row:0,col:5},
    {id:'wNg1',type:'n',color:'w',row:0,col:6},
    {id:'wRh1',type:'r',color:'w',row:0,col:7},
    {id:'wPa', type:'p',color:'w',row:1,col:0},
    {id:'wPb', type:'p',color:'w',row:1,col:1},
    {id:'wPc', type:'p',color:'w',row:1,col:2},
    {id:'wPd', type:'p',color:'w',row:1,col:3},
    {id:'wPe', type:'p',color:'w',row:3,col:4}, // e2-e4 ya jugado
    {id:'wPf', type:'p',color:'w',row:1,col:5},
    {id:'wPg', type:'p',color:'w',row:1,col:6},
    {id:'wPh', type:'p',color:'w',row:1,col:7},

    {id:'bRa8',type:'r',color:'b',row:7,col:0},
    {id:'bNb8',type:'n',color:'b',row:7,col:1},
    {id:'bBc8',type:'b',color:'b',row:7,col:2},
    {id:'bQd8',type:'q',color:'b',row:7,col:3},
    {id:'bKe8',type:'k',color:'b',row:7,col:4},
    {id:'bBf8',type:'b',color:'b',row:7,col:5},
    {id:'bNg8',type:'n',color:'b',row:7,col:6},
    {id:'bRh8',type:'r',color:'b',row:7,col:7},
    {id:'bPa', type:'p',color:'b',row:6,col:0},
    {id:'bPb', type:'p',color:'b',row:6,col:1},
    {id:'bPc', type:'p',color:'b',row:6,col:2},
    {id:'bPd', type:'p',color:'b',row:6,col:3},
    {id:'bPe', type:'p',color:'b',row:4,col:4}, // e7-e5 ya jugado
    {id:'bPf', type:'p',color:'b',row:6,col:5},
    {id:'bPg', type:'p',color:'b',row:6,col:6},
    {id:'bPh', type:'p',color:'b',row:6,col:7},
  ];

  /* ---------------------------------------------------------------------
     3. Los 8 movimientos narrados (2 al 9). Partida real reconstruida:
     1.e4 e5 2.Nf3 c6 3.Nc3 d5 4.Nxe4 dxe4 5.Qe2 Nf6 6.Qxe4 Nxe4
     7.Bc4 Nd7 8.Ne5 Nf6 9.Bxf7# Nxe4
     (el orden de despliegue muestra primero la jugada de negras -clickeable-
     y luego la respuesta automática de blancas, tal como en el diseño original)
     --------------------------------------------------------------------- */
  const MOVEMENTS = [
    {
      num:2, year:1914,
      narrativeTitle:"Un nuevo contrincante",
      narrativeDesc:"El ingeniero español Leonardo Torres y Quevedo presenta la máquina para jugar al ajedrez “El Ajedrecista”. La máquina no requería intervención humana una vez puesta en marcha y era capaz de detectar jugadas ilegales.",
      quoteBlack:"“Negras mueve c6”",
      quoteWhite:"“Blancas mueve Nf3” – Movimiento 2",
      interactiveTitle:"El Ajedrecista",
      interactiveDesc:"Contactos eléctricos, mecanismos electromecánicos y sistemas de ejes y tambores para detectar la posición de las piezas y ejecutar las jugadas.",
      photo:"assets/photos/ajedrecista.png",
      black:{piece:"bPc", to:[5,2]},
      white:{piece:"wNg1", to:[2,5]}
    },
    {
      num:3, year:1996,
      narrativeTitle:"DeepBlue vs Kasparov",
      narrativeDesc:"Primera victoria de una computadora contra el campeón mundial en una partida de match. Kasparov ganó 4-2.",
      quoteBlack:"“Negras mueve d5”",
      quoteWhite:"“Blancas mueve Nc3” – Movimiento 3",
      interactiveTitle:"DeepBlue",
      interactiveDesc:"Contactos eléctricos, mecanismos electromecánicos y sistemas de ejes y tambores para detectar la posición de las piezas y ejecutar las jugadas.",
      photo:"assets/photos/deepblue.png",
      black:{piece:"bPd", to:[4,3]},
      white:{piece:"wNb1", to:[2,2]}
    },
    {
      num:4, year:1997,
      narrativeTitle:"La Revancha",
      narrativeDesc:"Revancha y primera victoria total de una máquina contra un campeón mundial. Su desempeño fue ligeramente superior; DeepBlue ganó 3.5-2.5.",
      quoteBlack:"“Negras mueve dxe4”",
      quoteWhite:"“Blancas mueve Nxe4” – Movimiento 4",
      interactiveTitle:"DeeperBlue",
      interactiveDesc:"El nombre de esta computadora es un juego de palabras en el idioma original: la fuerza de juego de estos programas de juego automático es mayor cuanto mayor sea la profundidad (número de movimientos futuros) que alcanza la exploración de soluciones.",
      photo:"assets/photos/deeperblue.png",
      black:{piece:"bPd", to:[3,4], captures:"wPe"},
      white:{piece:"wNb1", to:[3,4], captures:"bPd"}
    },
    {
      num:5, year:2005,
      narrativeTitle:"Aplastando al Mejor",
      narrativeDesc:"Una computadora llamada Hydra derrotó claramente a un súper granmaestro, el talentoso Michael Adams, en un match. Hydra ganó 5 - 1/2 - 1/2 (dos empates).",
      quoteBlack:"“Negras mueve Nf6”",
      quoteWhite:"“Blancas mueve Qe2” – Movimiento 5",
      interactiveTitle:"Hydra",
      interactiveDesc:"Originalmente Hydra se concibió bajo el nombre de Brutus y con una arquitectura similar a DeepBlue; sin embargo, lo que la diferenció fue un número de computadoras que actúan como co-procesadoras apoyando a Brutus, como “múltiples cabezas”.",
      photo:"assets/photos/hydra.png",
      black:{piece:"bNg8", to:[5,5]},
      white:{piece:"wQd1", to:[1,4]}
    },
    {
      num:6, year:2011,
      narrativeTitle:"Fuera del tablero",
      narrativeDesc:"La máquina ya no necesitaba limitarse a un tablero: podía interpretar lenguaje natural y responder preguntas en el juego televisivo “Jeopardy!”, venciendo a dos contrincantes a la vez, Ken Jennings y Brad Rutter.",
      quoteBlack:"“Negras mueve Nxe4”",
      quoteWhite:"“Blancas mueve Qxe4” – Movimiento 6",
      interactiveTitle:"IBM Watson",
      interactiveDesc:'IBM declaró que Watson es capaz de utilizar más de 100 técnicas diferentes para analizar el <span class="hl">lenguaje natural</span>, comprender sus raíces y generar en base a la información hipótesis válidas. En el concurso fue capaz de calcular cuánto apostar en la respuesta final en base al grado de seguridad de la respuesta obtenida.',
      photo:"assets/photos/watson.png",
      black:{piece:"bNg8", to:[3,4], captures:"wNb1"},
      white:{piece:"wQd1", to:[3,4], captures:"bNg8"}
    },
    {
      num:7, year:2016,
      narrativeTitle:"De Europa a Asia",
      narrativeDesc:"Una IA derrotaba a uno de los mejores jugadores de Go, reconocido por necesitar más intuición y toma de decisión humana que el ajedrez y considerado, mucho tiempo, demasiado complejo para la fuerza bruta. AlphaGo ganó 4-1.",
      quoteBlack:"“Negras mueve Nd7”",
      quoteWhite:"“Blancas mueve Bc4” – Movimiento 7",
      interactiveTitle:"AlphaGo",
      interactiveDesc:"AlphaGo se diferenció enormemente de las IA anteriores al utilizar redes neuronales para estimar la probabilidad de victoria en cada jugada, respaldándose con bases de datos de millones de jugadas realizadas por usuarios, y aprendiendo en solitario al emparejarse con otra IA.",
      photo:"assets/photos/alphago.png",
      black:{piece:"bNb8", to:[6,3]},
      white:{piece:"wBf1", to:[3,2]}
    },
    {
      num:8, year:2017,
      narrativeTitle:"Mentiras y PokerFace",
      narrativeDesc:"La IA superó a 4 humanos en un juego con información oculta, faroles e incertidumbre. Rompiendo la creencia de la superioridad humana para con las decisiones bajo presión y la utilización de engaños con una porción de información.",
      quoteBlack:"“Negras mueve Nf6”",
      quoteWhite:"“Blancas mueve Ne5” – Movimiento 8",
      interactiveTitle:"Libratus",
      interactiveDesc:"Libratus se enfrentó a 4 jugadores profesionales de Poker en torneos donde se empleó un método particular: dos parejas jugaban en simultáneo, una en el main stage y otra en una habitación separada con la mano inicial de Libratus. De esta manera, a medida que los días del evento pasaron, Libratus aprendió de sus competidores.",
      photo:"assets/photos/libratus.png",
      black:{piece:"bNb8", to:[5,5]},
      white:{piece:"wNg1", to:[4,4], captures:"bPe"}
    },
    {
      num:9, year:2018,
      narrativeTitle:"El ajedrez moderno",
      narrativeDesc:"OpenAI Five jugó y ganó dos partidas demostrativas en DOTA 2, un juego considerado extremadamente complejo, con la dificultad agregada de tener como rivales a dos equipos profesionales: PainGaming, equipo brasilero, y un equipo conformado por los mejores jugadores chinos.",
      quoteBlack:"“Negras mueve Nxe4”",
      quoteWhite:"“Blancas mueve Bxf7#” – Movimiento 9",
      interactiveTitle:"OpenAI Five",
      interactiveDesc:"OpenAI Five tuvo acceso a la API del juego, de manera que cada uno de los 5 personajes del equipo eran bots diferentes que recibían la información del mundo en forma de datos y determinaban las acciones basadas en redes neuronales que interpretaban la acción más viable.",
      photo:"assets/photos/openaifive.png",
      black:{piece:"bNb8", to:[3,4], captures:"wQd1"},
      white:{piece:"wBf1", to:[6,5], captures:"bPf", isMate:true},
      finalCaption:"Jaque Mate de la IA en 9 movimientos"
    }
  ];

  /* ---------------------------------------------------------------------
     4. Estado runtime
     --------------------------------------------------------------------- */
  const state = {
    pieces: {},      // id -> {type,color,row,col,alive}
    idx: 0,           // índice de movimiento actual (0..7)
    phase: 'narrative', // 'narrative' | 'interactive' | 'done'
    locked: false
  };

  INITIAL_PIECES.forEach(p => { state.pieces[p.id] = {...p, alive:true}; });

  const els = {};
  const pieceEls = {};

  /* ---------------------------------------------------------------------
     5. Construcción del tablero (una sola vez)
     --------------------------------------------------------------------- */
  function buildBoard(){
    const board = document.getElementById('board');
    board.innerHTML = '';

    for (let r=0; r<8; r++){
      for (let c=0; c<8; c++){
        const sq = document.createElement('div');
        sq.className = 'sq ' + (((r+c)%2===0) ? 'light':'dark');
        sq.style.top = (r*12.5)+'%';
        sq.style.left = (c*12.5)+'%';
        board.appendChild(sq);
      }
    }

    Object.values(state.pieces).forEach(p => {
      const div = document.createElement('div');
      div.className = 'piece ' + (p.color==='w' ? 'white':'black');
      if (p.type === 'n'){
        const inner = document.createElement('div');
        inner.className = 'knight-mask';
        div.appendChild(inner);
      } else {
        div.innerHTML = pieceSVG(p.type);
      }
      positionEl(div, p.row, p.col);
      board.appendChild(div);
      pieceEls[p.id] = div;
    });
  }

  function positionEl(el, row, col){
    el.style.top = (row*12.5)+'%';
    el.style.left = (col*12.5)+'%';
  }

  function removeMarks(){
    document.querySelectorAll('.sq-mark').forEach(m => m.remove());
  }

  function addMark(row, col, cls){
    const board = document.getElementById('board');
    const mark = document.createElement(cls==='target' ? 'button' : 'div');
    mark.className = 'sq-mark ' + cls;
    mark.style.top = (row*12.5)+'%';
    mark.style.left = (col*12.5)+'%';
    if (cls==='target'){
      mark.setAttribute('aria-label','Mover pieza a esta casilla');
      mark.addEventListener('click', onTargetClick);
    }
    board.appendChild(mark);
    return mark;
  }

  /* ---------------------------------------------------------------------
     6. Animar una jugada (mueve pieza, resuelve captura)
     --------------------------------------------------------------------- */
  function animateMove(move){
    return new Promise(resolve => {
      const piece = state.pieces[move.piece];
      if (move.captures){
        const captured = state.pieces[move.captures];
        const capturedEl = pieceEls[move.captures];
        if (captured) captured.alive = false;
        if (capturedEl){
          capturedEl.classList.add('capturing');
        }
      }
      piece.row = move.to[0];
      piece.col = move.to[1];
      positionEl(pieceEls[move.piece], piece.row, piece.col);
      setTimeout(resolve, 620);
    });
  }

  /* ---------------------------------------------------------------------
     7. Timeline (línea de tiempo con el peón que avanza)
     --------------------------------------------------------------------- */
  const NODE_COUNT = MOVEMENTS.length;
  const NODES = [];
  (function computeNodes(){
    const startX = 20, stepX = 46, topY = 18, bottomY = 52;
    for (let i=0; i<NODE_COUNT; i++){
      NODES.push({ x: startX + i*stepX, y: (i%2===0) ? bottomY : topY });
    }
  })();

  const STEP_OUT = 10; // largo del primer tramo horizontal de cada "escalón"

  function stepPathD(nodes){
    if (!nodes.length) return '';
    let d = `M${nodes[0].x} ${nodes[0].y}`;
    for (let i=0; i<nodes.length-1; i++){
      const a = nodes[i], b = nodes[i+1];
      const midX = a.x + STEP_OUT;
      d += ` L${midX} ${a.y} L${midX} ${b.y} L${b.x} ${b.y}`;
    }
    return d;
  }

  function buildTimeline(){
    const svg = document.getElementById('timelineSvg');
    const ns = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';

    const defs = document.createElementNS(ns,'defs');
    defs.innerHTML = `<filter id="nodeGlow" x="-150%" y="-150%" width="400%" height="400%">
      <feGaussianBlur stdDeviation="1.6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;
    svg.appendChild(defs);

    const bgPath = document.createElementNS(ns,'path');
    bgPath.setAttribute('d', stepPathD(NODES));
    bgPath.setAttribute('fill','none');
    bgPath.setAttribute('stroke','rgba(255,255,255,0.35)');
    bgPath.setAttribute('stroke-width','2');
    svg.appendChild(bgPath);

    const activePath = document.createElementNS(ns,'path');
    activePath.setAttribute('id','timelineActivePath');
    activePath.setAttribute('fill','none');
    activePath.setAttribute('stroke','#f2ea3d');
    activePath.setAttribute('stroke-width','2.4');
    svg.appendChild(activePath);

    NODES.forEach((n,i) => {
      const rect = document.createElementNS(ns,'rect');
      rect.setAttribute('id','node'+i);
      rect.setAttribute('x', n.x-6);
      rect.setAttribute('y', n.y-6);
      rect.setAttribute('width', 12);
      rect.setAttribute('height', 12);
      rect.setAttribute('rx', 2);
      rect.setAttribute('fill', '#5a5a5a');
      svg.appendChild(rect);
    });

    const marker = document.createElementNS(ns,'g');
    marker.setAttribute('id','timelineMarker');
    marker.innerHTML = `<circle r="9" fill="#f2ea3d" opacity="0.18"></circle>
      <foreignObject x="-8" y="-8" width="16" height="16">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:16px;height:16px;color:#f2ea3d;">${pieceSVG('p')}</div>
      </foreignObject>`;
    svg.appendChild(marker);

    updateTimeline();
  }

  function updateTimeline(){
    NODES.forEach((n,i) => {
      const rect = document.getElementById('node'+i);
      if (!rect) return;
      if (i <= state.idx){
        rect.setAttribute('fill', '#2d2d2d');
        rect.setAttribute('stroke', '#f2ea3d');
        rect.setAttribute('stroke-width', '2.2');
        rect.setAttribute('filter', 'url(#nodeGlow)');
      } else {
        rect.setAttribute('fill', '#5a5a5a');
        rect.removeAttribute('stroke');
        rect.removeAttribute('filter');
      }
    });

    const activePath = document.getElementById('timelineActivePath');
    if (activePath){
      activePath.setAttribute('d', stepPathD(NODES.slice(0, state.idx+1)));
    }

    const marker = document.getElementById('timelineMarker');
    if (marker){
      const n = NODES[state.idx];
      marker.setAttribute('transform', `translate(${n.x},${n.y})`);
    }
  }

  /* ---------------------------------------------------------------------
     8. Render de texto / fotos / prompts según la fase actual
     --------------------------------------------------------------------- */
  function renderNarrative(m){
    els.year.textContent = m.year;
    els.title.textContent = m.narrativeTitle;
    els.desc.innerHTML = m.narrativeDesc;

    els.photoWrap.hidden = true;
    els.promptScroll.hidden = false;
    els.promptClick.hidden = true;
    els.finalPanel.hidden = true;

    els.boardWrap.classList.add('veiled');
    removeMarks();
  }

  function renderInteractive(m){
    els.year.textContent = m.year;
    els.title.textContent = m.interactiveTitle;
    els.desc.innerHTML = m.interactiveDesc;
    els.photo.src = m.photo;
    els.photo.alt = m.interactiveTitle;

    els.photoWrap.hidden = false;
    els.promptScroll.hidden = true;
    els.promptClick.hidden = false;
    els.finalPanel.hidden = true;

    els.boardWrap.classList.remove('veiled');
    removeMarks();
    addMark(m.black.to[0], m.black.to[1], 'target');
  }

  function renderFinal(m){
    els.title.textContent = m.interactiveTitle;
    els.promptClick.hidden = true;
    els.finalPanel.hidden = false;
    els.finalCaption.textContent = m.finalCaption;

    removeMarks();
    addMark(m.black.to[0], m.black.to[1], 'from');
    addMark(m.white.to[0], m.white.to[1], 'to');
  }

  /* ---------------------------------------------------------------------
     9. Navegación (scroll / touch / teclado)
     --------------------------------------------------------------------- */
  function goInteractive(){
    if (state.locked) return;
    state.phase = 'interactive';
    renderInteractive(MOVEMENTS[state.idx]);
  }

  function goBackToNarrative(){
    if (state.locked) return;
    state.phase = 'narrative';
    renderNarrative(MOVEMENTS[state.idx]);
  }

  async function onTargetClick(){
    if (state.locked) return;
    state.locked = true;
    removeMarks();
    els.promptClick.hidden = true;

    const m = MOVEMENTS[state.idx];
    await animateMove(m.black);
    await new Promise(r => setTimeout(r, 180));
    await animateMove(m.white);

    if (m.white.isMate){
      state.phase = 'done';
      renderFinal(m);
      state.locked = false;
      return;
    }

    await new Promise(r => setTimeout(r, 500));
    state.idx += 1;
    state.phase = 'narrative';
    updateTimeline();
    renderNarrative(MOVEMENTS[state.idx]);
    state.locked = false;
  }

  let wheelLock = false;
  function handleAdvance(direction){
    if (viewInfografiaEl.hidden) return; // solo navega si esta vista está activa
    if (state.locked) return;
    if (wheelLock) return;
    wheelLock = true;
    setTimeout(() => wheelLock = false, 550);

    if (direction > 0){ // avanzar
      if (state.phase === 'narrative') goInteractive();
      // en 'interactive' no avanza por scroll: hay que hacer click
    } else { // retroceder
      if (state.phase === 'interactive') goBackToNarrative();
    }
  }

  function attachNav(){
    window.addEventListener('wheel', e => {
      handleAdvance(e.deltaY);
    }, {passive:true});

    let touchStartY = null;
    window.addEventListener('touchstart', e => {
      touchStartY = e.touches[0].clientY;
    }, {passive:true});
    window.addEventListener('touchend', e => {
      if (touchStartY===null) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 40) handleAdvance(dy);
      touchStartY = null;
    }, {passive:true});

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown'){ handleAdvance(1); }
      if (e.key === 'ArrowUp' || e.key === 'PageUp'){ handleAdvance(-1); }
    });
  }

  /* ---------------------------------------------------------------------
     10. Reset (cada vez que se entra a la infografía desde el home)
     --------------------------------------------------------------------- */
  function resetInfografia(){
    state.pieces = {};
    INITIAL_PIECES.forEach(p => { state.pieces[p.id] = {...p, alive:true}; });
    state.idx = 0;
    state.phase = 'narrative';
    state.locked = false;

    buildBoard();
    buildTimeline();
    renderNarrative(MOVEMENTS[0]);
  }

  /* ---------------------------------------------------------------------
     11. Cambio de vista (home <-> infografía) — todo vive en un solo HTML
     --------------------------------------------------------------------- */
  let viewHomeEl, viewInfografiaEl;

  function showInfografia(){
    viewHomeEl.hidden = true;
    viewInfografiaEl.hidden = false;
    resetInfografia();
  }

  function showHome(){
    viewInfografiaEl.hidden = true;
    viewHomeEl.hidden = false;
  }

  function attachViewSwitching(){
    viewHomeEl = document.getElementById('viewHome');
    viewInfografiaEl = document.getElementById('viewInfografia');

    const btnStart = document.getElementById('btnStartInfografia');
    if (btnStart) btnStart.addEventListener('click', showInfografia);

    const btnBack = document.getElementById('btnBackHome');
    if (btnBack) btnBack.addEventListener('click', showHome);

    const btnFinalHome = document.getElementById('btnFinalHome');
    if (btnFinalHome) btnFinalHome.addEventListener('click', showHome);

    // Opción de chat (todavía sin contenido): decorativa por ahora.
    const inactive = document.querySelector('.option--inactive');
    if (inactive){
      inactive.addEventListener('click', () => {
        inactive.animate(
          [
            { transform: 'translateY(0)' },
            { transform: 'translateY(-4px)' },
            { transform: 'translateY(0)' }
          ],
          { duration: 260, easing: 'ease-out' }
        );
      });
    }
  }

  /* ---------------------------------------------------------------------
     12. Init
     --------------------------------------------------------------------- */
  function cacheEls(){
    ['year','title','desc','photoWrap','photo',
     'promptScroll','promptClick','finalPanel','finalCaption'].forEach(id => {
      els[id] = document.getElementById(id);
    });
    els.boardWrap = document.getElementById('boardWrap');
  }

  function init(){
    attachViewSwitching();
    cacheEls();
    buildBoard();
    buildTimeline();
    renderNarrative(MOVEMENTS[0]);
    attachNav();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
