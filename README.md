# Bytebook

An interactive, W3Schools-style ebook for Kalvium students, covering semesters 1–3:

| Subject | Lessons |
|---|---|
| Programming in C (CSE 101) | 21 |
| Data Structures (CSE 102) | 21 |
| Object-Oriented Programming with C++ | 19 |
| Python Programming | 18 |
| Discrete Mathematics | 18 |
| Design and Analysis of Algorithms | 21 |
| First-Year Foundations | 11 |

Every lesson has runnable code (with real output captured at build time), callouts for exam tips and common mistakes, diagrams, and a quiz. There are 15 interactive visualizers (sorting, stacks, queues, linked lists, BSTs, BFS/DFS, hashing, binary search, truth tables, Venn diagrams, DP tables, N-Queens, number bases, Big-O and a live HTML editor) and an online compiler for C, C++, Python and JavaScript.

Bytebook is an independent study companion and is not affiliated with Kalvium.

## Build

Requirements: Node.js 18+, a C/C++ compiler (`cc` and `c++`), and `python3`. The build compiles and runs every example, so outputs on the site are always real.

```bash
npm install
npm run build        # writes the static site to docs/
npm run serve        # preview at http://127.0.0.1:8131
```

Example results are cached in `.cache/runs.json`, so rebuilds only re-run changed examples. The build fails loudly (exit code 1) on compile errors, crashes, broken `@` links or malformed quizzes.

## Writing lessons

Lessons live in `content/<subject>/*.md`; files are read in name order and each file can hold several lessons. Subjects are listed in `content/courses.json`.

````markdown
=== pointers | Pointers
unit: Pointers & Memory
desc: One-line summary shown under the title.

## A heading

Normal Markdown, tables, lists, `inline code`, and [links to other lessons](@c/arrays).

```c run stdin="5\n10"
#include <stdio.h>
int main(void) { int a, b; scanf("%d %d", &a, &b); printf("%d\n", a + b); }
```

:::exam Optional custom title
Callout kinds: note, tip, warn, exam, mistake, key, def, info, try.
:::

:::diagram list
nodes: 10 20 30
caption: Diagram kinds: array, matrix, list, stack, queue, tree, graph, memory, hashtable, venn, gates, flow.
:::

:::widget sort
algos: bubble insertion
:::

:::quiz
Q. Question text (Markdown, code blocks allowed)
- wrong option
* correct option
= Explanation shown after answering.
:::
````

Code block flags: `run` (compile, run and show output; adds a Try it Yourself button), `stdin="..."` (input; `\n` for new lines), `vary` (output differs per machine), `error` (the program is expected to fail and show its error), `aux title="file.py"` (an extra file available to later examples in the lesson), `title="name"`.

Runnable languages: `c`, `cpp`, `python`, `js`.

## Deploy

`docs/` is a self-contained static site. On GitHub, enable Pages from the `main` branch, `/docs` folder.
