=== sets | Sets
unit: Sets, Relations & Functions
desc: Sets and their notation, subsets and power sets, union, intersection, difference and complement with Venn diagrams, set identities, Cartesian products and cardinality.

A **set** is an unordered collection of **distinct** objects called **elements**. Order and repetition do not matter: {1, 2, 3} = {3, 1, 2} = {1, 1, 2, 3}.

## Notation

| Notation | Meaning |
|---|---|
| A = {2, 4, 6} | **roster** form: list the elements |
| A = {x ∈ ℤ : x is even, 0 < x < 8} | **set-builder** form: a rule |
| x ∈ A, x ∉ A | x is / is not an element of A |
| ∅ or {} | the **empty set** |
| U | the **universal set** — everything under discussion |
| \|A\| | **cardinality**: the number of elements |
| ℕ, ℤ, ℚ, ℝ | natural numbers, integers, rationals, reals |

## Subsets and the power set

- A ⊆ B (**subset**): every element of A is in B. Every set is a subset of itself, and ∅ ⊆ A for every A.
- A ⊂ B (**proper subset**): A ⊆ B and A ≠ B.
- A = B exactly when A ⊆ B and B ⊆ A — the standard way to prove two sets are equal.

The **power set** P(A) is the set of **all subsets** of A. If |A| = n, then |P(A)| = **2ⁿ** (each element is either in a subset or not).

```python run
from itertools import combinations

A = {"a", "b", "c"}
power_set = [set(c) for r in range(len(A) + 1) for c in combinations(sorted(A), r)]
print(len(power_set), "subsets:")
print([sorted(s) for s in power_set])
```

## Set operations

| Operation | Symbol | Definition | Python |
|---|---|---|---|
| Union | A ∪ B | x ∈ A **or** x ∈ B | `A \| B` |
| Intersection | A ∩ B | x ∈ A **and** x ∈ B | `A & B` |
| Difference | A − B | x ∈ A and x ∉ B | `A - B` |
| Symmetric difference | A ⊕ B | in exactly one of them | `A ^ B` |
| Complement | A′ or Ā | x ∈ U and x ∉ A | `U - A` |

:::diagram venn
shade: union, intersection, a-b, symdiff
caption: The shaded regions of the four main operations. A and B are **disjoint** when A ∩ B = ∅.
:::

Try your own sets:

:::widget venn
a: 1 2 3 4 5 6
b: 4 5 6 7 8
u: 1 2 3 4 5 6 7 8 9 10
:::

## Set identities

They mirror the laws of logic — ∪ is like ∨, ∩ like ∧, complement like ¬:

| Law | Identity |
|---|---|
| Identity | A ∪ ∅ = A, A ∩ U = A |
| Domination | A ∪ U = U, A ∩ ∅ = ∅ |
| Idempotent | A ∪ A = A, A ∩ A = A |
| Complement | A ∪ A′ = U, A ∩ A′ = ∅, (A′)′ = A |
| Commutative | A ∪ B = B ∪ A, A ∩ B = B ∩ A |
| Distributive | A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) |
| **De Morgan** | (A ∪ B)′ = A′ ∩ B′, (A ∩ B)′ = A′ ∪ B′ |
| Absorption | A ∪ (A ∩ B) = A, A ∩ (A ∪ B) = A |
| Difference | A − B = A ∩ B′ |

```python run
U = set(range(1, 11))
A, B = {1, 2, 3, 4, 5}, {4, 5, 6, 7}
comp = lambda X: U - X
print("(A ∪ B)′ =", sorted(comp(A | B)))
print("A′ ∩ B′  =", sorted(comp(A) & comp(B)))
print("De Morgan holds:", comp(A | B) == comp(A) & comp(B), comp(A & B) == comp(A) | comp(B))
print("|A ∪ B| = |A| + |B| - |A ∩ B|:", len(A | B), "=", len(A), "+", len(B), "-", len(A & B))
```

## Cartesian product

The **Cartesian product** A × B is the set of all **ordered pairs** (a, b) with a ∈ A and b ∈ B. |A × B| = |A| · |B|.

```python run
from itertools import product
sizes = ["S", "M", "L"]
colours = ["red", "blue"]
pairs = list(product(sizes, colours))
print(len(pairs), pairs)
```

Order matters in pairs: (1, 2) ≠ (2, 1), so A × B ≠ B × A in general.

## Cardinality of unions

For two sets: |A ∪ B| = |A| + |B| − |A ∩ B| — the intersection was counted twice. This is the **inclusion–exclusion principle**, extended in [Counting](@discrete/inclusion-exclusion).

## Countable and uncountable

A set is **countable** if its elements can be listed as a sequence (a one-to-one match with ℕ). ℤ and ℚ are countable; Cantor's diagonal argument shows ℝ is **uncountable** — there are "more" real numbers than integers.

:::quiz
Q. How many subsets does a set with 5 elements have?
- 10
- 25
* 32
- 120
= |P(A)| = 2ⁿ = 2⁵ = 32, including ∅ and A itself.

Q. If A = {1, 2, 3} and B = {3, 4}, what is A − B?
* {1, 2}
- {4}
- {1, 2, 4}
- {3}
= Elements of A that are not in B.

Q. By De Morgan's law, (A ∩ B)′ equals...
- A′ ∩ B′
* A′ ∪ B′
- A ∪ B
- A − B
= The complement of an intersection is the union of the complements.

Q. If |A| = 3 and |B| = 4, what is |A × B|?
- 7
* 12
- 81
- 64
= Each of the 3 elements of A pairs with each of the 4 elements of B.
:::

=== relations | Relations
desc: Relations as sets of ordered pairs, matrix and digraph representations, the reflexive, symmetric, antisymmetric and transitive properties, equivalence relations and classes, and closures.

A **relation** R from set A to set B is a subset of A × B. If (a, b) ∈ R we write **a R b**: "a is related to b". A relation **on** A is a subset of A × A.

Example on A = {1, 2, 3, 4}: R = "divides" = {(a, b) : a | b}.

R = {(1,1), (1,2), (1,3), (1,4), (2,2), (2,4), (3,3), (4,4)}

## Representations

**Matrix**: M[i][j] = 1 if (i, j) ∈ R.

| | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| **1** | 1 | 1 | 1 | 1 |
| **2** | 0 | 1 | 0 | 1 |
| **3** | 0 | 0 | 1 | 0 |
| **4** | 0 | 0 | 0 | 1 |

**Digraph**: an arrow from a to b for each pair, with a loop at a for each (a, a).

:::diagram graph
nodes: 1(0,0) 2(1.6,0) 3(0,1.4) 4(1.6,1.4)
edges: 1>2 1>3 1>4 2>4
unit: 90
caption: The "divides" relation on {1, 2, 3, 4}. Every vertex also has a self-loop, left out of the drawing.
:::

## Properties of a relation on A

| Property | Definition | Matrix test |
|---|---|---|
| **Reflexive** | a R a for every a ∈ A | all 1s on the diagonal |
| **Irreflexive** | a R a for no a | all 0s on the diagonal |
| **Symmetric** | a R b ⇒ b R a | M = Mᵀ |
| **Antisymmetric** | a R b and b R a ⇒ a = b | no 1 at both (i, j) and (j, i) for i ≠ j |
| **Transitive** | a R b and b R c ⇒ a R c | (M ⊙ M) ≤ M (Boolean product) |

"Divides" is reflexive, antisymmetric and transitive, but not symmetric (1 | 2, but 2 ∤ 1).

```python run
def properties(A, R):
    return {
        "reflexive": all((a, a) in R for a in A),
        "symmetric": all((b, a) in R for (a, b) in R),
        "antisymmetric": all(a == b for (a, b) in R if (b, a) in R),
        "transitive": all((a, d) in R for (a, b) in R for (c, d) in R if b == c),
    }

A = {1, 2, 3, 4}
divides = {(a, b) for a in A for b in A if b % a == 0}
same_parity = {(a, b) for a in A for b in A if a % 2 == b % 2}
less_than = {(a, b) for a in A for b in A if a < b}
for name, R in [("divides", divides), ("same parity", same_parity), ("less than", less_than)]:
    print(f"{name:12}", properties(A, R))
```

## Equivalence relations

A relation that is **reflexive, symmetric and transitive** is an **equivalence relation**. It splits A into disjoint **equivalence classes**: [a] = {x : x R a}.

Example: congruence mod 3 on ℤ — a ≡ b (mod 3) when 3 | (a − b). Its classes are:

- [0] = {…, −3, 0, 3, 6, …}
- [1] = {…, −2, 1, 4, 7, …}
- [2] = {…, −1, 2, 5, 8, …}

The classes form a **partition** of the set: they are non-empty, pairwise disjoint, and together cover everything. Conversely, every partition defines an equivalence relation ("in the same block").

```python run
A = range(0, 12)
classes = {}
for x in A:
    classes.setdefault(x % 3, []).append(x)      # same remainder = same class
for r, members in classes.items():
    print(f"[{r}] = {members}")
```

## Closures

The **closure** of R with respect to a property is the **smallest** relation containing R that has the property.

| Closure | How to get it |
|---|---|
| Reflexive | add (a, a) for every a |
| Symmetric | add (b, a) for every (a, b) |
| Transitive | add (a, c) whenever there is a path a → … → c — **Warshall's algorithm** |

```python run
def transitive_closure(A, R):
    R = set(R)
    for k in A:                          # Warshall: allow k as an intermediate vertex
        for i in A:
            for j in A:
                if (i, k) in R and (k, j) in R:
                    R.add((i, j))
    return R

A = [1, 2, 3, 4]
R = {(1, 2), (2, 3), (3, 4)}
print(sorted(transitive_closure(A, R)))
```

(The same triple loop computes shortest paths in [Floyd–Warshall](@daa/floyd-warshall).)

:::quiz
Q. Which property says "if a R b and b R c then a R c"?
- Reflexive
- Symmetric
* Transitive
- Antisymmetric
= Transitivity chains relationships.

Q. Which is an equivalence relation on the integers?
- a < b
- a divides b
* a ≡ b (mod 5)
- a ≠ b
= Congruence modulo n is reflexive, symmetric and transitive.

Q. How many equivalence classes does congruence mod 4 have on ℤ?
- 2
* 4
- infinitely many
- 1
= The classes [0], [1], [2], [3] correspond to the four possible remainders.

Q. In the matrix of a symmetric relation...
* M[i][j] = M[j][i] for all i, j
- the diagonal is all 1s
- all entries are 1
- there are no 1s on the diagonal
= Symmetric relations have symmetric matrices.
:::

=== partial-orders | Partial Orders & Lattices
desc: Ordering things that are not all comparable: posets, Hasse diagrams, maximal and minimal elements, upper and lower bounds, lattices and topological sorting.

A relation on A is a **partial order** if it is **reflexive, antisymmetric and transitive**. The pair (A, ≼) is a **partially ordered set (poset)**.

Examples:

- (ℤ, ≤) — the usual order.
- (ℤ⁺, |) — divisibility.
- (P(S), ⊆) — subsets ordered by inclusion.

In a **partial** order, some pairs may be **incomparable**: neither 2 | 3 nor 3 | 2. If every pair is comparable, it is a **total (linear) order** — like ≤ on numbers.

## Hasse diagrams

A **Hasse diagram** draws a poset compactly:

1. Draw smaller elements **lower**, so arrows always point up (and are dropped).
2. Omit **self-loops** (reflexivity is assumed).
3. Omit edges implied by **transitivity**: draw a → b only if b **covers** a (nothing in between).

:::diagram graph
nodes: 1(1,3) 2(0,2) 3(2,2) 4(-0.6,1) 6(1,1) 12(0.4,0)
edges: 1-2 1-3 2-4 2-6 3-6 4-12 6-12
unit: 80
caption: Hasse diagram of the divisors of 12 under divisibility. 1 is at the bottom, 12 at the top; 4 and 6 are incomparable.
:::

## Special elements

For a poset (A, ≼) and a subset S:

| Term | Meaning |
|---|---|
| **Maximal** element | nothing in A is strictly greater |
| **Minimal** element | nothing in A is strictly smaller |
| **Greatest** element | greater than or equal to **every** element (unique if it exists) |
| **Least** element | less than or equal to every element |
| **Upper bound** of S | an element ≥ every element of S |
| **Least upper bound** (supremum, join, ∨) | the smallest upper bound |
| **Lower bound** of S | an element ≤ every element of S |
| **Greatest lower bound** (infimum, meet, ∧) | the largest lower bound |

In the divisors of 12: least element 1, greatest element 12. For S = {4, 6}: upper bounds {12}, so lub = 12; lower bounds {1, 2}, so glb = 2. For divisibility, **lub = LCM** and **glb = GCD**.

```python run
from math import gcd

D = [d for d in range(1, 13) if 12 % d == 0]
leq = lambda a, b: b % a == 0                     # a divides b
def lub(x, y): return min(u for u in D if leq(x, u) and leq(y, u))    # smallest common multiple in D
def glb(x, y): return max(l for l in D if leq(l, x) and leq(l, y))    # largest common divisor in D

print("divisors of 12:", D)
print("lub(4, 6) =", lub(4, 6), "  lcm =", 4 * 6 // gcd(4, 6))
print("glb(4, 6) =", glb(4, 6), "  gcd =", gcd(4, 6))
print("covering pairs (Hasse edges):",
      [(a, b) for a in D for b in D if a != b and leq(a, b) and not any(c not in (a, b) and leq(a, c) and leq(c, b) for c in D)])
```

## Lattices

A poset is a **lattice** if **every pair** of elements has both a least upper bound and a greatest lower bound.

- (Divisors of n, |) is a lattice (join = lcm, meet = gcd).
- (P(S), ⊆) is a lattice (join = ∪, meet = ∩).
- A poset with two maximal elements and nothing above them is **not** a lattice.

## Topological sorting

Every finite poset can be extended to a **total order** that respects it: repeatedly remove a minimal element. This is exactly **topological sorting** of a DAG — see [Graph Algorithms](@daa/graph-algorithms).

:::quiz
Q. Which three properties define a partial order?
* Reflexive, antisymmetric, transitive
- Reflexive, symmetric, transitive
- Irreflexive, symmetric, transitive
- Symmetric, antisymmetric, transitive
= Reflexive + symmetric + transitive would be an equivalence relation instead.

Q. In (ℤ⁺, |), are 4 and 6 comparable?
- Yes, 4 | 6
- Yes, 6 | 4
* No
- Only modulo 2
= Neither divides the other.

Q. In the divisors of 12 under divisibility, what is glb(4, 6)?
- 1
* 2
- 12
- 24
= The greatest common lower bound is gcd(4, 6) = 2.

Q. What does a Hasse diagram leave out?
- The elements
* Self-loops, arrowheads and edges implied by transitivity
- The covering relations
- The least element
= Only covering edges are drawn, with larger elements placed higher.
:::

=== functions | Functions
desc: Functions as special relations: domain, codomain and range, one-to-one, onto and bijective functions, composition, inverses, floor and ceiling, and counting functions.

A **function** f : A → B assigns to **each** element of A **exactly one** element of B.

- A is the **domain**; B is the **codomain**.
- f(a) = b: b is the **image** of a; a is a **pre-image** of b.
- The **range** is the set of all images: {f(a) : a ∈ A} ⊆ B.

A relation fails to be a function if some element of A has **no** image or **two** images.

## Types of functions

| Type | Also called | Definition |
|---|---|---|
| **One-to-one** | injective | different inputs → different outputs: f(a₁) = f(a₂) ⇒ a₁ = a₂ |
| **Onto** | surjective | every element of B is hit: range = codomain |
| **Bijection** | one-to-one correspondence | both injective and surjective |

| Function on ℤ → ℤ | Injective? | Surjective? |
|---|---|---|
| f(x) = x + 1 | yes | yes — bijection |
| f(x) = 2x | yes | no (odd numbers are missed) |
| f(x) = x² | no (f(2) = f(−2)) | no |
| f(x) = ⌊x / 2⌋ | no | yes |

```python run
def classify(f, A, B):
    images = [f(a) for a in A]
    injective = len(set(images)) == len(images)
    surjective = set(images) == set(B)
    return f"injective={injective}, surjective={surjective}, bijective={injective and surjective}"

A = range(-3, 4)
print("x+1 :", classify(lambda x: x + 1, A, range(-2, 5)))
print("x^2 :", classify(lambda x: x * x, A, range(0, 10)))
print("2x  :", classify(lambda x: 2 * x, A, range(-6, 7)))
```

## Composition

(g ∘ f)(x) = g(f(x)) — apply f first, then g. Composition is associative but **not commutative**:

```python run
f = lambda x: x + 3
g = lambda x: 2 * x
print("(g∘f)(5) =", g(f(5)))     # 2 * (5 + 3) = 16
print("(f∘g)(5) =", f(g(5)))     # 2 * 5 + 3 = 13
```

## Inverse functions

A function has an inverse f⁻¹ **if and only if it is a bijection**. Then f⁻¹(b) = a exactly when f(a) = b, and f⁻¹(f(x)) = x. Example: f(x) = 3x + 2 on ℝ has f⁻¹(y) = (y − 2)/3.

## Floor and ceiling

- ⌊x⌋ (**floor**): the largest integer ≤ x. ⌊3.7⌋ = 3, ⌊−3.7⌋ = −4.
- ⌈x⌉ (**ceiling**): the smallest integer ≥ x. ⌈3.2⌉ = 4, ⌈−3.2⌉ = −3.

They appear constantly in algorithm analysis: a binary tree with n nodes has height at least ⌈log₂(n + 1)⌉ − 1; splitting n items into pages of 10 needs ⌈n/10⌉ pages.

## Counting functions

For finite sets with |A| = m and |B| = n:

| Count | Formula |
|---|---|
| all functions A → B | nᵐ |
| injective functions (m ≤ n) | n!/(n − m)! |
| bijections (m = n) | n! |
| surjective functions | Σₖ (−1)ᵏ C(n, k)(n − k)ᵐ (by inclusion–exclusion) |

## Pigeonhole connection

If m > n, **no** function A → B can be injective: some two elements of A must share an image. That is the [pigeonhole principle](@discrete/counting).

:::quiz
Q. f : ℤ → ℤ, f(x) = 3x. Is f onto?
- Yes
* No — only multiples of 3 are hit
- Only on positive integers
- It is not a function
= Values like 1 and 2 have no pre-image.

Q. Which functions have inverses?
- All injective functions
- All surjective functions
* Exactly the bijections
- Only linear functions
= An inverse must be defined on the whole codomain and be single-valued.

Q. If f(x) = x² and g(x) = x + 1, what is (f ∘ g)(2)?
- 5
* 9
- 4
- 6
= f(g(2)) = f(3) = 9.

Q. How many functions are there from a 3-element set to a 2-element set?
- 6
* 8
- 9
- 5
= Each of the 3 elements independently chooses one of 2 images: 2³ = 8.
:::
