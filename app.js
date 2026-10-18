'use strict';
// Bravo: tienda estática con rutas por hash (#/catalogo, #/juego/id...). Sin backend: el estado vive en localStorage.

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const usd = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' });
const day = new Intl.DateTimeFormat('es-EC', { dateStyle: 'long' });
const pad = n => String(n).padStart(2, '0');
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const ic = name => `<svg class="ic" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const wide = () => matchMedia('(min-width: 900px)').matches;

GAMES.forEach((g, i) => { g.n = i + 1; });
const G = Object.fromEntries(GAMES.map(g => [g.id, g]));
const studioOf = g => STUDIOS[g.studio];
const isLatam = g => studioOf(g).latam !== false;
const place = s => [s.place, s.country].filter(Boolean).join(', ');
const final = g => Math.round(g.price * (100 - g.off)) / 100;
const total = ids => Math.round(ids.reduce((t, id) => t + final(G[id]), 0) * 100) / 100;
const genres = () => [...new Set(GAMES.flatMap(g => g.genres))].sort();

// ---------- estado ----------
const db = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem('bravo.' + k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem('bravo.' + k, JSON.stringify(v)); } catch { /* sin almacenamiento: queda en memoria */ } },
};
const S = {
  cart: db.get('cart', []).filter(id => G[id]),
  wish: db.get('wish', []).filter(id => G[id]),
  lib: db.get('lib', []).filter(id => G[id]),
  orders: db.get('orders', []).filter(o => o.items?.every(i => G[i.id])),
  user: db.get('user', null),
  reviews: db.get('reviews', {}),
  prefs: db.get('prefs', { deals: true, latam: true, recs: true, freq: 'semanal', genres: [] }),
};
const save = (...keys) => keys.forEach(k => db.set(k, S[k]));
const say = msg => { $('#live').textContent = msg; };

// ---------- piezas ----------
function cover(g, cls = '') {
  const lines = (g.cover || g.title).split('|');
  const fs = Math.min(30, 160 / Math.max(...lines.map(l => l.length)));
  return `<div class="tc s-${g.scheme} v${g.n % 3} ${cls}" style="--fs:${fs.toFixed(1)};--a:${-5 - (g.n * 7) % 11}deg" aria-hidden="true"><i class="tc-bar"></i><span class="tc-t">${lines.map(l => `<span>${esc(l)}</span>`).join('')}</span><span class="tc-n">N.º<b>${pad(g.n)}</b></span></div>`;
}
const price = (g, cls = '') => `<p class="price ${cls}">${g.off ? `<span class="off">−${g.off}%</span><s><span class="sr">Antes </span>${usd.format(g.price)}</s>` : ''}<b>${g.off ? '<span class="sr">Ahora </span>' : ''}${usd.format(final(g))}</b></p>`;
const card = g => `<a class="card" href="#/juego/${g.id}">${cover(g)}<h3>${esc(g.title)}</h3><p class="meta">${esc(studioOf(g).name)} · ${esc(studioOf(g).country)}</p>${price(g)}</a>`;
const grid = list => `<div class="grid">${list.map(card).join('')}</div>`;
const secHead = (title, href, label) => `<div class="sec-head"><h2>${title}</h2><span class="rule"></span>${href ? `<a class="btn btn--ghost btn--sm" href="${href}">${label}</a>` : ''}</div>`;
const empty = (title, text, actions) => `<div class="empty"><h2>${title}</h2><p>${text}</p><div class="actions">${actions}</div></div>`;
const options = (list, current) => list.map(([v, l]) => `<option value="${esc(v)}"${String(current ?? '') === v ? ' selected' : ''}>${esc(l)}</option>`).join('');
const countryOptions = c => options([['', 'Elige tu país'], ...COUNTRIES.map(x => [x, x])], c);

function recommend(n = 4) {
  const liked = new Set([...S.lib, ...S.wish].flatMap(id => G[id].genres).concat(S.prefs.genres));
  return GAMES.filter(g => !S.lib.includes(g.id))
    .map(g => [g, g.genres.filter(t => liked.has(t)).length * 100 + g.off + (isLatam(g) ? 5 : 0)])
    .sort((a, b) => b[1] - a[1]).slice(0, n).map(([g]) => g);
}

function render(title, html) {
  document.title = title ? `${title} · Bravo` : 'Bravo · Videojuegos hechos en Latinoamérica';
  app.innerHTML = html;
  const h1 = $('h1', app);
  if (h1) h1.tabIndex = -1;
}

// ---------- pantallas ----------
function home() {
  const f = G.despelote, st = studioOf(f);
  const deals = GAMES.filter(g => g.off).sort((a, b) => b.off - a.off).slice(0, 8);
  const fresh = [...GAMES].sort((a, b) => b.year - a.year || a.n - b.n).slice(0, 4);
  const latam = GAMES.filter(isLatam);
  const byCountry = Object.entries(latam.reduce((m, g) => ({ ...m, [studioOf(g).country]: (m[studioOf(g).country] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const studios = new Set(latam.map(g => g.studio)).size;
  render('', `
  <section class="hero">
    <i class="hero-bar" aria-hidden="true"></i>
    <h1 class="hero-t"><span>Tu próximo</span><span>juego</span><span class="alt">se hizo aquí</span></h1>
    <div class="hero-copy">
      <p>Videojuegos de PC de estudios latinoamericanos, con precio final en USD pensado para la región y pagos explicados antes de comprar.</p>
      <div class="actions"><a class="btn" href="#/catalogo">Explorar juegos ${ic('play')}</a><a class="btn btn--ghost" href="#/estudios">Conoce los estudios</a></div>
    </div>
    <a class="hero-feat" href="#/juego/${f.id}">${cover(f)}<div class="feat-info"><strong>${f.title}</strong><span class="meta">${esc(st.name)} · ${st.country}</span>${price(f)}</div></a>
  </section>
  <div class="page">
    ${secHead('Ofertas de la semana', '#/catalogo?oferta=1&orden=descuento', 'Ver todas')}
    <div class="rail">${deals.map(card).join('')}</div>
    ${secHead('Recién llegados', '#/catalogo?orden=nuevo', 'Ver catálogo')}
    ${grid(fresh)}
  </div>
  <section class="band s-t latam">
    <div class="band-in">
      <div class="latam-head">
        <h2>Hecho en Latinoamérica</h2>
        <p>${latam.length} juegos de ${studios} estudios en ${byCountry.length} países. Cada ficha te dice quién lo hizo y desde dónde.</p>
        <a class="btn" href="#/estudios">Conoce los estudios</a>
      </div>
      <ul class="countries">${byCountry.map(([c, n]) => `<li><a href="#/catalogo?pais=${encodeURIComponent(c)}"><span class="c-name">${c}</span><span class="c-n">${plural(n, 'juego')}</span></a></li>`).join('')}</ul>
    </div>
  </section>
  <div class="page">
    ${secHead('Por qué Bravo')}
    <ul class="why">
      <li><h3>Precio final en USD</h3><p>Lo que ves en la ficha es lo que pagas, con impuestos incluidos. Sin conversiones ni sorpresas en el último paso.</p></li>
      <li><h3>Pagos explicados</h3><p>Revisa métodos de pago, reembolsos y protección de datos antes de crear tu cuenta.</p><a class="link" href="#/ayuda">Ver pagos y seguridad</a></li>
      <li><h3>Estudios al frente</h3><p>Cada juego muestra a su estudio y su ciudad. Comprar aquí es apoyar a quienes crean en la región.</p><a class="link" href="#/estudios">Ver estudios</a></li>
    </ul>
  </div>
  <section class="band s-b cta">
    <div class="band-in">
      <h2>¿Haces videojuegos en Latinoamérica?</h2>
      <div><p>Postula tu juego y llega a jugadores de toda la región, con precios y pagos pensados para ellos.</p><a class="btn btn--ink" href="#/publicar">Publica en Bravo</a></div>
    </div>
  </section>`);
}

function filterGames(p) {
  const q = norm(p.get('q') || '');
  const list = GAMES.filter(g =>
    (!q || norm(`${g.title} ${studioOf(g).name} ${studioOf(g).country} ${g.genres.join(' ')}`).includes(q)) &&
    (!p.get('genero') || g.genres.includes(p.get('genero'))) &&
    (!p.get('pais') || studioOf(g).country === p.get('pais')) &&
    (!p.get('max') || final(g) <= +p.get('max')) &&
    (!p.get('oferta') || g.off > 0) &&
    (!p.get('latam') || isLatam(g)));
  const sorts = { precio: (a, b) => final(a) - final(b), 'precio-desc': (a, b) => final(b) - final(a), descuento: (a, b) => b.off - a.off, nuevo: (a, b) => b.year - a.year };
  return sorts[p.get('orden')] ? list.sort(sorts[p.get('orden')]) : list;
}

function catalog(_, p) {
  const title = p.get('oferta') ? 'Ofertas' : 'Catálogo';
  const countries = [...new Set(GAMES.map(g => studioOf(g).country))].sort();
  render(title, `<div class="page">
    <header class="page-head"><h1>${title}</h1><p class="count" role="status" data-count></p></header>
    <div class="cat">
      <details class="filters-wrap"${wide() ? ' open' : ''}><summary>Filtros y orden ${ic('close')}</summary>
      <form class="filters" data-form="filters">
        <label class="field"><span>Buscar</span><input id="cq" name="q" type="search" value="${esc(p.get('q'))}" placeholder="Juego, estudio o país" autocomplete="off"></label>
        <fieldset class="field"><legend>Género</legend><div class="chips">${[['', 'Todos'], ...genres().map(t => [t, t])].map(([v, l]) => `<label class="chip"><input type="radio" name="genero" value="${v}"${(p.get('genero') || '') === v ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div></fieldset>
        <label class="field"><span>País del estudio</span><select name="pais">${options([['', 'Todos'], ...countries.map(c => [c, c])], p.get('pais'))}</select></label>
        <label class="field"><span>Precio máximo</span><select name="max">${options([['', 'Cualquiera'], ['5', 'Hasta $5'], ['10', 'Hasta $10'], ['15', 'Hasta $15'], ['20', 'Hasta $20']], p.get('max'))}</select></label>
        <label class="field"><span>Ordenar por</span><select name="orden">${options([['', 'Destacados'], ['precio', 'Precio: menor a mayor'], ['precio-desc', 'Precio: mayor a menor'], ['descuento', 'Mayor descuento'], ['nuevo', 'Más recientes']], p.get('orden'))}</select></label>
        <label class="check"><input type="checkbox" name="oferta" value="1"${p.get('oferta') ? ' checked' : ''}> Solo ofertas</label>
        <label class="check"><input type="checkbox" name="latam" value="1"${p.get('latam') ? ' checked' : ''}> Solo estudios latinoamericanos</label>
      </form></details>
      <div data-results></div>
    </div></div>`);
  results(p);
}

function results(p) {
  const list = filterGames(p);
  $('[data-count]').textContent = plural(list.length, 'juego');
  $('[data-results]').innerHTML = list.length ? grid(list)
    : empty('Ningún juego coincide', 'Prueba con otro género o quita algún filtro.', '<a class="btn btn--ghost" href="#/catalogo">Ver todo el catálogo</a>');
}

function buyBox(g) {
  const id = g.id;
  if (S.lib.includes(id)) return `${price(g, 'price--big')}
    <p class="owned">${ic('check')} Ya está en tu biblioteca</p>
    <button class="btn btn--block" data-act="download" data-id="${id}">${ic('download')} Descargar</button>
    <p class="status" role="status" data-status="${id}"></p>
    <a class="link" href="#/cuenta/biblioteca">Ir a mi biblioteca</a>`;
  const wished = S.wish.includes(id);
  return `${price(g, 'price--big')}
    <p class="note">Precio final en USD, impuestos incluidos.</p>
    <button class="btn btn--block" data-act="buy" data-id="${id}">Comprar ahora ${ic('play')}</button>
    ${S.cart.includes(id) ? `<a class="btn btn--ghost btn--block" href="#/carrito" data-after="cart">${ic('check')} En tu carrito · Ver</a>` : `<button class="btn btn--ghost btn--block" data-act="cart" data-id="${id}">${ic('cart')} Añadir al carrito</button>`}
    <button class="wish" data-act="wish" data-id="${id}" data-on="${wished}">${ic('heart')} ${wished ? 'En tu lista de deseos' : 'Guardar en lista de deseos'}</button>
    <ul class="trust"><li>Pagas en la pasarela segura del proveedor</li><li>Reembolso hasta 14 días después de la compra, con menos de 2 horas jugadas</li></ul>
    <a class="link" href="#/ayuda">Métodos de pago y políticas</a>`;
}

function reviews(g) {
  const list = S.reviews[g.id] || [], owned = S.lib.includes(g.id);
  const items = list.map(r => `<li class="review"><p><strong>${esc(r.name)}</strong> <span class="rv-tag${r.rec ? '' : ' rv-tag--no'}">${r.rec ? 'Lo recomienda' : 'No lo recomienda'}</span></p><p>${esc(r.text)}</p><p class="meta">Compra verificada en Bravo · ${day.format(new Date(r.date))}</p></li>`).join('');
  const form = owned ? `<form class="form" data-form="review" data-id="${g.id}">
      <fieldset class="field"><legend>¿Lo recomiendas?</legend><div class="chips"><label class="chip"><input type="radio" name="rec" value="1" checked><span>Sí</span></label><label class="chip"><input type="radio" name="rec" value="0"><span>No</span></label></div></fieldset>
      <label class="field"><span>Tu reseña</span><textarea name="text" rows="4" minlength="20" maxlength="600" required placeholder="¿Qué te gustó? ¿Qué mejorarías?"></textarea><small>Entre 20 y 600 caracteres.</small></label>
      <button class="btn">Publicar reseña</button></form>` : '';
  if (items) return `<ul class="reviews">${items}</ul>${form}`;
  return `<p class="empty-inline"><strong>Aún no hay reseñas verificadas.</strong> Solo quienes compran en Bravo pueden reseñar, así cada opinión viene de un jugador real.${owned ? ' Escribe la primera.' : ''}</p>${form}`;
}

function game(id) {
  const g = G[id];
  if (!g) return notFound();
  const st = studioOf(g), req = REQS[g.tier];
  const similar = GAMES.filter(x => x.id !== id && x.genres.some(t => g.genres.includes(t)))
    .sort((a, b) => (b.studio === g.studio) - (a.studio === g.studio) || isLatam(b) - isLatam(a)).slice(0, 4);
  render(g.title, `<article>
    <section class="game-top s-${g.scheme}">
      <div class="game-in">
        <nav class="crumbs" aria-label="Ruta"><a href="#/catalogo">Catálogo</a><span aria-hidden="true">/</span><a href="#/catalogo?genero=${encodeURIComponent(g.genres[0])}">${g.genres[0]}</a></nav>
        <div class="game-cover">${cover(g)}</div>
        <div class="game-info">
          <h1>${esc(g.title)}</h1>
          <p class="by"><a href="#/estudio/${g.studio}">${esc(st.name)}</a> · ${place(st)} · ${g.year}</p>
          <ul class="tags">${g.genres.map(t => `<li><a href="#/catalogo?genero=${encodeURIComponent(t)}">${t}</a></li>`).join('')}</ul>
          <p class="lede">${g.blurb}</p>
        </div>
        <aside class="buy" aria-label="Compra">${buyBox(g)}</aside>
        <nav class="run" aria-label="Todos los juegos en orden">${GAMES.map(x => `<a href="#/juego/${x.id}" title="${esc(x.title)}" aria-label="${esc(x.title)}"${x.id === id ? ' aria-current="page"' : ''}>${pad(x.n)}</a>`).join('')}</nav>
      </div>
    </section>
    <div class="page game-body">
      <div>
        <section><h2 class="h2">Sobre el juego</h2><p>${g.about}</p></section>
        <section><h2 class="h2">Requisitos de PC</h2><p class="note">Valores orientativos en esta demo.</p>
          <div class="reqs">${[['min', 'Mínimos'], ['rec', 'Recomendados']].map(([k, l]) => `<div class="req"><h3>${l}</h3><dl>${REQ_LABELS.map((x, i) => `<div><dt>${x}</dt><dd>${req[k][i]}</dd></div>`).join('')}</dl></div>`).join('')}</div>
        </section>
        <section id="resenas"><h2 class="h2" tabindex="-1">Reseñas verificadas</h2>${reviews(g)}</section>
      </div>
      <aside class="studio-box" aria-label="El estudio"><h2 class="studio-name"><a href="#/estudio/${g.studio}">${esc(st.name)}</a></h2><p class="meta">${place(st)}</p><p>${st.bio}</p><a class="btn btn--ghost btn--sm" href="#/estudio/${g.studio}">Ver sus juegos</a></aside>
    </div>
    <div class="page page--tight">${secHead('También te puede gustar')}${grid(similar)}</div>
  </article>`);
}

const studioRow = s => `<li><a class="studio-row" href="#/estudio/${s.id}">${cover(s.games[0], 'tc--mini')}<span class="sr-body"><strong>${esc(s.name)}</strong><span class="meta">${place(s)} · ${plural(s.games.length, 'juego')}</span><span>${s.bio}</span></span>${ic('play')}</a></li>`;

function studios() {
  const all = Object.entries(STUDIOS).map(([id, s]) => ({ id, ...s, games: GAMES.filter(g => g.studio === id) })).filter(s => s.games.length);
  const groups = Object.entries(all.filter(s => s.latam !== false).reduce((m, s) => ({ ...m, [s.country]: [...(m[s.country] || []), s] }), {}))
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  render('Estudios', `<div class="page">
    <header class="page-head page-head--lede"><h1>Hecho en Latinoamérica</h1><p>Bravo existe para que estos estudios vayan al frente. Conoce quién crea videojuegos en la región, desde dónde y qué puedes jugar de cada uno.</p></header>
    ${groups.map(([c, list]) => `<section class="country"><h2>${c}</h2><ul class="studio-list">${list.map(studioRow).join('')}</ul></section>`).join('')}
    <section class="country country--intl"><h2>Invitados internacionales</h2><p class="note">Bravo se enfoca en la región, pero no se cierra a ella.</p><ul class="studio-list">${all.filter(s => s.latam === false).map(studioRow).join('')}</ul></section>
  </div>`);
}

function studio(id) {
  const s = STUDIOS[id];
  const games = GAMES.filter(g => g.studio === id);
  if (!s || !games.length) return notFound();
  render(s.name, `<section class="band s-${games[0].scheme} studio-top"><div class="band-in">
      <nav class="crumbs" aria-label="Ruta"><a href="#/estudios">Estudios</a><span aria-hidden="true">/</span><span>${s.country}</span></nav>
      <h1>${esc(s.name)}</h1>
      <p class="lede">${s.bio}</p>
      <p class="by">${place(s)} · ${plural(games.length, 'juego')} en Bravo</p>
    </div></section>
    <div class="page page--tight">${secHead('Sus juegos')}${grid(games)}</div>`);
}

function line(g, removable, paid) {
  return `<li class="line">${cover(g, 'tc--mini')}<div><a class="line-t" href="#/juego/${g.id}">${esc(g.title)}</a><p class="meta">${esc(studioOf(g).name)} · N.º ${pad(g.n)}</p></div>${paid === undefined ? price(g) : `<p class="price"><b>${usd.format(paid)}</b></p>`}${removable ? `<button class="icon-btn" data-act="uncart" data-id="${g.id}" aria-label="Quitar ${esc(g.title)} del carrito">${ic('close')}</button>` : ''}</li>`;
}

function summary(ids) {
  const list = ids.map(id => G[id]), sum = total(ids);
  const full = Math.round(list.reduce((t, g) => t + g.price, 0) * 100) / 100;
  return `<h2 class="h2">Resumen</h2>
    <dl class="totals"><div><dt>Precio de lista</dt><dd>${usd.format(full)}</dd></div>${full > sum ? `<div><dt>Descuentos</dt><dd>−${usd.format(full - sum)}</dd></div>` : ''}<div class="grand"><dt>Total final</dt><dd>${usd.format(sum)}</dd></div></dl>
    <p class="note">Impuestos incluidos. Pagas en USD.</p>`;
}

function cart() {
  if (!S.cart.length) return render('Carrito', `<div class="page"><header class="page-head"><h1>Tu carrito</h1></header>
    ${empty('Tu carrito está vacío', 'Explora el catálogo o revisa tu lista de deseos.', `<a class="btn" href="#/catalogo">Explorar juegos</a>${S.wish.length ? '<a class="btn btn--ghost" href="#/cuenta/deseos">Ver lista de deseos</a>' : ''}`)}</div>`);
  render('Carrito', `<div class="page">
    <header class="page-head"><h1>Tu carrito</h1><p class="count">${plural(S.cart.length, 'juego')}</p></header>
    <div class="split">
      <ul class="lines">${S.cart.map(id => line(G[id], true)).join('')}</ul>
      <aside class="summary">${summary(S.cart)}<a class="btn btn--block" href="#/pagar">Continuar al pago ${ic('play')}</a><p class="note">Antes de pagar puedes revisar los <a href="#/ayuda">métodos de pago y reembolsos</a>.</p></aside>
    </div></div>`);
}

function checkout() {
  if (!S.cart.length) return cart();
  const u = S.user;
  render('Pagar', `<div class="page">
    <header class="page-head"><h1>Pagar</h1><p class="count">Sin cobros en esta demo</p></header>
    <form class="split" data-form="checkout">
      <div class="steps">
        <fieldset class="step"><legend><b>1</b> Tu cuenta</legend>
          ${u ? `<p>Compras como <strong>${esc(u.name)}</strong> (${esc(u.email)}). <a href="#/ingresar?volver=pagar">¿No eres tú?</a></p>`
            : `<p class="note">Creamos tu cuenta con estos datos para guardar tus juegos. ¿Ya tienes una? <a href="#/ingresar?volver=pagar">Ingresa</a>.</p>
          <div class="row2"><label class="field"><span>Nombre</span><input name="name" autocomplete="name" required></label><label class="field"><span>Correo</span><input name="email" type="email" autocomplete="email" required></label></div>
          <label class="field"><span>Contraseña</span><input name="password" type="password" autocomplete="new-password" minlength="8" required aria-describedby="pw-hint"><small id="pw-hint">Mínimo 8 caracteres.</small></label>`}
        </fieldset>
        <fieldset class="step"><legend><b>2</b> Método de pago</legend>
          <div class="pays">${PAY.map((m, i) => `<label class="pay"><input type="radio" name="method" value="${m.id}" required${i ? '' : ' checked'}><span><strong>${m.name}</strong><small>${m.desc}</small></span></label>`).join('')}</div>
          <p class="note">En la versión real completarías el pago en la pasarela segura del proveedor. Bravo no guarda los datos de tu tarjeta.</p>
        </fieldset>
        <fieldset class="step"><legend><b>3</b> Confirma</legend>
          <label class="check"><input type="checkbox" name="terms" required> <span>Acepto los términos de compra y la <a href="#/ayuda">política de reembolsos</a>.</span></label>
          <button class="btn btn--block btn--lg">Confirmar compra · ${usd.format(total(S.cart))}</button>
          <p class="note">Demo: no se realiza ningún cobro.</p>
        </fieldset>
      </div>
      <aside class="summary"><ul class="lines lines--compact">${S.cart.map(id => line(G[id])).join('')}</ul>${summary(S.cart)}</aside>
    </form></div>`);
}

function confirmation(id) {
  const o = S.orders.find(x => x.id === id);
  if (!o) return notFound();
  render('Compra confirmada', `<section class="band s-m confirm-top"><div class="band-in">
      <h1>¡Compra confirmada!</h1>
      <p class="lede">Tu pedido <strong>${o.id}</strong> está listo y tus juegos ya aparecen en tu biblioteca.</p>
      <p class="note">En la versión real te enviaríamos este recibo a ${esc(S.user?.email || 'tu correo')}.</p>
    </div></section>
    <div class="page"><div class="split">
      <section class="receipt"><h2 class="h2">Recibo</h2>
        <dl class="kv"><div><dt>Pedido</dt><dd>${o.id}</dd></div><div><dt>Fecha</dt><dd>${day.format(new Date(o.date))}</dd></div><div><dt>Método</dt><dd>${PAY.find(m => m.id === o.method)?.name || ''}</dd></div></dl>
        <ul class="lines lines--compact">${o.items.map(i => line(G[i.id], false, i.price)).join('')}</ul>
        <dl class="totals"><div class="grand"><dt>Total pagado</dt><dd>${usd.format(o.total)}</dd></div></dl>
      </section>
      <aside class="summary"><h2 class="h2">Cómo jugar</h2>
        <ol class="howto"><li>Abre <a href="#/cuenta/biblioteca">tu biblioteca</a>.</li><li>Pulsa <strong>Descargar</strong> para bajar el instalador.</li><li>Instala y juega. La compra queda guardada en tu cuenta.</li></ol>
        <a class="btn btn--block" href="#/cuenta/biblioteca">Ir a mi biblioteca</a>
        <p class="note">¿Algo salió mal? <a href="#/ayuda">Escribe a soporte</a> con tu número de pedido.</p>
      </aside>
    </div></div>`);
}

function login(_, p) {
  const reg = p.get('modo') === 'registro';
  const back = /^[a-z/]+$/.test(p.get('volver') || '') ? p.get('volver') : 'cuenta';
  const q = 'volver=' + encodeURIComponent(back);
  render(reg ? 'Crear cuenta' : 'Ingresar', `<div class="page page--narrow"><div class="auth">
    <nav class="tabs" aria-label="Tipo de acceso"><a href="#/ingresar?${q}"${reg ? '' : ' aria-current="page"'}>Ingresar</a><a href="#/ingresar?modo=registro&${q}"${reg ? ' aria-current="page"' : ''}>Crear cuenta</a></nav>
    <h1>${reg ? 'Crea tu cuenta' : 'Hola de nuevo'}</h1>
    <p class="lede">${reg ? 'Solo lo necesario para guardar tus juegos y tu lista de deseos.' : 'Ingresa para ver tu biblioteca y seguir con tu compra.'}</p>
    <form class="form" data-form="login" data-back="${back}">
      ${reg ? '<label class="field"><span>Nombre de usuario</span><input name="name" autocomplete="nickname" required></label>' : ''}
      <label class="field"><span>Correo</span><input name="email" type="email" autocomplete="email" required></label>
      <label class="field"><span>Contraseña</span><input name="password" type="password" autocomplete="${reg ? 'new-password' : 'current-password'}" minlength="8" required></label>
      ${reg ? `<label class="field"><span>País</span><select name="country">${countryOptions('')}</select></label><label class="check"><input type="checkbox" name="news" value="1"> <span>Quiero recibir ofertas según los géneros que juego</span></label>` : ''}
      <button class="btn btn--block">${reg ? 'Crear cuenta' : 'Ingresar'}</button>
      <p class="note">Demo: tus datos se guardan solo en este navegador y la contraseña no se almacena.</p>
    </form>
  </div></div>`);
}

const tabs = {
  biblioteca: () => (S.lib.length ? `<ul class="lib">${S.lib.map(id => { const g = G[id]; return `<li class="lib-item">${cover(g)}<div><a class="line-t" href="#/juego/${id}">${esc(g.title)}</a><p class="meta">${esc(studioOf(g).name)}</p></div><div class="lib-actions"><button class="btn btn--sm" data-act="download" data-id="${id}">${ic('download')} Descargar</button><a class="link" href="#/juego/${id}">Reseñar</a></div><p class="status" role="status" data-status="${id}"></p></li>`; }).join('')}</ul>`
    : empty('Aún no tienes juegos', 'Tu primera compra aparecerá aquí, lista para descargar.', '<a class="btn" href="#/catalogo">Explorar juegos</a>'))
    + secHead('Recomendado para ti', '#/catalogo', 'Ver catálogo') + grid(recommend()),
  deseos: () => S.wish.length ? `<ul class="lib">${S.wish.map(id => { const g = G[id]; return `<li class="lib-item">${cover(g)}<div><a class="line-t" href="#/juego/${id}">${esc(g.title)}</a>${price(g)}</div><div class="lib-actions">${S.lib.includes(id) ? '<span class="meta">Ya lo tienes</span>' : S.cart.includes(id) ? '<a class="btn btn--sm btn--ghost" href="#/carrito" data-after="cart">En tu carrito</a>' : `<button class="btn btn--sm" data-act="cart" data-id="${id}">${ic('cart')} Añadir</button>`}<button class="link" data-act="wish" data-id="${id}">Quitar</button></div></li>`; }).join('')}</ul>`
    : empty('Tu lista de deseos está vacía', 'Guarda juegos desde su ficha y te avisaremos cuando bajen de precio.', '<a class="btn" href="#/catalogo?oferta=1">Ver ofertas</a>'),
  historial: () => S.orders.length ? `<div class="table-wrap"><table class="table"><thead><tr><th scope="col">Pedido</th><th scope="col">Fecha</th><th scope="col">Juegos</th><th scope="col">Método</th><th scope="col" class="num">Total</th></tr></thead><tbody>${S.orders.map(o => `<tr><td><a href="#/confirmacion/${o.id}">${o.id}</a></td><td>${day.format(new Date(o.date))}</td><td>${o.items.map(i => esc(G[i.id].title)).join(', ')}</td><td>${PAY.find(m => m.id === o.method)?.name || ''}</td><td class="num">${usd.format(o.total)}</td></tr>`).join('')}</tbody></table></div>`
    : empty('Todavía no hay compras', 'Aquí verás cada pedido con su recibo.', '<a class="btn" href="#/catalogo">Explorar juegos</a>'),
  ajustes: () => {
    const p = S.prefs, u = S.user, chk = k => (p[k] ? ' checked' : '');
    return `<div class="settings">
      <form class="form" data-form="profile"><h2 class="h2">Perfil</h2>
        <label class="field"><span>Nombre de usuario</span><input name="name" value="${esc(u.name)}" autocomplete="nickname" required></label>
        <label class="field"><span>Correo</span><input name="email" type="email" value="${esc(u.email)}" autocomplete="email" required></label>
        <label class="field"><span>País</span><select name="country">${countryOptions(u.country)}</select></label>
        <button class="btn">Guardar perfil</button><p class="status" role="status"></p></form>
      <form class="form" data-form="prefs"><h2 class="h2">Correos de Bravo</h2>
        <p class="note">Elige qué te escribimos y cada cuánto. Puedes cambiarlo cuando quieras.</p>
        <label class="check"><input type="checkbox" name="deals"${chk('deals')}> <span>Ofertas de juegos en mi lista de deseos</span></label>
        <label class="check"><input type="checkbox" name="latam"${chk('latam')}> <span>Lanzamientos de estudios latinoamericanos</span></label>
        <label class="check"><input type="checkbox" name="recs"${chk('recs')}> <span>Recomendaciones según mis géneros</span></label>
        <fieldset class="field"><legend>Géneros favoritos</legend><div class="chips">${genres().map(t => `<label class="chip"><input type="checkbox" name="genres" value="${t}"${p.genres.includes(t) ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>
        <label class="field"><span>Frecuencia</span><select name="freq">${options([['semanal', 'Una vez por semana'], ['mensual', 'Una vez al mes']], p.freq)}</select></label>
        <button class="btn">Guardar preferencias</button><p class="status" role="status"></p></form>
      <section class="session"><h2 class="h2">Sesión</h2><div class="actions"><button class="btn btn--ghost" data-act="logout">Cerrar sesión</button><button class="btn btn--ghost" data-act="reset">Borrar datos de la demo</button></div></section>
    </div>`;
  },
};

function account(tab) {
  if (!S.user) return render('Tu cuenta', `<div class="page page--narrow">${empty('Tu biblioteca te espera', 'Ingresa o crea una cuenta para ver tus juegos, tu lista de deseos y tu historial.', '<a class="btn" href="#/ingresar?volver=cuenta">Ingresar</a><a class="btn btn--ghost" href="#/ingresar?modo=registro&volver=cuenta">Crear cuenta</a>')}</div>`);
  if (!tabs[tab]) tab = 'biblioteca';
  const counts = { biblioteca: S.lib.length, deseos: S.wish.length, historial: S.orders.length };
  const labels = { biblioteca: 'Biblioteca', deseos: 'Lista de deseos', historial: 'Historial', ajustes: 'Ajustes' };
  render(labels[tab], `<div class="page">
    <header class="page-head"><h1>Hola, ${esc(S.user.name)}</h1></header>
    <nav class="tabs" aria-label="Tu cuenta">${Object.keys(tabs).map(t => `<a href="#/cuenta/${t}"${t === tab ? ' aria-current="page"' : ''}>${labels[t]}${t in counts ? ` <span class="tab-n">${counts[t]}</span>` : ''}</a>`).join('')}</nav>
    ${tabs[tab]()}
  </div>`);
}

function help() {
  render('Pagos y ayuda', `<div class="page page--read">
    <header class="page-head page-head--lede"><h1>Pagos, seguridad y ayuda</h1><p>Lo que necesitas saber antes de comprar: cómo pagar, cómo cuidamos tus datos y qué pasa si algo sale mal.</p></header>
    <section class="help-sec"><h2>Cómo puedes pagar</h2><p>La disponibilidad de cada método depende de tu país. En esta demo ninguno realiza cobros.</p>
      <ul class="pay-list">${PAY.map(m => `<li><strong>${m.name}</strong><span>${m.desc}</span></li>`).join('')}</ul></section>
    <section class="help-sec"><h2>Tus datos, protegidos</h2><ul class="ticks">
      <li>El pago se procesa en la pasarela del proveedor; Bravo nunca guarda los datos de tu tarjeta.</li>
      <li>Toda la navegación viaja cifrada por HTTPS.</li>
      <li>Para crear tu cuenta solo pedimos nombre, correo y contraseña.</li>
      <li>Puedes borrar tu cuenta y tus datos desde Ajustes cuando quieras.</li></ul></section>
    <section class="help-sec"><h2>Reembolsos</h2><p>Puedes pedir el reembolso de un juego dentro de los <strong>14 días</strong> posteriores a la compra si lo jugaste <strong>menos de 2 horas</strong>. Te devolvemos el dinero por el mismo método de pago.</p>
      <ol class="howto"><li>Abre <a href="#/cuenta/historial">tu historial de compras</a> y copia el número de pedido.</li><li>Escríbenos desde el formulario de abajo eligiendo «Reembolso».</li><li>Te respondemos en un máximo de 48 horas hábiles.</li></ol></section>
    <section class="help-sec"><h2>Preguntas frecuentes</h2>${FAQ.map(([q, a]) => `<details class="faq"><summary>${q}${ic('close')}</summary><p>${a}</p></details>`).join('')}</section>
    <section class="help-sec"><h2>Escríbenos</h2>
      <form class="form" data-form="contact">
        <label class="field"><span>Correo</span><input name="email" type="email" autocomplete="email" value="${esc(S.user?.email)}" required></label>
        <label class="field"><span>Motivo</span><select name="topic">${options([['pago', 'Problema con un pago'], ['reembolso', 'Reembolso'], ['acceso', 'No puedo acceder a un juego'], ['otro', 'Otro']], '')}</select></label>
        <label class="field"><span>Mensaje</span><textarea name="msg" rows="5" required placeholder="Cuéntanos qué pasó e incluye tu número de pedido si lo tienes."></textarea></label>
        <button class="btn">Enviar mensaje</button><p class="status" role="status"></p>
      </form></section>
  </div>`);
}

function publish() {
  render('Publica tu juego', `<section class="band s-b pub-top"><i class="hero-bar" aria-hidden="true"></i><div class="band-in">
      <h1>Publica tu juego en Bravo</h1>
      <p class="lede">Una vitrina para estudios latinoamericanos, frente a jugadores de toda la región que pagan con sus métodos de siempre.</p>
      <button class="btn btn--ink" data-act="toForm">Postular mi juego</button>
    </div></section>
    <div class="page page--tight">
      ${secHead('Qué te ofrece Bravo')}
      <ul class="why">
        <li><h3>Vitrina regional</h3><p>Tu estudio aparece en «Hecho en Latinoamérica» y en cada ficha, con tu ciudad y tu historia.</p></li>
        <li><h3>Precios por región</h3><p>Defines tu precio en USD y te sugerimos rangos para cada país.</p></li>
        <li><h3>Pagos locales</h3><p>Tus jugadores pagan con tarjeta, billetera digital, transferencia o efectivo.</p></li>
        <li><h3>Reseñas verificadas</h3><p>Solo opinan quienes compraron tu juego, y ves tus ventas por país.</p></li>
      </ul>
      ${secHead('Cómo funciona')}
      <ol class="steps-row">
        <li><b>1</b><h3>Postula</h3><p>Cuéntanos de tu juego y comparte una build o un tráiler.</p></li>
        <li><b>2</b><h3>Revisión</h3><p>El equipo de curaduría prueba el juego y acuerda contigo precio y fecha.</p></li>
        <li><b>3</b><h3>Lanzamiento</h3><p>Publicamos tu ficha y la destacamos en la tienda y en redes.</p></li>
      </ol>
      <p class="note">Las condiciones comerciales se definirán con los primeros estudios.</p>
      <section id="postular">${secHead('Postula tu juego')}
        <form class="form form--wide" data-form="publish">
          <label class="field"><span>Nombre del estudio</span><input name="studio" autocomplete="organization" required></label>
          <label class="field"><span>País</span><select name="country" required>${countryOptions('')}</select></label>
          <label class="field"><span>Correo de contacto</span><input name="email" type="email" autocomplete="email" required></label>
          <label class="field"><span>Nombre del juego</span><input name="game" required></label>
          <label class="field"><span>Enlace a tráiler o build</span><input name="url" type="url" placeholder="https://"></label>
          <label class="field"><span>Etapa</span><select name="stage">${options([['desarrollo', 'En desarrollo'], ['demo', 'Demo jugable'], ['lanzado', 'Ya lanzado']], '')}</select></label>
          <label class="field full"><span>Cuéntanos de tu juego</span><textarea name="pitch" rows="5" minlength="30" required placeholder="Género, qué lo hace único y en qué plataformas está."></textarea></label>
          <div class="full"><button class="btn btn--lg">Enviar postulación</button></div>
        </form>
      </section>
    </div>`);
}

function notFound() {
  render('No encontrado', `<div class="page page--narrow"><div class="empty"><h1>Esta sesión no existe</h1><p>La página que buscas no está en Bravo.</p><a class="btn" href="#/">Volver al inicio</a></div></div>`);
}

// ---------- rutas ----------
const routes = { '': home, catalogo: catalog, juego: game, estudios: studios, estudio: studio, carrito: cart, pagar: checkout, confirmacion: confirmation, ingresar: login, cuenta: account, ayuda: help, publicar: publish };
let started = false;

function route(keep) {
  const h = location.hash || '#/';
  if (!h.startsWith('#/')) return; // anclas internas, p. ej. «Saltar al contenido»
  const [path, qs] = h.slice(2).split('?');
  const [name = '', arg] = path.split('/');
  const p = new URLSearchParams(qs);
  (routes[name] || notFound)(arg && decodeURIComponent(arg), p);
  const current = name === 'catalogo' ? (p.get('oferta') ? '#/catalogo?oferta=1' : '#/catalogo') : name === 'estudio' ? '#/estudios' : '#/' + name;
  $$('.nav a').forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === current));
  if (keep) return;
  scrollTo(0, 0);
  if (started) $('h1', app)?.focus({ preventScroll: true });
  started = true;
}

// Vuelve a pintar la pantalla actual sin mover el scroll y devuelve el foco al control equivalente.
function refresh(...selectors) {
  const y = scrollY;
  route(true);
  scrollTo(0, y);
  (selectors.map(s => s && $(s)).find(Boolean) || $('h1', app))?.focus({ preventScroll: true });
}

function chrome() {
  const n = S.cart.length, badge = $('[data-cart-count]');
  if (badge.textContent !== String(n) && n) { badge.classList.remove('stamp'); void badge.offsetWidth; badge.classList.add('stamp'); }
  badge.textContent = n;
  badge.hidden = !n;
  $('[data-cart]').setAttribute('aria-label', `Carrito, ${plural(n, 'juego')}`);
  $('[data-account]').setAttribute('aria-label', S.user ? `Cuenta de ${S.user.name}` : 'Ingresar o crear cuenta');
}

// ---------- acciones ----------
const add = id => { if (!S.cart.includes(id)) S.cart.push(id); save('cart'); };
const actions = {
  cart: id => { add(id); say(`${G[id].title} se añadió al carrito`); },
  buy: id => { add(id); chrome(); location.hash = '#/pagar'; return true; },
  uncart: id => { S.cart = S.cart.filter(x => x !== id); save('cart'); say(`${G[id].title} se quitó del carrito`); },
  wish: id => {
    S.wish = S.wish.includes(id) ? S.wish.filter(x => x !== id) : [...S.wish, id];
    save('wish');
    say(S.wish.includes(id) ? 'Guardado en tu lista de deseos' : 'Quitado de tu lista de deseos');
  },
  download: id => { $(`[data-status="${id}"]`).textContent = 'Descarga simulada: en la versión real empezaría a bajar el instalador.'; return true; },
  logout: () => { S.user = null; save('user'); chrome(); location.hash = '#/'; return true; },
  reset: () => {
    try { Object.keys(localStorage).filter(k => k.startsWith('bravo.')).forEach(k => localStorage.removeItem(k)); } catch { /* nada que borrar */ }
    location.hash = '#/';
    location.reload();
    return true;
  },
  toForm: () => {
    $('#postular').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    $('#postular input').focus({ preventScroll: true });
    return true;
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const { act, id } = el.dataset;
  if (actions[act](id)) return;
  chrome();
  refresh(`[data-act="${act}"][data-id="${id}"]`, `[data-after~="${act}"]`);
});

const status = (f, msg) => { $('.status', f).textContent = msg; };
const forms = {
  search: (f, d) => { location.hash = '#/catalogo?q=' + encodeURIComponent(d.get('q').trim()); f.reset(); },
  filters: () => {},
  login: (f, d) => {
    const email = d.get('email').trim();
    const known = S.user?.email === email ? S.user : null;
    S.user = { name: (d.get('name') || known?.name || email.split('@')[0]).trim(), email, country: d.get('country') || known?.country || '' };
    if (d.get('news')) S.prefs.recs = true;
    save('user', 'prefs');
    chrome();
    location.hash = '#/' + f.dataset.back;
  },
  checkout: (f, d) => {
    if (!S.user) S.user = { name: d.get('name').trim(), email: d.get('email').trim(), country: '' };
    const id = 'BRV-' + Date.now().toString(36).toUpperCase().slice(-6);
    S.orders.unshift({ id, date: new Date().toISOString(), items: S.cart.map(i => ({ id: i, price: final(G[i]) })), total: total(S.cart), method: d.get('method') });
    S.lib = [...new Set([...S.lib, ...S.cart])];
    S.wish = S.wish.filter(x => !S.cart.includes(x));
    S.cart = [];
    save('user', 'orders', 'lib', 'wish', 'cart');
    chrome();
    location.hash = '#/confirmacion/' + id;
  },
  review: (f, d) => {
    const id = f.dataset.id;
    S.reviews[id] = [{ name: S.user?.name || 'Jugador', text: d.get('text').trim(), rec: d.get('rec') === '1', date: new Date().toISOString() }, ...(S.reviews[id] || [])];
    save('reviews');
    say('Reseña publicada');
    refresh('#resenas h2');
  },
  profile: (f, d) => {
    Object.assign(S.user, { name: d.get('name').trim(), email: d.get('email').trim(), country: d.get('country') });
    save('user');
    chrome();
    status(f, 'Perfil guardado.');
  },
  prefs: (f, d) => {
    S.prefs = { deals: d.has('deals'), latam: d.has('latam'), recs: d.has('recs'), freq: d.get('freq'), genres: d.getAll('genres') };
    save('prefs');
    status(f, 'Preferencias guardadas.');
  },
  contact: f => { f.reset(); status(f, 'Mensaje enviado (demo). Te responderíamos en 24 a 48 horas hábiles.'); },
  newsletter: f => { f.reset(); status(f, 'Listo: te escribiremos con ofertas y lanzamientos (demo).'); },
  publish: f => {
    f.outerHTML = '<div class="done" tabindex="-1"><h3>Postulación recibida</h3><p>Gracias. En la versión real, el equipo de curaduría revisaría tu juego y te escribiría en un plazo de dos semanas.</p></div>';
    $('.done').focus();
  },
};

document.addEventListener('submit', e => {
  const f = e.target, handler = forms[f.dataset.form];
  if (!handler) return;
  e.preventDefault();
  handler(f, new FormData(f));
});

document.addEventListener('input', e => {
  const f = e.target.closest('[data-form="filters"]');
  if (!f) return;
  const p = new URLSearchParams([...new FormData(f)].filter(([, v]) => v));
  history.replaceState(null, '', '#/catalogo' + (p.size ? '?' + p : ''));
  results(p);
});

// «/» lleva a la búsqueda desde cualquier pantalla.
addEventListener('keydown', e => {
  if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || e.target.closest('input, textarea, select')) return;
  const box = [$('#cq'), $('#q')].find(x => x?.offsetParent);
  e.preventDefault();
  if (box) box.focus();
  else location.hash = '#/catalogo';
});

addEventListener('hashchange', () => route());
chrome();
route();
