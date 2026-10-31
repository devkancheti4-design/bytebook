// Bytebook core: theme, navigation drawer, copy buttons, table of contents,
// progress tracking, quizzes and search. No dependencies.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ROOT = document.querySelector('meta[name="bb-root"]')?.content || './';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  // ---------------------------------------------------------------- theme
  const effectiveTheme = () => document.documentElement.getAttribute('data-theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  $('.theme-toggle')?.addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('bb-theme', next); } catch { /* ignore */ }
    document.dispatchEvent(new CustomEvent('bb:theme', { detail: next }));
  });

  // ---------------------------------------------------------------- nav drawer (mobile)
  const navBtn = $('.nav-toggle');
  const setNav = open => {
    document.body.classList.toggle('nav-open', open);
    navBtn?.setAttribute('aria-expanded', String(open));
    if (open) $('#sidebar a.current')?.scrollIntoView({ block: 'center' });
  };
  navBtn?.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  $('.side-close')?.addEventListener('click', () => setNav(false));
  $('[data-close-nav]')?.addEventListener('click', () => setNav(false));
  addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });
  // keep the current lesson visible in the desktop sidebar
  const cur = $('#sidebar a.current');
  if (cur && innerWidth > 960) { const sb = $('#sidebar'); sb.scrollTop = cur.offsetTop - sb.clientHeight / 2 + 40; }

  // ---------------------------------------------------------------- copy buttons
  document.addEventListener('click', async e => {
    const btn = e.target.closest('.code-copy');
    if (!btn) return;
    const code = btn.closest('.code').querySelector('pre code').innerText;
    try { await navigator.clipboard.writeText(code); } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: code });
      document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    const label = btn.querySelector('span');
    btn.classList.add('copied'); label.textContent = 'Copied';
    setTimeout(() => { btn.classList.remove('copied'); label.textContent = 'Copy'; }, 1600);
  });

  // ---------------------------------------------------------------- reading progress + toc scrollspy
  const bar = $('.read-progress span');
  const article = $('.lesson, .book');
  const tocLinks = $$('.toc a');
  const heads = tocLinks.map(a => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    if (bar && article) {
      const r = article.getBoundingClientRect();
      const total = r.height - innerHeight * 0.6;
      bar.style.width = `${Math.min(100, Math.max(0, (-r.top / Math.max(total, 1)) * 100))}%`;
    }
    if (heads.length) {
      const y = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 10;
      let active = heads[0];
      for (const h of heads) if (h.getBoundingClientRect().top <= y) active = h;
      tocLinks.forEach(a => a.classList.toggle('active', a.hash.slice(1) === active.id));
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ---------------------------------------------------------------- progress
  const P = store.get('bb-progress', { done: {}, quiz: {}, last: null });
  P.done ||= {}; P.quiz ||= {};
  const save = () => store.set('bb-progress', P);
  const courseDone = course => Object.keys(P.done).filter(id => id.startsWith(course + '/')).length;

  const lessonEl = $('.lesson[data-lesson]');
  if (lessonEl) {
    const id = lessonEl.dataset.lesson;
    P.last = { id, url: id + '/', title: lessonEl.dataset.title, course: lessonEl.dataset.courseTitle, t: Date.now() };
    save();
  }

  function paintProgress() {
    $$('a[data-lesson]').forEach(a => a.classList.toggle('done', !!P.done[a.dataset.lesson]));
    $$('.side-progress').forEach(el => {
      const n = courseDone(el.dataset.course), total = +el.dataset.total;
      el.querySelector('.bar span').style.width = `${(n / total) * 100}%`;
      el.querySelector('.done-count').textContent = n;
    });
    $$('.complete-btn').forEach(b => {
      const done = !!P.done[b.dataset.lesson];
      b.classList.toggle('is-done', done);
      b.querySelector('.cb-text').textContent = done ? 'Completed — nice work' : 'Mark lesson as complete';
    });
    $$('.ring-card').forEach(el => {
      const pct = Math.round((courseDone(el.dataset.course) / +el.dataset.total) * 100);
      el.querySelector('.ring-fg').setAttribute('stroke-dasharray', `${pct} 100`);
      el.querySelector('.ring-pct').textContent = `${pct}%`;
    });
    $$('.course-card').forEach(el => {
      const n = courseDone(el.dataset.course), total = +el.dataset.total;
      el.querySelector('.bar span').style.width = `${(n / total) * 100}%`;
      el.querySelector('small').textContent = n === 0 ? 'Not started' : n === total ? 'Completed ✓' : `${n} of ${total} lessons done`;
    });
    // "Start reading" → first unfinished lesson
    $$('[data-continue]').forEach(btn => {
      const links = $$(`.unit-lessons a[data-lesson^="${btn.dataset.continue}/"]`);
      const next = links.find(a => !P.done[a.dataset.lesson]);
      if (courseDone(btn.dataset.continue) > 0 && next) {
        btn.href = next.href; btn.querySelector('span').textContent = 'Continue reading';
      }
    });
    const last = P.last;
    const cont = $('.continue');
    if (cont && last) {
      cont.hidden = false;
      const card = $('.continue-card', cont);
      card.href = ROOT + last.url;
      card.dataset.c = last.id.split('/')[0];
      $('.cc-title', cont).textContent = last.title;
      $('.cc-course', cont).textContent = last.course;
      const any = $('[data-continue-any]');
      if (any) { any.href = ROOT + last.url; any.querySelector('span').textContent = 'Continue reading'; }
    }
  }
  $$('.complete-btn').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.lesson;
    if (P.done[id]) delete P.done[id]; else P.done[id] = Date.now();
    save(); paintProgress();
  }));
  paintProgress();
  addEventListener('storage', e => { if (e.key === 'bb-progress') { Object.assign(P, store.get('bb-progress', P)); paintProgress(); } });

  // ---------------------------------------------------------------- quizzes
  $$('.quiz').forEach(quiz => {
    const id = quiz.dataset.quiz, total = +quiz.dataset.total;
    const scoreEl = $('.quiz-score', quiz), foot = $('.quiz-foot', quiz);
    let answered = 0, right = 0;
    const best = P.quiz[id];
    if (best) { scoreEl.hidden = false; scoreEl.textContent = `Best: ${best[0]}/${best[1]}`; }
    const finish = () => {
      foot.hidden = false;
      const msg = right === total ? 'Perfect score! You have this chapter down.' : right >= total * 0.6 ? 'Solid. Re-read the parts you missed, then try again.' : 'Worth another read — the explanations above show where it went wrong.';
      $('.quiz-result', quiz).textContent = `You scored ${right} of ${total}. ${msg}`;
      const prev = P.quiz[id];
      if (!prev || right > prev[0]) P.quiz[id] = [right, total];
      if (right === total && !P.done[id]) P.done[id] = Date.now();
      save(); paintProgress();
      scoreEl.hidden = false; scoreEl.textContent = `Best: ${P.quiz[id][0]}/${total}`;
    };
    $$('.q', quiz).forEach(q => {
      const answer = +q.dataset.answer;
      $$('.q-opt', q).forEach(btn => btn.addEventListener('click', () => {
        const pick = +btn.dataset.i, ok = pick === answer;
        $$('.q-opt', q).forEach((b, i) => {
          b.disabled = true;
          if (i === answer) b.classList.add('right');
          else if (i === pick) b.classList.add('wrong');
          else b.classList.add('faded');
        });
        const why = $('.q-why', q);
        why.hidden = false;
        why.insertAdjacentHTML('afterbegin', `<span class="verdict ${ok ? 'ok' : 'no'}">${ok ? 'Correct.' : 'Not quite.'}</span>`);
        answered++; if (ok) right++;
        if (answered === total) finish();
      }));
    });
    $('.quiz-reset', quiz)?.addEventListener('click', () => {
      answered = 0; right = 0; foot.hidden = true;
      $$('.q-opt', quiz).forEach(b => { b.disabled = false; b.classList.remove('right', 'wrong', 'faded'); });
      $$('.q-why', quiz).forEach(w => { w.hidden = true; w.querySelector('.verdict')?.remove(); });
      quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---------------------------------------------------------------- ebook print
  $('.print-btn')?.addEventListener('click', () => print());

  // ---------------------------------------------------------------- search
  const dlg = $('#search'), input = $('#search-input'), list = $('#search-results');
  let index = null, results = [], sel = 0;
  const loadIndex = () => new Promise(res => {
    if (window.BB_INDEX) return res(window.BB_INDEX);
    const s = document.createElement('script');
    s.src = $('link[href*="site.css"]').href.replace(/site\.css\?v=.*/, 'search-index.js');
    s.onload = () => res(window.BB_INDEX || []);
    s.onerror = () => res([]);
    document.head.append(s);
  });
  const escHtml = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mark = (text, terms) => {
    let html = escHtml(text);
    for (const t of terms) if (t.length > 1) html = html.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
    return html;
  };
  function score(e, terms) {
    const t = e.tl, x = e.xl, s = e.sl;
    let total = 0;
    for (const term of terms) {
      let v = 0;
      if (t === term) v = 120;
      else if (t.startsWith(term)) v = 70;
      else if (t.includes(' ' + term) || t.includes('-' + term)) v = 50;
      else if (t.includes(term)) v = 34;
      else if (s.includes(term)) v = 14;
      else if (x.includes(term)) v = 8;
      else return 0;
      total += v;
    }
    return total + (e.k === 'l' ? 6 : 0);
  }
  function snippet(x, terms) {
    if (!x) return '';
    const lx = x.toLowerCase();
    const at = Math.max(0, Math.min(...terms.map(t => { const i = lx.indexOf(t); return i < 0 ? Infinity : i; })));
    const start = Number.isFinite(at) ? Math.max(0, at - 40) : 0;
    return (start > 0 ? '…' : '') + x.slice(start, start + 150);
  }
  function render(q) {
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      const last = P.last;
      results = [];
      let html = '';
      if (last) {
        results.push({ u: last.url, t: last.title, s: last.course, c: last.id.split('/')[0], x: '' });
        html += `<li class="group">Continue</li>`;
      }
      html += results.map((r, i) => item(r, [], i)).join('');
      html += `<li class="group">Subjects</li>`;
      $$('.course-strip a').forEach(a => {
        results.push({ href: a.href, t: a.textContent.trim(), s: 'Subject overview', c: a.dataset.c, x: '' });
        html += item(results.at(-1), [], results.length - 1);
      });
      list.innerHTML = html; sel = 0; highlight();
      $('.search-count').textContent = index ? `${index.length} topics indexed` : '';
      return;
    }
    results = index.map(e => [score(e, terms), e]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).slice(0, 40).map(([, e]) => e);
    list.innerHTML = results.length ? results.map((r, i) => item(r, terms, i)).join('') : `<li class="empty">No matches for “${escHtml(q)}”. Try a shorter word.</li>`;
    $('.search-count').textContent = results.length ? `${results.length} result${results.length > 1 ? 's' : ''}` : '';
    sel = 0; highlight();
  }
  const item = (r, terms, i) => `<li role="option" data-i="${i}"><a href="${r.href || ROOT + r.u}" data-c="${r.c}"><span class="dot"></span><span class="r-t">${mark(r.t, terms)}</span><span class="r-s">${escHtml(r.s)}</span>${r.x ? `<span class="r-x">${mark(snippet(r.x, terms), terms)}</span>` : ''}</a></li>`;
  function highlight() {
    $$('li[role="option"]', list).forEach(li => li.classList.toggle('sel', +li.dataset.i === sel));
    $('li.sel', list)?.scrollIntoView({ block: 'nearest' });
  }
  async function openSearch() {
    if (!dlg || dlg.open) return;
    dlg.showModal();
    input.value = '';
    if (!index) {
      index = (await loadIndex()).map(e => ({ ...e, tl: e.t.toLowerCase(), xl: (e.x || '').toLowerCase(), sl: e.s.toLowerCase() }));
    }
    render('');
    input.focus();
  }
  $$('.search-trigger, .search-trigger-alt').forEach(b => b.addEventListener('click', openSearch));
  input?.addEventListener('input', () => index && render(input.value));
  input?.addEventListener('keydown', e => {
    const n = $$('li[role="option"]', list).length;
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(n - 1, sel + 1); highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); highlight(); }
    else if (e.key === 'Enter') { const a = $('li.sel a', list); if (a) { e.preventDefault(); location.href = a.href; dlg.close(); } }
  });
  dlg?.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  list?.addEventListener('click', e => { if (e.target.closest('a')) dlg.close(); });
  addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable || document.activeElement?.closest?.('.CodeMirror');
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); }
    else if (e.key === '/' && !typing) { e.preventDefault(); openSearch(); }
  });
  if (!/Mac|iPhone|iPad/.test(navigator.platform)) $$('.kbd-mod').forEach(k => { k.textContent = 'Ctrl K'; });
})();
