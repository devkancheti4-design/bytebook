=== structures | Structures, Unions & Enums
unit: Structures, Files & More
desc: Group related data with `struct`, name types with `typedef`, use arrays of structures and pointers to them, and compare structures with unions and enums.

Real things have several properties. A student has a roll number, a name and a CGPA. A **structure** (`struct`) bundles variables of **different types** into one new type.

```c run
#include <stdio.h>
#include <string.h>

struct Student {
    int roll;
    char name[30];
    float cgpa;
};

int main(void) {
    struct Student s1 = {101, "Asha Rao", 9.1f};
    struct Student s2;
    s2.roll = 102;                        // the dot operator accesses members
    strcpy(s2.name, "Ravi Kumar");
    s2.cgpa = 8.4f;

    printf("%d  %-12s %.1f\n", s1.roll, s1.name, s1.cgpa);
    printf("%d  %-12s %.1f\n", s2.roll, s2.name, s2.cgpa);
    return 0;
}
```

## typedef

`typedef` gives a type a shorter name, so you can write `Student` instead of `struct Student`:

```c run
#include <stdio.h>

typedef struct {
    double x, y;
} Point;

double area(Point a, Point b, Point c) {   // triangle area from three corners
    double v = (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2;
    return v < 0 ? -v : v;
}

int main(void) {
    Point a = {0, 0}, b = {4, 0}, c = {0, 3};
    printf("Area = %.1f\n", area(a, b, c));
    return 0;
}
```

## Arrays of structures

```c run stdin="3\n1 Asha 88\n2 Ravi 95\n3 Meera 79"
#include <stdio.h>

typedef struct {
    int roll;
    char name[20];
    int marks;
} Student;

int main(void) {
    Student cls[50];
    int n, top = 0;
    printf("How many students? ");
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        printf("Roll, name, marks: ");
        scanf("%d %19s %d", &cls[i].roll, cls[i].name, &cls[i].marks);
        if (cls[i].marks > cls[top].marks) top = i;
    }
    printf("Topper: %s (roll %d) with %d marks\n", cls[top].name, cls[top].roll, cls[top].marks);
    return 0;
}
```

## Pointers to structures and the arrow operator

With a pointer to a struct, use `->` to reach a member. `p->marks` is shorthand for `(*p).marks`:

```c run
#include <stdio.h>

typedef struct {
    char name[20];
    int balance;
} Account;

void deposit(Account *acc, int amount) {     // pass by pointer: no copy, changes stick
    acc->balance += amount;
}

int main(void) {
    Account a = {"Priya", 500};
    Account *p = &a;
    deposit(p, 250);
    printf("%s has Rs %d\n", p->name, p->balance);
    printf("Same thing: %d\n", (*p).balance);
    return 0;
}
```

Passing a pointer to a large struct is faster than passing the struct itself, because nothing is copied.

## Nested structures

```c run
#include <stdio.h>

typedef struct { int day, month, year; } Date;
typedef struct { char title[40]; Date due; } Assignment;

int main(void) {
    Assignment a = {"Linked list lab", {14, 11, 2026}};
    printf("%s is due on %02d/%02d/%d\n", a.title, a.due.day, a.due.month, a.due.year);
    return 0;
}
```

## Structure size and padding

The compiler may insert unused **padding** bytes so each member starts at an address the CPU can read quickly. So a struct can be bigger than the sum of its members:

```c run
#include <stdio.h>

struct A { char c; int i; char d; };     // 1 + (3 pad) + 4 + 1 + (3 pad) = 12
struct B { int i; char c; char d; };     // 4 + 1 + 1 + (2 pad) = 8

int main(void) {
    printf("sizeof(struct A) = %zu\n", sizeof(struct A));
    printf("sizeof(struct B) = %zu\n", sizeof(struct B));
    return 0;
}
```

:::tip Order members from largest to smallest
Listing bigger members first usually reduces padding and saves memory — handy when you store millions of records.
:::

## Unions

A **union** looks like a struct, but all its members **share the same memory**. Its size is the size of its largest member, and only one member holds a meaningful value at a time.

```c run
#include <stdio.h>

union Value {
    int i;
    float f;
    char c;
};

int main(void) {
    union Value v;
    printf("sizeof(union Value) = %zu\n", sizeof(v));
    v.i = 65;
    printf("as int: %d, as char: %c\n", v.i, v.c);   // same bytes, read as a char
    v.f = 3.5f;                                       // overwrites the int
    printf("as float: %.1f\n", v.f);
    return 0;
}
```

| Structure | Union |
|---|---|
| Each member has its own memory | All members share one memory location |
| Size ≥ sum of member sizes | Size = largest member (plus padding) |
| All members usable at once | Only the last written member is valid |

## Enumerations

An `enum` gives names to integer constants, which makes code self-explanatory:

```c run
#include <stdio.h>

enum Day { MON = 1, TUE, WED, THU, FRI, SAT, SUN };   // TUE = 2, WED = 3 ...

int main(void) {
    enum Day today = FRI;
    printf("Friday is day %d\n", today);
    if (today == SAT || today == SUN) printf("Weekend!\n");
    else printf("%d day(s) to the weekend\n", SAT - today);
    return 0;
}
```

:::quiz
Q. Given `struct Student *p;`, how do you access the `roll` member?
- `p.roll`
* `p->roll`
- `*p.roll`
- `p[roll]`
= `->` dereferences the pointer and selects the member; it equals `(*p).roll`. `*p.roll` parses as `*(p.roll)`.

Q. What is the size of `union { int i; double d; char c; }` on a typical 64-bit machine?
- 13
* 8
- 16
- 4
= A union is as large as its largest member, here the 8-byte `double`.

Q. Why might `sizeof(struct { char a; int b; })` be 8 instead of 5?
- `char` is 4 bytes in structs
* The compiler adds padding so `b` starts on a 4-byte boundary
- Structs always round up to 8
- It stores a hidden pointer
= Alignment padding is inserted after `a`.

Q. In `enum Color { RED, GREEN = 5, BLUE };` what is `BLUE`?
- 2
- 0
* 6
- 7
= Enumerators count up from the previous value: `GREEN` is 5, so `BLUE` is 6.
:::

=== file-handling | File Handling
desc: Save data that outlives your program: open, write, read, append and close text files with fopen, fprintf, fscanf, fgets and friends.

Variables vanish when a program ends. **Files** keep data on disk. C works with files through a `FILE *` pointer from `stdio.h`.

The pattern is always the same: **open → read or write → close**.

## Opening a file

```c
FILE *fp = fopen("marks.txt", "w");
if (fp == NULL) { perror("fopen"); return 1; }   // always check!
```

| Mode | Meaning | If the file exists | If it does not |
|---|---|---|---|
| `"r"` | read | read from the start | **fails** (returns `NULL`) |
| `"w"` | write | **erases it** | creates it |
| `"a"` | append | adds at the end | creates it |
| `"r+"` | read and write | opens it | fails |
| `"w+"` | read and write | erases it | creates it |
| `"a+"` | read and append | opens it | creates it |

Add `b` for binary files: `"rb"`, `"wb"`.

## Writing and reading text

```c run
#include <stdio.h>

int main(void) {
    FILE *fp = fopen("marks.txt", "w");
    if (!fp) { perror("marks.txt"); return 1; }
    fprintf(fp, "%s %d\n", "Asha", 91);
    fprintf(fp, "%s %d\n", "Ravi", 78);
    fprintf(fp, "%s %d\n", "Meera", 85);
    fclose(fp);
    printf("Saved 3 records.\n");

    fp = fopen("marks.txt", "r");
    if (!fp) { perror("marks.txt"); return 1; }
    char name[20];
    int marks, total = 0, count = 0;
    while (fscanf(fp, "%19s %d", name, &marks) == 2) {   // stop when a read fails
        printf("%-6s %d\n", name, marks);
        total += marks;
        count++;
    }
    fclose(fp);
    printf("Class average: %.2f\n", (double)total / count);
    return 0;
}
```

## Line by line with fgets, and appending

```c run
#include <stdio.h>
#include <string.h>

int main(void) {
    FILE *fp = fopen("diary.txt", "w");
    fputs("Monday: started C file handling\n", fp);
    fclose(fp);

    fp = fopen("diary.txt", "a");                 // append keeps the old content
    fputs("Tuesday: wrote my first log file\n", fp);
    fclose(fp);

    char line[100];
    int n = 0;
    fp = fopen("diary.txt", "r");
    while (fgets(line, sizeof line, fp) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        printf("%d | %s\n", ++n, line);
    }
    fclose(fp);
    return 0;
}
```

## Character by character: copy a file and count stats

```c run
#include <stdio.h>

int main(void) {
    FILE *out = fopen("source.txt", "w");
    fputs("Files are just bytes.\nRead them one char at a time!\n", out);
    fclose(out);

    FILE *in = fopen("source.txt", "r");
    FILE *copy = fopen("copy.txt", "w");
    int ch, chars = 0, lines = 0, words = 0, inWord = 0;
    while ((ch = fgetc(in)) != EOF) {          // ch must be int to hold EOF
        fputc(ch, copy);
        chars++;
        if (ch == '\n') lines++;
        if (ch == ' ' || ch == '\n' || ch == '\t') inWord = 0;
        else if (!inWord) { inWord = 1; words++; }
    }
    fclose(in);
    fclose(copy);
    printf("chars %d, words %d, lines %d\n", chars, words, lines);
    return 0;
}
```

## Binary files: saving structures

`fwrite` and `fread` copy raw bytes, which makes saving whole structures easy and fast:

```c run
#include <stdio.h>

typedef struct { int id; char item[16]; double price; } Product;

int main(void) {
    Product stock[3] = {{1, "Notebook", 45.0}, {2, "Pen", 10.5}, {3, "Calculator", 799.0}};
    FILE *fp = fopen("stock.dat", "wb");
    fwrite(stock, sizeof(Product), 3, fp);
    fclose(fp);

    Product p;
    fp = fopen("stock.dat", "rb");
    fseek(fp, 2 * sizeof(Product), SEEK_SET);     // jump straight to record #3
    fread(&p, sizeof(Product), 1, fp);
    printf("Record 3: %s costs Rs %.2f\n", p.item, p.price);
    rewind(fp);                                   // back to the start
    fread(&p, sizeof(Product), 1, fp);
    printf("Record 1: %s\n", p.item);
    fclose(fp);
    return 0;
}
```

| Function | Purpose |
|---|---|
| `fopen`, `fclose` | open and close |
| `fprintf`, `fscanf` | formatted write / read |
| `fputs`, `fgets` | write / read a line |
| `fputc`, `fgetc` | write / read one character |
| `fwrite`, `fread` | write / read raw blocks (binary) |
| `fseek`, `ftell`, `rewind` | move around in a file |
| `feof`, `ferror` | check for end of file or an error |

:::mistake Common file bugs
- Not checking `fopen` for `NULL` (wrong file name or folder).
- Opening with `"w"` when you meant `"a"` — your old data is erased instantly.
- Using `char` instead of `int` for `fgetc`'s result, so `EOF` is never detected properly.
- Forgetting `fclose`: buffered data may never reach the disk.
:::

:::quiz
Q. Which mode opens a file for writing **without erasing** its current contents?
- `"w"`
* `"a"`
- `"r"`
- `"w+"`
= Append mode adds new data at the end and creates the file if needed.

Q. What does `fopen` return if the file cannot be opened?
* `NULL`
- `EOF`
- 0 bytes
- −1
= Always compare the result with `NULL` before using it.

Q. Why should the variable receiving `fgetc(fp)` be an `int`?
- `fgetc` only reads digits
* `EOF` is a negative int that may not fit in a `char`
- It is faster
- `char` cannot hold letters
= Storing the result in `char` can make a real character look like `EOF`, or make `EOF` undetectable.

Q. Which function moves the file position to a specific byte offset?
- `ftell`
* `fseek`
- `fread`
- `feof`
= `fseek(fp, offset, SEEK_SET)` jumps to `offset` bytes from the start. `ftell` reports the current position.
:::

=== preprocessor | Preprocessor, Macros & Command-Line Arguments
desc: What happens before compilation: #include, #define macros and their traps, conditional compilation, header guards, and reading arguments with argc/argv.

Before the compiler sees your code, the **preprocessor** runs. It handles every line starting with `#`. It does pure **text substitution** — it does not understand C types or syntax.

## #include

```c
#include <stdio.h>      // angle brackets: search the system include folders
#include "mylib.h"      // quotes: search your project folder first
```

## #define: constants and macros

```c run
#include <stdio.h>
#define PI 3.14159
#define SQUARE(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main(void) {
    printf("Area of r=2: %.2f\n", PI * SQUARE(2));
    printf("MAX(7, 12) = %d\n", MAX(7, 12));
    printf("SQUARE(3 + 1) = %d\n", SQUARE(3 + 1));
    return 0;
}
```

### The bracket trap

Because macros are text replacement, missing brackets give wrong answers:

```c run
#include <stdio.h>
#define BAD_SQUARE(x) x * x
#define GOOD_SQUARE(x) ((x) * (x))

int main(void) {
    printf("BAD_SQUARE(3 + 1)  = %d\n", BAD_SQUARE(3 + 1));    // 3 + 1 * 3 + 1 = 7
    printf("GOOD_SQUARE(3 + 1) = %d\n", GOOD_SQUARE(3 + 1));   // (3 + 1) * (3 + 1) = 16
    printf("100 / BAD_SQUARE(5)  = %d\n", 100 / BAD_SQUARE(5)); // 100 / 5 * 5 = 100
    printf("100 / GOOD_SQUARE(5) = %d\n", 100 / GOOD_SQUARE(5));
    return 0;
}
```

:::exam Macro vs function
| Macro | Function |
|---|---|
| Expanded by the preprocessor (text) | Compiled and called at run time |
| No type checking | Arguments are type-checked |
| No call overhead, but code grows | Call overhead, code exists once |
| Arguments may be evaluated twice: `SQUARE(i++)` is a bug | Each argument evaluated once |
:::

## Predefined macros

```c run vary
#include <stdio.h>

int main(void) {
    printf("File: %s, line: %d\n", __FILE__, __LINE__);
    printf("Compiled on %s at %s\n", __DATE__, __TIME__);
    printf("C standard version: %ld\n", __STDC_VERSION__);
    return 0;
}
```

## Conditional compilation

Include or exclude code before compiling — useful for debug output and for code that differs between Windows and Linux:

```c run
#include <stdio.h>
#define DEBUG 1

int main(void) {
    int total = 0;
    for (int i = 1; i <= 4; i++) {
        total += i * i;
#if DEBUG
        printf("[debug] i = %d, total = %d\n", i, total);
#endif
    }
    printf("Sum of squares: %d\n", total);
#ifdef _WIN32
    printf("Built for Windows\n");
#else
    printf("Built for Linux or macOS\n");
#endif
    return 0;
}
```

## Header guards

When you split code into files, put declarations in a header. Wrap the header in a **guard** so including it twice does no harm:

```c
// mathutil.h
#ifndef MATHUTIL_H
#define MATHUTIL_H

int gcd(int a, int b);
int lcm(int a, int b);

#endif
```

## Command-line arguments

`main` can receive the words typed after the program name:

- `argc` — **arg**ument **c**ount, including the program name.
- `argv` — **arg**ument **v**ector: an array of strings. `argv[0]` is the program name.

```c
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    if (argc < 3) {
        printf("Usage: %s num1 num2\n", argv[0]);
        return 1;
    }
    int a = atoi(argv[1]), b = atoi(argv[2]);   // convert text to int
    printf("%d + %d = %d\n", a, b, a + b);
    return 0;
}
```

```bash
gcc add.c -o add
./add 12 30
# 12 + 30 = 42
```

:::quiz
Q. What does `#define TRIPLE(x) x * 3` give for `TRIPLE(2 + 1)`?
- 9
* 5
- 7
- 6
= Text substitution gives `2 + 1 * 3` = 2 + 3 = 5. Bracket macro parameters: `((x) * 3)`.

Q. What is `argv[0]`?
* The name of the program
- The first argument the user typed
- The number of arguments
- Always `NULL`
= User arguments start at `argv[1]`; `argc` counts all of them including the program name.

Q. What are header guards for?
- Making headers compile faster
* Preventing a header's contents from being included twice in one file
- Hiding functions from other files
- Checking types in macros
= `#ifndef X / #define X / ... / #endif` makes repeated includes harmless.

Q. When do preprocessor directives run?
- At run time
* Before compilation
- After linking
- Only in debug builds
= The preprocessor rewrites the source text before the compiler proper starts.
:::

=== cheatsheet | C Cheat Sheet & Exam Prep
desc: Everything from CSE 101 on one page: syntax, format specifiers, operators, must-know programs and the mistakes that cost marks.

Use this page for last-minute revision. Every row links back to the full lesson.

## Program skeleton

```c
#include <stdio.h>

int main(void) {
    // declarations
    // input
    // processing
    // output
    return 0;
}
```

## Data types and format specifiers

| Type | Size* | `printf` | `scanf` |
|---|---|---|---|
| `char` | 1 | `%c` | `%c` (use `" %c"`) |
| `int` | 4 | `%d` | `%d` |
| `unsigned int` | 4 | `%u` | `%u` |
| `long long` | 8 | `%lld` | `%lld` |
| `float` | 4 | `%f` | `%f` |
| `double` | 8 | `%f` / `%lf` | `%lf` |
| string | — | `%s` | `%s` (no `&`) |
| pointer | 8 | `%p` | — |
| `size_t` | 8 | `%zu` | `%zu` |

\* typical 64-bit sizes; check with `sizeof`. See [Variables & Data Types](@c/variables).

## Control flow at a glance

```c
if (cond) { } else if (cond2) { } else { }
switch (n) { case 1: ...; break; default: ...; }
for (int i = 0; i < n; i++) { }
while (cond) { }
do { } while (cond);     // runs at least once
break;     // leave loop/switch
continue;  // skip to next iteration
```

## Pointers in one table

| Expression | Meaning |
|---|---|
| `int *p = &x;` | `p` stores the address of `x` |
| `*p` | the value at that address |
| `p + 1` | address of the next `int` |
| `a[i]` ≡ `*(a + i)` | array indexing is pointer arithmetic |
| `p->m` ≡ `(*p).m` | member through a struct pointer |
| `int **pp = &p;` | pointer to pointer |
| `void f(int *x)` | call by reference |

## Must-practise programs

| Topic | Programs |
|---|---|
| Basics | swap two numbers (with and without a temp), simple interest, area, temperature conversion |
| Decisions | largest of three, leap year, grade calculator, vowel or consonant, calculator with `switch` |
| Loops | factorial, Fibonacci, prime check, primes in a range, Armstrong number, palindrome number, sum of digits, GCD/LCM |
| Patterns | right triangle, pyramid, diamond, Floyd's triangle, Pascal's triangle |
| Arrays | max/min, second largest, reverse, linear search, frequency count, remove duplicates |
| 2D arrays | matrix add, multiply, transpose, diagonal sums |
| Strings | length, reverse, palindrome, count vowels, without library functions |
| Recursion | factorial, Fibonacci, power, sum of digits, Tower of Hanoi |
| Pointers | swap with pointers, array via pointer, dynamic array with `malloc` |
| Structs & files | student records, topper, save and read records from a file |

### Armstrong number (asked very often)

A number is an Armstrong number if the sum of its digits, each raised to the number of digits, equals the number: 153 = 1³ + 5³ + 3³.

```c run
#include <stdio.h>

int isArmstrong(int n) {
    int digits = 0, sum = 0;
    for (int t = n; t > 0; t /= 10) digits++;
    for (int t = n; t > 0; t /= 10) {
        int d = t % 10, p = 1;
        for (int i = 0; i < digits; i++) p *= d;
        sum += p;
    }
    return sum == n;
}

int main(void) {
    printf("Armstrong numbers below 10000: ");
    for (int i = 1; i < 10000; i++)
        if (isArmstrong(i)) printf("%d ", i);
    printf("\n");
    return 0;
}
```

## Mistakes that cost marks

| Mistake | Fix |
|---|---|
| `if (x = 5)` | `if (x == 5)` |
| `scanf("%d", x)` | `scanf("%d", &x)` |
| `scanf("%f", &d)` for a `double` | `%lf` |
| `for (i = 0; i <= n; i++)` on an array of `n` | `i < n` |
| `5 / 2` expecting 2.5 | `5.0 / 2` or a cast |
| `str1 == str2` | `strcmp(str1, str2) == 0` |
| missing `break` in `switch` | add `break;` after each case |
| `char s[5] = "Hello";` | needs 6 bytes for `'\0'` |
| using `gets` | `fgets(buf, size, stdin)` |
| `malloc` without `free` | free every block exactly once |

## Theory questions to prepare

1. Features of C and the structure of a C program.
2. Compilation stages: preprocessor, compiler, assembler, linker.
3. Difference between `while` and `do-while`; between `break` and `continue`.
4. Call by value vs call by reference with an example.
5. Recursion vs iteration.
6. Storage classes with scope, lifetime and default values.
7. Structure vs union.
8. `malloc` vs `calloc`; what a memory leak is.
9. File opening modes.
10. Macro vs function.

:::quiz Final check: mixed revision
Q. Which loop always executes at least once?
- `for`
- `while`
* `do-while`
- None
= The condition of a `do-while` is checked after the body.

Q. What does `printf("%d", 17 % 5 * 2);` print?
- 1
* 4
- 7
- 3
= `%` and `*` share a precedence level and run left to right: 17 % 5 = 2, then 2 × 2 = 4.

Q. Which statement correctly allocates an array of `n` doubles?
- `double *a = malloc(n);`
* `double *a = malloc(n * sizeof(double));`
- `double a = malloc(n * sizeof(double));`
- `double *a = calloc(sizeof(double));`
= `malloc` takes a byte count, so multiply the element count by the element size.

Q. Which is an Armstrong number?
- 123
* 370
- 100
- 222
= 3³ + 7³ + 0³ = 27 + 343 + 0 = 370.
:::
