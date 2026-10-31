=== functions | Functions
unit: Functions
desc: Split programs into named, reusable pieces: declarations, definitions, parameters, return values and call by value.

A **function** is a named block of code that does one job. You have been calling functions since lesson one — `printf` and `scanf` are functions written by someone else. Now you will write your own.

Why bother?

- **Reuse** — write the logic once, call it many times.
- **Readability** — `isPrime(n)` explains itself; forty lines of loop do not.
- **Testing** — a small function is easy to check on its own.

## Defining and calling a function

```c run
#include <stdio.h>

// definition: return type, name, parameters, body
int square(int x) {
    return x * x;
}

int main(void) {
    int a = square(7);           // call: 7 is the argument
    printf("7 squared is %d\n", a);
    printf("12 squared is %d\n", square(12));
    return 0;
}
```

| Part | In the example |
|---|---|
| Return type | `int` — the type of value sent back |
| Name | `square` |
| Parameter list | `(int x)` — inputs the function receives |
| Body | `{ return x * x; }` |
| `return` | sends a value back and ends the function |

A function that returns nothing has return type `void`. A function that takes nothing has `(void)` as its parameter list.

```c run
#include <stdio.h>

void printLine(int n, char ch) {
    for (int i = 0; i < n; i++) putchar(ch);
    putchar('\n');
}

int main(void) {
    printLine(20, '=');
    printf("  REPORT CARD\n");
    printLine(20, '-');
    return 0;
}
```

## Declarations (prototypes)

C reads your file top to bottom. If `main` calls a function defined **below** it, you must **declare** the function first with a *prototype* — the header line followed by a semicolon:

```c run
#include <stdio.h>

int isPrime(int n);          // prototype: tells the compiler the function exists

int main(void) {
    printf("Primes up to 30: ");
    for (int i = 1; i <= 30; i++)
        if (isPrime(i)) printf("%d ", i);
    printf("\n");
    return 0;
}

int isPrime(int n) {         // definition comes later
    if (n < 2) return 0;
    for (int d = 2; d * d <= n; d++)
        if (n % d == 0) return 0;
    return 1;
}
```

## Call by value

When you pass a variable to a function, C copies its **value** into the parameter. The function works on the copy; the original is untouched.

```c run
#include <stdio.h>

void tryToChange(int x) {
    x = 100;
    printf("Inside the function: x = %d\n", x);
}

int main(void) {
    int x = 5;
    tryToChange(x);
    printf("Back in main:        x = %d\n", x);
    return 0;
}
```

So how can a function swap two variables in `main`? It needs their **addresses** — that is *call by reference*, which you will learn in [Pointers, Arrays & Functions](@c/pointers-functions).

## Functions calling functions

Good programs are built from small functions that call each other:

```c run stdin="12 18"
#include <stdio.h>

int gcd(int a, int b) {
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}

int lcm(int a, int b) {
    return a / gcd(a, b) * b;
}

int main(void) {
    int a, b;
    printf("Two numbers: ");
    scanf("%d %d", &a, &b);
    printf("GCD = %d, LCM = %d\n", gcd(a, b), lcm(a, b));
    return 0;
}
```

`gcd` uses **Euclid's algorithm**: gcd(a, b) = gcd(b, a mod b), stopping when b is 0.

## Library functions

C ships with many ready-made functions. Include the right header to use them:

| Header | Useful functions |
|---|---|
| `stdio.h` | `printf`, `scanf`, `fgets`, `puts`, `fopen` |
| `math.h` | `sqrt`, `pow`, `fabs`, `ceil`, `floor`, `sin`, `log` |
| `string.h` | `strlen`, `strcpy`, `strcmp`, `strcat` |
| `stdlib.h` | `malloc`, `free`, `abs`, `rand`, `atoi`, `exit` |
| `ctype.h` | `isdigit`, `isalpha`, `toupper`, `tolower` |

```c run
#include <stdio.h>
#include <math.h>

int main(void) {
    printf("sqrt(144) = %.0f\n", sqrt(144));
    printf("pow(2, 10) = %.0f\n", pow(2, 10));
    printf("ceil(4.1) = %.0f, floor(4.9) = %.0f\n", ceil(4.1), floor(4.9));
    printf("hypotenuse of 3,4 = %.1f\n", sqrt(3 * 3 + 4 * 4));
    return 0;
}
```

:::note Linking the maths library
On Linux, programs using `math.h` often need `-lm` at the end: `gcc prog.c -o prog -lm`.
:::

:::exam Terms examiners use
- **Actual parameters (arguments)** — the values in the call: `square(7)`.
- **Formal parameters** — the variables in the definition: `int x`.
- **Function prototype** — the declaration ending in `;`.
- **Call by value** — the function receives copies, so changes are not visible to the caller.
:::

:::quiz
Q. What is printed?
```c
void f(int n) { n = n * 2; }
int main(void) { int n = 4; f(n); printf("%d", n); }
```
* `4`
- `8`
- `0`
- Garbage
= `f` receives a copy of `n`. Doubling the copy does not change `main`'s `n`.

Q. Why do we write a function prototype?
- To make the function run faster
* So the compiler knows the function's signature before it is called
- To make the function private
- Prototypes are only needed for `void` functions
= A prototype lets you call a function that is defined later in the file.

Q. What is the return type of a function that does not return a value?
- `int`
- `null`
* `void`
- `empty`
= `void` means "returns nothing".

Q. In `int add(int a, int b)`, what are `a` and `b`?
- Actual parameters
* Formal parameters
- Global variables
- Return values
= The variables named in the definition are formal parameters; the values passed in a call are actual parameters.
:::

=== recursion | Recursion
desc: Functions that call themselves: base cases, the call stack, and the factorial, Fibonacci, power, digit-sum and Tower of Hanoi programs.

A function is **recursive** when it calls itself. Recursion solves a problem by solving a **smaller version of the same problem**, until it reaches a case so small that the answer is obvious.

Every recursive function needs two parts:

1. **Base case** — the smallest input, answered directly without recursion.
2. **Recursive case** — express the answer using the same function on a smaller input.

## Factorial

5! = 5 × 4! and 0! = 1. That definition *is* the code:

```c run
#include <stdio.h>

long long factorial(int n) {
    if (n <= 1) return 1;               // base case
    return n * factorial(n - 1);        // recursive case
}

int main(void) {
    for (int i = 0; i <= 6; i++)
        printf("%d! = %lld\n", i, factorial(i));
    return 0;
}
```

## What happens on the call stack

Each call gets its own **stack frame** holding its own copy of `n`. Calls pile up until the base case, then return values flow back down:

:::diagram stack
items: main() factorial(4) factorial(3) factorial(2) factorial(1)
label: call stack
caption: While computing `factorial(4)`, five frames are on the stack. `factorial(1)` returns 1, then each frame multiplies and returns.
:::

```text
factorial(4) = 4 * factorial(3)
             = 4 * (3 * factorial(2))
             = 4 * (3 * (2 * factorial(1)))
             = 4 * (3 * (2 * 1))
             = 24
```

:::mistake Missing base case
Without a base case (or with one that is never reached), the function calls itself forever until the stack runs out of memory: a **stack overflow**, which crashes the program.
:::

## Fibonacci

fib(0) = 0, fib(1) = 1, fib(n) = fib(n−1) + fib(n−2):

```c run
#include <stdio.h>

int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

int main(void) {
    for (int i = 0; i < 12; i++) printf("%d ", fib(i));
    printf("\n");
    return 0;
}
```

This is elegant but slow: `fib(n)` recomputes the same values again and again, making about 2ⁿ calls. You will fix this with *memoisation* in the Algorithms subject ([Dynamic Programming](@daa/dp-intro)).

:::diagram tree
tree: f5(f4(f3(f2,f1),f2),f3(f2,f1))
highlight: f3 f2
caption: The call tree of `fib(5)`. Highlighted calls are repeated work — `fib(3)` is computed twice and `fib(2)` three times.
:::

## More recursive classics

```c run
#include <stdio.h>

int sumDigits(int n)        { return n == 0 ? 0 : n % 10 + sumDigits(n / 10); }
long long power(int b, int e) {
    if (e == 0) return 1;
    long long half = power(b, e / 2);       // fast power: b^e = (b^(e/2))^2
    return e % 2 ? half * half * b : half * half;
}
void printBinary(int n)     { if (n > 1) printBinary(n / 2); printf("%d", n % 2); }
int gcd(int a, int b)       { return b == 0 ? a : gcd(b, a % b); }

int main(void) {
    printf("sumDigits(9045) = %d\n", sumDigits(9045));
    printf("power(3, 13) = %lld\n", power(3, 13));
    printf("13 in binary = "); printBinary(13); printf("\n");
    printf("gcd(84, 36) = %d\n", gcd(84, 36));
    return 0;
}
```

## Tower of Hanoi

Move `n` disks from peg A to peg C using peg B, never placing a larger disk on a smaller one. The recursive insight: move `n−1` disks out of the way, move the biggest disk, then move the `n−1` disks back on top.

```c run
#include <stdio.h>

int moves = 0;

void hanoi(int n, char from, char via, char to) {
    if (n == 0) return;
    hanoi(n - 1, from, to, via);
    printf("Move disk %d from %c to %c\n", n, from, to);
    moves++;
    hanoi(n - 1, via, from, to);
}

int main(void) {
    hanoi(3, 'A', 'B', 'C');
    printf("Total moves: %d\n", moves);   // always 2^n - 1
    return 0;
}
```

## Recursion vs iteration

| | Recursion | Iteration (loops) |
|---|---|---|
| Code | short, mirrors the maths | sometimes longer |
| Memory | one stack frame per call | constant |
| Speed | function-call overhead | usually faster |
| Best for | trees, divide and conquer, backtracking | simple repetition |

:::exam Write the recurrence
Examiners often ask for the recurrence relation of a recursive function. For factorial: T(n) = T(n−1) + O(1), which solves to O(n). For naive Fibonacci: T(n) = T(n−1) + T(n−2) + O(1), which grows exponentially.
:::

:::quiz
Q. What is the base case in `int f(int n) { if (n == 0) return 0; return n + f(n - 1); }`?
* `n == 0`, which returns 0
- `return n + f(n - 1)`
- There is no base case
- `n == 1`
= The base case stops the recursion: when `n` is 0 the function returns without calling itself.

Q. What does `f(4)` return for the function in the previous question?
- 4
- 0
* 10
- 24
= 4 + 3 + 2 + 1 + 0 = 10. The function sums 1 to n.

Q. What happens if a recursive function never reaches its base case?
- It returns 0
- The compiler refuses to compile it
* It keeps calling itself until the stack overflows and the program crashes
- It automatically becomes a loop
= Each call uses stack memory. Infinite recursion exhausts the stack.

Q. How many moves does Tower of Hanoi need for 4 disks?
- 8
- 12
* 15
- 16
= The minimum is 2ⁿ − 1 = 2⁴ − 1 = 15.
:::

=== scope-storage | Scope & Storage Classes
desc: Where variables live and how long they last: local, global and block scope, plus the auto, static, extern and register storage classes.

Every variable has a **scope** (where in the code its name can be used) and a **lifetime** (how long its memory exists). A storage class keyword controls both.

## Local, global and block scope

```c run
#include <stdio.h>

int counter = 0;                 // global: visible in every function below

void visit(void) {
    counter++;                   // uses the global
    int local = 10;              // local: exists only during this call
    printf("visit: counter = %d, local = %d\n", counter, local);
}

int main(void) {
    visit();
    visit();
    int x = 1;
    {
        int x = 2;               // block scope: this x hides the outer x
        printf("inner x = %d\n", x);
    }
    printf("outer x = %d\n", x);
    return 0;
}
```

When an inner variable has the same name as an outer one, the inner one **shadows** it inside its block.

## The four storage classes

| Storage class | Where stored | Default value | Scope | Lifetime |
|---|---|---|---|---|
| `auto` | stack | garbage | block | until the block ends |
| `register` | CPU register (a hint) | garbage | block | until the block ends |
| `static` | data segment | 0 | block (or file) | the whole program |
| `extern` | data segment | 0 | global | the whole program |

### auto

Every local variable is `auto` by default, so you never need to write the keyword.

### static

A `static` local variable is created **once** and keeps its value between calls:

```c run
#include <stdio.h>

void countCalls(void) {
    static int calls = 0;   // initialised only once
    int normal = 0;         // re-created on every call
    calls++;
    normal++;
    printf("calls = %d, normal = %d\n", calls, normal);
}

int main(void) {
    countCalls();
    countCalls();
    countCalls();
    return 0;
}
```

A `static` **global** variable or function is visible only inside its own `.c` file — a simple way to hide helpers from other files.

### extern

`extern` declares a global variable that is **defined in another file** (or later in this one). It does not create new memory:

```c
// file1.c
int total = 50;            // definition: memory is created here

// file2.c
extern int total;          // declaration: "total exists somewhere else"
void show(void) { printf("%d\n", total); }
```

### register

`register int i;` asks the compiler to keep `i` in a CPU register for speed. Modern compilers ignore the hint and decide for themselves. You cannot take the address (`&i`) of a register variable.

:::warn Prefer locals over globals
Global variables can be changed by any function, which makes bugs hard to trace. Pass values as parameters and return results instead. Use globals only for true program-wide settings.
:::

:::exam Must-know output question
```c
int f(void) { static int x = 5; return x--; }
// printf("%d %d %d", f(), f(), f()) style questions
```
Calls print 5, then 4, then 3, because `x` survives between calls. (The order in which a single `printf` evaluates its arguments is unspecified, so call `f()` in separate statements when you test this.)
:::

:::quiz
Q. What is the default initial value of a `static int` variable?
- Garbage
* 0
- 1
- −1
= Static and global variables are zero-initialised. Local `auto` variables hold garbage.

Q. A `static` local variable keeps its value...
- only until the function returns
* between function calls, for the whole program run
- only inside loops
- only in `main`
= It is stored in the data segment, not on the stack, so it outlives each call.

Q. What does `extern int count;` do?
- Creates a new variable with value 0
* Declares a variable that is defined elsewhere, without allocating memory
- Makes `count` constant
- Makes `count` visible only in this file
= `extern` is a declaration, not a definition.

Q. Which storage class forbids taking the variable's address with `&`?
- `auto`
- `static`
* `register`
- `extern`
= A register variable may not live in memory, so it has no address.
:::
