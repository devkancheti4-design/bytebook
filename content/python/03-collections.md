=== lists | Lists
unit: Data Structures in Python
desc: Python's workhorse collection: creating, indexing and slicing lists, adding and removing items, sorting, copying, 2D lists and the list methods you will use daily.

A **list** is an ordered, **mutable** collection that can hold items of any type. It is a dynamic array underneath — like C++'s `vector`.

```python run
marks = [78, 92, 65, 88]
mixed = [1, "two", 3.0, True, [5, 6]]
empty = []
print(marks[0], marks[-1], marks[1:3], len(marks))
marks[2] = 70                   # lists are mutable
print(marks)
print(mixed[4][1])              # a list inside a list
```

## Adding and removing

| Method | Effect |
|---|---|
| `append(x)` | add `x` at the end |
| `insert(i, x)` | insert `x` before index `i` |
| `extend(iterable)` | add every item of another collection |
| `remove(x)` | remove the first occurrence of `x` (error if absent) |
| `pop()` / `pop(i)` | remove and return the last item / item at `i` |
| `clear()` | remove everything |
| `del lst[i]`, `del lst[a:b]` | delete by index or slice |

```python run
cart = ["pen", "notebook"]
cart.append("eraser")
cart.insert(1, "pencil")
cart.extend(["ruler", "glue"])
print(cart)
cart.remove("glue")
last = cart.pop()
print("popped", last, "->", cart)
del cart[0]
print(cart, "pencil" in cart, cart.index("eraser"))
```

## Sorting and searching

```python run
nums = [42, 7, 19, 7, 88, 3]
print(sorted(nums))                  # new sorted list; nums unchanged
nums.sort(reverse=True)              # sorts in place
print(nums)
print(min(nums), max(nums), sum(nums), nums.count(7))

students = [("Asha", 88), ("Ravi", 95), ("Meera", 88)]
students.sort(key=lambda s: (-s[1], s[0]))     # marks descending, then name
print(students)

words = ["banana", "apple", "Cherry", "fig"]
print(sorted(words))                  # uppercase sorts before lowercase
print(sorted(words, key=str.lower))   # case-insensitive
print(sorted(words, key=len))         # by length (ties keep their order)
```

## Lists are references: copying correctly

```python run
a = [1, 2, [3, 4]]
b = a                 # same list
c = a[:]              # shallow copy (also list(a) or a.copy())
import copy
d = copy.deepcopy(a)  # copies nested lists too

a[0] = 100
a[2].append(5)
print("a", a)
print("b", b)         # sees everything
print("c", c)         # own outer list, but shares the inner list
print("d", d)         # fully independent
```

## 2D lists

```python run
rows, cols = 3, 4
grid = [[0] * cols for _ in range(rows)]      # correct way
grid[1][2] = 9
for row in grid:
    print(row)

wrong = [[0] * cols] * rows                   # three references to ONE row!
wrong[1][2] = 9
print(wrong)

matrix = [[1, 2, 3], [4, 5, 6]]
transpose = [list(col) for col in zip(*matrix)]
print(transpose)
```

:::mistake [[0] * n] * m
Multiplying a list of lists copies the **reference**, so every row is the same object. Build 2D lists with a comprehension: `[[0] * n for _ in range(m)]`.
:::

## Using a list as a stack or queue

```python run
stack = []
stack.append(1); stack.append(2); stack.append(3)
print(stack.pop(), stack.pop())           # LIFO: 3 2

from collections import deque
queue = deque(["a", "b"])
queue.append("c")
print(queue.popleft(), queue.popleft())   # FIFO: a b — O(1) at both ends
```

`list.pop(0)` also works as a queue, but it is O(n) because every element shifts. Use `collections.deque` for queues.

## List operation costs

| Operation | Cost |
|---|---|
| `lst[i]`, `lst[i] = x`, `len(lst)` | O(1) |
| `append`, `pop()` | O(1) amortised |
| `insert(0, x)`, `pop(0)`, `remove(x)` | O(n) |
| `x in lst`, `index`, `count` | O(n) |
| `sort()` (Timsort) | O(n log n) |

:::quiz
Q. What is `[10, 20, 30, 40][1:3]`?
- `[10, 20]`
* `[20, 30]`
- `[20, 30, 40]`
- `[30, 40]`
= Slices include the start index and stop before the end index.

Q. What is the difference between `lst.sort()` and `sorted(lst)`?
* `sort()` changes the list in place and returns `None`; `sorted()` returns a new list
- They are identical
- `sorted()` only works on numbers
- `sort()` returns a new list
= A classic bug: `lst = lst.sort()` sets `lst` to `None`.

Q. After `a = [1, 2]; b = a; b += [3]`, what is `a`?
- `[1, 2]`
* `[1, 2, 3]`
- `[3]`
- An error
= `+=` on a list extends it in place, and `a` and `b` are the same list.

Q. Which is the best way to implement a queue with fast removal from the front?
- `list.pop(0)`
* `collections.deque.popleft()`
- `list.remove(lst[0])`
- `del lst[-1]`
= `deque` removes from either end in O(1).
:::

=== tuples-sets | Tuples & Sets
desc: Immutable tuples for fixed records and packing/unpacking, and sets for uniqueness and fast membership — with union, intersection and difference.

## Tuples

A **tuple** is an ordered, **immutable** sequence. Use it for fixed groups of values: coordinates, RGB colours, a database row, multiple return values.

```python run
point = (3, 4)
rgb = 255, 128, 0              # brackets are optional
single = (42,)                 # a one-item tuple needs a trailing comma
print(point[0], rgb, type(single), len(rgb))

x, y = point                   # unpacking
print(f"x={x}, y={y}")

def min_max(values):
    return min(values), max(values)    # returns a tuple

lo, hi = min_max([7, 2, 9, 4])
print(lo, hi)
# point[0] = 5                 # TypeError: tuples are immutable
```

| List | Tuple |
|---|---|
| `[1, 2, 3]` | `(1, 2, 3)` |
| mutable | **immutable** |
| many methods | only `count` and `index` |
| variable collections | fixed records |
| cannot be a dict key | **can** be a dict key (if its items are hashable) |
| slightly more memory | slightly less memory |

```python run
distances = {("Delhi", "Agra"): 233, ("Mumbai", "Pune"): 149}   # tuple keys
print(distances[("Mumbai", "Pune")])

from collections import namedtuple
Student = namedtuple("Student", ["name", "roll", "cgpa"])
s = Student("Asha", 101, 9.1)
print(s.name, s.cgpa, s)
```

## Sets

A **set** is an unordered collection of **unique**, hashable items. It is a hash table underneath, so membership tests are **O(1)** on average.

```python run
nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
unique = set(nums)
print(unique, len(unique))
unique.add(7)
unique.discard(100)            # no error if missing (remove() would raise KeyError)
print(4 in unique, 8 in unique)
print(sorted(unique))
empty = set()                  # {} would be an empty DICT
```

## Set operations

Sets support the operations from [Discrete Mathematics](@discrete/sets) directly:

| Operation | Operator | Method |
|---|---|---|
| Union A ∪ B | `a \| b` | `a.union(b)` |
| Intersection A ∩ B | `a & b` | `a.intersection(b)` |
| Difference A − B | `a - b` | `a.difference(b)` |
| Symmetric difference A ⊕ B | `a ^ b` | `a.symmetric_difference(b)` |
| Subset A ⊆ B | `a <= b` | `a.issubset(b)` |

```python run
python_club = {"Asha", "Ravi", "Meera", "Kiran"}
dsa_club = {"Ravi", "Kiran", "Zoya"}
print("both clubs:   ", sorted(python_club & dsa_club))
print("either club:  ", sorted(python_club | dsa_club))
print("only python:  ", sorted(python_club - dsa_club))
print("exactly one:  ", sorted(python_club ^ dsa_club))
print({"Ravi", "Kiran"} <= dsa_club)
```

:::note Unordered means no indexing
`my_set[0]` is an error, and the printed order of a set is not guaranteed. Sort it when you need a stable order, as above.
:::

A `frozenset` is an immutable set, usable as a dictionary key or as an element of another set.

:::quiz
Q. How do you write a tuple containing only the number 5?
- `(5)`
* `(5,)`
- `tuple 5`
- `[5]`
= `(5)` is just the number 5 in brackets; the comma makes it a tuple.

Q. What is `len({1, 2, 2, 3, 3, 3})`?
- 6
* 3
- 1
- An error
= Sets keep only unique elements.

Q. For `a = {1, 2, 3}` and `b = {2, 3, 4}`, what is `a - b`?
* `{1}`
- `{4}`
- `{1, 4}`
- `{2, 3}`
= Difference keeps the elements of `a` that are not in `b`.

Q. Which can be used as a dictionary key?
- A list
- A set
* A tuple of strings
- A dictionary
= Keys must be hashable (immutable); tuples of immutable items are.
:::

=== dictionaries | Dictionaries
desc: Key–value storage with O(1) lookup: creating and updating dicts, safe access with get, looping over keys, values and items, nesting, counting and grouping.

A **dictionary** (`dict`) maps **keys** to **values**. Lookup by key is **O(1)** on average because a dict is a hash table. Since Python 3.7, dicts remember **insertion order**.

```python run
student = {"name": "Asha", "roll": 101, "cgpa": 9.1}
print(student["name"])
student["cgpa"] = 9.3              # update
student["city"] = "Pune"           # add a new key
del student["roll"]                # remove
print(student)
print(len(student), "city" in student, "roll" in student)
```

## Safe access

`d[key]` raises `KeyError` if the key is missing. `get` returns a default instead:

```python run
prices = {"pen": 10, "notebook": 45}
print(prices.get("pen"), prices.get("eraser"), prices.get("eraser", 0))
stock = prices.setdefault("ruler", 25)     # insert only if missing
print(stock, prices)
print(prices.pop("pen"), prices)
```

## Looping

```python run
marks = {"Asha": 91, "Ravi": 78, "Meera": 85}
for name in marks:                     # keys
    print(name, end=" ")
print()
print(list(marks.values()), sum(marks.values()))
for name, m in marks.items():          # key-value pairs
    print(f"{name:6} {m} {'distinction' if m >= 85 else ''}")
topper = max(marks, key=marks.get)
print("Topper:", topper)
print(sorted(marks.items(), key=lambda kv: kv[1], reverse=True))
```

## Counting and grouping

```python run
text = "the quick brown fox jumps over the lazy dog the end"
freq = {}
for word in text.split():
    freq[word] = freq.get(word, 0) + 1
print(freq["the"], freq["fox"])

from collections import Counter, defaultdict
c = Counter(text.split())
print(c.most_common(2))

by_length = defaultdict(list)          # missing keys start as []
for word in set(text.split()):
    by_length[len(word)].append(word)
print({k: sorted(v) for k, v in sorted(by_length.items())})
```

## Nested dictionaries

```python run
course = {
    "CSE101": {"name": "Programming in C", "credits": 4, "students": ["Asha", "Ravi"]},
    "CSE102": {"name": "Data Structures", "credits": 4, "students": ["Meera"]},
}
course["CSE102"]["students"].append("Kiran")
for code, info in course.items():
    print(f"{code}: {info['name']} ({info['credits']} credits) - {len(info['students'])} students")
```

## Building and merging

```python run
keys = ["a", "b", "c"]
d1 = dict(zip(keys, [1, 2, 3]))
d2 = {"c": 30, "d": 40}
print(d1 | d2)                      # merge (Python 3.9+); right side wins on clashes
d1.update(d2)
print(d1)
squares = {n: n * n for n in range(1, 6)}
print(squares)
inverted = {v: k for k, v in squares.items()}
print(inverted[16])
```

| Operation | Average cost |
|---|---|
| `d[k]`, `d[k] = v`, `k in d`, `del d[k]` | O(1) |
| loop over all items | O(n) |

:::quiz
Q. What does `{"a": 1}.get("b", 0)` return?
- `None`
* `0`
- A `KeyError`
- `"b"`
= `get` returns the default when the key is missing.

Q. How do you loop over keys **and** values together?
- `for k, v in d:`
* `for k, v in d.items():`
- `for k, v in d.values():`
- `for k, v in d.keys():`
= `items()` yields `(key, value)` pairs.

Q. What is printed?
```python
d = {"x": 1, "y": 2}
d["x"] = 5
print(len(d), d["x"])
```
- 3 5
* 2 5
- 2 1
- An error
= Assigning to an existing key replaces its value; it does not add a new key.

Q. Why is `key in my_dict` fast?
* Dictionaries are hash tables, giving O(1) average lookup
- Keys are kept sorted
- Python caches recent lookups
- It is not fast; it is O(n)
= Hashing jumps straight to the key's slot.
:::

=== comprehensions | Comprehensions
desc: Build lists, sets and dictionaries in one readable line, add filters and conditions, nest them, and know when a plain loop is clearer.

A **comprehension** builds a new collection from an existing one in a single expression:

```python
[expression for item in iterable if condition]
```

```python run
nums = [1, 2, 3, 4, 5, 6, 7, 8]
squares = [n * n for n in nums]
evens = [n for n in nums if n % 2 == 0]
labels = ["even" if n % 2 == 0 else "odd" for n in nums]     # if-else goes BEFORE for
print(squares)
print(evens)
print(labels)
```

The equivalent loop for `evens` is four lines:

```python
evens = []
for n in nums:
    if n % 2 == 0:
        evens.append(n)
```

## Set and dictionary comprehensions

```python run
words = ["apple", "banana", "avocado", "cherry", "blueberry"]
first_letters = {w[0] for w in words}                 # set: unique
lengths = {w: len(w) for w in words}                  # dict
long_words = {w: n for w, n in lengths.items() if n > 6}
print(sorted(first_letters))
print(lengths)
print(long_words)
```

## Nested comprehensions

Read the `for` clauses left to right, exactly as nested loops:

```python run
pairs = [(x, y) for x in range(1, 4) for y in range(1, 4) if x != y]
print(pairs)

matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [v for row in matrix for v in row]
table = [[r * c for c in range(1, 5)] for r in range(1, 4)]
print(flat)
for row in table:
    print(row)
```

## Generator expressions

Use round brackets to get a **generator** that produces values on demand instead of building a whole list in memory. Perfect inside `sum`, `max`, `any` and `all`:

```python run
print(sum(n * n for n in range(1, 101)))                 # no list created
print(any(c.isdigit() for c in "pass1word"))
print(all(len(w) > 2 for w in ["cat", "dog", "ox"]))
print(max((len(w), w) for w in ["pear", "fig", "banana"]))
```

## Real examples

```python run
marks = {"Asha": 91, "Ravi": 38, "Meera": 85, "Kiran": 29}
passed = [name for name, m in marks.items() if m >= 40]
grade = {name: ("A" if m >= 85 else "B" if m >= 40 else "F") for name, m in marks.items()}
primes = [n for n in range(2, 50) if all(n % d for d in range(2, int(n ** 0.5) + 1))]
print(passed)
print(grade)
print(primes)
```

:::tip Keep it readable
If a comprehension needs more than one condition and two loops, or you have to squint to read it, write a normal loop instead. Clarity beats cleverness.
:::

:::quiz
Q. What does `[x * 2 for x in range(4) if x % 2]` produce?
- `[0, 2, 4, 6]`
* `[2, 6]`
- `[0, 4]`
- `[1, 3]`
= Only odd `x` (1 and 3) pass the filter, then they are doubled.

Q. Where does an `if … else` go in a comprehension that keeps every item?
* Before the `for`: `[a if c else b for x in xs]`
- After the `for`: `[x for x in xs if c else b]`
- It is not allowed
- Inside the iterable
= A trailing `if` filters; a conditional expression before `for` chooses a value.

Q. What is `{c for c in "banana"}`?
- `["b", "a", "n"]`
* `{"b", "a", "n"}`
- `{"b": 1, "a": 3, "n": 2}`
- `"ban"`
= Curly braces with a single expression build a set of unique characters.

Q. Why use `sum(x * x for x in data)` instead of `sum([x * x for x in data])`?
- It gives a different answer
* The generator avoids building a temporary list in memory
- Lists cannot be summed
- It is required syntax
= Both give the same result; the generator is more memory-efficient.
:::
