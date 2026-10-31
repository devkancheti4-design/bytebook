=== divide-conquer | Divide and Conquer
unit: Divide and Conquer
desc: The divide, conquer, combine paradigm with full analysis of binary search, merge sort and quick sort, including quick sort's worst case and randomised pivots.

**Divide and conquer** solves a problem in three steps:

1. **Divide** the problem into smaller subproblems of the same kind.
2. **Conquer** the subproblems recursively (solve tiny ones directly).
3. **Combine** the sub-solutions into a solution for the original problem.

Its running time naturally forms a recurrence T(n) = a·T(n/b) + D(n) + C(n), where D and C are the costs of dividing and combining — tailor-made for the [Master Theorem](@daa/recurrences).

## Binary search

- Divide: compare with the middle element — O(1).
- Conquer: search **one** half.
- Combine: nothing.

T(n) = T(n/2) + O(1) → **Θ(log n)**.

## Merge sort

- Divide: split at the middle — O(1).
- Conquer: sort both halves recursively.
- Combine: merge two sorted halves — Θ(n).

T(n) = 2T(n/2) + Θ(n) → **Θ(n log n)** in every case.

```cpp run
#include <iostream>
#include <vector>
using namespace std;

long comparisons = 0;

void merge(vector<int> &a, int lo, int mid, int hi) {
    vector<int> left(a.begin() + lo, a.begin() + mid + 1), right(a.begin() + mid + 1, a.begin() + hi + 1);
    size_t i = 0, j = 0;
    int k = lo;
    while (i < left.size() && j < right.size()) {
        comparisons++;
        a[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    }
    while (i < left.size()) a[k++] = left[i++];
    while (j < right.size()) a[k++] = right[j++];
}

void mergeSort(vector<int> &a, int lo, int hi) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(a, lo, mid);
    mergeSort(a, mid + 1, hi);
    merge(a, lo, mid, hi);
}

int main() {
    vector<int> a = {38, 27, 43, 3, 9, 82, 10, 19};
    mergeSort(a, 0, (int)a.size() - 1);
    for (int x : a) cout << x << " ";
    cout << "\ncomparisons: " << comparisons << " (n log2 n = 24)" << endl;
    return 0;
}
```

:::diagram tree
tree: 38 27 43 3 9 82 10 19(38 27 43 3(38 27(38,27),43 3(43,3)),9 82 10 19(9 82(9,82),10 19(10,19)))
shape: box
caption: The divide phase of merge sort on 8 elements: log₂ 8 = 3 levels of splitting. Merging then climbs back up, doing n work per level.
:::

## Quick sort

- Divide: **partition** around a pivot — Θ(n). After partitioning, the pivot is in its final position.
- Conquer: sort the two parts recursively.
- Combine: nothing.

| Case | Partition split | Recurrence | Time |
|---|---|---|---|
| Best | always in half | T(n) = 2T(n/2) + n | Θ(n log n) |
| Worst | always 0 and n − 1 (sorted input, first/last pivot) | T(n) = T(n − 1) + n | Θ(n²) |
| Average | random splits | — | Θ(n log n), about 1.39 n log₂ n comparisons |

Even a consistently lopsided 9-to-1 split gives T(n) = T(9n/10) + T(n/10) + n = Θ(n log n). Only extreme imbalance hurts.

## Randomised quick sort

Picking the pivot **uniformly at random** makes the expected running time Θ(n log n) for **every** input — no specific input can trigger the worst case reliably.

```cpp run
#include <iostream>
#include <vector>
#include <random>
#include <algorithm>
using namespace std;

mt19937 rng(42);
long comparisons;

int partition(vector<int> &a, int lo, int hi) {           // Lomuto, pivot at a[hi]
    int pivot = a[hi], i = lo - 1;
    for (int j = lo; j < hi; j++) {
        comparisons++;
        if (a[j] < pivot) swap(a[++i], a[j]);
    }
    swap(a[i + 1], a[hi]);
    return i + 1;
}

void quickSort(vector<int> &a, int lo, int hi, bool randomPivot) {
    if (lo >= hi) return;
    if (randomPivot) swap(a[uniform_int_distribution<int>(lo, hi)(rng)], a[hi]);
    int p = partition(a, lo, hi);
    quickSort(a, lo, p - 1, randomPivot);
    quickSort(a, p + 1, hi, randomPivot);
}

int main() {
    int n = 2000;
    vector<int> sortedInput(n);
    for (int i = 0; i < n; i++) sortedInput[i] = i;

    vector<int> a = sortedInput;
    comparisons = 0; quickSort(a, 0, n - 1, false);
    cout << "last-element pivot on sorted input: " << comparisons << " comparisons (about n^2/2)" << endl;

    a = sortedInput;
    comparisons = 0; quickSort(a, 0, n - 1, true);
    cout << "random pivot on sorted input:       " << comparisons << " comparisons (about 1.39 n log2 n)" << endl;
    cout << "still sorted correctly: " << boolalpha << is_sorted(a.begin(), a.end()) << endl;
    return 0;
}
```

## Merge sort vs quick sort

| | Merge sort | Quick sort |
|---|---|---|
| Worst case | Θ(n log n) | Θ(n²) (rare with random pivots) |
| Extra space | Θ(n) | Θ(log n) stack |
| Stable | yes | no |
| Work happens in | the combine step | the divide step |
| In practice | linked lists, external sorting | arrays in memory (fast, cache-friendly) |

:::exam Write the recurrence first
For any divide-and-conquer question, write the three steps with their costs, form the recurrence, then solve it with the Master Theorem. That structure earns most of the marks.
:::

:::quiz
Q. In merge sort, which step does the real work?
- Divide
- Conquer
* Combine (merging)
- None
= Splitting is O(1); merging two sorted halves is Θ(n).

Q. What is the worst-case recurrence of quick sort?
- T(n) = 2T(n/2) + n
* T(n) = T(n − 1) + n
- T(n) = T(n/2) + 1
- T(n) = 2T(n − 1) + 1
= A pivot that is always the minimum or maximum leaves one side empty.

Q. Why use a random pivot?
* So that no particular input reliably causes Θ(n²) time
- It makes quick sort stable
- It reduces the extra space to O(1)
- It guarantees Θ(n log n) in the worst case
= The expected time is Θ(n log n) for every input, though an unlucky run is still possible.

Q. Which sort is preferred for sorting a linked list?
- Quick sort
* Merge sort
- Heap sort
- Selection sort
= Merging lists needs no extra arrays and no random access.
:::

=== dc-more | More Divide and Conquer
desc: Max–min with fewer comparisons, counting inversions with merge sort, Karatsuba's fast multiplication and Strassen's matrix multiplication.

## Finding the maximum and minimum

Finding both the max and min of n numbers naively takes 2(n − 1) comparisons. Divide and conquer does it in about **3n/2 − 2**:

- Split the array in half; find (max, min) of each half recursively.
- Combine with **two** comparisons: max of the maxes, min of the mins.

T(n) = 2T(n/2) + 2, T(2) = 1, T(1) = 0 → T(n) = 3n/2 − 2 for n a power of two.

```cpp run
#include <iostream>
#include <vector>
using namespace std;

int comps = 0;

pair<int, int> maxMin(const vector<int> &a, int lo, int hi) {
    if (lo == hi) return {a[lo], a[lo]};
    if (hi == lo + 1) {
        comps++;
        return a[lo] > a[hi] ? make_pair(a[lo], a[hi]) : make_pair(a[hi], a[lo]);
    }
    int mid = (lo + hi) / 2;
    auto [max1, min1] = maxMin(a, lo, mid);
    auto [max2, min2] = maxMin(a, mid + 1, hi);
    comps += 2;
    return {max(max1, max2), min(min1, min2)};
}

int main() {
    vector<int> a = {22, 13, -5, -8, 15, 60, 17, 31, 47, 9, 3, 50, 2, 41, 11, 28};
    auto [mx, mn] = maxMin(a, 0, (int)a.size() - 1);
    cout << "max " << mx << ", min " << mn << ", comparisons " << comps
         << " (naive: " << 2 * (a.size() - 1) << ")" << endl;
    return 0;
}
```

## Counting inversions

An **inversion** is a pair i < j with a[i] > a[j]. The count measures how "unsorted" an array is (used in ranking similarity, e.g. comparing two people's movie rankings). Checking all pairs is Θ(n²). **Piggyback on merge sort**: while merging, whenever an element from the right half is placed before remaining left-half elements, it forms an inversion with **each** of them.

```cpp run
#include <iostream>
#include <vector>
using namespace std;

long long mergeCount(vector<int> &a, int lo, int hi) {
    if (lo >= hi) return 0;
    int mid = (lo + hi) / 2;
    long long inv = mergeCount(a, lo, mid) + mergeCount(a, mid + 1, hi);
    vector<int> tmp;
    int i = lo, j = mid + 1;
    while (i <= mid && j <= hi) {
        if (a[i] <= a[j]) tmp.push_back(a[i++]);
        else { tmp.push_back(a[j++]); inv += mid - i + 1; }   // a[j] beats all remaining left elements
    }
    while (i <= mid) tmp.push_back(a[i++]);
    while (j <= hi) tmp.push_back(a[j++]);
    copy(tmp.begin(), tmp.end(), a.begin() + lo);
    return inv;
}

int main() {
    vector<int> a = {2, 4, 1, 3, 5};
    vector<int> b = {5, 4, 3, 2, 1};
    cout << "inversions in {2,4,1,3,5}: " << mergeCount(a, 0, 4) << endl;   // (2,1) (4,1) (4,3)
    cout << "inversions in {5,4,3,2,1}: " << mergeCount(b, 0, 4) << endl;   // n(n-1)/2
    return 0;
}
```

Θ(n log n) instead of Θ(n²).

## Karatsuba multiplication

Multiplying two n-digit numbers the school way takes Θ(n²) digit operations. Split each number into halves: x = a·10^m + b and y = c·10^m + d. Then

x·y = ac·10^(2m) + (ad + bc)·10^m + bd.

That needs four half-size products: T(n) = 4T(n/2) + O(n) = Θ(n²) — no gain. **Karatsuba's trick** (1960) computes the middle term with **one** extra product:

ad + bc = (a + b)(c + d) − ac − bd

So only **three** multiplications are needed: T(n) = 3T(n/2) + O(n) = **Θ(n^1.585)**.

```cpp run
#include <iostream>
#include <cmath>
using namespace std;

long long karatsuba(long long x, long long y) {
    if (x < 10 || y < 10) return x * y;
    int digits = max(to_string(x).size(), to_string(y).size());
    int m = digits / 2;
    long long p = (long long)pow(10, m);
    long long a = x / p, b = x % p, c = y / p, d = y % p;
    long long ac = karatsuba(a, c);
    long long bd = karatsuba(b, d);
    long long mid = karatsuba(a + b, c + d) - ac - bd;     // = ad + bc with one multiplication
    return ac * p * p + mid * p + bd;
}

int main() {
    long long x = 12345678, y = 87654321;
    cout << karatsuba(x, y) << endl;
    cout << x * y << " (built-in, for comparison)" << endl;
    return 0;
}
```

## Strassen's matrix multiplication

Ordinary multiplication of two n × n matrices takes Θ(n³). Splitting each matrix into four (n/2) × (n/2) blocks gives 8 block multiplications: T(n) = 8T(n/2) + Θ(n²) = Θ(n³).

**Strassen** (1969) found a way to combine the blocks using only **7** multiplications (and 18 additions/subtractions):

| Product | Formula |
|---|---|
| M₁ | (A₁₁ + A₂₂)(B₁₁ + B₂₂) |
| M₂ | (A₂₁ + A₂₂)B₁₁ |
| M₃ | A₁₁(B₁₂ − B₂₂) |
| M₄ | A₂₂(B₂₁ − B₁₁) |
| M₅ | (A₁₁ + A₁₂)B₂₂ |
| M₆ | (A₂₁ − A₁₁)(B₁₁ + B₁₂) |
| M₇ | (A₁₂ − A₂₂)(B₂₁ + B₂₂) |

C₁₁ = M₁ + M₄ − M₅ + M₇, C₁₂ = M₃ + M₅, C₂₁ = M₂ + M₄, C₂₂ = M₁ − M₂ + M₃ + M₆.

T(n) = 7T(n/2) + Θ(n²) = **Θ(n^log₂7) ≈ Θ(n^2.81)**.

```cpp run
#include <iostream>
using namespace std;

int main() {      // Strassen's seven products on 2x2 matrices of numbers
    int a11 = 1, a12 = 3, a21 = 7, a22 = 5;
    int b11 = 6, b12 = 8, b21 = 4, b22 = 2;
    int m1 = (a11 + a22) * (b11 + b22), m2 = (a21 + a22) * b11, m3 = a11 * (b12 - b22);
    int m4 = a22 * (b21 - b11), m5 = (a11 + a12) * b22, m6 = (a21 - a11) * (b11 + b12);
    int m7 = (a12 - a22) * (b21 + b22);
    cout << "Strassen: " << m1 + m4 - m5 + m7 << " " << m3 + m5 << " / " << m2 + m4 << " " << m1 - m2 + m3 + m6 << endl;
    cout << "Normal:   " << a11 * b11 + a12 * b21 << " " << a11 * b12 + a12 * b22 << " / "
         << a21 * b11 + a22 * b21 << " " << a21 * b12 + a22 * b22 << endl;
    return 0;
}
```

:::note Other divide-and-conquer classics
**Closest pair of points** in Θ(n log n), **fast Fourier transform** (FFT) for polynomial multiplication in Θ(n log n), and the **median-of-medians** selection algorithm that finds the k-th smallest element in worst-case Θ(n).
:::

:::quiz
Q. How many comparisons does divide-and-conquer max–min use for n = 16?
- 30
* 22
- 16
- 8
= 3n/2 − 2 = 24 − 2 = 22.

Q. How many inversions does `[3, 1, 2]` have?
- 0
- 1
* 2
- 3
= The pairs (3, 1) and (3, 2).

Q. What is the running time of Karatsuba multiplication?
- Θ(n²)
* Θ(n^log₂3) ≈ Θ(n^1.585)
- Θ(n log n)
- Θ(n³)
= T(n) = 3T(n/2) + O(n).

Q. How many recursive multiplications does Strassen's algorithm use per level?
- 8
* 7
- 6
- 4
= Seven products instead of eight gives T(n) = 7T(n/2) + Θ(n²).
:::
