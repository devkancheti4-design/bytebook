=== propositional-logic | Propositional Logic
unit: Logic & Proofs
desc: Propositions and the logical connectives — negation, AND, OR, XOR, implication and biconditional — with truth tables, converse and contrapositive, and translating English.

**Logic** is the language of precise reasoning. It underlies every `if` statement you write, digital circuits, database queries and mathematical proof.

## Propositions

A **proposition** is a declarative statement that is either **true (T)** or **false (F)**, but not both.

| Statement | Proposition? |
|---|---|
| "7 is a prime number." | yes — true |
| "Delhi is the capital of Kerala." | yes — false |
| "x + 2 = 5" | no — its truth depends on x |
| "Close the door." | no — a command |
| "Is it raining?" | no — a question |

We name propositions with letters p, q, r …

## Connectives

| Name | Symbol | Read as | True when |
|---|---|---|---|
| Negation | ¬p | not p | p is false |
| Conjunction | p ∧ q | p and q | both are true |
| Disjunction | p ∨ q | p or q | at least one is true |
| Exclusive or | p ⊕ q | p xor q | exactly one is true |
| Implication | p → q | if p then q | **except** when p is true and q is false |
| Biconditional | p ↔ q | p if and only if q | p and q have the same value |

| p | q | ¬p | p ∧ q | p ∨ q | p ⊕ q | p → q | p ↔ q |
|---|---|---|---|---|---|---|---|
| T | T | F | T | T | F | T | T |
| T | F | F | F | T | T | **F** | F |
| F | T | T | F | T | T | T | F |
| F | F | T | F | F | F | T | T |

## Implication: the tricky one

"If you score above 90, you get an O grade." The promise is broken **only** when you score above 90 and do **not** get an O. If you score below 90, the promise says nothing — so the implication is **true** (vacuously).

Ways to say p → q in English: "if p, then q", "p implies q", "q if p", "p only if q", "p is sufficient for q", "q is necessary for p", "q whenever p".

From p → q we form three related statements:

| Name | Form | Equivalent to p → q? |
|---|---|---|
| Converse | q → p | no |
| Inverse | ¬p → ¬q | no |
| **Contrapositive** | ¬q → ¬p | **yes** |

"If it rains, the ground is wet." Contrapositive: "If the ground is not wet, it did not rain" — same meaning. Converse: "If the ground is wet, it rained" — not the same (a sprinkler could have wet it).

## Build any truth table

Type a formula and press Enter. Use `!` or `~` for NOT, `&` for AND, `|` for OR, `^` for XOR, `->` for implies and `<->` for if and only if.

:::widget truth-table
expr: (p -> q) & (q -> r) -> (p -> r)
:::

## Truth tables in code

With n variables a truth table has 2ⁿ rows. Python can generate it:

```python run
from itertools import product

def implies(a, b):
    return (not a) or b

print(f"{'p':5} {'q':5} {'r':5} | (p→q)∧(q→r) → (p→r)")
for p, q, r in product([True, False], repeat=3):
    value = implies(implies(p, q) and implies(q, r), implies(p, r))
    print(f"{p!s:5} {q!s:5} {r!s:5} | {value}")
```

Every row is True: this formula (the **hypothetical syllogism**) is a **tautology**.

## Tautology, contradiction, contingency

| Kind | Meaning | Example |
|---|---|---|
| **Tautology** | true in every row | p ∨ ¬p |
| **Contradiction** | false in every row | p ∧ ¬p |
| **Contingency** | true in some rows, false in others | p → q |

## Precedence

¬ binds tightest, then ∧, then ∨, then →, then ↔. So ¬p ∨ q ∧ r means (¬p) ∨ (q ∧ r). Use brackets when in doubt.

## Translating English

Let p = "it is raining", q = "I carry an umbrella", r = "I get wet".

| English | Logic |
|---|---|
| It is raining and I don't carry an umbrella. | p ∧ ¬q |
| If it rains and I have no umbrella, I get wet. | (p ∧ ¬q) → r |
| I get wet only if it is raining. | r → p |
| I carry an umbrella if and only if it is raining. | q ↔ p |

:::quiz
Q. When is p → q **false**?
- p false, q true
* p true, q false
- both false
- both true
= An implication fails only when the hypothesis holds and the conclusion does not.

Q. What is the contrapositive of "If n is even, then n² is even"?
- If n² is even, then n is even
- If n is odd, then n² is odd
* If n² is odd, then n is odd
- n is even and n² is odd
= Contrapositive of p → q is ¬q → ¬p, which is logically equivalent.

Q. How many rows does a truth table with 4 variables have?
- 8
* 16
- 4
- 32
= 2⁴ = 16 combinations of truth values.

Q. Which is a tautology?
* p ∨ ¬p
- p ∧ ¬p
- p → ¬p
- p ⊕ p
= Either p or its negation is always true.
:::

=== logical-equivalence | Logical Equivalences & Normal Forms
desc: When two formulas mean the same thing: the laws of logic including De Morgan's, simplifying expressions step by step, and converting to disjunctive and conjunctive normal form.

Two formulas are **logically equivalent**, written **P ≡ Q**, if they have the same truth value in **every** row of the truth table — equivalently, if P ↔ Q is a tautology.

## The laws

| Law | Equivalence |
|---|---|
| Identity | p ∧ T ≡ p, p ∨ F ≡ p |
| Domination | p ∨ T ≡ T, p ∧ F ≡ F |
| Idempotent | p ∨ p ≡ p, p ∧ p ≡ p |
| Double negation | ¬(¬p) ≡ p |
| Commutative | p ∨ q ≡ q ∨ p, p ∧ q ≡ q ∧ p |
| Associative | (p ∨ q) ∨ r ≡ p ∨ (q ∨ r) |
| Distributive | p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r); p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r) |
| **De Morgan's** | ¬(p ∧ q) ≡ ¬p ∨ ¬q; ¬(p ∨ q) ≡ ¬p ∧ ¬q |
| Absorption | p ∨ (p ∧ q) ≡ p; p ∧ (p ∨ q) ≡ p |
| Negation | p ∨ ¬p ≡ T, p ∧ ¬p ≡ F |

Equivalences involving implication:

| Equivalence | |
|---|---|
| p → q ≡ ¬p ∨ q | implication as OR |
| p → q ≡ ¬q → ¬p | contrapositive |
| ¬(p → q) ≡ p ∧ ¬q | negating an implication |
| p ↔ q ≡ (p → q) ∧ (q → p) | biconditional |
| (p → q) ∧ (p → r) ≡ p → (q ∧ r) | |

:::tip De Morgan in code
`!(a && b)` is `!a || !b`, and `!(a || b)` is `!a && !b`. "Not (adult and has ticket)" means "not adult **or** no ticket".
:::

## Proving equivalences by the laws

Show ¬(p ∨ (¬p ∧ q)) ≡ ¬p ∧ ¬q:

| Step | Reason |
|---|---|
| ¬(p ∨ (¬p ∧ q)) | given |
| ≡ ¬p ∧ ¬(¬p ∧ q) | De Morgan |
| ≡ ¬p ∧ (¬¬p ∨ ¬q) | De Morgan |
| ≡ ¬p ∧ (p ∨ ¬q) | double negation |
| ≡ (¬p ∧ p) ∨ (¬p ∧ ¬q) | distributive |
| ≡ F ∨ (¬p ∧ ¬q) | negation law |
| ≡ ¬p ∧ ¬q | identity |

Check any equivalence instantly — compare both columns:

:::widget truth-table
expr: !(p | (!p & q)) <-> (!p & !q)
:::

## Normal forms

Every formula can be rewritten in a standard shape:

- **Disjunctive normal form (DNF)**: an OR of AND-terms — a "sum of products". Example: (p ∧ ¬q) ∨ (¬p ∧ q).
- **Conjunctive normal form (CNF)**: an AND of OR-clauses — a "product of sums". Example: (p ∨ q) ∧ (¬p ∨ ¬q).

**DNF from a truth table**: for each row where the formula is **T**, write the AND of the literals that make that row (p if p is T, ¬p if p is F); OR them together.

**CNF from a truth table**: for each row where the formula is **F**, write the OR of the **negated** literals; AND them together.

```python run
from itertools import product

def formula(p, q, r):
    return (p or q) and not r             # the function we want in normal form

names = "pqr"
minterms, maxterms = [], []
for row in product([True, False], repeat=3):
    lits = [n if v else "¬" + n for n, v in zip(names, row)]
    if formula(*row):
        minterms.append("(" + " ∧ ".join(lits) + ")")
    else:
        maxterms.append("(" + " ∨ ".join("¬" + n if v else n for n, v in zip(names, row)) + ")")
print("DNF:", " ∨ ".join(minterms))
print("CNF:", " ∧ ".join(maxterms))
```

CNF matters in computer science because SAT solvers work on CNF formulas; DNF and CNF also correspond to **sum-of-products** and **product-of-sums** circuits in [Boolean algebra](@discrete/boolean-algebra).

## Functionally complete sets

{¬, ∧, ∨} can express every Boolean function. So can {¬, ∧} (by De Morgan), and so can **NAND alone** or **NOR alone** — which is why chips can be built from a single gate type.

:::quiz
Q. By De Morgan's law, ¬(p ∧ q) is equivalent to...
- ¬p ∧ ¬q
* ¬p ∨ ¬q
- p ∨ q
- ¬p → q
= Negating an AND turns it into an OR of negations.

Q. Which is equivalent to p → q?
* ¬p ∨ q
- p ∨ ¬q
- q → p
- p ∧ ¬q
= An implication is false only when p is true and q false, exactly like ¬p ∨ q.

Q. What does the absorption law give for p ∧ (p ∨ q)?
- q
* p
- p ∨ q
- T
= If p is true the whole thing is true; if p is false it is false.

Q. A formula written as an AND of OR-clauses is in...
- DNF
* CNF
- negation normal form only
- prenex form
= Conjunctive normal form: a conjunction of disjunctions.
:::

=== predicate-logic | Predicates & Quantifiers
desc: Statements with variables: predicates, the universal and existential quantifiers, domains, negating quantified statements, nested quantifiers and translating English.

Propositional logic cannot express "**every** student passed" or "**some** number is prime" in a useful way. **Predicate logic** adds variables, predicates and quantifiers.

## Predicates

A **predicate** P(x) is a statement with a variable; it becomes a proposition once x is given a value.

- P(x): "x > 3". Then P(5) is true and P(1) is false.
- Q(x, y): "x + y = 10". Q(4, 6) is true.

The set of values x may take is the **domain** (universe of discourse).

## Quantifiers

| Quantifier | Symbol | Meaning | True when |
|---|---|---|---|
| Universal | ∀x P(x) | "for all x, P(x)" | P(x) holds for **every** x in the domain |
| Existential | ∃x P(x) | "there exists x such that P(x)" | P(x) holds for **at least one** x |
| Uniqueness | ∃!x P(x) | "there is exactly one x" | exactly one x makes it true |

With domain = {1, 2, 3, 4}:

- ∀x (x > 0) — true.
- ∀x (x is even) — false (counterexample: 1).
- ∃x (x is even) — true (witness: 2).
- ∃x (x > 10) — false.

On a finite domain, ∀ is a big AND and ∃ is a big OR — exactly Python's `all` and `any`:

```python run
domain = range(1, 21)
print("∀x x² ≥ x:          ", all(x * x >= x for x in domain))
print("∃x x² = 49:         ", any(x * x == 49 for x in domain))
print("∀x ∃y y > x:        ", all(any(y > x for y in domain) for x in domain))   # false here: nothing in 1..20 exceeds 20
print("∃y ∀x y ≥ x:        ", any(all(y >= x for x in domain) for y in domain))
print("counterexample to 'all odd numbers are prime':", next(x for x in domain if x % 2 == 1 and x > 1 and any(x % d == 0 for d in range(2, x))))
```

## Negating quantifiers (De Morgan for quantifiers)

| Statement | Negation |
|---|---|
| ∀x P(x) | ∃x ¬P(x) |
| ∃x P(x) | ∀x ¬P(x) |

"Not every student passed" = "some student did not pass". "There is no perfect algorithm" = "every algorithm is imperfect".

## Nested quantifiers

The **order** of different quantifiers matters:

- ∀x ∃y (y > x): "for every number there is a bigger one" — true for the integers.
- ∃y ∀x (y > x): "there is a number bigger than every number" — false for the integers.

Negate nested quantifiers by flipping each one and negating the inside: ¬∀x ∃y P(x, y) ≡ ∃x ∀y ¬P(x, y).

## Translating English

Let S(x): "x is a student", C(x): "x has a laptop", the domain being all people.

| English | Logic |
|---|---|
| Every student has a laptop. | ∀x (S(x) → C(x)) |
| Some student has a laptop. | ∃x (S(x) ∧ C(x)) |
| No student has a laptop. | ∀x (S(x) → ¬C(x)) |
| Not every student has a laptop. | ∃x (S(x) ∧ ¬C(x)) |

:::mistake ∀ goes with →, ∃ goes with ∧
"Every student has a laptop" is **not** ∀x (S(x) ∧ C(x)) — that says everyone is a student. And "some student has a laptop" is **not** ∃x (S(x) → C(x)), which is true as soon as one person is not a student.
:::

## Rules of inference for quantifiers

| Rule | From | Conclude |
|---|---|---|
| Universal instantiation | ∀x P(x) | P(c) for any c |
| Universal generalisation | P(c) for an arbitrary c | ∀x P(x) |
| Existential instantiation | ∃x P(x) | P(c) for some (new) c |
| Existential generalisation | P(c) for some c | ∃x P(x) |

Classic argument: "All humans are mortal; Socrates is human; therefore Socrates is mortal" uses universal instantiation followed by modus ponens.

:::quiz
Q. What is the negation of ∀x P(x)?
- ∀x ¬P(x)
* ∃x ¬P(x)
- ¬∃x P(x)
- ∃x P(x)
= "Not everything has P" means "something lacks P".

Q. Over the integers, which statement is true?
* ∀x ∃y (y = x + 1)
- ∃y ∀x (y = x + 1)
- ∀x ∀y (y = x + 1)
- ∃y ∀x (y > x)
= Every integer has a successor, but no single y is the successor of every x.

Q. How do you write "Some students failed" with S(x) = student and F(x) = failed?
- ∀x (S(x) → F(x))
* ∃x (S(x) ∧ F(x))
- ∃x (S(x) → F(x))
- ∀x (S(x) ∧ F(x))
= Existential statements combine conditions with ∧.

Q. On a finite domain, ∃x P(x) behaves like...
- a big AND
* a big OR
- an implication
- a negation
= It is true if P holds for at least one value — like Python's `any`.
:::

=== proofs | Proof Techniques
desc: How mathematicians and computer scientists prove things: rules of inference, direct proof, proof by contrapositive, contradiction, cases, counterexamples, and existence proofs.

A **proof** is a chain of logically valid steps from accepted facts to a conclusion. Proofs are how we know an algorithm is correct for **all** inputs, not just the ones we tested.

## Rules of inference

| Rule | Form | Example |
|---|---|---|
| Modus ponens | p, p → q ∴ q | It rains; if it rains the road is wet ∴ the road is wet |
| Modus tollens | ¬q, p → q ∴ ¬p | The road is dry; if it rained it would be wet ∴ it did not rain |
| Hypothetical syllogism | p → q, q → r ∴ p → r | chaining implications |
| Disjunctive syllogism | p ∨ q, ¬p ∴ q | It is tea or coffee; not tea ∴ coffee |
| Addition | p ∴ p ∨ q | |
| Simplification | p ∧ q ∴ p | |
| Conjunction | p, q ∴ p ∧ q | |
| Resolution | p ∨ q, ¬p ∨ r ∴ q ∨ r | the rule behind SAT solvers |

:::mistake Two classic fallacies
**Affirming the conclusion**: q, p → q ∴ p — invalid ("the road is wet, so it rained"). **Denying the hypothesis**: ¬p, p → q ∴ ¬q — invalid.
:::

## Direct proof

To prove p → q: **assume p**, then use definitions and known facts to reach q.

> **Theorem.** If n is odd, then n² is odd.
> **Proof.** Suppose n is odd, so n = 2k + 1 for some integer k. Then n² = 4k² + 4k + 1 = 2(2k² + 2k) + 1, which is odd. ∎

## Proof by contrapositive

Prove ¬q → ¬p instead, which is equivalent to p → q. Use it when the negations are easier to work with.

> **Theorem.** If n² is even, then n is even.
> **Proof.** Contrapositive: if n is odd, then n² is odd — proved above. ∎

## Proof by contradiction

Assume the statement is **false** and derive something impossible.

> **Theorem.** √2 is irrational.
> **Proof.** Suppose √2 = a/b in lowest terms. Then 2b² = a², so a² is even, so a is even: a = 2c. Then 2b² = 4c², so b² = 2c² is even, so b is even. But then a and b share the factor 2, contradicting "lowest terms". ∎

> **Theorem (Euclid).** There are infinitely many primes.
> **Proof.** Suppose there are finitely many: p₁, p₂, …, pₙ. Let N = p₁p₂…pₙ + 1. No pᵢ divides N (each leaves remainder 1), so N's prime factors are not in the list — a contradiction. ∎

## Proof by cases

Split into cases that cover every possibility and prove each one.

> **Theorem.** n² + n is even for every integer n.
> **Proof.** If n is even, n² and n are both even, so their sum is even. If n is odd, n² and n are both odd, and odd + odd is even. ∎

## Counterexamples

To **disprove** a universal statement ∀x P(x), one counterexample is enough.

Claim: "n² + n + 41 is prime for every n ≥ 0." It holds for n = 0 … 39, but fails at n = 40. Testing many cases is evidence, never proof:

```python run
def is_prime(n):
    return n > 1 and all(n % d for d in range(2, int(n ** 0.5) + 1))

for n in range(45):
    if not is_prime(n * n + n + 41):
        print(f"counterexample: n = {n}, n^2 + n + 41 = {n*n + n + 41} = 41 x {(n*n + n + 41) // 41}")
        break
else:
    print("no counterexample found")
```

## Existence proofs

- **Constructive**: exhibit the object. "There is an integer that is the sum of two cubes in two ways": 1729 = 1³ + 12³ = 9³ + 10³.
- **Non-constructive**: show it must exist without naming it (often by contradiction or the [pigeonhole principle](@discrete/counting)).

## Which technique?

| Statement looks like | Try |
|---|---|
| p → q with a usable p | direct proof |
| q is a negative statement ("not divisible", "irrational") | contradiction or contrapositive |
| "for all n ≥ 1" about integers | [induction](@discrete/induction) |
| a few distinct situations (even/odd, sign) | cases |
| "every x" that you suspect is false | counterexample |

:::quiz
Q. Which rule concludes q from p and p → q?
* Modus ponens
- Modus tollens
- Disjunctive syllogism
- Resolution
= Affirm the hypothesis to get the conclusion.

Q. In proof by contradiction you begin by assuming...
- the hypothesis is false
* the statement you want to prove is false
- the converse is true
- nothing
= Then you derive something impossible.

Q. What is enough to disprove "every prime is odd"?
- A proof by induction
* One counterexample: 2
- Checking primes up to 1000
- A truth table
= A single counterexample refutes a universal claim.

Q. From "If the server is up, the site loads" and "the site does not load", what follows?
- The server is up
* The server is down
- Nothing
- The site loads
= Modus tollens: ¬q and p → q give ¬p.
:::

=== induction | Mathematical Induction
desc: Prove statements for all natural numbers: the base case and inductive step, sums, divisibility and inequalities, strong induction, and the link to recursion and loop invariants.

**Mathematical induction** proves that a statement P(n) is true for **every** integer n ≥ n₀. Think of an infinite line of dominoes:

1. **Base case**: prove P(n₀) — the first domino falls.
2. **Inductive step**: prove that **if** P(k) is true (the **inductive hypothesis**), **then** P(k + 1) is true — each domino knocks over the next.

Together they prove P(n) for all n ≥ n₀.

## Example 1: sum of the first n integers

> **Claim.** 1 + 2 + … + n = n(n + 1)/2 for all n ≥ 1.

**Base case** (n = 1): left side 1, right side 1·2/2 = 1. ✓

**Inductive step**: assume 1 + 2 + … + k = k(k + 1)/2. Then

1 + 2 + … + k + (k + 1) = k(k + 1)/2 + (k + 1) = (k + 1)(k/2 + 1) = (k + 1)(k + 2)/2,

which is the formula for n = k + 1. ∎

## Example 2: divisibility

> **Claim.** 3 divides n³ − n for all n ≥ 0.

**Base**: n = 0 gives 0, divisible by 3. ✓

**Step**: assume 3 | k³ − k. Then (k + 1)³ − (k + 1) = k³ + 3k² + 3k + 1 − k − 1 = (k³ − k) + 3(k² + k). Both parts are divisible by 3. ∎

## Example 3: an inequality

> **Claim.** 2ⁿ > n² for all n ≥ 5.

**Base**: 2⁵ = 32 > 25. ✓

**Step**: assume 2ᵏ > k² with k ≥ 5. Then 2ᵏ⁺¹ = 2·2ᵏ > 2k² = k² + k² > k² + 2k + 1 = (k + 1)², because k² > 2k + 1 when k ≥ 3. ∎

(The base case matters: the claim is false for n = 2, 3, 4.)

## Checking a formula is not proving it

Code can test a formula for many n — useful for catching a wrong formula before you try to prove it:

```python run
def check(name, lhs, rhs, upto=50):
    bad = [n for n in range(1, upto + 1) if lhs(n) != rhs(n)]
    print(f"{name}: {'holds' if not bad else 'FAILS at n = ' + str(bad[0])} for n = 1..{upto}")

check("sum of first n odd numbers = n^2", lambda n: sum(2 * i - 1 for i in range(1, n + 1)), lambda n: n * n)
check("sum of squares = n(n+1)(2n+1)/6", lambda n: sum(i * i for i in range(1, n + 1)), lambda n: n * (n + 1) * (2 * n + 1) // 6)
check("sum of cubes = (n(n+1)/2)^2", lambda n: sum(i ** 3 for i in range(1, n + 1)), lambda n: (n * (n + 1) // 2) ** 2)
check("2^n > n^2", lambda n: 2 ** n > n * n, lambda n: True)
```

The last check fails at n = 2 — which is why that claim starts at n = 5.

## Strong induction

In **strong induction** the inductive step may assume P(n₀), P(n₀ + 1), …, P(k) — **all** earlier cases — to prove P(k + 1). Use it when the next case depends on cases further back.

> **Claim.** Every integer n ≥ 2 is a product of primes.
> **Proof.** Base: 2 is prime. Step: consider k + 1. If it is prime, done. Otherwise k + 1 = a·b with 2 ≤ a, b ≤ k; by the hypothesis both a and b are products of primes, so k + 1 is too. ∎

> **Claim.** Every postage of 12 or more rupees can be made from 4- and 5-rupee stamps.
> **Proof.** Base cases 12 = 4+4+4, 13 = 4+4+5, 14 = 4+5+5, 15 = 5+5+5. Step: for k + 1 ≥ 16, take the solution for k − 3 (true by hypothesis) and add one 4-rupee stamp. ∎

## Induction and computer science

- **Recursion** is induction in code: the base case of a recursive function is the base case of the proof, and the recursive call relies on the "inductive hypothesis" that smaller inputs are handled correctly.
- **Loop invariants** ([correctness proofs](@daa/intro)) are induction on the number of iterations.
- **Structural induction** proves properties of trees and lists: true for the empty structure, and preserved when building larger ones.

:::exam Write all four parts
Examiners look for: (1) the statement P(n), (2) the base case checked explicitly, (3) the inductive hypothesis stated clearly ("assume P(k) is true"), (4) the inductive step showing P(k + 1), ending with "hence by induction P(n) holds for all n ≥ n₀".
:::

:::quiz
Q. What are the two steps of mathematical induction?
* Base case and inductive step
- Hypothesis and contradiction
- Divide and conquer
- Proof and counterexample
= Prove the first case, then that each case implies the next.

Q. In strong induction, the inductive hypothesis assumes...
- only P(k)
* P(n₀), P(n₀ + 1), …, P(k)
- P(k + 1)
- nothing
= All earlier cases may be used.

Q. Using induction to show 1 + 3 + 5 + … + (2n − 1) = n², what is added in the inductive step?
- 2k − 1
* 2k + 1
- k + 1
- (k + 1)²
= The (k + 1)-th odd number is 2(k + 1) − 1 = 2k + 1, and k² + 2k + 1 = (k + 1)².

Q. Why does the claim 2ⁿ > n² start at n = 5?
- Induction cannot start at 1
* The statement is false for n = 2, 3 and 4
- 5 is prime
- It is a convention
= A valid base case must actually be true; the claim first holds from 5 onward.
:::
