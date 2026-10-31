=== intro | What Is an Algorithm?
unit: Analysis of Algorithms
desc: The definition and five properties of an algorithm, how to write pseudocode, proving correctness with loop invariants, and the RAM model used to analyse running time.

An **algorithm** is a finite sequence of well-defined steps that takes some **input** and produces the correct **output** for every valid input. A program is an algorithm written in a particular language for a particular machine; the algorithm itself is the idea.

## The five properties (Knuth)

| Property | Meaning |
|---|---|
| **Input** | zero or more quantities supplied from outside |
| **Output** | at least one quantity produced |
| **Definiteness** | every step is precise and unambiguous |
| **Finiteness** | it always terminates after a finite number of steps |
| **Effectiveness** | every step is basic enough to be carried out exactly, in finite time |

"Keep stirring until it tastes good" fails definiteness. A loop that may never end fails finiteness.

## The design and analysis process

1. **Understand the problem** — inputs, outputs, constraints, edge cases.
2. **Choose a design technique** — brute force, divide and conquer, greedy, dynamic programming, backtracking …
3. **Write the algorithm** — usually in pseudocode.
4. **Prove it correct** for all inputs.
5. **Analyse** its time and space as a function of the input size `n`.
6. **Implement and test**.

## Pseudocode

Pseudocode describes an algorithm without the noise of a real language:

```pseudo
INSERTION-SORT(A, n)
    for j = 2 to n
        key = A[j]
        i = j - 1
        while i > 0 and A[i] > key
            A[i + 1] = A[i]
            i = i - 1
        A[i + 1] = key
```

(Textbooks like CLRS index arrays from 1. Translate carefully to 0-based code.)

## Proving correctness: loop invariants

A **loop invariant** is a statement that is true before every iteration of a loop. To prove an algorithm correct with one, show three things:

1. **Initialisation** — it is true before the first iteration.
2. **Maintenance** — if it is true before an iteration, it remains true before the next.
3. **Termination** — when the loop ends, the invariant gives a useful property that shows the algorithm is correct.

For insertion sort, the invariant is: *at the start of each iteration, the subarray `A[1..j−1]` holds the original first `j−1` elements in sorted order.* When the loop ends with `j = n + 1`, the whole array is sorted.

```cpp run
#include <iostream>
#include <vector>
#include <cassert>
#include <algorithm>
using namespace std;

void insertionSort(vector<int> &a) {
    for (size_t j = 1; j < a.size(); j++) {
        assert(is_sorted(a.begin(), a.begin() + j));     // the loop invariant, checked at run time
        int key = a[j];
        int i = (int)j - 1;
        while (i >= 0 && a[i] > key) { a[i + 1] = a[i]; i--; }
        a[i + 1] = key;
    }
}

int main() {
    vector<int> a = {31, 41, 59, 26, 41, 58};
    insertionSort(a);
    for (int x : a) cout << x << " ";
    cout << "\nsorted: " << boolalpha << is_sorted(a.begin(), a.end()) << endl;
    return 0;
}
```

## The RAM model

To analyse algorithms independently of hardware, we use the **Random Access Machine** model:

- Each simple operation (arithmetic, comparison, assignment, array access, function call) takes **one unit** of time.
- Memory access is constant time.
- Instructions run one after another (no parallelism).

The running time `T(n)` is the number of unit steps for an input of size `n`. For example, insertion sort does about n²/4 comparisons on average, so T(n) grows like n².

## Why analyse at all?

Suppose computer A runs 10⁹ instructions/second and computer B only 10⁷ — 100 times slower. Sort 10 million numbers:

| | Algorithm | Steps | Time |
|---|---|---|---|
| Computer A | insertion sort, 2n² | 2 × 10¹⁴ | about **55 hours** |
| Computer B | merge sort, 50 n log₂ n | about 1.2 × 10¹⁰ | about **20 minutes** |

A better algorithm on a slow machine beats a worse algorithm on a fast machine by orders of magnitude. That is why this subject exists.

:::exam Frequently asked
"Define an algorithm and explain its characteristics" (the five properties) and "What is a loop invariant? Prove the correctness of insertion sort" are standard 5- and 10-mark questions.
:::

:::quiz
Q. Which property says every algorithm must stop?
- Definiteness
* Finiteness
- Effectiveness
- Output
= Finiteness: it terminates after a finite number of steps for every valid input.

Q. Which three parts make up a loop-invariant proof?
- Input, process, output
* Initialisation, maintenance, termination
- Base case, inductive case, conclusion
- Best, average, worst case
= Show it holds initially, is preserved by each iteration, and gives correctness at the end.

Q. In the RAM model, how long does one array access take?
* One unit of time
- log n units
- n units
- It depends on the array size
= The model treats basic operations, including memory access, as constant time.

Q. "Repeat until the answer looks right" violates which property?
- Input
- Finiteness
* Definiteness
- Output
= The step is not precise; "looks right" is ambiguous.
:::

=== asymptotic | Asymptotic Notations
desc: The formal definitions of O, Ω and Θ (plus little-o and little-ω), proving bounds by finding c and n₀, the order of growth, and the properties exams test.

**Asymptotic analysis** describes how running time grows as `n` becomes large, ignoring constant factors and small inputs. It lets us say "merge sort is faster than insertion sort" in a precise, machine-independent way.

## Big-O: upper bound

> f(n) = **O(g(n))** if there exist positive constants **c** and **n₀** such that 0 ≤ f(n) ≤ c·g(n) for all n ≥ n₀.

f grows **no faster** than g. Example: 3n² + 10n + 5 = O(n²). Choose c = 4: we need 3n² + 10n + 5 ≤ 4n², i.e. n² − 10n − 5 ≥ 0, which holds for all n ≥ 11. So c = 4, n₀ = 11 works.

## Big-Omega: lower bound

> f(n) = **Ω(g(n))** if there exist positive constants c and n₀ such that 0 ≤ c·g(n) ≤ f(n) for all n ≥ n₀.

f grows **at least as fast** as g. Example: 3n² + 10n + 5 = Ω(n²) with c = 3, n₀ = 1.

## Big-Theta: tight bound

> f(n) = **Θ(g(n))** if there exist positive constants c₁, c₂ and n₀ such that c₁·g(n) ≤ f(n) ≤ c₂·g(n) for all n ≥ n₀.

f grows **exactly as fast** as g. f = Θ(g) if and only if f = O(g) **and** f = Ω(g). So 3n² + 10n + 5 = Θ(n²).

## Little-o and little-omega

| Notation | Meaning | Analogy | Example |
|---|---|---|---|
| f = O(g) | f grows no faster than g | ≤ | n = O(n), n = O(n²) |
| f = Ω(g) | f grows no slower than g | ≥ | n² = Ω(n) |
| f = Θ(g) | same growth rate | = | 2n + 3 = Θ(n) |
| f = o(g) | f grows **strictly** slower: f/g → 0 | < | n = o(n²), but n ≠ o(n) |
| f = ω(g) | f grows **strictly** faster: f/g → ∞ | > | n² = ω(n) |

## Order of growth

From slowest to fastest growing:

> 1 < log log n < log n < √n < n < n log n < n² < n³ < 2ⁿ < 3ⁿ < n! < nⁿ

:::widget big-o
:::

A quick way to compare two functions: compute **lim f(n)/g(n)** as n → ∞. If it is 0, f = o(g); if it is a positive constant, f = Θ(g); if it is ∞, f = ω(g).

## Properties

1. **Transitivity**: if f = O(g) and g = O(h), then f = O(h) (same for Ω, Θ).
2. **Reflexivity**: f = O(f), f = Ω(f), f = Θ(f).
3. **Symmetry**: f = Θ(g) if and only if g = Θ(f).
4. **Transpose symmetry**: f = O(g) if and only if g = Ω(f).
5. **Sum rule**: O(f) + O(g) = O(max(f, g)).
6. **Product rule**: O(f) · O(g) = O(f · g).
7. **Constants vanish**: O(c·f) = O(f) for any constant c > 0.
8. **Logs**: log_a n = Θ(log_b n) for any bases a, b > 1, so the base is usually omitted.

## Checking bounds numerically

You can watch a ratio settle to a constant (Θ) or shrink to zero (little-o):

```cpp run
#include <cstdio>
#include <cmath>

int main() {
    printf("%10s %16s %16s %16s\n", "n", "f(n)/n^2", "n log n / n^2", "n^2 / 2^n");
    for (double n = 10; n <= 1e6; n *= 10) {
        double f = 3 * n * n + 10 * n + 5;
        printf("%10.0f %16.6f %16.6f %16.3g\n", n, f / (n * n), n * log2(n) / (n * n), n * n / pow(2, n));
    }
    return 0;
}
```

The first column approaches 3 (so f = Θ(n²)); the second tends to 0 (n log n = o(n²)); the third collapses to 0 incredibly fast (n² = o(2ⁿ)).

:::mistake O is not "the worst case"
Big-O is an upper bound on a **function**; worst case is a property of **inputs**. You can give an O, Ω and Θ bound for the best case, the average case or the worst case. For example, insertion sort's best case is Θ(n) and its worst case is Θ(n²).
:::

:::quiz
Q. Which is true for f(n) = 5n³ + 2n?
- f = O(n²)
* f = Θ(n³)
- f = Ω(n⁴)
- f = o(n³)
= The n³ term dominates, so f is bounded above and below by constant multiples of n³.

Q. Which statement is **false**?
- n = O(n²)
- n² = Ω(n)
* n² = O(n log n)
- log n = o(n)
= n² grows faster than n log n, so it is not bounded by it.

Q. Which grows fastest?
- n¹⁰
- 2ⁿ
* n!
- n log n
= Factorial outgrows every exponential with a fixed base.

Q. If lim f(n)/g(n) = 7 as n → ∞, then...
* f = Θ(g)
- f = o(g)
- f = ω(g)
- Nothing can be said
= A finite positive limit means both grow at the same rate.
:::

=== analyzing-code | Analysing Loops & Recursive Code
desc: Turn code into running times: independent and dependent nested loops, logarithmic loops, writing recurrences for recursive functions, and an introduction to amortised analysis.

## Independent loops

Count the iterations of each loop and multiply when they are nested:

```cpp
for (int i = 0; i < n; i++)          // n times
    for (int j = 0; j < m; j++)      // m times each
        work();                      // total n·m → O(nm)
```

## Dependent loops: sum the iterations

When the inner loop depends on the outer one, add up its iteration counts:

```cpp
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= i; j++)     // runs i times
        work();
```

Total = 1 + 2 + … + n = n(n + 1)/2 = **Θ(n²)**.

```cpp
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= n; j += i)  // runs about n/i times
        work();
```

Total = n/1 + n/2 + … + n/n = n·(1 + 1/2 + … + 1/n) ≈ n ln n = **Θ(n log n)** (the harmonic series).

## Logarithmic loops

A loop variable that is **multiplied or divided** by a constant each step runs Θ(log n) times:

```cpp
for (int i = 1; i < n; i *= 2) work();       // log2 n iterations
for (int i = n; i > 0; i /= 3) work();       // log3 n iterations
for (int i = 2; i < n; i = i * i) work();    // log log n iterations
```

## Measure it yourself

```cpp run
#include <cstdio>

int main() {
    for (long n = 1000; n <= 1000000; n *= 10) {
        long a = 0, b = 0, c = 0, d = 0;
        for (long i = 1; i < n; i *= 2) a++;                         // log n
        for (long i = 1; i <= n; i++) for (long j = 1; j <= n; j += i) b++;   // n log n (harmonic)
        for (long i = 2; i < n; i = i * i) c++;                      // log log n
        for (long i = 1; i * i <= n; i++) d++;                       // sqrt n
        printf("n=%8ld  log:%3ld  harmonic:%9ld  loglog:%2ld  sqrt:%5ld\n", n, a, b, c, d);
    }
    return 0;
}
```

## Common patterns

| Code shape | Running time |
|---|---|
| single loop to n | Θ(n) |
| two nested loops to n | Θ(n²) |
| `i` doubles each step | Θ(log n) |
| loop to n with an inner doubling loop | Θ(n log n) |
| inner loop runs `i` times | Θ(n²) |
| inner loop runs `n/i` times | Θ(n log n) |
| loop while `i*i <= n` | Θ(√n) |

## Recursive code: write a recurrence

For a recursive function, write **T(n)** in terms of T on smaller inputs plus the work done outside the recursive calls:

| Function | Recurrence | Solution |
|---|---|---|
| factorial(n) = n · factorial(n−1) | T(n) = T(n−1) + O(1) | Θ(n) |
| binary search | T(n) = T(n/2) + O(1) | Θ(log n) |
| merge sort | T(n) = 2T(n/2) + O(n) | Θ(n log n) |
| naive Fibonacci | T(n) = T(n−1) + T(n−2) + O(1) | Θ(φⁿ) ≈ Θ(1.618ⁿ) |
| Tower of Hanoi | T(n) = 2T(n−1) + O(1) | Θ(2ⁿ) |
| selection sort, recursive | T(n) = T(n−1) + O(n) | Θ(n²) |

The next lesson shows how to **solve** recurrences like these.

## Best, worst and average case

For linear search on n items:

- **Best case**: key at position 1 → 1 comparison → Θ(1).
- **Worst case**: key absent → n comparisons → Θ(n).
- **Average case**: if the key is equally likely to be at any position, expected comparisons = (1 + 2 + … + n)/n = (n + 1)/2 → Θ(n).

## Amortised analysis

Some operations are usually cheap but occasionally expensive. **Amortised analysis** averages the cost over a sequence of operations (no probability involved).

Example: `vector::push_back` doubles the capacity when full, copying all elements. A single push can cost O(n), but over n pushes the total copying is 1 + 2 + 4 + … + n < 2n, so each push costs **O(1) amortised**.

```cpp run
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;
    long copies = 0;
    for (int i = 0; i < 1000; i++) {
        if (v.size() == v.capacity()) copies += v.size();     // a reallocation copies everything
        v.push_back(i);
    }
    cout << "1000 pushes, total elements copied: " << copies << " (less than 2 x 1000)" << endl;
    cout << "final capacity: " << v.capacity() << endl;
    return 0;
}
```

The three classic methods are the **aggregate**, **accounting** and **potential** methods.

:::quiz
Q. What is the running time of this code?
```cpp
for (int i = 1; i <= n; i *= 3)
    for (int j = 0; j < n; j++)
        x++;
```
- Θ(n²)
* Θ(n log n)
- Θ(n)
- Θ(log n)
= The outer loop runs log₃ n times and the inner loop n times each.

Q. What is the recurrence of binary search?
* T(n) = T(n/2) + O(1)
- T(n) = 2T(n/2) + O(n)
- T(n) = T(n − 1) + O(1)
- T(n) = 2T(n − 1) + O(1)
= One recursive call on half the input, plus constant work.

Q. How many times does `for (i = 1; i * i <= n; i++)` iterate?
- n
- log n
* about √n
- n²
= It stops when i exceeds √n.

Q. What is the amortised cost of `push_back` on a doubling dynamic array?
- O(n)
- O(log n)
* O(1)
- O(n²)
= The rare O(n) copies add up to less than 2n over n pushes.
:::

=== recurrences | Solving Recurrences & the Master Theorem
desc: Solve recurrences with the substitution method, recursion trees and the Master Theorem — with its three cases, worked examples, and the cases it cannot handle.

## 1. The substitution method

**Guess** the form of the solution, then **prove it by induction**.

Example: T(n) = 2T(⌊n/2⌋) + n. Guess T(n) ≤ c·n log n.

Assume it holds for n/2: T(n/2) ≤ c(n/2)log(n/2). Then

T(n) ≤ 2·c(n/2)log(n/2) + n = c·n log n − c·n·log 2 + n = c·n log n − c·n + n ≤ c·n log n whenever c ≥ 1.

So T(n) = O(n log n).

## 2. The recursion-tree method

Draw the tree of recursive calls, add the cost at each **level**, then sum the levels.

T(n) = 2T(n/2) + n:

:::diagram tree
tree: n(n/2(n/4,n/4),n/2(n/4,n/4))
caption: Each level sums to n (n; n/2 + n/2; four times n/4 …). There are log₂ n levels, so T(n) = n log₂ n.
:::

| Level | Nodes | Cost per node | Level total |
|---|---|---|---|
| 0 | 1 | n | n |
| 1 | 2 | n/2 | n |
| 2 | 4 | n/4 | n |
| … | … | … | … |
| log₂ n | n | 1 | n |

Total = n × (log₂ n + 1) = **Θ(n log n)**.

## 3. The Master Theorem

For recurrences of the form

> **T(n) = a·T(n/b) + f(n)**, with a ≥ 1, b > 1

compare f(n) with **n^(log_b a)** (the total cost of the leaves):

| Case | Condition | Result |
|---|---|---|
| **1** | f(n) = O(n^(log_b a − ε)) for some ε > 0 — leaves dominate | T(n) = Θ(n^(log_b a)) |
| **2** | f(n) = Θ(n^(log_b a)) — every level costs the same | T(n) = Θ(n^(log_b a) · log n) |
| **3** | f(n) = Ω(n^(log_b a + ε)) and a·f(n/b) ≤ c·f(n) for some c < 1 — root dominates | T(n) = Θ(f(n)) |

### Worked examples

| Recurrence | a, b, n^(log_b a) | f(n) | Case | Answer |
|---|---|---|---|---|
| T(n) = 2T(n/2) + n (merge sort) | 2, 2, n | n | 2 | Θ(n log n) |
| T(n) = T(n/2) + 1 (binary search) | 1, 2, 1 | 1 | 2 | Θ(log n) |
| T(n) = 8T(n/2) + n² | 8, 2, n³ | n² | 1 | Θ(n³) |
| T(n) = 7T(n/2) + n² (Strassen) | 7, 2, n^2.81 | n² | 1 | Θ(n^2.81) |
| T(n) = 2T(n/2) + n² | 2, 2, n | n² | 3 | Θ(n²) |
| T(n) = 3T(n/4) + n log n | 3, 4, n^0.79 | n log n | 3 | Θ(n log n) |
| T(n) = 4T(n/2) + n² | 4, 2, n² | n² | 2 | Θ(n² log n) |

### Extended case 2

If f(n) = Θ(n^(log_b a) · logᵏ n) with k ≥ 0, then T(n) = Θ(n^(log_b a) · logᵏ⁺¹ n). For example, T(n) = 2T(n/2) + n log n = Θ(n log² n).

## When the Master Theorem does not apply

- Subproblems of **different sizes**: T(n) = T(n/3) + T(2n/3) + n (use a recursion tree: Θ(n log n)).
- **Subtract-and-conquer** forms: T(n) = T(n − 1) + n (unroll: Θ(n²)); T(n) = 2T(n − 1) + 1 (Θ(2ⁿ)).
- f(n) falls in a **gap** between cases, e.g. T(n) = 2T(n/2) + n/log n.
- a < 1 or b ≤ 1.

## Unrolling (iteration method)

For T(n) = T(n − 1) + n with T(1) = 1:

T(n) = n + T(n−1) = n + (n−1) + T(n−2) = … = n + (n−1) + … + 2 + 1 = n(n+1)/2 = **Θ(n²)**.

## Check a solution by computing it

```cpp run
#include <cstdio>
#include <cmath>
#include <map>

std::map<long, double> memo;
double T(long n) {                       // T(n) = 2T(n/2) + n, T(1) = 1
    if (n <= 1) return 1;
    if (memo.count(n)) return memo[n];
    return memo[n] = 2 * T(n / 2) + n;
}

int main() {
    printf("%10s %14s %14s\n", "n", "T(n)", "T(n)/(n log n)");
    for (long n = 16; n <= (1L << 24); n *= 16)
        printf("%10ld %14.0f %14.4f\n", n, T(n), T(n) / (n * log2((double)n)));
    return 0;
}
```

The ratio T(n)/(n log n) settles towards 1, confirming Θ(n log n).

:::exam Show your working
State a, b and f(n); compute n^(log_b a); say which case applies and **why** (compare the polynomial exponents); then write the answer. For case 3, also check the regularity condition a·f(n/b) ≤ c·f(n).
:::

:::quiz
Q. Solve T(n) = 4T(n/2) + n.
* Θ(n²)
- Θ(n log n)
- Θ(n)
- Θ(n² log n)
= n^(log₂ 4) = n² dominates f(n) = n: case 1.

Q. Solve T(n) = 2T(n/4) + √n.
- Θ(√n)
* Θ(√n log n)
- Θ(n)
- Θ(log n)
= n^(log₄ 2) = n^0.5 = √n equals f(n): case 2.

Q. Solve T(n) = 3T(n/3) + n².
- Θ(n log n)
- Θ(n² log n)
* Θ(n²)
- Θ(n³)
= n^(log₃ 3) = n is smaller than f(n) = n², and regularity holds: case 3.

Q. Which recurrence can the Master Theorem **not** solve directly?
- T(n) = 2T(n/2) + n
- T(n) = 9T(n/3) + n
* T(n) = T(n − 1) + n
- T(n) = T(n/2) + 1
= It requires the form aT(n/b) + f(n); subtract-and-conquer needs unrolling.
:::
