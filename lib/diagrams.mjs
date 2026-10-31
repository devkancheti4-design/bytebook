// Tiny SVG generators for :::diagram blocks. Every shape is styled by
// classes in site.css, so the same markup works in light and dark mode.
let uid = 0;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function params(body) {
  const p = {};
  for (const ln of body.split('\n')) {
    const m = ln.match(/^\s*([a-z][\w-]*)\s*:\s*(.*)$/i);
    if (m) p[m[1].toLowerCase()] = m[2].trim();
  }
  return p;
}

const words = s => (s || '').trim() ? s.trim().split(/\s+/) : [];
const nums = s => (s || '').split(/[\s,]+/).filter(Boolean).map(Number);
const textW = (s, px = 9.4) => String(s).length * px;
const maxW = (vals, px) => Math.max(0, ...vals.map(v => textW(v, px)));

function svg(w, h, inner, label) {
  w = Math.ceil(w); h = Math.ceil(h);
  return `<svg class="dg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
}
function marker() {
  const id = `dg-ah-${++uid}`;
  return [id, `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse"><path class="ah" d="M0,1.2 L10,5 L0,8.8 z"/></marker></defs>`];
}
const T = (x, y, s, cls = 't') => `<text class="${cls}" x="${+x.toFixed(1)}" y="${+y.toFixed(1)}">${esc(s)}</text>`;
const R = (x, y, w, h, cls = 'box', rx = 6) => `<rect class="${cls}" x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" width="${+w.toFixed(1)}" height="${+h.toFixed(1)}" rx="${rx}"/>`;
const L = (x1, y1, x2, y2, cls = 'edge', mk = '') =>
  `<line class="${cls}" x1="${+x1.toFixed(1)}" y1="${+y1.toFixed(1)}" x2="${+x2.toFixed(1)}" y2="${+y2.toFixed(1)}"${mk ? ` marker-end="url(#${mk})"` : ''}/>`;
const P = (d, cls = 'edge', mk = '') => `<path class="${cls}" d="${d}"${mk ? ` marker-end="url(#${mk})"` : ''}/>`;
const C = (x, y, r, cls) => `<circle class="${cls}" cx="${+x.toFixed(1)}" cy="${+y.toFixed(1)}" r="${r}"/>`;

// values: 10 20 30 | pointers: low=0 high=4 | highlight: 2 | label: arr
function array(p) {
  const vals = words(p.values);
  const hl = new Set(nums(p.highlight)), dim = new Set(nums(p.dim)), ok = new Set(nums(p.done));
  const showIdx = p.index !== 'false';
  const ptrs = {};
  for (const w of words(p.pointers)) { const [name, i] = w.split('='); (ptrs[+i] ||= []).push(name); }
  const hasPtr = Object.keys(ptrs).length > 0;
  const cw = Math.max(50, maxW(vals) + 26), ch = 46;
  const label = p.label || '';
  const left = label ? textW(label, 9.6) + 24 : 6;
  const top = hasPtr ? 48 : 6;
  const w = left + vals.length * cw + 6, h = top + ch + (showIdx ? 28 : 6);
  const [mk, defs] = marker();
  let s = defs;
  if (label) s += T(left - 12, top + ch / 2, label, 't lbl end');
  vals.forEach((v, i) => {
    const x = left + i * cw;
    const cls = 'box cell' + (hl.has(i) ? ' hl' : '') + (dim.has(i) ? ' dim' : '') + (ok.has(i) ? ' ok' : '');
    s += R(x, top, cw, ch, cls, 0) + T(x + cw / 2, top + ch / 2, v);
    if (showIdx) s += T(x + cw / 2, top + ch + 16, i, 's');
  });
  s += R(left, top, vals.length * cw, ch, 'frame', 0);
  for (const [i, names] of Object.entries(ptrs)) {
    const x = left + (+i + 0.5) * cw;
    s += T(x, 13, names.join(' = '), 's ptr') + L(x, 22, x, top - 3, 'edge ptr', mk);
  }
  return svg(w, h, s, `Array ${label} with values ${vals.join(', ')}`);
}

// rows: 1 2 3 | 4 5 6 — a 2D grid with row/column indices
function matrix(p) {
  const rows = (p.rows || '').split('|').map(r => words(r));
  const cols = Math.max(...rows.map(r => r.length));
  const hl = new Set(words(p.highlight));
  const rowH = (p['row-headers'] || '').trim() ? words(p['row-headers']) : null;
  const colH = (p['col-headers'] || '').trim() ? words(p['col-headers']) : null;
  const all = rows.flat();
  const cw = Math.max(44, maxW(all) + 22, colH ? maxW(colH) + 18 : 0), ch = 40;
  const left = (rowH ? maxW(rowH) + 20 : 30) + (p.label ? textW(p.label) + 16 : 0), top = 30;
  let s = '';
  if (p.label) s += T(10, top + rows.length * ch / 2, p.label, 't lbl start');
  for (let c = 0; c < cols; c++) s += T(left + c * cw + cw / 2, 15, colH ? colH[c] : c, 's');
  rows.forEach((r, i) => {
    s += T(left - 12, top + i * ch + ch / 2, rowH ? rowH[i] : i, 's end');
    for (let c = 0; c < cols; c++) {
      const cls = 'box cell' + (hl.has(`${i},${c}`) ? ' hl' : '');
      s += R(left + c * cw, top + i * ch, cw, ch, cls, 0) + T(left + c * cw + cw / 2, top + i * ch + ch / 2, r[c] ?? '');
    }
  });
  s += R(left, top, cols * cw, rows.length * ch, 'frame', 0);
  return svg(left + cols * cw + 6, top + rows.length * ch + 6, s, `Grid with ${rows.length} rows and ${cols} columns`);
}

// nodes: 10 20 30 | kind: singly|doubly|circular | head: true | tail: true
function list(p) {
  const vals = words(p.nodes);
  const kind = p.kind || 'singly';
  const doubly = kind === 'doubly', circular = kind === 'circular';
  const hl = new Set(nums(p.highlight));
  const dw = Math.max(44, maxW(vals) + 24), pw = 28;
  const nw = doubly ? pw + dw + pw : dw + pw, nh = 46, gap = 44;
  const left = 8, top = p.head === 'false' ? 10 : 50;
  const tailSpace = circular ? 10 : gap + 52;
  const w = left + vals.length * nw + (vals.length - 1) * gap + tailSpace;
  const h = top + nh + (circular ? 44 : 12);
  const [mk, defs] = marker();
  let s = defs;
  const cy = top + nh / 2;
  vals.forEach((v, i) => {
    const x = left + i * (nw + gap);
    s += R(x, top, nw, nh, 'box' + (hl.has(i) ? ' hl' : ''), 7);
    if (doubly) {
      s += L(x + pw, top, x + pw, top + nh, 'div') + L(x + pw + dw, top, x + pw + dw, top + nh, 'div');
      s += T(x + pw + dw / 2, cy, v);
      if (i === 0) s += L(x + 7, top + nh - 9, x + pw - 7, top + 9, 'slash'); else s += C(x + pw / 2, cy + 9, 3.6, 'dot');
      if (i === vals.length - 1) s += L(x + nw - pw + 7, top + nh - 9, x + nw - 7, top + 9, 'slash'); else s += C(x + nw - pw / 2, cy - 9, 3.6, 'dot');
    } else {
      s += L(x + dw, top, x + dw, top + nh, 'div') + T(x + dw / 2, cy, v);
      s += C(x + dw + pw / 2, cy, 3.6, 'dot');
    }
    if (i < vals.length - 1) {
      const nx = x + nw + gap;
      if (doubly) {
        s += L(x + nw - pw / 2, cy - 9, nx - 1, cy - 9, 'edge', mk);
        s += L(nx + pw / 2, cy + 9, x + nw + 1, cy + 9, 'edge', mk);
      } else s += L(x + nw - pw / 2, cy, nx - 1, cy, 'edge', mk);
    } else if (!circular && !doubly) {
      s += L(x + nw - pw / 2, cy, x + nw + gap - 6, cy, 'edge', mk) + T(x + nw + gap + 18, cy, 'NULL', 't null');
    }
  });
  if (circular && vals.length) {
    const lx = left + (vals.length - 1) * (nw + gap) + nw - pw / 2, fx = left + dw / 2, by = top + nh + 26;
    s += P(`M${lx},${cy} V${by} H${fx} V${top + nh + 2}`, 'edge', mk);
  }
  if (p.head !== 'false') {
    const x = left + (doubly ? pw + dw / 2 : dw / 2);
    s += T(x, 13, p.head && p.head !== 'true' ? p.head : 'head', 's ptr') + L(x, 22, x, top - 3, 'edge ptr', mk);
  }
  if (p.tail === 'true' && vals.length > 1) {
    const x = left + (vals.length - 1) * (nw + gap) + (doubly ? pw + dw / 2 : dw / 2);
    s += T(x, 13, 'tail', 's ptr') + L(x, 22, x, top - 3, 'edge ptr', mk);
  }
  return svg(w, h, s, `${kind} linked list: ${vals.join(' → ')}`);
}

// items: 10 20 30 (bottom → top)
function stack(p) {
  const items = words(p.items);
  const cw = Math.max(110, maxW(items) + 40), ch = 38, left = 16, top = 16;
  const n = Math.max(items.length, 1);
  const h = top + n * ch + 30;
  const [mk, defs] = marker();
  let s = defs;
  items.forEach((v, i) => {
    const y = top + (n - 1 - i) * ch;
    s += R(left + 4, y + 2, cw - 8, ch - 4, 'box' + (i === items.length - 1 ? ' hl' : ''), 5) + T(left + cw / 2, y + ch / 2, v);
  });
  s += P(`M${left},${top - 6} V${top + n * ch + 4} H${left + cw} V${top - 6}`, 'wall');
  if (items.length) {
    const y = top + ch / 2 + (n - items.length) * ch;
    s += L(left + cw + 64, y, left + cw + 8, y, 'edge ptr', mk) + T(left + cw + 72, y, 'top', 's ptr start');
  } else s += T(left + cw / 2, top + ch / 2, 'empty', 's');
  s += T(left + cw / 2, top + n * ch + 20, p.label || 'stack', 's');
  return svg(left + cw + 110, h, s, `Stack with ${items.join(', ')} (top is ${items.at(-1)})`);
}

// items: 10 20 30 (front → rear)
function queue(p) {
  const items = words(p.items);
  const cw = Math.max(50, maxW(items) + 26), ch = 46, left = 86, top = 10;
  const n = items.length;
  const [mk, defs] = marker();
  let s = defs;
  items.forEach((v, i) => { s += R(left + i * cw, top, cw, ch, 'box cell' + (i === 0 || i === n - 1 ? ' hl' : ''), 0) + T(left + i * cw + cw / 2, top + ch / 2, v); });
  s += R(left, top, n * cw, ch, 'frame', 0);
  const fy = top + ch + 34;
  s += L(left + cw / 2, fy - 12, left + cw / 2, top + ch + 4, 'edge ptr', mk) + T(left + cw / 2, fy, n === 1 ? 'front = rear' : 'front', 's ptr');
  if (n > 1) s += L(left + (n - 0.5) * cw, fy - 12, left + (n - 0.5) * cw, top + ch + 4, 'edge ptr', mk) + T(left + (n - 0.5) * cw, fy, 'rear', 's ptr');
  s += L(left - 8, top + ch / 2, left - 66, top + ch / 2, 'edge', mk) + T(left - 40, top + ch / 2 - 13, 'dequeue', 's');
  s += L(left + n * cw + 66, top + ch / 2, left + n * cw + 8, top + ch / 2, 'edge', mk) + T(left + n * cw + 40, top + ch / 2 - 13, 'enqueue', 's');
  return svg(left + n * cw + 86, fy + 10, s, `Queue: front ${items[0]}, rear ${items.at(-1)}`);
}

function parseTree(src) {
  let i = 0;
  const node = () => {
    let v = '';
    while (i < src.length && !'(),'.includes(src[i])) v += src[i++];
    v = v.trim();
    const n = v === '_' || v === '' ? null : { v, kids: [] };
    if (src[i] === '(') {
      i++;
      const kids = [];
      for (;;) {
        kids.push(node());
        if (src[i] === ',') { i++; continue; }
        if (src[i] === ')') { i++; break; }
        throw new Error(`Bad tree syntax near "${src.slice(i, i + 12)}"`);
      }
      if (n) n.kids = kids;
    }
    return n;
  };
  return node();
}

// tree: 50(30(20,40),70(_,80)) — "_" is an empty child slot
function tree(p) {
  const root = parseTree(p.tree || '');
  const hl = new Set(words(p.highlight)), dim = new Set(words(p.dim));
  const nodes = [];
  let slot = 0, maxD = 0;
  const lay = (n, d) => {
    if (!n) return slot++;
    maxD = Math.max(maxD, d);
    if (!n.kids.length) n.x = slot++;
    else { const xs = n.kids.map(k => lay(k, d + 1)); n.x = (xs[0] + xs.at(-1)) / 2; }
    n.d = d; nodes.push(n);
    return n.x;
  };
  lay(root, 0);
  let s = '';
  const cls = n => (hl.has(n.v) ? ' hl' : '') + (dim.has(n.v) ? ' dim' : '');
  if (p.shape === 'box') {
    // labelled boxes for classification trees: slots sized by the widest leaf
    const bw = n => textW(n.v, 7.8) + 22, bh = 34;
    const leafW = Math.max(60, ...nodes.filter(n => !n.kids.length).map(bw)) + 14;
    const sy = 74, mx = Math.max(leafW, bw(root)) / 2 + 6, my = bh / 2 + 6;
    const X = n => mx + n.x * leafW, Y = n => my + n.d * sy;
    const walk = n => n.kids.forEach(k => { if (k) { s += P(`M${X(n)},${Y(n) + bh / 2} V${(Y(n) + Y(k)) / 2} H${X(k)} V${Y(k) - bh / 2}`, 'edge'); walk(k); } });
    walk(root);
    for (const n of nodes) s += R(X(n) - bw(n) / 2, Y(n) - bh / 2, bw(n), bh, 'box' + cls(n), 8) + T(X(n), Y(n), n.v, 't lbl small');
    return svg(2 * mx + (slot - 1) * leafW, 2 * my + maxD * sy, s, `Tree rooted at ${root.v}`);
  }
  const longest = maxW(nodes.map(n => n.v), 8.6);
  const r = Math.max(19, longest / 2 + 9), sx = Math.max(52, r * 2 + 12), sy = 70, m = r + 8;
  const X = n => m + n.x * sx, Y = n => m + n.d * sy;
  const walk = n => n.kids.forEach(k => { if (k) { s += L(X(n), Y(n), X(k), Y(k), 'edge' + (hl.has(n.v) && hl.has(k.v) ? ' hl' : '')); walk(k); } });
  walk(root);
  for (const n of nodes) s += C(X(n), Y(n), r, 'node' + cls(n)) + T(X(n), Y(n), n.v);
  return svg(2 * m + (slot - 1) * sx, 2 * m + maxD * sy, s, `Tree rooted at ${root.v}`);
}

// edges: A-B:4 B>C | nodes: A(0,0) B(2,0) | highlight: A B | hl-edges: A-B
function graph(p) {
  const edges = words(p.edges).map(e => {
    const m = e.match(/^([^\-<>:]+)([->])([^:]+)(?::(.+))?$/);
    if (!m) throw new Error(`Bad edge "${e}"`);
    return { a: m[1], b: m[3], dir: m[2] === '>', w: m[4] };
  });
  const pos = {};
  for (const w of words(p.nodes)) { const m = w.match(/^([^(]+)\(([-\d.]+),([-\d.]+)\)$/); if (m) pos[m[1]] = [+m[2], +m[3]]; }
  const names = [...new Set([...Object.keys(pos), ...edges.flatMap(e => [e.a, e.b])])];
  names.forEach((n, i) => {
    if (!pos[n]) { const t = -Math.PI / 2 + (2 * Math.PI * i) / names.length; pos[n] = [1.6 + 1.6 * Math.cos(t), 1.4 + 1.4 * Math.sin(t)]; }
  });
  const hl = new Set(words(p.highlight)), dim = new Set(words(p.dim));
  const hlE = new Set(words(p['hl-edges']).flatMap(e => { const [a, b] = e.split(/[->]/); return [`${a}|${b}`, `${b}|${a}`]; }));
  const unit = +(p.unit || 92), r = Math.max(19, maxW(names, 8.6) / 2 + 9), m = r + 14;
  const xs = names.map(n => pos[n][0]), ys = names.map(n => pos[n][1]);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  const X = n => m + (pos[n][0] - minX) * unit, Y = n => m + (pos[n][1] - minY) * unit;
  const [mk, defs] = marker();
  let s = defs, labels = '';
  const has = new Set(edges.map(e => `${e.a}|${e.b}`));
  for (const e of edges) {
    const x1 = X(e.a), y1 = Y(e.a), x2 = X(e.b), y2 = Y(e.b);
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
    const cls = 'edge' + (hlE.has(`${e.a}|${e.b}`) ? ' hl' : '');
    const bend = e.dir && has.has(`${e.b}|${e.a}`) ? 16 : 0;
    const sx1 = x1 + ux * r, sy1 = y1 + uy * r, sx2 = x2 - ux * (r + (e.dir ? 2 : 0)), sy2 = y2 - uy * (r + (e.dir ? 2 : 0));
    let lx = (x1 + x2) / 2, ly = (y1 + y2) / 2;
    if (bend) {
      const cx = lx - uy * bend * 2, cy = ly + ux * bend * 2;
      s += P(`M${sx1.toFixed(1)},${sy1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${sx2.toFixed(1)},${sy2.toFixed(1)}`, cls, e.dir ? mk : '');
      lx -= uy * bend; ly += ux * bend;
    } else s += L(sx1, sy1, sx2, sy2, cls, e.dir ? mk : '');
    if (e.w !== undefined) {
      const bw = textW(e.w, 7.6) + 10;
      labels += R(lx - bw / 2, ly - 10, bw, 20, 'wbg', 10) + T(lx, ly, e.w, 's w');
    }
  }
  s += labels;
  for (const n of names) s += C(X(n), Y(n), r, 'node' + (hl.has(n) ? ' hl' : '') + (dim.has(n) ? ' dim' : '')) + T(X(n), Y(n), n);
  const W = 2 * m + (Math.max(...xs) - minX) * unit, H = 2 * m + (Math.max(...ys) - minY) * unit;
  return svg(W, H, s, `${p.directed === 'true' || edges.some(e => e.dir) ? 'Directed' : 'Undirected'} graph with vertices ${names.join(', ')}`);
}

// rows like: p | int* | 0x2000 | 0x1000 | x   (name | type | address | value | points-to)
function memory(p, body) {
  const cells = body.split('\n').map(l => l.split('|').map(s => s.trim())).filter(r => r.length >= 4 && !/^[a-z-]+:/i.test(r[0]));
  const bw = Math.max(96, maxW(cells.map(c => c[3])) + 30), bh = 44, gap = 46, left = 10, top = 66;
  const [mk, defs] = marker();
  let s = defs;
  const at = {};
  cells.forEach(([name, type, addr, val], i) => {
    const x = left + i * (bw + gap);
    at[name] = x;
    s += R(x, top, bw, bh, 'box' + (cells[i][4] ? ' hl' : ''), 6) + T(x + bw / 2, top + bh / 2, val);
    s += T(x + bw / 2, top - 22, name, 't name') + T(x + bw / 2, top - 8, type, 's');
    s += T(x + bw / 2, top + bh + 17, addr, 's addr');
  });
  cells.forEach(([name, , , , to]) => {
    if (!to || at[to] === undefined) return;
    const x1 = at[name] + bw - 16, x2 = at[to] + bw - 16, y = top + bh + 28;
    s += P(`M${x1},${top + bh} C${x1},${y + 22} ${x2},${y + 22} ${x2},${top + bh + 26}`, 'edge ptr', mk);
  });
  const hasPtr = cells.some(c => c[4]);
  return svg(left * 2 + cells.length * bw + (cells.length - 1) * gap, top + bh + (hasPtr ? 52 : 26), s, `Memory: ${cells.map(c => `${c[0]} = ${c[3]}`).join(', ')}`);
}

// keys: 15 11 27 8 | size: 7 | mode: chain|linear|quadratic
function hashtable(p) {
  const keys = nums(p.keys), size = +(p.size || 7), mode = p.mode || 'chain';
  const table = Array.from({ length: size }, () => []);
  for (const k of keys) {
    const h = ((k % size) + size) % size;
    if (mode === 'chain') { table[h].push(k); continue; }
    for (let i = 0; i < size; i++) {
      const j = (h + (mode === 'linear' ? i : i * i)) % size;
      if (!table[j].length) { table[j].push(k); break; }
    }
  }
  const bw = 44, bh = 36, left = 44, top = 8, nw = 50, gap = 26;
  const [mk, defs] = marker();
  let s = defs, maxChain = 0;
  table.forEach((b, i) => {
    const y = top + i * bh;
    s += T(left - 14, y + bh / 2, i, 's end') + R(left, y, bw, bh, 'box cell' + (b.length ? ' hl' : ''), 0);
    if (mode !== 'chain') { s += T(left + bw / 2, y + bh / 2, b[0] ?? ''); return; }
    if (!b.length) { s += L(left + 10, y + bh - 9, left + bw - 10, y + 9, 'slash'); return; }
    s += C(left + bw / 2, y + bh / 2, 3.4, 'dot');
    maxChain = Math.max(maxChain, b.length);
    b.forEach((k, j) => {
      const x = left + bw + gap + j * (nw + gap);
      s += L(j ? x - gap : left + bw / 2, y + bh / 2, x - 1, y + bh / 2, 'edge', mk) + R(x, y + 4, nw, bh - 8, 'box', 5) + T(x + nw / 2, y + bh / 2, k);
    });
  });
  s += R(left, top, bw, size * bh, 'frame', 0);
  const w = left + bw + (mode === 'chain' ? maxChain * (nw + gap) : 0) + 14;
  return svg(Math.max(w, 140), top + size * bh + 8, s, `Hash table of size ${size} using ${mode}`);
}

const VENN = {
  union: 'A ∪ B', intersection: 'A ∩ B', 'a-b': 'A − B', 'b-a': 'B − A',
  symdiff: 'A ⊕ B', 'complement-a': 'A′ (complement)', a: 'A', b: 'B', none: 'A and B',
};
// shade: union, intersection, a-b
function venn(p) {
  const kinds = (p.shade || 'union').split(/\s*,\s*/);
  const cw = 190, chh = 150;
  let s = '';
  kinds.forEach((k, i) => {
    const ox = i * cw, id = `dgv${++uid}`;
    const A = `<circle cx="${ox + 72}" cy="64" r="44"/>`, B = `<circle cx="${ox + 118}" cy="64" r="44"/>`;
    const U = `<rect x="${ox + 8}" y="8" width="${cw - 16}" height="112" rx="8"/>`;
    const fill = mask => `<defs><mask id="${id}">${mask}</mask></defs><g mask="url(#${id})" class="shade">${U}</g>`;
    const white = sh => sh.replace('/>', ' fill="#fff"/>'), black = sh => sh.replace('/>', ' fill="#000"/>');
    let shade = '';
    if (k === 'union') shade = fill(white(A) + white(B));
    else if (k === 'intersection') shade = `<defs><clipPath id="${id}">${A}</clipPath></defs><g clip-path="url(#${id})" class="shade">${B}</g>`;
    else if (k === 'a-b') shade = fill(white(A) + black(B));
    else if (k === 'b-a') shade = fill(white(B) + black(A));
    else if (k === 'symdiff') shade = fill(white(A) + white(B)) + `<defs><clipPath id="${id}c">${A}</clipPath></defs><g clip-path="url(#${id}c)" class="unshade">${B}</g>`;
    else if (k === 'complement-a') shade = fill(white(U) + black(A));
    else if (k === 'a') shade = `<g class="shade">${A}</g>`;
    else if (k === 'b') shade = `<g class="shade">${B}</g>`;
    s += `<g class="venn">${U.replace('<rect', '<rect class="universe"')}${shade}${A.replace('<circle', '<circle class="ring"')}${B.replace('<circle', '<circle class="ring"')}</g>`;
    s += T(ox + 20, 24, 'U', 's start') + T(ox + 50, 64, 'A', 't lbl') + T(ox + 140, 64, 'B', 't lbl');
    s += T(ox + cw / 2, 138, VENN[k] || k, 't cap');
  });
  return svg(kinds.length * cw, chh, s, `Venn diagrams: ${kinds.map(k => VENN[k] || k).join(', ')}`);
}

const GATE = {
  AND: 'M0,0 H26 A24,24 0 0 1 26,48 H0 Z',
  OR: 'M0,0 Q22,0 50,24 Q22,48 0,48 Q12,24 0,0 Z',
  NOT: 'M0,2 L42,24 L0,46 Z',
};
// show: AND OR NOT NAND NOR XOR XNOR
function gates(p) {
  const list = words(p.show || 'AND OR NOT NAND NOR XOR XNOR').map(g => g.toUpperCase());
  const cw = 132, h = 112;
  let s = '';
  list.forEach((g, i) => {
    const ox = i * cw + 22, oy = 18;
    const base = g.replace(/^N(?=AND|OR)/, '').replace(/^XN?OR$/, 'OR');
    const bubble = /^(NAND|NOR|NOT|XNOR)$/.test(g);
    const end = (base === 'NOT' ? 42 : base === 'AND' ? 50 : 50) + (bubble ? 9 : 0);
    s += `<g class="gate" transform="translate(${ox + 20},${oy})">`;
    if (base === 'NOT') s += L(-20, 24, 0, 24, 'wire');
    else s += L(-20, 12, base === 'OR' ? 6 : 0, 12, 'wire') + L(-20, 36, base === 'OR' ? 6 : 0, 36, 'wire');
    if (g.startsWith('X')) s += P('M-7,0 Q5,24 -7,48', 'wire');
    s += `<path class="body" d="${GATE[base]}"/>`;
    if (bubble) s += C(end - 4.5, 24, 4.5, 'body');
    s += L(end, 24, end + 18, 24, 'wire') + '</g>';
    s += T(ox + 48, oy + 76, g, 't cap');
  });
  return svg(list.length * cw + 10, h, s, `Logic gates: ${list.join(', ')}`);
}

// start: Start | input: Read n | process: ... | decision: n > 0 ? | yes: ... | no: ... | end: Stop
function flow(p, body) {
  const steps = body.split('\n').map(l => l.match(/^\s*(start|end|input|output|process|decision|yes|no|loop)\s*:\s*(.*)$/i)).filter(Boolean).map(m => ({ k: m[1].toLowerCase(), t: m[2] }));
  const main = steps.filter(s => !['decision', 'yes', 'no', 'loop'].includes(s.k));
  const loops = steps.filter(s => s.k === 'loop');
  const bw = Math.max(190, maxW(main.map(s => s.t), 7.6) + 48), bh = 44, vg = 30;
  const lw = loops.length ? Math.max(150, maxW(loops.map(s => s.t), 7.6) + 36) : 0;
  const colW = Math.max(420, bw + 40), cx = colW / 2, W = colW + (lw ? lw + 30 : 0);
  const [mk, defs] = marker();
  let s = defs, y = 10, prevBottom = null;
  const shape = (k, x, yy, t, w = bw) => {
    const x0 = x - w / 2;
    if (k === 'start' || k === 'end') return R(x0, yy, w, bh, 'fc term', bh / 2) + T(x, yy + bh / 2, t);
    if (k === 'input' || k === 'output') return `<path class="fc io" d="M${x0 + 14},${yy} H${x0 + w} L${x0 + w - 14},${yy + bh} H${x0} Z"/>` + T(x, yy + bh / 2, t);
    return R(x0, yy, w, bh, 'fc proc', 4) + T(x, yy + bh / 2, t);
  };
  for (let i = 0; i < steps.length; i++) {
    const st = steps[i];
    if (st.k === 'decision') {
      if (prevBottom !== null) s += L(cx, prevBottom, cx, y - 2, 'edge', mk);
      const dh = 70, dw = 230;
      s += `<path class="fc dec" d="M${cx},${y} L${cx + dw / 2},${y + dh / 2} L${cx},${y + dh} L${cx - dw / 2},${y + dh / 2} Z"/>` + T(cx, y + dh / 2, st.t);
      if (steps[i + 1]?.k === 'loop') {
        // body to the right of the diamond, with an arrow back up into the condition
        const body = steps[++i], lx = cx + dw / 2 + 30 + lw / 2, by = y + dh / 2 - bh / 2;
        s += L(cx + dw / 2, y + dh / 2, lx - lw / 2 - 2, y + dh / 2, 'edge', mk) + T(cx + dw / 2 + 15, y + dh / 2 - 12, 'Yes', 's yes');
        s += shape('process', lx, by, body.t, lw);
        s += P(`M${lx},${by} V${y - 16} H${cx}`, 'edge');
        s += T(cx + 16, y + dh + 12, 'No', 's no');
        prevBottom = y + dh; y += dh + vg;
        continue;
      }
      const yes = steps[i + 1]?.k === 'yes' ? steps[++i] : null;
      const no = steps[i + 1]?.k === 'no' ? steps[++i] : null;
      const by = y + dh + 34, lx = cx - 112, rx = cx + 112, sw = 170;
      if (yes) s += P(`M${cx - dw / 2},${y + dh / 2} H${lx} V${by - 2}`, 'edge', mk) + T(cx - dw / 2 - 18, y + dh / 2 - 12, 'Yes', 's yes') + shape(/print|display|output/i.test(yes.t) ? 'output' : 'process', lx, by, yes.t, sw);
      if (no) s += P(`M${cx + dw / 2},${y + dh / 2} H${rx} V${by - 2}`, 'edge', mk) + T(cx + dw / 2 + 16, y + dh / 2 - 12, 'No', 's no') + shape(/print|display|output/i.test(no.t) ? 'output' : 'process', rx, by, no.t, sw);
      const my = by + bh + 22;
      s += P(`M${lx},${by + bh} V${my} H${rx} V${by + bh}`, 'edge') + L(cx, my, cx, my + 8, 'edge');
      prevBottom = my + 8; y = my + 8 + vg - 8;
      continue;
    }
    if (prevBottom !== null) s += L(cx, prevBottom, cx, y - 2, 'edge', mk);
    s += shape(st.k, cx, y, st.t);
    prevBottom = y + bh; y += bh + vg;
  }
  return svg(W, y - vg + 10, s, `Flowchart: ${steps.map(s => s.t).join(' → ')}`);
}

const KINDS = { array, matrix, list, stack, queue, tree, graph, memory, hashtable, venn, gates, flow };

export function diagram(kind, body) {
  const fn = KINDS[kind];
  if (!fn) throw new Error(`Unknown diagram type "${kind}"`);
  const p = params(body);
  return { svg: fn(p, body), caption: p.caption || '' };
}
