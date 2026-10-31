=== searching | Linear & Binary Search
unit: Searching & Sorting
desc: Find things fast: linear search for any list, binary search for sorted ones — iterative and recursive versions, step-by-step traces and the classic off-by-one traps.

## Linear search

Check every element from the start until you find the key. It works on **any** list, sorted or not.

- Best case O(1), worst and average case **O(n)**.

You wrote it in the [Arrays](@c/arrays) lesson. Its weakness is speed on large data.

## Binary search

If the array is **sorted**, you can do much better. Look at the **middle** element:

- equal to the key → found;
- key smaller → the key can only be in the **left half**;
- key larger → it can only be in the **right half**.

Each step **halves** the search space, so at most about log₂ n steps are needed: **O(log n)**. For a million elements that is 20 comparisons instead of a million.

:::widget binary-search
:::

## Iterative binary search

```c run
#include <stdio.h>

int binarySearch(const int a[], int n, int key) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;     // avoids overflow of (low + high)
        printf("  low=%d high=%d mid=%d a[mid]=%d\n", low, high, mid, a[mid]);
        if (a[mid] == key) return mid;
        if (a[mid] < key) low = mid + 1;       // key is in the right half
        else high = mid - 1;                   // key is in the left half
    }
    return -1;
}

int main(void) {
    int a[] = {3, 8, 15, 21, 29, 34, 42, 57, 63, 78};
    int n = 10;
    printf("search 57:\n");
    printf("-> index %d\n", binarySearch(a, n, 57));
    printf("search 10:\n");
    printf("-> index %d\n", binarySearch(a, n, 10));
    return 0;
}
```

:::diagram array
values: 3 8 15 21 29 34 42 57 63 78
pointers: low=5 mid=7 high=9
highlight: 7
caption: Second step of the search for 57: the left half was discarded, and `mid` now lands on 57.
:::

## Recursive binary search

```c run
#include <stdio.h>

int bs(const int a[], int low, int high, int key) {
    if (low > high) return -1;                       // empty range: not found
    int mid = low + (high - low) / 2;
    if (a[mid] == key) return mid;
    return a[mid] < key ? bs(a, mid + 1, high, key) : bs(a, low, mid - 1, key);
}

int main(void) {
    int a[] = {2, 4, 7, 10, 23, 38, 56, 72, 91};
    int keys[] = {23, 2, 91, 50};
    for (int i = 0; i < 4; i++) printf("%d -> %d\n", keys[i], bs(a, 0, 8, keys[i]));
    return 0;
}
```

Recurrence: T(n) = T(n/2) + O(1) → **O(log n)**. The recursive version uses O(log n) stack space; the iterative one uses O(1).

:::mistake Binary search bugs
- Using it on an **unsorted** array — it silently gives wrong answers.
- `while (low < high)` instead of `<=` — misses single-element ranges.
- `low = mid` or `high = mid` instead of `mid ± 1` — can loop forever.
- `(low + high) / 2` can overflow for huge arrays; `low + (high - low) / 2` cannot.
:::

## Variants worth knowing

Binary search finds more than exact matches. Changing what happens on equality gives you the **first** or **last** occurrence of a repeated key:

```c run
#include <stdio.h>

int firstOccurrence(const int a[], int n, int key) {
    int low = 0, high = n - 1, ans = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (a[mid] == key) { ans = mid; high = mid - 1; }   // record it, keep looking left
        else if (a[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return ans;
}

int lastOccurrence(const int a[], int n, int key) {
    int low = 0, high = n - 1, ans = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (a[mid] == key) { ans = mid; low = mid + 1; }    // keep looking right
        else if (a[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return ans;
}

int main(void) {
    int a[] = {1, 3, 3, 3, 3, 5, 8, 8, 9};
    int f = firstOccurrence(a, 9, 3), l = lastOccurrence(a, 9, 3);
    printf("3 appears from index %d to %d: %d times\n", f, l, l - f + 1);
    return 0;
}
```

| | Linear search | Binary search |
|---|---|---|
| Needs sorted data | no | **yes** |
| Time | O(n) | **O(log n)** |
| Works on linked lists | yes | not efficiently (no random access) |

:::quiz
Q. What is the precondition for binary search?
- The array has an odd length
* The array is sorted
- The array has no duplicates
- The key is in the array
= Discarding half the range is only valid when the elements are in order.

Q. How many comparisons does binary search need, at most, for 1,024 elements?
- 1,024
- 512
* about 10–11
- 32
= log₂ 1024 = 10, so at most about 11 probes.

Q. Searching for 15 in `[3, 8, 15, 21, 29]`: what is the first `mid` index?
- 1
* 2
- 0
- 3
= low = 0, high = 4, mid = 2, and a[2] = 15 — found immediately.

Q. Why write `mid = low + (high - low) / 2`?
- It is faster
* It avoids integer overflow when `low + high` is very large
- It rounds up instead of down
- It works on unsorted arrays
= Both formulas give the same mid, but `low + high` can exceed the int range.
:::

=== sorting-basic | Bubble, Selection & Insertion Sort
desc: The three O(n²) sorts: how each one works, passes and swaps traced by hand, stability, best cases, and when a simple sort is the right choice.

**Sorting** puts elements in order. Sorted data makes searching (binary search), finding duplicates, merging and reporting much easier. We start with three simple sorts that are easy to trace by hand — exactly what exams ask.

Watch them run on the same data:

:::widget sort
algos: bubble selection insertion
:::

## Bubble sort

Compare **adjacent** pairs and swap if they are in the wrong order. After pass 1 the **largest** element has "bubbled" to the end; after pass 2, the second largest; and so on. If a pass makes no swaps, the array is already sorted and we can stop early.

```c run
#include <stdio.h>

void show(const int a[], int n) { for (int i = 0; i < n; i++) printf("%d ", a[i]); printf("\n"); }

void bubbleSort(int a[], int n) {
    for (int pass = 1; pass < n; pass++) {
        int swapped = 0;
        for (int j = 0; j < n - pass; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                swapped = 1;
            }
        printf("after pass %d: ", pass); show(a, n);
        if (!swapped) break;                 // no swaps: already sorted
    }
}

int main(void) {
    int a[] = {5, 1, 4, 2, 8};
    bubbleSort(a, 5);
    return 0;
}
```

## Selection sort

Find the **minimum** of the unsorted part and swap it to the front of that part. Exactly n − 1 swaps — useful when writing to memory is expensive.

```c run
#include <stdio.h>

void show(const int a[], int n) { for (int i = 0; i < n; i++) printf("%d ", a[i]); printf("\n"); }

void selectionSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++)
            if (a[j] < a[min]) min = j;
        int t = a[i]; a[i] = a[min]; a[min] = t;
        printf("pass %d (placed %d): ", i + 1, a[i]); show(a, n);
    }
}

int main(void) {
    int a[] = {64, 25, 12, 22, 11};
    selectionSort(a, 5);
    return 0;
}
```

## Insertion sort

Build the sorted part one element at a time: take the next element (the **key**) and **shift** larger sorted elements right until the key's place is found — the way you sort playing cards in your hand.

```c run
#include <stdio.h>

void show(const int a[], int n) { for (int i = 0; i < n; i++) printf("%d ", a[i]); printf("\n"); }

void insertionSort(int a[], int n) {
    for (int i = 1; i < n; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];                 // shift right
            j--;
        }
        a[j + 1] = key;
        printf("insert %2d: ", key); show(a, n);
    }
}

int main(void) {
    int a[] = {12, 11, 13, 5, 6};
    insertionSort(a, 5);
    return 0;
}
```

On nearly sorted data, insertion sort barely shifts anything and runs in close to **O(n)** — which is why fast library sorts switch to insertion sort for small pieces.

## Comparison

| | Bubble | Selection | Insertion |
|---|---|---|---|
| Best case | O(n) (with early exit) | O(n²) | **O(n)** |
| Average / worst | O(n²) | O(n²) | O(n²) |
| Swaps / writes | many | **n − 1 swaps** | many shifts |
| Extra space | O(1) | O(1) | O(1) |
| Stable? | **yes** | no | **yes** |
| Adaptive (faster on sorted input)? | yes | no | **yes** |

:::def Stable sort
A sorting algorithm is **stable** if equal elements keep their original relative order. It matters when sorting records by one field after another — for example by marks, keeping students with equal marks in roll-number order.
:::

:::exam Trace questions
"Show the array after each pass of bubble sort on 5, 1, 4, 2, 8" — write one row per pass exactly like the program output above. For selection sort, mark the minimum found in each pass; for insertion sort, mark the key being inserted.
:::

:::quiz
Q. After the **first** pass of bubble sort on `[4, 3, 2, 1]`, what is the array?
- `[1, 2, 3, 4]`
* `[3, 2, 1, 4]`
- `[3, 4, 2, 1]`
- `[1, 4, 3, 2]`
= One pass moves the largest element (4) to the end: 4 swaps past 3, 2 and 1.

Q. Which simple sort makes at most n − 1 swaps?
- Bubble sort
* Selection sort
- Insertion sort
- All of them
= Selection sort does one swap per pass.

Q. Which sort is fastest on an already sorted array?
- Selection sort
* Insertion sort
- Both are O(n²)
- Neither works on sorted input
= Insertion sort does one comparison per element when nothing needs shifting: O(n).

Q. Which of these is **not** stable?
- Bubble sort
- Insertion sort
* Selection sort
- Merge sort
= Selection sort's long-distance swap can jump an element past an equal one.
:::

=== sorting-advanced | Merge, Quick & Counting Sort
desc: Faster sorting: divide-and-conquer merge sort and quick sort with their partition traces, plus counting and radix sort that beat O(n log n) on integers.

The O(n²) sorts are fine for a few hundred elements. For a million, you need **O(n log n)**. Both merge sort and quick sort get there with **divide and conquer**: split the problem, solve the pieces recursively, combine.

:::widget sort
algos: merge quick
:::

## Merge sort

1. **Divide** the array into two halves.
2. **Conquer**: sort each half recursively.
3. **Combine**: merge the two sorted halves (the two-pointer merge from the [Arrays](@dsa/arrays-ds) lesson).

```c run
#include <stdio.h>

void merge(int a[], int lo, int mid, int hi) {
    int tmp[64], i = lo, j = mid + 1, k = 0;
    while (i <= mid && j <= hi) tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];   // <= keeps it stable
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= hi)  tmp[k++] = a[j++];
    for (k = 0; k < hi - lo + 1; k++) a[lo + k] = tmp[k];
}

void mergeSort(int a[], int lo, int hi, int depth) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(a, lo, mid, depth + 1);
    mergeSort(a, mid + 1, hi, depth + 1);
    merge(a, lo, mid, hi);
    printf("%*smerged [%d..%d]: ", depth * 2, "", lo, hi);
    for (int i = lo; i <= hi; i++) printf("%d ", a[i]);
    printf("\n");
}

int main(void) {
    int a[] = {38, 27, 43, 3, 9, 82, 10};
    mergeSort(a, 0, 6, 0);
    return 0;
}
```

Recurrence: T(n) = 2T(n/2) + O(n) → **O(n log n)** in **every** case. The merge needs an O(n) temporary array. Merge sort is **stable** and is the standard choice for sorting linked lists and huge files on disk.

## Quick sort

1. Pick a **pivot** element.
2. **Partition**: rearrange so everything smaller than the pivot is on its left and everything larger on its right. The pivot is now in its final position.
3. Recursively sort the left and right parts. No merge step is needed.

The **Lomuto** partition uses the last element as the pivot:

```c run
#include <stdio.h>

void swap(int *x, int *y) { int t = *x; *x = *y; *y = t; }

int partition(int a[], int lo, int hi) {
    int pivot = a[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) swap(&a[++i], &a[j]);   // grow the "smaller" region
    swap(&a[i + 1], &a[hi]);                      // put the pivot between the regions
    return i + 1;
}

void quickSort(int a[], int lo, int hi, int n) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    printf("pivot %2d -> index %d: ", a[p], p);
    for (int i = 0; i < n; i++) printf(i == p ? "[%d] " : "%d ", a[i]);
    printf("\n");
    quickSort(a, lo, p - 1, n);
    quickSort(a, p + 1, hi, n);
}

int main(void) {
    int a[] = {10, 80, 30, 90, 40, 50, 70};
    quickSort(a, 0, 6, 7);
    return 0;
}
```

| Case | When | Cost |
|---|---|---|
| Best / average | pivot splits roughly in half | **O(n log n)** |
| Worst | pivot is always the smallest or largest (e.g. sorted input with last-element pivot) | **O(n²)** |

Choosing a **random pivot** or the **median of three** makes the worst case extremely unlikely. In practice quick sort is often the fastest comparison sort: it sorts **in place** (O(log n) stack space) and is cache-friendly. It is **not stable**.

## Counting sort

When keys are **small integers** in a known range 0…k, you do not need comparisons at all. Count how many times each value occurs, then write the values out in order: **O(n + k)**.

```c run
#include <stdio.h>

int main(void) {
    int a[] = {4, 2, 2, 8, 3, 3, 1, 7, 2};
    int n = 9, k = 8, count[9] = {0};
    for (int i = 0; i < n; i++) count[a[i]]++;
    int idx = 0;
    for (int v = 0; v <= k; v++)
        while (count[v]--) a[idx++] = v;
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
```

**Radix sort** applies a stable counting sort digit by digit (units, then tens, then hundreds…), sorting d-digit numbers in O(d × (n + 10)).

## The big comparison

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | no |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | no |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no |
| Counting | O(n + k) | O(n + k) | O(n + k) | O(k) | yes |

:::note The O(n log n) barrier
Any sort that only **compares** elements needs Ω(n log n) comparisons in the worst case. Counting and radix sort beat it because they do not compare — they use the keys as array indexes.
:::

:::quiz
Q. What is the worst-case time of merge sort?
- O(n²)
* O(n log n)
- O(n)
- O(log n)
= Merge sort always splits in half and merges in linear time, whatever the input.

Q. When does quick sort with a last-element pivot hit its O(n²) worst case?
- On random data
* On already sorted data
- When all elements are distinct
- Never
= The pivot is then always the largest element, so each partition removes only one element.

Q. Which O(n log n) sort is stable?
* Merge sort
- Quick sort
- Heap sort
- None of them
= Merge sort keeps equal elements in order if the merge takes from the left half on ties.

Q. Which algorithm sorts n integers in the range 0…k in O(n + k) time?
- Quick sort
- Heap sort
* Counting sort
- Insertion sort
= Counting sort tallies each value instead of comparing elements.
:::

=== cheatsheet | Data Structures Cheat Sheet
desc: Every structure and algorithm from CSE 102 on one page: operation costs, when to use what, key formulas and the programs to practise.

## Operation costs

| Structure | Access | Search | Insert | Delete | Notes |
|---|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) | O(1) at the end |
| Sorted array | O(1) | O(log n) | O(n) | O(n) | binary search |
| Singly linked list | O(n) | O(n) | O(1)* | O(1)* | *at head or after a known node |
| Doubly linked list | O(n) | O(n) | O(1)* | O(1)* | delete with only the node pointer |
| Stack | top only | O(n) | O(1) push | O(1) pop | LIFO |
| Queue | front only | O(n) | O(1) enqueue | O(1) dequeue | FIFO |
| BST (balanced) | — | O(log n) | O(log n) | O(log n) | O(n) if skewed |
| AVL tree | — | O(log n) | O(log n) | O(log n) | guaranteed |
| Binary heap | O(1) max/min | O(n) | O(log n) | O(log n) extract | priority queue |
| Hash table | — | O(1) avg | O(1) avg | O(1) avg | O(n) worst |
| Graph (adj. list) | — | O(V + E) traversal | O(1) edge | O(deg) edge | sparse graphs |

## Choosing a structure

| You need to… | Use |
|---|---|
| access by position, rarely insert | array |
| insert/delete often in the middle | linked list |
| undo, backtrack, match brackets, evaluate expressions | stack |
| process in arrival order, BFS, scheduling | queue |
| always get the smallest/largest next | heap / priority queue |
| keep keys sorted with fast search | balanced BST (AVL) |
| look up by key, fastest on average | hash table |
| model connections or networks | graph |

## Key formulas

| Fact | Formula |
|---|---|
| Max nodes at level l of a binary tree | 2ˡ |
| Max nodes in a binary tree of height h | 2ʰ⁺¹ − 1 |
| Min height for n nodes | ⌈log₂(n + 1)⌉ − 1 |
| Heap/complete tree in an array (0-based) | parent (i−1)/2, children 2i+1, 2i+2 |
| AVL balance factor | height(left) − height(right) ∈ {−1, 0, 1} |
| Edges in a tree with n vertices | n − 1 |
| Sum of degrees (undirected) | 2 × edges |
| Max edges, simple undirected graph | n(n − 1) / 2 |
| Load factor of a hash table | α = n / m |
| Circular queue next index | (i + 1) % capacity |

## Sorting summary

| Algorithm | Average | Worst | Stable | In place |
|---|---|---|---|---|
| Bubble / Insertion | O(n²) | O(n²) | yes | yes |
| Selection | O(n²) | O(n²) | no | yes |
| Merge | O(n log n) | O(n log n) | yes | no |
| Quick | O(n log n) | O(n²) | no | yes |
| Heap | O(n log n) | O(n log n) | no | yes |
| Counting | O(n + k) | O(n + k) | yes | no |

## Programs to practise

1. Insert/delete at a position in an array.
2. Singly linked list: insert at head, tail and position; delete by value; reverse; find middle; detect a cycle.
3. Doubly and circular linked list insert and delete.
4. Stack using an array and a linked list; balanced brackets; infix → postfix; postfix evaluation.
5. Circular queue; queue using a linked list.
6. Binary tree traversals (recursive), height, count leaves.
7. BST insert, search, delete; check if a tree is a BST.
8. Heap insert and extract; heap sort.
9. BFS and DFS on an adjacency matrix and an adjacency list.
10. Hash table with chaining and with linear probing.
11. Linear and binary search; all six sorts.

## Theory questions to prepare

1. Classify data structures with examples; define ADT.
2. Array vs linked list.
3. Stack and queue applications; why a circular queue?
4. Convert and evaluate an expression (show the stack table).
5. Tree terminology; types of binary trees; traversals of a given tree.
6. Construct a BST / AVL tree from a key sequence; show rotations.
7. Heapify an array; trace heap sort.
8. Adjacency matrix vs list; BFS vs DFS with a traced example.
9. Hash functions and collision resolution; load factor.
10. Compare sorting algorithms (table above); define stable and in-place.

:::quiz Final check: mixed revision
Q. Which structure would you use to check for balanced parentheses?
* Stack
- Queue
- Heap
- Hash table
= Each closing bracket must match the most recent unmatched opening bracket — LIFO.

Q. What is the postorder traversal of a BST built by inserting 8, 3, 10, 1, 6?
- 1 3 6 8 10
- 8 3 1 6 10
* 1 6 3 10 8
- 10 8 6 3 1
= Left subtree (1, 6, then 3), right subtree (10), then the root 8.

Q. Which needs the array to be sorted?
- Linear search
* Binary search
- Hashing
- BFS
= Binary search relies on order to discard half the range.

Q. A max-heap's array is `[50, 40, 45, 10, 20]`. After extracting the max, what is the new root?
- 40
* 45
- 20
- 10
= 20 moves to the root and sifts down past its larger child 45.
:::
