// Bytebook static site generator: content/**/*.md → docs/
// Usage: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Marked, Renderer } from 'marked';
import hljs from 'highlight.js';
import { diagram, params } from './lib/diagrams.mjs';
import { Runner, runKey } from './lib/runner.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(ROOT, 'content');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'docs');
const SITE = {
  name: 'Bytebook',
  desc: 'A free interactive ebook for Kalvium semesters 1–3: C, Data Structures, C++ OOP, Python, Discrete Mathematics, Algorithms and the first-year foundations, with runnable examples, visualizers and quizzes.',
};

const read = f => fs.readFileSync(f, 'utf8');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const slugify = s => strip(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
const hash = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);
const b64 = s => Buffer.from(s, 'utf8').toString('base64url');
const problems = [], warnings = [];

// ---------------------------------------------------------------- icons
const I = (d, fill) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'}>${d}</svg>`;
const ICON = {
  search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  play: I('<path d="M7 4.8v14.4a.8.8 0 0 0 1.2.7l11.3-7.2a.8.8 0 0 0 0-1.4L8.2 4.1A.8.8 0 0 0 7 4.8z"/>', true),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>'),
  moon: I('<path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7z"/>'),
  menu: I('<path d="M4 7h16M4 12h16M4 17h10"/>'),
  close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  check: I('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  left: I('<path d="M19 12H5m6-6-6 6 6 6"/>'),
  right: I('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  code: I('<path d="m8 8-5 4 5 4m8-8 5 4-5 4M14 4l-4 16"/>'),
  quiz: I('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>'),
  book: I('<path d="M2.5 5.5h6a3.5 3.5 0 0 1 3.5 3.5v10.5a2.8 2.8 0 0 0-2.8-2.8H2.5zM21.5 5.5h-6A3.5 3.5 0 0 0 12 9v10.5a2.8 2.8 0 0 1 2.8-2.8h6.7z"/>'),
  info: I('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/>'),
  tip: I('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>'),
  warn: I('<path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9.5v4M12 17.2v.1"/>'),
  exam: I('<path d="m2 9 10-5 10 5-10 5zM6 11.2V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.8M22 9v5"/>'),
  mistake: I('<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>'),
  key: I('<path d="M12 3.5 14.4 8.4l5.4.8-3.9 3.8.9 5.4L12 15.9l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"/>'),
  def: I('<path d="M6 3.5h12v17l-6-4-6 4z"/>'),
  terminal: I('<path d="m5 16.5 5-4.5-5-4.5M12.5 17h6.5"/>'),
  layers: I('<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5"/>'),
  spark: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
  print: I('<path d="M7 8V3.5h10V8M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M7 14h10v6.5H7z"/>'),
  chart: I('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  copy: I('<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5"/>'),
};
const LOGO = `<svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#D7A43F"/><rect x=".75" y=".75" width="30.5" height="30.5" rx="8.25" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/><path d="M6.5 10.2c3.2-1.4 6.3-1.3 9.5.7 3.2-2 6.3-2.1 9.5-.7v12.3c-3.2-1.4-6.3-1.3-9.5.7-3.2-2-6.3-2.1-9.5-.7z" fill="#1C1508" fill-opacity=".1" stroke="#1C1508" stroke-width="1.9" stroke-linejoin="round"/><path d="M16 10.9v12.3" stroke="#1C1508" stroke-width="1.9"/><path d="m10.4 14.6-1.6 1.5 1.6 1.5M21.6 14.6l1.6 1.5-1.6 1.5" fill="none" stroke="#1C1508" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// ---------------------------------------------------------------- content
const courses = JSON.parse(read(path.join(CONTENT, 'courses.json')));
const lessonById = new Map();
for (const course of courses) {
  course.lessons = [];
  const dir = path.join(CONTENT, course.id);
  let unit = 'Lessons';
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort() : [];
  for (const f of files) {
    const text = read(path.join(dir, f)).replace(/\r\n/g, '\n');
    for (const part of text.split(/^=== /m).slice(1)) {
      const nl = part.indexOf('\n');
      const [slug, title] = part.slice(0, nl).split('|').map(s => s.trim());
      let body = part.slice(nl + 1), m;
      const meta = {};
      while ((m = body.match(/^(desc|unit):[ \t]*(.*)\n/))) { meta[m[1]] = m[2].trim(); body = body.slice(m[0].length); }
      if (meta.unit) unit = meta.unit;
      const id = `${course.id}/${slug}`;
      if (lessonById.has(id)) throw new Error(`Duplicate lesson ${id}`);
      const lesson = { id, slug, title, desc: meta.desc || '', unit, body, course, file: f };
      course.lessons.push(lesson);
      lessonById.set(id, lesson);
    }
  }
  course.lessons.forEach((l, i) => { l.index = i; l.prev = course.lessons[i - 1]; l.next = course.lessons[i + 1]; });
  course.units = [];
  for (const l of course.lessons) {
    if (course.units.at(-1)?.title !== l.unit) course.units.push({ title: l.unit, lessons: [] });
    course.units.at(-1).lessons.push(l);
  }
}
courses.forEach((c, i) => { c.nextCourse = courses[(i + 1) % courses.length]; });

// ---------------------------------------------------------------- markdown
const LANGS = {
  c: { hl: 'c', label: 'C', run: 'c' }, h: { hl: 'c', label: 'C header' },
  cpp: { hl: 'cpp', label: 'C++', run: 'cpp' },
  python: { hl: 'python', label: 'Python', run: 'python' }, py: { hl: 'python', label: 'Python', run: 'python' },
  pycon: { hl: 'python', label: 'Python shell' },
  bash: { hl: 'bash', label: 'Terminal' }, sh: { hl: 'bash', label: 'Terminal' },
  js: { hl: 'javascript', label: 'JavaScript', run: 'js' }, javascript: { hl: 'javascript', label: 'JavaScript', run: 'js' },
  html: { hl: 'xml', label: 'HTML' }, css: { hl: 'css', label: 'CSS' }, json: { hl: 'json', label: 'JSON' },
  sql: { hl: 'sql', label: 'SQL' }, text: { hl: null, label: 'Text' }, pseudo: { hl: null, label: 'Pseudocode' },
  math: { hl: null, label: 'Math' }, git: { hl: 'bash', label: 'Terminal' },
};
const CALLOUTS = {
  note: ['Note', 'info'], tip: ['Tip', 'tip'], warn: ['Watch out', 'warn'], exam: ['Exam tip', 'exam'],
  mistake: ['Common mistake', 'mistake'], key: ['Key takeaways', 'key'], def: ['Definition', 'def'],
  info: ['Good to know', 'info'], try: ['Try this', 'code'],
};

let ctx = null;
let runner = null;

function parseInfo(info = '') {
  const m = info.trim().match(/^(\S*)\s*(.*)$/s) || [];
  const lang = (m[1] || 'text').toLowerCase();
  const attrs = {};
  const re = /([a-z]+)(?:="((?:[^"\\]|\\.)*)")?/g;
  let mm;
  while ((mm = re.exec(m[2] || ''))) attrs[mm[1]] = mm[2] === undefined ? true : mm[2].replace(/\\(n|"|\\)/g, (_, c) => (c === 'n' ? '\n' : c));
  return { lang, attrs };
}
const normStdin = s => (s ? (s.endsWith('\n') ? s : s + '\n') : '');
const jobOf = (lang, code, attrs, aux) => {
  const stdin = normStdin(attrs.stdin);
  return { key: runKey(lang, code + '\n', stdin, aux), lang, code: code + '\n', stdin, aux };
};

function renderOutput(r, attrs, where) {
  if (!r) { problems.push(`${where}: example was not run`); return ''; }
  if (r.phase === 'compile') {
    problems.push(`${where}: COMPILE ERROR\n${r.err}`);
    return `<div class="code-out bad"><div class="out-head">Compile error</div><pre>${esc(r.err)}</pre></div>`;
  }
  if (r.warn) warnings.push(`${where}: compiler warning\n${r.warn}`);
  if (r.timedOut) problems.push(`${where}: timed out`);
  if (r.code !== 0 && !attrs.error) problems.push(`${where}: exited with code ${r.code}\n${r.err}`);
  if (attrs.error && r.code === 0) warnings.push(`${where}: marked "error" but exited normally`);
  if (r.err && !attrs.error && r.code === 0) warnings.push(`${where}: wrote to stderr\n${r.err}`);
  const fmt = s => esc(s).replace(/\x02\x01/g, '').replace(/\x01([^\x02]*)\x02/g, '<span class="in">$1</span>');
  let html = fmt(r.out.replace(/\s+$/, ''));
  if (r.err.trim()) html += (html ? '\n' : '') + `<span class="stderr">${fmt(r.err.replace(/\s+$/, ''))}</span>`;
  const label = attrs.vary ? 'Output <em>· yours may differ</em>' : 'Output';
  return `<div class="code-out"><div class="out-head">${ICON.terminal}<span>${label}</span></div><pre>${html || '<span class="none">(no output)</span>'}</pre></div>`;
}

function renderCode(token) {
  const { lang, attrs } = parseInfo(token.lang);
  const code = token.text.replace(/\s+$/, '');
  if (lang === 'output') {
    return `<div class="code code-plain"><div class="code-out"><div class="out-head">${ICON.terminal}<span>${esc(attrs.title || 'Output')}</span></div><pre>${esc(code)}</pre></div></div>`;
  }
  const def = LANGS[lang] || { hl: hljs.getLanguage(lang) ? lang : null, label: lang.toUpperCase() };
  let html = esc(code);
  if (def.hl) try { html = hljs.highlight(code, { language: def.hl, ignoreIllegals: true }).value; } catch { /* plain */ }
  if (attrs.aux) ctx.aux[attrs.title] = code + '\n';
  let io = '', foot = '';
  if (attrs.run && def.run) {
    const job = jobOf(def.run, code, attrs, { ...ctx.aux });
    io = renderOutput(runner.get(job.key), attrs, `${ctx.lesson.id} example #${ctx.stats.examples + 1} (line "${code.split('\n').find(l => /\w/.test(l) && !/^\s*(#|\/\/|\/\*|int main|def |import )/.test(l))?.trim().slice(0, 60)}")`);
    if (!Object.keys(ctx.aux).length) {
      const href = `${ctx.root}playground/#lang=${def.run}&code=${b64(code + '\n')}${job.stdin ? `&stdin=${b64(job.stdin)}` : ''}`;
      foot = `<div class="code-foot">${job.stdin ? `<span class="foot-note">Sample input is included</span>` : ''}<a class="tryit" href="${esc(href)}" target="_blank" rel="noopener">Try it Yourself ${ICON.right}</a></div>`;
    }
    ctx.stats.examples++;
  }
  const title = attrs.title ? `<span class="code-title">${esc(attrs.title)}</span>` : '';
  return `<figure class="code${io ? ' has-out' : ''}" data-lang="${esc(lang)}"><div class="code-head"><span class="code-lang">${esc(def.label)}</span>${title}<button class="code-copy" type="button" aria-label="Copy code">${ICON.copy}<span>Copy</span></button></div><pre><code class="hljs">${html}</code></pre>${io}${foot}</figure>\n`;
}

function parseQuiz(body, where) {
  const qs = [];
  let q = null, mode = 'q', fence = false;
  for (const line of body.split('\n')) {
    let m;
    if (/^```/.test(line)) fence = !fence;
    if (!fence && (m = line.match(/^Q[.:]\s*(.*)$/))) { q = { text: m[1], options: [], why: '' }; qs.push(q); mode = 'q'; continue; }
    if (!q) continue;
    if (!fence && mode !== 'why' && (m = line.match(/^([-*])\s+(.*)$/))) { q.options.push({ text: m[2], ok: m[1] === '*' }); mode = 'o'; continue; }
    if (!fence && (m = line.match(/^=\s*(.*)$/))) { q.why = m[1]; mode = 'why'; continue; }
    if (mode === 'q') q.text += '\n' + line;
    else if (mode === 'why' && line.trim()) q.why += ' ' + line.trim();
  }
  for (const [i, x] of qs.entries()) {
    const right = x.options.filter(o => o.ok).length;
    if (right !== 1 || x.options.length < 2) problems.push(`${where}: quiz question ${i + 1} needs exactly one correct (*) option`);
    if (!x.why) warnings.push(`${where}: quiz question ${i + 1} has no explanation`);
  }
  return qs;
}

function renderContainer(t) {
  const { kind, args } = t;
  if (/^:::[a-z]/m.test(t.body)) problems.push(`${ctx.lesson.id}: :::${kind} block contains another ::: block (missing closing :::?)`);
  if (CALLOUTS[kind]) {
    const [label, icon] = CALLOUTS[kind];
    return `<aside class="callout callout-${kind}"><div class="callout-title">${ICON[icon]}<span>${esc(args || label)}</span></div><div class="callout-body">${this.parser.parse(t.tokens)}</div></aside>\n`;
  }
  if (kind === 'cols') {
    const cols = [[]];
    for (const tok of t.tokens) tok.type === 'hr' ? cols.push([]) : cols.at(-1).push(tok);
    return `<div class="cols">${cols.map(c => `<div class="col">${this.parser.parse(c)}</div>`).join('')}</div>\n`;
  }
  if (kind === 'quiz') {
    const qs = parseQuiz(t.body, ctx.lesson.id);
    ctx.stats.quiz += qs.length;
    ctx.toc.push({ depth: 2, id: 'quiz', text: 'Test yourself' });
    const items = qs.map((q, qi) => {
      const opts = q.options.map((o, i) => `<button class="q-opt" type="button" data-i="${i}"><span class="q-key">${'ABCDEFGH'[i]}</span><span class="q-label">${md.parseInline(o.text)}</span></button>`).join('');
      return `<li class="q" data-answer="${q.options.findIndex(o => o.ok)}"><div class="q-text"><span class="q-num">${qi + 1}</span><div class="q-body">${this.parser.parse(md.lexer(q.text.trim()))}</div></div><div class="q-opts">${opts}</div><div class="q-why" hidden>${md.parseInline(q.why)}</div></li>`;
    }).join('');
    return `<section class="quiz" id="quiz" data-quiz="${ctx.lesson.id}" data-total="${qs.length}"><div class="quiz-head">${ICON.quiz}<h2>${esc(args || 'Test yourself')}</h2><span class="quiz-score" hidden></span></div><p class="quiz-sub">${qs.length} questions · pick an answer to check it instantly</p><ol class="quiz-list">${items}</ol><div class="quiz-foot" hidden><p class="quiz-result"></p><button class="quiz-reset" type="button">Try again</button></div></section>\n`;
  }
  if (kind === 'diagram') {
    try {
      const { svg, caption } = diagram(args, t.body);
      return `<figure class="diagram">${svg}${caption ? `<figcaption>${md.parseInline(caption)}</figcaption>` : ''}</figure>\n`;
    } catch (e) { problems.push(`${ctx.lesson.id}: diagram ${args}: ${e.message}`); return ''; }
  }
  if (kind === 'widget') {
    ctx.widgets.add(args);
    const opts = args === 'web-playground' ? {} : params(t.body);
    const body = args === 'web-playground' ? ` data-body="${esc(t.body)}"` : '';
    return `<div class="widget" data-widget="${esc(args)}" data-opts="${esc(JSON.stringify(opts))}"${body}><noscript>This interactive demo needs JavaScript.</noscript></div>\n`;
  }
  problems.push(`${ctx.lesson.id}: unknown block :::${kind}`);
  return '';
}

const md = new Marked({
  gfm: true,
  extensions: [{
    name: 'container', level: 'block',
    start(src) { return src.match(/^:::/m)?.index; },
    tokenizer(src) {
      const m = /^:::([a-z-]+)[ \t]*([^\n]*)\n(?:([\s\S]*?)\n)??:::[ \t]*(?:\n+|$)/.exec(src);
      if (!m) return;
      const body = m[3] || '';
      const token = { type: 'container', raw: m[0], kind: m[1], args: m[2].trim(), body, tokens: [] };
      if (CALLOUTS[m[1]] || m[1] === 'cols') this.lexer.blockTokens(body, token.tokens);
      return token;
    },
    renderer(t) { return renderContainer.call(this, t); },
  }],
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      const text = strip(inner);
      const base = slugify(text);
      let id = base;
      for (let n = 2; ctx.ids.has(id); n++) id = `${base}-${n}`;
      ctx.ids.add(id);
      if (depth >= 2 && depth <= 3) ctx.toc.push({ depth, id, text });
      return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${depth}>\n`;
    },
    code(token) { return renderCode(token); },
    table(token) { return `<div class="table-wrap">${Renderer.prototype.table.call(this, token)}</div>\n`; },
    link(token) {
      let { href } = token;
      if (href.startsWith('@')) {
        const id = href.slice(1).split('#')[0];
        if (!lessonById.has(id) && !courses.some(c => c.id === id)) problems.push(`${ctx.lesson.id}: broken link ${href}`);
        href = `${ctx.root}${href.slice(1).replace(/^([^#]+)/, '$1/')}`;
      }
      const ext = /^https?:/.test(href);
      return `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${this.parser.parseInline(token.tokens)}</a>`;
    },
  },
});

// ---------------------------------------------------------------- run examples
runner = new Runner(path.join(ROOT, '.cache', 'runs.json'));
const jobs = [];
for (const course of courses) for (const lesson of course.lessons) {
  lesson.tokens = md.lexer(lesson.body);
  const aux = {};
  md.walkTokens(lesson.tokens, t => {
    if (t.type !== 'code') return;
    const { lang, attrs } = parseInfo(t.lang);
    const code = t.text.replace(/\s+$/, '');
    if (attrs.aux) aux[attrs.title] = code + '\n';
    const def = LANGS[lang];
    if (attrs.run && def?.run) jobs.push({ ...jobOf(def.run, code, attrs, { ...aux }), where: lesson.id });
  });
}
console.log(`Bytebook: ${courses.reduce((n, c) => n + c.lessons.length, 0)} lessons, ${jobs.length} runnable examples`);
await runner.runAll(jobs);

// ---------------------------------------------------------------- render lessons
const searchIndex = [];
for (const course of courses) for (const lesson of course.lessons) {
  ctx = { lesson, root: '../../', toc: [], ids: new Set(['quiz', 'main']), aux: {}, widgets: new Set(), stats: { examples: 0, quiz: 0 } };
  lesson.html = md.parser(lesson.tokens);
  lesson.toc = ctx.toc;
  lesson.widgets = ctx.widgets;
  lesson.stats = ctx.stats;
  const words = strip(lesson.html).split(/\s+/).length;
  lesson.minutes = Math.max(2, Math.round(words / 190));
  const url = `${course.id}/${lesson.slug}/`;
  searchIndex.push({ k: 'l', t: lesson.title, c: course.id, s: `${course.short} · Lesson ${lesson.index + 1}`, u: url, x: lesson.desc });
  const parts = lesson.html.split(/<h2 id="([^"]+)">/);
  for (let i = 1; i < parts.length; i += 2) {
    const [head, ...rest] = parts[i + 1].split('</h2>');
    const text = strip(rest.join(' ').replace(/<pre[\s\S]*?<\/pre>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ')).replace(/\s+/g, ' ').trim();
    searchIndex.push({ k: 's', t: strip(head.replace(/<a class="anchor"[^>]*>#<\/a>/, '')), c: course.id, s: `${course.short} · ${lesson.title}`, u: `${url}#${parts[i]}`, x: text.slice(0, 220) });
  }
}

// ---------------------------------------------------------------- assets
fs.rmSync(OUT, { recursive: true, force: true });
const write = (rel, data) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };

const courseCss = courses.map(c => `[data-c="${c.id}"]{--c:${c.color};--c-spine:${c.color}}`).join('\n') +
  `\n@media (prefers-color-scheme:dark){${courses.map(c => `:root:not([data-theme="light"]) [data-c="${c.id}"]{--c:${c.dark}}`).join('')}}\n` +
  courses.map(c => `:root[data-theme="dark"] [data-c="${c.id}"]{--c:${c.dark}}`).join('\n') + '\n';
const assets = {
  'site.css': read(path.join(SRC, 'css/site.css')) + '\n' + courseCss,
  'widgets.css': read(path.join(SRC, 'css/widgets.css')),
  'site.js': read(path.join(SRC, 'js/site.js')),
  'widgets.js': read(path.join(SRC, 'js/widgets.js')),
  'playground.js': read(path.join(SRC, 'js/playground.js')),
  'py-worker.js': read(path.join(SRC, 'js/py-worker.js')),
  'search-index.js': `window.BB_INDEX=${JSON.stringify(searchIndex)};\n`,
  'favicon.svg': LOGO.replace('class="logo" ', 'xmlns="http://www.w3.org/2000/svg" '),
};
const cm = p => read(path.join(ROOT, 'node_modules/codemirror', p));
assets['vendor/codemirror.js'] = ['lib/codemirror.js', 'mode/clike/clike.js', 'mode/python/python.js', 'mode/javascript/javascript.js', 'addon/edit/closebrackets.js', 'addon/edit/matchbrackets.js', 'addon/comment/comment.js', 'addon/selection/active-line.js'].map(cm).join('\n;\n');
assets['vendor/codemirror.css'] = cm('lib/codemirror.css');
const V = {};
for (const [name, data] of Object.entries(assets)) { write(`assets/${name}`, data); V[name] = hash(data); }
const asset = (root, name) => `${root}assets/${name}?v=${V[name]}`;

// ---------------------------------------------------------------- templates
const FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
const THEME_BOOT = `try{var t=localStorage.getItem('bb-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

function shell({ title, desc = SITE.desc, root, body, course, cls = '', css = [], js = [] }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="bb-root" content="${root}">
<meta name="theme-color" content="#F8F7F3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0D0E12" media="(prefers-color-scheme: dark)">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<link rel="icon" href="${asset(root, 'favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${asset(root, 'site.css')}">
${css.map(n => `<link rel="stylesheet" href="${asset(root, n)}">`).join('\n')}
<script>${THEME_BOOT}</script>
</head>
<body class="${cls}"${course ? ` data-c="${course.id}"` : ''}>
<a class="skip" href="#main">Skip to content</a>
${topbar(root, course)}
${body}
${footer(root)}
${searchDialog()}
<script src="${asset(root, 'site.js')}" defer></script>
${js.map(n => `<script src="${n.startsWith('http') ? n : asset(root, n)}" defer></script>`).join('\n')}
</body>
</html>
`;
}

function topbar(root, course) {
  return `<header class="topbar">
<div class="topbar-row">
<button class="icon-btn nav-toggle" type="button" aria-label="Open lesson list" aria-controls="sidebar" aria-expanded="false">${ICON.menu}</button>
<a class="brand" href="${root}">${LOGO}<span>Bytebook</span></a>
<button class="search-trigger" type="button" aria-label="Search lessons">${ICON.search}<span>Search lessons…</span><kbd class="kbd-mod">⌘K</kbd></button>
<a class="top-run" href="${root}playground/">${ICON.play}<span>Compiler</span></a>
<button class="icon-btn theme-toggle" type="button" aria-label="Switch colour theme"><span class="t-sun">${ICON.sun}</span><span class="t-moon">${ICON.moon}</span></button>
</div>
<nav class="course-strip" aria-label="Subjects">
${courses.map(c => `<a href="${root}${c.id}/" data-c="${c.id}"${c.id === course?.id ? ' class="active" aria-current="true"' : ''}><span class="dot"></span>${esc(c.short)}</a>`).join('\n')}
</nav>
<div class="read-progress" aria-hidden="true"><span></span></div>
</header>`;
}

function footer(root) {
  return `<footer class="site-footer">
<div class="footer-inner">
<div class="footer-brand"><a class="brand" href="${root}">${LOGO}<span>Bytebook</span></a>
<p>An independent, free study companion for Kalvium students covering semesters 1 to 3. Not affiliated with or endorsed by Kalvium.</p></div>
<nav aria-label="Subjects"><h4>Subjects</h4>${courses.map(c => `<a href="${root}${c.id}/">${esc(c.title)}</a>`).join('')}</nav>
<nav aria-label="Tools"><h4>Tools</h4><a href="${root}playground/">Online compiler (C, C++, Python)</a><button class="link-btn search-trigger-alt" type="button">Search everything</button>${courses.map(c => `<a href="${root}${c.id}/book/">${esc(c.short)} as an ebook</a>`).slice(0, 3).join('')}</nav>
</div>
<p class="footer-small">Examples are compiled and run when the site is built, so every output shown is real. Progress is saved only in this browser.</p>
</footer>`;
}

function searchDialog() {
  return `<dialog class="search" id="search" aria-label="Search">
<div class="search-box">
<div class="search-row">${ICON.search}<input id="search-input" type="search" placeholder="Search every subject — try “pointers” or “dijkstra”" autocomplete="off" spellcheck="false" aria-controls="search-results"><kbd>Esc</kbd></div>
<ul class="search-results" id="search-results" role="listbox"></ul>
<div class="search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span class="search-count"></span></div>
</div>
</dialog>`;
}

const chip = c => `<span class="chip" data-c="${c.id}">${esc(c.code)}</span>`;

function sidebar(course, current, root) {
  return `<aside class="sidebar" id="sidebar" data-c="${course.id}" aria-label="${esc(course.title)} lessons">
<div class="side-top"><button class="icon-btn side-close" type="button" aria-label="Close lesson list">${ICON.close}</button></div>
<a class="side-course" href="${root}${course.id}/">${chip(course)}<strong>${esc(course.title)}</strong></a>
<div class="side-progress" data-course="${course.id}" data-total="${course.lessons.length}"><div class="bar"><span></span></div><small><b class="done-count">0</b> of ${course.lessons.length} lessons complete</small></div>
<nav class="side-nav">
${course.units.map(u => `<div class="side-unit"><h4>${esc(u.title)}</h4><ol>${u.lessons.map(l => `<li><a href="${root}${course.id}/${l.slug}/" data-lesson="${l.id}"${l === current ? ' class="current" aria-current="page"' : ''}><span class="tick" aria-hidden="true"></span><span>${esc(l.title)}</span></a></li>`).join('')}</ol></div>`).join('\n')}
</nav>
<a class="side-book" href="${root}${course.id}/book/">${ICON.book}<span>Read the whole subject as one ebook page</span></a>
</aside>
<div class="scrim" data-close-nav></div>`;
}

function lessonPage(course, l) {
  const root = '../../';
  const toc = l.toc.filter(t => t.depth === 2 || t.depth === 3);
  const pager = (x, dir) => x
    ? `<a class="${dir}" href="${root}${x.course.id}/${x.slug}/" rel="${dir}"><small>${dir === 'prev' ? ICON.left + 'Previous' : 'Next' + ICON.right}</small><strong>${esc(x.title)}</strong></a>`
    : dir === 'next'
      ? `<a class="next" href="${root}${course.nextCourse.id}/"><small>Next subject${ICON.right}</small><strong>${esc(course.nextCourse.title)}</strong></a>`
      : `<a class="prev" href="${root}${course.id}/"><small>${ICON.left}Overview</small><strong>${esc(course.title)}</strong></a>`;
  const body = `<div class="shell">
${sidebar(course, l, root)}
<main class="main" id="main">
<article class="lesson" data-lesson="${l.id}" data-title="${esc(l.title)}" data-course-title="${esc(course.title)}">
<nav class="crumbs" aria-label="Breadcrumb"><a href="${root}">Home</a><span>/</span><a href="${root}${course.id}/">${esc(course.short)}</a><span>/</span><span>Lesson ${l.index + 1} of ${course.lessons.length}</span></nav>
<header class="lesson-head">
<p class="eyebrow">${esc(l.unit)}</p>
<h1>${esc(l.title)}</h1>
${l.desc ? `<p class="lede">${md.parseInline(l.desc)}</p>` : ''}
<div class="meta"><span>${ICON.clock}${l.minutes} min read</span>${l.stats.examples ? `<span>${ICON.code}${l.stats.examples} runnable example${l.stats.examples > 1 ? 's' : ''}</span>` : ''}${l.widgets.size ? `<span>${ICON.spark}Interactive</span>` : ''}${l.stats.quiz ? `<span>${ICON.quiz}${l.stats.quiz}-question quiz</span>` : ''}</div>
</header>
<div class="prose">
${l.html}
</div>
<div class="complete-box"><button class="complete-btn" type="button" data-lesson="${l.id}"><span class="cb-icon">${ICON.check}</span><span class="cb-text">Mark lesson as complete</span></button></div>
<nav class="pager" aria-label="Lesson navigation">${pager(l.prev, 'prev')}${pager(l.next, 'next')}</nav>
</article>
</main>
<aside class="toc" aria-label="On this page"><div class="toc-inner"><p>On this page</p><ul>${toc.map(t => `<li><a class="d${t.depth}" href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ul></div></aside>
</div>`;
  const widgets = l.widgets.size > 0;
  return shell({
    title: `${l.title} · ${course.short} | Bytebook`, desc: l.desc || course.blurb, root, body, course, cls: 'page-lesson',
    css: widgets ? ['widgets.css'] : [], js: widgets ? ['widgets.js'] : [],
  });
}

function coursePage(course) {
  const root = '../';
  const ex = course.lessons.reduce((n, l) => n + l.stats.examples, 0);
  const qz = course.lessons.reduce((n, l) => n + l.stats.quiz, 0);
  const wg = course.lessons.reduce((n, l) => n + l.widgets.size, 0);
  let k = 0;
  const body = `<main id="main" class="course-page">
<section class="course-hero" data-c="${course.id}">
<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="${root}">Home</a><span>/</span><span>${esc(course.short)}</span></nav>
<div class="ch-grid">
<div>
${chip(course)}
<h1>${esc(course.title)}</h1>
<p class="lede">${esc(course.blurb)}</p>
<div class="hero-actions"><a class="btn btn-course" data-continue="${course.id}" href="${root}${course.id}/${course.lessons[0]?.slug}/">${ICON.book}<span>Start reading</span></a><a class="btn btn-ghost" href="${root}${course.id}/book/">${ICON.print}<span>Ebook / PDF view</span></a></div>
</div>
<div class="ring-card" data-course="${course.id}" data-total="${course.lessons.length}">
<svg class="ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" pathLength="100" stroke-dasharray="0 100"/></svg>
<div class="ring-label"><b class="ring-pct">0%</b><small>complete</small></div>
<dl class="stats"><div><dt>Lessons</dt><dd>${course.lessons.length}</dd></div><div><dt>Runnable examples</dt><dd>${ex}</dd></div><div><dt>Quiz questions</dt><dd>${qz}</dd></div>${wg ? `<div><dt>Visualizers</dt><dd>${wg}</dd></div>` : ''}</dl>
</div>
</div>
</div>
</section>
<section class="wrap syllabus" data-c="${course.id}">
${course.learn?.length ? `<div class="learn-card"><h2>What you will be able to do</h2><ul class="learn">${course.learn.map(x => `<li>${ICON.check}<span>${md.parseInline(x)}</span></li>`).join('')}</ul></div>` : ''}
<h2 class="syl-title">Syllabus</h2>
${course.units.map((u, ui) => `<div class="unit"><h3><span>Unit ${ui + 1}</span>${esc(u.title)}</h3><ol class="unit-lessons">${u.lessons.map(l => `<li><a href="${root}${course.id}/${l.slug}/" data-lesson="${l.id}"><span class="num">${++k}</span><span class="ul-text"><strong>${esc(l.title)}</strong><small>${md.parseInline(l.desc)}</small></span><span class="ul-meta">${l.minutes} min</span><span class="tick" aria-hidden="true"></span></a></li>`).join('')}</ol></div>`).join('\n')}
</section>
</main>`;
  return shell({ title: `${course.title} — free interactive ebook | Bytebook`, desc: course.blurb, root, body, course, cls: 'page-course' });
}

function bookPage(course) {
  const root = '../../';
  const chapters = course.lessons.map(l => {
    const p = `${l.slug}--`;
    const html = l.html
      .replace(/<section class="quiz"[\s\S]*?<\/section>\n?/g, '')
      .replace(/(<h[1-6]) id="([^"]+)"/g, `$1 id="${p}$2"`)
      .replace(/href="#([^"]+)"/g, `href="#${p}$1"`);
    return `<section class="chapter" id="${l.slug}"><p class="eyebrow">Chapter ${l.index + 1} · ${esc(l.unit)}</p><h1>${esc(l.title)}</h1>${l.desc ? `<p class="lede">${md.parseInline(l.desc)}</p>` : ''}<div class="prose">${html}</div></section>`;
  }).join('\n');
  const widgets = course.lessons.some(l => l.widgets.size);
  const body = `<main id="main" class="book" data-c="${course.id}">
<section class="book-cover">
<p class="eyebrow">Bytebook · ${esc(course.code)}</p>
<h1>${esc(course.title)}</h1>
<p class="lede">${esc(course.blurb)}</p>
<div class="hero-actions no-print"><button class="btn btn-course print-btn" type="button">${ICON.print}<span>Print or save as PDF</span></button><a class="btn btn-ghost" href="${root}${course.id}/">${ICON.left}<span>Back to lessons</span></a></div>
<nav class="book-toc" aria-label="Contents"><h2>Contents</h2><ol>${course.lessons.map(l => `<li><a href="#${l.slug}">${esc(l.title)}</a></li>`).join('')}</ol></nav>
</section>
${chapters}
</main>`;
  return shell({ title: `${course.title} (ebook) | Bytebook`, desc: course.blurb, root, body, course, cls: 'page-book', css: widgets ? ['widgets.css'] : [], js: widgets ? ['widgets.js'] : [] });
}

function homePage() {
  const root = './';
  const all = courses.flatMap(c => c.lessons);
  const ex = all.reduce((n, l) => n + l.stats.examples, 0);
  const qz = all.reduce((n, l) => n + l.stats.quiz, 0);
  const wg = new Set(all.flatMap(l => [...l.widgets])).size;
  const heights = [94, 82, 100, 88, 76, 97, 85];
  const body = `<main id="main" class="home">
<section class="hero">
<div class="wrap hero-grid">
<div class="hero-copy">
<p class="eyebrow">For Kalvium students · Semesters 1–3</p>
<h1>Every CS subject you study, as one <em>living</em> textbook.</h1>
<p class="lede">C, Data Structures, C++ OOP, Python, Discrete Maths, Algorithms and the first-year foundations. Short lessons in plain English, examples you can run, visualizers you can poke, and a quiz at the end of every chapter.</p>
<div class="hero-actions"><a class="btn btn-ink" data-continue-any href="${root}${courses[0].id}/${courses[0].lessons[0]?.slug}/">${ICON.book}<span>Start reading</span></a><a class="btn btn-ghost" href="${root}playground/">${ICON.play}<span>Open the compiler</span></a></div>
<dl class="hero-stats"><div><dt>lessons</dt><dd>${all.length}</dd></div><div><dt>runnable examples</dt><dd>${ex}</dd></div><div><dt>quiz questions</dt><dd>${qz}</dd></div><div><dt>visualizers</dt><dd>${wg}</dd></div></dl>
</div>
<div class="shelf-wrap" aria-label="Subjects shelf">
<div class="shelf">${courses.map((c, i) => `<a class="spine" data-c="${c.id}" href="${root}${c.id}/" style="--h:${heights[i % heights.length]}%"><span class="sp-code">${esc(c.code)}</span><span class="sp-title">${esc(c.short)}</span><span class="sp-band"></span></a>`).join('')}</div>
<div class="shelf-board"></div>
</div>
</div>
</section>
<section class="wrap continue" hidden>
<a class="continue-card" href="#"><span class="cc-label">Pick up where you left off</span><strong class="cc-title"></strong><small class="cc-course"></small>${ICON.right}</a>
</section>
<section class="wrap subjects">
<div class="section-head"><h2>Choose a subject</h2><p>Each subject is a complete course: units, lessons, runnable code and a quiz per chapter.</p></div>
<div class="course-grid">
${courses.map(c => `<a class="course-card" data-c="${c.id}" href="${root}${c.id}/" data-course="${c.id}" data-total="${c.lessons.length}">
<div class="cc-top">${chip(c)}<span>${c.lessons.length} lessons</span></div>
<h3>${esc(c.title)}</h3>
<p>${esc(c.blurb)}</p>
<div class="cc-progress"><div class="bar"><span></span></div><small>Not started</small></div>
</a>`).join('\n')}
</div>
</section>
<section class="wrap features">
<div class="section-head"><h2>Built for how you actually study</h2></div>
<div class="feature-grid">
<div class="feature">${ICON.play}<h3>Run every example</h3><p>A real GCC compiler and Python in your browser. Edit any example, add your own input, share a link.</p></div>
<div class="feature">${ICON.spark}<h3>Watch it move</h3><p>Step through sorting, stacks, queues, trees, graphs, hashing, DP tables and truth tables.</p></div>
<div class="feature">${ICON.exam}<h3>Exam tips built in</h3><p>Callouts flag what examiners ask, classic programs, and the mistakes that cost marks.</p></div>
<div class="feature">${ICON.quiz}<h3>Quiz every chapter</h3><p>Instant feedback with an explanation for each answer. Your scores stay in this browser.</p></div>
<div class="feature">${ICON.search}<h3>Find anything fast</h3><p>Press <kbd>Ctrl</kbd> <kbd>K</kbd> or <kbd>/</kbd> to jump to any topic in any subject.</p></div>
<div class="feature">${ICON.print}<h3>Read it as a book</h3><p>Every subject has a single-page ebook view you can read offline or save as a PDF.</p></div>
</div>
</section>
</main>`;
  return shell({ title: 'Bytebook — interactive CS ebook for Kalvium students', root, body, cls: 'page-home' });
}

function playgroundPage() {
  const root = '../';
  const body = `<main id="main" class="pg">
<div class="pg-bar">
<div class="pg-langs" role="tablist" aria-label="Language">
<button type="button" role="tab" data-lang="c">C</button><button type="button" role="tab" data-lang="cpp">C++</button><button type="button" role="tab" data-lang="python">Python</button><button type="button" role="tab" data-lang="js">JavaScript</button>
</div>
<span class="pg-engine" id="pg-engine"></span>
<div class="pg-actions">
<button type="button" class="pg-btn" id="pg-share">${ICON.copy}<span>Copy share link</span></button>
<button type="button" class="pg-btn" id="pg-reset">Reset</button>
<button type="button" class="pg-run" id="pg-run">${ICON.play}<span>Run</span><kbd class="kbd-run">Ctrl ↵</kbd></button>
</div>
</div>
<div class="pg-grid">
<section class="pg-editor"><div class="pg-file"><span id="pg-filename">main.c</span><span class="pg-hint">Edit the code, then press Run</span></div><textarea id="pg-code" spellcheck="false" aria-label="Code editor"></textarea></section>
<section class="pg-side">
<div class="pg-panel pg-in"><label for="pg-stdin">Input <small>— what your program reads with scanf, cin or input()</small></label><textarea id="pg-stdin" spellcheck="false" placeholder="Type input here, one value per line"></textarea></div>
<div class="pg-panel pg-out"><div class="pg-out-head"><span>Output</span><span id="pg-status" class="pg-status"></span></div><pre id="pg-output" aria-live="polite"></pre></div>
</section>
</div>
</main>`;
  return shell({ title: 'Online compiler for C, C++, Python and JavaScript | Bytebook', desc: 'Write, run and share C, C++, Python and JavaScript programs in your browser.', root, body, cls: 'page-pg', css: ['vendor/codemirror.css'], js: ['vendor/codemirror.js', 'playground.js'] });
}

// ---------------------------------------------------------------- write pages
write('index.html', homePage());
write('playground/index.html', playgroundPage());
for (const course of courses) {
  write(`${course.id}/index.html`, coursePage(course));
  write(`${course.id}/book/index.html`, bookPage(course));
  for (const l of course.lessons) write(`${course.id}/${l.slug}/index.html`, lessonPage(course, l));
}
write('404.html', `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Bytebook</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.6 system-ui,sans-serif;background:#F8F7F3;color:#17171B;text-align:center;padding:24px}@media(prefers-color-scheme:dark){body{background:#0D0E12;color:#EDEEF2}}a{color:inherit}h1{font:600 40px/1.1 Georgia,serif;margin:0 0 8px}</style><div><h1>Page not found</h1><p>That page isn’t in the book. <a id="home" href="/">Go to the Bytebook home page</a>.</p></div><script>var s=location.pathname.split('/')[1];if(location.hostname.endsWith('github.io')&&s)document.getElementById('home').href='/'+s+'/';</script>`);
write('.nojekyll', '');

// ---------------------------------------------------------------- report
const total = courses.reduce((n, c) => n + c.lessons.length, 0);
console.log(`Wrote ${total} lessons across ${courses.length} subjects → docs/`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n` + warnings.map(w => '  ⚠ ' + w.replace(/\n/g, '\n    ')).join('\n'));
if (problems.length) { console.log(`\n${problems.length} PROBLEM(S):\n` + problems.map(p => '  ✖ ' + p.replace(/\n/g, '\n    ')).join('\n')); process.exitCode = 1; }
