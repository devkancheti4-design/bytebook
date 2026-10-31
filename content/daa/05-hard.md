=== backtracking | Backtracking
unit: Search, Graphs & Complexity
desc: Explore a state-space tree and abandon dead ends early: the N-Queens problem, subset sum, graph colouring and Hamiltonian cycles.

**Backtracking** builds a solution **one choice at a time**. After each choice it checks whether the partial solution can still lead to a valid answer; if not, it **undoes the last choice** (backtracks) and tries the next option. It is a depth-first search of the **state-space tree** with **pruning**.

```pseudo
BACKTRACK(partial)
    if partial is a complete solution: report it
    for each choice c that can extend partial
        if c keeps partial valid:        // the pruning test
            add c
            BACKTRACK(partial)
            remove c                     // undo: backtrack
```

## N-Queens

Place N queens on an N × N chessboard so that no two attack each other (same row, column or diagonal). Place one queen per row; for each row, try every column that is safe.

:::widget n-queens
:::

```cpp run
#include <iostream>
#include <vector>
using namespace std;

int n, solutions = 0, nodes = 0;
vector<int> col;                               // col[r] = column of the queen in row r

bool safe(int r, int c) {
    for (int i = 0; i < r; i++)
        if (col[i] == c || abs(col[i] - c) == r - i) return false;   // same column or diagonal
    return true;
}

void place(int r) {
    nodes++;
    if (r == n) {
        if (++solutions == 1) {                 // print the first solution as a board
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) cout << (col[i] == j ? "Q " : ". ");
                cout << endl;
            }
        }
        return;
    }
    for (int c = 0; c < n; c++)
        if (safe(r, c)) { col[r] = c; place(r + 1); }       // choose, explore (undo is implicit)
}

int main() {
    for (n = 4; n <= 8; n += 4) {
        col.assign(n, -1); solutions = 0; nodes = 0;
        place(0);
        cout << n << "-queens: " << solutions << " solutions, " << nodes << " nodes explored" << endl << endl;
    }
    return 0;
}
```

Without pruning there would be 8⁸ ≈ 16.7 million placements for N = 8; backtracking explores about two thousand nodes.

## Subset sum

Given positive integers and a target, find subsets that add up exactly to the target. For each number, branch on **include** or **exclude**; prune when the sum exceeds the target or the remaining numbers cannot reach it.

```cpp run
#include <iostream>
#include <vector>
using namespace std;

vector<int> w = {3, 5, 6, 7};
int target = 15;
vector<int> chosen;

void subsetSum(int i, int sum, int remaining) {
    if (sum == target) {
        cout << "{";
        for (size_t k = 0; k < chosen.size(); k++) cout << (k ? ", " : "") << chosen[k];
        cout << "}" << endl;
        return;
    }
    if (i == (int)w.size() || sum + remaining < target || sum > target) return;   // prune
    chosen.push_back(w[i]);
    subsetSum(i + 1, sum + w[i], remaining - w[i]);          // include w[i]
    chosen.pop_back();
    subsetSum(i + 1, sum, remaining - w[i]);                 // exclude w[i]
}

int main() {
    subsetSum(0, 0, 3 + 5 + 6 + 7);
    return 0;
}
```

## Graph colouring

Colour the vertices with at most m colours so that no two adjacent vertices share a colour. Try colours for each vertex in turn, backtracking on conflicts.

```cpp run
#include <iostream>
#include <vector>
using namespace std;

int V = 5, m = 3;
int adj[5][5] = {{0,1,1,1,0},{1,0,1,0,1},{1,1,0,1,1},{1,0,1,0,1},{0,1,1,1,0}};
vector<int> colour(5, 0);

bool ok(int v, int c) {
    for (int u = 0; u < V; u++) if (adj[v][u] && colour[u] == c) return false;
    return true;
}

bool solve(int v) {
    if (v == V) return true;
    for (int c = 1; c <= m; c++)
        if (ok(v, c)) {
            colour[v] = c;
            if (solve(v + 1)) return true;
            colour[v] = 0;                     // backtrack
        }
    return false;
}

int main() {
    const char *names[] = {"red", "green", "blue"};
    if (solve(0)) for (int v = 0; v < V; v++) cout << "vertex " << v << ": " << names[colour[v] - 1] << endl;
    else cout << "not colourable with " << m << " colours" << endl;
    return 0;
}
```

The smallest m that works is the graph's **chromatic number**. Deciding whether a graph is 3-colourable is NP-complete.

## Hamiltonian cycle

A **Hamiltonian cycle** visits every vertex exactly once and returns to the start. Backtracking extends a path one unvisited neighbour at a time and backtracks at dead ends. No polynomial algorithm is known; it is NP-complete.

| Problem | Choice at each level | Pruning test |
|---|---|---|
| N-Queens | column for the next row | no attack |
| Subset sum | include / exclude next number | sum too big, or cannot reach target |
| Graph colouring | colour for the next vertex | no neighbour has that colour |
| Hamiltonian cycle | next vertex on the path | adjacent and unvisited |
| Sudoku | digit for the next empty cell | row, column and box rules |

:::quiz
Q. What does backtracking do when a partial solution cannot lead to a valid answer?
- Restarts from scratch
* Undoes the last choice and tries the next option
- Accepts it anyway
- Switches to a greedy choice
= Abandoning dead branches early is what makes backtracking efficient.

Q. How many solutions does the 4-Queens problem have?
- 1
* 2
- 4
- 0
= Two mirror-image solutions.

Q. Which subsets of {3, 5, 6, 7} sum to 15?
* {3, 5, 7}
- {5, 6} and {3, 5, 7}
- {6, 7}
- None
= 3 + 5 + 7 = 15 is the only one.

Q. Backtracking explores the state-space tree in which order?
- Breadth-first
* Depth-first
- By lowest cost first
- Randomly
= It goes deep along one partial solution before trying alternatives.
:::

=== branch-bound | Branch and Bound
desc: Optimisation by bounding: FIFO, LIFO and least-cost branch and bound, solving 0/1 knapsack with an upper bound, and the travelling salesperson problem.

**Branch and bound (B&B)** is used for **optimisation** problems (find the best solution, not all solutions). Like backtracking, it explores a state-space tree, but at every node it computes a **bound** — the best value any solution in that subtree could possibly achieve. If the bound is no better than the best complete solution found so far, the whole subtree is **pruned**.

| | Backtracking | Branch and bound |
|---|---|---|
| Problem type | decision / find all solutions | optimisation |
| Search order | depth-first | FIFO (BFS), LIFO (DFS) or **least-cost** (best-first) |
| Pruning | when a constraint fails | when the bound cannot beat the best so far |
| Examples | N-Queens, Sudoku | 0/1 knapsack, TSP, job assignment |

## Search strategies

- **FIFO B&B** — live nodes in a queue (breadth-first).
- **LIFO B&B** — live nodes in a stack (depth-first).
- **Least-cost (LC) B&B** — live nodes in a priority queue, always expanding the most **promising** node first. Usually the fastest to reach the optimum.

## 0/1 knapsack with B&B

At each node, decide whether to include the next item. The **upper bound** of a node is its current value plus the value obtainable by filling the remaining capacity **fractionally** with the remaining items (sorted by value/weight). Since the fractional relaxation is never worse than the real 0/1 answer, it is a valid optimistic bound.

```cpp run
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

struct Item { int w, v; };
struct Node { int level, value, weight; double bound; };
vector<Item> items;
int W;

double bound(const Node &u) {
    if (u.weight >= W) return 0;
    double b = u.value;
    int w = u.weight, j = u.level + 1;
    for (; j < (int)items.size() && w + items[j].w <= W; j++) { w += items[j].w; b += items[j].v; }
    if (j < (int)items.size()) b += (W - w) * (double)items[j].v / items[j].w;   // fractional fill
    return b;
}

int main() {
    items = {{2, 40}, {5, 30}, {10, 50}, {5, 10}};   // (weight, value)
    W = 16;
    sort(items.begin(), items.end(), [](Item a, Item b) { return a.v * b.w > b.v * a.w; });
    auto cmp = [](const Node &a, const Node &b) { return a.bound < b.bound; };
    priority_queue<Node, vector<Node>, decltype(cmp)> pq(cmp);   // least-cost: largest bound first
    Node root{-1, 0, 0, 0};
    root.bound = bound(root);
    pq.push(root);
    int best = 0, expanded = 0;
    while (!pq.empty()) {
        Node u = pq.top(); pq.pop();
        if (u.bound <= best || u.level == (int)items.size() - 1) continue;   // prune
        expanded++;
        Node take{u.level + 1, u.value + items[u.level + 1].v, u.weight + items[u.level + 1].w, 0};
        if (take.weight <= W && take.value > best) best = take.value;
        take.bound = bound(take);
        if (take.weight <= W && take.bound > best) pq.push(take);
        Node skip{u.level + 1, u.value, u.weight, 0};
        skip.bound = bound(skip);
        if (skip.bound > best) pq.push(skip);
    }
    cout << "best value = " << best << " (nodes expanded: " << expanded << ")" << endl;
    return 0;
}
```

## Travelling salesperson problem (TSP)

Visit every city exactly once and return home with the **minimum** total distance. Brute force checks (n − 1)! tours. B&B builds tours city by city and bounds each partial tour with a **lower bound** — for example, the cost so far plus, for every unvisited city, half the sum of its two cheapest edges, or the reduced-cost-matrix bound used in many textbooks. Partial tours whose bound already exceeds the best tour found are pruned.

TSP is **NP-hard**: B&B makes it practical for moderate sizes, but no polynomial algorithm is known. A DP solution (Held–Karp) runs in O(n² · 2ⁿ), far better than O(n!).

```cpp run
#include <iostream>
#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

int n = 4;
int dist[4][4] = {{0, 10, 15, 20}, {10, 0, 35, 25}, {15, 35, 0, 30}, {20, 25, 30, 0}};
int best = INT_MAX;
vector<int> path, bestPath;
vector<bool> used(4, false);

void tsp(int city, int cost) {
    if (cost >= best) return;                         // bound: cannot beat the best tour
    if ((int)path.size() == n) {
        if (cost + dist[city][0] < best) { best = cost + dist[city][0]; bestPath = path; }
        return;
    }
    for (int next = 0; next < n; next++)
        if (!used[next]) {
            used[next] = true; path.push_back(next);
            tsp(next, cost + dist[city][next]);
            used[next] = false; path.pop_back();
        }
}

int main() {
    used[0] = true; path = {0};
    tsp(0, 0);
    cout << "shortest tour: " << best << " via";
    for (int c : bestPath) cout << " " << c;
    cout << " 0" << endl;
    return 0;
}
```

:::quiz
Q. When does branch and bound prune a node?
* When its bound cannot improve on the best solution found so far
- When it reaches a leaf
- When the node has more than two children
- Never; it explores the whole tree
= The bound is an optimistic estimate; if even that is not better, the subtree is useless.

Q. Which live-node structure does least-cost B&B use?
- Queue
- Stack
* Priority queue
- Hash table
= It always expands the node with the most promising bound.

Q. In knapsack B&B, the upper bound is computed using...
- the 0/1 solution of the remaining items
* a fractional (greedy) fill of the remaining capacity
- the number of items left
- the lightest remaining item
= The fractional relaxation is never worse than any real 0/1 completion.

Q. What is the brute-force complexity of TSP on n cities?
- O(n²)
- O(2ⁿ)
* O(n!)
- O(n log n)
= There are (n − 1)! possible tours from a fixed start.
:::

=== graph-algorithms | Topological Sort & Connectivity
desc: Order tasks with dependencies using Kahn's algorithm and DFS, find connected and strongly connected components, and detect cycles in directed graphs.

## Topological sort

A **topological order** of a directed acyclic graph (DAG) lists the vertices so that **every edge u → v has u before v**. It answers "in what order can I do these tasks?" — course prerequisites, build systems, spreadsheet recalculation, package installation.

:::diagram graph
nodes: C1(0,0) C2(0,1.4) DS(1.6,0.7) DM(1.6,2) OOP(3.2,0) DAA(3.2,1.4)
edges: C1>DS C2>DS DS>DAA DM>DAA C1>OOP DS>OOP
caption: Course prerequisites as a DAG. Any topological order is a valid study plan.
:::

### Kahn's algorithm (BFS)

Repeatedly output a vertex with **in-degree 0** (no remaining prerequisites) and remove its outgoing edges.

```cpp run
#include <iostream>
#include <vector>
#include <queue>
#include <string>
using namespace std;

int main() {
    vector<string> name = {"C1", "C2", "DS", "DM", "OOP", "DAA"};
    vector<vector<int>> adj(6);
    int edges[][2] = {{0, 2}, {1, 2}, {2, 5}, {3, 5}, {0, 4}, {2, 4}};
    vector<int> indeg(6, 0);
    for (auto &e : edges) { adj[e[0]].push_back(e[1]); indeg[e[1]]++; }

    queue<int> q;
    for (int v = 0; v < 6; v++) if (indeg[v] == 0) q.push(v);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
    }
    if (order.size() < 6) cout << "cycle detected: no topological order" << endl;
    else { cout << "study order:"; for (int v : order) cout << " " << name[v]; cout << endl; }
    return 0;
}
```

If some vertices never reach in-degree 0, the graph has a **cycle** and no topological order exists. Time **O(V + E)**.

### DFS-based topological sort

Run DFS; when a vertex **finishes** (all its descendants are done), push it onto a stack. Reading the stack top-down gives a topological order.

```cpp run
#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<vector<int>> adj(6);
vector<int> state(6, 0);                 // 0 = new, 1 = on the current path, 2 = finished
vector<int> finishOrder;
bool cycle = false;

void dfs(int u) {
    state[u] = 1;
    for (int v : adj[u]) {
        if (state[v] == 1) cycle = true;            // back edge: a directed cycle
        else if (state[v] == 0) dfs(v);
    }
    state[u] = 2;
    finishOrder.push_back(u);
}

int main() {
    vector<string> name = {"C1", "C2", "DS", "DM", "OOP", "DAA"};
    int edges[][2] = {{0, 2}, {1, 2}, {2, 5}, {3, 5}, {0, 4}, {2, 4}};
    for (auto &e : edges) adj[e[0]].push_back(e[1]);
    for (int v = 0; v < 6; v++) if (state[v] == 0) dfs(v);
    cout << "topological order:";
    for (int i = (int)finishOrder.size() - 1; i >= 0; i--) cout << " " << name[finishOrder[i]];
    cout << "\ncycle: " << (cycle ? "yes" : "no") << endl;
    return 0;
}
```

The three DFS states also detect cycles in directed graphs: reaching a vertex that is still **on the current path** (state 1) means a back edge, hence a cycle.

## Connected components

In an **undirected** graph, run BFS or DFS from each unvisited vertex; each run discovers one **connected component**. O(V + E).

## Strongly connected components

In a **directed** graph, a **strongly connected component (SCC)** is a maximal set of vertices where every vertex can reach every other. **Kosaraju's algorithm** finds all SCCs in O(V + E):

1. Run DFS on the graph and record vertices by finish time.
2. Reverse every edge.
3. Run DFS on the reversed graph in **decreasing** finish order; each tree found is one SCC.

```cpp run
#include <iostream>
#include <vector>
using namespace std;

int V = 6;
vector<vector<int>> g(V), rg(V);
vector<bool> seen;
vector<int> order, comp;

void dfs1(int u) { seen[u] = true; for (int v : g[u]) if (!seen[v]) dfs1(v); order.push_back(u); }
void dfs2(int u) { seen[u] = true; comp.push_back(u); for (int v : rg[u]) if (!seen[v]) dfs2(v); }

int main() {
    int edges[][2] = {{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 4}, {4, 5}, {5, 3}};
    for (auto &e : edges) { g[e[0]].push_back(e[1]); rg[e[1]].push_back(e[0]); }
    seen.assign(V, false);
    for (int v = 0; v < V; v++) if (!seen[v]) dfs1(v);
    seen.assign(V, false);
    for (int i = V - 1; i >= 0; i--)
        if (!seen[order[i]]) {
            comp.clear();
            dfs2(order[i]);
            cout << "SCC:";
            for (int v : comp) cout << " " << v;
            cout << endl;
        }
    return 0;
}
```

:::quiz
Q. Which graphs have a topological order?
- All directed graphs
* Exactly the directed acyclic graphs (DAGs)
- Undirected trees
- Complete graphs
= A cycle makes it impossible to put every vertex before its successors.

Q. In Kahn's algorithm, which vertices are output first?
* Vertices with in-degree 0
- Vertices with the most edges
- The vertex with the smallest label
- Leaves of the DFS tree
= A vertex with no incoming edges has no unmet prerequisites.

Q. In DFS on a directed graph, reaching a vertex that is still on the current recursion path means...
- The graph is disconnected
* There is a cycle
- The graph is a tree
- Nothing special
= That is a back edge, which closes a directed cycle.

Q. What is the time complexity of Kosaraju's SCC algorithm?
- O(V²)
* O(V + E)
- O(V³)
- O(E log V)
= Two depth-first searches and an edge reversal, all linear.
:::

=== string-matching | String Matching
desc: Find a pattern in a text: the naive algorithm, Rabin–Karp's rolling hash, and the Knuth–Morris–Pratt algorithm with its prefix function — with complexities.

Given a **text** T of length n and a **pattern** P of length m, find every position where P occurs in T. This runs every time you press Ctrl+F, search DNA databases, or filter spam.

## Naive algorithm

Try every alignment of P against T and compare character by character.

```cpp run
#include <iostream>
#include <string>
using namespace std;

int main() {
    string T = "AABAACAADAABAABA", P = "AABA";
    int comparisons = 0;
    for (size_t s = 0; s + P.size() <= T.size(); s++) {
        size_t j = 0;
        while (j < P.size()) { comparisons++; if (T[s + j] != P[j]) break; j++; }
        if (j == P.size()) cout << "match at " << s << endl;
    }
    cout << "comparisons: " << comparisons << endl;
    return 0;
}
```

Worst case **O((n − m + 1) · m)**, e.g. T = "aaaa…a", P = "aaab".

## Rabin–Karp

Compare **hash values** first, and only compare characters when the hashes match. The trick is a **rolling hash**: the hash of the next window is computed from the previous one in O(1) by removing the leading character and adding the trailing one.

```cpp run
#include <iostream>
#include <string>
using namespace std;

int main() {
    string T = "31415926535897932384626", P = "26";
    const long long base = 10, mod = 13;
    int n = T.size(), m = P.size();
    long long h = 1;                                   // base^(m-1) % mod
    for (int i = 0; i < m - 1; i++) h = h * base % mod;
    long long hp = 0, ht = 0;
    for (int i = 0; i < m; i++) { hp = (hp * base + (P[i] - '0')) % mod; ht = (ht * base + (T[i] - '0')) % mod; }
    int spurious = 0;
    for (int s = 0; s + m <= n; s++) {
        if (hp == ht) {
            if (T.compare(s, m, P) == 0) cout << "match at " << s << endl;
            else spurious++;                                 // hash collision
        }
        if (s + m < n) ht = ((ht - (T[s] - '0') * h % mod + mod) * base + (T[s + m] - '0')) % mod;   // roll
    }
    cout << "spurious hits: " << spurious << endl;
    return 0;
}
```

Expected time **O(n + m)**; worst case O(nm) if many hashes collide (a "spurious hit"). Rabin–Karp shines when searching for **many patterns** at once.

## Knuth–Morris–Pratt (KMP)

When a mismatch happens, the naive algorithm slides the pattern by one and re-checks characters it has already seen. KMP **never moves backwards in the text**. It precomputes the **prefix function** π (also called the LPS array): π[q] = the length of the longest proper prefix of P[0..q] that is also a suffix of it. On a mismatch, it shifts the pattern so that this already-matched prefix lines up.

For P = "ABABCABAB": π = [0, 0, 1, 2, 0, 1, 2, 3, 4].

```cpp run
#include <iostream>
#include <string>
#include <vector>
using namespace std;

vector<int> prefixFunction(const string &P) {
    vector<int> pi(P.size(), 0);
    for (size_t q = 1, k = 0; q < P.size(); q++) {
        while (k > 0 && P[k] != P[q]) k = pi[k - 1];     // fall back to a shorter border
        if (P[k] == P[q]) k++;
        pi[q] = k;
    }
    return pi;
}

int main() {
    string T = "ABABDABACDABABCABABABABCABAB", P = "ABABCABAB";
    vector<int> pi = prefixFunction(P);
    cout << "pi:";
    for (int x : pi) cout << " " << x;
    cout << endl;
    for (size_t i = 0, q = 0; i < T.size(); i++) {
        while (q > 0 && P[q] != T[i]) q = pi[q - 1];
        if (P[q] == T[i]) q++;
        if (q == P.size()) { cout << "match at " << i - P.size() + 1 << endl; q = pi[q - 1]; }
    }
    return 0;
}
```

Preprocessing O(m) + matching O(n) = **O(n + m)** in the worst case.

| Algorithm | Preprocessing | Matching (worst) | Idea |
|---|---|---|---|
| Naive | none | O((n − m + 1)m) | try every shift |
| Rabin–Karp | O(m) | O((n − m + 1)m), expected O(n + m) | rolling hash |
| KMP | O(m) | **O(n)** | prefix function, never backtrack in T |
| Finite automaton | O(m·|Σ|) | O(n) | build a DFA for P |

:::quiz
Q. What is the worst-case time of the naive matcher?
- O(n)
* O((n − m + 1) · m)
- O(n log m)
- O(m)
= Every one of the n − m + 1 shifts may compare up to m characters.

Q. What is a spurious hit in Rabin–Karp?
* The hashes match but the strings do not
- The strings match but the hashes do not
- The pattern is longer than the text
- The text contains no digits
= Different strings can share a hash value modulo q.

Q. What is the prefix function of "AAAA"?
- [0, 0, 0, 0]
* [0, 1, 2, 3]
- [1, 2, 3, 4]
- [0, 1, 1, 1]
= For each prefix, the longest proper border grows by one.

Q. Why is KMP O(n + m) in the worst case?
- It uses hashing
* It never re-examines text characters after a mismatch
- It sorts the text first
- It only works on binary strings
= The text pointer only moves forward; the prefix function decides the pattern shift.
:::

=== np-completeness | P, NP, NP-Complete & NP-Hard
desc: Tractable and intractable problems: decision problems, the classes P and NP, polynomial-time reductions, NP-complete and NP-hard problems, Cook's theorem, and coping with hardness.

Some problems are solved in polynomial time — sorting, shortest paths, MST. Others, like TSP, 0/1 knapsack and graph colouring, have resisted every attempt for decades. Complexity theory explains this difference.

## Decision problems

Complexity classes are defined for **decision problems**, whose answer is yes or no. Optimisation problems have decision versions: "Is there a tour of length **≤ k**?" instead of "What is the shortest tour?". If you can solve one quickly, you can usually solve the other.

## The class P

**P** = decision problems that can be **solved** in polynomial time, O(nᵏ) for some constant k. These are considered **tractable**.

Examples: sorting, searching, shortest paths, MST, matching, primality testing (AKS, 2002).

## The class NP

**NP** (nondeterministic polynomial) = decision problems whose **yes**-answers can be **verified** in polynomial time, given a suitable certificate (a proposed solution).

Example — SUBSET-SUM: "Do some of these numbers add up to 15?" Finding a subset may be hard, but **checking** a proposed subset is easy: add it up.

Every problem in P is also in NP (if you can solve it, you can verify it), so **P ⊆ NP**.

## Reductions

Problem A **reduces** to problem B (A ≤ₚ B) if any instance of A can be transformed in polynomial time into an instance of B with the same answer. Then B is **at least as hard as** A: a fast algorithm for B would give a fast algorithm for A.

## NP-complete and NP-hard

- **NP-hard**: every problem in NP reduces to it. It is at least as hard as anything in NP (it need not be in NP itself, and need not be a decision problem).
- **NP-complete (NPC)**: NP-hard **and** in NP — the hardest problems inside NP.

**Cook–Levin theorem (1971)**: **SAT** (Boolean satisfiability) is NP-complete. It was the first. To show a new problem X is NP-complete:

1. Show X ∈ NP (a certificate can be checked in polynomial time).
2. Reduce a **known** NP-complete problem to X.

:::diagram tree
tree: SAT(3-SAT(Clique(Vertex cover(Hamiltonian cycle(TSP))),3-colouring,Subset sum(0/1 Knapsack)))
shape: box
caption: Classic chain of reductions from SAT. Each problem is NP-complete (the TSP and knapsack decision versions included).
:::

## Famous NP-complete problems

| Problem | Question |
|---|---|
| SAT / 3-SAT | Can the Boolean formula be made true? |
| Clique | Does the graph contain k mutually adjacent vertices? |
| Vertex cover | Can k vertices touch every edge? |
| Independent set | Are there k pairwise non-adjacent vertices? |
| Hamiltonian cycle | Is there a cycle through every vertex exactly once? |
| TSP (decision) | Is there a tour of length ≤ k? |
| Graph k-colouring (k ≥ 3) | Can the graph be coloured with k colours? |
| Subset sum, 0/1 knapsack (decision) | Is there a subset with the required sum/value? |

## P vs NP

Nobody knows whether **P = NP**. If any single NP-complete problem had a polynomial algorithm, **every** NP problem would — so P would equal NP. Most researchers believe P ≠ NP. It is one of the seven Millennium Prize Problems (US $1 million prize).

<figure class="diagram"><svg class="dg" viewBox="0 0 500 236" width="500" height="236" role="img" aria-label="P sits inside NP; NP-complete is the overlap of NP and NP-hard">
<ellipse cx="335" cy="118" rx="150" ry="104" style="fill:var(--warn-soft);stroke:var(--warn);stroke-width:1.6"/>
<ellipse cx="160" cy="118" rx="140" ry="96" style="fill:var(--info-soft);fill-opacity:.75;stroke:var(--info);stroke-width:1.6"/>
<ellipse cx="100" cy="128" rx="58" ry="46" style="fill:var(--good-soft);stroke:var(--good);stroke-width:1.6"/>
<text class="t lbl" x="100" y="128">P</text>
<text class="t lbl" x="160" y="44">NP</text>
<text class="t lbl" x="410" y="118">NP-hard</text>
<text class="s" x="246" y="110" style="font-weight:650;fill:var(--ink)">NP-</text>
<text class="s" x="246" y="127" style="font-weight:650;fill:var(--ink)">complete</text>
</svg><figcaption>The picture if P ≠ NP: P sits inside NP, and the NP-complete problems are where NP overlaps NP-hard, outside P.</figcaption></figure>

## Coping with NP-hard problems

1. **Exact but exponential**: backtracking, branch and bound, DP (fine for small n).
2. **Approximation algorithms** with guaranteed ratios: e.g. a 2-approximation for vertex cover; for metric TSP, the MST-based tour is at most 2 × optimal.
3. **Heuristics**: greedy, local search, simulated annealing, genetic algorithms — good answers quickly, no guarantee.
4. **Special cases**: 2-SAT and 2-colouring are in P; knapsack with small W uses the O(nW) DP.

:::exam Definitions to learn word for word
**P**: solvable in polynomial time. **NP**: verifiable in polynomial time. **NP-hard**: every NP problem reduces to it in polynomial time. **NP-complete**: in NP and NP-hard. Then give one example of each.
:::

:::quiz
Q. What does it mean for a problem to be in NP?
- It cannot be solved in polynomial time
* A proposed yes-solution can be verified in polynomial time
- It is not a decision problem
- It needs exponential space
= NP is about efficient verification, not efficient solving.

Q. Which was the first problem proved NP-complete?
* SAT (Cook–Levin theorem)
- TSP
- Sorting
- Graph colouring
= Cook (1971) and Levin independently showed SAT is NP-complete.

Q. To prove X is NP-complete, you reduce...
- X to a problem in P
* a known NP-complete problem to X, and show X is in NP
- X to sorting
- nothing; it is enough to find a slow algorithm
= The reduction shows X is at least as hard as a known NPC problem.

Q. If someone found a polynomial algorithm for 3-SAT, what would follow?
- Only 3-SAT becomes easy
* P = NP: every NP problem would be solvable in polynomial time
- Nothing, because 3-SAT is in P already
- Sorting would become faster
= Every NP problem reduces to 3-SAT, so all of NP would collapse into P.
:::

=== cheatsheet | Algorithms Cheat Sheet
desc: Design and Analysis of Algorithms on one page: notations, recurrences, the Master Theorem, every algorithm's complexity, technique selection and exam favourites.

## Asymptotic notations

| Notation | Definition (for n ≥ n₀) | Meaning |
|---|---|---|
| f = O(g) | f(n) ≤ c·g(n) | upper bound |
| f = Ω(g) | f(n) ≥ c·g(n) | lower bound |
| f = Θ(g) | c₁·g(n) ≤ f(n) ≤ c₂·g(n) | tight bound |
| f = o(g) | f/g → 0 | strictly smaller |
| f = ω(g) | f/g → ∞ | strictly larger |

Growth: 1 < log n < √n < n < n log n < n² < n³ < 2ⁿ < n! < nⁿ

## Master Theorem: T(n) = aT(n/b) + f(n)

| Compare f(n) with n^(log_b a) | Result |
|---|---|
| f smaller by a polynomial factor | Θ(n^(log_b a)) |
| f equal (up to logᵏ) | Θ(n^(log_b a) · log n) |
| f larger by a polynomial factor (+ regularity) | Θ(f(n)) |

## Common recurrences

| Recurrence | Solution | Example |
|---|---|---|
| T(n) = T(n/2) + 1 | Θ(log n) | binary search |
| T(n) = 2T(n/2) + n | Θ(n log n) | merge sort |
| T(n) = T(n − 1) + n | Θ(n²) | quick sort worst case |
| T(n) = 2T(n − 1) + 1 | Θ(2ⁿ) | Tower of Hanoi |
| T(n) = 3T(n/2) + n | Θ(n^1.585) | Karatsuba |
| T(n) = 7T(n/2) + n² | Θ(n^2.81) | Strassen |

## Algorithm complexities

| Algorithm | Technique | Time |
|---|---|---|
| Binary search | D&C | O(log n) |
| Merge sort | D&C | O(n log n) |
| Quick sort | D&C | O(n log n) avg, O(n²) worst |
| Heap sort | heap | O(n log n) |
| Activity selection | greedy | O(n log n) |
| Fractional knapsack | greedy | O(n log n) |
| Huffman coding | greedy | O(n log n) |
| Kruskal | greedy + union-find | O(E log E) |
| Prim | greedy + heap | O(E log V) |
| Dijkstra | greedy + heap | O((V + E) log V) |
| Bellman–Ford | DP | O(VE) |
| Floyd–Warshall | DP | O(V³) |
| 0/1 knapsack | DP | O(nW) |
| LCS | DP | O(mn) |
| Matrix chain | DP | O(n³) |
| BFS / DFS / topological sort | traversal | O(V + E) |
| N-Queens, subset sum | backtracking | exponential |
| KMP | string matching | O(n + m) |

## Which technique?

| Clue in the problem | Try |
|---|---|
| split in halves, combine answers | divide and conquer |
| locally best choice is provably safe | greedy |
| overlapping subproblems, "count the ways", "minimum/maximum of" | dynamic programming |
| find all arrangements, satisfy constraints | backtracking |
| optimise over an exponential search space | branch and bound |
| problem is NP-hard and n is large | approximation or heuristics |

## Exam favourites

1. Define algorithm; properties; loop invariant for insertion sort.
2. Prove 3n² + 2n = Θ(n²) by finding c₁, c₂, n₀.
3. Solve recurrences with the Master Theorem and recursion trees.
4. Trace merge sort and quick sort partition; best/worst cases.
5. Activity selection, fractional knapsack, job sequencing tables.
6. Huffman tree and codes; average code length.
7. Kruskal and Prim on a given graph; Dijkstra table.
8. 0/1 knapsack, LCS and matrix-chain tables with traceback.
9. Floyd–Warshall matrices D⁰ … Dⁿ.
10. N-Queens state-space tree; subset sum.
11. KMP prefix function for a pattern.
12. P, NP, NP-complete, NP-hard with examples; Cook's theorem.

:::quiz Final check: mixed revision
Q. Solve T(n) = 2T(n/2) + n log n.
- Θ(n log n)
* Θ(n log² n)
- Θ(n²)
- Θ(n)
= Extended case 2 of the Master Theorem with k = 1.

Q. Which algorithm finds a minimum spanning tree?
- Dijkstra
* Kruskal
- Bellman–Ford
- KMP
= Kruskal and Prim find MSTs; Dijkstra and Bellman–Ford find shortest paths.

Q. Which technique does the LCS algorithm use?
- Greedy
- Divide and conquer
* Dynamic programming
- Backtracking
= Overlapping subproblems L[i][j] are stored in a table.

Q. A problem that is in NP and to which every NP problem reduces is...
- in P
- NP-hard only
* NP-complete
- undecidable
= NP-complete = NP-hard and in NP.
:::
