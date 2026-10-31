=== files | File Handling
unit: Real Programs
desc: Read and write text files safely with open() and with, file modes, reading line by line, CSV and JSON files, and working with paths using pathlib.

## Opening files with with

The `with` statement opens a file and **closes it automatically**, even if an error happens inside the block:

```python run
with open("notes.txt", "w") as f:          # "w" creates or overwrites
    f.write("Line one\n")
    f.write("Line two\n")
    print("Line three", file=f)            # print can write to files too

with open("notes.txt") as f:               # default mode is "r" (read text)
    print(f.read())

with open("notes.txt", "a") as f:          # "a" appends
    f.write("Line four\n")

with open("notes.txt") as f:
    for number, line in enumerate(f, start=1):   # iterate line by line: memory-friendly
        print(number, line.rstrip("\n"))
```

| Mode | Meaning |
|---|---|
| `"r"` | read (default); error if the file does not exist |
| `"w"` | write; **erases** an existing file |
| `"a"` | append to the end |
| `"x"` | create; error if the file already exists |
| `"r+"` | read and write |
| `"b"` | binary, combined with the others: `"rb"`, `"wb"` |

## Reading methods

```python run
with open("poem.txt", "w") as f:
    f.write("Roses are red\nViolets are blue\nPython is neat\nAnd so are you\n")

with open("poem.txt") as f:
    first = f.readline()                 # one line
    rest = f.readlines()                 # list of the remaining lines
print(repr(first))
print(rest)

with open("poem.txt") as f:
    text = f.read()
print(len(text.split()), "words,", text.count("\n"), "lines")
```

## CSV files

The `csv` module handles commas inside quoted fields and other edge cases:

```python run
import csv

rows = [["roll", "name", "marks"], [101, "Asha", 88], [102, "Ravi", 93], [103, "Meera, K", 79]]
with open("marks.csv", "w", newline="") as f:
    csv.writer(f).writerows(rows)

with open("marks.csv", newline="") as f:
    reader = csv.DictReader(f)                    # each row becomes a dict
    records = list(reader)

for r in records:
    print(f"{r['roll']} {r['name']:10} {r['marks']}")
average = sum(int(r["marks"]) for r in records) / len(records)
print(f"Class average: {average:.2f}")
```

## JSON files

JSON maps naturally onto Python dicts and lists — the standard format for configuration and web APIs:

```python run
import json

profile = {"name": "Asha", "skills": ["C", "Python"], "cgpa": 9.1, "placed": False}
with open("profile.json", "w") as f:
    json.dump(profile, f, indent=2)

with open("profile.json") as f:
    loaded = json.load(f)
print(loaded["skills"], loaded == profile)
print(json.dumps({"ok": True, "count": 3}))      # to a string
```

## Paths with pathlib

```python run
from pathlib import Path

folder = Path("reports")
folder.mkdir(exist_ok=True)
for term in ("sem1", "sem2"):
    (folder / f"{term}.txt").write_text(f"Results for {term}\n")

for p in sorted(folder.glob("*.txt")):
    print(p.name, p.suffix, p.stat().st_size, "bytes:", p.read_text().strip())
print(Path("reports/sem1.txt").exists(), Path("missing.txt").exists())
```

:::mistake Forgetting the file is relative
`open("data.txt")` looks in the **current working directory** — the folder you ran Python from — not necessarily the folder containing your script. Build paths with `Path(__file__).parent / "data.txt"` when the file sits next to your script.
:::

:::quiz
Q. What is the main advantage of `with open(...) as f:`?
* The file is closed automatically, even if an error occurs
- It reads files faster
- It creates the file if missing in every mode
- It prevents other programs from reading the file
= `with` guarantees cleanup, like RAII in C++.

Q. Which mode adds to the end of an existing file?
- `"w"`
* `"a"`
- `"r"`
- `"x"`
= Append mode keeps the existing contents.

Q. What does `f.readlines()` return?
- One string with the whole file
* A list of lines, each ending in `"\n"`
- The number of lines
- The first line only
= `read()` returns one string; `readlines()` returns a list.

Q. Which module converts between Python dicts and JSON text?
- `csv`
- `pickle`
* `json`
- `os`
= `json.dump`/`json.load` work with files; `dumps`/`loads` with strings.
:::

=== exceptions | Exceptions
desc: Handle errors gracefully with try, except, else and finally, read tracebacks, raise your own errors, and define custom exception classes.

When something goes wrong, Python **raises an exception**. If nothing handles it, the program stops and prints a **traceback** — read it from the bottom up: the last line names the error.

```python run error
marks = [80, 90]
print(marks[5])
```

## try / except

```python run stdin="ten\n0\n4"
def ask_and_divide():
    try:
        n = int(input("Divide 100 by: "))
        print("Result:", 100 / n)
    except ValueError:
        print("That was not a whole number.")
    except ZeroDivisionError:
        print("You cannot divide by zero.")

for _ in range(3):
    ask_and_divide()
```

## else and finally

- `else` runs only if the `try` block raised **no** exception.
- `finally` runs **always** — perfect for cleanup.

```python run
def read_number(text):
    try:
        value = float(text)
    except ValueError as e:              # 'as e' gives the exception object
        print(f"  error: {e}")
        return None
    else:
        print("  parsed fine")
        return value
    finally:
        print("  (finished trying", repr(text) + ")")

print(read_number("3.5"))
print(read_number("abc"))
```

## Common built-in exceptions

| Exception | Raised when |
|---|---|
| `ValueError` | right type, wrong value: `int("abc")` |
| `TypeError` | wrong type: `"5" + 5` |
| `ZeroDivisionError` | dividing by zero |
| `IndexError` | list index out of range |
| `KeyError` | missing dictionary key |
| `AttributeError` | missing attribute: `None.upper()` |
| `NameError` | using an undefined name |
| `FileNotFoundError` | opening a file that does not exist |
| `RecursionError` | recursion too deep |

```python run
tests = [lambda: int("x"), lambda: "5" + 5, lambda: [1][3], lambda: {}["k"], lambda: undefined_name]
for t in tests:
    try:
        t()
    except Exception as e:                      # catch any normal exception
        print(f"{type(e).__name__:15} {e}")
```

:::warn Do not silence everything
A bare `except:` (or `except Exception: pass`) hides real bugs. Catch the **specific** exceptions you expect and can handle.
:::

## raise

Raise an exception yourself when input is invalid:

```python run
def set_age(age):
    if not isinstance(age, int):
        raise TypeError("age must be an integer")
    if age < 0 or age > 150:
        raise ValueError(f"impossible age: {age}")
    return age

for value in (21, -4, "twenty"):
    try:
        print("ok:", set_age(value))
    except (TypeError, ValueError) as e:
        print("rejected:", e)
```

## Custom exceptions

```python run
class InsufficientBalance(Exception):
    def __init__(self, needed):
        super().__init__(f"need Rs {needed} more")
        self.needed = needed

class Wallet:
    def __init__(self, balance):
        self.balance = balance
    def pay(self, amount):
        if amount > self.balance:
            raise InsufficientBalance(amount - self.balance)
        self.balance -= amount

w = Wallet(500)
for amount in (200, 450):
    try:
        w.pay(amount)
        print(f"paid {amount}, balance {w.balance}")
    except InsufficientBalance as e:
        print("payment failed:", e, "| short by", e.needed)
```

## EAFP vs LBYL

Python style often prefers **EAFP** — "Easier to Ask Forgiveness than Permission" — try the operation and handle failure, rather than **LBYL** ("Look Before You Leap") with many `if` checks:

```python run
config = {"theme": "dark"}
# LBYL
size = config["size"] if "size" in config else 12
# EAFP
try:
    size = config["size"]
except KeyError:
    size = 12
print(size, config.get("size", 12))      # get() is the simplest here
```

:::quiz
Q. When does the `else` block of a `try` statement run?
- Always
* Only when the `try` block raised no exception
- Only when an exception was caught
- Only after `finally`
= `else` holds code that should run only on success.

Q. Which exception does `int("12a")` raise?
- TypeError
* ValueError
- SyntaxError
- KeyError
= The type (str) is acceptable to `int()`, but the value cannot be converted.

Q. What is printed?
```python
try:
    print("A")
    x = 1 / 0
    print("B")
except ZeroDivisionError:
    print("C")
finally:
    print("D")
```
- A B C D
* A C D
- A D
- C D
= After the error, "B" is skipped; the handler prints C and `finally` prints D.

Q. How do you create a custom exception?
* Define a class that inherits from `Exception`
- Call `raise` with any string
- Use the `exception` keyword
- Override `print`
= Custom exceptions are ordinary classes deriving from `Exception`.
:::

=== oop | Object-Oriented Python
desc: Classes in Python: __init__ and self, instance vs class attributes, methods, properties, inheritance with super(), polymorphism, and dunder methods like __str__ and __eq__.

Everything in Python is an object — numbers, strings, functions, even classes. You define your own types with `class`.

```python run
class Student:
    school = "Kalvium"                       # class attribute: shared by all students

    def __init__(self, name, roll):          # the constructor
        self.name = name                     # instance attributes: one per object
        self.roll = roll
        self.marks = []

    def add_mark(self, m):                   # a method: first parameter is always self
        self.marks.append(m)

    def average(self):
        return sum(self.marks) / len(self.marks) if self.marks else 0

s1 = Student("Asha", 101)
s2 = Student("Ravi", 102)
s1.add_mark(88); s1.add_mark(94)
s2.add_mark(76)
print(s1.name, s1.average(), s1.school)
print(s2.name, s2.average(), Student.school)
```

`self` is the object the method was called on — the same idea as `this` in C++, but written explicitly.

## Encapsulation by convention

Python has no `private` keyword. By convention:

- `_name` — "internal, please don't touch".
- `__name` — name-mangled to `_ClassName__name`, which makes accidental access harder.

**Properties** let you add validation while keeping attribute syntax:

```python run
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):                      # read with acc.balance
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self._balance += amount

acc = Account("Priya", 1000)
acc.deposit(500)
print(acc.balance)
try:
    acc.balance = 10**6                     # no setter defined: read-only
except AttributeError as e:
    print("blocked:", e)
```

## Inheritance and super()

```python run
class Person:
    def __init__(self, name, age):
        self.name, self.age = name, age
    def introduce(self):
        return f"I am {self.name}, {self.age}."

class Student(Person):
    def __init__(self, name, age, course):
        super().__init__(name, age)          # run the parent's constructor
        self.course = course
    def introduce(self):                     # override
        return super().introduce() + f" I study {self.course}."

class Teacher(Person):
    def introduce(self):
        return f"Good morning, I am Prof. {self.name}."

people = [Student("Meera", 19, "DSA"), Teacher("Rao", 45), Person("Kiran", 30)]
for p in people:
    print(p.introduce())                     # polymorphism: each object's own version
print(isinstance(people[0], Person), issubclass(Teacher, Person))
```

Every method in Python behaves like a C++ `virtual` function: the call is resolved on the actual object at run time. Python also supports **multiple inheritance** (`class C(A, B)`), resolving names with the *method resolution order* (`C.__mro__`).

## Dunder (magic) methods

Methods with double underscores let your objects work with Python's built-in syntax — this is Python's **operator overloading**:

```python run
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __str__(self):                       # print(v) and str(v)
        return f"({self.x}, {self.y})"
    def __repr__(self):                      # developer view, used in lists
        return f"Vector({self.x}, {self.y})"
    def __add__(self, other):                # v1 + v2
        return Vector(self.x + other.x, self.y + other.y)
    def __mul__(self, k):                    # v * 3
        return Vector(self.x * k, self.y * k)
    def __eq__(self, other):                 # v1 == v2
        return (self.x, self.y) == (other.x, other.y)
    def __len__(self):                       # len(v)
        return 2
    def __abs__(self):                       # abs(v): the length
        return (self.x ** 2 + self.y ** 2) ** 0.5

a, b = Vector(3, 4), Vector(1, 2)
print(a + b, a * 3, abs(a), a == Vector(3, 4), len(a))
print([a, b])
```

| Method | Enables |
|---|---|
| `__init__` | construction: `Vector(3, 4)` |
| `__str__`, `__repr__` | `print(obj)`, `repr(obj)` |
| `__add__`, `__sub__`, `__mul__` | `+`, `-`, `*` |
| `__eq__`, `__lt__` | `==`, `<` (and sorting) |
| `__len__`, `__getitem__` | `len(obj)`, `obj[i]` |
| `__iter__`, `__next__` | `for x in obj` |
| `__call__` | `obj()` |

## Class methods, static methods and dataclasses

```python run
from dataclasses import dataclass

class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius
    @classmethod
    def from_fahrenheit(cls, f):            # alternative constructor
        return cls((f - 32) * 5 / 9)
    @staticmethod
    def is_freezing(c):                     # utility: needs neither self nor cls
        return c <= 0

t = Temperature.from_fahrenheit(98.6)
print(round(t.celsius, 1), Temperature.is_freezing(-3))

@dataclass                                  # writes __init__, __repr__ and __eq__ for you
class Book:
    title: str
    author: str
    pages: int = 0

print(Book("Clean Code", "Robert Martin", 464))
```

:::quiz
Q. What is `self` in a method?
* The object the method was called on
- The class itself
- A keyword that must be named `self`
- A global variable
= `self` refers to the instance; the name is a strong convention, not a keyword.

Q. Where should data shared by **all** objects of a class be stored?
- In `__init__` as `self.x`
* As a class attribute defined in the class body
- In a global variable only
- In `__str__`
= Class attributes are shared; instance attributes belong to each object.

Q. What does `super().__init__(name)` do in a child class?
- Creates a new parent object
* Runs the parent class's constructor on the current object
- Deletes the parent's attributes
- Calls the child's constructor again
= It lets the parent initialise its part of the object.

Q. Which dunder method makes `print(obj)` show a friendly string?
- `__init__`
- `__len__`
* `__str__`
- `__eq__`
= `print` calls `str(obj)`, which calls `__str__`.
:::

=== iterators-generators | Iterators & Generators
desc: How for loops really work, the iterator protocol, writing generators with yield, lazy evaluation and infinite sequences, and generator pipelines.

## How a for loop works

`for x in collection` calls `iter(collection)` to get an **iterator**, then calls `next()` on it repeatedly until it raises `StopIteration`:

```python run
nums = [10, 20, 30]
it = iter(nums)
print(next(it), next(it), next(it))
try:
    next(it)
except StopIteration:
    print("exhausted")
```

An **iterable** is anything you can loop over (lists, strings, dicts, files, ranges). An **iterator** is the object that actually remembers the position.

## Writing an iterator class

```python run
class Countdown:
    def __init__(self, start):
        self.current = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.current < 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

print(list(Countdown(5)))
for n in Countdown(3):
    print(n, end=" ")
print("liftoff!")
```

## Generators: the easy way

A **generator function** uses `yield` instead of `return`. Each `yield` hands out one value and **pauses** the function, keeping all its local variables until the next value is requested:

```python run
def countdown(start):
    while start >= 0:
        yield start
        start -= 1

def fibonacci():
    a, b = 0, 1
    while True:              # infinite — fine, values are produced only on demand
        yield a
        a, b = b, a + b

print(list(countdown(5)))
fib = fibonacci()
print([next(fib) for _ in range(10)])

gen = countdown(2)
print(next(gen), next(gen), next(gen))
```

## Why generators matter: lazy evaluation

A generator produces values **one at a time**, so it uses almost no memory no matter how many values it yields:

```python run vary
import sys

squares_list = [n * n for n in range(1_000_000)]
squares_gen = (n * n for n in range(1_000_000))
print("list:", sys.getsizeof(squares_list), "bytes")
print("generator:", sys.getsizeof(squares_gen), "bytes")
print(sum(squares_gen))
```

## Generator pipelines

Chain generators like assembly-line stages. Each item flows through all stages before the next item starts:

```python run
def read_lines(text):
    for line in text.splitlines():
        yield line

def non_empty(lines):
    for line in lines:
        if line.strip():
            yield line.strip()

def parse(lines):
    for line in lines:
        name, score = line.split(",")
        yield name, int(score)

data = """Asha,88

Ravi,95
Meera,79
"""
results = parse(non_empty(read_lines(data)))
for name, score in results:
    print(f"{name}: {score}")
```

## itertools

```python run
import itertools

print(list(itertools.islice(itertools.count(1, 3), 5)))        # 1, 4, 7, 10, 13
print(list(itertools.islice(itertools.cycle("AB"), 5)))
print(list(itertools.chain([1, 2], [3], [4, 5])))
print([(k, len(list(g))) for k, g in itertools.groupby("aaabccdddd")])
print(list(itertools.product("xy", [1, 2])))
```

| | Iterator class | Generator function | Generator expression |
|---|---|---|---|
| Syntax | `__iter__` + `__next__` | `def … yield` | `(x for x in xs)` |
| Length | most code | short | one line |
| State | kept in attributes | kept automatically | kept automatically |

:::quiz
Q. What does `yield` do?
* Produces a value and pauses the function until the next value is requested
- Ends the function permanently
- Prints a value
- Creates a list
= A generator resumes right after the `yield` on the next `next()` call.

Q. What exception signals that an iterator has no more values?
- `IndexError`
- `ValueError`
* `StopIteration`
- `EOFError`
= `for` loops catch `StopIteration` automatically.

Q. What is printed?
```python
def g():
    yield 1
    yield 2
it = g()
print(next(it) + next(it))
```
- 1
* 3
- 12
- An error
= The two `next` calls produce 1 and 2.

Q. Why is `(x * x for x in range(10**8))` safe to create while the list version may not be?
- Generators compute faster
* The generator does not store all the values in memory
- Lists cannot hold more than a million items
- Ranges are limited in lists
= A generator expression is lazy; the list would need gigabytes.
:::

=== cheatsheet | Python Cheat Sheet
desc: Python on one page: syntax, built-in types and their methods, comprehensions, functions, files, exceptions, classes and the standard-library modules you will reach for most.

## Syntax at a glance

```python
x = 10                              # variables: no declarations
if x > 5: ...                       # if / elif / else, indentation blocks
for i in range(n): ...              # loop over a range or any iterable
while cond: ...                     # break, continue, loop-else
def f(a, b=2, *args, **kwargs):     # functions with defaults and varargs
    return a + b
lambda x: x * 2                     # anonymous function
class Dog(Animal):                  # class with inheritance
    def __init__(self, name):
        super().__init__(name)
try: ... except ValueError as e: ... else: ... finally: ...
with open("f.txt") as f: ...        # auto-closing resources
```

## Built-in types

| Type | Literal | Mutable | Ordered | Notes |
|---|---|---|---|---|
| `int`, `float`, `bool` | `3`, `3.0`, `True` | no | — | int has unlimited size |
| `str` | `"hi"` | no | yes | slicing, methods, f-strings |
| `list` | `[1, 2]` | **yes** | yes | dynamic array |
| `tuple` | `(1, 2)` | no | yes | fixed records, dict keys |
| `set` | `{1, 2}` | **yes** | no | unique items, O(1) `in` |
| `dict` | `{"k": 1}` | **yes** | insertion order | key → value, O(1) lookup |

## Most-used methods

| Type | Methods |
|---|---|
| `str` | `split`, `join`, `strip`, `replace`, `find`, `count`, `upper`, `lower`, `startswith`, `isdigit` |
| `list` | `append`, `extend`, `insert`, `pop`, `remove`, `sort`, `reverse`, `index`, `count`, `copy` |
| `dict` | `get`, `items`, `keys`, `values`, `pop`, `setdefault`, `update` |
| `set` | `add`, `discard`, `remove`, `union` (`\|`), `intersection` (`&`), `difference` (`-`) |

## Built-in functions

`len`, `range`, `enumerate`, `zip`, `sorted`, `reversed`, `sum`, `min`, `max`, `abs`, `round`, `map`, `filter`, `any`, `all`, `isinstance`, `type`, `input`, `print`, `int`, `float`, `str`, `list`, `dict`, `set`, `tuple`, `open`, `ord`, `chr`

## Comprehensions

```python
[x * x for x in xs if x > 0]          # list
{x % 3 for x in xs}                   # set
{k: v for k, v in pairs}              # dict
sum(x for x in xs)                    # generator expression
```

## Slicing

| Expression | Meaning |
|---|---|
| `s[a:b]` | from `a` up to (not including) `b` |
| `s[:n]` / `s[-n:]` | first `n` / last `n` items |
| `s[::-1]` | reversed copy |
| `s[::2]` | every second item |

## Python vs C quick map

| C | Python |
|---|---|
| `printf("%d\n", x);` | `print(x)` |
| `scanf("%d", &x);` | `x = int(input())` |
| `for (i = 0; i < n; i++)` | `for i in range(n):` |
| `a && b`, `a \|\| b`, `!a` | `a and b`, `a or b`, `not a` |
| `x++` | `x += 1` |
| `NULL` | `None` |
| `struct` | `class` / `@dataclass` |
| `malloc` / `free` | automatic memory management |

## Programs to practise

1. Number programs: prime, factorial, Fibonacci, palindrome, Armstrong, GCD/LCM.
2. String programs: reverse words, palindrome sentence, vowel count, anagram check, character frequency.
3. List programs: second largest, remove duplicates keeping order, rotate, merge sorted lists.
4. Dictionary programs: word frequency, group by first letter, invert a dict, student grade book.
5. Recursion: power, sum of digits, flatten nested lists, permutations.
6. Files: count lines/words/characters, CSV average, JSON save/load.
7. OOP: BankAccount with validation, Shape hierarchy, Vector with dunder methods.
8. Generators: Fibonacci generator, reading a large file lazily.

:::quiz Final check: mixed revision
Q. What is `[1, 2, 3, 4, 5][-2:]`?
- `[1, 2]`
* `[4, 5]`
- `[5, 4]`
- `[3, 4, 5]`
= A negative start counts from the end; the slice runs to the end.

Q. Which is mutable?
- tuple
- str
* dict
- frozenset
= Lists, dicts and sets can change in place.

Q. What does `{x: x ** 2 for x in range(3)}` produce?
* `{0: 0, 1: 1, 2: 4}`
- `[0, 1, 4]`
- `{0, 1, 4}`
- `{1: 1, 2: 4, 3: 9}`
= A dict comprehension with keys 0, 1, 2 and their squares.

Q. Which statement creates an object of `class Car` with `__init__(self, model)`?
- `Car.__init__("Swift")`
* `Car("Swift")`
- `new Car("Swift")`
- `Car.create("Swift")`
= Calling the class runs `__init__` with the new object as `self`.
:::
