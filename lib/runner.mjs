// Compiles and runs every `run` code block at build time so each printed
// output on the site is the real output. Results are cached by content hash.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';

// Echo each stdin line into stdout (wrapped in \x01..\x02) the moment the
// program starts reading it, like a terminal does, so outputs read as a real
// session ("Enter n: 5"). Hooks the stdin FILE's read function: macOS only.
const C_SHIM = `#include <stdio.h>
#include <unistd.h>
static char bb_line[4096];
static int bb_len = 0, bb_pos = 0, bb_eof = 0;
static int bb_read(void *cookie, char *buf, int n) {
  (void)cookie;
  if (n <= 0) return 0;
  if (bb_pos >= bb_len) {
    char c;
    if (bb_eof) return 0;
    bb_len = bb_pos = 0;
    while (bb_len < (int)sizeof bb_line) {
      if (read(0, &c, 1) != 1) { bb_eof = 1; break; }
      bb_line[bb_len++] = c;
      if (c == '\\n') break;
    }
    if (bb_len == 0) return 0;
    fflush(stdout);
    write(1, "\\x01", 1);
    write(1, bb_line, bb_line[bb_len - 1] == '\\n' ? bb_len - 1 : bb_len);
    write(1, "\\x02\\n", 2);
  }
  buf[0] = bb_line[bb_pos++];
  return 1;
}
__attribute__((constructor)) static void bb_init(void) {
  setvbuf(stdin, NULL, _IONBF, 0);
  stdin->_read = bb_read;
}
`;

const PY_SHIM = `import builtins, sys
def _bb_input(prompt=''):
    sys.stdout.write(str(prompt))
    sys.stdout.flush()
    line = sys.stdin.readline()
    if not line:
        raise EOFError('EOF when reading a line')
    line = line.rstrip('\\n')
    sys.stdout.write('\\x01' + line + '\\x02\\n')
    sys.stdout.flush()
    return line
builtins.input = _bb_input
`;

export const runKey = (lang, code, stdin, aux) =>
  crypto.createHash('sha1').update(JSON.stringify([lang, code, stdin, aux, 5])).digest('hex').slice(0, 20);

function sh(cmd, args, { cwd, input = '', timeout = 20000, env } = {}) {
  return new Promise(resolve => {
    const child = spawn(cmd, args, { cwd, env: env || process.env });
    let out = '', err = '', timedOut = false;
    const t = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, timeout);
    child.stdout.on('data', d => { if (out.length < 200000) out += d; });
    child.stderr.on('data', d => { if (err.length < 200000) err += d; });
    child.on('error', e => { err += String(e); });
    child.on('close', code => { clearTimeout(t); resolve({ code, out, err, timedOut }); });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}

export class Runner {
  constructor(cacheFile) {
    this.cacheFile = cacheFile;
    this.cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};
    this.used = new Set();
    fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
    this.shimObj = path.join(path.dirname(cacheFile), 'bb_echo.o');
  }

  async prepare() {
    const src = path.join(path.dirname(this.cacheFile), 'bb_echo.c');
    if (!fs.existsSync(this.shimObj) || fs.readFileSync(src, 'utf8') !== C_SHIM) {
      fs.writeFileSync(src, C_SHIM);
      const r = await sh('cc', ['-c', '-O1', '-o', this.shimObj, src]);
      if (r.code !== 0) throw new Error(`Could not build stdin shim:\n${r.err}`);
    }
  }

  async exec({ lang, code, stdin, aux }) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bytebook-'));
    try {
      for (const [name, text] of Object.entries(aux || {})) fs.writeFileSync(path.join(dir, name), text);
      if (lang === 'c' || lang === 'cpp') {
        const file = lang === 'c' ? 'main.c' : 'main.cpp';
        fs.writeFileSync(path.join(dir, file), code);
        const [cc, std] = lang === 'c' ? ['cc', '-std=c17'] : ['c++', '-std=c++17'];
        const flags = [std, '-Wall', '-Wextra', '-Wno-unused-parameter', '-o', 'prog', file, this.shimObj];
        if (lang === 'c') flags.push('-lm');
        const b = await sh(cc, flags, { cwd: dir, timeout: 60000 });
        if (b.code !== 0) return { phase: 'compile', code: b.code, out: '', err: b.err.replaceAll(dir + '/', '') };
        const r = await sh(path.join(dir, 'prog'), [], { cwd: dir, input: stdin, timeout: 25000 });
        return { phase: 'run', code: r.code, out: r.out, err: r.err, warn: b.err.replaceAll(dir + '/', '').trim(), timedOut: r.timedOut };
      }
      if (lang === 'python') {
        fs.writeFileSync(path.join(dir, 'main.py'), code);
        fs.writeFileSync(path.join(dir, 'sitecustomize.py'), PY_SHIM);
        const env = { ...process.env, PYTHONPATH: dir, PYTHONIOENCODING: 'utf-8', PYTHONHASHSEED: '0', PYTHONDONTWRITEBYTECODE: '1' };
        const r = await sh('python3', ['main.py'], { cwd: dir, input: stdin, timeout: 10000, env });
        const real = fs.realpathSync(dir);          // macOS reports /private/var/... for /var/...
        const clean = s => s.replaceAll(real + '/', '').replaceAll(dir + '/', '');
        return { phase: 'run', code: r.code, out: clean(r.out), err: clean(r.err), timedOut: r.timedOut };
      }
      if (lang === 'js') {
        fs.writeFileSync(path.join(dir, 'main.js'), code);
        const r = await sh('node', ['main.js'], { cwd: dir, input: stdin, timeout: 10000 });
        const real = fs.realpathSync(dir);
        const clean = s => s.replaceAll(real + '/', '').replaceAll(dir + '/', '');
        return { phase: 'run', code: r.code, out: clean(r.out), err: clean(r.err), timedOut: r.timedOut };
      }
      throw new Error(`Cannot run language "${lang}"`);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  // jobs: [{key, lang, code, stdin, aux, where}]
  async runAll(jobs, concurrency = Math.max(2, Math.min(6, os.cpus().length))) {
    await this.prepare();
    const todo = [];
    const seen = new Set();
    for (const j of jobs) {
      this.used.add(j.key);
      if (!this.cache[j.key] && !seen.has(j.key)) { seen.add(j.key); todo.push(j); }
    }
    let i = 0, done = 0;
    const work = async () => {
      while (i < todo.length) {
        const j = todo[i++];
        this.cache[j.key] = await this.exec(j);
        done++;
        if (done % 10 === 0 || done === todo.length) process.stdout.write(`\r  ran ${done}/${todo.length} new examples`);
      }
    };
    await Promise.all(Array.from({ length: concurrency }, work));
    if (todo.length) process.stdout.write('\n');
    const keep = {};
    for (const k of this.used) if (this.cache[k] && !this.cache[k].timedOut) keep[k] = this.cache[k];
    fs.writeFileSync(this.cacheFile, JSON.stringify(keep));
    return this.cache;
  }

  get(key) { return this.cache[key]; }
}
