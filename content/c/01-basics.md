=== intro | C Introduction
unit: Getting Started
desc: What C is, why it still runs the world, and your very first program — explained line by line.

**C** is a general-purpose programming language created by **Dennis Ritchie** at Bell Labs in **1972**. It was built to write the Unix operating system, and today it still runs underneath almost everything: Linux and Windows kernels, Python's interpreter, databases like MySQL, microcontrollers in washing machines and cars.

C is *small*, *fast* and *close to the hardware*. You decide where every byte of memory goes. That makes it the perfect first language for a computer science student: once you understand C, every other language makes more sense.

:::info Why CSE 101 starts with C
C hides almost nothing. You will see how numbers are stored, how memory is laid out and what a function call really costs — ideas that Data Structures (CSE 102), C++ and Operating Systems build on directly.
:::

## Your first C program

Every C journey starts with the same program. Read it, then press **Try it Yourself** to run and edit it.

```c run
#include <stdio.h>

int main(void) {
    printf("Hello, World!\n");
    return 0;
}
```

Here is what each line does:

| Line | Meaning |
|---|---|
| `#include <stdio.h>` | Brings in the **st**andar**d** **i**nput/**o**utput library, which contains `printf`. |
| `int main(void)` | Every C program starts running at `main`. It returns an `int` to the operating system. |
| `{ ... }` | Curly braces group statements into a block — here, the body of `main`. |
| `printf("Hello, World!\n");` | Prints text. `\n` moves to a new line. Every statement ends with `;`. |
| `return 0;` | Ends `main` and tells the OS the program finished successfully. |

## From source code to a running program

Your computer's processor cannot run C directly — it only understands machine code. A **compiler** such as `gcc` translates your file in four stages:

:::diagram flow
start: hello.c — the code you write
process: Preprocessor: expands #include and #define
process: Compiler: turns C into assembly
process: Assembler: turns assembly into machine code (hello.o)
process: Linker: joins hello.o with the C library
end: hello — a program you can run
caption: The four stages that `gcc hello.c -o hello` runs for you.
:::

On your own machine (Linux, macOS, or Windows with MinGW/WSL) you compile and run like this:

```bash
gcc hello.c -o hello     # compile hello.c into a program called hello
./hello                  # run it
```

:::tip No compiler installed?
Use the **Compiler** button in the top bar. It runs real GCC in your browser tab, so you can practise on any laptop or phone.
:::

## The structure of a C program

Bigger programs follow the same skeleton. Your exam may ask you to label these parts:

```c run
/* 1. Documentation: what this program does */
// Prints the area of a circle

/* 2. Preprocessor directives */
#include <stdio.h>
#define PI 3.14159

/* 3. Global declarations */
double area(double r);

/* 4. The main function */
int main(void) {
    double r = 2.0;
    printf("Area = %.2f\n", area(r));
    return 0;
}

/* 5. User-defined functions */
double area(double r) {
    return PI * r * r;
}
```

## Where C is used today

- **Operating systems** — the Linux kernel is about 30 million lines of C.
- **Embedded systems** — microcontrollers in cars, routers, smart TVs and medical devices.
- **Language runtimes** — CPython, the Ruby interpreter and parts of Node.js are written in C.
- **Databases and networking** — SQLite, MySQL, Redis, curl and most network stacks.

:::exam Frequently asked
"Write the features of C" — answer with: middle-level (high-level syntax, low-level memory access), structured/procedural, portable, fast, rich library, supports pointers and dynamic memory, and extensible with user-defined functions.
:::

:::quiz
Q. Who created the C language?
- Bjarne Stroustrup
* Dennis Ritchie
- James Gosling
- Guido van Rossum
= Dennis Ritchie designed C at Bell Labs in 1972 to write Unix. Stroustrup made C++, Gosling made Java and van Rossum made Python.

Q. Which function does every C program start executing from?
- `start()`
- `printf()`
* `main()`
- `stdio()`
= Execution always begins at `main`. The other functions only run if `main` calls them.

Q. Which stage of compilation joins your object file with the C library?
- Preprocessor
- Assembler
* Linker
- Compiler
= The linker combines `hello.o` with library code (like `printf`) into one executable.

Q. What does `return 0;` at the end of `main` mean?
* The program finished successfully
- Print the number 0
- Restart the program
- The program crashed
= By convention, a return value of 0 tells the operating system that the program ended without errors.
:::

=== syntax-output | Syntax, Output & Comments
desc: The grammar rules of C, how `printf` prints text and numbers, escape sequences, and how to comment code.

## C syntax rules

C is strict about grammar. Five rules cover almost every beginner error:

1. **Every statement ends with a semicolon** `;`.
2. **C is case-sensitive** — `printf` works, `Printf` does not.
3. **Blocks use curly braces** `{ }`.
4. **Whitespace is ignored** — indent for humans, not for the compiler.
5. **Text goes in double quotes** `"..."`; a single character goes in single quotes `'A'`.

## Printing with printf

`printf` (print formatted) writes text to the screen. Text without `\n` stays on the same line:

```c run
#include <stdio.h>

int main(void) {
    printf("Learning ");
    printf("C is fun.");
    printf("\n");
    printf("This is on a new line.\n");
    return 0;
}
```

To print numbers, put a **format specifier** in the text and pass the value after it. `%d` prints an integer:

```c run
#include <stdio.h>

int main(void) {
    int marks = 92;
    printf("Marks: %d\n", marks);
    printf("%d + %d = %d\n", 7, 5, 7 + 5);
    return 0;
}
```

You will meet all the format specifiers in the next lesson.

## Escape sequences

A backslash `\` inside a string starts an **escape sequence** — a special character you cannot type directly.

| Sequence | Meaning |
|---|---|
| `\n` | New line |
| `\t` | Horizontal tab |
| `\\` | A backslash |
| `\"` | A double quote inside a string |
| `\'` | A single quote |
| `\0` | The null character (ends every string) |
| `%%` | A percent sign (inside `printf` only) |

```c run
#include <stdio.h>

int main(void) {
    printf("Name\tMarks\n");
    printf("Asha\t95\n");
    printf("Ravi\t88\n");
    printf("She said \"C is easy\" and scored 100%%.\n");
    printf("Path: C:\\Users\\asha\n");
    return 0;
}
```

## puts and putchar

Two simpler output functions are also in `stdio.h`:

- `puts("text")` prints a string **and adds a newline** automatically.
- `putchar('A')` prints exactly one character.

```c run
#include <stdio.h>

int main(void) {
    puts("Hello from puts");
    putchar('O');
    putchar('K');
    putchar('\n');
    return 0;
}
```

## Comments

Comments are notes for humans. The compiler ignores them completely.

```c
// A single-line comment runs to the end of the line.

/* A multi-line comment
   can span several lines. */

int total = 0; // comments can follow code too
```

:::mistake Forgetting the semicolon
`printf("Hi")` without `;` gives an error like *expected ';' before 'return'*. The compiler reports the line **after** the real mistake, so always check the previous line too.
:::

:::exam Output-prediction trick
`printf` returns the number of characters it printed. So `printf("%d", printf("Hello"));` prints `Hello5`. Questions like this appear in university and placement tests.
:::

:::quiz
Q. What is printed by `printf("A\tB\nC");`?
- `A B C` on one line
* `A`, a tab, `B`, then `C` on the next line
- `A\tB\nC` exactly as typed
- A compile error
= `\t` inserts a tab and `\n` starts a new line, so `C` appears on the second line.

Q. How do you print a percent sign with `printf`?
- `\%`
* `%%`
- `/%`
- `'%'`
= Inside `printf`, `%` starts a format specifier, so a literal percent sign is written as `%%`.

Q. Which statement about C is **true**?
- C ignores capital letters, so `Main` and `main` are the same
* Every statement must end with a semicolon
- Indentation decides which statements are inside a block
- Strings use single quotes
= C is case-sensitive, uses braces (not indentation) for blocks, and strings use double quotes. Semicolons end statements.

Q. What does `puts("Hi");` do differently from `printf("Hi");`?
- Nothing, they are identical
- `puts` prints in bold
* `puts` adds a newline at the end
- `puts` can print numbers with `%d`
= `puts` always appends `\n`. It cannot format numbers.
:::

=== variables | Variables, Data Types & Constants
desc: Store values in variables, choose the right data type, print them with the right format specifier, and lock values with constants.

A **variable** is a named box in memory that holds a value. Every variable in C has a **type**, which decides how many bytes the box uses and what kind of value it can hold.

```c run
#include <stdio.h>

int main(void) {
    int age = 19;          // whole number
    float cgpa = 8.75f;    // decimal number
    char grade = 'A';      // single character

    printf("Age: %d\n", age);
    printf("CGPA: %.2f\n", cgpa);
    printf("Grade: %c\n", grade);

    age = age + 1;         // variables can change
    printf("Next year: %d\n", age);
    return 0;
}
```

## Declaring and naming variables

```c
int count;            // declaration (value is garbage until you assign one)
count = 10;           // assignment
int total = 0;        // declaration + initialisation
int a = 1, b = 2;     // several at once
```

**Naming rules** (these are called *identifiers*):

- Use letters, digits and underscores only: `total_marks`, `num1`.
- Must not start with a digit: `1num` is invalid.
- Cannot be a keyword such as `int`, `return`, `while`.
- Case matters: `Sum` and `sum` are different variables.

:::warn Always initialise
A local variable that you declare but never assign holds **garbage** — whatever bytes were already in that memory. Reading it gives unpredictable results. Get into the habit of writing `int sum = 0;`.
:::

## Data types

| Type | Typical size | Holds | Example |
|---|---|---|---|
| `char` | 1 byte | one character or small integer | `'A'` |
| `short` | 2 bytes | small integers | `300` |
| `int` | 4 bytes | integers, about ±2.1 billion | `-42` |
| `long long` | 8 bytes | very large integers | `9000000000LL` |
| `float` | 4 bytes | decimals, ~7 digits of precision | `3.14f` |
| `double` | 8 bytes | decimals, ~15 digits of precision | `3.14159265` |

Add `unsigned` to an integer type to store only non-negative values with double the positive range. Sizes can vary between machines, so C gives you the `sizeof` operator to check:

```c run
#include <stdio.h>

int main(void) {
    printf("char      : %zu byte\n", sizeof(char));
    printf("short     : %zu bytes\n", sizeof(short));
    printf("int       : %zu bytes\n", sizeof(int));
    printf("long long : %zu bytes\n", sizeof(long long));
    printf("float     : %zu bytes\n", sizeof(float));
    printf("double    : %zu bytes\n", sizeof(double));
    return 0;
}
```

## Format specifiers

The specifier must match the variable's type, or `printf` prints nonsense.

| Specifier | Type | Specifier | Type |
|---|---|---|---|
| `%d` or `%i` | `int` | `%c` | `char` |
| `%u` | `unsigned int` | `%s` | string |
| `%ld` | `long` | `%x` / `%o` | hex / octal |
| `%lld` | `long long` | `%e` | scientific notation |
| `%f` | `float` / `double` | `%p` | pointer address |
| `%.2f` | 2 decimal places | `%zu` | `sizeof` result |

```c run
#include <stdio.h>

int main(void) {
    int n = 255;
    double pi = 3.14159265;
    printf("%d in hex is %x and in octal is %o\n", n, n, n);
    printf("pi = %f\n", pi);
    printf("pi = %.3f\n", pi);
    printf("pi = %e\n", pi);
    printf("[%5d] [%-5d]\n", 42, 42);   // width 5, right and left aligned
    return 0;
}
```

## Characters are numbers

A `char` stores a small integer — its **ASCII code**. `'A'` is 65, `'a'` is 97 and `'0'` is 48. That is why you can do arithmetic on characters:

```c run
#include <stdio.h>

int main(void) {
    char c = 'A';
    printf("%c has ASCII code %d\n", c, c);
    printf("Next letter: %c\n", c + 1);
    printf("Lowercase: %c\n", c + 32);
    printf("Digit '7' as a number: %d\n", '7' - '0');
    return 0;
}
```

## Constants

Some values should never change. C gives you two ways to make them:

```c run
#include <stdio.h>
#define GRAVITY 9.8          // preprocessor constant: text replaced before compiling

int main(void) {
    const int DAYS_IN_WEEK = 7;   // typed constant: the compiler refuses changes
    printf("Weeks in 28 days: %d\n", 28 / DAYS_IN_WEEK);
    printf("Weight of 50 kg: %.1f N\n", 50 * GRAVITY);
    return 0;
}
```

Trying `DAYS_IN_WEEK = 8;` would be a compile error: *assignment of read-only variable*.

:::exam Classic question
"Difference between `const` and `#define`": `#define` is a preprocessor text substitution with no type and no memory; `const` creates a real typed variable that the compiler checks and that has an address.
:::

:::quiz
Q. Which is a valid variable name in C?
- `2ndPlace`
- `float`
* `total_marks`
- `my-score`
= Names may contain letters, digits and underscores, cannot start with a digit, and cannot be keywords. `my-score` contains a minus sign.

Q. Which format specifier prints a `double` with exactly two decimal places?
- `%d`
- `%2d`
* `%.2f`
- `%lf2`
= `%.2f` rounds to two digits after the decimal point.

Q. What does this print?
```c
char c = 'B';
printf("%d", c);
```
- `B`
* `66`
- `98`
- An error
= `%d` prints the character's ASCII code, and `'B'` is 66.

Q. What is the main difference between `const int X = 5;` and `#define X 5`?
* `const` creates a typed variable; `#define` is plain text replacement
- `#define` values can be changed later, `const` ones cannot
- They are identical
- `const` only works with `float`
= The preprocessor swaps `X` for `5` before compilation. `const` is a real variable the compiler type-checks.
:::

=== input | User Input with scanf
desc: Read numbers, characters and whole lines from the keyboard — and avoid the three classic scanf traps.

`scanf` (scan formatted) reads input from the keyboard. It uses the same format specifiers as `printf`, but it needs the **address** of each variable, written with `&`:

```c run stdin="21"
#include <stdio.h>

int main(void) {
    int age;
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("In 5 years you will be %d.\n", age + 5);
    return 0;
}
```

The green underlined text in the output is what the user typed. Click **Try it Yourself** and change the input box to test other values.

## Why the & ?

`scanf` has to *put* a value into your variable, so it needs to know **where the variable lives in memory**. `&age` means "the address of `age`". You will understand this fully in the Pointers lesson — for now, remember: **numbers and characters need `&`, strings do not**.

## Reading several values

One `scanf` can read many values. The user can separate them with spaces or new lines:

```c run stdin="12 7"
#include <stdio.h>

int main(void) {
    int a, b;
    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);
    printf("Sum = %d, Difference = %d, Product = %d\n", a + b, a - b, a * b);
    printf("Quotient = %.2f\n", (float)a / b);
    return 0;
}
```

## Reading decimals: %f versus %lf

`printf` prints both `float` and `double` with `%f`, but `scanf` is pickier:

| Variable type | `scanf` specifier |
|---|---|
| `float` | `%f` |
| `double` | `%lf` |

```c run stdin="72.5\n1.68"
#include <stdio.h>

int main(void) {
    double weight, height;
    printf("Weight in kg: ");
    scanf("%lf", &weight);
    printf("Height in m: ");
    scanf("%lf", &height);
    printf("Your BMI is %.1f\n", weight / (height * height));
    return 0;
}
```

## Reading a character

`%c` reads the very next character — **including a leftover newline** from the previous input. Put a space before it (`" %c"`) to skip whitespace first:

```c run stdin="3\nY"
#include <stdio.h>

int main(void) {
    int qty;
    char confirm;
    printf("Quantity: ");
    scanf("%d", &qty);
    printf("Confirm order? (Y/N): ");
    scanf(" %c", &confirm);      // the space skips the newline left by the Enter key
    printf("You ordered %d and answered %c\n", qty, confirm);
    return 0;
}
```

## Reading strings and whole lines

`%s` reads one **word** (it stops at a space). For a full line with spaces, use `fgets`:

```c run stdin="Asha\nBengaluru, Karnataka"
#include <stdio.h>
#include <string.h>

int main(void) {
    char first[20], city[50];
    printf("First name: ");
    scanf("%19s", first);                 // no & for arrays; 19 leaves room for '\0'
    getchar();                            // eat the newline left behind
    printf("City and state: ");
    fgets(city, sizeof city, stdin);      // reads spaces too
    city[strcspn(city, "\n")] = '\0';     // remove the trailing newline
    printf("%s lives in %s.\n", first, city);
    return 0;
}
```

:::warn Never use gets()
Older textbooks use `gets(name)`. It cannot know how big your array is, so long input overwrites other memory. It was removed from the C language in C11. Use `fgets` instead.
:::

## Checking that input worked

`scanf` returns **how many values it successfully read**. If the user types letters where a number is expected, it returns 0:

```c run stdin="abc"
#include <stdio.h>

int main(void) {
    int n;
    printf("Enter a number: ");
    if (scanf("%d", &n) == 1)
        printf("You typed %d\n", n);
    else
        printf("That was not a number!\n");
    return 0;
}
```

:::mistake The three scanf traps
1. Forgetting `&`: `scanf("%d", n);` compiles with only a warning but crashes or corrupts memory.
2. Using `%f` for a `double`: the value comes out wrong. Use `%lf`.
3. `%c` reading a leftover newline: write `" %c"` with a leading space.
:::

:::quiz
Q. Which line correctly reads an integer into `int n;`?
- `scanf("%d", n);`
* `scanf("%d", &n);`
- `scanf(&n, "%d");`
- `scanf("%n", &n);`
= `scanf` needs the format string first and then the address of the variable.

Q. Which specifier should `scanf` use for a `double`?
- `%f`
- `%d`
* `%lf`
- `%df`
= `scanf` needs `%lf` for `double`. Only `printf` accepts `%f` for both.

Q. A user types `Ravi Kumar` for `scanf("%s", name);`. What ends up in `name`?
* `Ravi`
- `Ravi Kumar`
- `Kumar`
- Nothing
= `%s` stops reading at the first space. Use `fgets` to read the whole line.

Q. Why does `scanf(" %c", &ch);` have a space before `%c`?
- It is a typo
- It makes the character uppercase
* It skips leftover whitespace such as the newline from the previous Enter key
- It reads two characters
= Without the space, `%c` would read the newline still waiting in the input buffer.
:::

=== operators | Operators & Expressions
desc: Arithmetic, increment, relational, logical, bitwise and ternary operators — plus precedence and type casting, which examiners love.

**Operators** are symbols that perform operations on values (called *operands*). `a + b` uses the `+` operator on operands `a` and `b`.

## Arithmetic operators

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `+` | Addition | `17 + 5` | `22` |
| `-` | Subtraction | `17 - 5` | `12` |
| `*` | Multiplication | `17 * 5` | `85` |
| `/` | Division | `17 / 5` | `3` (integer division!) |
| `%` | Remainder (modulus) | `17 % 5` | `2` |

```c run
#include <stdio.h>

int main(void) {
    int a = 17, b = 5;
    printf("%d / %d = %d\n", a, b, a / b);         // integers: the fraction is dropped
    printf("%d %% %d = %d\n", a, b, a % b);
    printf("17.0 / 5 = %.1f\n", 17.0 / 5);         // one double operand: real division
    printf("-17 / 5 = %d, -17 %% 5 = %d\n", -17 / 5, -17 % 5);
    return 0;
}
```

:::mistake Integer division surprises
`5 / 2` is `2`, not `2.5`, because both operands are `int`. And `%` only works on integers — `5.5 % 2` is a compile error (use `fmod` from `math.h`).
:::

## Increment and decrement

`++` adds 1 and `--` subtracts 1. The position matters when the result is used in the same expression:

- **Pre-increment** `++x`: increase first, then use the new value.
- **Post-increment** `x++`: use the old value, then increase.

```c run
#include <stdio.h>

int main(void) {
    int x = 5, y;
    y = x++;            // y gets 5, then x becomes 6
    printf("x = %d, y = %d\n", x, y);
    y = ++x;            // x becomes 7, then y gets 7
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
```

:::warn Undefined behaviour
Expressions like `i = i++ + ++i;` change the same variable twice without a sequence point. The C standard says the result is **undefined** — different compilers print different answers. If an exam asks, say exactly that.
:::

## Assignment operators

`x += 3` is shorthand for `x = x + 3`. The same works for `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=` and `>>=`.

## Relational and logical operators

Relational operators compare values and produce **1 (true)** or **0 (false)**: `==`, `!=`, `<`, `>`, `<=`, `>=`.

Logical operators combine conditions:

| Operator | Name | True when |
|---|---|---|
| `&&` | AND | both sides are true |
| `\|\|` | OR | at least one side is true |
| `!` | NOT | the operand is false |

```c run
#include <stdio.h>

int main(void) {
    int marks = 78, attendance = 82;
    printf("marks >= 40: %d\n", marks >= 40);
    printf("eligible: %d\n", marks >= 40 && attendance >= 75);
    printf("needs help: %d\n", marks < 40 || attendance < 75);
    printf("!eligible: %d\n", !(marks >= 40 && attendance >= 75));
    return 0;
}
```

C uses **short-circuit evaluation**: in `a && b`, if `a` is false, `b` is never evaluated. In `a || b`, if `a` is true, `b` is skipped. This lets you write safe checks like `if (d != 0 && n / d > 2)`.

## Bitwise operators

Bitwise operators work on the individual bits of integers. They are fast and appear in systems code and interviews.

| Operator | Name | Example (12 = `1100`, 10 = `1010`) | Result |
|---|---|---|---|
| `&` | AND | `12 & 10` | `8` (`1000`) |
| `\|` | OR | `12 \| 10` | `14` (`1110`) |
| `^` | XOR | `12 ^ 10` | `6` (`0110`) |
| `~` | NOT (one operand) | `~12` | `-13` |
| `<<` | Left shift | `12 << 1` | `24` |
| `>>` | Right shift | `12 >> 2` | `3` |

```c run
#include <stdio.h>

int main(void) {
    int a = 12, b = 10;
    printf("a & b = %d\n", a & b);
    printf("a | b = %d\n", a | b);
    printf("a ^ b = %d\n", a ^ b);
    printf("a << 1 = %d (same as a * 2)\n", a << 1);
    printf("a >> 2 = %d (same as a / 4)\n", a >> 2);
    printf("13 is %s\n", (13 & 1) ? "odd" : "even");   // lowest bit tells odd/even
    return 0;
}
```

## The ternary operator

`condition ? value_if_true : value_if_false` is a compact `if-else` that produces a value:

```c run
#include <stdio.h>

int main(void) {
    int a = 14, b = 29;
    int max = (a > b) ? a : b;
    printf("Larger number: %d\n", max);
    printf("%d is %s\n", a, a % 2 == 0 ? "even" : "odd");
    return 0;
}
```

## Precedence and associativity

When an expression has several operators, **precedence** decides which runs first, and **associativity** breaks ties. Highest first:

| Level | Operators | Associativity |
|---|---|---|
| 1 | `()` `[]` `->` `.` `x++` `x--` | left to right |
| 2 | `++x` `--x` `!` `~` `-x` `(type)` `*p` `&x` `sizeof` | right to left |
| 3 | `*` `/` `%` | left to right |
| 4 | `+` `-` | left to right |
| 5 | `<<` `>>` | left to right |
| 6 | `<` `<=` `>` `>=` | left to right |
| 7 | `==` `!=` | left to right |
| 8–10 | `&` then `^` then `\|` | left to right |
| 11–12 | `&&` then `\|\|` | left to right |
| 13 | `?:` | right to left |
| 14 | `=` `+=` `-=` … | right to left |

```c run
#include <stdio.h>

int main(void) {
    printf("%d\n", 2 + 3 * 4);       // * before +  -> 14
    printf("%d\n", (2 + 3) * 4);     // brackets first -> 20
    printf("%d\n", 20 / 4 * 2);      // same level, left to right -> 10
    printf("%d\n", 10 - 4 - 3);      // left to right -> 3
    return 0;
}
```

:::tip When in doubt, add brackets
Brackets cost nothing and make your intent obvious to readers and examiners.
:::

## Type conversion and casting

When you mix types, C **implicitly converts** the smaller type to the larger one (`int` → `double` in `5 / 2.0`). To force a conversion yourself, use a **cast**: `(type) value`.

```c run
#include <stdio.h>

int main(void) {
    int total = 437, count = 5;
    float wrong = total / count;            // int division happens first: 87
    float right = (float)total / count;     // cast first: 87.4
    printf("wrong = %.2f, right = %.2f\n", wrong, right);

    double price = 99.99;
    int rupees = (int)price;                // casting to int truncates
    printf("rupees = %d\n", rupees);
    return 0;
}
```

:::quiz
Q. What is the value of `7 / 2 * 2` in C?
- `7`
* `6`
- `7.0`
- `8`
= `7 / 2` is integer division, giving `3`. Then `3 * 2` is `6`.

Q. After `int x = 3; int y = x++ + 2;`, what are `x` and `y`?
- `x = 3, y = 5`
* `x = 4, y = 5`
- `x = 4, y = 6`
- `x = 3, y = 6`
= Post-increment uses the old value (3) in the expression, so `y = 5`, and then `x` becomes 4.

Q. What does `10 & 6` evaluate to?
* `2`
- `16`
- `14`
- `1`
= 1010 AND 0110 = 0010, which is 2.

Q. In `if (n != 0 && 100 / n > 5)`, what happens when `n` is 0?
- The program crashes with division by zero
* The division is skipped because `&&` short-circuits
- The condition is true
- It is a compile error
= `n != 0` is false, so `&&` stops immediately and never evaluates `100 / n`.

Q. Which expression gives `2.5`?
- `5 / 2`
- `(float)(5 / 2)`
* `(float)5 / 2`
- `5 % 2`
= Casting `5` to `float` before dividing makes it real division. `(float)(5 / 2)` casts after the integer division, giving `2.0`.
:::
