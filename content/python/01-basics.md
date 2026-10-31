=== intro | Python Introduction
unit: Python Basics
desc: Why Python is everywhere, how it runs your code, indentation, comments, print(), and your first programs.

**Python** was created by **Guido van Rossum** and released in **1991**. It was designed to be **readable**: code looks almost like English, and there is usually one obvious way to do something. Today Python is the language of data science, machine learning, automation, web back-ends, scripting and competitive programming.

```python run
print("Hello, Python!")
print("2 + 3 =", 2 + 3)
print("Python" * 3)
```

Compare that with C: no `#include`, no `main`, no semicolons, no types to declare. The program simply runs from top to bottom.

## How Python runs your code

C is **compiled** ahead of time into machine code. Python is **interpreted**: the `python` program reads your `.py` file, compiles it to **bytecode**, and the Python virtual machine executes that bytecode line by line.

| | C | Python |
|---|---|---|
| Typing | static: `int x` | dynamic: `x = 5`, types checked at run time |
| Execution | compiled to machine code | interpreted (bytecode + virtual machine) |
| Speed | very fast | slower, but fast enough for most tasks |
| Memory | manual (`malloc`/`free`) | automatic (garbage collected) |
| Blocks | `{ }` braces | **indentation** |
| Lines of code for a task | more | far fewer |

```bash
python3 hello.py          # run a file
python3                   # start the interactive shell (REPL)
```

In the **interactive shell**, each line runs as soon as you press Enter — great for experiments:

```pycon
>>> 7 * 6
42
>>> "kalvium".upper()
'KALVIUM'
```

## Indentation is syntax

Python uses **indentation** (4 spaces by convention) to mark blocks. Wrong indentation is an error, not just bad style.

```python run
marks = 82
if marks >= 40:
    print("Pass")          # inside the if block
    print("Well done!")
print("Result printed")    # back outside the block
```

:::mistake IndentationError
Mixing tabs and spaces, or indenting a line that should not be indented, raises `IndentationError: unexpected indent`. Configure your editor to insert 4 spaces when you press Tab.
:::

## Comments

```python
# A single-line comment starts with a hash.

"""
A string on its own line is often used as a
multi-line comment or documentation (a docstring).
"""
```

## print() in detail

```python run
print("A", "B", "C")                 # separated by spaces
print("A", "B", "C", sep="-")        # custom separator
print("no newline", end=" ... ")     # custom ending
print("continued")
name, score = "Asha", 93.456
print(f"{name} scored {score:.1f}%")  # f-string with formatting
print("Tab\tand\nnewline")
```

`f"..."` strings (**f-strings**) put expressions inside `{ }`. They are the modern way to format output and you will use them constantly.

## Python is everywhere

| Area | Popular tools |
|---|---|
| Data analysis | pandas, NumPy, Jupyter |
| Machine learning / AI | scikit-learn, PyTorch, TensorFlow |
| Web back-ends | Django, Flask, FastAPI |
| Automation & scripting | os, pathlib, requests, Selenium |
| Competitive programming | built-in big integers, lists, dicts |

:::quiz
Q. How does Python mark the body of an `if` statement?
- Curly braces `{ }`
- The keyword `end`
* Indentation
- Semicolons
= The indented lines after the colon form the block.

Q. What does `print("a", "b", sep="")` print?
- `a b`
* `ab`
- `a,b`
- `a\nb`
= An empty separator joins the values directly.

Q. Which statement about Python is **true**?
- You must declare variable types
* Python checks types while the program runs
- Python needs a `main` function
- Python code is compiled straight to machine code
= Python is dynamically typed and interpreted (via bytecode).

Q. What is printed by `print(f"{7 / 2:.2f}")`?
- `3`
- `3.5`
* `3.50`
- `7 / 2`
= The format `.2f` shows exactly two decimal places.
:::

=== variables | Variables & Data Types
desc: Dynamic typing, the core types (int, float, str, bool, None), type() and conversions, multiple assignment, and how Python variables are really references.

A **variable** is created the moment you assign to it. There is no declaration and no type keyword — the **value** carries the type.

```python run
age = 19                # int
cgpa = 8.75             # float
name = "Asha"           # str
is_enrolled = True      # bool
nothing = None          # NoneType: "no value"

print(type(age), type(cgpa), type(name), type(is_enrolled), type(nothing))
age = "nineteen"        # the same name can later hold a different type
print(type(age))
```

## Core types

| Type | Example | Notes |
|---|---|---|
| `int` | `42`, `-7`, `10**30` | **unlimited size** — no overflow |
| `float` | `3.14`, `2e-3` | 64-bit double precision |
| `complex` | `3 + 4j` | built-in complex numbers |
| `str` | `'hi'`, `"hi"`, `"""multi-line"""` | immutable text |
| `bool` | `True`, `False` | a subclass of `int` (True == 1) |
| `NoneType` | `None` | the absence of a value |

Python integers never overflow — try a number that would break C's `long long`:

```python run
print(2 ** 100)
print(len(str(2 ** 1000)), "digits in 2^1000")
factorial = 1
for i in range(1, 26):
    factorial *= i
print("25! =", factorial)
```

## Converting between types

```python run
print(int("45") + 5)          # str -> int
print(float("2.5") * 2)       # str -> float
print(int(9.99))              # float -> int truncates towards zero
print(round(9.99), round(2.5), round(3.5))   # rounds to the nearest even on .5
print(str(100) + " marks")    # int -> str
print(bool(0), bool(""), bool("0"), bool([]), bool(3))
```

:::note Truthiness
`0`, `0.0`, `""`, `[]`, `{}`, `set()` and `None` count as **False** in a condition. Everything else is **True** — including the string `"0"`.
:::

## Naming rules and conventions

- Letters, digits and underscores; cannot start with a digit; case-sensitive.
- Cannot be a keyword: `if`, `for`, `class`, `def`, `True`, `None`, …
- Convention (PEP 8): `snake_case` for variables and functions, `PascalCase` for classes, `UPPER_CASE` for constants.

## Multiple assignment and swapping

```python run
a, b, c = 1, 2, 3
x = y = 0
a, b = b, a                 # swap without a temporary variable
print(a, b, c, x, y)
first, *rest = [10, 20, 30, 40]     # unpacking with a star
print(first, rest)
```

## Variables are references

In C, a variable is a box that holds a value. In Python, a variable is a **name that refers to an object**. Assignment binds a name to an object; it does not copy the object.

```python run
a = [1, 2, 3]
b = a              # b refers to the SAME list
b.append(4)
print(a)           # a sees the change
print(a is b, id(a) == id(b))

c = list(a)        # make a real copy
c.append(5)
print(a, c, a is c)
```

This matters for **mutable** objects (lists, dicts, sets). **Immutable** ones (int, float, str, tuple) can never change in place, so sharing them is always safe.

:::quiz
Q. What is `type(3 / 2)`?
- `int`
* `float`
- `str`
- `decimal`
= `/` always produces a float in Python 3. Use `//` for integer division.

Q. What does `int("3.7")` do?
- Returns 3
- Returns 4
* Raises a `ValueError`
- Returns 3.7
= `int()` of a string needs an integer literal. Use `int(float("3.7"))` to get 3.

Q. Which value is truthy?
- `0`
- `""`
* `"False"`
- `None`
= Any non-empty string is truthy, even `"False"`.

Q. After `a = [1]; b = a; b.append(2)`, what is `a`?
- `[1]`
* `[1, 2]`
- `[2]`
- An error
= `a` and `b` refer to the same list object.
:::

=== operators-input | Operators & Input
desc: Arithmetic including // and **, comparison chains, logical and identity operators, input() with type conversion, and formatted output.

## Arithmetic operators

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `+` `-` `*` | add, subtract, multiply | `17 + 5`, `17 - 5`, `17 * 5` | 22, 12, 85 |
| `/` | true division (always float) | `17 / 5` | 3.4 |
| `//` | floor division | `17 // 5` | 3 |
| `%` | remainder | `17 % 5` | 2 |
| `**` | power | `17 ** 5` | 1419857 |

```python run
print(17 / 5, 17 // 5, 17 % 5, 17 ** 5)
print(-17 // 5, -17 % 5)          # floor division rounds DOWN, so the remainder is non-negative
print(divmod(17, 5))              # quotient and remainder together
print(0.1 + 0.2, 0.1 + 0.2 == 0.3)
print(abs(-7.5), pow(2, 10), round(3.14159, 2))
```

:::warn Floats are approximate
`0.1 + 0.2` is `0.30000000000000004`, exactly as in C, because binary floating point cannot store 0.1 exactly. Compare floats with a tolerance: `abs(a - b) < 1e-9`, or `math.isclose(a, b)`.
:::

:::info Python vs C division
In C, `-17 / 5` is `-3` and `-17 % 5` is `-2` (truncation). In Python, `-17 // 5` is `-4` and `-17 % 5` is `3` (floor). Both satisfy `(a // b) * b + a % b == a`.
:::

## Comparison and logical operators

Comparisons return `True` or `False`, and Python lets you **chain** them like maths:

```python run
x = 15
print(10 < x <= 20)                 # same as 10 < x and x <= 20
print(x == 15 and x % 2 == 1)
print(not x > 100 or x < 0)
print("apple" < "banana", "Zebra" < "apple")   # dictionary order; uppercase sorts first
```

Python uses the words `and`, `or`, `not` instead of `&&`, `||`, `!`. They short-circuit, and they return one of their operands rather than strictly `True`/`False`:

```python run
name = ""
print(name or "Guest")        # empty string is falsy, so "Guest"
print(0 and 10, 5 and 10)
```

## Identity and membership

| Operator | Checks |
|---|---|
| `is`, `is not` | are both names the **same object**? |
| `in`, `not in` | is a value **inside** a collection or string? |

```python run
vowels = "aeiou"
print("e" in vowels, "z" not in vowels)
print(3 in [1, 2, 3])
x = None
print(x is None)          # the right way to test for None
```

## Augmented assignment

`x += 1`, `x -= 2`, `x *= 3`, `x //= 2`, `x **= 2` … Python has **no** `++` or `--` operators.

## Reading input

`input()` always returns a **string**. Convert it before doing arithmetic:

```python run stdin="Ravi\n19"
name = input("Your name: ")
age = int(input("Your age: "))
print(f"Hi {name}, next year you will be {age + 1}.")
```

Read several numbers from one line with `split()` and `map()`:

```python run stdin="12 7 30"
a, b, c = map(int, input("Three numbers: ").split())
print("sum =", a + b + c, "max =", max(a, b, c))

numbers = list(map(int, "4 8 15 16 23 42".split()))
print(numbers, "average", sum(numbers) / len(numbers))
```

## Formatted output

```python run
item, qty, price = "Notebook", 3, 45.5
print(f"{item:<12}{qty:>4}{price * qty:>10.2f}")     # widths and alignment
print(f"{'Total':<12}{'':>4}{price * qty:>10.2f}")
print(f"{1234567.891:,.2f}")                          # thousands separator
print(f"{0.4567:.1%}")                                # percentage
print(f"{255:b} {255:o} {255:x}")                     # binary, octal, hex
print("{} scored {}".format("Asha", 91))             # older str.format style
```

:::quiz
Q. What is `7 // 2 + 7 % 2`?
- 3.5
* 4
- 3
- 5
= `7 // 2` is 3 and `7 % 2` is 1, so the result is 4.

Q. What does `-7 // 2` give in Python?
- -3
* -4
- -3.5
- 3
= Floor division rounds down towards negative infinity.

Q. What type does `input()` return?
- int
- float
* str
- It depends on what the user types
= Always a string; convert with `int()` or `float()`.

Q. What does `print(1 < 3 < 2)` print?
- True
* False
- An error
- 1
= It means `1 < 3 and 3 < 2`, and `3 < 2` is false.
:::

=== strings | Strings
desc: Indexing and negative indexes, slicing, immutability, the most useful string methods, searching, splitting and joining, and classic string programs.

A **string** is an immutable sequence of characters. Single, double or triple quotes all work.

```python run
s = "Kalvium"
print(len(s), s[0], s[-1], s[2])        # negative indexes count from the end
print(s[0:3], s[3:], s[:4], s[-3:])     # slices: start included, end excluded
print(s[::-1])                          # step -1 reverses
print(s[::2])                           # every second character
```

:::diagram array
values: K a l v i u m
pointers: s[0]=0 s[-1]=6
caption: Indexes 0 to 6 from the left; −1 to −7 from the right. `s[1:4]` is "alv".
:::

## Strings are immutable

You cannot change a character in place; build a new string instead:

```python run
s = "python"
# s[0] = "P"           # TypeError: 'str' object does not support item assignment
s = "P" + s[1:]
print(s)
```

## Essential string methods

| Method | Does | Example result |
|---|---|---|
| `upper()`, `lower()`, `title()`, `capitalize()` | change case | `"hi there".title()` → `Hi There` |
| `strip()`, `lstrip()`, `rstrip()` | remove whitespace (or given characters) | `"  hi ".strip()` → `hi` |
| `split(sep)` | split into a list | `"a,b,c".split(",")` → `['a', 'b', 'c']` |
| `sep.join(list)` | join a list into a string | `"-".join(["a","b"])` → `a-b` |
| `replace(old, new)` | replace all occurrences | `"aaa".replace("a","b")` → `bbb` |
| `find(sub)` / `index(sub)` | position of `sub` (`find` gives −1 if missing) | `"hello".find("l")` → 2 |
| `count(sub)` | occurrences | `"banana".count("a")` → 3 |
| `startswith`, `endswith` | prefix / suffix tests | |
| `isdigit`, `isalpha`, `isalnum`, `isspace`, `isupper` | character class tests | |

```python run
email = "  Asha.Rao@Example.COM "
clean = email.strip().lower()
user, domain = clean.split("@")
print(clean, user, domain)
print(clean.endswith(".com"), clean.count("a"), clean.find("rao"))

words = "data structures and algorithms".split()
print(words)
print(" ".join(w.capitalize() for w in words))
print("-".join(["2026", "11", "14"]))
```

## Looping over strings

```python run
text = "Hello, World 2026!"
letters = digits = spaces = others = 0
for ch in text:
    if ch.isalpha():
        letters += 1
    elif ch.isdigit():
        digits += 1
    elif ch.isspace():
        spaces += 1
    else:
        others += 1
print(letters, digits, spaces, others)

for i, ch in enumerate("abc"):
    print(i, ch, ord(ch))          # ord gives the Unicode code; chr goes back
print(chr(65), chr(0x20B9))
```

## Classic string programs

```python run
def is_palindrome(s):
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]

def count_vowels(s):
    return sum(1 for c in s.lower() if c in "aeiou")

def is_anagram(a, b):
    return sorted(a.replace(" ", "").lower()) == sorted(b.replace(" ", "").lower())

def char_frequency(s):
    freq = {}
    for c in s:
        freq[c] = freq.get(c, 0) + 1
    return freq

print(is_palindrome("A man, a plan, a canal: Panama"))
print(count_vowels("Object Oriented Programming"))
print(is_anagram("Listen", "Silent"), is_anagram("Dormitory", "Dirty room"))
print(char_frequency("mississippi"))
```

:::tip Building long strings
Adding strings in a loop (`s += piece`) creates a new string each time. For many pieces, collect them in a list and call `"".join(pieces)` once.
:::

:::quiz
Q. For `s = "programming"`, what is `s[3:7]`?
* `"gram"`
- `"ogra"`
- `"gramm"`
- `"rogr"`
= Slicing includes the start and excludes the end: characters at 3–6 are g, r, a, m.

Q. What does `"banana".find("z")` return?
* -1
- 0
- None
- It raises an error
= `find` returns −1 when the substring is missing; `index` would raise `ValueError`.

Q. What does `" | ".join(["C", "C++", "Python"])` produce?
- `["C | C++ | Python"]`
* `"C | C++ | Python"`
- `"C C++ Python"`
- An error
= `join` places the separator between the list elements.

Q. Why does `s[0] = "X"` fail for a string `s`?
- Index 0 does not exist
* Strings are immutable
- You must use `s.set(0, "X")`
- Strings can only be changed with `replace`
= Strings cannot be modified in place; create a new string.
:::
