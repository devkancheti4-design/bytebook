=== graph-theory | Graph Theory
unit: Graphs, Number Theory & Algebra
desc: Graphs as mathematics: simple graphs and multigraphs, degree and the handshake lemma, special graphs, isomorphism, Euler and Hamilton paths, planarity and graph colouring.

A **graph** G = (V, E) has a set of **vertices** V and a set of **edges** E, each joining two vertices. Graph theory began in 1736 when Leonhard Euler proved that nobody could walk across all seven bridges of Königsberg exactly once.

## Kinds of graphs

| Kind | Allows |
|---|---|
| **Simple graph** | undirected edges, no loops, no multiple edges |
| **Multigraph** | multiple edges between the same pair |
| **Pseudograph** | loops and multiple edges |
| **Directed graph** | edges with direction (arcs) |
| **Weighted graph** | a number on each edge |

## Degree and the handshake lemma

The **degree** deg(v) is the number of edges at v (a loop counts twice). In every undirected graph:

> Σ deg(v) = 2|E|

So the number of **odd-degree vertices is always even**. In a directed graph, Σ in-degree = Σ out-degree = |E|.

## Special graphs

| Graph | Description | Edges |
|---|---|---|
| Complete graph Kₙ | every pair of vertices adjacent | n(n − 1)/2 |
| Cycle Cₙ | a single ring of n vertices | n |
| Wheel Wₙ | a cycle Cₙ plus a hub joined to all | 2n |
| Hypercube Qₙ | vertices are n-bit strings; edges join strings differing in one bit | n·2ⁿ⁻¹ |
| Bipartite | vertices split into two sets, edges only between sets | — |
| Complete bipartite Kₘ,ₙ | every vertex of one side joined to every vertex of the other | m·n |

:::diagram graph
edges: 1-2 1-3 1-4 1-5 2-3 2-4 2-5 3-4 3-5 4-5
caption: The complete graph K₅: 5 vertices, C(5, 2) = 10 edges. It is the smallest graph that cannot be drawn in the plane without crossings.
:::

A graph is **bipartite if and only if it has no odd-length cycle** — checkable by 2-colouring with BFS.

## Isomorphism

Two graphs are **isomorphic** if there is a bijection between their vertices that preserves adjacency — they are the same graph drawn differently. Isomorphic graphs share every **invariant**: number of vertices and edges, degree sequence, number of cycles of each length, connectedness. Different invariants prove two graphs are **not** isomorphic; equal invariants do not prove that they are.

## Paths, circuits and connectivity

- A **path** is a sequence of edges from one vertex to another; a **circuit** (cycle) returns to its start.
- A graph is **connected** if every pair of vertices has a path between them.
- A **cut vertex** (articulation point) or **bridge** is a vertex or edge whose removal disconnects the graph.

## Euler paths and circuits

An **Euler circuit** uses **every edge exactly once** and returns to the start; an **Euler path** uses every edge once without returning.

> A connected graph has an **Euler circuit** iff **every vertex has even degree**.
> It has an **Euler path** (but no circuit) iff it has **exactly two** odd-degree vertices — the path starts at one and ends at the other.

Königsberg had four land masses with degrees 5, 3, 3, 3 — four odd vertices, so no Euler path exists.

```python run
from collections import Counter

def euler_status(edges):
    deg = Counter()
    for u, v in edges:
        deg[u] += 1
        deg[v] += 1
    odd = [v for v in deg if deg[v] % 2]
    if not odd:
        return "Euler circuit exists"
    if len(odd) == 2:
        return f"Euler path from {odd[0]} to {odd[1]}"
    return f"neither ({len(odd)} odd vertices)"

konigsberg = [("A","B"), ("A","B"), ("A","C"), ("A","C"), ("A","D"), ("B","D"), ("C","D")]
house = [(1,2), (2,3), (3,4), (4,1), (1,5), (2,5), (1,3), (2,4)]
square = [(1,2), (2,3), (3,4), (4,1)]
for name, g in [("Konigsberg", konigsberg), ("envelope house", house), ("square", square)]:
    print(f"{name:15} {euler_status(g)}")
```

## Hamilton paths and circuits

A **Hamilton circuit** visits **every vertex exactly once** and returns to the start. Unlike the Euler case, **no simple test is known** — deciding whether one exists is NP-complete. Sufficient conditions exist: **Dirac's theorem** says a simple graph with n ≥ 3 vertices where every vertex has degree ≥ n/2 has a Hamilton circuit.

| | Euler | Hamilton |
|---|---|---|
| Visits every | **edge** once | **vertex** once |
| Easy test | yes — degrees | no — NP-complete |
| Application | route inspection, drawing without lifting the pen | travelling salesperson |

## Planar graphs

A graph is **planar** if it can be drawn without edges crossing. For a connected planar graph, **Euler's formula** holds:

> **V − E + F = 2** (F = number of faces, including the outer one)

Consequence: a connected simple planar graph with V ≥ 3 has E ≤ 3V − 6. K₅ has E = 10 > 3·5 − 6 = 9, so **K₅ is not planar**. By **Kuratowski's theorem**, a graph is planar iff it contains no subdivision of K₅ or K₃,₃.

## Graph colouring

A **proper colouring** gives adjacent vertices different colours; the minimum number of colours is the **chromatic number** χ(G).

- χ(Kₙ) = n; χ(Cₙ) = 2 if n is even, 3 if odd; χ of a bipartite graph = 2.
- **Four colour theorem** (1976, proved with a computer): every planar graph has χ ≤ 4.
- Applications: exam timetabling (subjects sharing a student cannot share a slot), register allocation in compilers, frequency assignment.

:::quiz
Q. A graph has degrees 4, 3, 3, 2, 2. How many edges?
- 14
* 7
- 5
- 6
= Sum of degrees 14 = 2|E|.

Q. When does a connected graph have an Euler circuit?
* When every vertex has even degree
- When every vertex has odd degree
- When it has exactly two vertices
- When it is complete
= Each visit to a vertex uses one edge in and one edge out.

Q. How many edges does K₆ have?
- 6
- 12
* 15
- 30
= n(n − 1)/2 = 6 × 5 / 2 = 15.

Q. A connected planar graph has 8 vertices and 12 edges. How many faces?
- 4
* 6
- 20
- 2
= V − E + F = 2 → 8 − 12 + F = 2 → F = 6.
:::

=== trees | Trees
desc: Trees in discrete mathematics: characterisations, rooted and m-ary trees with their counting formulas, spanning trees, Cayley's formula and prefix codes.

A **tree** is a **connected, acyclic** undirected graph. Trees are the most important graphs in computer science: file systems, parse trees, decision trees, search trees, heaps, tries.

## Equivalent characterisations

For a graph T with n vertices, these are all equivalent — any one of them makes T a tree:

1. T is connected and has no cycles.
2. There is a **unique simple path** between every pair of vertices.
3. T is connected and has exactly **n − 1 edges**.
4. T has no cycles and has exactly **n − 1 edges**.
5. T is connected, but removing any edge disconnects it (every edge is a bridge).
6. T has no cycles, but adding any edge creates exactly one cycle.

A graph with no cycles that may be disconnected is a **forest** — a collection of trees. A forest with n vertices and c components has n − c edges.

## Rooted and m-ary trees

Choosing one vertex as the **root** gives every edge a direction away from it, with the usual parent, child, leaf, level and height terms (see [Trees & Binary Trees](@dsa/trees) in Data Structures).

An **m-ary tree** gives each internal vertex at most m children; a **full m-ary tree** gives each internal vertex exactly m children.

| For a full m-ary tree with… | |
|---|---|
| i internal vertices | n = mi + 1 vertices, l = (m − 1)i + 1 leaves |
| n vertices | i = (n − 1)/m internal, l = ((m − 1)n + 1)/m leaves |
| l leaves | n = (ml − 1)/(m − 1), i = (l − 1)/(m − 1) |

An m-ary tree of height h has at most **mʰ leaves**, so a tree with l leaves has height at least ⌈log_m l⌉.

```python run
def full_mary(m, internal):
    n = m * internal + 1
    leaves = (m - 1) * internal + 1
    return n, leaves

# A knockout chess tournament: each match (internal vertex) has 2 players (children)
players = 64
matches = (players - 1) // (2 - 1)
print(f"{players} players need {matches} matches")
print("full ternary tree with 10 internal vertices (vertices, leaves):", full_mary(3, 10))

# Chain letter: each person sends to 4 others; 100 people never send (leaves)
m, l = 4, 100
print(f"people involved: {(m * l - 1) // (m - 1)}, senders: {(l - 1) // (m - 1)}")
```

## Spanning trees

A **spanning tree** of a connected graph G is a subgraph that is a tree and includes **every** vertex of G. Every connected graph has one (delete cycle edges until none are left); BFS and DFS each produce one. With weights, the cheapest is the **minimum spanning tree** — [Kruskal and Prim](@daa/mst).

**Cayley's formula**: the complete graph Kₙ has **nⁿ⁻²** different spanning trees (equivalently, there are nⁿ⁻² labelled trees on n vertices). K₄ has 4² = 16.

```python run
from itertools import combinations

def is_tree(n, edges):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x
    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            return False          # a cycle
        parent[ru] = rv
    return len(edges) == n - 1    # n - 1 edges and no cycle: connected tree

for n in range(2, 6):
    all_edges = list(combinations(range(n), 2))
    count = sum(1 for es in combinations(all_edges, n - 1) if is_tree(n, es))
    print(f"K{n}: {count} spanning trees, Cayley n^(n-2) = {n ** (n - 2)}")
```

## Prefix codes and decision trees

- Binary trees whose leaves are symbols give **prefix codes** — the basis of [Huffman coding](@daa/huffman).
- A **decision tree** for sorting n items has n! leaves, so its height (worst-case comparisons) is at least log₂(n!) = Ω(n log n) — the proof that comparison sorting cannot beat O(n log n).

:::quiz
Q. How many edges does a tree with 25 vertices have?
- 25
* 24
- 26
- It depends on its shape
= Every tree on n vertices has n − 1 edges.

Q. A full binary tree has 15 internal vertices. How many leaves does it have?
- 15
* 16
- 31
- 30
= l = (m − 1)i + 1 = 15 + 1 = 16.

Q. How many labelled trees are there on 5 vertices?
- 25
* 125
- 120
- 32
= Cayley's formula: 5³ = 125.

Q. A forest has 20 vertices and 3 components. How many edges?
* 17
- 20
- 19
- 23
= Each component (tree) has one fewer edge than vertices: 20 − 3.
:::

=== number-theory | Number Theory
desc: Divisibility, primes and the fundamental theorem of arithmetic, GCD and LCM with Euclid's algorithm, modular arithmetic, congruences, modular inverses, fast exponentiation and an RSA preview.

Number theory studies the integers. Once called the "purest" mathematics, it now secures every HTTPS connection and UPI payment through cryptography.

## Divisibility

a **divides** b (written a | b) if b = a·k for some integer k. Examples: 3 | 12, 7 ∤ 12.

**Division algorithm**: for integers a and d > 0, there are unique q and r with a = d·q + r and **0 ≤ r < d**. Here q = a div d and r = a mod d.

## Primes

A **prime** is an integer p > 1 whose only positive divisors are 1 and p. Every integer > 1 is either prime or **composite**.

**Fundamental theorem of arithmetic**: every integer > 1 can be written as a product of primes in exactly one way (up to order): 360 = 2³ · 3² · 5.

There are **infinitely many primes** (Euclid's proof is in the [proofs lesson](@discrete/proofs)). To test n, try divisors up to √n; to list all primes up to n, use the **Sieve of Eratosthenes**:

```python run
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for p in range(2, int(n ** 0.5) + 1):
        if is_prime[p]:
            for multiple in range(p * p, n + 1, p):   # cross off multiples of p
                is_prime[multiple] = False
    return [i for i, ok in enumerate(is_prime) if ok]

def factorise(n):
    factors, d = {}, 2
    while d * d <= n:
        while n % d == 0:
            factors[d] = factors.get(d, 0) + 1
            n //= d
        d += 1
    if n > 1:
        factors[n] = factors.get(n, 0) + 1
    return factors

print(sieve(60))
for n in (360, 1001, 97, 2026):
    print(n, "=", " · ".join(f"{p}^{e}" if e > 1 else str(p) for p, e in factorise(n).items()))
```

## GCD and LCM

- **gcd(a, b)**: the largest integer dividing both. gcd(84, 36) = 12.
- **lcm(a, b)**: the smallest positive integer divisible by both. lcm(4, 6) = 12.
- **gcd(a, b) · lcm(a, b) = a · b**.
- a and b are **coprime** (relatively prime) if gcd(a, b) = 1.

**Euclid's algorithm**: gcd(a, b) = gcd(b, a mod b), and gcd(a, 0) = a. It takes O(log min(a, b)) steps.

**Bézout's identity**: there exist integers s, t with gcd(a, b) = s·a + t·b. The **extended Euclidean algorithm** finds them.

```python run
def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, s, t = extended_gcd(b, a % b)
    return g, t, s - (a // b) * t

a, b = 252, 198
x, y = a, b
while y:
    print(f"gcd({x}, {y})", end=" = ")
    x, y = y, x % y
print(f"gcd({x}, 0) = {x}")
g, s, t = extended_gcd(a, b)
print(f"Bezout: {g} = {s}*{a} + {t}*{b}")
print("lcm =", a * b // g)
```

## Modular arithmetic

a ≡ b (mod m) — "a is **congruent** to b modulo m" — means m | (a − b): a and b leave the same remainder when divided by m. Clock arithmetic is mod 12; days of the week are mod 7.

Congruences can be added and multiplied: if a ≡ b and c ≡ d (mod m), then a + c ≡ b + d and a·c ≡ b·d (mod m). So you can reduce at every step:

> (a + b) mod m = ((a mod m) + (b mod m)) mod m
> (a · b) mod m = ((a mod m) · (b mod m)) mod m

### Fast modular exponentiation

Compute aᵉ mod m by **repeated squaring** in O(log e) multiplications:

```python run
def mod_pow(a, e, m):
    result = 1
    a %= m
    while e > 0:
        if e & 1:                 # this bit of the exponent is set
            result = result * a % m
        a = a * a % m             # square for the next bit
        e >>= 1
    return result

print(mod_pow(3, 200, 13), pow(3, 200, 13))          # Python's pow does the same
print("last 3 digits of 7^2026:", mod_pow(7, 2026, 1000))
days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
print("100 days after a Saturday is a", days[(days.index("Sat") + 100) % 7])
```

## Modular inverses

The **inverse** of a modulo m is a number a⁻¹ with a·a⁻¹ ≡ 1 (mod m). It exists **iff gcd(a, m) = 1**, and the extended Euclidean algorithm finds it. Example: 3⁻¹ mod 7 = 5, since 3·5 = 15 ≡ 1.

**Fermat's little theorem**: if p is prime and p ∤ a, then aᵖ⁻¹ ≡ 1 (mod p). So a⁻¹ ≡ aᵖ⁻² (mod p).

## Applications

| Application | Number theory used |
|---|---|
| Hash functions h(k) = k mod m | division, choosing prime m |
| ISBN and Aadhaar-style check digits | weighted sums mod 11 / Verhoeff checks |
| Pseudo-random generators xₙ₊₁ = (a·xₙ + c) mod m | linear congruences |
| **RSA encryption** | n = p·q for large primes; e·d ≡ 1 mod (p−1)(q−1); encrypt c = mᵉ mod n |

```python run
p, q = 61, 53                      # toy RSA (real keys use primes with hundreds of digits)
n, phi = p * q, (p - 1) * (q - 1)
e = 17                             # public exponent, coprime with phi
d = pow(e, -1, phi)                # private exponent: modular inverse (Python 3.8+)
message = 65
cipher = pow(message, e, n)
print(f"n={n}, e={e}, d={d}")
print(f"encrypt {message} -> {cipher}, decrypt -> {pow(cipher, d, n)}")
```

:::quiz
Q. What is 47 mod 9?
- 5
* 2
- 7
- 4
= 47 = 9 × 5 + 2.

Q. What is gcd(84, 120)?
- 6
* 12
- 24
- 4
= 84 = 2²·3·7 and 120 = 2³·3·5 share 2²·3 = 12.

Q. Which number has an inverse modulo 12?
- 4
- 6
* 5
- 9
= Only numbers coprime to 12 have inverses; 5·5 = 25 ≡ 1 (mod 12).

Q. What is 2¹⁰ mod 7?
- 1
* 2
- 4
- 3
= 2³ = 8 ≡ 1, so 2¹⁰ = (2³)³·2 ≡ 2.
:::

=== boolean-algebra | Boolean Algebra
desc: The algebra of 0 and 1 behind every circuit: Boolean operations and laws, duality, Boolean functions, sum-of-products and product-of-sums forms, logic gates and Karnaugh-map simplification.

**Boolean algebra** works with two values, **0** and **1**, and three operations:

| Operation | Notation | Logic | Gate |
|---|---|---|---|
| Complement | x′ or x̄ | NOT | inverter |
| Boolean sum | x + y | OR | OR gate |
| Boolean product | x · y or xy | AND | AND gate |

It is propositional logic in algebraic dress (T = 1, F = 0) and set algebra in disguise (∪ = +, ∩ = ·). George Boole introduced it in 1854; Claude Shannon showed in 1937 that it describes switching circuits — the birth of digital electronics.

## Laws

| Law | Sum form | Product form |
|---|---|---|
| Identity | x + 0 = x | x · 1 = x |
| Domination | x + 1 = 1 | x · 0 = 0 |
| Idempotent | x + x = x | x · x = x |
| Complement | x + x′ = 1 | x · x′ = 0 |
| Involution | (x′)′ = x | |
| Commutative | x + y = y + x | xy = yx |
| Associative | x + (y + z) = (x + y) + z | x(yz) = (xy)z |
| Distributive | x(y + z) = xy + xz | x + yz = (x + y)(x + z) |
| Absorption | x + xy = x | x(x + y) = x |
| **De Morgan** | (x + y)′ = x′y′ | (xy)′ = x′ + y′ |

**Duality**: swap + with ·, and 0 with 1, in any identity and you get another valid identity. That is why the laws come in pairs.

## Boolean functions and normal forms

A Boolean function of n variables maps each of the 2ⁿ input combinations to 0 or 1. There are 2^(2ⁿ) such functions.

- **Sum of products (SOP / DNF)**: OR together a **minterm** (an AND of all variables, complemented where 0) for every row where f = 1.
- **Product of sums (POS / CNF)**: AND together a **maxterm** for every row where f = 0.

Example: the **majority** function of three inputs (1 when at least two inputs are 1):

| x | y | z | f |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 |

SOP: f = x′yz + xy′z + xyz′ + xyz, which simplifies to **f = xy + yz + xz**.

## Logic gates

:::diagram gates
show: AND OR NOT NAND NOR XOR
caption: The standard gate symbols. A bubble on the output means NOT.
:::

**NAND** and **NOR** are each **functionally complete**: any Boolean function can be built from NAND gates alone. For example, x′ = (x·x)′ and x·y = ((x·y)′)′.

## Simplifying with Karnaugh maps

A **Karnaugh map (K-map)** arranges a function's truth table in a grid whose rows and columns are in **Gray code** order (00, 01, 11, 10), so neighbouring cells differ in exactly one variable. To simplify:

1. Write a 1 in each cell where f = 1.
2. Circle **rectangular groups of 1, 2, 4 or 8** adjacent 1s (groups may wrap around the edges), as large as possible.
3. Each group becomes one product term: keep only the variables that **do not change** within the group.
4. OR the terms together.

For the majority function (rows x, columns yz):

| x \ yz | 00 | 01 | 11 | 10 |
|---|---|---|---|---|
| **0** | 0 | 0 | 1 | 0 |
| **1** | 0 | 1 | 1 | 1 |

Three overlapping pairs give yz (column 11), xz (cells 101, 111) and xy (cells 111, 110): **f = xy + yz + xz**.

Verify any simplification by comparing truth tables:

:::widget truth-table
expr: (x & y) | (y & z) | (x & z) <-> (!x & y & z) | (x & !y & z) | (x & y & !z) | (x & y & z)
style: bits
:::

```python run
from itertools import product

def majority_sop(x, y, z):
    return (not x and y and z) or (x and not y and z) or (x and y and not z) or (x and y and z)

def majority_simple(x, y, z):
    return (x and y) or (y and z) or (x and z)

same = all(bool(majority_sop(*v)) == bool(majority_simple(*v)) for v in product([0, 1], repeat=3))
print("simplified circuit matches:", same)

def nand(a, b): return int(not (a and b))
def xor_from_nand(a, b):
    m = nand(a, b)
    return nand(nand(a, m), nand(b, m))      # XOR built from four NAND gates
print("XOR from NANDs:", [xor_from_nand(a, b) for a, b in product([0, 1], repeat=2)])
```

## Half adder

Adding two bits produces a **sum** bit S = x ⊕ y and a **carry** bit C = x · y — one XOR gate and one AND gate. Chaining full adders gives the circuits that add numbers inside every CPU (see [Logic Gates](@foundations/logic-gates) in Foundations).

:::quiz
Q. Simplify x + xy.
* x
- y
- xy
- x + y
= Absorption law.

Q. What is (x + y)′ by De Morgan's law?
- x′ + y′
* x′y′
- xy
- x + y
= The complement of a sum is the product of the complements.

Q. Which single gate type can build every Boolean function?
- AND
- OR
* NAND
- XOR
= NAND (and NOR) are functionally complete.

Q. In a K-map, why are rows and columns ordered 00, 01, 11, 10?
- Alphabetical order
* So neighbouring cells differ in exactly one variable (Gray code)
- To list minterms in numeric order
- It does not matter
= Adjacency in the map must mean a one-variable difference so groups simplify.
:::

=== cheatsheet | Discrete Mathematics Formula Sheet
desc: Every rule, law and formula from Discrete Mathematics on one page — logic, proofs, sets, relations, functions, counting, recurrences, graphs, trees, number theory and Boolean algebra.

## Logic

| Concept | Formula |
|---|---|
| Implication | p → q ≡ ¬p ∨ q ≡ ¬q → ¬p |
| Negated implication | ¬(p → q) ≡ p ∧ ¬q |
| Biconditional | p ↔ q ≡ (p → q) ∧ (q → p) |
| De Morgan | ¬(p ∧ q) ≡ ¬p ∨ ¬q; ¬(p ∨ q) ≡ ¬p ∧ ¬q |
| Quantifier negation | ¬∀x P(x) ≡ ∃x ¬P(x); ¬∃x P(x) ≡ ∀x ¬P(x) |
| Modus ponens / tollens | p, p → q ⊢ q; ¬q, p → q ⊢ ¬p |

## Proof methods

Direct · contrapositive · contradiction · cases · counterexample · induction (base + step) · strong induction.

## Sets and functions

| Concept | Formula |
|---|---|
| Power set | \|P(A)\| = 2ⁿ |
| Cartesian product | \|A × B\| = \|A\|·\|B\| |
| Inclusion–exclusion (2 sets) | \|A ∪ B\| = \|A\| + \|B\| − \|A ∩ B\| |
| Inclusion–exclusion (3 sets) | Σ\|A\| − Σ\|A ∩ B\| + \|A ∩ B ∩ C\| |
| Functions A → B | nᵐ (m = \|A\|, n = \|B\|) |
| Injections (m ≤ n) | n!/(n − m)! |
| Bijections | n! |

## Relations

| Type | Properties |
|---|---|
| Equivalence relation | reflexive, symmetric, transitive → partitions into classes |
| Partial order | reflexive, antisymmetric, transitive → Hasse diagram |
| Lattice | every pair has a lub (join) and glb (meet) |

## Counting

| Situation | Count |
|---|---|
| Ordered, no repetition | P(n, r) = n!/(n − r)! |
| Ordered, with repetition | nʳ |
| Unordered, no repetition | C(n, r) = n!/(r!(n − r)!) |
| Unordered, with repetition | C(n + r − 1, r) |
| Arrangements with identical items | n!/(n₁! n₂! … nₖ!) |
| Circular arrangements | (n − 1)! |
| Derangements | Dₙ = n! Σ (−1)ᵏ/k! ≈ n!/e |
| Pigeonhole | N objects, k boxes → some box has ≥ ⌈N/k⌉ |
| Binomial theorem | (x + y)ⁿ = Σ C(n, k) xⁿ⁻ᵏ yᵏ |
| Pascal's rule | C(n, r) = C(n − 1, r − 1) + C(n − 1, r) |

## Recurrences

| Characteristic roots | Solution of aₙ = c₁aₙ₋₁ + c₂aₙ₋₂ |
|---|---|
| distinct r₁, r₂ | aₙ = αr₁ⁿ + βr₂ⁿ |
| repeated r | aₙ = (α + βn)rⁿ |
| Fibonacci | Fₙ = (φⁿ − ψⁿ)/√5 |

## Graphs and trees

| Fact | Formula |
|---|---|
| Handshake lemma | Σ deg(v) = 2\|E\| |
| Edges of Kₙ | n(n − 1)/2 |
| Euler circuit | connected, all degrees even |
| Euler path | connected, exactly two odd vertices |
| Euler's formula (planar) | V − E + F = 2; E ≤ 3V − 6 |
| Tree | n vertices, n − 1 edges, unique paths |
| Full m-ary tree | n = mi + 1, l = (m − 1)i + 1 |
| Cayley | nⁿ⁻² labelled trees |
| Four colour theorem | planar graphs: χ ≤ 4 |

## Number theory

| Fact | Formula |
|---|---|
| Division algorithm | a = dq + r, 0 ≤ r < d |
| Euclid | gcd(a, b) = gcd(b, a mod b) |
| GCD–LCM | gcd(a, b)·lcm(a, b) = ab |
| Bézout | gcd(a, b) = sa + tb |
| Inverse exists | a⁻¹ mod m ⇔ gcd(a, m) = 1 |
| Fermat | aᵖ⁻¹ ≡ 1 (mod p), p prime, p ∤ a |

## Boolean algebra

| Law | Identity |
|---|---|
| Absorption | x + xy = x; x(x + y) = x |
| De Morgan | (x + y)′ = x′y′; (xy)′ = x′ + y′ |
| Consensus | xy + x′z + yz = xy + x′z |
| Functionally complete | {NAND} or {NOR} alone |

:::quiz Final check: mixed revision
Q. Which is logically equivalent to ¬(p → q)?
- ¬p → ¬q
* p ∧ ¬q
- ¬p ∨ q
- q → p
= An implication is false exactly when p is true and q is false.

Q. How many ways can 4 people be seated at a round table?
- 24
* 6
- 12
- 4
= (n − 1)! = 3! = 6.

Q. Solve aₙ = 4aₙ₋₂ with a₀ = 0, a₁ = 4.
* aₙ = 2ⁿ − (−2)ⁿ
- aₙ = 4ⁿ
- aₙ = 2ⁿ
- aₙ = n·2ⁿ
= Roots ±2: α + β = 0 and 2α − 2β = 4 give α = 1, β = −1.

Q. A connected planar graph has 6 vertices and 9 edges. How many faces?
- 3
* 5
- 15
- 4
= 6 − 9 + F = 2 → F = 5.
:::
