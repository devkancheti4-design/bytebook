=== conditions | If, Elif, Else & match
unit: Control Flow
desc: Decisions in Python: if/elif/else, nested conditions, the conditional expression, and structural pattern matching with match/case.

```python run stdin="73"
marks = int(input("Marks: "))
if marks >= 90:
    grade = "O"
elif marks >= 80:
    grade = "A+"
elif marks >= 70:
    grade = "A"
elif marks >= 60:
    grade = "B+"
elif marks >= 40:
    grade = "P"
else:
    grade = "F"
print("Grade:", grade)
```

Key points:

- A colon `:` ends the condition line; the block is the indented lines below.
- `elif` (else-if) can repeat; `else` is optional and comes last.
- Conditions can be any value — Python uses its **truthiness**.

## Nested conditions and combining tests

```python run
def leap_year(y):
    return (y % 4 == 0 and y % 100 != 0) or y % 400 == 0

for year in (1900, 2000, 2024, 2026):
    print(year, "leap" if leap_year(year) else "not leap")

age, has_id = 20, True
if age >= 18:
    if has_id:
        print("Entry allowed")
    else:
        print("Show an ID")
else:
    print("Too young")
```

## The conditional expression

`value_if_true if condition else value_if_false` — Python's version of C's `?:`:

```python run
n = 7
parity = "even" if n % 2 == 0 else "odd"
print(f"{n} is {parity}")
print(max(3, 9), min(3, 9))      # built-ins often replace simple ifs
```

## match / case (Python 3.10+)

`match` compares a value against **patterns** — like C's `switch`, but more powerful. There is no fall-through, so no `break` is needed.

```python run
def describe(command):
    match command.split():
        case ["quit"] | ["exit"]:
            return "Goodbye"
        case ["go", direction]:
            return f"Moving {direction}"
        case ["add", x, y]:
            return f"{x} + {y} = {int(x) + int(y)}"
        case []:
            return "Say something"
        case _:                       # the wildcard: matches anything
            return f"Unknown command: {command}"

for cmd in ["go north", "add 4 5", "exit", "dance", ""]:
    print(repr(cmd), "->", describe(cmd))
```

A simple value match looks just like a switch:

```python run
def day_type(day):
    match day:
        case "Sat" | "Sun":
            return "weekend"
        case "Mon" | "Tue" | "Wed" | "Thu" | "Fri":
            return "weekday"
        case _:
            return "not a day"

print(day_type("Sun"), day_type("Wed"), day_type("Funday"))
```

:::mistake Using = in a condition
`if x = 5:` is a **syntax error** in Python, which protects you from C's classic bug. Use `==` to compare. (The walrus operator `:=` exists for assignments inside expressions, but use it sparingly.)
:::

:::quiz
Q. What is printed?
```python
x = 0
if x:
    print("A")
elif x == 0:
    print("B")
else:
    print("C")
```
- A
* B
- C
- Nothing
= 0 is falsy, so the first branch is skipped and `x == 0` is true.

Q. What is `"pass" if 35 >= 40 else "fail"`?
- `"pass"`
* `"fail"`
- `True`
- An error
= The condition is false, so the value after `else` is chosen.

Q. In a `match` statement, what does `case _:` do?
* Matches anything, like `default` in C
- Matches only an underscore character
- Matches an empty string
- Causes a syntax error
= The wildcard pattern always matches.

Q. Does Python's `match` fall through to the next case like C's `switch`?
- Yes, unless you write `break`
* No, only the first matching case runs
- Only for string patterns
- Only when cases are combined with `|`
= There is no fall-through in `match`.
:::

=== loops | Loops: for, while & range
desc: Iterate with for over any sequence, count with range(), repeat with while, control loops with break, continue and the loop else clause, and write the classic loop programs.

## for loops

Python's `for` loops over the items of **any iterable** — a list, string, range, dictionary, file …

```python run
for subject in ["C", "DSA", "Python"]:
    print("Studying", subject)

for ch in "abc":
    print(ch.upper(), end=" ")
print()
```

## range()

`range(start, stop, step)` produces numbers from `start` **up to but not including** `stop`:

```python run
print(list(range(5)))           # 0..4
print(list(range(2, 10, 3)))    # 2, 5, 8
print(list(range(10, 0, -2)))   # counting down
for i in range(1, 6):
    print(f"7 x {i} = {7 * i}")
```

## enumerate and zip

```python run
names = ["Asha", "Ravi", "Meera"]
marks = [91, 78, 85]
for i, name in enumerate(names, start=1):
    print(i, name)
for name, m in zip(names, marks):
    print(f"{name:6} {m}")
```

## while loops

Use `while` when you do not know in advance how many times to repeat:

```python run stdin="5\n12\n-3\n0"
total = 0
count = 0
n = int(input("Number (0 to stop): "))
while n != 0:
    total += n
    count += 1
    n = int(input("Number (0 to stop): "))
print(f"{count} numbers, sum {total}")
```

## break, continue and loop-else

- `break` leaves the loop immediately.
- `continue` skips to the next iteration.
- A loop's **`else`** block runs only if the loop finished **without** `break` — perfect for searches.

```python run
def is_prime(n):
    if n < 2:
        return False
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            break                  # found a divisor
    else:
        return True                # no break: no divisor found
    return False

print([n for n in range(1, 40) if is_prime(n)])

for n in range(1, 11):
    if n % 3 == 0:
        continue
    print(n, end=" ")
print()
```

## Classic loop programs

```python run
# Fibonacci
a, b = 0, 1
fib = []
for _ in range(12):
    fib.append(a)
    a, b = b, a + b
print("Fibonacci:", fib)

# Sum of digits and reverse
n = 40213
digits = 0
rev = 0
while n > 0:
    digits += n % 10
    rev = rev * 10 + n % 10
    n //= 10
print("digit sum:", digits, "reversed:", rev)

# Armstrong numbers
arm = [n for n in range(1, 1000) if n == sum(int(d) ** len(str(n)) for d in str(n))]
print("Armstrong:", arm)

# GCD with Euclid's algorithm
x, y = 84, 36
while y:
    x, y = y, x % y
print("gcd(84, 36) =", x)
```

## Pattern printing

String multiplication makes patterns much shorter than in C:

```python run
n = 5
for i in range(1, n + 1):
    print("* " * i)
print()
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * (2 * i - 1))
print()
for i in range(1, n + 1):
    print(" ".join(str(j) for j in range(1, i + 1)))
```

:::tip Python style
Loop directly over items (`for name in names`) rather than indexes (`for i in range(len(names))`). Use `enumerate` when you also need the index.
:::

:::quiz
Q. What does `list(range(3, 12, 4))` produce?
- `[3, 7, 11, 15]`
* `[3, 7, 11]`
- `[3, 4, 5, …, 11]`
- `[4, 8]`
= Start at 3, step 4, stop before 12.

Q. When does a `for` loop's `else` block run?
- When the loop body raises an error
- Every time the loop runs
* When the loop finishes without hitting `break`
- Only when the loop never runs
= `else` on a loop means "completed normally".

Q. How many times does this print?
```python
i = 10
while i > 0:
    print(i)
    i -= 3
```
- 3
* 4
- 10
- Infinite
= `i` takes the values 10, 7, 4 and 1.

Q. What does `print("ab" * 3)` output?
- `ab3`
* `ababab`
- `aaabbb`
- An error
= Multiplying a string repeats it.
:::
