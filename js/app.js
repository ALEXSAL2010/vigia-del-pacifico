/* Plataforma del curso: lee CURSO (js/contenido.js) y maneja progreso, XP y niveles.
   Sin dependencias ni servidor: funciona directamente en GitHub Pages. */
(function () {
  "use strict";

  const R = CURSO.reglas;
  const N = CURSO.niveles;
  const KEY = "vigia-pacifico-v1";
  const $app = document.getElementById("app");

  // ---------------------------------------------------------------- estado
  function blank() {
    const s = { nombre: "", niveles: {}, avisos: {} };
    N.forEach(l => {
      s.niveles[l.id] = { leccion: false, quiz: {}, reto: { texto: "", resp: {}, checks: {}, xp: 0, enviado: false } };
    });
    return s;
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        const b = blank();
        N.forEach(l => { if (!s.niveles[l.id]) s.niveles[l.id] = b.niveles[l.id]; });
        s.avisos = s.avisos || {};
        return s;
      }
    } catch (e) { /* almacenamiento no disponible */ }
    return blank();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin persistencia */ } }
  let S = load();

  // ---------------------------------------------------------------- XP
  const maxNivel = l => R.xpLeccion + l.quiz.length * R.xpPregunta + l.reto.items.length * R.xpItemReto;
  function xpNivel(id) {
    const n = S.niveles[id];
    let xp = n.leccion ? R.xpLeccion : 0;
    Object.values(n.quiz).forEach(q => { xp += q.xp || 0; });
    xp += n.reto.xp || 0;
    return xp;
  }
  const xpTotal = () => N.reduce((a, l) => a + xpNivel(l.id), 0);
  const xpMax = () => N.reduce((a, l) => a + maxNivel(l), 0);
  const aprobado = id => xpNivel(id) >= R.xpParaSubir;
  const desbloqueado = id => id === 1 || aprobado(id - 1);
  const quizCompleto = l => l.quiz.every((_, i) => S.niveles[l.id].quiz[i] && S.niveles[l.id].quiz[i].done);
  function rangoActual() {
    let r = "Aprendiz de vigía";
    N.forEach(l => { if (aprobado(l.id)) r = l.rango; });
    return r;
  }

  // ---------------------------------------------------------------- util
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = n => String(n).replace(".", ",");
  // Orden estable pero mezclado de las opciones, para que la respuesta correcta no esté siempre en el mismo lugar.
  function orden(n, seed) {
    const a = [...Array(n).keys()];
    let x = seed * 9301 + 49297;
    for (let i = n - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; const j = Math.floor((x / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function renderPlayer() {
    const t = xpTotal(), m = xpMax();
    document.getElementById("player").innerHTML =
      `<span class="rank">${esc(rangoActual())}</span>
       <span class="xpbar" role="progressbar" aria-valuemin="0" aria-valuemax="${m}" aria-valuenow="${t}" aria-label="Experiencia total"><span style="width:${(t / m) * 100}%"></span></span>
       <strong>${t} XP</strong>`;
  }

  function revisarSubidas() {
    for (const l of N) {
      if (aprobado(l.id) && !S.avisos[l.id]) {
        S.avisos[l.id] = true;
        save();
        const ult = l.id === N.length;
        document.getElementById("modal-title").textContent = l.rango;
        document.getElementById("modal-body").textContent = ult
          ? "Completaste los cinco niveles. Ya puedes ver tu certificado."
          : `Superaste el Nivel ${l.id}. Se desbloqueó el Nivel ${l.id + 1}: ${N[l.id].titulo}.`;
        const m = document.getElementById("modal");
        m.hidden = false;
        const ok = document.getElementById("modal-ok");
        ok.focus();
        ok.onclick = () => { m.hidden = true; if (ult) location.hash = "#/certificado"; };
        break;
      }
    }
  }

  function changed() { save(); renderPlayer(); revisarSubidas(); }

  // ---------------------------------------------------------------- mapa (diagrama)
  const POS = {
    1: { x: 20, y: 165, w: 190, h: 90 },
    2: { x: 280, y: 155, w: 190, h: 110 },
    3: { x: 560, y: 40, w: 200, h: 90 },
    4: { x: 560, y: 290, w: 200, h: 90 },
    5: { x: 830, y: 165, w: 145, h: 90 },
  };
  function mapa() {
    const arrows = `
      <line x1="210" y1="210" x2="276" y2="210"/>
      <line x1="470" y1="180" x2="556" y2="107"/>
      <line x1="470" y1="240" x2="556" y2="313"/>
      <line x1="760" y1="95" x2="826" y2="183"/>
      <line x1="760" y1="325" x2="826" y2="237"/>`;
    const labels = `
      <text x="244" y="186" text-anchor="middle" class="lbl">se mide</text><text x="244" y="200" text-anchor="middle" class="lbl">con</text>
      <text x="470" y="100" text-anchor="middle" class="lbl">favorece</text>
      <text x="470" y="113" text-anchor="middle" class="lbl">(efecto rápido)</text>
      <text x="430" y="292" text-anchor="middle" class="lbl" fill="var(--coral)">favorece (con desfase)</text>`;
    const nodes = N.map(l => {
      const p = POS[l.id];
      const lock = !desbloqueado(l.id), done = aprobado(l.id);
      const cx = p.x + p.w / 2;
      const fill = done ? "var(--ok-soft)" : lock ? "var(--bg)" : "var(--navy-soft)";
      const stroke = done ? "var(--ok)" : lock ? "var(--line)" : "var(--navy)";
      const dash = lock ? 'stroke-dasharray="5 4"' : "";
      const tit = [].concat(l.nodo);
      const off = (tit.length - 1) * 18;
      const lines = l.nodoDetalle.map((d, i) =>
        `<text x="${cx}" y="${p.y + 48 + off + i * 16}" text-anchor="middle" font-size="12.5" fill="var(--muted)">${esc(d)}</text>`).join("");
      const top = l.id === 4 ? p.y + p.h + 18 : p.y - 8;
      const tag = done ? "✓ NIVEL " + l.id : lock ? "🔒 NIVEL " + l.id : "NIVEL " + l.id;
      return `<g class="node ${lock ? "locked" : ""}" data-id="${l.id}" tabindex="${lock ? -1 : 0}" role="link" aria-label="Nivel ${l.id}: ${esc(l.titulo)}${lock ? " (bloqueado)" : ""}">
        <text x="${cx}" y="${top}" text-anchor="middle" font-size="12" font-weight="700" letter-spacing="1" fill="${done ? "var(--ok)" : "var(--coral)"}">${tag}</text>
        <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2" ${dash}/>
        ${tit.map((t, i) => `<text x="${cx}" y="${p.y + 27 + i * 18}" text-anchor="middle" font-size="15.5" font-weight="700" fill="var(--fg)">${esc(t)}</text>`).join("")}
        ${lines}
      </g>`;
    }).join("");
    return `<div class="map card" style="padding:12px">
      <svg viewBox="0 0 980 410" role="img" aria-label="Mapa del curso: El Niño, ONI, temperaturas, dengue y alerta temprana">
        <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--muted)"/></marker></defs>
        <g stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ar)">${arrows}</g>
        <g font-size="12" fill="var(--muted)">${labels}</g>
        ${nodes}
      </svg></div>`;
  }
  function bindMapa() {
    $app.querySelectorAll(".node:not(.locked)").forEach(g => {
      const go = () => { location.hash = "#/nivel/" + g.dataset.id; };
      g.addEventListener("click", go);
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  // ---------------------------------------------------------------- gráfico 2023
  function grafico(modo) {
    const D = CURSO.datos2023;
    const W = 640, H = 270, L = 44, Rr = 44, T = 16, B = 34;
    const iw = W - L - Rr, ih = H - T - B;
    const x = i => L + (i + 0.5) * (iw / 12);
    const yO = v => T + ih - ((v + 1) / 3.5) * ih;       // ONI −1 … 2,5
    const yD = v => T + ih - (v / 35) * ih;              // dengue 0 … 35
    let g = "";
    // banda de El Niño y umbrales
    g += `<rect x="${L}" y="${yO(2.5)}" width="${iw}" height="${yO(0.5) - yO(2.5)}" fill="var(--coral-soft)" opacity=".6"/>`;
    g += `<rect x="${L}" y="${yO(-0.5)}" width="${iw}" height="${yO(-1) - yO(-0.5)}" fill="var(--navy-soft)"/>`;
    [0.5, -0.5].forEach(v => { g += `<line x1="${L}" x2="${L + iw}" y1="${yO(v)}" y2="${yO(v)}" stroke="var(--coral)" stroke-dasharray="4 4"/>`; });
    g += `<line x1="${L}" x2="${L + iw}" y1="${yO(0)}" y2="${yO(0)}" stroke="var(--line)"/>`;
    g += `<text x="${L + iw - 4}" y="${yO(0.5) - 5}" text-anchor="end" font-size="10.5" fill="var(--coral)">+0,5 °C · El Niño</text>`;
    g += `<text x="${L + iw - 4}" y="${yO(-0.5) + 13}" text-anchor="end" font-size="10.5" fill="var(--navy)">−0,5 °C · La Niña</text>`;
    // ejes
    [-1, 0, 1, 2].forEach(v => { g += `<text x="${L - 6}" y="${yO(v) + 4}" text-anchor="end" font-size="10.5" fill="var(--muted)">${fmt(v)}</text>`; });
    g += `<text x="12" y="${T + ih / 2}" transform="rotate(-90 12 ${T + ih / 2})" text-anchor="middle" font-size="10.5" fill="var(--muted)">ONI (°C)</text>`;
    D.meses.forEach((m, i) => { g += `<text x="${x(i)}" y="${H - 12}" text-anchor="middle" font-size="10.5" fill="var(--muted)">${m}</text>`; });
    if (modo === "ambos") {
      const bw = iw / 12 * 0.55;
      D.dengue.forEach((v, i) => {
        g += `<rect x="${x(i) - bw / 2}" y="${yD(v)}" width="${bw}" height="${yD(0) - yD(v)}" rx="2" fill="var(--muted)" opacity=".35"><title>${D.meses[i]}: ${fmt(v)} casos por 100 000</title></rect>`;
      });
      [0, 10, 20, 30].forEach(v => { g += `<text x="${L + iw + 6}" y="${yD(v) + 4}" font-size="10.5" fill="var(--muted)">${v}</text>`; });
      g += `<text x="${W - 10}" y="${T + ih / 2}" transform="rotate(90 ${W - 10} ${T + ih / 2})" text-anchor="middle" font-size="10.5" fill="var(--muted)">Dengue × 100 000 hab.</text>`;
    }
    const pts = D.oni.map((v, i) => `${x(i)},${yO(v)}`).join(" ");
    g += `<polyline points="${pts}" fill="none" stroke="var(--navy)" stroke-width="2.5" stroke-linejoin="round"/>`;
    D.oni.forEach((v, i) => {
      g += `<circle cx="${x(i)}" cy="${yO(v)}" r="4" fill="var(--surface)" stroke="var(--navy)" stroke-width="2"><title>${D.meses[i]}: ONI ${fmt(v)} °C</title></circle>`;
      g += `<text x="${x(i)}" y="${yO(v) - 9}" text-anchor="middle" font-size="10" fill="var(--fg)">${v > 0 ? "+" : ""}${fmt(v.toFixed(1))}</text>`;
    });
    const leg = `<div class="legend"><span><i style="background:var(--navy)"></i>ONI 2023</span>${modo === "ambos" ? '<span><i style="background:var(--muted);opacity:.5"></i>Tasa de dengue, región Caribe</span>' : ""}</div>`;
    return `<figure class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico del ONI mensual 2023${modo === "ambos" ? " y la tasa de dengue" : ""} en la región Caribe colombiana">${g}</svg>${leg}<figcaption class="source">Datos reales. Fuente: ${esc(D.fuente)}</figcaption></figure>`;
  }

  // ---------------------------------------------------------------- vistas
  function vistaInicio() {
    const t = xpTotal();
    const aprob = N.filter(l => aprobado(l.id)).length;
    const siguiente = N.find(l => desbloqueado(l.id) && !aprobado(l.id)) || N[N.length - 1];
    $app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Curso básico · a tu ritmo · 5 niveles</p>
        <h1>${esc(CURSO.titulo)}</h1>
        <p class="sub">${esc(CURSO.subtitulo)}</p>
      </section>
      <div class="card">
        <p><strong>Tu rol:</strong> ${esc(CURSO.descripcion)}</p>
        <p><strong>Meta:</strong> ${esc(CURSO.meta)}</p>
        <p class="muted">Cada nivel tiene tres pasos: <b>concepto</b> (${R.xpLeccion} XP), <b>evaluación</b> (${4 * R.xpPregunta} XP) y <b>reto</b> (${5 * R.xpItemReto} XP). Con ${R.xpParaSubir} XP subes al siguiente nivel.</p>
        <div class="row">
          <label for="nombre" class="muted">Tu nombre (para el certificado):</label>
          <input id="nombre" class="name-input" value="${esc(S.nombre)}" placeholder="Escribe tu nombre" autocomplete="name">
        </div>
      </div>
      <div class="stats">
        <div class="stat"><b>${t}</b><span>XP de ${xpMax()}</span></div>
        <div class="stat"><b>${aprob}/5</b><span>niveles superados</span></div>
        <div class="stat"><b style="font-size:1.05rem">${esc(rangoActual())}</b><span>tu título actual</span></div>
      </div>
      <div class="row" style="margin-bottom:16px">
        ${aprobado(N.length)
          ? '<a class="btn" href="#/certificado">Ver certificado</a>'
          : `<a class="btn" href="#/nivel/${siguiente.id}">${t === 0 ? "Empezar el Nivel 1" : "Continuar: Nivel " + siguiente.id}</a>`}
      </div>
      <h2>Mapa del curso</h2>
      <p class="muted">Avanzas de izquierda a derecha: el fenómeno, su medida, sus dos efectos en salud y la alerta.</p>
      ${mapa()}
      <div class="levels-list">
        ${N.map(l => {
          const xp = xpNivel(l.id), lock = !desbloqueado(l.id), done = aprobado(l.id);
          return `<a class="level-row ${lock ? "locked" : ""} ${done ? "done" : ""}" href="#/nivel/${l.id}" ${lock ? 'aria-disabled="true" tabindex="-1"' : ""}>
            <span class="level-num">${done ? "✓" : l.id}</span>
            <span><strong>${esc(l.titulo)}</strong><br><span class="meta">${esc(l.pregunta)}</span></span>
            <span class="spacer"></span>
            <span class="meta">${xp}/${maxNivel(l)} XP</span>
            <span class="mini-bar"><span style="width:${(xp / maxNivel(l)) * 100}%"></span></span>
          </a>`;
        }).join("")}
      </div>
      <div class="card" style="margin-top:20px">
        <h3>Fuentes</h3>
        ${CURSO.fuentes.map(f => `<p style="font-size:.9rem">${esc(f.texto)} <a href="${f.url}" target="_blank" rel="noopener">Enlace</a></p>`).join("")}
      </div>`;
    bindMapa();
    document.getElementById("nombre").addEventListener("input", e => { S.nombre = e.target.value.slice(0, 80); save(); });
  }

  function vistaNivel(id, paso) {
    const l = N.find(x => x.id === id);
    if (!l || !desbloqueado(id)) { location.hash = "#/"; return; }
    const st = S.niveles[id];
    const pasos = [
      { k: "concepto", t: "1 · Concepto", ok: st.leccion, on: true },
      { k: "evaluacion", t: "2 · Evaluación", ok: quizCompleto(l), on: st.leccion },
      { k: "reto", t: "3 · Reto", ok: st.reto.enviado, on: st.leccion && quizCompleto(l) },
    ];
    if (!paso || !pasos.find(p => p.k === paso && p.on)) {
      paso = !st.leccion ? "concepto" : !quizCompleto(l) ? "evaluacion" : "reto";
    }
    const xp = xpNivel(id);
    $app.innerHTML = `
      <nav class="crumbs"><a href="#/">← Mapa del curso</a></nav>
      <p class="eyebrow">Nivel ${id} de ${N.length}</p>
      <div class="row"><h1 style="margin:0">${esc(l.titulo)}</h1><span class="spacer"></span>
        <span class="muted"><strong style="color:var(--fg)">${xp}</strong>/${maxNivel(l)} XP · ${aprobado(id) ? "✓ superado" : "necesitas " + R.xpParaSubir}</span></div>
      <p class="msg"><b>${esc(CURSO.personaje)}:</b> «${esc(l.mensaje)}»</p>
      <div class="steps" role="tablist">
        ${pasos.map(p => `<button class="step ${p.k === paso ? "active" : ""} ${p.ok ? "done" : ""}" role="tab" aria-selected="${p.k === paso}" data-k="${p.k}" ${p.on ? "" : "disabled"}>
          <strong>${p.t}</strong><small>${p.ok ? "✓ completado" : p.on ? "disponible" : "🔒 bloqueado"}</small></button>`).join("")}
      </div>
      <section class="card" id="panel"></section>`;
    $app.querySelectorAll(".step").forEach(b => b.addEventListener("click", () => { location.hash = `#/nivel/${id}/${b.dataset.k}`; }));
    const panel = document.getElementById("panel");
    if (paso === "concepto") panelConcepto(l, panel);
    else if (paso === "evaluacion") panelQuiz(l, panel);
    else panelReto(l, panel);
  }

  function panelConcepto(l, panel) {
    const st = S.niveles[l.id];
    panel.innerHTML = `
      <h2>Concepto</h2>
      <p class="muted">${esc(l.concepto.intro)}</p>
      <div class="keys">${l.concepto.claves.map(k => `<div class="key"><h3>${esc(k.t)}</h3><p>${esc(k.d)}</p></div>`).join("")}</div>
      <div class="row">
        <button class="btn" id="leido">${st.leccion ? "Ir a la evaluación →" : `Entendido, sumar ${R.xpLeccion} XP`}</button>
      </div>`;
    document.getElementById("leido").addEventListener("click", () => {
      if (!st.leccion) { st.leccion = true; changed(); }
      location.hash = `#/nivel/${l.id}/evaluacion`;
    });
  }

  function panelQuiz(l, panel) {
    const st = S.niveles[l.id];
    const draw = () => {
      panel.innerHTML = `<h2>Evaluación</h2>
        <p class="muted">${R.xpPregunta} XP si aciertas al primer intento y ${R.xpPreguntaSegundoIntento} XP al segundo.</p>
        ${l.quiz.map((q, i) => {
          const s = st.quiz[i] || { tries: 0, picked: [], done: false, xp: 0 };
          const opts = orden(q.op.length, l.id * 10 + i).map(j => { const o = q.op[j];
            let cls = "";
            if (s.picked.includes(j)) cls = j === q.ok ? "right" : "wrong";
            if (s.done && j === q.ok) cls = "right";
            return `<button class="opt ${cls}" data-q="${i}" data-o="${j}" ${s.done || s.picked.includes(j) ? "disabled" : ""}>${esc(o)}</button>`;
          }).join("");
          let fb = "";
          if (s.done) fb = s.xp > 0 ? `<p class="fb good">✓ Correcto <span class="xp-chip">+${s.xp} XP</span> ${esc(q.exp)}</p>` : `<p class="fb bad">La respuesta correcta está marcada en verde. ${esc(q.exp)}</p>`;
          else if (s.tries === 1) fb = `<p class="fb bad">No es correcto. Tienes un intento más.</p>`;
          return `<div class="q"><p class="q-title">${i + 1}. ${esc(q.q)}</p><div class="opts">${opts}</div><div aria-live="polite">${fb}</div></div>`;
        }).join("")}
        <div class="row"><button class="btn" id="aReto" ${quizCompleto(l) ? "" : "disabled"}>Ir al reto →</button></div>`;
      panel.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
        const i = +b.dataset.q, j = +b.dataset.o, q = l.quiz[i];
        const s = st.quiz[i] || (st.quiz[i] = { tries: 0, picked: [], done: false, xp: 0 });
        if (s.done) return;
        s.picked.push(j);
        if (j === q.ok) { s.done = true; s.xp = s.tries === 0 ? R.xpPregunta : R.xpPreguntaSegundoIntento; }
        else { s.tries++; if (s.tries >= 2) { s.done = true; s.xp = 0; } }
        changed();
        draw();
        const qEl = panel.querySelectorAll(".q")[i];
        if (qEl) qEl.querySelector(".fb")?.focus?.();
        if (quizCompleto(l)) vistaNivelRefreshSteps(l);
      }));
      const a = document.getElementById("aReto");
      if (a) a.addEventListener("click", () => { location.hash = `#/nivel/${l.id}/reto`; });
    };
    draw();
  }
  function vistaNivelRefreshSteps(l) {
    const b = $app.querySelector('.step[data-k="reto"]');
    if (b) { b.disabled = false; b.querySelector("small").textContent = "disponible"; }
    const e = $app.querySelector('.step[data-k="evaluacion"]');
    if (e) { e.classList.add("done"); e.querySelector("small").textContent = "✓ completado"; }
  }

  function panelReto(l, panel) {
    const st = S.niveles[l.id].reto;
    const rt = l.reto;
    const MIN = 40;
    const textoOk = () => !rt.texto || (st.texto || "").trim().length >= MIN;
    panel.innerHTML = `
      <h2>Reto</h2>
      <p>${esc(rt.enunciado)}</p>
      ${rt.grafico ? grafico(rt.grafico) : ""}
      ${rt.texto ? `<label for="txt" class="muted">Tu respuesta (mínimo ${MIN} caracteres):</label>
        <textarea id="txt" placeholder="Escribe aquí…">${esc(st.texto || "")}</textarea>` : ""}
      <h3 style="margin-top:16px">Revisión</h3>
      <p class="muted">${R.xpItemReto} XP por cada punto. Las preguntas se califican solas; en la lista de autoverificación marca solo lo que tu respuesta cumple de verdad.</p>
      <div id="items">
        ${rt.items.map((it, i) => it.tipo === "auto"
          ? `<div class="item"><label for="sel${i}"><strong>${esc(it.t)}</strong></label><br>
              <select id="sel${i}" data-i="${i}"><option value="">Elige una opción…</option>
              ${it.op.map((o, j) => `<option value="${j}" ${String(st.resp[i]) === String(j) ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>
              <div class="fb" id="fb${i}" aria-live="polite"></div></div>`
          : `<div class="item"><label class="check"><input type="checkbox" data-i="${i}" ${st.checks[i] ? "checked" : ""}> <span>${esc(it.t)}</span></label></div>`).join("")}
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn" id="enviar">${st.enviado ? "Recalcular XP del reto" : "Enviar reto"}</button>
        <span class="muted" id="hint"></span>
      </div>
      <div id="res" aria-live="polite"></div>`;

    const txt = document.getElementById("txt");
    const boxes = panel.querySelectorAll('input[type="checkbox"]');
    const sels = panel.querySelectorAll("select");
    const hint = document.getElementById("hint");
    const btn = document.getElementById("enviar");

    function sync() {
      const ok = textoOk();
      boxes.forEach(b => { b.disabled = !ok; });
      const faltan = [...sels].some(s => s.value === "");
      btn.disabled = !ok || faltan;
      hint.textContent = !ok ? `Escribe tu respuesta para poder autoevaluarte (${(st.texto || "").trim().length}/${MIN}).` : faltan ? "Responde todas las preguntas." : "";
    }
    if (txt) txt.addEventListener("input", () => { st.texto = txt.value.slice(0, 4000); save(); sync(); });
    boxes.forEach(b => b.addEventListener("change", () => { st.checks[b.dataset.i] = b.checked; save(); }));
    sels.forEach(s => s.addEventListener("change", () => { st.resp[s.dataset.i] = s.value === "" ? undefined : +s.value; save(); sync(); }));

    function mostrar() {
      let xp = 0;
      rt.items.forEach((it, i) => {
        if (it.tipo === "auto") {
          const good = st.resp[i] === it.ok;
          if (good) xp += R.xpItemReto;
          const f = document.getElementById("fb" + i);
          f.className = "fb " + (good ? "good" : "bad");
          f.innerHTML = good ? `✓ Correcto <span class="xp-chip">+${R.xpItemReto} XP</span> ${esc(it.exp)}` : `No es correcto. Revisa el concepto y vuelve a intentarlo.`;
        } else if (st.checks[i]) xp += R.xpItemReto;
      });
      return xp;
    }
    btn.addEventListener("click", () => {
      st.xp = mostrar();
      st.enviado = true;
      changed();
      const total = xpNivel(l.id);
      const pasa = total >= R.xpParaSubir;
      const sig = N.find(x => x.id === l.id + 1);
      document.getElementById("res").innerHTML = `<div class="result ${pasa ? "" : "low"}">
        <strong>Reto: ${st.xp}/${rt.items.length * R.xpItemReto} XP.</strong> Total del nivel: ${total}/${maxNivel(l)} XP.
        ${pasa ? (sig ? ` <a href="#/nivel/${sig.id}">Ir al Nivel ${sig.id} →</a>` : ` <a href="#/certificado">Ver certificado →</a>`)
               : ` Te faltan ${R.xpParaSubir - total} XP para subir. Corrige tus respuestas y vuelve a enviar.`}
      </div>`;
      btn.textContent = "Recalcular XP del reto";
      const s = $app.querySelector('.step[data-k="reto"]');
      if (s) { s.classList.add("done"); s.querySelector("small").textContent = "✓ completado"; }
    });
    if (st.enviado) mostrar();
    sync();
  }

  function vistaCertificado() {
    if (!aprobado(N.length)) { location.hash = "#/"; return; }
    const t = xpTotal(), oro = t >= R.xpInsigniaOro;
    const fecha = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
    $app.innerHTML = `
      <nav class="crumbs no-print"><a href="#/">← Mapa del curso</a></nav>
      <section class="card cert ${oro ? "gold" : ""}">
        <div class="badge" aria-hidden="true">${oro ? "🏅" : "🛰️"}</div>
        <p class="eyebrow">Certificado de finalización</p>
        <h2>${esc(S.nombre || "Vigía de salud pública")}</h2>
        <p>completó el curso básico <strong>${esc(CURSO.titulo)}: ${esc(CURSO.subtitulo)}</strong><br>con el título de <strong>${esc(N[N.length - 1].rango)}</strong>.</p>
        <p style="font-size:1.3rem"><strong>${t}</strong> de ${xpMax()} XP ${oro ? "· Insignia «Centinela de oro»" : ""}</p>
        <p class="muted">${N.map(l => `Nivel ${l.id}: ${xpNivel(l.id)} XP`).join(" · ")}</p>
        <p class="muted">${fecha}</p>
      </section>
      <div class="row no-print">
        ${S.nombre ? "" : '<span class="muted">Escribe tu nombre en la página de inicio para que aparezca aquí.</span>'}
        <span class="spacer"></span>
        <button class="btn" onclick="window.print()">Imprimir o guardar en PDF</button>
      </div>`;
  }

  // ---------------------------------------------------------------- router
  function route() {
    const h = location.hash.replace(/^#\/?/, "").split("/");
    if (h[0] === "nivel") vistaNivel(+h[1], h[2]);
    else if (h[0] === "certificado") vistaCertificado();
    else vistaInicio();
    renderPlayer();
    window.scrollTo(0, 0);
    $app.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);
  document.getElementById("reset").addEventListener("click", () => {
    if (confirm("¿Seguro que quieres borrar tu progreso y empezar de nuevo?")) {
      S = blank(); save(); location.hash = "#/"; route();
    }
  });
  route();
})();
