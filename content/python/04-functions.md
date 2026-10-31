=== functions | Functions
unit: Functions & Modules
desc: Define reusable functions with def: parameters and return values, default and keyword arguments, *args and **kwargs, scope and the LEGB rule, and docstrings.

```python run
def greet(name):
    """Return a friendly greeting."""          # docstring: documents the function
    return f"Hello, {name}!"

def area_and_perimeter(length, width):
    return length * width, 2 * (length + width)  # return several values (a tuple)

print(greet("Asha"))
a, p = area_and_perimeter(7, 3)
print(a, p)
print(greet.__doc__)
```

A function without a `return` statement returns **`None`**.

## Arguments: positional, keyword and default

```python run
def simple_interest(principal, rate=7.5, years=1):
    return principal * rate * years / 100

print(simple_interest(10000))                      # defaults used
print(simple_interest(10000, 8))                   # positional
print(simple_interest(10000, years=3))             # keyword: skip rate
print(simple_interest(years=2, principal=5000))    # any order with keywords
```

:::mistake Mutable default arguments
Default values are created **once**, when the function is defined. A list default is shared between calls:

```python run
def add_item(item, basket=[]):          # BUG: one shared list
    basket.append(item)
    return basket

print(add_item("pen"))
print(add_item("book"))                 # still contains "pen"!

def add_item_fixed(item, basket=None):  # the correct pattern
    if basket is None:
        basket = []
    basket.append(item)
    return basket

print(add_item_fixed("pen"), add_item_fixed("book"))
```
:::

## *args and **kwargs

`*args` collects any number of extra **positional** arguments into a tuple; `**kwargs` collects extra **keyword** arguments into a dict.

```python run
def average(*numbers):
    return sum(numbers) / len(numbers) if numbers else 0

def make_profile(name, **details):
    lines = [f"Name: {name}"] + [f"{k.title()}: {v}" for k, v in details.items()]
    return "\n".join(lines)

print(average(4, 8, 15, 16, 23, 42))
print(make_profile("Ravi", course="CSE", year=2, city="Chennai"))

values = [3, 9, 27]
print(average(*values))                # * unpacks a list into arguments
```

## Scope: the LEGB rule

When Python looks up a name, it searches four scopes in order: **L**ocal → **E**nclosing (outer function) → **G**lobal (module) → **B**uilt-in.

```python run
x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print("inner sees:", x)
    inner()
    print("outer sees:", x)

outer()
print("module sees:", x)

counter = 0
def increment():
    global counter          # needed to ASSIGN to a global
    counter += 1

increment(); increment()
print("counter =", counter)
```

`nonlocal` does the same for a variable in an enclosing function. Prefer returning values over modifying globals.

## How arguments are passed

Python passes **references to objects** ("call by object reference"). If a function **mutates** a mutable argument, the caller sees the change; **rebinding** the parameter does not affect the caller.

```python run
def mutate(lst):
    lst.append(99)          # changes the caller's list

def rebind(lst):
    lst = [0]               # only changes the local name

nums = [1, 2]
mutate(nums)
rebind(nums)
print(nums)
```

## Functions are objects

Functions can be stored in variables, passed to other functions and returned from them:

```python run
def apply_twice(f, x):
    return f(f(x))

def make_multiplier(n):
    def multiply(x):
        return x * n        # remembers n: a closure
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(apply_twice(double, 5), triple(7))

operations = {"+": lambda a, b: a + b, "*": lambda a, b: a * b}
print(operations["*"](6, 7))
```

## Type hints

Optional annotations document expected types (Python does not enforce them, but editors and checkers do):

```python run
def bmi(weight_kg: float, height_m: float) -> float:
    return round(weight_kg / height_m ** 2, 1)

print(bmi(72.5, 1.68))
```

:::quiz
Q. What does a function return if it has no `return` statement?
- 0
- An empty string
* `None`
- It is an error
= Every function returns something; without `return` it is `None`.

Q. What is `average(*[2, 4, 6])` if `def average(*nums): return sum(nums) / len(nums)`?
- An error
* 4.0
- 12
- `[2, 4, 6]`
= `*` unpacks the list into three arguments, which `*nums` collects again.

Q. What does `global x` inside a function allow?
* Assigning to the module-level variable `x`
- Reading `x` (impossible without it)
- Creating a new local `x`
- Making `x` constant
= Reading a global works anyway; assigning needs the `global` declaration.

Q. Why is `def f(items=[])` dangerous?
- Lists cannot be default values
* The same list object is reused across calls, so items pile up
- It makes `items` read-only
- Python copies the list each call, which is slow
= Defaults are evaluated once; use `None` and create the list inside.
:::

=== lambda-recursion | Lambda, map/filter & Recursion
desc: Small anonymous functions with lambda, functional tools map, filter, sorted and reduce, and recursive functions with base cases, memoisation and recursion limits.

## lambda

A **lambda** is a one-expression anonymous function: `lambda parameters: expression`.

```python run
square = lambda x: x * x
add = lambda a, b: a + b
print(square(9), add(3, 4))

students = [("Asha", 88), ("Ravi", 95), ("Meera", 79)]
print(sorted(students, key=lambda s: s[1], reverse=True))
print(max(students, key=lambda s: s[1])[0])
```

Use lambdas for short throwaway functions, usually as a `key=` argument. If it needs a name or more than one line, write a `def`.

## map, filter and reduce

| Function | Does | Comprehension equivalent |
|---|---|---|
| `map(f, xs)` | applies `f` to every item | `[f(x) for x in xs]` |
| `filter(pred, xs)` | keeps items where `pred` is true | `[x for x in xs if pred(x)]` |
| `functools.reduce(f, xs)` | folds items into one value | a loop with an accumulator |

```python run
from functools import reduce

nums = [1, 2, 3, 4, 5, 6]
print(list(map(lambda x: x ** 2, nums)))
print(list(filter(lambda x: x % 2 == 0, nums)))
print(reduce(lambda acc, x: acc * x, nums))          # 6! = 720
print(list(map(int, "10 20 30".split())))            # the classic input idiom
print(list(map(str.upper, ["c", "dsa", "python"])))
```

`map` and `filter` return lazy iterators; wrap them in `list()` to see all values.

## Recursion

Recursion in Python works exactly as in C: a **base case** and a **recursive case**.

```python run
def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)

def power(base, exp):
    if exp == 0:
        return 1
    half = power(base, exp // 2)
    return half * half * (base if exp % 2 else 1)

def flatten(nested):
    result = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))     # recurse into sub-lists
        else:
            result.append(item)
    return result

def permutations(s):
    if len(s) <= 1:
        return [s]
    return [s[i] + p for i in range(len(s)) for p in permutations(s[:i] + s[i + 1:])]

print(factorial(20))
print(power(2, 64))
print(flatten([1, [2, [3, 4], 5], [[6]], 7]))
print(permutations("abc"))
```

## Memoisation with lru_cache

Naive recursive Fibonacci recomputes the same values exponentially many times. `functools.lru_cache` remembers results, turning it into O(n):

```python run
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_fast(n):
    return n if n < 2 else fib_fast(n - 1) + fib_fast(n - 2)

calls = 0
def fib_counted(n):
    global calls
    calls += 1
    return n if n < 2 else fib_counted(n - 1) + fib_counted(n - 2)

fib_counted(20)
print("calls for naive fib(20):", calls)
print("fib(90) with lru_cache:", fib_fast(90))
```

This is **dynamic programming** in one decorator line; the idea is explained fully in [Dynamic Programming](@daa/dp-intro).

## Recursion limit

Python limits recursion depth (about 1000 by default) to protect the stack:

```python run error
import sys
print(sys.getrecursionlimit())

def countdown(n):
    return 0 if n == 0 else countdown(n - 1)

print(countdown(500))
print(countdown(5000))
```

For deep recursion, rewrite the function with a loop (or, carefully, raise the limit with `sys.setrecursionlimit`).

:::quiz
Q. What does `list(map(lambda x: x + 1, [1, 2, 3]))` return?
* `[2, 3, 4]`
- `[1, 2, 3, 1]`
- `6`
- A map object
= The lambda is applied to each element; `list()` collects the results.

Q. What does `list(filter(lambda w: len(w) > 3, ["hi", "hello", "hey", "howdy"]))` return?
- `["hi", "hey"]`
* `["hello", "howdy"]`
- `[False, True, False, True]`
- `2`
= `filter` keeps the items for which the function returns True.

Q. What does `@lru_cache` do to a recursive function?
- Removes the recursion
* Caches results so repeated calls with the same arguments are not recomputed
- Increases the recursion limit
- Makes it run in parallel
= Memoisation turns exponential Fibonacci into linear time.

Q. What happens when recursion goes deeper than Python's limit?
- Python silently stops
* A `RecursionError` is raised
- The program uses the heap instead
- The function returns `None`
= The limit (about 1000) prevents a real stack overflow crash.
:::

=== modules | Modules, Packages & the Standard Library
desc: Organise code into modules, import in different ways, use if __name__ == "__main__", install packages with pip, and tour the standard library: math, random, datetime, os, collections and more.

A **module** is simply a `.py` file. Any Python file can be imported by another, giving you its functions, classes and variables.

```python aux title="geometry.py"
PI = 3.14159

def circle_area(r):
    return PI * r * r

def rectangle_area(l, w):
    return l * w

if __name__ == "__main__":
    print("This runs only when geometry.py is executed directly")
```

```python run
import geometry
from geometry import rectangle_area
import geometry as geo

print(geometry.circle_area(2))
print(rectangle_area(3, 4))
print(geo.PI)
```

(The demo message in `geometry.py` did not print, because the module was **imported**, not run.)

## Ways to import

| Form | Use as |
|---|---|
| `import math` | `math.sqrt(2)` |
| `import numpy as np` | `np.array(...)` — an alias |
| `from math import sqrt, pi` | `sqrt(2)`, `pi` |
| `from math import *` | everything — avoid: unclear where names come from |

## if __name__ == "__main__"

Every module has a `__name__`. When a file is run directly, its `__name__` is `"__main__"`; when it is imported, `__name__` is the module's name. Putting test or demo code under this check lets a file work both as a script and as a library.

## Packages and pip

A **package** is a folder of modules (with an `__init__.py`). Third-party packages are installed from PyPI with **pip**:

```bash
pip install requests          # install a package
pip install numpy pandas      # several at once
pip list                      # what is installed
python3 -m venv .venv         # create an isolated virtual environment
```

## Tour of the standard library

```python run vary
import math, random, datetime, statistics

print(math.sqrt(144), math.factorial(10), math.gcd(84, 36), math.comb(5, 2))
print(round(math.pi, 4), math.ceil(4.1), math.floor(-4.1), math.log2(1024))

random.seed(7)                          # same "random" numbers on every run
print(random.randint(1, 6), random.choice(["heads", "tails"]))
deck = list(range(1, 11))
random.shuffle(deck)
print(deck, random.sample(range(100), 3))

print(statistics.mean([70, 85, 90]), statistics.median([3, 1, 4, 1, 5]))

today = datetime.date(2026, 11, 14)
exam = datetime.date(2026, 12, 10)
print((exam - today).days, "days to the exam")
print(today.strftime("%d %B %Y, %A"))
```

```python run
from collections import Counter, deque, defaultdict, OrderedDict
import itertools, string

print(Counter("abracadabra").most_common(3))
print(list(itertools.permutations([1, 2, 3], 2)))
print(list(itertools.combinations("ABCD", 2)))
print(list(itertools.accumulate([1, 2, 3, 4])))      # running totals
print(string.ascii_uppercase[:5], string.digits)
```

| Module | Useful for |
|---|---|
| `math` | maths functions and constants |
| `random` | random numbers, shuffling, sampling |
| `datetime`, `time` | dates, times, timing code |
| `os`, `pathlib`, `shutil` | files, folders, paths |
| `sys` | command-line arguments, interpreter settings |
| `collections` | `Counter`, `deque`, `defaultdict`, `namedtuple` |
| `itertools` | permutations, combinations, infinite iterators |
| `json`, `csv` | reading and writing data formats |
| `re` | regular expressions |
| `statistics` | mean, median, mode, standard deviation |

:::quiz
Q. What is `__name__` when a module is imported?
- `"__main__"`
* The module's name, e.g. `"geometry"`
- `None`
- The file path
= It is `"__main__"` only when the file is run directly.

Q. After `from math import sqrt`, how do you call it?
- `math.sqrt(9)`
* `sqrt(9)`
- `math::sqrt(9)`
- `import sqrt(9)`
= `from … import` brings the name straight into your namespace.

Q. Which command installs a third-party package?
* `pip install requests`
- `python install requests`
- `import requests --install`
- `apt python requests`
= pip downloads packages from the Python Package Index (PyPI).

Q. Which module gives you `Counter` and `deque`?
- `itertools`
* `collections`
- `math`
- `functools`
= `collections` provides specialised container types.
:::
