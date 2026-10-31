# Bytebook

**An interactive, W3Schools-style programming and computer science textbook for Kalvium students.**

Bytebook brings first-year computer science learning into one interactive, browser-based study companion. Covering Semesters 1–3, it combines structured lessons, runnable code examples, visual explanations, interactive learning tools, and quizzes.

> Learn concepts. Experiment with code. Visualize algorithms. Test your understanding.

---

## 📖 Curriculum

Bytebook currently covers seven subject areas:

| Subject                              | Course  | Lessons |
| ------------------------------------ | ------- | ------: |
| Programming in C                     | CSE 101 |      21 |
| Data Structures                      | CSE 102 |      21 |
| Object-Oriented Programming with C++ | —       |      19 |
| Python Programming                   | —       |      18 |
| Discrete Mathematics                 | —       |      18 |
| Design and Analysis of Algorithms    | —       |      21 |
| First-Year Foundations               | —       |      11 |
| **Total**                            |         | **129** |

## ✨ Features

### Interactive lessons

Every lesson is designed to support active learning through:

- Structured explanations and Markdown formatting.
- Runnable programming examples.
- Real program output captured during the build process.
- Exam tips and common-mistake callouts.
- Diagrams and visual explanations.
- Interactive quizzes with explanations.

### Interactive visualizers

Bytebook includes 15 interactive visualizers and learning tools covering:

- Sorting algorithms
- Stacks and queues
- Linked lists
- Binary search trees
- Graph traversal (BFS and DFS)
- Hashing
- Binary search
- Truth tables
- Venn diagrams
- Dynamic programming tables
- N-Queens
- Number systems and bases
- Big-O notation
- Live HTML editor

### Online compiler

Experiment with code in four supported languages:

- C
- C++
- Python
- JavaScript

---

## 🚀 Getting Started

### Requirements

- Node.js 18 or newer
- A C compiler (`cc`)
- A C++ compiler (`c++`)
- Python 3

### Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/devkancheti4-design/bytebook
cd bytebook
npm install
```

### Build the project

```bash
npm run build
```

This generates the static website in `docs/`.

### Preview locally

```bash
npm run serve
```

The local preview is available at:

`http://127.0.0.1:8131`

---

## 🛠️ How the Build System Works

Bytebook uses a build-time execution system to compile and run programming examples before generating the static site.

**Example execution:**

1. Lesson files are read from `content/`.
2. Runnable code examples are extracted.
3. Supported examples are compiled or executed.
4. Their output is captured and incorporated into the generated site.
5. The completed static site is written to `docs/`.

### Build caching

Example execution results are cached in:

```text
.cache/runs.json
```

Unchanged examples can reuse their cached results, avoiding unnecessary executions during subsequent builds.

### Build validation

The build exits with status code `1` when it encounters:

- Compilation errors.
- Program crashes.
- Broken `@` lesson links.
- Malformed quizzes.

This helps catch content and code problems before deployment.

---

## ✍️ Writing Lessons

Lessons are stored as Markdown files inside the `content/` directory.

```text
content/
├── courses.json
├── c/
├── cpp/
├── python/
├── data-structures/
└── ...
```

The actual subject directories are determined by the course configuration.

Each subject's lessons are read in filename order, and a single Markdown file can contain multiple lessons.

Subjects are registered in:

```text
content/courses.json
```

### Lesson structure

A lesson begins with a metadata header:

```markdown
=== pointers | Pointers

unit: Pointers & Memory
desc: One-line summary shown under the title.

## A heading

Normal Markdown, tables, lists, `inline code`,
and links to other lessons.

[Learn about arrays](@c/arrays)
```

### Runnable code examples

Use the `run` flag to compile or execute a code example and display its output.

````markdown
```c run stdin="5\n10"
#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\n", a + b);
}
```
````

Supported runnable languages:

| Language   | Code fence |
| ---------- | ---------- |
| C          | `c`        |
| C++        | `cpp`      |
| Python     | `python`   |
| JavaScript | `js`       |

### Code block flags

| Flag                  | Purpose                                                                           |
| --------------------- | --------------------------------------------------------------------------------- |
| `run`                 | Compile or execute the example and display output. Adds a Try it Yourself button. |
| `stdin="..."`         | Supplies standard input. Use `\n` for new lines.                                  |
| `vary`                | Indicates output may differ between machines.                                     |
| `error`               | Marks a program as expected to fail and display an error.                         |
| `aux title="file.py"` | Creates an additional file available to subsequent examples in the lesson.        |
| `title="name"`        | Gives the code block a title.                                                     |

### Callouts

Use callouts to highlight important learning information.

```markdown
:::exam Optional custom title
Important information for examinations.
:::
```

Available callout types:

`note`, `tip`, `warn`, `exam`, `mistake`, `key`, `def`, `info`, `try`.

### Diagrams

Create diagrams using structured diagram blocks.

```markdown
:::diagram list
nodes: 10 20 30
caption: A simple linked list.
:::
```

Available diagram types:

`array`, `matrix`, `list`, `stack`, `queue`, `tree`, `graph`, `memory`, `hashtable`, `venn`, `gates`, `flow`.

### Interactive widgets

Add interactive visualizations directly to lessons.

```markdown
:::widget sort
algos: bubble insertion
:::
```

### Quizzes

Create multiple-choice quizzes with explanations.

```markdown
:::quiz
Q. Which data structure uses LIFO ordering?

- Queue
* Stack

= A stack follows Last In, First Out (LIFO) ordering.
:::
```

The `*` identifies the correct answer, while `=` introduces the explanation displayed after answering.

---

## 🌐 Deployment

Bytebook generates a self-contained static website in `docs/`.

To deploy using GitHub Pages:

1. Open your repository on GitHub.
2. Navigate to **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Choose the `main` branch.
5. Select the `/docs` folder.
6. Save your configuration.

GitHub Pages will publish the generated website.

---

## 🤝 Contributing

Contributions to Bytebook can help improve its lessons, examples, visualizations, and learning experience.

Potential areas for contribution include:

- Improving explanations and lesson accuracy.
- Adding programming examples.
- Expanding interactive visualizations.
- Fixing documentation and build issues.
- Improving accessibility and usability.

When contributing, ensure that new runnable examples build successfully and that lesson formatting follows the supported Markdown conventions.

---

## ⚖️ Disclaimer

Bytebook is an independent educational study companion. It is **not affiliated with, endorsed by, or officially maintained by Kalvium**.

Course names and references are used for educational identification purposes.

