=== if-else | If, Else & Switch
unit: Control Flow
desc: Make decisions with `if`, `else if`, nested conditions and `switch` — with the classic grade, leap-year and calculator programs.

Programs become useful when they can **decide**. C runs a block of code only when a condition is **true** (any non-zero value) and skips it when the condition is **false** (zero).

## if

```c run stdin="17"
#include <stdio.h>

int main(void) {
    int age;
    printf("Age: ");
    scanf("%d", &age);
    if (age >= 18) {
        printf("You can vote.\n");
    }
    printf("Thanks for checking!\n");
    return 0;
}
```

The braces can be dropped when the block has exactly one statement, but keeping them avoids bugs when you later add a second line.

## if...else

```c run stdin="-7"
#include <stdio.h>

int main(void) {
    int n;
    printf("Enter a number: ");
    scanf("%d", &n);
    if (n % 2 == 0)
        printf("%d is even\n", n);
    else
        printf("%d is odd\n", n);
    return 0;
}
```

## else if ladders

Check conditions top to bottom; the first true one wins and the rest are skipped.

```c run stdin="83"
#include <stdio.h>

int main(void) {
    int marks;
    printf("Marks out of 100: ");
    scanf("%d", &marks);

    if (marks < 0 || marks > 100)
        printf("Invalid marks\n");
    else if (marks >= 90)
        printf("Grade O (Outstanding)\n");
    else if (marks >= 80)
        printf("Grade A+\n");
    else if (marks >= 70)
        printf("Grade A\n");
    else if (marks >= 60)
        printf("Grade B+\n");
    else if (marks >= 40)
        printf("Grade P (Pass)\n");
    else
        printf("Grade F (Fail)\n");
    return 0;
}
```

## Nested if: the leap-year program

A year is a leap year if it is divisible by 4, **except** century years, which must be divisible by 400. This is one of the most-asked programs in CSE 101 exams.

```c run stdin="1900"
#include <stdio.h>

int main(void) {
    int year;
    printf("Year: ");
    scanf("%d", &year);
    if (year % 4 == 0) {
        if (year % 100 == 0) {
            if (year % 400 == 0)
                printf("%d is a leap year\n", year);
            else
                printf("%d is not a leap year\n", year);
        } else {
            printf("%d is a leap year\n", year);
        }
    } else {
        printf("%d is not a leap year\n", year);
    }
    return 0;
}
```

The same logic fits in one condition: `(year % 4 == 0 && year % 100 != 0) || year % 400 == 0`.

:::mistake = is not ==
`if (x = 5)` **assigns** 5 to `x` and is always true. To compare, write `if (x == 5)`. Many programmers write `if (5 == x)` so that a missing `=` becomes a compile error.
:::

## switch

When you compare **one integer or character** against many fixed values, `switch` is cleaner than a long `else if` ladder:

```c run stdin="12 4\n/"
#include <stdio.h>

int main(void) {
    double a, b;
    char op;
    printf("Enter two numbers: ");
    scanf("%lf %lf", &a, &b);
    printf("Operator (+ - * /): ");
    scanf(" %c", &op);

    switch (op) {
        case '+': printf("%.2f\n", a + b); break;
        case '-': printf("%.2f\n", a - b); break;
        case '*': printf("%.2f\n", a * b); break;
        case '/':
            if (b != 0) printf("%.2f\n", a / b);
            else        printf("Cannot divide by zero\n");
            break;
        default:  printf("Unknown operator %c\n", op);
    }
    return 0;
}
```

Rules to remember:

- The `switch` expression must be an integer type (`int`, `char`, `enum`) — not `float` or a string.
- Each `case` label must be a constant, and labels must be unique.
- `break` exits the switch. **Without it, execution falls through** into the next case.
- `default` runs when no case matches. It is optional and can appear anywhere.

Fall-through is occasionally useful — for grouping cases:

```c run stdin="e"
#include <stdio.h>

int main(void) {
    char ch;
    printf("Letter: ");
    scanf(" %c", &ch);
    switch (ch) {
        case 'a': case 'e': case 'i': case 'o': case 'u':
        case 'A': case 'E': case 'I': case 'O': case 'U':
            printf("%c is a vowel\n", ch);
            break;
        default:
            printf("%c is a consonant\n", ch);
    }
    return 0;
}
```

:::exam if-else vs switch
| `if-else` | `switch` |
|---|---|
| Tests any condition, including ranges (`x > 10`) | Tests equality with constant values only |
| Works with `float`, `double` and pointers | Only integer types and `char` |
| Evaluated top to bottom | Often compiled into a fast jump table |
:::

:::quiz
Q. What does this print?
```c
int x = 0;
if (x = 0) printf("A");
else printf("B");
```
- `A`
* `B`
- Nothing
- Compile error
= `x = 0` assigns 0, and the value of the assignment (0) is false, so the `else` runs. This is the classic `=` versus `==` bug.

Q. What happens if you leave out `break` at the end of a `case`?
- Compile error
- The switch exits anyway
* Execution falls through into the next case
- The `default` case runs
= Without `break`, C keeps executing the following case's statements.

Q. Which of these **cannot** be used as a `switch` expression?
- `int n`
- `char c`
* `float f`
- `n % 3`
= `switch` only works with integer types. Floating-point values are not allowed.

Q. Is 2000 a leap year?
* Yes, because it is divisible by 400
- No, because century years are never leap years
- No, because it is not divisible by 3
- Yes, but only because it is divisible by 4
= Century years are leap years only when divisible by 400. 2000 qualifies; 1900 does not.
:::

=== loops | Loops: while, do-while and for
desc: Repeat work with the three C loops, choose the right one, and write the classic digit, factorial, prime and Fibonacci programs.

A **loop** repeats a block of code while a condition stays true. C has three loops. They can all do the same job; each one simply fits a different situation.

## while

A `while` loop checks its condition **before** each pass. Use it when you do not know in advance how many times to repeat.

```c run stdin="40213"
#include <stdio.h>

int main(void) {
    int n, sum = 0, count = 0;
    printf("Enter a number: ");
    scanf("%d", &n);
    while (n > 0) {
        sum += n % 10;      // take the last digit
        n /= 10;            // drop the last digit
        count++;
    }
    printf("Digits: %d, Sum of digits: %d\n", count, sum);
    return 0;
}
```

## do...while

A `do-while` loop checks its condition **after** each pass, so the body always runs **at least once**. That makes it perfect for menus:

```c run stdin="1\n2\n3"
#include <stdio.h>

int main(void) {
    int choice;
    do {
        printf("1) Say hi  2) Say bye  3) Quit : ");
        scanf("%d", &choice);
        if (choice == 1) printf("Hi!\n");
        else if (choice == 2) printf("Bye!\n");
    } while (choice != 3);
    printf("Menu closed.\n");
    return 0;
}
```

## for

A `for` loop packs the three parts of counting into one line: **initialise**; **condition**; **update**.

```c run
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        printf("5 x %d = %d\n", i, 5 * i);
    }
    return 0;
}
```

The order is: initialise once → check condition → run body → update → check condition → … until the condition is false.

:::diagram flow
start: Start
process: Initialise: i = 1
decision: i <= 5 ?
loop: Run the body, then i++
end: Continue after the loop
caption: How a `for` loop runs. After the body and `i++`, control jumps back to the condition.
:::

## Choosing a loop

| Loop | Checks condition | Runs at least once? | Best for |
|---|---|---|---|
| `for` | before each pass | no | counting a known number of times |
| `while` | before each pass | no | repeating until something happens |
| `do-while` | after each pass | **yes** | menus, input validation |

## Classic loop programs

### Factorial

```c run stdin="10"
#include <stdio.h>

int main(void) {
    int n;
    long long fact = 1;     // factorials grow fast, so use a big type
    printf("n = ");
    scanf("%d", &n);
    for (int i = 2; i <= n; i++)
        fact *= i;
    printf("%d! = %lld\n", n, fact);
    return 0;
}
```

### Prime check

A number is prime if no number from 2 to √n divides it. Checking only up to √n makes the loop much faster:

```c run stdin="97"
#include <stdio.h>

int main(void) {
    int n, isPrime = 1;
    printf("n = ");
    scanf("%d", &n);
    if (n < 2) isPrime = 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) { isPrime = 0; break; }
    }
    printf("%d is %s\n", n, isPrime ? "prime" : "not prime");
    return 0;
}
```

### Fibonacci series

```c run stdin="10"
#include <stdio.h>

int main(void) {
    int n, a = 0, b = 1;
    printf("How many terms? ");
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        printf("%d ", a);
        int next = a + b;
        a = b;
        b = next;
    }
    printf("\n");
    return 0;
}
```

### Reverse a number and check palindrome

```c run stdin="12321"
#include <stdio.h>

int main(void) {
    int n, original, reversed = 0;
    printf("n = ");
    scanf("%d", &n);
    original = n;
    while (n > 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }
    printf("Reversed: %d\n", reversed);
    printf("%d %s a palindrome\n", original, original == reversed ? "is" : "is not");
    return 0;
}
```

:::mistake Off-by-one and infinite loops
`for (i = 0; i <= 10; i++)` runs **11** times, not 10. And a loop whose condition never becomes false — like `while (n > 0)` without changing `n` — runs forever. In the playground, a runaway program is stopped automatically.
:::

:::tip Variables declared in the loop header
`for (int i = 0; ...)` creates `i` only inside the loop (C99 and later). If you need the final value of `i` after the loop, declare it before.
:::

:::quiz
Q. How many times does this print `Hi`?
```c
int i = 10;
do { printf("Hi"); } while (i < 5);
```
- 0
* 1
- 5
- Infinite
= A `do-while` loop runs its body once before checking the condition.

Q. How many times does `for (int i = 0; i <= 10; i += 2)` run?
- 5
* 6
- 10
- 11
= `i` takes the values 0, 2, 4, 6, 8 and 10: six passes.

Q. Why does the prime check loop use `i * i <= n`?
- To avoid using `sqrt`, which C does not have
* Any factor larger than √n pairs with one smaller than √n, so checking up to √n is enough
- It finds factors twice as fast by skipping even numbers
- It is required by the C standard
= If `n = a × b` and both were above √n, their product would exceed `n`. So a factor ≤ √n must exist if `n` is composite.

Q. Which loop is best for a menu that must appear at least once?
- `for`
- `while`
* `do-while`
- None of them
= `do-while` always executes its body once before testing the condition.
:::

=== jumps-patterns | Break, Continue & Pattern Programs
desc: Control loops with `break`, `continue` and `goto`, then master nested loops through the star and number patterns every exam asks for.

## break

`break` ends the nearest loop (or `switch`) immediately:

```c run
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; i++) {
        if (i == 6) break;
        printf("%d ", i);
    }
    printf("\nLoop ended early.\n");
    return 0;
}
```

## continue

`continue` skips the rest of the **current** pass and jumps to the next one:

```c run
#include <stdio.h>

int main(void) {
    printf("Odd numbers below 12: ");
    for (int i = 1; i < 12; i++) {
        if (i % 2 == 0) continue;
        printf("%d ", i);
    }
    printf("\n");
    return 0;
}
```

:::note goto
C also has `goto label;`, which jumps to `label:` anywhere in the same function. It makes code hard to follow, so avoid it. The one accepted use is breaking out of deeply nested loops in a single jump.
:::

## Nested loops

A loop inside another loop runs its inner body **rows × columns** times. The outer loop usually picks the **row**; the inner loop prints the **columns** of that row. That is the whole secret of pattern programs.

```c run
#include <stdio.h>

int main(void) {
    for (int row = 1; row <= 3; row++) {
        for (int col = 1; col <= 4; col++)
            printf("(%d,%d) ", row, col);
        printf("\n");
    }
    return 0;
}
```

## Pattern 1: right triangle

Row `i` has `i` stars.

```c run
#include <stdio.h>

int main(void) {
    int n = 5;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++)
            printf("* ");
        printf("\n");
    }
    return 0;
}
```

## Pattern 2: number triangle and Floyd's triangle

```c run
#include <stdio.h>

int main(void) {
    int n = 4, k = 1;
    for (int i = 1; i <= n; i++) {          // 1 / 1 2 / 1 2 3 ...
        for (int j = 1; j <= i; j++) printf("%d ", j);
        printf("\n");
    }
    printf("\n");
    for (int i = 1; i <= n; i++) {          // Floyd: keep counting across rows
        for (int j = 1; j <= i; j++) printf("%-3d", k++);
        printf("\n");
    }
    return 0;
}
```

## Pattern 3: pyramid

Each row needs **spaces** first, then stars. For `n` rows, row `i` has `n - i` spaces and `2i - 1` stars.

```c run
#include <stdio.h>

int main(void) {
    int n = 5;
    for (int i = 1; i <= n; i++) {
        for (int s = 1; s <= n - i; s++) printf(" ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("*");
        printf("\n");
    }
    return 0;
}
```

## Pattern 4: diamond

A diamond is a pyramid followed by an upside-down pyramid:

```c run
#include <stdio.h>

int main(void) {
    int n = 4;
    for (int i = 1; i <= n; i++) {
        for (int s = 0; s < n - i; s++) printf(" ");
        for (int j = 0; j < 2 * i - 1; j++) printf("*");
        printf("\n");
    }
    for (int i = n - 1; i >= 1; i--) {
        for (int s = 0; s < n - i; s++) printf(" ");
        for (int j = 0; j < 2 * i - 1; j++) printf("*");
        printf("\n");
    }
    return 0;
}
```

## Pattern 5: Pascal's triangle

Each number is the sum of the two above it. Using the formula C(i, j+1) = C(i, j) × (i − j) / (j + 1) we can print each row without storing earlier rows:

```c run
#include <stdio.h>

int main(void) {
    int n = 6;
    for (int i = 0; i < n; i++) {
        for (int s = 0; s < n - i - 1; s++) printf("  ");
        int c = 1;
        for (int j = 0; j <= i; j++) {
            printf("%4d", c);
            c = c * (i - j) / (j + 1);
        }
        printf("\n");
    }
    return 0;
}
```

:::tip How to crack any pattern question
1. Count the rows: that is your outer loop.
2. For row `i`, write down how many spaces and how many symbols it has.
3. Turn those counts into formulas in `i` (like `n - i` and `2*i - 1`).
4. Write one inner loop per formula, then `printf("\n")`.
:::

:::quiz
Q. What does this print?
```c
for (int i = 1; i <= 5; i++) {
    if (i == 3) continue;
    printf("%d", i);
}
```
- `12`
* `1245`
- `12345`
- `345`
= `continue` skips only the pass where `i == 3`.

Q. How many stars does this print in total?
```c
for (int i = 1; i <= 4; i++)
    for (int j = 1; j <= i; j++)
        printf("*");
```
- 4
- 8
* 10
- 16
= Row `i` prints `i` stars: 1 + 2 + 3 + 4 = 10.

Q. In a 5-row centred pyramid, how many stars are on row 3?
- 3
* 5
- 6
- 7
= Row `i` has `2i − 1` stars, so row 3 has 5.

Q. Which statement about `break` is true?
- It exits all nested loops at once
* It exits only the innermost loop or switch that contains it
- It skips to the next iteration
- It ends the whole program
= `break` leaves only the closest enclosing loop or `switch`. `continue` skips to the next iteration.
:::
