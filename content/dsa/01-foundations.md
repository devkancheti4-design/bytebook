=== intro | Introduction to Data Structures
unit: Foundations
desc: What a data structure is, abstract data types, linear vs non-linear structures, and why choosing well matters more than coding fast.

A **data structure** is a way of organising data in memory so that the operations you need — search, insert, delete, find the smallest — are **fast**. The same million phone numbers can be stored in an array, a linked list, a tree or a hash table; each choice makes some operations quick and others slow.

> Bad programmers worry about the code. Good programmers worry about data structures and their relationships. — Linus Torvalds

## Why it matters

Imagine looking up a contact among 1,000,000 numbers:

| Structure | Steps to find one number (worst case) |
|---|---|
| Unsorted array, linear search | 1,000,000 |
| Sorted array, binary search | about 20 |
| Hash table | about 1 |

Same data, same computer — a 1,000,000× difference, purely from how the data is organised.

## Abstract data types

An **abstract data type (ADT)** describes *what* operations a structure supports, not *how* they are implemented. A data structure is a concrete implementation of an ADT.

| ADT | Operations | Common implementations |
|---|---|---|
| List | insert, delete, get(i), search | array, linked list |
| Stack | push, pop, peek | array, linked list |
| Queue | enqueue, dequeue, front | circular array, linked list |
| Priority queue | insert, extract-min/max | binary heap |
| Map / dictionary | put(key, value), get(key) | hash table, balanced BST |
| Set | add, remove, contains | hash table, BST |

Think of an ADT as a remote control's buttons, and the data structure as the electronics inside.

## Classifying data structures

:::diagram tree
tree: Data Structures(Primitive(int,float,char),Non-primitive(Linear(Array,List,Stack,Queue),Non-linear(Tree,Graph)))
shape: box
caption: The classification examiners expect. Linear structures arrange elements in a sequence; non-linear ones branch.
:::

- **Linear**: elements form a sequence, each with at most one predecessor and successor — arrays, linked lists, stacks, queues.
- **Non-linear**: an element can connect to many others — trees (hierarchies) and graphs (networks).
- **Static**: size fixed at compile time (a C array).
- **Dynamic**: grows and shrinks at run time (a linked list built with `malloc`).

## The operations we measure

Every structure in this course is judged by the cost of a handful of operations:

1. **Traversal** — visit every element once.
2. **Search** — find an element with a given key.
3. **Insertion** — add an element.
4. **Deletion** — remove an element.
5. **Sorting** and **merging** — for collections of data.

The next lesson gives you the language for comparing those costs: **Big-O notation**.

## A first taste: the same job, two structures

Both programs below store marks and answer "is 72 in the list?". The array keeps data in one block; the linked list chains separate nodes together with pointers. You will build both properly in this course.

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int main(void) {
    int arr[] = {55, 72, 81, 64};
    for (int i = 0; i < 4; i++)
        if (arr[i] == 72) printf("array: found 72 at index %d\n", i);

    Node *head = NULL;                       // build list 64 -> 81 -> 72 -> 55 by inserting at the front
    for (int i = 0; i < 4; i++) {
        Node *n = malloc(sizeof(Node));
        n->data = arr[i];
        n->next = head;
        head = n;
    }
    int pos = 0;
    for (Node *p = head; p; p = p->next, pos++)
        if (p->data == 72) printf("list:  found 72 at node %d\n", pos);
    while (head) { Node *t = head; head = head->next; free(t); }
    return 0;
}
```

:::exam Define and classify
Short-answer favourite: "Define data structure. Classify with examples." Draw the tree above, then give one line each on linear vs non-linear and static vs dynamic.
:::

:::quiz
Q. Which of these is a **non-linear** data structure?
- Stack
- Queue
* Tree
- Array
= Trees and graphs branch, so an element can have several successors.

Q. What does an abstract data type specify?
* The operations and their behaviour, not the implementation
- The exact memory layout
- The programming language to use
- The time complexity of each operation
= An ADT is a contract (push, pop, …). Arrays or linked lists can implement the same ADT.

Q. Which structure is usually used to implement a priority queue?
- Linked list
* Binary heap
- Stack
- Graph
= A binary heap gives O(log n) insert and extract-max/min.

Q. A C array declared as `int a[100];` is an example of a...
* Static data structure
- Dynamic data structure
- Non-linear data structure
- Abstract data type
= Its size is fixed when the program is compiled.
:::

=== complexity | Time & Space Complexity
desc: Count steps instead of seconds: Big-O notation, the common growth rates, analysing loops, and best, average and worst cases.

How do you compare two algorithms? Timing them with a stopwatch depends on the computer, the compiler and the input. Instead we count **how the number of basic steps grows with the input size `n`**. That growth rate is the algorithm's **time complexity**.

## Big-O notation

**O(f(n))** describes an **upper bound** on growth, ignoring constants and smaller terms:

- 3n² + 5n + 100 → **O(n²)** (n² dominates for large n)
- 7n + 20 → **O(n)**
- 500 → **O(1)**

We drop constants because we care about *scaling*: does doubling the input double the work, quadruple it, or barely change it?

## The growth rates you must know

| Big-O | Name | Example | n = 1,000 |
|---|---|---|---|
| O(1) | constant | array index, hash lookup | 1 |
| O(log n) | logarithmic | binary search | ~10 |
| O(n) | linear | linear search, traversal | 1,000 |
| O(n log n) | linearithmic | merge sort, heap sort | ~10,000 |
| O(n²) | quadratic | bubble sort, nested loops | 1,000,000 |
| O(2ⁿ) | exponential | naive Fibonacci, all subsets | ~10³⁰⁰ |
| O(n!) | factorial | all permutations | unimaginable |

Drag the slider to feel the difference:

:::widget big-o
:::

## Analysing code

Count how many times the innermost statement runs.

```c
// O(1): no loops depending on n
int first = a[0];

// O(n): one loop over n elements
for (int i = 0; i < n; i++) sum += a[i];

// O(n^2): a loop inside a loop, both over n
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++) count++;

// O(log n): i doubles each time, so it reaches n after log2(n) steps
for (int i = 1; i < n; i *= 2) steps++;

// O(n log n): an O(log n) loop inside an O(n) loop
for (int i = 0; i < n; i++)
    for (int j = 1; j < n; j *= 2) work++;
```

You can check the counting by running it:

```c run
#include <stdio.h>

int main(void) {
    int sizes[] = {10, 100, 1000};
    for (int s = 0; s < 3; s++) {
        int n = sizes[s];
        long linear = 0, quad = 0, logn = 0, tri = 0;
        for (int i = 0; i < n; i++) linear++;
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) quad++;
        for (int i = 1; i < n; i *= 2) logn++;
        for (int i = 0; i < n; i++) for (int j = 0; j < i; j++) tri++;   // still O(n^2): n(n-1)/2
        printf("n=%4d  log:%2ld  linear:%5ld  triangle:%7ld  square:%8ld\n", n, logn, linear, tri, quad);
    }
    return 0;
}
```

The "triangle" loop does n(n−1)/2 steps — about half of n², but still **O(n²)**, because constants are dropped.

## Rules of thumb

1. **Sequential steps add**: O(n) followed by O(n²) is O(n + n²) = O(n²).
2. **Nested loops multiply**: an O(n) loop inside an O(n) loop is O(n²).
3. **Drop constants and lower terms**: O(2n + 10) = O(n).
4. **Halving or doubling** the remaining work each step gives O(log n).
5. **Different inputs keep different letters**: looping over `n` items then `m` items is O(n + m), not O(n).

## Best, average and worst case

The same algorithm can take different time on different inputs of the same size. For linear search on `n` items:

- **Best case**: the key is first — 1 comparison, O(1).
- **Worst case**: the key is last or absent — n comparisons, O(n).
- **Average case**: about n/2 comparisons — still O(n).

We usually quote the **worst case**, because it is a guarantee.

## Space complexity

Space complexity measures **extra memory** used as `n` grows. Reversing an array in place uses O(1) extra space; copying it into a new array uses O(n). A recursive function uses stack space proportional to its maximum recursion depth.

:::note Ω and Θ
Big-O is an upper bound. **Ω (omega)** is a lower bound and **Θ (theta)** is a tight bound (both upper and lower). The [Asymptotic Notations](@daa/asymptotic) lesson in Algorithms covers them formally.
:::

:::quiz
Q. What is the time complexity of this code?
```c
for (int i = 0; i < n; i++)
    for (int j = 0; j < 100; j++)
        x++;
```
* O(n)
- O(n²)
- O(100n²)
- O(log n)
= The inner loop runs a constant 100 times, so the total is 100n, which is O(n).

Q. Simplify O(4n² + 3n log n + 20).
- O(4n²)
* O(n²)
- O(n log n)
- O(n² + n log n)
= Drop constants and keep only the fastest-growing term.

Q. A loop runs `for (i = n; i > 1; i /= 2)`. How many iterations?
- n
- n/2
* about log₂ n
- n²
= Halving `n` each time reaches 1 after about log₂ n steps.

Q. Binary search on 1,000,000 sorted items needs at most about how many comparisons?
- 1,000
- 500,000
* 20
- 1
= log₂(1,000,000) ≈ 20.
:::

=== arrays-ds | Arrays as a Data Structure
desc: Arrays from the data-structure point of view: O(1) access, the cost of insertion and deletion by shifting, and when an array is the right choice.

You already know how to use arrays from the C course. Here we look at them as a data structure: **what each operation costs**.

An array stores elements in **contiguous memory**. Because every element has the same size, the address of `a[i]` is simply `base + i × size`. That makes access **O(1)** — the computer jumps straight there.

:::diagram array
values: 12 25 31 47 58 _ _
pointers: base=0 a[3]=3
caption: `a[3]` is at base + 3 × 4 bytes. No searching needed, so indexing is O(1). The `_` cells are spare capacity.
:::

## Insertion at a position

To insert at index `pos`, every element from `pos` onwards must **shift one place right** to make room. Inserting at the front of `n` elements moves all `n`: **O(n)**.

```c run
#include <stdio.h>

int insertAt(int a[], int n, int cap, int pos, int value) {
    if (n == cap || pos < 0 || pos > n) return n;      // full or invalid position
    for (int i = n; i > pos; i--)                       // shift right, starting from the end
        a[i] = a[i - 1];
    a[pos] = value;
    return n + 1;                                       // new size
}

void print(const int a[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
}

int main(void) {
    int a[10] = {12, 25, 31, 47, 58};
    int n = 5;
    n = insertAt(a, n, 10, 2, 99);
    print(a, n);
    n = insertAt(a, n, 10, 0, 7);
    print(a, n);
    n = insertAt(a, n, 10, n, 100);   // at the end: no shifting, O(1)
    print(a, n);
    return 0;
}
```

## Deletion at a position

Deleting shifts the later elements **left** to close the gap: also **O(n)** in the worst case.

```c run
#include <stdio.h>

int deleteAt(int a[], int n, int pos) {
    if (pos < 0 || pos >= n) return n;
    for (int i = pos; i < n - 1; i++)
        a[i] = a[i + 1];
    return n - 1;
}

int main(void) {
    int a[] = {12, 25, 31, 47, 58};
    int n = 5;
    n = deleteAt(a, n, 1);
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
```

:::tip Delete in O(1) when order does not matter
If the order of elements is not important, copy the **last** element into the deleted slot and shrink the size by one. No shifting needed.
:::

## Array operation costs

| Operation | Cost | Why |
|---|---|---|
| Access `a[i]` | O(1) | address arithmetic |
| Update `a[i] = x` | O(1) | address arithmetic |
| Search (unsorted) | O(n) | may check every element |
| Search (sorted) | O(log n) | binary search |
| Insert / delete at end | O(1) | nothing to shift |
| Insert / delete at front or middle | O(n) | shifting |

## Strengths and weaknesses

**Use an array when** you need fast random access by index, the size is known or changes rarely, and you mostly add or remove at the end.

**Avoid an array when** you insert and delete in the middle a lot, or the size is completely unpredictable — that is where [linked lists](@dsa/singly-linked-list) shine.

:::note Cache friendliness
Because array elements sit next to each other, the CPU loads several of them into its cache at once. In practice, traversing an array is often several times faster than traversing a linked list with the same Big-O.
:::

## Merging two sorted arrays

A pattern you will reuse in merge sort: walk both arrays with two indexes, always taking the smaller front element. It runs in **O(n + m)**.

```c run
#include <stdio.h>

int main(void) {
    int a[] = {3, 8, 15, 21}, b[] = {1, 9, 10, 22, 30};
    int n = 4, m = 5, c[9], i = 0, j = 0, k = 0;
    while (i < n && j < m) c[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
    while (i < n) c[k++] = a[i++];
    while (j < m) c[k++] = b[j++];
    for (int t = 0; t < k; t++) printf("%d ", c[t]);
    printf("\n");
    return 0;
}
```

:::quiz
Q. Why is accessing `a[i]` O(1)?
- The array is sorted
* The address is computed directly as base + i × element size
- C caches every element
- Arrays are small
= No traversal is needed; the address is arithmetic.

Q. What is the worst-case cost of inserting at the front of an array holding `n` elements?
- O(1)
- O(log n)
* O(n)
- O(n²)
= Every existing element must shift one position right.

Q. Merging two sorted arrays of sizes `n` and `m` takes...
- O(n × m)
* O(n + m)
- O(log(n + m))
- O(n²)
= Each step copies one element, and there are n + m elements in total.

Q. Which situation suits an array **least**?
- Reading the 500th element repeatedly
- Storing exactly 12 monthly totals
* Frequently inserting in the middle of a large, changing list
- Looping over all elements in order
= Middle insertions require O(n) shifting each time.
:::
