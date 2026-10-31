// Runs Python with Pyodide inside a module worker, so an infinite loop can be
// stopped by terminating the worker instead of freezing the page.
import { loadPyodide } from 'https://cdn.jsdelivr.net/npm/pyodide@314.0.7/pyodide.mjs';

const ready = loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/npm/pyodide@314.0.7/' })
  .then(py => { postMessage({ type: 'ready' }); return py; })
  .catch(e => { postMessage({ type: 'fatal', text: String(e?.message || e) }); throw e; });

const writer = type => {
  const dec = new TextDecoder();
  return { isatty: true, write: buf => { postMessage({ type, text: dec.decode(buf, { stream: true }) }); return buf.length; } };
};

function cleanTraceback(msg) {
  const lines = String(msg).split('\n');
  const at = lines.findIndex(l => l.includes('File "<exec>"'));
  const kept = at >= 0 ? ['Traceback (most recent call last):', ...lines.slice(at)] : lines;
  return kept.join('\n').replaceAll('File "<exec>"', 'File "main.py"').trim();
}

onmessage = async ({ data: { code, stdin } }) => {
  const py = await ready;
  const lines = stdin.split('\n');
  if (lines.at(-1) === '') lines.pop();
  let next = 0;
  py.setStdout(writer('out'));
  py.setStderr(writer('err'));
  py.setStdin({
    stdin: () => {
      if (next >= lines.length) return null;
      const line = lines[next++];
      postMessage({ type: 'in', text: line });
      return line + '\n';
    },
  });
  const t0 = performance.now();
  try {
    await py.loadPackagesFromImports(code);
    const ns = py.globals.get('dict')();
    ns.set('__name__', '__main__');
    await py.runPythonAsync(code, { globals: ns, filename: '<exec>' });
    py.runPython('import sys; sys.stdout.flush(); sys.stderr.flush()');
    postMessage({ type: 'done', ok: true, ms: performance.now() - t0 });
  } catch (e) {
    try { py.runPython('import sys; sys.stdout.flush()'); } catch { /* ignore */ }
    postMessage({ type: 'err', text: cleanTraceback(e.message) + '\n' });
    postMessage({ type: 'done', ok: false, ms: performance.now() - t0 });
  }
};
