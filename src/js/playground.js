// Bytebook online compiler. C and C++ run on Compiler Explorer (godbolt.org,
// real GCC); Python runs in the browser with Pyodide in a web worker.
(() => {
  const $ = s => document.querySelector(s);
  const LANGS = {
    c: {
      name: 'C', file: 'main.c', mode: 'text/x-csrc', compiler: 'cg152', lang: 'c', args: '-std=c17 -O1 -Wall -Wextra',
      engine: 'GCC 15.2 · compiled on Compiler Explorer',
      starter: '#include <stdio.h>\n\nint main(void) {\n    int n;\n    printf("Enter a number: ");\n    scanf("%d", &n);\n    printf("%d squared is %d\\n", n, n * n);\n    return 0;\n}\n',
      stdin: '12\n',
    },
    cpp: {
      name: 'C++', file: 'main.cpp', mode: 'text/x-c++src', compiler: 'g152', lang: 'c++', args: '-std=c++17 -O1 -Wall -Wextra',
      engine: 'G++ 15.2 (C++17) · compiled on Compiler Explorer',
      starter: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name;\n    cout << "Your name: ";\n    cin >> name;\n    cout << "Hello, " << name << "!" << endl;\n    return 0;\n}\n',
      stdin: 'Asha\n',
    },
    python: {
      name: 'Python', file: 'main.py', mode: 'python',
      engine: 'Python 3.14 · runs in your browser (Pyodide)',
      starter: 'name = input("What is your name? ")\nfor i in range(1, 4):\n    print(f"{i}. Hello, {name}!")\n',
      stdin: 'Ravi\n',
    },
    js: {
      name: 'JavaScript', file: 'main.js', mode: 'javascript',
      engine: 'JavaScript · runs in your browser · read input with prompt()',
      starter: 'const name = prompt("Your name: ");\nconst marks = [78, 92, 65, 88];\nconst avg = marks.reduce((a, b) => a + b, 0) / marks.length;\nconsole.log(`Hi ${name}, your average is ${avg}`);\n',
      stdin: 'Meera\n',
    },
  };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  };
  const fromB64 = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)));
  const toB64 = s => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  // ------------------------------------------------ initial state
  const hash = new URLSearchParams(location.hash.slice(1));
  let lang = LANGS[hash.get('lang')] ? hash.get('lang') : (LANGS[store.get('bb-pg-lang')] ? store.get('bb-pg-lang') : 'c');
  const fromLink = {};
  if (hash.get('code')) {
    try { fromLink.code = fromB64(hash.get('code')); fromLink.stdin = hash.get('stdin') ? fromB64(hash.get('stdin')) : ''; } catch { /* bad link */ }
  }
  const codeFor = l => (l === lang && fromLink.code) ? fromLink.code : (store.get(`bb-pg-code-${l}`) ?? LANGS[l].starter);
  const stdinFor = l => (l === lang && fromLink.code) ? fromLink.stdin : (store.get(`bb-pg-stdin-${l}`) ?? LANGS[l].stdin);

  const out = $('#pg-output'), status = $('#pg-status'), runBtn = $('#pg-run'), stdinEl = $('#pg-stdin');
  const cm = CodeMirror.fromTextArea($('#pg-code'), {
    mode: LANGS[lang].mode, lineNumbers: true, indentUnit: 4, tabSize: 4, indentWithTabs: false,
    matchBrackets: true, autoCloseBrackets: true, styleActiveLine: true, viewportMargin: Infinity,
    extraKeys: {
      'Ctrl-Enter': () => run(), 'Cmd-Enter': () => run(),
      'Ctrl-/': 'toggleComment', 'Cmd-/': 'toggleComment',
      Tab: c => (c.somethingSelected() ? c.indentSelection('add') : c.replaceSelection('    ')),
    },
  });

  function setLang(l, initial = false) {
    if (!initial) {
      store.set(`bb-pg-code-${lang}`, cm.getValue()); store.set(`bb-pg-stdin-${lang}`, stdinEl.value);
      history.replaceState(null, '', `#lang=${l}`);
    }
    lang = l;
    store.set('bb-pg-lang', l);
    document.querySelectorAll('.pg-langs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.lang === l)));
    $('#pg-engine').textContent = LANGS[l].engine;
    $('#pg-filename').textContent = LANGS[l].file;
    cm.setOption('mode', LANGS[l].mode);
    cm.setValue(codeFor(l));
    stdinEl.value = stdinFor(l);
    document.title = `${LANGS[l].name} online compiler | Bytebook`;
    clearOut();
    if (l === 'python') setTimeout(ensureWorker, 800);      // prewarm the interpreter
  }
  function clearOut() { out.innerHTML = '<span class="meta-line">Press Run (Ctrl/⌘ + Enter) to compile and run your program.</span>'; setStatus(''); }
  function setStatus(text, cls = '') { status.textContent = text; status.className = `pg-status ${cls}`; }
  const escHtml = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const append = (text, cls) => { out.insertAdjacentHTML('beforeend', cls ? `<span class="${cls}">${escHtml(text)}</span>` : escHtml(text)); out.scrollTop = out.scrollHeight; };

  document.querySelectorAll('.pg-langs button').forEach(b => b.addEventListener('click', () => b.dataset.lang !== lang && setLang(b.dataset.lang)));
  let saveT;
  cm.on('change', () => { clearTimeout(saveT); saveT = setTimeout(() => store.set(`bb-pg-code-${lang}`, cm.getValue()), 400); });
  stdinEl.addEventListener('input', () => store.set(`bb-pg-stdin-${lang}`, stdinEl.value));

  // ------------------------------------------------ running
  let busy = false;
  async function run() {
    if (busy) return;
    busy = true; runBtn.disabled = true; out.textContent = '';
    const code = cm.getValue(), stdin = stdinEl.value ? (stdinEl.value.endsWith('\n') ? stdinEl.value : stdinEl.value + '\n') : '';
    try {
      if (lang === 'python') await runPython(code, stdin);
      else if (lang === 'js') await runJs(code, stdin);
      else await runGcc(code, stdin);
    } finally { busy = false; runBtn.disabled = false; }
  }
  runBtn.addEventListener('click', run);

  const ansi = s => s.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
  const lines = arr => (arr || []).map(x => ansi(x.text)).join('\n');
  async function runGcc(code, stdin) {
    const L = LANGS[lang];
    setStatus('Compiling…', 'busy');
    const body = {
      source: code, compiler: L.compiler, lang: L.lang, allowStoreCodeDebug: false,
      options: {
        userArguments: L.args,
        executeParameters: { args: [], stdin },
        compilerOptions: { executorRequest: true, skipAsm: true },
        filters: { execute: true }, tools: [], libraries: [],
      },
    };
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    let r;
    try {
      const res = await fetch(`https://godbolt.org/api/compiler/${L.compiler}/compile`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`Compiler service answered ${res.status}`);
      r = await res.json();
    } catch (e) {
      setStatus('Could not reach compiler', 'bad');
      append(`Could not reach the compiler service (${e.name === 'AbortError' ? 'timed out' : e.message}).\nCheck your internet connection and press Run again.`, 'err');
      return;
    } finally { clearTimeout(timer); }
    const build = r.buildResult || {};
    const warnings = lines(build.stderr).trim();
    if (build.code !== 0 && build.code !== undefined) {
      setStatus('Compile error', 'bad');
      append(warnings.replace(/<source>/g, L.file) || 'Compilation failed.', 'err');
      return;
    }
    const stdout = lines(r.stdout), stderr = lines(r.stderr);
    if (stdout) append(stdout + '\n');
    if (stderr) append(stderr + '\n', 'err');
    if (!stdout && !stderr) append('(no output)\n', 'meta-line');
    if (r.timedOut) append('\nStopped: the program ran too long (an infinite loop?).\n', 'err');
    if (warnings) append(`\nCompiler warnings:\n${warnings.replace(/<source>/g, L.file)}\n`, 'meta-line');
    const ok = r.code === 0 && !r.timedOut;
    setStatus(`${ok ? 'Finished' : `Exited with code ${r.code}`} · ${r.execTime ?? '?'} ms`, ok ? 'ok' : 'bad');
  }

  // Python: one long-lived worker, started as soon as the Python tab is open so the
  // ~10 MB first download usually finishes before the first Run.
  let worker = null, workerReady = false, loadStarted = 0, onWorker = null;
  const workerUrl = new URL('py-worker.js', document.currentScript?.src || location.href).href;
  function ensureWorker() {
    if (worker) return;
    worker = new Worker(workerUrl, { type: 'module' });
    workerReady = false;
    loadStarted = performance.now();
    worker.onmessage = ({ data }) => {
      if (data.type === 'ready') workerReady = true;
      if (data.type === 'fatal') { worker.terminate(); worker = null; }
      if (onWorker) onWorker(data);
    };
    worker.onerror = e => { e.preventDefault(); if (onWorker) onWorker({ type: 'fatal', text: e.message || 'the worker failed to start' }); worker = null; };
  }
  function runPython(code, stdin) {
    return new Promise(resolve => {
      ensureWorker();
      let finished = false, limit, ticker;
      const finish = () => { finished = true; clearTimeout(limit); clearInterval(ticker); onWorker = null; resolve(); };
      const startClock = () => {
        limit = setTimeout(() => {
          if (finished) return;
          worker.terminate(); worker = null;
          append('\nStopped after 15 seconds (is there an infinite loop?).\n', 'err');
          setStatus('Stopped', 'bad');
          finish();
        }, 15000);
      };
      if (workerReady) { setStatus('Running…', 'busy'); startClock(); }
      else {
        append('Loading Python for the first time (about 10 MB, cached afterwards)…\n', 'meta-line');
        const tick = () => {
          const secs = Math.round((performance.now() - loadStarted) / 1000);
          setStatus(`Loading Python… ${secs}s`, 'busy');
          if (secs >= 120) { onWorker({ type: 'fatal', text: 'it is taking too long — your connection may be slow or blocking cdn.jsdelivr.net' }); }
        };
        tick();
        ticker = setInterval(tick, 1000);
      }
      onWorker = m => {
        if (m.type === 'ready') { clearInterval(ticker); out.textContent = ''; setStatus('Running…', 'busy'); startClock(); }
        else if (m.type === 'out') append(m.text);
        else if (m.type === 'err') append(m.text, 'err');
        else if (m.type === 'in') append(m.text + '\n', 'in');
        else if (m.type === 'fatal') {
          append(`Python could not load: ${m.text}.\nCheck your internet connection and press Run again.\n`, 'err');
          setStatus('Load failed', 'bad');
          if (worker) { worker.terminate(); worker = null; }
          finish();
        } else if (m.type === 'done') {
          if (!out.textContent.trim()) append('(no output)\n', 'meta-line');
          setStatus(`${m.ok ? 'Finished' : 'Error'} · ${Math.round(m.ms)} ms`, m.ok ? 'ok' : 'bad');
          finish();
        }
      };
      worker.postMessage({ code, stdin });
    });
  }

  // JavaScript runs in a throwaway worker: console output is forwarded, prompt() reads the input box.
  function runJs(code, stdin) {
    return new Promise(resolve => {
      const lines = stdin.split('\n');
      if (lines.at(-1) === '') lines.pop();
      const prelude = `const __lines = ${JSON.stringify(lines)}; let __i = 0;
const __fmt = a => a.map(x => typeof x === 'string' ? x : (() => { try { return JSON.stringify(x) ?? String(x); } catch { return String(x); } })()).join(' ');
console.log = console.info = (...a) => postMessage({ type: 'out', text: __fmt(a) + '\\n' });
console.warn = console.error = (...a) => postMessage({ type: 'err', text: __fmt(a) + '\\n' });
self.prompt = (q = '') => { postMessage({ type: 'out', text: String(q) }); if (__i >= __lines.length) { postMessage({ type: 'out', text: '\\n' }); return null; } const l = __lines[__i++]; postMessage({ type: 'in', text: l }); return l; };
`;
      const body = `(async () => {\n${code}\n})().then(() => postMessage({ type: 'done', ok: true }), e => { postMessage({ type: 'err', text: String(e && e.stack || e) + '\\n' }); postMessage({ type: 'done', ok: false }); });`;
      const url = URL.createObjectURL(new Blob([prelude + body], { type: 'text/javascript' }));
      const w = new Worker(url);
      const t0 = performance.now();
      setStatus('Running…', 'busy');
      const end = (ok, label) => { clearTimeout(limit); w.terminate(); URL.revokeObjectURL(url); setStatus(`${label} · ${Math.round(performance.now() - t0)} ms`, ok ? 'ok' : 'bad'); resolve(); };
      const limit = setTimeout(() => { append('\nStopped after 10 seconds (is there an infinite loop?).\n', 'err'); end(false, 'Stopped'); }, 10000);
      w.onmessage = ({ data: m }) => {
        if (m.type === 'out') append(m.text);
        else if (m.type === 'err') append(m.text, 'err');
        else if (m.type === 'in') append(m.text + '\n', 'in');
        else if (m.type === 'done') { if (!out.textContent.trim()) append('(no output)\n', 'meta-line'); end(m.ok, m.ok ? 'Finished' : 'Error'); }
      };
      w.onerror = e => { e.preventDefault(); append(`${e.message}\n`, 'err'); end(false, 'Syntax error'); };
    });
  }

  // ------------------------------------------------ share + reset
  $('#pg-share').addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#lang=${lang}&code=${toB64(cm.getValue())}${stdinEl.value ? `&stdin=${toB64(stdinEl.value)}` : ''}`;
    history.replaceState(null, '', url);
    const label = $('#pg-share span');
    try { await navigator.clipboard.writeText(url); label.textContent = 'Link copied'; } catch { label.textContent = 'Link in address bar'; }
    setTimeout(() => { label.textContent = 'Copy share link'; }, 1800);
  });
  $('#pg-reset').addEventListener('click', () => {
    const original = fromLink.code && hash.get('lang') === lang ? fromLink : { code: LANGS[lang].starter, stdin: LANGS[lang].stdin };
    cm.setValue(original.code); stdinEl.value = original.stdin;
    store.set(`bb-pg-code-${lang}`, original.code); store.set(`bb-pg-stdin-${lang}`, original.stdin);
    clearOut();
  });

  setLang(lang, true);
  if (fromLink.code) { store.set(`bb-pg-code-${lang}`, fromLink.code); store.set(`bb-pg-stdin-${lang}`, fromLink.stdin); }
  if (!/Mac|iPhone|iPad/.test(navigator.platform)) document.querySelectorAll('.kbd-run').forEach(k => { k.textContent = 'Ctrl ↵'; });
  else document.querySelectorAll('.kbd-run').forEach(k => { k.textContent = '⌘ ↵'; });
  cm.focus();
})();
