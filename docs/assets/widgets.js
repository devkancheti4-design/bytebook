// Bytebook interactive widgets. Each lesson marks a spot with
// <div class="widget" data-widget="name" data-opts="{...}"> and this file fills it in.
(() => {
  const W = {};

  // ---------------------------------------------------------------- helpers
  const h = (tag, props, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (k === 'class') el.className = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : String(c));
    return el;
  };
  const SVGNS = 'http://www.w3.org/2000/svg';
  const s = (tag, attrs, ...kids) => {
    const el = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v != null) el.setAttribute(k, v);
    for (const c of kids.flat()) if (c != null) el.append(c.nodeType ? c : String(c));
    return el;
  };
  const btn = (label, onclick, cls = '') => h('button', { type: 'button', class: `w-btn ${cls}`, onclick }, label);
  const field = (props) => h('input', { class: 'w-input', ...props });
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function shell(el, title, sub) {
    el.textContent = '';
    const controls = h('div', { class: 'w-controls' });
    const stage = h('div', { class: 'w-stage' });
    const status = h('div', { class: 'w-status', 'aria-live': 'polite' });
    el.append(h('div', { class: 'w-head' }, h('span', { class: 'w-badge' }, 'Try it'), h('div', {}, h('h4', {}, title), sub ? h('p', {}, sub) : null)), controls, stage, status);
    return { controls, stage, status, say(msg, kind = '') { status.className = `w-status ${kind}`; status.innerHTML = msg; } };
  }

  // Step-through player over precomputed frames: play, pause, back, step, reset, speed.
  function player(container, render, { delay = 700 } = {}) {
    let frames = [], i = 0, timer = null, speed = 5;
    const playBtn = btn('▶ Play', () => (timer ? pause() : play()), 'primary');
    const counter = h('span', { class: 'w-count' });
    const go = k => {
      i = Math.max(0, Math.min(frames.length - 1, k));
      render(frames[i], i, frames.length);
      counter.textContent = `step ${i} / ${frames.length - 1}`;
      if (i === frames.length - 1) pause();
    };
    const wait = () => delay * Math.pow(0.72, speed - 5);
    const tick = () => { if (i >= frames.length - 1) return pause(); go(i + 1); timer = setTimeout(tick, wait()); };
    const play = () => { if (i >= frames.length - 1) go(0); playBtn.textContent = '❚❚ Pause'; timer = setTimeout(tick, 60); };
    const pause = () => { clearTimeout(timer); timer = null; playBtn.textContent = '▶ Play'; };
    container.append(playBtn, btn('‹ Back', () => { pause(); go(i - 1); }), btn('Step ›', () => { pause(); go(i + 1); }), btn('↺ Reset', () => { pause(); go(0); }),
      h('label', { class: 'w-speed' }, 'Speed', h('input', { type: 'range', min: 1, max: 10, value: 5, oninput: e => { speed = +e.target.value; } })), counter);
    return { load(f) { pause(); frames = f; go(0); }, pause };
  }

  // ---------------------------------------------------------------- big-o
  W['big-o'] = el => {
    const ui = shell(el, 'How fast does it grow?', 'Slide n and compare how many steps each complexity class needs.');
    const log10fact = n => { let s = 0; for (let k = 2; k <= n; k++) s += Math.log10(k); return s; };
    const rows = [
      ['O(1)', () => 0], ['O(log n)', n => Math.log10(Math.max(1, Math.log2(n)))], ['O(√n)', n => Math.log10(n) / 2],
      ['O(n)', n => Math.log10(n)], ['O(n log n)', n => Math.log10(n * Math.max(1, Math.log2(n)))],
      ['O(n²)', n => 2 * Math.log10(n)], ['O(n³)', n => 3 * Math.log10(n)], ['O(2ⁿ)', n => n * Math.log10(2)], ['O(n!)', n => log10fact(n)],
    ];
    const fmt = l => {
      if (l < 15) { const v = Math.round(10 ** l); return v.toLocaleString('en-IN'); }
      return `≈ 10^${Math.floor(l)}`;
    };
    const time = l => {
      const sec = 10 ** (l - 9);
      if (l - 9 > 17.6) return 'longer than the age of the universe';
      const units = [[3.15e7, 'years'], [86400, 'days'], [3600, 'hours'], [60, 'minutes'], [1, 's'], [1e-3, 'ms'], [1e-6, 'µs'], [1e-9, 'ns']];
      for (const [u, name] of units) if (sec >= u) return `${(sec / u).toLocaleString('en-IN', { maximumFractionDigits: sec / u < 10 ? 1 : 0 })} ${name}`;
      return '1 ns';
    };
    const nOut = h('b', {});
    const slider = h('input', { type: 'range', min: 0, max: 60, value: 20, class: 'w-range', 'aria-label': 'Input size n' });
    ui.controls.append(h('label', { class: 'w-label' }, 'n = ', nOut), slider);
    const table = h('div', { class: 'bo-rows' });
    ui.stage.append(table);
    const render = () => {
      const n = Math.max(1, Math.round(10 ** (+slider.value / 10)));
      nOut.textContent = n.toLocaleString('en-IN');
      table.textContent = '';
      for (const [label, f] of rows) {
        const l = f(n);
        const pct = Math.min(100, (l / 20) * 100);
        table.append(h('div', { class: 'bo-row' + (l > 17.6 ? ' hot' : '') },
          h('span', { class: 'bo-l' }, label),
          h('span', { class: 'bo-bar' }, h('span', { style: `width:${Math.max(1.5, pct)}%` })),
          h('span', { class: 'bo-v' }, fmt(l)),
          h('span', { class: 'bo-t' }, time(l))));
      }
      ui.say(`Steps for n = ${n.toLocaleString('en-IN')} and the time they take at <b>one billion steps per second</b>. Bars use a logarithmic scale.`);
    };
    slider.addEventListener('input', render);
    render();
  };

  // ---------------------------------------------------------------- truth table
  function parseLogic(src) {
    const ALIAS = { and: '&', or: '|', not: '!', xor: '^', implies: '->', iff: '<->', '&&': '&', '||': '|', '∧': '&', '·': '&', '*': '&', '∨': '|', '+': '|', '¬': '!', '~': '!', '⊕': '^', '→': '->', '=>': '->', '↔': '<->', '<=>': '<->' };
    const toks = [];
    const re = /\s*(<->|<=>|->|=>|&&|\|\||[()!~¬∧∨⊕→↔&|^+*·]|[A-Za-z_][A-Za-z0-9_]*|[01])/y;
    let m;
    re.lastIndex = 0;
    while (re.lastIndex < src.length) {
      if (/^\s*$/.test(src.slice(re.lastIndex))) break;
      const at = re.lastIndex;
      if (!(m = re.exec(src))) throw new Error(`Unexpected "${src.slice(at).trim()[0]}"`);
      const t = ALIAS[m[1].toLowerCase()] || ALIAS[m[1]] || m[1];
      toks.push(t);
    }
    let p = 0;
    const peek = () => toks[p], eat = t => { if (toks[p] !== t) throw new Error(`Expected "${t}"`); p++; };
    const node = (op, a, b) => ({ op, a, b });
    const iff = () => { let x = imp(); while (peek() === '<->') { p++; x = node('<->', x, imp()); } return x; };
    const imp = () => { const x = or(); if (peek() === '->') { p++; return node('->', x, imp()); } return x; };
    const or = () => { let x = xor(); while (peek() === '|') { p++; x = node('|', x, xor()); } return x; };
    const xor = () => { let x = and(); while (peek() === '^') { p++; x = node('^', x, and()); } return x; };
    const and = () => { let x = not(); while (peek() === '&') { p++; x = node('&', x, not()); } return x; };
    const not = () => (peek() === '!' ? (p++, node('!', not())) : atom());
    const atom = () => {
      const t = toks[p++];
      if (t === '(') { const x = iff(); eat(')'); return x; }
      if (t === undefined) throw new Error('The expression ends too early');
      if (/^(1|T|true)$/i.test(t) && t !== 't') return { c: true };
      if (/^(0|F|false)$/.test(t)) return { c: false };
      if (/^[A-Za-z_]/.test(t)) return { v: t };
      throw new Error(`Unexpected "${t}"`);
    };
    const tree = iff();
    if (p < toks.length) throw new Error(`Unexpected "${toks[p]}"`);
    return tree;
  }
  const SYM = { '&': '∧', '|': '∨', '^': '⊕', '->': '→', '<->': '↔' };
  const show = n => n.v ?? (n.c !== undefined ? (n.c ? 'T' : 'F') : n.op === '!' ? `¬${n.a.v || n.a.c !== undefined ? show(n.a) : `(${show(n.a)})`}` : `${wrap(n.a, n.op)} ${SYM[n.op]} ${wrap(n.b, n.op)}`);
  // brackets around a sub-formula, except inside a chain of the same associative operator
  const wrap = (n, parent) => (n.op && n.op !== '!' && !(n.op === parent && (parent === '&' || parent === '|')) ? `(${show(n)})` : show(n));
  const evalNode = (n, env) => {
    if (n.v) return env[n.v];
    if (n.c !== undefined) return n.c;
    const a = evalNode(n.a, env);
    if (n.op === '!') return !a;
    const b = evalNode(n.b, env);
    return { '&': a && b, '|': a || b, '^': a !== b, '->': !a || b, '<->': a === b }[n.op];
  };

  W['truth-table'] = (el, o) => {
    const ui = shell(el, 'Truth table builder', 'Type a formula: ! not · & and · | or · ^ xor · -> implies · <-> iff.');
    let bits = o.style === 'bits' || /[A-Z]/.test(o.expr || '') && !/[a-z]/.test((o.expr || '').replace(/[^A-Za-z]/g, ''));
    const inp = field({ value: o.expr || 'p -> q', spellcheck: 'false', 'aria-label': 'Logical formula', class: 'w-input wide mono' });
    const modeBtn = btn('', () => { bits = !bits; render(); });
    ui.controls.append(inp, btn('Build table', () => render(), 'primary'), modeBtn);
    const presets = h('div', { class: 'w-chips' });
    for (const ex of ['p -> q', '!(p & q) <-> (!p | !q)', '(p -> q) <-> (!q -> !p)', 'p & !p', '(p | q) & (p -> r) & (q -> r) -> r'])
      presets.append(btn(ex, () => { inp.value = ex; render(); }, 'chip'));
    ui.controls.append(presets);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') render(); });
    function render() {
      modeBtn.textContent = bits ? 'Show T / F' : 'Show 1 / 0';
      let tree;
      try { tree = parseLogic(inp.value); } catch (e) { ui.stage.textContent = ''; ui.say(`⚠ ${e.message}. Check the brackets and operators.`, 'bad'); return; }
      const vars = [];
      const cols = [];
      const seen = new Set();
      (function walk(n) {
        if (n.v) { if (!vars.includes(n.v)) vars.push(n.v); return; }
        if (n.c !== undefined) return;
        walk(n.a); if (n.b) walk(n.b);
        const label = show(n);
        if (!seen.has(label)) { seen.add(label); cols.push({ n, label }); }
      })(tree);
      vars.sort();
      if (vars.length > 6) { ui.say('⚠ Up to 6 variables are supported (64 rows).', 'bad'); return; }
      const shown = cols.length > 7 ? [...cols.slice(0, 6), cols.at(-1)] : cols;
      const fmt = v => (bits ? (v ? '1' : '0') : (v ? 'T' : 'F'));
      const head = h('tr', {}, vars.map(v => h('th', { class: 'tt-var' }, v)), shown.map((c, i) => h('th', { class: i === shown.length - 1 ? 'tt-main' : '' }, c.label)));
      const body = h('tbody');
      let trues = 0;
      const rows = 2 ** vars.length;
      for (let r = 0; r < rows; r++) {
        const env = {};
        vars.forEach((v, i) => { const bit = (r >> (vars.length - 1 - i)) & 1; env[v] = bits ? !!bit : !bit; });
        const out = shown.map(c => evalNode(c.n, env));
        if (out.at(-1)) trues++;
        body.append(h('tr', {}, vars.map(v => h('td', { class: 'tt-var' }, fmt(env[v]))), out.map((v, i) => h('td', { class: (i === out.length - 1 ? 'tt-main ' : '') + (v ? 'on' : 'off') }, fmt(v)))));
      }
      ui.stage.textContent = '';
      ui.stage.append(h('div', { class: 'w-scroll' }, h('table', { class: 'tt' }, h('thead', {}, head), body)));
      const kind = trues === rows ? ['a <b>tautology</b> — true in every row', 'good'] : trues === 0 ? ['a <b>contradiction</b> — false in every row', 'bad'] : ['a <b>contingency</b> — true in some rows, false in others', ''];
      ui.say(`<b>${show(tree)}</b> is ${kind[0]} (${trues} of ${rows} rows true).`, kind[1]);
    }
    render();
  };

  // ---------------------------------------------------------------- base converter
  W['base-converter'] = el => {
    const ui = shell(el, 'Number base converter', 'Enter a number in any base and see it in the others, with the division steps.');
    const inp = field({ value: '45', 'aria-label': 'Number', class: 'w-input mono' });
    const from = h('select', { class: 'w-select', 'aria-label': 'Input base' }, [[10, 'decimal'], [2, 'binary'], [8, 'octal'], [16, 'hex']].map(([b, n]) => h('option', { value: b }, `${n} (base ${b})`)));
    const to = h('select', { class: 'w-select', 'aria-label': 'Show steps for' }, [[2, 'binary'], [8, 'octal'], [16, 'hex']].map(([b, n]) => h('option', { value: b }, `steps for ${n}`)));
    ui.controls.append(inp, from, to);
    const group = (str, k) => str.replace(new RegExp(`\\B(?=(.{${k}})+$)`, 'g'), ' ');
    const render = () => {
      const text = inp.value.trim().toLowerCase().replace(/^0[bxo]/, '');
      const base = +from.value;
      const valid = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^\d+$/, 16: /^[0-9a-f]+$/ }[base];
      if (!valid.test(text)) { ui.stage.textContent = ''; ui.say(`⚠ "${inp.value}" is not a valid base-${base} number.`, 'bad'); return; }
      const n = parseInt(text, base);
      if (n > Number.MAX_SAFE_INTEGER) { ui.say('⚠ That number is too large for this demo.', 'bad'); return; }
      const cards = [[2, 'Binary', 4], [8, 'Octal', 3], [10, 'Decimal', 3], [16, 'Hexadecimal', 2]].map(([b, name, g]) =>
        h('div', { class: 'bc-card' + (b === base ? ' from' : '') }, h('small', {}, `${name} · base ${b}`), h('b', { class: 'mono' }, group(n.toString(b).toUpperCase(), g))));
      const tb = +to.value;
      const steps = h('tbody');
      let q = n;
      if (q === 0) steps.append(h('tr', {}, h('td', {}, `0 ÷ ${tb}`), h('td', {}, '0'), h('td', { class: 'rem' }, '0')));
      while (q > 0) {
        steps.append(h('tr', {}, h('td', {}, `${q} ÷ ${tb}`), h('td', {}, Math.floor(q / tb)), h('td', { class: 'rem' }, (q % tb).toString(16).toUpperCase())));
        q = Math.floor(q / tb);
      }
      ui.stage.textContent = '';
      ui.stage.append(h('div', { class: 'bc-grid' }, cards),
        h('div', { class: 'w-scroll' }, h('table', { class: 'w-table' }, h('thead', {}, h('tr', {}, h('th', {}, 'Divide'), h('th', {}, 'Quotient'), h('th', {}, 'Remainder'))), steps)));
      ui.say(`Read the remainders from <b>bottom to top</b>: ${n} = <b class="mono">${n.toString(tb).toUpperCase()}</b> in base ${tb}.`);
    };
    [inp, from, to].forEach(x => x.addEventListener('input', render));
    render();
  };

  // ---------------------------------------------------------------- sorting
  const swapA = (a, i, j) => { [a[i], a[j]] = [a[j], a[i]]; };
  const SORTS = {
    bubble: { name: 'Bubble', *gen(a) {
      const n = a.length;
      for (let pass = 0; pass < n - 1; pass++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - pass; j++) {
          yield { t: 'cmp', i: j, j: j + 1 };
          if (a[j] > a[j + 1]) { swapA(a, j, j + 1); swapped = true; yield { t: 'swap', i: j, j: j + 1 }; }
        }
        yield { t: 'done', i: n - 1 - pass, msg: `Pass ${pass + 1} complete: the largest remaining value has bubbled to the end` };
        if (!swapped) { yield { t: 'msg', msg: 'No swaps in this pass, so the array is already sorted — stop early' }; return; }
      }
    } },
    selection: { name: 'Selection', *gen(a) {
      const n = a.length;
      for (let i = 0; i < n - 1; i++) {
        let m = i;
        yield { t: 'min', i: m, msg: `Look for the minimum of positions ${i} to ${n - 1}` };
        for (let j = i + 1; j < n; j++) {
          yield { t: 'cmp', i: m, j };
          if (a[j] < a[m]) { m = j; yield { t: 'min', i: m, msg: `New minimum: ${a[m]}` }; }
        }
        if (m !== i) { swapA(a, i, m); yield { t: 'swap', i, j: m }; }
        yield { t: 'done', i, msg: `${a[i]} is in its final place` };
      }
    } },
    insertion: { name: 'Insertion', *gen(a) {
      for (let i = 1; i < a.length; i++) {
        yield { t: 'key', i, msg: `Insert ${a[i]} into the sorted part on its left` };
        for (let j = i; j > 0; j--) {
          yield { t: 'cmp', i: j - 1, j };
          if (a[j - 1] > a[j]) { swapA(a, j - 1, j); yield { t: 'swap', i: j - 1, j }; } else break;
        }
      }
    } },
    merge: { name: 'Merge', *gen(a) {
      function* ms(lo, hi) {
        if (lo >= hi) return;
        const mid = (lo + hi) >> 1;
        yield* ms(lo, mid); yield* ms(mid + 1, hi);
        const L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1);
        yield { t: 'range', lo, hi, msg: `Merge [${L.join(' ')}] with [${R.join(' ')}]` };
        let i = 0, j = 0, k = lo;
        while (i < L.length && j < R.length) {
          yield { t: 'cmpv', lo, hi, msg: `Compare ${L[i]} with ${R[j]}: take ${Math.min(L[i], R[j])}` };
          a[k] = L[i] <= R[j] ? L[i++] : R[j++];
          yield { t: 'write', i: k, lo, hi }; k++;
        }
        while (i < L.length) { a[k] = L[i++]; yield { t: 'write', i: k, lo, hi }; k++; }
        while (j < R.length) { a[k] = R[j++]; yield { t: 'write', i: k, lo, hi }; k++; }
      }
      yield* ms(0, a.length - 1);
    } },
    quick: { name: 'Quick', *gen(a) {
      function* qs(lo, hi) {
        if (lo > hi) return;
        if (lo === hi) { yield { t: 'done', i: lo }; return; }
        const pivot = a[hi];
        yield { t: 'pivot', p: hi, lo, hi, msg: `Partition [${lo}..${hi}] around pivot ${pivot} (last element)` };
        let i = lo - 1;
        for (let j = lo; j < hi; j++) {
          yield { t: 'cmp', i: j, j: hi, p: hi, lo, hi, msg: `Is ${a[j]} < ${pivot}?` };
          if (a[j] < pivot) { i++; swapA(a, i, j); if (i !== j) yield { t: 'swap', i, j, p: hi, lo, hi }; }
        }
        swapA(a, i + 1, hi);
        yield { t: 'swap', i: i + 1, j: hi, lo, hi };
        yield { t: 'done', i: i + 1, msg: `${pivot} is now in its final position ${i + 1}` };
        yield* qs(lo, i); yield* qs(i + 2, hi);
      }
      yield* qs(0, a.length - 1);
    } },
  };
  W.sort = (el, o) => {
    const algos = (o.algos || 'bubble selection insertion merge quick').split(/\s+/).filter(k => SORTS[k]);
    const ui = shell(el, 'Sorting visualizer', 'Watch each comparison and swap. Step through slowly, or press Play.');
    let algo = algos[0], data = [];
    const tabs = h('div', { class: 'w-tabs', role: 'tablist' });
    algos.forEach(k => tabs.append(h('button', { type: 'button', role: 'tab', 'data-k': k, onclick: () => { algo = k; load(); } }, SORTS[k].name)));
    const top = h('div', { class: 'w-row' }, tabs, btn('⤨ New array', () => { data = fresh(); load(); }), btn('Nearly sorted', () => { data = fresh().sort((x, y) => x - y); swapA(data, 2, 9); load(); }));
    const ctl = h('div', { class: 'w-row' });
    ui.controls.append(top, ctl);
    const bars = h('div', { class: 'sv-bars' });
    const stats = h('div', { class: 'sv-stats' });
    ui.stage.append(bars, stats);
    const fresh = () => Array.from({ length: 12 }, () => rand(8, 99));
    const message = (f) => {
      const { ev, a } = f;
      if (ev.msg) return ev.msg;
      if (ev.t === 'cmp') return `Compare ${a[ev.i]} and ${a[ev.j]}`;
      if (ev.t === 'swap') return `Swap → ${a[ev.i]} and ${a[ev.j]}`;
      if (ev.t === 'write') return `Write ${a[ev.i]} into position ${ev.i}`;
      return '';
    };
    const pl = player(ctl, (f) => {
      bars.textContent = '';
      const max = Math.max(...f.a);
      f.a.forEach((v, i) => {
        let cls = 'sv-bar';
        if (f.done.has(i)) cls += ' is-done';
        if (f.ev.lo !== undefined && (i < f.ev.lo || i > f.ev.hi)) cls += ' is-dim';
        if (f.ev.p === i) cls += ' is-pivot';
        if ((f.ev.t === 'cmp') && (i === f.ev.i || i === f.ev.j)) cls += ' is-cmp';
        if ((f.ev.t === 'swap') && (i === f.ev.i || i === f.ev.j)) cls += ' is-swap';
        if ((f.ev.t === 'write' || f.ev.t === 'key' || f.ev.t === 'min') && i === f.ev.i) cls += ' is-swap';
        bars.append(h('div', { class: cls, style: `height:${12 + (v / max) * 88}%` }, h('span', {}, v)));
      });
      stats.innerHTML = `<span>Comparisons <b>${f.comps}</b></span><span>${algo === 'merge' ? 'Writes' : 'Swaps'} <b>${f.swaps}</b></span>`;
      ui.say(message(f) || '&nbsp;', f.ev.t === 'end' ? 'good' : '');
    });
    function load() {
      tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.k === algo)));
      const a = [...data];
      let comps = 0, swaps = 0;
      const done = new Set();
      const frames = [{ a: [...a], ev: { t: 'start', msg: `${SORTS[algo].name} sort on ${a.length} numbers — press Play or Step` }, done: new Set(), comps, swaps }];
      for (const ev of SORTS[algo].gen(a)) {
        if (ev.t === 'cmp' || ev.t === 'cmpv') comps++;
        if (ev.t === 'swap' || ev.t === 'write') swaps++;
        if (ev.t === 'done') done.add(ev.i);
        frames.push({ a: [...a], ev, done: new Set(done), comps, swaps });
      }
      frames.push({ a: [...a], ev: { t: 'end', msg: `Sorted! ${comps} comparisons and ${swaps} ${algo === 'merge' ? 'writes' : 'swaps'}.` }, done: new Set(a.keys()), comps, swaps });
      pl.load(frames);
    }
    data = fresh();
    load();
  };

  // ---------------------------------------------------------------- stack
  W.stack = el => {
    const ui = shell(el, 'Stack playground', 'Push and pop. The array-based stack below holds at most 6 items.');
    const CAP = 6, st = [];
    const inp = field({ type: 'number', value: rand(10, 99), 'aria-label': 'Value to push', class: 'w-input narrow' });
    ui.controls.append(inp, btn('Push', () => push(), 'primary'), btn('Pop', () => pop()), btn('Peek', () => peek()), btn('Clear', () => { st.length = 0; render(); ui.say('Stack cleared. top = -1'); }));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') push(); });
    const view = h('div', { class: 'stk' });
    ui.stage.append(view);
    let flash = -1;
    function render() {
      view.textContent = '';
      for (let i = CAP - 1; i >= 0; i--) {
        const has = i < st.length;
        view.append(h('div', { class: 'stk-row' },
          h('span', { class: 'stk-idx' }, i),
          h('div', { class: 'stk-cell' + (has ? ' full' : '') + (i === st.length - 1 ? ' top' : '') + (i === flash ? ' flash' : '') }, has ? st[i] : ''),
          h('span', { class: 'stk-ptr' }, i === st.length - 1 ? '← top' : '')));
      }
      if (!st.length) view.append(h('div', { class: 'stk-empty' }, 'top = -1 (empty)'));
      flash = -1;
    }
    function push() {
      const v = inp.value.trim();
      if (v === '') return;
      if (st.length === CAP) { ui.say(`<b>Overflow!</b> The stack is full (top = ${CAP - 1}), so ${v} cannot be pushed.`, 'bad'); return; }
      st.push(+v); flash = st.length - 1; render();
      ui.say(`push(${v}): top becomes ${st.length - 1}, and stack[${st.length - 1}] = ${v}.`);
      inp.value = rand(10, 99);
    }
    function pop() {
      if (!st.length) { ui.say('<b>Underflow!</b> The stack is empty — nothing to pop.', 'bad'); return; }
      const v = st.pop(); render();
      ui.say(`pop() returned <b>${v}</b> — the last item pushed. top is now ${st.length - 1}.`);
    }
    function peek() {
      if (!st.length) { ui.say('The stack is empty, so there is nothing to peek at.', 'bad'); return; }
      flash = st.length - 1; render(); ui.say(`peek() = <b>${st.at(-1)}</b>. Peek reads the top without removing it.`);
    }
    [12, 47].forEach(v => st.push(v));
    render();
    ui.say('Try pushing until it overflows, then pop everything. Notice the order things come out: LIFO.');
  };

  // ---------------------------------------------------------------- circular queue
  W.queue = el => {
    const ui = shell(el, 'Circular queue', 'Capacity 6. Watch front and rear wrap around with % 6.');
    const N = 6, q = Array(N).fill(null);
    let front = 0, rear = -1, count = 0;
    const inp = field({ type: 'number', value: rand(10, 99), 'aria-label': 'Value to enqueue', class: 'w-input narrow' });
    ui.controls.append(inp, btn('Enqueue', () => enq(), 'primary'), btn('Dequeue', () => deq()), btn('Reset', () => { q.fill(null); front = 0; rear = -1; count = 0; render(); ui.say('Reset: front = 0, rear = -1, count = 0.'); }));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') enq(); });
    const view = h('div', { class: 'cq' });
    const logical = h('div', { class: 'cq-logical' });
    ui.stage.append(view, logical);
    let flash = -1;
    function render() {
      view.textContent = '';
      for (let i = 0; i < N; i++) {
        const live = count > 0 && ((i - front + N) % N) < count;
        const marks = [];
        if (count > 0 && i === front) marks.push('front');
        if (count > 0 && i === rear) marks.push('rear');
        view.append(h('div', { class: 'cq-slot' }, h('div', { class: 'cq-cell' + (live ? ' full' : '') + (i === flash ? ' flash' : '') }, live ? q[i] : ''), h('small', {}, i), h('span', { class: 'cq-mark' }, marks.join(' · '))));
      }
      const items = Array.from({ length: count }, (_, k) => q[(front + k) % N]);
      logical.innerHTML = `Queue order (front → rear): <b>${items.length ? items.join(' → ') : 'empty'}</b> &nbsp;·&nbsp; count = ${count}`;
      flash = -1;
    }
    function enq() {
      const v = inp.value.trim();
      if (v === '') return;
      if (count === N) { ui.say('<b>Queue full.</b> count = 6 = capacity, so nothing more fits.', 'bad'); return; }
      const old = rear;
      rear = (rear + 1) % N; q[rear] = +v; count++; flash = rear; render();
      ui.say(`enqueue(${v}): rear = (${old} + 1) % 6 = <b>${rear}</b>${old === N - 1 ? ' — it wrapped around to the start!' : ''}`);
      inp.value = rand(10, 99);
    }
    function deq() {
      if (count === 0) { ui.say('<b>Queue empty</b> — nothing to dequeue.', 'bad'); return; }
      const v = q[front], old = front;
      q[front] = null; front = (front + 1) % N; count--; render();
      ui.say(`dequeue() returned <b>${v}</b> (first in, first out). front = (${old} + 1) % 6 = ${front}.`);
    }
    [21, 34, 55].forEach(v => { rear = (rear + 1) % N; q[rear] = v; count++; });
    render();
    ui.say('Dequeue twice, then enqueue four times: watch rear wrap from 5 back to 0.');
  };

  // ---------------------------------------------------------------- linked list
  W['linked-list'] = el => {
    const ui = shell(el, 'Linked list playground', 'Insert, delete, search and reverse. Every change only rewires pointers.');
    let list = [10, 20, 30];
    const val = field({ type: 'number', value: 25, 'aria-label': 'Value', class: 'w-input narrow' });
    const pos = field({ type: 'number', value: 2, min: 0, 'aria-label': 'Position', class: 'w-input narrow' });
    ui.controls.append(h('label', { class: 'w-label' }, 'value', val), h('label', { class: 'w-label' }, 'position', pos),
      btn('Insert at head', () => ins(0), 'primary'), btn('Insert at tail', () => ins(list.length)), btn('Insert at position', () => ins(+pos.value)),
      btn('Delete value', () => del()), btn('Search', () => search()), btn('Reverse', () => rev()));
    const view = h('div', { class: 'll' });
    ui.stage.append(view);
    let hl = new Set(), cur = -1, busy = false;
    function render() {
      view.textContent = '';
      view.append(h('span', { class: 'll-head' }, 'head'));
      if (!list.length) view.append(h('span', { class: 'll-arrow' }), h('span', { class: 'll-null' }, 'NULL'));
      list.forEach((v, i) => {
        view.append(h('span', { class: 'll-arrow' }), h('div', { class: 'll-node' + (hl.has(i) ? ' hl' : '') + (i === cur ? ' cur' : '') }, h('span', { class: 'll-data' }, v), h('span', { class: 'll-next' })));
      });
      if (list.length) view.append(h('span', { class: 'll-arrow' }), h('span', { class: 'll-null' }, 'NULL'));
    }
    const readVal = () => { const v = val.value.trim(); return v === '' ? null : +v; };
    async function walk(to, note) {
      busy = true;
      for (let i = 0; i <= to && i < list.length; i++) { cur = i; render(); ui.say(`${note} — visiting node ${i} (${list[i]})`); await sleep(420); }
      cur = -1; busy = false;
    }
    async function ins(p) {
      const v = readVal();
      if (v === null || busy) return;
      if (p < 0 || p > list.length) { ui.say(`Position ${p} is out of range (0 to ${list.length}).`, 'bad'); return; }
      if (p > 0) await walk(p - 1, `Walk to node ${p - 1}`);
      list.splice(p, 0, v); hl = new Set([p]); render();
      ui.say(p === 0 ? `New node ${v} points to the old head, and <b>head</b> now points to it — O(1).`
        : `New node ${v}: its next = old node ${p}'s address; node ${p - 1}'s next = new node. ${p === list.length - 1 ? 'Reaching the tail took O(n) steps.' : ''}`, 'good');
      val.value = rand(10, 99);
    }
    async function del() {
      const v = readVal();
      if (v === null || busy) return;
      const i = list.indexOf(v);
      await walk(i < 0 ? list.length - 1 : i, `Search for ${v}`);
      if (i < 0) { render(); ui.say(`${v} is not in the list.`, 'bad'); return; }
      list.splice(i, 1); hl = new Set(); render();
      ui.say(i === 0 ? `Deleted ${v}: head moved to the next node, then the old node was freed.` : `Deleted ${v}: node ${i - 1}'s next now skips over it, then it was freed.`, 'good');
    }
    async function search() {
      const v = readVal();
      if (v === null || busy) return;
      const i = list.indexOf(v);
      await walk(i < 0 ? list.length - 1 : i, `Search for ${v}`);
      hl = i < 0 ? new Set() : new Set([i]); render();
      ui.say(i < 0 ? `${v} not found after checking all ${list.length} nodes (O(n)).` : `Found ${v} at position ${i} after ${i + 1} step${i ? 's' : ''}.`, i < 0 ? 'bad' : 'good');
    }
    function rev() {
      if (busy) return;
      list.reverse(); hl = new Set(); render();
      ui.say('Reversed in one pass: each node\'s next pointer was turned around (prev, cur, next).', 'good');
    }
    render();
    ui.say('Insert 25 at position 2 to watch the walk, then try deleting the head.');
  };

  // ---------------------------------------------------------------- BST
  W.bst = el => {
    const ui = shell(el, 'Binary search tree', 'Insert, search and delete keys. Smaller keys go left, larger go right.');
    let root = null;
    const val = field({ type: 'number', value: 45, 'aria-label': 'Key', class: 'w-input narrow' });
    ui.controls.append(val, btn('Insert', () => op('insert'), 'primary'), btn('Search', () => op('search')), btn('Delete', () => op('delete')),
      btn('Random tree', () => { root = null; const ks = new Set(); while (ks.size < 9) ks.add(rand(5, 95)); ks.forEach(k => { root = insert(root, k); }); render(); ui.say('A random tree with 9 keys.'); }),
      btn('Clear', () => { root = null; render(); ui.say('Empty tree.'); }));
    val.addEventListener('keydown', e => { if (e.key === 'Enter') op('insert'); });
    const svgBox = h('div', { class: 'w-svg' });
    const trav = h('div', { class: 'bst-trav' });
    ui.stage.append(svgBox, trav);
    const insert = (n, k) => { if (!n) return { k, l: null, r: null }; if (k < n.k) n.l = insert(n.l, k); else if (k > n.k) n.r = insert(n.r, k); return n; };
    const del = (n, k) => {
      if (!n) return null;
      if (k < n.k) n.l = del(n.l, k);
      else if (k > n.k) n.r = del(n.r, k);
      else {
        if (!n.l) return n.r;
        if (!n.r) return n.l;
        let s = n.r; while (s.l) s = s.l;
        n.k = s.k; n.r = del(n.r, s.k);
      }
      return n;
    };
    const pathTo = k => { const p = []; let n = root; while (n) { p.push(n.k); if (k === n.k) break; n = k < n.k ? n.l : n.r; } return p; };
    const height = n => (n ? 1 + Math.max(height(n.l), height(n.r)) : 0);
    let hl = new Set(), found = null;
    function render() {
      const nodes = [];
      let x = 0;
      (function lay(n, d) { if (!n) return; lay(n.l, d + 1); n.x = x++; n.d = d; nodes.push(n); lay(n.r, d + 1); })(root, 0);
      const W0 = Math.max(1, x), H = height(root);
      const sx = 46, sy = 58, m = 26, w = Math.max(260, m * 2 + (W0 - 1) * sx), hgt = Math.max(70, m * 2 + (H - 1) * sy);
      const svg = s('svg', { viewBox: `0 0 ${w} ${hgt}`, width: w, height: hgt, class: 'dg' });
      const X = n => m + n.x * sx + (w - (m * 2 + (W0 - 1) * sx)) / 2, Y = n => m + n.d * sy;
      for (const n of nodes) for (const c of [n.l, n.r]) if (c) svg.append(s('line', { x1: X(n), y1: Y(n), x2: X(c), y2: Y(c), class: 'edge' + (hl.has(n.k) && hl.has(c.k) ? ' hl' : '') }));
      for (const n of nodes) svg.append(s('circle', { cx: X(n), cy: Y(n), r: 17, class: 'node' + (hl.has(n.k) ? ' hl' : '') + (found === n.k ? ' found' : '') }), s('text', { x: X(n), y: Y(n), class: 't' }, n.k));
      if (!nodes.length) svg.append(s('text', { x: w / 2, y: hgt / 2, class: 's' }, 'empty tree'));
      svgBox.textContent = ''; svgBox.append(svg);
      const order = { in: [], pre: [], post: [], level: [] };
      (function t(n) { if (!n) return; order.pre.push(n.k); t(n.l); order.in.push(n.k); t(n.r); order.post.push(n.k); })(root);
      const qq = root ? [root] : [];
      while (qq.length) { const n = qq.shift(); order.level.push(n.k); if (n.l) qq.push(n.l); if (n.r) qq.push(n.r); }
      trav.innerHTML = `<div><span>Inorder</span><b>${order.in.join(' ') || '—'}</b></div><div><span>Preorder</span><b>${order.pre.join(' ') || '—'}</b></div><div><span>Postorder</span><b>${order.post.join(' ') || '—'}</b></div><div><span>Level order</span><b>${order.level.join(' ') || '—'}</b></div><div><span>Height</span><b>${Math.max(0, height(root) - 1)} (${nodes.length} nodes)</b></div>`;
    }
    function op(kind) {
      const raw = val.value.trim();
      if (raw === '') return;
      const k = +raw;
      const path = pathTo(k);
      hl = new Set(path); found = null;
      const exists = path.at(-1) === k;
      if (kind === 'insert') {
        if (exists) { found = k; ui.say(`${k} is already in the tree (BSTs here ignore duplicates).`, 'bad'); }
        else { root = insert(root, k); hl.add(k); ui.say(`Insert ${k}: ${path.map(p => `${k} ${k < p ? '<' : '>'} ${p} → go ${k < p ? 'left' : 'right'}`).join('; ') || 'tree was empty, so it becomes the root'}.`, 'good'); }
      } else if (kind === 'search') {
        if (exists) found = k;
        ui.say(exists ? `Found ${k} after ${path.length} comparison${path.length > 1 ? 's' : ''}: ${path.join(' → ')}.` : `${k} is not in the tree. Checked ${path.join(' → ') || 'nothing (empty tree)'}, then fell off a leaf.`, exists ? 'good' : 'bad');
      } else {
        if (!exists) { ui.say(`${k} is not in the tree.`, 'bad'); }
        else {
          let n = root; while (n.k !== k) n = k < n.k ? n.l : n.r;
          const kids = (n.l ? 1 : 0) + (n.r ? 1 : 0);
          let succ = null;
          if (kids === 2) { let x = n.r; while (x.l) x = x.l; succ = x.k; }
          root = del(root, k); hl = new Set();
          ui.say(kids === 0 ? `Deleted leaf ${k}.` : kids === 1 ? `Deleted ${k}: its only child took its place.` : `Deleted ${k}: replaced by its inorder successor <b>${succ}</b> (smallest key in the right subtree).`, 'good');
        }
      }
      render();
      val.value = rand(5, 95);
    }
    [50, 30, 70, 20, 40, 60, 80].forEach(k => { root = insert(root, k); });
    render();
    ui.say('Inorder traversal of a BST is always sorted. Try inserting 10, 5, 3 to see the tree become lopsided.');
  };

  // ---------------------------------------------------------------- graph traversal
  W['graph-traversal'] = el => {
    const ui = shell(el, 'BFS and DFS step by step', 'Pick a start vertex and an algorithm, then step through the search.');
    const V = 'ABCDEFG'.split('');
    const pos = { A: [1.5, 0], B: [0.5, 1], C: [2.5, 1], D: [0, 2], E: [1, 2], F: [2.5, 2], G: [2.5, 3] };
    const E = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['E', 'F'], ['F', 'G']];
    const adj = Object.fromEntries(V.map(v => [v, []]));
    E.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    Object.values(adj).forEach(l => l.sort());
    let algo = 'BFS', start = 'A';
    const tabs = h('div', { class: 'w-tabs' }, ['BFS', 'DFS'].map(a => h('button', { type: 'button', 'data-k': a, onclick: () => { algo = a; load(); } }, a)));
    const sel = h('select', { class: 'w-select', 'aria-label': 'Start vertex', onchange: e => { start = e.target.value; load(); } }, V.map(v => h('option', { value: v }, `start at ${v}`)));
    const ctl = h('div', { class: 'w-row' });
    ui.controls.append(h('div', { class: 'w-row' }, tabs, sel), ctl);
    const svgBox = h('div', { class: 'w-svg' });
    const side = h('div', { class: 'gt-side' });
    ui.stage.append(h('div', { class: 'gt' }, svgBox, side));
    function frames() {
      const out = [], visited = new Set(), order = [], treeEdges = [];
      const snap = (msg, current, ds) => out.push({ msg, current, ds: [...ds], visited: new Set(visited), order: [...order], tree: [...treeEdges] });
      if (algo === 'BFS') {
        const q = [start]; visited.add(start);
        snap(`Start: mark ${start} visited and enqueue it.`, null, q);
        while (q.length) {
          const u = q.shift(); order.push(u);
          snap(`Dequeue ${u} and visit it.`, u, q);
          for (const v of adj[u]) if (!visited.has(v)) { visited.add(v); q.push(v); treeEdges.push(u + v); snap(`Neighbour ${v} is new: mark it visited and enqueue it.`, u, q); }
        }
        snap(`Done. BFS order: ${order.join(' → ')}`, null, q);
      } else {
        const stack = [];
        const dfs = (u, parent) => {
          visited.add(u); order.push(u); stack.push(u);
          if (parent) treeEdges.push(parent + u);
          snap(parent ? `Go deeper from ${parent} to unvisited ${u}.` : `Start at ${u}.`, u, stack);
          for (const v of adj[u]) if (!visited.has(v)) dfs(v, u);
          stack.pop();
          snap(`${u} has no unvisited neighbours left: backtrack.`, stack.at(-1) || null, stack);
        };
        dfs(start, null);
        snap(`Done. DFS order: ${order.join(' → ')}`, null, []);
      }
      return out;
    }
    const pl = player(ctl, f => {
      const sc = 88, m = 26, w = m * 2 + 2.5 * sc, hh = m * 2 + 3 * sc;
      const svg = s('svg', { viewBox: `0 0 ${w} ${hh}`, width: w, height: hh, class: 'dg' });
      const X = v => m + pos[v][0] * sc, Y = v => m + pos[v][1] * sc;
      for (const [a, b] of E) svg.append(s('line', { x1: X(a), y1: Y(a), x2: X(b), y2: Y(b), class: 'edge' + (f.tree.includes(a + b) || f.tree.includes(b + a) ? ' hl' : '') }));
      for (const v of V) {
        const inDs = f.ds.includes(v);
        svg.append(s('circle', { cx: X(v), cy: Y(v), r: 18, class: 'node' + (v === f.current ? ' cur' : f.order.includes(v) ? ' done' : inDs ? ' hl' : '') }), s('text', { x: X(v), y: Y(v), class: 't' }, v));
      }
      svgBox.textContent = ''; svgBox.append(svg);
      side.innerHTML = `<div class="gt-box"><span>${algo === 'BFS' ? 'Queue (front → rear)' : 'Stack (bottom → top)'}</span><b>${f.ds.join('  ') || 'empty'}</b></div><div class="gt-box"><span>Visit order</span><b>${f.order.join(' → ') || '—'}</b></div><div class="gt-legend"><i class="cur"></i>current <i class="hl"></i>${algo === 'BFS' ? 'in queue' : 'on stack'} <i class="done"></i>visited</div>`;
      ui.say(f.msg);
    }, { delay: 900 });
    function load() { tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.k === algo))); pl.load(frames()); }
    load();
  };

  // ---------------------------------------------------------------- hash table
  W['hash-table'] = el => {
    const ui = shell(el, 'Hash table: collisions in action', 'h(key) = key mod m. Insert keys and compare collision strategies.');
    let M = 7, mode = 'chain', table, keys = [];
    const inp = field({ type: 'number', value: 50, 'aria-label': 'Key', class: 'w-input narrow' });
    const modeSel = h('select', { class: 'w-select', 'aria-label': 'Strategy', onchange: e => { mode = e.target.value; rebuild(); } }, [['chain', 'Separate chaining'], ['linear', 'Linear probing'], ['quadratic', 'Quadratic probing']].map(([v, t]) => h('option', { value: v }, t)));
    const sizeSel = h('select', { class: 'w-select', 'aria-label': 'Table size', onchange: e => { M = +e.target.value; rebuild(); } }, [5, 7, 10, 11].map(v => h('option', { value: v, selected: v === 7 }, `m = ${v}`)));
    ui.controls.append(inp, btn('Insert', () => add(), 'primary'), btn('Search', () => find()), modeSel, sizeSel, btn('Reset', () => { keys = []; rebuild(); ui.say('Empty table.'); }));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
    const view = h('div', { class: 'ht' });
    ui.stage.append(view);
    let probe = [], hit = -1;
    function place(k) {
      const h0 = ((k % M) + M) % M;
      if (mode === 'chain') { table[h0].push(k); return { slot: h0, path: [h0] }; }
      const path = [];
      for (let i = 0; i < M; i++) {
        const j = (h0 + (mode === 'linear' ? i : i * i)) % M;
        path.push(j);
        if (table[j] === null) { table[j] = k; return { slot: j, path }; }
      }
      return { slot: -1, path };
    }
    function rebuild() {
      table = mode === 'chain' ? Array.from({ length: M }, () => []) : Array(M).fill(null);
      const kept = [];
      for (const k of keys) if (place(k).slot >= 0) kept.push(k);
      keys = kept; probe = []; hit = -1; render();
    }
    function render() {
      view.textContent = '';
      for (let i = 0; i < M; i++) {
        const cell = mode === 'chain'
          ? h('div', { class: 'ht-chain' }, table[i].length ? table[i].map((k, j) => [j ? h('span', { class: 'll-arrow sm' }) : null, h('span', { class: 'ht-key' + (k === hit ? ' hit' : '') }, k)]) : h('span', { class: 'ht-empty' }, '∅'))
          : h('div', { class: 'ht-cell' + (table[i] === hit ? ' hit' : '') }, table[i] ?? '');
        view.append(h('div', { class: 'ht-row' + (probe.includes(i) ? ' probed' : '') }, h('span', { class: 'ht-idx' }, i), cell));
      }
      const n = mode === 'chain' ? table.flat().length : table.filter(x => x !== null).length;
      view.append(h('div', { class: 'ht-load' }, `load factor α = ${n}/${M} = ${(n / M).toFixed(2)}`));
    }
    function add() {
      const raw = inp.value.trim();
      if (raw === '') return;
      const k = +raw, h0 = ((k % M) + M) % M;
      const r = place(k);
      if (r.slot < 0) { probe = r.path; render(); ui.say(`No free slot found for ${k}: the table is full (or quadratic probing missed the free slots).`, 'bad'); return; }
      keys.push(k); probe = r.path; hit = k; render();
      const coll = mode === 'chain' ? (table[h0].length > 1 ? ` — collision! ${k} joins the chain at slot ${h0}.` : '') : r.path.length > 1 ? ` — collision, probed ${r.path.join(' → ')} and stored it in slot ${r.slot}.` : '';
      ui.say(`h(${k}) = ${k} mod ${M} = <b>${h0}</b>${coll || ' — slot was free.'}`, coll ? '' : 'good');
      inp.value = rand(1, 120);
    }
    function find() {
      const raw = inp.value.trim();
      if (raw === '') return;
      const k = +raw, h0 = ((k % M) + M) % M;
      if (mode === 'chain') {
        probe = [h0]; hit = table[h0].includes(k) ? k : -1; render();
        ui.say(hit === k ? `Found ${k} in the chain at slot ${h0}.` : `${k} is not in slot ${h0}'s chain, so it is not in the table.`, hit === k ? 'good' : 'bad');
        return;
      }
      probe = [];
      for (let i = 0; i < M; i++) {
        const j = (h0 + (mode === 'linear' ? i : i * i)) % M;
        probe.push(j);
        if (table[j] === k) { hit = k; render(); ui.say(`Found ${k} after probing ${probe.join(' → ')}.`, 'good'); return; }
        if (table[j] === null) break;
      }
      hit = -1; render(); ui.say(`${k} not found: probed ${probe.join(' → ')} and reached an empty slot.`, 'bad');
    }
    keys = [50, 700, 76, 85, 92];
    rebuild();
    ui.say('Slot 1 already has a collision (50, 85 and 92 all hash to 1). Insert 73 and 101, then switch strategies.');
  };

  // ---------------------------------------------------------------- binary search
  W['binary-search'] = el => {
    const ui = shell(el, 'Binary search, step by step', 'Each comparison discards half of the remaining range.');
    let arr = [], target = 0;
    const inp = field({ type: 'number', value: 0, 'aria-label': 'Target', class: 'w-input narrow' });
    const ctl = h('div', { class: 'w-row' });
    ui.controls.append(h('div', { class: 'w-row' }, h('label', { class: 'w-label' }, 'search for', inp), btn('Search', () => { target = +inp.value; load(); }, 'primary'), btn('New array', () => { fresh(); load(); })), ctl);
    const view = h('div', { class: 'bs' });
    ui.stage.append(view);
    function fresh() {
      const set = new Set(); while (set.size < 15) set.add(rand(2, 99));
      arr = [...set].sort((a, b) => a - b);
      target = Math.random() < 0.8 ? arr[rand(0, 14)] : rand(2, 99);
      inp.value = target;
    }
    function frames() {
      const out = [];
      let lo = 0, hi = arr.length - 1, steps = 0;
      out.push({ lo, hi, mid: -1, msg: `Search for ${target}: low = 0, high = ${hi}.` });
      while (lo <= hi) {
        const mid = lo + ((hi - lo) >> 1);
        steps++;
        if (arr[mid] === target) { out.push({ lo, hi, mid, found: mid, msg: `mid = ${mid}, a[mid] = ${arr[mid]} — found after ${steps} comparison${steps > 1 ? 's' : ''}! (Linear search would need ${mid + 1}.)` }); return out; }
        out.push({ lo, hi, mid, msg: `mid = (${lo} + ${hi}) / 2 = ${mid}; a[mid] = ${arr[mid]} is ${arr[mid] < target ? 'less' : 'greater'} than ${target}, so search the ${arr[mid] < target ? 'right' : 'left'} half.` });
        if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
        out.push({ lo, hi, mid: -1, msg: `low = ${lo}, high = ${hi}.` });
      }
      out.push({ lo, hi, mid: -1, none: true, msg: `low > high: ${target} is not in the array (${steps} comparisons).` });
      return out;
    }
    const pl = player(ctl, f => {
      view.textContent = '';
      arr.forEach((v, i) => {
        const out = i < f.lo || i > f.hi;
        const marks = [i === f.lo && !f.none ? 'low' : '', i === f.mid ? 'mid' : '', i === f.hi && !f.none ? 'high' : ''].filter(Boolean).join(' ');
        view.append(h('div', { class: 'bs-cell' + (out ? ' out' : '') + (i === f.mid ? ' mid' : '') + (i === f.found ? ' found' : '') }, h('small', { class: 'bs-mark' }, marks), h('b', {}, v), h('small', {}, i)));
      });
      ui.say(f.msg, f.found !== undefined ? 'good' : f.none ? 'bad' : '');
    }, { delay: 1100 });
    const load = () => pl.load(frames());
    fresh();
    load();
  };

  // ---------------------------------------------------------------- venn / set operations
  W.venn = (el, o) => {
    const ui = shell(el, 'Set operations', 'Edit the sets, pick an operation, and see the shaded region and the result.');
    const a = field({ value: o.a || '1 2 3 4 5 6', 'aria-label': 'Set A', class: 'w-input mono' });
    const b = field({ value: o.b || '4 5 6 7 8', 'aria-label': 'Set B', class: 'w-input mono' });
    const u = field({ value: o.u || '1 2 3 4 5 6 7 8 9 10', 'aria-label': 'Universal set U', class: 'w-input wide mono' });
    const OPS = [['union', 'A ∪ B'], ['intersection', 'A ∩ B'], ['a-b', 'A − B'], ['b-a', 'B − A'], ['symdiff', 'A ⊕ B'], ['complement-a', "A′"]];
    let op = 'union';
    const tabs = h('div', { class: 'w-tabs' }, OPS.map(([k, t]) => h('button', { type: 'button', 'data-k': k, onclick: () => { op = k; render(); } }, t)));
    ui.controls.append(h('label', { class: 'w-label' }, 'A', a), h('label', { class: 'w-label' }, 'B', b), h('label', { class: 'w-label' }, 'U', u), tabs);
    const svgBox = h('div', { class: 'w-svg' });
    ui.stage.append(svgBox);
    const parse = x => [...new Set(x.value.split(/[\s,{}]+/).filter(Boolean))];
    let uid = 0;
    function render() {
      tabs.querySelectorAll('button').forEach(btn2 => btn2.setAttribute('aria-selected', String(btn2.dataset.k === op)));
      const A = parse(a), B = parse(b), U = [...new Set([...parse(u), ...A, ...B])];
      const inA = x => A.includes(x), inB = x => B.includes(x);
      const region = { a: U.filter(x => inA(x) && !inB(x)), ab: U.filter(x => inA(x) && inB(x)), b: U.filter(x => !inA(x) && inB(x)), out: U.filter(x => !inA(x) && !inB(x)) };
      const pick = { union: ['a', 'ab', 'b'], intersection: ['ab'], 'a-b': ['a'], 'b-a': ['b'], symdiff: ['a', 'b'], 'complement-a': ['b', 'out'] }[op];
      const id = `wv${++uid}`;
      const w = 460, hh = 250, ca = [175, 125], cb = [285, 125], r = 92;
      const svg = s('svg', { viewBox: `0 0 ${w} ${hh}`, width: w, height: hh, class: 'dg' });
      const defs = s('defs');
      const clipA = s('clipPath', { id: id + 'a' }, s('circle', { cx: ca[0], cy: ca[1], r }));
      const clipB = s('clipPath', { id: id + 'b' }, s('circle', { cx: cb[0], cy: cb[1], r }));
      const maskOut = s('mask', { id: id + 'o' }, s('rect', { x: 0, y: 0, width: w, height: hh, fill: '#fff' }), s('circle', { cx: ca[0], cy: ca[1], r, fill: '#000' }), s('circle', { cx: cb[0], cy: cb[1], r, fill: '#000' }));
      const maskA = s('mask', { id: id + 'ma' }, s('circle', { cx: ca[0], cy: ca[1], r, fill: '#fff' }), s('circle', { cx: cb[0], cy: cb[1], r, fill: '#000' }));
      const maskB = s('mask', { id: id + 'mb' }, s('circle', { cx: cb[0], cy: cb[1], r, fill: '#fff' }), s('circle', { cx: ca[0], cy: ca[1], r, fill: '#000' }));
      defs.append(clipA, clipB, maskOut, maskA, maskB);
      svg.append(defs, s('rect', { x: 6, y: 6, width: w - 12, height: hh - 12, rx: 12, class: 'universe' }));
      const shade = { a: s('rect', { x: 0, y: 0, width: w, height: hh, mask: `url(#${id}ma)` }), b: s('rect', { x: 0, y: 0, width: w, height: hh, mask: `url(#${id}mb)` }), ab: s('g', { 'clip-path': `url(#${id}a)` }, s('circle', { cx: cb[0], cy: cb[1], r })), out: s('rect', { x: 6, y: 6, width: w - 12, height: hh - 12, rx: 12, mask: `url(#${id}o)` }) };
      const g = s('g', { class: 'shade' });
      pick.forEach(k => g.append(shade[k]));
      svg.append(g, s('circle', { cx: ca[0], cy: ca[1], r, class: 'ring' }), s('circle', { cx: cb[0], cy: cb[1], r, class: 'ring' }),
        s('text', { x: 92, y: 40, class: 't lbl' }, 'A'), s('text', { x: 368, y: 40, class: 't lbl' }, 'B'), s('text', { x: 24, y: 26, class: 's start' }, 'U'));
      const put = (items, cx, cy, width) => items.slice(0, 12).forEach((x, i) => {
        const cols = Math.max(1, Math.floor(width / 30)), row = Math.floor(i / cols), col = i % cols, n = Math.min(cols, items.length - row * cols);
        svg.append(s('text', { x: cx + (col - (n - 1) / 2) * 30, y: cy - 20 + row * 22, class: 't small' }, x));
      });
      put(region.a, 125, 125, 80); put(region.ab, 230, 125, 40); put(region.b, 335, 125, 80);
      region.out.slice(0, 10).forEach((x, i) => svg.append(s('text', { x: 28 + (i % 2) * 404 + (i >= 2 ? 0 : 0), y: 70 + Math.floor(i / 2) * 26, class: 't small' }, x)));
      svgBox.textContent = ''; svgBox.append(svg);
      const result = pick.flatMap(k => region[k]);
      const label = OPS.find(x => x[0] === op)[1];
      ui.say(`${label} = { ${result.join(', ')} } &nbsp;·&nbsp; |${label}| = <b>${result.length}</b> &nbsp;·&nbsp; |A| = ${A.length}, |B| = ${B.length}, |A ∩ B| = ${region.ab.length}`);
    }
    [a, b, u].forEach(x => x.addEventListener('input', render));
    render();
  };

  // ---------------------------------------------------------------- DP tables
  W['dp-table'] = (el, o) => {
    const lcs = o.mode === 'lcs';
    const ui = shell(el, lcs ? 'LCS table, cell by cell' : '0/1 knapsack table, cell by cell', lcs ? 'Matching characters extend the diagonal; otherwise take the larger of top and left.' : 'Each cell chooses the better of skipping the item or taking it.');
    const ctl = h('div', { class: 'w-row' });
    let A = o.a || 'ABCBDAB', B = o.b || 'BDCABA';
    const items = [{ n: 'A', w: 1, v: 1 }, { n: 'B', w: 3, v: 4 }, { n: 'C', w: 4, v: 5 }, { n: 'D', w: 5, v: 7 }];
    let CAP = 7;
    if (lcs) {
      const ia = field({ value: A, maxlength: 9, 'aria-label': 'First string', class: 'w-input narrow mono' }), ib = field({ value: B, maxlength: 9, 'aria-label': 'Second string', class: 'w-input narrow mono' });
      ui.controls.append(h('div', { class: 'w-row' }, h('label', { class: 'w-label' }, 'X', ia), h('label', { class: 'w-label' }, 'Y', ib), btn('Rebuild', () => { A = ia.value.toUpperCase().slice(0, 9) || 'A'; B = ib.value.toUpperCase().slice(0, 9) || 'B'; load(); }, 'primary')), ctl);
    } else {
      const cap = h('input', { type: 'range', min: 1, max: 10, value: CAP, class: 'w-range', 'aria-label': 'Capacity' });
      const capOut = h('b', {}, CAP);
      cap.addEventListener('input', () => { CAP = +cap.value; capOut.textContent = CAP; load(); });
      ui.controls.append(h('div', { class: 'w-row' }, h('label', { class: 'w-label' }, 'capacity W = ', capOut), cap, h('span', { class: 'w-note' }, items.map(it => `${it.n}(w${it.w}, v${it.v})`).join(' · '))), ctl);
    }
    const view = h('div', { class: 'w-scroll' });
    ui.stage.append(view);
    function frames() {
      const out = [];
      const R = lcs ? A.length : items.length, C = lcs ? B.length : CAP;
      const T = Array.from({ length: R + 1 }, () => Array(C + 1).fill(null));
      for (let j = 0; j <= C; j++) T[0][j] = 0;
      for (let i = 0; i <= R; i++) T[i][0] = 0;
      out.push({ T: T.map(r => [...r]), cur: null, deps: [], msg: lcs ? 'Row 0 and column 0 are 0: an empty string has an empty LCS.' : 'Row 0 (no items) and column 0 (no capacity) are 0.' });
      for (let i = 1; i <= R; i++) for (let j = 1; j <= C; j++) {
        let msg, deps;
        if (lcs) {
          if (A[i - 1] === B[j - 1]) { T[i][j] = T[i - 1][j - 1] + 1; deps = [[i - 1, j - 1]]; msg = `X[${i}] = Y[${j}] = '${A[i - 1]}': match, so diagonal + 1 = ${T[i][j]}`; }
          else { T[i][j] = Math.max(T[i - 1][j], T[i][j - 1]); deps = [[i - 1, j], [i, j - 1]]; msg = `'${A[i - 1]}' ≠ '${B[j - 1]}': max(top ${T[i - 1][j]}, left ${T[i][j - 1]}) = ${T[i][j]}`; }
        } else {
          const it = items[i - 1], skip = T[i - 1][j];
          if (it.w > j) { T[i][j] = skip; deps = [[i - 1, j]]; msg = `${it.n} weighs ${it.w} > ${j}: cannot take it, copy ${skip} from above`; }
          else { const take = it.v + T[i - 1][j - it.w]; T[i][j] = Math.max(skip, take); deps = [[i - 1, j], [i - 1, j - it.w]]; msg = `w = ${j}: skip ${it.n} → ${skip}, take ${it.n} → ${it.v} + dp[${i - 1}][${j - it.w}] = ${take}; best ${T[i][j]}`; }
        }
        out.push({ T: T.map(r => [...r]), cur: [i, j], deps, msg });
      }
      const path = [];
      let answer = '';
      if (lcs) {
        let i = R, j = C, str = '';
        while (i > 0 && j > 0) {
          if (A[i - 1] === B[j - 1]) { path.push([i, j]); str = A[i - 1] + str; i--; j--; }
          else if (T[i - 1][j] >= T[i][j - 1]) i--; else j--;
        }
        answer = `LCS length ${T[R][C]}: <b class="mono">${str || '(empty)'}</b> — highlighted cells are the matches on the traceback path.`;
      } else {
        let j = C;
        const chosen = [];
        for (let i = R; i > 0; i--) if (T[i][j] !== T[i - 1][j]) { path.push([i, j]); chosen.unshift(items[i - 1].n); j -= items[i - 1].w; }
        answer = `Best value <b>${T[R][C]}</b> with items <b>${chosen.join(', ') || 'none'}</b> — highlighted cells show where an item was taken.`;
      }
      out.push({ T: T.map(r => [...r]), cur: null, deps: [], path, msg: answer, end: true });
      return out;
    }
    const pl = player(ctl, f => {
      const R = f.T.length - 1, C = f.T[0].length - 1;
      const head = h('tr', {}, h('th', {}, ''), h('th', {}, lcs ? 'Ø' : '0'), Array.from({ length: C }, (_, j) => h('th', {}, lcs ? B[j] : j + 1)));
      const body = h('tbody');
      for (let i = 0; i <= R; i++) {
        body.append(h('tr', {}, h('th', {}, i === 0 ? (lcs ? 'Ø' : '—') : lcs ? A[i - 1] : `${items[i - 1].n} (${items[i - 1].w}, ${items[i - 1].v})`),
          f.T[i].map((v, j) => {
            const isCur = f.cur && f.cur[0] === i && f.cur[1] === j, isDep = f.deps.some(d => d[0] === i && d[1] === j), onPath = f.path && f.path.some(p => p[0] === i && p[1] === j);
            return h('td', { class: (isCur ? 'cur ' : '') + (isDep ? 'dep ' : '') + (onPath ? 'path ' : '') + (v === null ? 'empty' : '') }, v ?? '');
          })));
      }
      view.textContent = '';
      view.append(h('table', { class: 'dpt' }, h('thead', {}, head), body));
      ui.say(f.msg, f.end ? 'good' : '');
    }, { delay: 650 });
    const load = () => pl.load(frames());
    load();
  };

  // ---------------------------------------------------------------- N-Queens
  W['n-queens'] = el => {
    const ui = shell(el, 'N-Queens backtracking', 'Queens are placed row by row; a conflict forces the algorithm to back up.');
    let N = 4;
    const ctl = h('div', { class: 'w-row' });
    const sel = h('select', { class: 'w-select', 'aria-label': 'Board size', onchange: e => { N = +e.target.value; load(); } }, [4, 5, 6, 8].map(n => h('option', { value: n, selected: n === N }, `${n} × ${n} board`)));
    ui.controls.append(h('div', { class: 'w-row' }, sel), ctl);
    const view = h('div', { class: 'nq' });
    const stats = h('div', { class: 'sv-stats' });
    ui.stage.append(view, stats);
    function frames() {
      const out = [], col = [];
      let tries = 0, backs = 0, sol = 0;
      const snap = (msg, extra = {}) => out.push({ col: [...col], msg, tries, backs, sol, ...extra });
      const attacks = (r, c) => { for (let i = 0; i < r; i++) if (col[i] === c || Math.abs(col[i] - c) === r - i) return i; return -1; };
      snap(`Place ${N} queens so that none attack each other.`);
      const solve = r => {
        if (r === N) { sol++; snap(`Solution ${sol} found!`, { win: true }); return out.length > 3000 || sol >= 1; }
        for (let c = 0; c < N; c++) {
          tries++;
          const by = attacks(r, c);
          if (by >= 0) { snap(`Row ${r + 1}, column ${c + 1} is attacked by the queen in row ${by + 1}.`, { probe: [r, c], by }); continue; }
          col.push(c);
          snap(`Place a queen at row ${r + 1}, column ${c + 1}.`, { placed: [r, c] });
          if (solve(r + 1)) return true;
          col.pop(); backs++;
          snap(`No safe square in row ${r + 2} — backtrack: remove the queen from row ${r + 1}.`, { removed: [r, c] });
        }
        return false;
      };
      solve(0);
      return out;
    }
    const pl = player(ctl, f => {
      view.textContent = '';
      view.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const q = f.col[r] === c;
        let cls = 'nq-sq' + ((r + c) % 2 ? ' dark' : '');
        if (f.probe && f.probe[0] === r && f.probe[1] === c) cls += ' bad';
        if (f.by !== undefined && f.by === r && f.col[r] === c) cls += ' attacker';
        if (f.placed && f.placed[0] === r && f.placed[1] === c) cls += ' new';
        if (f.removed && f.removed[0] === r && f.removed[1] === c) cls += ' gone';
        if (f.win && q) cls += ' win';
        view.append(h('div', { class: cls }, q ? '♛' : f.probe && f.probe[0] === r && f.probe[1] === c ? '✕' : ''));
      }
      stats.innerHTML = `<span>Squares tried <b>${f.tries}</b></span><span>Backtracks <b>${f.backs}</b></span><span>Queens placed <b>${f.col.length}/${N}</b></span>`;
      ui.say(f.msg, f.win ? 'good' : f.removed ? 'bad' : '');
    }, { delay: 600 });
    const load = () => pl.load(frames());
    load();
  };

  // ---------------------------------------------------------------- web playground
  W['web-playground'] = el => {
    const initial = (el.dataset.body || '').trim() + '\n';
    const ui = shell(el, 'Live HTML, CSS & JavaScript editor', 'Edit the code — the preview on the right updates as you type.');
    const ta = h('textarea', { class: 'wp-code', spellcheck: 'false', 'aria-label': 'HTML code' });
    ta.value = initial;
    const frame = h('iframe', { class: 'wp-frame', sandbox: 'allow-scripts allow-modals', title: 'Preview', loading: 'lazy' });
    ui.controls.append(btn('↺ Reset code', () => { ta.value = initial; update(); }), h('span', { class: 'w-note' }, 'The preview runs in a sandbox, separate from this page.'));
    ui.stage.append(h('div', { class: 'wp' }, ta, frame));
    let t;
    const update = () => { frame.srcdoc = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${ta.value}`; };
    ta.addEventListener('input', () => { clearTimeout(t); t = setTimeout(update, 300); });
    ta.addEventListener('keydown', e => {
      if (e.key === 'Tab') { e.preventDefault(); const p = ta.selectionStart; ta.setRangeText('  ', p, ta.selectionEnd, 'end'); }
    });
    update();
    ui.say('Tip: break something on purpose — delete a closing tag or a CSS brace — and watch what the browser does.');
  };

  // ---------------------------------------------------------------- mount
  const mount = el => {
    if (el.dataset.ready) return;
    el.dataset.ready = '1';
    const fn = W[el.dataset.widget];
    let opts = {};
    try { opts = JSON.parse(el.dataset.opts || '{}'); } catch { /* ignore */ }
    if (!fn) { el.textContent = `Unknown widget: ${el.dataset.widget}`; return; }
    try { fn(el, opts); } catch (e) { el.textContent = 'This demo could not start.'; console.error(e); }
  };
  const all = [...document.querySelectorAll('.widget[data-widget]')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); mount(e.target); } }), { rootMargin: '400px' });
    all.forEach(el => io.observe(el));
  } else all.forEach(mount);
  window.addEventListener('beforeprint', () => all.forEach(mount));
})();
