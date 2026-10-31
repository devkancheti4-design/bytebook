=== arrays | Arrays
unit: Arrays & Strings
desc: Store many values of one type under one name: declaring, indexing, looping, and the sum, max, search and reverse programs.

An **array** stores many values of the same type in **one contiguous block of memory**, under one name. Instead of `mark1`, `mark2`, `mark3`… you write `marks[0]`, `marks[1]`, `marks[2]`.

```c run
#include <stdio.h>

int main(void) {
    int marks[5] = {78, 92, 65, 88, 71};
    printf("First mark: %d\n", marks[0]);
    printf("Last mark:  %d\n", marks[4]);
    marks[2] = 70;                    // change one element
    for (int i = 0; i < 5; i++)
        printf("marks[%d] = %d\n", i, marks[i]);
    return 0;
}
```

:::diagram array
values: 78 92 70 88 71
label: marks
caption: `int marks[5]` — five ints side by side in memory. Indexes run from **0** to **size − 1**.
:::

## Declaring and initialising

```c
int a[5];                       // 5 ints, values are garbage (if local)
int b[5] = {1, 2, 3, 4, 5};     // fully initialised
int c[5] = {1, 2};              // rest become 0  -> {1, 2, 0, 0, 0}
int d[5] = {0};                 // all zeros
int e[] = {4, 8, 15, 16, 23};   // size worked out from the list: 5
```

The number of elements is `sizeof(arr) / sizeof(arr[0])` — handy when you initialise without writing the size.

:::warn C does not check bounds
Reading or writing `marks[5]` in a 5-element array is **undefined behaviour**. C will not stop you; it silently touches whatever memory comes next and may crash much later. Always loop with `i < size`, never `i <= size`.
:::

## Reading an array and finding sum, average, max and min

```c run stdin="6\n45 12 89 33 89 7"
#include <stdio.h>

int main(void) {
    int n, a[100];
    printf("How many numbers? ");
    scanf("%d", &n);
    printf("Enter %d numbers: ", n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);

    int sum = 0, max = a[0], min = a[0];
    for (int i = 0; i < n; i++) {
        sum += a[i];
        if (a[i] > max) max = a[i];
        if (a[i] < min) min = a[i];
    }
    printf("Sum = %d, Average = %.2f\n", sum, (float)sum / n);
    printf("Max = %d, Min = %d\n", max, min);
    return 0;
}
```

## Linear search

Check each element until you find the target. In the worst case you look at all `n` elements: **O(n)**.

```c run
#include <stdio.h>

int linearSearch(int a[], int n, int key) {
    for (int i = 0; i < n; i++)
        if (a[i] == key) return i;     // found: return its index
    return -1;                         // not found
}

int main(void) {
    int a[] = {14, 3, 27, 9, 41, 6};
    int n = sizeof(a) / sizeof(a[0]);
    printf("27 found at index %d\n", linearSearch(a, n, 27));
    printf("50 found at index %d\n", linearSearch(a, n, 50));
    return 0;
}
```

Notice how arrays are passed to functions: `int a[]` plus the size `n`. Inside the function, `sizeof(a)` would **not** give the array size — the function only receives the address of the first element. That is why the size is passed separately.

## Reverse an array in place

Swap the first and last, then the second and second-last, meeting in the middle:

```c run
#include <stdio.h>

int main(void) {
    int a[] = {1, 2, 3, 4, 5, 6, 7};
    int n = 7;
    for (int i = 0, j = n - 1; i < j; i++, j--) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
```

## Counting frequencies

Use a second array as a tally. Here `count[d]` counts how often digit `d` appears:

```c run
#include <stdio.h>

int main(void) {
    int votes[] = {2, 3, 2, 1, 2, 3, 3, 3, 0, 2};
    int count[4] = {0};
    for (int i = 0; i < 10; i++) count[votes[i]]++;
    for (int c = 0; c < 4; c++) printf("Candidate %d: %d votes\n", c, count[c]);
    return 0;
}
```

:::exam Programs to practise
Second-largest element · remove duplicates · rotate an array by k · merge two sorted arrays · bubble sort (covered in [Data Structures](@dsa/sorting-basic)).
:::

:::quiz
Q. What is the index of the last element in `int a[10];`?
- 10
* 9
- 11
- 1
= Indexes start at 0, so the last valid index is size − 1 = 9.

Q. What does `int a[5] = {3, 4};` contain?
- `{3, 4, garbage, garbage, garbage}`
* `{3, 4, 0, 0, 0}`
- `{3, 4, 3, 4, 3}`
- A compile error
= When an initialiser list is shorter than the array, the remaining elements are set to 0.

Q. Why do functions that take arrays usually also take the size?
* The function only receives the address of the first element, so it cannot know the length
- C arrays store their size at index 0
- It makes the function faster
- `sizeof` does not work in C
= Arrays decay to pointers when passed, so `sizeof` inside the function gives the pointer size, not the array size.

Q. What is the worst-case time of linear search on `n` elements?
- O(1)
- O(log n)
* O(n)
- O(n²)
= In the worst case (key absent or last) every element is checked once.
:::

=== 2d-arrays | 2D Arrays & Matrices
desc: Rows and columns: declaring 2D arrays, reading matrices, and the addition, transpose, multiplication and diagonal-sum programs.

A **2D array** is an array of arrays — a grid with rows and columns. It is how C represents matrices, game boards, seating charts and images.

```c run
#include <stdio.h>

int main(void) {
    int m[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    printf("Row 1, column 2: %d\n", m[1][2]);
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++)
            printf("%4d", m[i][j]);
        printf("\n");
    }
    return 0;
}
```

:::diagram matrix
rows: 1 2 3 4 | 5 6 7 8 | 9 10 11 12
highlight: 1,2
label: m
caption: `m[1][2]` is row 1, column 2 — the value 7. The first index is the row, the second is the column.
:::

## How it sits in memory

Memory is one long line, so C stores 2D arrays in **row-major order**: all of row 0, then all of row 1, and so on. Element `m[i][j]` lives at position `i * COLS + j` from the start. That is why, when you pass a 2D array to a function, you must give the column count: `void print(int m[][4], int rows)`.

## Matrix addition

```c run
#include <stdio.h>
#define R 2
#define C 3

int main(void) {
    int a[R][C] = {{1, 2, 3}, {4, 5, 6}};
    int b[R][C] = {{6, 5, 4}, {3, 2, 1}};
    int sum[R][C];
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            sum[i][j] = a[i][j] + b[i][j];
    for (int i = 0; i < R; i++) {
        for (int j = 0; j < C; j++) printf("%3d", sum[i][j]);
        printf("\n");
    }
    return 0;
}
```

## Transpose

The transpose swaps rows and columns: `t[j][i] = a[i][j]`. A 2×3 matrix becomes 3×2.

```c run
#include <stdio.h>

int main(void) {
    int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int t[3][2];
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 3; j++)
            t[j][i] = a[i][j];
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 2; j++) printf("%3d", t[i][j]);
        printf("\n");
    }
    return 0;
}
```

## Matrix multiplication

To multiply an `r1 × c1` matrix by a `c1 × c2` matrix, each result cell is a **row × column dot product**: `c[i][j] = Σ a[i][k] × b[k][j]`. Multiplication is only possible when the first matrix's columns equal the second's rows.

```c run stdin="2 3\n1 2 3\n4 5 6\n3 2\n7 8\n9 10\n11 12"
#include <stdio.h>

int main(void) {
    int r1, c1, r2, c2, a[10][10], b[10][10], c[10][10];
    printf("Rows and columns of A: ");
    scanf("%d %d", &r1, &c1);
    printf("Enter A:\n");
    for (int i = 0; i < r1; i++) for (int j = 0; j < c1; j++) scanf("%d", &a[i][j]);
    printf("Rows and columns of B: ");
    scanf("%d %d", &r2, &c2);
    if (c1 != r2) { printf("Cannot multiply: %d != %d\n", c1, r2); return 0; }
    printf("Enter B:\n");
    for (int i = 0; i < r2; i++) for (int j = 0; j < c2; j++) scanf("%d", &b[i][j]);

    for (int i = 0; i < r1; i++)
        for (int j = 0; j < c2; j++) {
            c[i][j] = 0;
            for (int k = 0; k < c1; k++)
                c[i][j] += a[i][k] * b[k][j];
        }

    printf("A x B =\n");
    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) printf("%5d", c[i][j]);
        printf("\n");
    }
    return 0;
}
```

The three nested loops make this **O(n³)** for square matrices.

## Diagonal sums

```c run
#include <stdio.h>

int main(void) {
    int m[3][3] = {{2, 7, 6}, {9, 5, 1}, {4, 3, 8}};
    int main_d = 0, anti_d = 0;
    for (int i = 0; i < 3; i++) {
        main_d += m[i][i];
        anti_d += m[i][3 - 1 - i];
    }
    printf("Main diagonal = %d, anti-diagonal = %d\n", main_d, anti_d);
    return 0;
}
```

(That matrix is a magic square — every row, column and diagonal adds up to 15.)

:::quiz
Q. How many elements does `int g[4][6];` hold?
- 10
* 24
- 20
- 30
= 4 rows × 6 columns = 24 elements.

Q. In row-major order, which element comes right after `m[0][2]` in memory for `int m[3][3]`?
- `m[1][2]`
* `m[1][0]`
- `m[0][3]`
- `m[2][0]`
= Row 0 ends at `m[0][2]`, so the next element in memory is the start of row 1.

Q. Can a 2×3 matrix be multiplied by a 2×3 matrix?
- Yes, always
* No, the first matrix's columns (3) must equal the second's rows (2)
- Only if both are square
- Yes, the result is 2×3
= Matrix multiplication needs c₁ = r₂.

Q. When passing `int m[5][8]` to a function, what must the parameter specify?
- Both dimensions
- Neither dimension
* At least the number of columns, e.g. `int m[][8]`
- Only the number of rows
= The compiler needs the column count to compute where each row starts.
:::

=== strings | Strings
desc: Character arrays ending in '\0': reading strings, the string.h functions, and writing length, reverse, palindrome and vowel-count programs yourself.

C has no special string type. A **string** is a `char` array that ends with the **null character** `'\0'`. Every string function relies on that terminator to know where the text stops.

```c run
#include <stdio.h>

int main(void) {
    char name[] = "ASHA";            // the compiler adds '\0' for you
    printf("%s has %zu bytes of storage\n", name, sizeof(name));
    for (int i = 0; name[i] != '\0'; i++)
        printf("name[%d] = '%c' (%d)\n", i, name[i], name[i]);
    return 0;
}
```

:::diagram array
values: A S H A \0
label: name
highlight: 4
caption: `char name[] = "ASHA"` takes 5 bytes: four letters plus the terminating `'\0'`.
:::

## Declaring strings

```c
char a[20] = "Hello";        // 20 bytes, "Hello" + '\0' + unused space
char b[] = "Hello";          // exactly 6 bytes
char c[] = {'H', 'i', '\0'}; // character by character — don't forget '\0'
```

:::mistake Comparing and copying with = and ==
`if (a == b)` compares **addresses**, not the text. `a = "Hi";` does not compile for an array. Use `strcmp` and `strcpy`.
:::

## string.h functions

| Function | What it does |
|---|---|
| `strlen(s)` | length, not counting `'\0'` |
| `strcpy(dst, src)` | copy `src` into `dst` |
| `strncpy(dst, src, n)` | copy at most `n` characters |
| `strcat(dst, src)` | append `src` to the end of `dst` |
| `strcmp(a, b)` | 0 if equal, negative if `a` < `b`, positive if `a` > `b` (dictionary order) |
| `strchr(s, c)` | pointer to first `c` in `s`, or `NULL` |
| `strstr(s, t)` | pointer to first occurrence of `t` in `s`, or `NULL` |

```c run
#include <stdio.h>
#include <string.h>

int main(void) {
    char first[30] = "Data";
    char second[] = "Structures";
    printf("Length of \"%s\": %zu\n", first, strlen(first));
    strcat(first, " ");
    strcat(first, second);
    printf("Joined: %s\n", first);

    char copy[30];
    strcpy(copy, first);
    printf("Copy: %s\n", copy);

    printf("strcmp(\"apple\", \"banana\") = %d\n", strcmp("apple", "banana") < 0 ? -1 : 1);
    printf("strcmp(\"cat\", \"cat\") = %d\n", strcmp("cat", "cat"));
    printf("Found \"Struct\" at position %td\n", strstr(first, "Struct") - first);
    return 0;
}
```

:::note strcmp's exact value
The C standard only promises the **sign** of `strcmp`'s result (negative, zero or positive), not the exact number. Always test `strcmp(a, b) == 0` or `< 0`, never `== -1`.
:::

## Write them yourself

Exams frequently say "**without using library functions**". These four are the most common:

```c run
#include <stdio.h>

int myStrlen(const char s[]) {
    int n = 0;
    while (s[n] != '\0') n++;
    return n;
}

void myReverse(char s[]) {
    for (int i = 0, j = myStrlen(s) - 1; i < j; i++, j--) {
        char t = s[i]; s[i] = s[j]; s[j] = t;
    }
}

int isPalindrome(const char s[]) {
    for (int i = 0, j = myStrlen(s) - 1; i < j; i++, j--)
        if (s[i] != s[j]) return 0;
    return 1;
}

int countVowels(const char s[]) {
    int v = 0;
    for (int i = 0; s[i]; i++) {
        char c = s[i] | 32;           // quick lowercase for letters
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') v++;
    }
    return v;
}

int main(void) {
    char word[] = "Programming";
    printf("Length: %d\n", myStrlen(word));
    printf("Vowels: %d\n", countVowels(word));
    myReverse(word);
    printf("Reversed: %s\n", word);
    printf("\"madam\" palindrome? %s\n", isPalindrome("madam") ? "yes" : "no");
    printf("\"kalvium\" palindrome? %s\n", isPalindrome("kalvium") ? "yes" : "no");
    return 0;
}
```

## Changing case with ctype.h

```c run stdin="Hello, CSE 101!"
#include <stdio.h>
#include <ctype.h>
#include <string.h>

int main(void) {
    char line[100];
    int letters = 0, digits = 0, spaces = 0;
    printf("Type a line: ");
    fgets(line, sizeof line, stdin);
    line[strcspn(line, "\n")] = '\0';
    for (int i = 0; line[i]; i++) {
        if (isalpha((unsigned char)line[i])) letters++;
        else if (isdigit((unsigned char)line[i])) digits++;
        else if (line[i] == ' ') spaces++;
        line[i] = toupper((unsigned char)line[i]);
    }
    printf("Upper case: %s\n", line);
    printf("Letters %d, digits %d, spaces %d\n", letters, digits, spaces);
    return 0;
}
```

## Arrays of strings

A list of words is a 2D `char` array — one row per word:

```c run
#include <stdio.h>

int main(void) {
    char days[7][10] = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
    for (int i = 0; i < 7; i++)
        printf("%d: %s\n", i + 1, days[i]);
    return 0;
}
```

:::quiz
Q. How many bytes does `char s[] = "C101";` occupy?
- 4
* 5
- 6
- 8
= Four characters plus the terminating `'\0'`.

Q. What does `strlen("Kalvium")` return?
* 7
- 8
- 6
- 9
= `strlen` counts characters before `'\0'` and does not include it.

Q. How should you check if two strings `a` and `b` have the same text?
- `if (a == b)`
- `if (a = b)`
* `if (strcmp(a, b) == 0)`
- `if (strlen(a) == strlen(b))`
= `==` compares addresses. `strcmp` returns 0 when the contents match.

Q. What does `'\0'` mark?
- A new line
- A space
* The end of a string
- A tab
= Every C string ends with the null character so functions know where to stop.
:::
