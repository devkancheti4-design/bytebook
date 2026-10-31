=== pointers | Pointers
unit: Pointers & Memory
desc: Addresses, the & and * operators, pointer types, NULL, and pointer arithmetic — the idea that makes C powerful.

Every variable lives at some **address** in memory, like a house number. A **pointer** is a variable that stores an address. That one idea lets C build linked lists, pass big data without copying it, and talk directly to hardware.

## & and *

- `&x` — the **address-of** operator: "where does `x` live?"
- `*p` — the **dereference** operator: "the value stored at the address in `p`".

```c run vary
#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;            // p is a pointer to int, holding x's address

    printf("x  = %d\n", x);
    printf("&x = %p\n", (void *)&x);
    printf("p  = %p (the same address)\n", (void *)p);
    printf("*p = %d (the value at that address)\n", *p);

    *p = 25;                // change x through the pointer
    printf("x is now %d\n", x);
    return 0;
}
```

Addresses change every run, so your output will show different hex numbers. The picture below uses simple made-up addresses:

:::diagram memory
x | int | 0x1000 | 25
p | int * | 0x2000 | 0x1000 | x
caption: `p` stores the address of `x`, so `*p` and `x` are the same box of memory.
:::

## Declaring pointers

The type before `*` says what the pointer **points to**:

```c
int    *ip;     // points to an int
double *dp;     // points to a double
char   *cp;     // points to a char
int *a, b;      // careful: a is a pointer, b is a plain int!
```

All pointers are the same size (8 bytes on a 64-bit machine) because they all hold an address. The type matters for dereferencing and arithmetic.

## NULL and wild pointers

A pointer that has not been given an address yet should be set to `NULL` (address 0). Dereferencing `NULL` crashes the program immediately — which is much better than a **wild pointer** (uninitialised) that silently corrupts random memory.

```c run
#include <stdio.h>

int main(void) {
    int *p = NULL;
    if (p == NULL)
        printf("p points nowhere yet; do not dereference it.\n");
    int value = 42;
    p = &value;
    if (p != NULL)
        printf("Now *p = %d\n", *p);
    return 0;
}
```

:::mistake The three pointer bugs
- **Wild pointer**: `int *p; *p = 5;` — `p` holds a garbage address.
- **NULL dereference**: `int *p = NULL; printf("%d", *p);` — crash.
- **Dangling pointer**: pointing at memory that no longer exists, such as a local variable of a function that has returned, or memory you already `free`d.
:::

## Pointer arithmetic

Adding 1 to a pointer moves it to the **next element**, not the next byte. For an `int *` (4-byte ints), `p + 1` is 4 bytes further on.

```c run
#include <stdio.h>

int main(void) {
    int a[5] = {10, 20, 30, 40, 50};
    int *p = a;                     // same as &a[0]

    printf("*p       = %d\n", *p);
    printf("*(p + 1) = %d\n", *(p + 1));
    printf("*(p + 4) = %d\n", *(p + 4));
    p++;                            // move to the next int
    printf("after p++, *p = %d\n", *p);
    printf("byte distance between &a[3] and &a[0] = %td\n", (char *)&a[3] - (char *)&a[0]);
    printf("element distance = %td\n", &a[3] - &a[0]);
    return 0;
}
```

:::diagram array
values: 10 20 30 40 50
pointers: p=0 p+1=1 p+4=4
caption: `p + k` points `k` elements past `p`, whatever the element size.
:::

Allowed pointer operations: add or subtract an integer, subtract two pointers into the same array, and compare pointers. You cannot add, multiply or divide two pointers.

## Pointer to pointer

A pointer also lives at an address, so you can point to it:

```c run
#include <stdio.h>

int main(void) {
    int x = 7;
    int *p = &x;
    int **pp = &p;
    printf("x = %d, *p = %d, **pp = %d\n", x, *p, **pp);
    **pp = 99;
    printf("x after **pp = 99: %d\n", x);
    return 0;
}
```

:::diagram memory
x | int | 0x1000 | 99
p | int * | 0x2000 | 0x1000 | x
pp | int ** | 0x3000 | 0x2000 | p
caption: `pp` points to `p`, which points to `x`.
:::

## void pointers

A `void *` can hold the address of **any** type, but you must cast it before dereferencing. `malloc` returns `void *`, which is why it can allocate memory for anything.

```c run
#include <stdio.h>

int main(void) {
    int n = 5;
    double d = 2.5;
    void *vp = &n;
    printf("int via void*: %d\n", *(int *)vp);
    vp = &d;
    printf("double via void*: %.1f\n", *(double *)vp);
    return 0;
}
```

:::quiz
Q. If `int x = 5; int *p = &x;`, what is `*p`?
- The address of `x`
* 5
- The address of `p`
- Garbage
= `*p` dereferences the pointer, giving the value stored at `x`'s address.

Q. `int a[] = {2, 4, 6, 8}; int *p = a;` What is `*(p + 2)`?
- 4
* 6
- 8
- 2 + 2 = 4
= `p + 2` points two elements ahead, at `a[2]`, which is 6.

Q. On a machine with 4-byte ints, if `p` (an `int *`) holds address 1000, what does `p + 3` hold?
- 1003
- 1006
* 1012
- 3000
= Pointer arithmetic scales by the element size: 1000 + 3 × 4 = 1012.

Q. What is a dangling pointer?
- A pointer set to `NULL`
* A pointer to memory that has been freed or has gone out of scope
- A pointer to a pointer
- A `void *`
= The pointer still holds an address, but the memory there no longer belongs to you.
:::

=== pointers-functions | Pointers, Arrays & Functions
desc: Call by reference, the swap function, returning several results, how arrays decay to pointers, and pointers to strings.

## Call by reference

Functions receive **copies** of their arguments. To let a function change the caller's variable, pass its **address**, and have the function write through the pointer:

```c run
#include <stdio.h>

void swapWrong(int a, int b) { int t = a; a = b; b = t; }
void swap(int *a, int *b)    { int t = *a; *a = *b; *b = t; }

int main(void) {
    int x = 3, y = 8;
    swapWrong(x, y);
    printf("after swapWrong: x = %d, y = %d\n", x, y);
    swap(&x, &y);
    printf("after swap:      x = %d, y = %d\n", x, y);
    return 0;
}
```

:::exam Call by value vs call by reference
| Call by value | Call by reference |
|---|---|
| Pass the value: `f(x)` | Pass the address: `f(&x)` |
| Parameter is a copy: `int a` | Parameter is a pointer: `int *a` |
| Changes stay inside the function | Changes are visible to the caller |
| Safe, no side effects | Lets a function return several results |
:::

## Returning several results

A function can `return` only one value, but it can fill as many variables as you give it addresses of:

```c run
#include <stdio.h>

void stats(const int a[], int n, int *min, int *max, double *avg) {
    *min = *max = a[0];
    int sum = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] < *min) *min = a[i];
        if (a[i] > *max) *max = a[i];
        sum += a[i];
    }
    *avg = (double)sum / n;
}

int main(void) {
    int marks[] = {67, 91, 54, 78, 85};
    int lo, hi;
    double mean;
    stats(marks, 5, &lo, &hi, &mean);
    printf("min %d, max %d, average %.1f\n", lo, hi, mean);
    return 0;
}
```

`scanf("%d", &n)` works exactly this way — now you know why it needs `&`.

## Arrays and pointers

An array's name, used in an expression, **decays** to a pointer to its first element. These are all equivalent:

| Array notation | Pointer notation |
|---|---|
| `a[i]` | `*(a + i)` |
| `&a[i]` | `a + i` |
| `a[0]` | `*a` |

```c run
#include <stdio.h>

int sum(int *p, int n) {          // same as int p[]
    int s = 0;
    for (int i = 0; i < n; i++) s += *(p + i);
    return s;
}

int main(void) {
    int a[] = {5, 10, 15, 20};
    printf("a[2] = %d, *(a + 2) = %d, 2[a] = %d\n", a[2], *(a + 2), 2[a]);
    printf("sum = %d\n", sum(a, 4));
    printf("sum of last two = %d\n", sum(a + 2, 2));   // pass part of an array
    return 0;
}
```

(`2[a]` works because `a[i]` is defined as `*(a + i)`, and addition does not care about order. Fun fact, never write it in real code.)

:::warn An array is not a pointer
They behave alike in expressions, but: `sizeof(a)` gives the whole array's size while `sizeof(p)` gives 8; and `a = p;` is illegal because an array name is not a variable you can reassign.
:::

## Pointers and strings

A string literal can be referenced by a `char *`. Walking a string with a pointer is a very common C idiom:

```c run
#include <stdio.h>

int length(const char *s) {
    const char *start = s;
    while (*s) s++;               // stop at '\0'
    return (int)(s - start);
}

void toUpper(char *s) {
    for (; *s; s++)
        if (*s >= 'a' && *s <= 'z') *s -= 32;
}

int main(void) {
    char word[] = "pointer";
    printf("length = %d\n", length(word));
    toUpper(word);
    printf("upper  = %s\n", word);

    const char *greeting = "hello";   // points to read-only memory
    printf("%c%c\n", *greeting, *(greeting + 4));
    return 0;
}
```

:::mistake Modifying a string literal
`char *s = "hello"; s[0] = 'H';` is undefined behaviour — literals usually live in read-only memory and the program crashes. Use an array (`char s[] = "hello";`) when you need to change the text.
:::

## Arrays of pointers

An array of `char *` is the usual way to store a list of strings of different lengths:

```c run
#include <stdio.h>
#include <string.h>

int main(void) {
    const char *subjects[] = {"C", "Data Structures", "Discrete Mathematics", "Python"};
    int n = sizeof(subjects) / sizeof(subjects[0]);
    for (int i = 0; i < n; i++)
        printf("%d. %s (%zu chars)\n", i + 1, subjects[i], strlen(subjects[i]));
    return 0;
}
```

## Function pointers

Functions have addresses too. A **function pointer** lets you pass behaviour as an argument — this is how `qsort` lets you choose the sort order:

```c run
#include <stdio.h>
#include <stdlib.h>

int ascending(const void *a, const void *b)  { return *(const int *)a - *(const int *)b; }
int descending(const void *a, const void *b) { return *(const int *)b - *(const int *)a; }

void show(const int *a, int n) { for (int i = 0; i < n; i++) printf("%d ", a[i]); printf("\n"); }

int main(void) {
    int a[] = {42, 7, 19, 3, 88, 25};
    int n = 6;
    qsort(a, n, sizeof(int), ascending);
    show(a, n);
    qsort(a, n, sizeof(int), descending);
    show(a, n);

    int (*op)(const void *, const void *) = ascending;   // a variable holding a function
    printf("op(&a[0], &a[1]) = %d\n", op(&a[0], &a[1]) > 0);
    return 0;
}
```

:::quiz
Q. Which call lets `void inc(int *p) { (*p)++; }` change `n` in `main`?
- `inc(n);`
* `inc(&n);`
- `inc(*n);`
- `inc(n++);`
= The function needs `n`'s address, written `&n`.

Q. For `int a[5];`, which expression is the same as `a[3]`?
- `*a + 3`
* `*(a + 3)`
- `&a + 3`
- `a + 3`
= `a[i]` is defined as `*(a + i)`. `*a + 3` adds 3 to the first element's value.

Q. Why does `char *s = "hi"; s[0] = 'H';` usually crash?
- Pointers cannot be indexed
* String literals are stored in read-only memory
- `'H'` is not a valid character
- `s` is NULL
= Use `char s[] = "hi";` to get a writable copy on the stack.

Q. Inside `void f(int a[])`, what does `sizeof(a)` give on a 64-bit machine?
- The size of the whole array
* The size of a pointer (8 bytes)
- The number of elements
- 0
= The array decays to a pointer when passed, so the function only has an address.
:::

=== dynamic-memory | Dynamic Memory Allocation
desc: Ask for memory at run time with malloc, calloc and realloc, give it back with free, and avoid leaks and dangling pointers.

So far every array had a size fixed when you wrote the program. But often you only learn the size **while the program runs** — how many students in this class? How many lines in this file? **Dynamic memory allocation** asks the operating system for memory at run time, from a region called the **heap**.

## Stack vs heap

| | Stack | Heap |
|---|---|---|
| Used for | local variables, function calls | memory you request with `malloc` |
| Size | small (often 1–8 MB) | large (most of RAM) |
| Freed | automatically when the function returns | **only when you call `free`** |
| Speed | very fast | slower to allocate |

## malloc

`malloc(bytes)` returns a pointer to a block of uninitialised memory, or `NULL` if it fails. All four functions live in `stdlib.h`.

```c run stdin="5\n80 92 67 74 88"
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    printf("Number of students: ");
    scanf("%d", &n);

    int *marks = malloc(n * sizeof(int));     // room for n ints
    if (marks == NULL) {
        printf("Out of memory!\n");
        return 1;
    }

    printf("Enter %d marks: ", n);
    for (int i = 0; i < n; i++) scanf("%d", &marks[i]);   // use it like an array

    int total = 0;
    for (int i = 0; i < n; i++) total += marks[i];
    printf("Average: %.1f\n", (double)total / n);

    free(marks);          // give the memory back
    marks = NULL;         // avoid a dangling pointer
    return 0;
}
```

## calloc

`calloc(count, size)` allocates `count × size` bytes **and sets them all to zero**:

```c run
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *freq = calloc(10, sizeof(int));   // ten zeros
    int digits[] = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
    for (int i = 0; i < 11; i++) freq[digits[i]]++;
    for (int d = 0; d < 10; d++)
        if (freq[d]) printf("digit %d appears %d time(s)\n", d, freq[d]);
    free(freq);
    return 0;
}
```

## realloc

`realloc(ptr, newBytes)` resizes a block. It may move the data to a new address, so always use the pointer it returns. This is how growable arrays (like C++'s `vector` or Python's `list`) work underneath:

```c run
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacity = 2, size = 0;
    int *a = malloc(capacity * sizeof(int));
    for (int value = 1; value <= 9; value++) {
        if (size == capacity) {
            capacity *= 2;                                   // double when full
            int *bigger = realloc(a, capacity * sizeof(int));
            if (!bigger) { free(a); return 1; }
            a = bigger;
            printf("grew to capacity %d\n", capacity);
        }
        a[size++] = value * value;
    }
    for (int i = 0; i < size; i++) printf("%d ", a[i]);
    printf("\n");
    free(a);
    return 0;
}
```

## malloc vs calloc

| `malloc(n * size)` | `calloc(n, size)` |
|---|---|
| one argument: total bytes | two arguments: count and element size |
| memory contains garbage | memory is zeroed |
| slightly faster | safe default when you need zeros |

## Dynamic 2D arrays

Allocate an array of row pointers, then each row:

```c run
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int rows = 3, cols = 4;
    int **grid = malloc(rows * sizeof(int *));
    for (int i = 0; i < rows; i++) {
        grid[i] = malloc(cols * sizeof(int));
        for (int j = 0; j < cols; j++) grid[i][j] = i * cols + j;
    }
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) printf("%3d", grid[i][j]);
        printf("\n");
    }
    for (int i = 0; i < rows; i++) free(grid[i]);   // free rows first
    free(grid);                                     // then the row array
    return 0;
}
```

## Memory leaks

A **memory leak** happens when you lose the last pointer to a block without freeing it. The memory stays reserved until the program ends. In long-running programs (servers, games) leaks slowly eat all RAM.

```c
void leaky(void) {
    int *p = malloc(100 * sizeof(int));
    // ... use p ...
    // forgot free(p): when the function returns, p disappears but the block stays
}
```

:::key Golden rules
1. Check every `malloc`/`calloc`/`realloc` result for `NULL`.
2. Every `malloc` needs exactly one matching `free`.
3. Never use memory after `free` (set the pointer to `NULL`).
4. Never `free` the same block twice, or free memory you did not allocate.
:::

:::tip Finding leaks
On Linux, run your program with `valgrind ./prog`, or compile with `-fsanitize=address`. Both report leaks and use-after-free bugs with exact line numbers.
:::

:::quiz
Q. What does `malloc` return when it cannot allocate memory?
- 0 bytes of memory
* `NULL`
- −1
- It crashes the program
= Always check the pointer against `NULL` before using it.

Q. Which function returns zero-filled memory?
- `malloc`
* `calloc`
- `realloc`
- `free`
= `calloc` initialises every byte to zero; `malloc` leaves garbage.

Q. After `free(p);`, what is `p`?
- Automatically `NULL`
* A dangling pointer that still holds the old address
- Pointing to a new block
- A compile error
= `free` does not change `p`. Set it to `NULL` yourself to avoid accidental reuse.

Q. Why must you use the return value of `realloc`?
* It may move the block to a new address
- It returns the old size
- It frees the original block only on success
- It always returns the same pointer
= If the block cannot grow in place, `realloc` copies the data elsewhere and returns the new address.
:::
