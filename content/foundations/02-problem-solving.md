=== algorithms-flowcharts | Algorithms, Flowcharts & Pseudocode
unit: Problem Solving
desc: Think before you code: computational thinking, writing step-by-step algorithms, drawing flowcharts with the standard symbols, and writing clear pseudocode.

Most programming mistakes happen **before** any code is typed: the plan was wrong or vague. Professional developers plan solutions first. This lesson gives you three tools for planning.

## Computational thinking

| Skill | Meaning | Example: "find the class topper" |
|---|---|---|
| **Decomposition** | break a big problem into smaller ones | read marks; compare; report |
| **Pattern recognition** | spot similarities with problems you have solved | "it's just finding a maximum" |
| **Abstraction** | ignore details that do not matter | names do not matter until the end |
| **Algorithm design** | write precise steps that always work | keep the best so far, update it |

## Algorithms

An **algorithm** is a finite, ordered list of unambiguous steps that solves a problem. A recipe is an algorithm for cooking.

**Algorithm: find the largest of three numbers**

1. Start.
2. Read A, B, C.
3. If A ≥ B and A ≥ C, then LARGEST = A.
4. Otherwise, if B ≥ C, then LARGEST = B.
5. Otherwise, LARGEST = C.
6. Print LARGEST.
7. Stop.

A good algorithm is **correct** for every input (what if two numbers are equal?), **finite**, **unambiguous** and **efficient**.

## Flowcharts

A **flowchart** draws an algorithm as connected shapes:

| Symbol | Shape | Use |
|---|---|---|
| Terminal | rounded rectangle (oval) | Start / Stop |
| Input/Output | parallelogram | Read or print data |
| Process | rectangle | a calculation or assignment |
| Decision | diamond | a yes/no question, two exits |
| Flow line | arrow | the order of steps |
| Connector | small circle | joins parts of a long chart |

:::diagram flow
start: Start
input: Read a number n
decision: n % 2 == 0 ?
yes: Print "Even"
no: Print "Odd"
end: Stop
caption: Flowchart for checking whether a number is even or odd.
:::

Loops appear as an arrow going **back** to an earlier step:

:::diagram flow
start: Start
process: sum = 0, i = 1
decision: i <= n ?
loop: sum = sum + i, then i = i + 1
output: Print sum
end: Stop
caption: Flowchart for the sum 1 + 2 + … + n. The "Yes" branch loops back to the condition.
:::

## Pseudocode

**Pseudocode** writes an algorithm in structured, code-like English — precise like code, but free of any one language's syntax.

```pseudo
ALGORITHM SumOfDigits
    INPUT n
    sum ← 0
    WHILE n > 0 DO
        digit ← n MOD 10
        sum ← sum + digit
        n ← n DIV 10
    END WHILE
    OUTPUT sum
END
```

Common conventions: `←` for assignment, `IF … THEN … ELSE … END IF`, `FOR i ← 1 TO n DO … END FOR`, `WHILE … DO … END WHILE`, `INPUT` and `OUTPUT`, and indentation to show blocks.

## From plan to program

The pseudocode translates almost line by line into any language:

```c run stdin="40213"
#include <stdio.h>

int main(void) {
    int n, sum = 0;
    printf("Enter a number: ");
    scanf("%d", &n);
    while (n > 0) {
        int digit = n % 10;
        sum = sum + digit;
        n = n / 10;
    }
    printf("Sum of digits = %d\n", sum);
    return 0;
}
```

```python run stdin="40213"
n = int(input("Enter a number: "))
total = 0
while n > 0:
    total += n % 10
    n //= 10
print("Sum of digits =", total)
```

## Dry runs

Before running code, **trace** it by hand with a table of variables — the single best debugging habit:

| Step | n | digit | sum |
|---|---|---|---|
| start | 40213 | – | 0 |
| 1 | 4021 | 3 | 3 |
| 2 | 402 | 1 | 4 |
| 3 | 40 | 2 | 6 |
| 4 | 4 | 0 | 6 |
| 5 | 0 | 4 | 10 |

:::tip The problem-solving routine
1. Restate the problem in your own words. 2. Work two or three small examples by hand, including an edge case. 3. Write the algorithm or pseudocode. 4. Dry-run it. 5. Only then code it, and test with your examples.
:::

:::quiz
Q. Which flowchart symbol represents a decision?
- Rectangle
- Parallelogram
* Diamond
- Oval
= A diamond has one entry and a Yes and a No exit.

Q. Which flowchart symbol is used for "Read marks"?
- Rectangle
* Parallelogram
- Diamond
- Circle
= Input and output use the parallelogram.

Q. Breaking a problem into smaller sub-problems is called...
* Decomposition
- Abstraction
- Compilation
- Iteration
= Decomposition is the first step of computational thinking.

Q. In a dry run of the digit-sum algorithm for n = 123, what is `sum` after the second pass of the loop?
- 3
* 5
- 6
- 1
= After the first pass sum = 3; after the second, 3 + 2 = 5.
:::

=== from-code-to-program | From Code to Running Program
desc: How source code becomes a running program: compilers vs interpreters, the build steps, IDEs and editors, and the three kinds of errors — syntax, runtime and logical — with debugging strategies.

## Programming languages

Computers only execute **machine code** — binary instructions specific to a CPU. Programmers write in **high-level languages** like C, Python and Java that are readable by humans, and a translator converts them.

| Level | Example | Who reads it |
|---|---|---|
| Machine code | `10110000 01100001` | the CPU |
| Assembly | `mov al, 0x61` | low-level programmers |
| High-level | `x = 97` | everyone |

## Compilers vs interpreters

| | Compiler | Interpreter |
|---|---|---|
| Translates | the whole program before it runs | one statement at a time while running |
| Output | a standalone executable file | no separate file |
| Errors | all syntax errors reported before running | reported when the line is reached |
| Speed | the program runs fast | slower |
| Examples | C, C++, Rust, Go | Python, JavaScript (with JIT compilers today), Ruby |

Java and Python actually do both: they compile to an intermediate **bytecode**, which a virtual machine then runs.

## The C build pipeline

```bash
gcc -E hello.c -o hello.i     # 1. preprocess: expand #include and #define
gcc -S hello.i -o hello.s     # 2. compile: C to assembly
gcc -c hello.s -o hello.o     # 3. assemble: assembly to machine code (object file)
gcc hello.o -o hello          # 4. link: add library code (printf) into an executable
./hello                       # 5. load and run
```

Normally one command does it all: `gcc hello.c -o hello`. See [C Introduction](@c/intro) for the diagram.

## Editors and IDEs

- A **text editor** (VS Code, Sublime, Vim) edits code; extensions add colours, suggestions and error checks.
- An **IDE** (integrated development environment) bundles an editor, compiler, debugger and project tools: CLion and Visual Studio for C/C++, PyCharm for Python, IntelliJ for Java.
- **Online compilers** (like this site's [Compiler](../../playground/)) need nothing installed.

## The three kinds of errors

### 1. Syntax errors

The code breaks the language's grammar, so it will not compile (or start). The compiler tells you the line.

```c
int main(void) {
    printf("Hello")      // missing semicolon -> error: expected ';'
    return 0;
}
```

### 2. Runtime errors

The program compiles but crashes or misbehaves while running: dividing by zero, reading past an array, opening a missing file, running out of memory.

```python run error
marks = [78, 85, 92]
total = 0
for i in range(4):          # one too many
    total += marks[i]
print(total)
```

### 3. Logical errors

The program runs and finishes, but gives the **wrong answer**. No error message appears — these are the hardest to find.

```python run
marks = [78, 85, 92]
average = sum(marks) / 2       # bug: should divide by len(marks)
print("Average:", average)
```

| Error type | When found | Who finds it | Example |
|---|---|---|---|
| Syntax | compile time | the compiler | missing `;` or `:` |
| Runtime | while running | a crash or exception | divide by zero |
| Logical | after checking the output | you, by testing | wrong formula |

## Debugging strategies

1. **Read the error message** from the top — it names the file, line and problem.
2. **Reproduce** the bug with the smallest input that triggers it.
3. **Print** values at key points (`printf` / `print` debugging).
4. Use a **debugger**: set breakpoints, step line by line, watch variables (gdb, VS Code debugger).
5. **Rubber-duck**: explain the code line by line to someone (or a rubber duck). Often you spot the bug while explaining.
6. **Check edge cases**: 0, 1, negative numbers, empty input, the largest input.

:::tip Test like a professional
Before calling a program done, test: a normal case, the smallest case, an edge case (zero, empty, equal values), and an invalid input. Write the expected output down **before** you run it.
:::

:::quiz
Q. Which translates an entire program into an executable before running it?
* A compiler
- An interpreter
- A debugger
- An editor
= Compilers translate ahead of time; interpreters translate as the program runs.

Q. A program prints an average of 127.5 for marks 78, 85 and 92. What kind of error is this?
- Syntax error
- Runtime error
* Logical error
- Linker error
= It runs without crashing but produces the wrong answer.

Q. Accessing the 11th element of a 10-element Python list is a...
- Syntax error
* Runtime error
- Logical error
- Compiler warning
= Python raises an `IndexError` while the program is running.

Q. Which build step combines your object file with library code like `printf`?
- Preprocessing
- Assembling
* Linking
- Loading
= The linker resolves calls to functions defined in libraries.
:::
