=== counting | Counting Principles & Pigeonhole
unit: Counting
desc: The sum and product rules, counting with complements, tree diagrams, and the pigeonhole principle with its generalised form and classic applications.

Counting answers "how many?" — how many passwords, how many paths, how many comparisons an algorithm makes. Almost every counting problem is built from a few simple rules.

## The sum rule

If a task can be done in **one of** m ways **or** one of n ways, with no overlap, there are **m + n** ways.

A student picks one elective from 5 CS electives or 3 maths electives: 5 + 3 = 8 choices.

## The product rule

If a task is a **sequence** of steps with m ways for the first and n ways for the second, there are **m × n** ways.

| Question | Count |
|---|---|
| Bit strings of length 8 | 2⁸ = 256 |
| 4-digit PINs | 10⁴ = 10,000 |
| Car plates: 2 letters then 4 digits | 26² × 10⁴ = 6,760,000 |
| Functions from a 5-set to a 3-set | 3⁵ = 243 |
| Subsets of an n-set | 2ⁿ |

## Counting with the complement

Often it is easier to count what you **don't** want and subtract:

> How many 8-bit strings contain **at least one 1**? All strings minus the all-zero string: 2⁸ − 1 = **255**.

```python run
from itertools import product

passwords = ["".join(p) for p in product("ab1", repeat=4)]
with_digit = [p for p in passwords if "1" in p]
print(len(passwords), "passwords of length 4 over {a, b, 1}")
print(len(with_digit), "contain the digit, and 3^4 - 2^4 =", 3**4 - 2**4)
```

## The pigeonhole principle

> If **n + 1** (or more) pigeons fly into **n** holes, some hole contains **at least two** pigeons.

It sounds obvious, but it proves surprising things:

- Among any 13 people, two share a birth month.
- In any group of 367 people, two share a birthday.
- A hash table with m slots and m + 1 keys **must** have a collision.
- Among any 6 integers, two have the same remainder mod 5 — so their difference is divisible by 5.

### Generalised pigeonhole principle

> If N objects go into k boxes, some box contains at least **⌈N/k⌉** objects.

- 100 students, 12 months → some month has at least ⌈100/12⌉ = 9 birthdays.
- How many cards must you draw from a standard deck to guarantee 3 of the same suit? Need ⌈N/4⌉ ≥ 3, so N = 2 × 4 + 1 = **9**.

```python run
from math import ceil

def guarantee(per_box, boxes):
    return (per_box - 1) * boxes + 1          # smallest N with ceil(N/boxes) >= per_box

print("cards to guarantee 3 of a suit:", guarantee(3, 4))
print("people to guarantee 2 share a birth month:", guarantee(2, 12))
print("students so that 5 share a grade (grades O, A+, A, B+, P, F):", guarantee(5, 6))
print("minimum in the fullest month for 100 birthdays:", ceil(100 / 12))
```

:::exam Pigeonhole proofs
Name the **pigeons** and the **holes** explicitly, show there are more pigeons than holes (or compute ⌈N/k⌉), and state the conclusion. Most of the marks are for identifying the holes cleverly.
:::

## Tree diagrams

When later choices depend on earlier ones, draw a tree. Example: how many bit strings of length 4 have no two consecutive 1s? Branching only on allowed bits gives **8** leaves: 0000, 0001, 0010, 0100, 0101, 1000, 1001, 1010. (In general the count is a Fibonacci number — see [Recurrence Relations](@discrete/recurrences).)

:::quiz
Q. How many 3-letter codes can be made from 26 letters if repetition is allowed?
- 78
- 2,600
* 17,576
- 15,600
= Product rule: 26 × 26 × 26.

Q. What is the minimum number of students needed to guarantee two with the same birth month?
- 12
* 13
- 24
- 366
= 12 holes (months), so 13 pigeons force a repeat.

Q. 50 letters go into 7 mailboxes. At least how many letters must be in the fullest box?
- 7
* 8
- 6
- 50
= ⌈50/7⌉ = 8.

Q. How many binary strings of length 6 contain at least one 0?
- 6
- 32
* 63
- 64
= 2⁶ − 1: everything except 111111.
:::

=== permutations-combinations | Permutations & Combinations
desc: Ordered arrangements and unordered selections: nPr and nCr, factorials, repetition, arrangements with identical items, circular permutations and stars and bars.

## Factorial

n! = n × (n − 1) × … × 2 × 1, with 0! = 1. n! is the number of ways to **arrange n distinct objects** in a row.

## Permutations: order matters

The number of ways to arrange **r** objects chosen from **n** distinct objects:

> **P(n, r) = n! / (n − r)!**

Example: gold, silver and bronze among 10 runners: P(10, 3) = 10 × 9 × 8 = **720**.

## Combinations: order does not matter

The number of ways to **choose r** objects from n, ignoring order:

> **C(n, r) = n! / (r! (n − r)!)**, also written ⁿCᵣ or (n choose r)

Example: choose a 3-person team from 10: C(10, 3) = 720 / 3! = **120**. Each team was counted 3! = 6 times among the permutations.

Useful identities: C(n, r) = C(n, n − r); C(n, 0) = C(n, n) = 1; and **Pascal's rule** C(n, r) = C(n − 1, r − 1) + C(n − 1, r).

```python run
from math import comb, perm, factorial
from itertools import permutations, combinations

print("P(10, 3) =", perm(10, 3), " C(10, 3) =", comb(10, 3))
print("arrangements of ABC:", ["".join(p) for p in permutations("ABC")])
print("2-subsets of ABCD:  ", ["".join(c) for c in combinations("ABCD", 2)])
print("5-card poker hands: ", comb(52, 5))
print("C(n, r) == C(n, n-r):", comb(12, 5) == comb(12, 7))
```

## Which formula?

| Order matters? | Repetition allowed? | Count |
|---|---|---|
| yes | no | P(n, r) = n!/(n − r)! |
| yes | yes | nʳ |
| no | no | C(n, r) |
| no | yes | C(n + r − 1, r) (stars and bars) |

## Arrangements with identical objects

The number of distinct arrangements of n objects where n₁ are alike, n₂ are alike, …:

> n! / (n₁! n₂! … nₖ!)

"MISSISSIPPI" has 11 letters: M×1, I×4, S×4, P×2 → 11! / (1! 4! 4! 2!) = **34,650**.

```python run
from math import factorial
from collections import Counter

def arrangements(word):
    result = factorial(len(word))
    for count in Counter(word).values():
        result //= factorial(count)
    return result

for w in ["BOOK", "BANANA", "MISSISSIPPI", "KALVIUM"]:
    print(f"{w}: {arrangements(w)}")
```

## Circular permutations

Arranging n people around a round table, where rotations count as the same: **(n − 1)!**. If clockwise and anticlockwise are also the same (a necklace): (n − 1)!/2.

## Stars and bars

The number of ways to put r **identical** items into n **distinct** boxes (or the number of non-negative integer solutions of x₁ + … + xₙ = r) is

> **C(n + r − 1, r)**

Example: distribute 10 identical chocolates among 4 children: C(13, 10) = **286**. If each child must get at least one, give one each first, then distribute 6: C(9, 6) = 84.

```python run
from math import comb
from itertools import product

r, n = 10, 4
brute = sum(1 for xs in product(range(r + 1), repeat=n) if sum(xs) == r)
print("brute force:", brute, " formula C(n+r-1, r):", comb(n + r - 1, r))
```

:::mistake Permutation or combination?
Ask: "if I swap two chosen items, do I get a **different** outcome?" A committee of {Asha, Ravi} is the same as {Ravi, Asha} → combination. President Asha + Secretary Ravi differs from President Ravi + Secretary Asha → permutation.
:::

:::quiz
Q. In how many ways can 5 books be arranged on a shelf?
- 25
* 120
- 5
- 3,125
= 5! = 120.

Q. How many ways are there to choose 2 captains from 11 players (no roles)?
- 110
* 55
- 22
- 121
= C(11, 2) = 55.

Q. How many distinct arrangements does "LEVEL" have?
- 120
* 30
- 60
- 20
= 5! / (2! 2! 1!) = 120 / 4 = 30 (two Ls and two Es).

Q. How many non-negative integer solutions does x + y + z = 5 have?
- 15
* 21
- 10
- 125
= Stars and bars: C(5 + 3 − 1, 5) = C(7, 5) = 21.
:::

=== inclusion-exclusion | Inclusion–Exclusion & the Binomial Theorem
desc: Count unions without double counting using inclusion–exclusion, apply it to divisibility and derangements, and expand (x + y)ⁿ with the binomial theorem and Pascal's triangle.

## Inclusion–exclusion

When sets overlap, adding their sizes counts the overlaps more than once. Correct for it:

> |A ∪ B| = |A| + |B| − |A ∩ B|
>
> |A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |A ∩ C| − |B ∩ C| + |A ∩ B ∩ C|

In general: add the single sets, subtract all pairwise intersections, add all triple intersections, and so on with alternating signs.

:::diagram venn
shade: union
caption: |A ∪ B|: adding |A| and |B| counts the middle region twice, so subtract |A ∩ B| once.
:::

### Example: divisibility

How many integers from 1 to 1000 are divisible by 2, 3 or 5?

| Term | Count |
|---|---|
| \|A₂\| + \|A₃\| + \|A₅\| | 500 + 333 + 200 = 1033 |
| − \|A₆\| − \|A₁₀\| − \|A₁₅\| | − 166 − 100 − 66 = −332 |
| + \|A₃₀\| | + 33 |
| **Total** | **734** |

```python run
N = 1000
direct = sum(1 for n in range(1, N + 1) if n % 2 == 0 or n % 3 == 0 or n % 5 == 0)
formula = (N//2 + N//3 + N//5) - (N//6 + N//10 + N//15) + N//30
print("count directly:", direct, " inclusion-exclusion:", formula)
print("not divisible by 2, 3 or 5:", N - formula)
```

### Derangements

A **derangement** is a permutation where **no** element stays in its original position — n letters put into n envelopes so that **every** letter is in the wrong one. By inclusion–exclusion:

> Dₙ = n! (1 − 1/1! + 1/2! − 1/3! + … + (−1)ⁿ/n!)

```python run
from math import factorial
from itertools import permutations

def derangements(n):
    return round(factorial(n) * sum((-1) ** k / factorial(k) for k in range(n + 1)))

for n in range(1, 8):
    brute = sum(1 for p in permutations(range(n)) if all(p[i] != i for i in range(n)))
    print(f"D{n} = {derangements(n)} (brute force {brute}), fraction {derangements(n) / factorial(n):.4f}")
```

The fraction of permutations that are derangements approaches **1/e ≈ 0.3679**.

## The binomial theorem

> (x + y)ⁿ = Σₖ₌₀ⁿ C(n, k) xⁿ⁻ᵏ yᵏ

The coefficients C(n, k) are the **binomial coefficients** — the rows of **Pascal's triangle**, where each entry is the sum of the two above it.

```python run
from math import comb

for n in range(7):
    print(" " * (2 * (6 - n)) + "".join(f"{comb(n, k):4}" for k in range(n + 1)))

n = 4
terms = [f"{comb(n, k)}x^{n-k}y^{k}" for k in range(n + 1)]
print("(x + y)^4 =", " + ".join(terms))
```

Consequences:

- Setting x = y = 1: Σ C(n, k) = **2ⁿ** (the number of subsets).
- Setting x = 1, y = −1: Σ (−1)ᵏ C(n, k) = 0.
- The coefficient of x³y⁵ in (x + y)⁸ is C(8, 5) = 56.
- The coefficient of x⁴ in (2x − 3)⁶ is C(6, 2) · 2⁴ · (−3)² = 15 · 16 · 9 = 2160.

:::quiz
Q. In a class of 60, 35 study C, 30 study Python, and 12 study both. How many study at least one?
* 53
- 65
- 77
- 41
= 35 + 30 − 12 = 53.

Q. How many derangements of 4 objects are there?
- 6
* 9
- 24
- 11
= D₄ = 24(1 − 1 + 1/2 − 1/6 + 1/24) = 9.

Q. What is the coefficient of x²y³ in (x + y)⁵?
- 5
* 10
- 20
- 15
= C(5, 3) = 10.

Q. What is C(n, 0) + C(n, 1) + … + C(n, n)?
- n!
- n²
* 2ⁿ
- 0
= Put x = y = 1 in the binomial theorem.
:::

=== recurrences | Recurrence Relations
desc: Define sequences recursively, model counting problems with recurrences, and solve linear homogeneous recurrences with constant coefficients using the characteristic equation.

A **recurrence relation** defines each term of a sequence using earlier terms, together with **initial conditions**.

- aₙ = aₙ₋₁ + 3, a₀ = 2 → 2, 5, 8, 11, … (arithmetic)
- aₙ = 2aₙ₋₁, a₀ = 1 → 1, 2, 4, 8, … (geometric)
- Fₙ = Fₙ₋₁ + Fₙ₋₂, F₀ = 0, F₁ = 1 → Fibonacci

## Modelling with recurrences

| Problem | Recurrence |
|---|---|
| Tower of Hanoi moves | Hₙ = 2Hₙ₋₁ + 1, H₁ = 1 |
| Bit strings of length n with no "11" | aₙ = aₙ₋₁ + aₙ₋₂ (end in 0, or end in 01) |
| Compound interest at 8% | Pₙ = 1.08 Pₙ₋₁ |
| Binary search comparisons | T(n) = T(n/2) + 1 |

## Linear homogeneous recurrences with constant coefficients

Form: aₙ = c₁aₙ₋₁ + c₂aₙ₋₂ + … + cₖaₙ₋ₖ.

**Method for degree 2** (aₙ = c₁aₙ₋₁ + c₂aₙ₋₂):

1. Write the **characteristic equation**: r² − c₁r − c₂ = 0.
2. Find its roots.
   - **Distinct roots** r₁, r₂: aₙ = α·r₁ⁿ + β·r₂ⁿ.
   - **Repeated root** r: aₙ = (α + βn)·rⁿ.
3. Use the initial conditions to find α and β.

### Example 1: distinct roots

aₙ = aₙ₋₁ + 2aₙ₋₂, a₀ = 2, a₁ = 7.

Characteristic equation r² − r − 2 = 0 → (r − 2)(r + 1) = 0 → r = 2, −1. So aₙ = α·2ⁿ + β(−1)ⁿ.

a₀: α + β = 2. a₁: 2α − β = 7. Adding: 3α = 9 → α = 3, β = −1.

**aₙ = 3·2ⁿ − (−1)ⁿ**.

### Example 2: repeated root

aₙ = 6aₙ₋₁ − 9aₙ₋₂, a₀ = 1, a₁ = 6.

r² − 6r + 9 = 0 → (r − 3)² = 0 → r = 3 (double). So aₙ = (α + βn)3ⁿ.

a₀ = α = 1. a₁ = (1 + β)·3 = 6 → β = 1. **aₙ = (1 + n)·3ⁿ**.

### Example 3: Fibonacci (Binet's formula)

r² − r − 1 = 0 → r = (1 ± √5)/2. With F₀ = 0, F₁ = 1:

> Fₙ = (φⁿ − ψⁿ)/√5, where φ = (1 + √5)/2 ≈ 1.618 and ψ = (1 − √5)/2

So Fibonacci numbers grow like φⁿ — which is why naive recursive Fibonacci is exponential.

```python run
from math import sqrt

def by_recurrence(n, a0, a1, c1, c2):
    a, b = a0, a1
    for _ in range(n):
        a, b = b, c1 * b + c2 * a
    return a

phi, psi = (1 + sqrt(5)) / 2, (1 - sqrt(5)) / 2
print("n   rec1  3*2^n-(-1)^n   rec2  (1+n)3^n   fib  Binet")
for n in range(8):
    r1 = by_recurrence(n, 2, 7, 1, 2)
    r2 = by_recurrence(n, 1, 6, 6, -9)
    f = by_recurrence(n, 0, 1, 1, 1)
    print(f"{n:<3} {r1:<5} {3 * 2**n - (-1)**n:<13} {r2:<5} {(1 + n) * 3**n:<9} {f:<4} {round((phi**n - psi**n) / sqrt(5))}")
```

## Non-homogeneous recurrences

For aₙ = c₁aₙ₋₁ + c₂aₙ₋₂ + F(n), the solution is (homogeneous solution) + (one particular solution). For Tower of Hanoi, Hₙ = 2Hₙ₋₁ + 1 has homogeneous part α·2ⁿ and particular solution −1; with H₁ = 1, **Hₙ = 2ⁿ − 1**.

## Divide-and-conquer recurrences

Recurrences like T(n) = aT(n/b) + f(n) come from recursive algorithms. They are solved with the **Master Theorem** — see [Solving Recurrences](@daa/recurrences) in Algorithms.

:::quiz
Q. What is the characteristic equation of aₙ = 5aₙ₋₁ − 6aₙ₋₂?
* r² − 5r + 6 = 0
- r² + 5r − 6 = 0
- r² − 6r + 5 = 0
- 5r − 6 = 0
= Move every term to one side: r² − 5r + 6 = 0, with roots 2 and 3.

Q. If the characteristic equation has a repeated root r, the general solution is...
- α·rⁿ
* (α + βn)·rⁿ
- α·rⁿ + β·rⁿ
- α + βr
= The extra factor of n gives a second independent solution.

Q. How many bit strings of length 5 have no two consecutive 1s?
- 8
- 11
* 13
- 16
= aₙ = aₙ₋₁ + aₙ₋₂ with a₁ = 2, a₂ = 3: a₃ = 5, a₄ = 8, a₅ = 13.

Q. What is the closed form of Hₙ = 2Hₙ₋₁ + 1, H₁ = 1?
- 2ⁿ
* 2ⁿ − 1
- n²
- 2n − 1
= Homogeneous solution α2ⁿ plus particular solution −1, with H₁ = 1 giving α = 1.
:::
