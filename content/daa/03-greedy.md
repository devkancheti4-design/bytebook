=== greedy | The Greedy Method
unit: Greedy Algorithms
desc: Make the locally best choice at every step: the greedy-choice property, activity selection, fractional knapsack, job sequencing with deadlines, and when greedy fails.

A **greedy algorithm** builds a solution step by step, always making the choice that looks **best right now**, and never reconsidering it. Greedy algorithms are simple and fast — but they are only correct for problems with two properties:

1. **Greedy-choice property** — a globally optimal solution can be reached by making a locally optimal choice.
2. **Optimal substructure** — an optimal solution contains optimal solutions to its subproblems.

## When greedy fails

Give change for 6 using coins {1, 3, 4}. Greedy takes the largest coin first: 4 + 1 + 1 = **3 coins**. But 3 + 3 = **2 coins**. Greedy is wrong here — that problem needs [dynamic programming](@daa/dp-intro). With Indian currency denominations (1, 2, 5, 10, 20, 50 …), greedy happens to be optimal.

## Activity selection

Given activities with start and finish times, choose the **maximum number of non-overlapping** activities (one room, many meetings).

**Greedy rule:** sort by **finish time** and repeatedly pick the activity that finishes earliest among those compatible with what you already picked. Finishing early leaves the most room for the rest.

```cpp run
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Activity { char name; int start, finish; };

int main() {
    vector<Activity> acts = {{'A', 1, 4}, {'B', 3, 5}, {'C', 0, 6}, {'D', 5, 7}, {'E', 3, 9},
                             {'F', 5, 9}, {'G', 6, 10}, {'H', 8, 11}, {'I', 8, 12}, {'J', 2, 14}, {'K', 12, 16}};
    sort(acts.begin(), acts.end(), [](const Activity &a, const Activity &b) { return a.finish < b.finish; });
    int lastFinish = -1;
    cout << "Selected:";
    for (const auto &a : acts)
        if (a.start >= lastFinish) {
            cout << " " << a.name << "(" << a.start << "-" << a.finish << ")";
            lastFinish = a.finish;
        }
    cout << endl;
    return 0;
}
```

Time: Θ(n log n) for sorting, then Θ(n).

## Fractional knapsack

A thief's knapsack holds weight W. Items have values and weights, and **fractions** of items may be taken (gold dust, not gold bars). Maximise value.

**Greedy rule:** take items in decreasing order of **value per unit weight**, taking a fraction of the last one if it does not fit.

```cpp run
#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

struct Item { const char *name; double value, weight; };

int main() {
    vector<Item> items = {{"silver", 60, 10}, {"gold", 100, 20}, {"silk", 120, 30}};
    double capacity = 50, total = 0;
    sort(items.begin(), items.end(), [](const Item &a, const Item &b) {
        return a.value / a.weight > b.value / b.weight;          // best ratio first
    });
    cout << fixed << setprecision(2);
    for (const auto &it : items) {
        if (capacity <= 0) break;
        double take = min(it.weight, capacity);
        total += take / it.weight * it.value;
        capacity -= take;
        cout << "take " << take << " kg of " << it.name << " (ratio " << it.value / it.weight << ")" << endl;
    }
    cout << "maximum value = " << total << endl;
    return 0;
}
```

:::warn Fractional vs 0/1 knapsack
Greedy by ratio is optimal **only** for the fractional version. In the **0/1 knapsack** (take an item whole or not at all), it fails: with the items above, greedy takes silver + gold for 160, but gold + silk gives **220**. The 0/1 version needs [dynamic programming](@daa/knapsack).
:::

## Job sequencing with deadlines

Each job takes one unit of time, has a **deadline** and a **profit** earned only if finished by its deadline. Maximise total profit.

**Greedy rule:** consider jobs in decreasing order of profit, and schedule each in the **latest free slot** on or before its deadline.

```cpp run
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Job { char id; int deadline, profit; };

int main() {
    vector<Job> jobs = {{'a', 2, 100}, {'b', 1, 19}, {'c', 2, 27}, {'d', 1, 25}, {'e', 3, 15}};
    sort(jobs.begin(), jobs.end(), [](const Job &x, const Job &y) { return x.profit > y.profit; });
    int maxD = 0;
    for (auto &j : jobs) maxD = max(maxD, j.deadline);
    vector<char> slot(maxD + 1, '-');
    int profit = 0;
    for (auto &j : jobs)
        for (int t = j.deadline; t >= 1; t--)
            if (slot[t] == '-') { slot[t] = j.id; profit += j.profit; break; }
    cout << "schedule:";
    for (int t = 1; t <= maxD; t++) cout << " slot" << t << "=" << slot[t];
    cout << "\ntotal profit = " << profit << endl;
    return 0;
}
```

## Greedy algorithms you will meet

| Problem | Greedy rule | Lesson |
|---|---|---|
| Activity selection | earliest finish time | this one |
| Fractional knapsack | highest value/weight | this one |
| Job sequencing | highest profit, latest free slot | this one |
| Huffman coding | merge the two least frequent symbols | [Huffman Coding](@daa/huffman) |
| Minimum spanning tree | cheapest safe edge | [Kruskal & Prim](@daa/mst) |
| Single-source shortest paths | closest unvisited vertex | [Dijkstra](@daa/shortest-paths) |

:::exam Proving a greedy algorithm correct
The standard argument is an **exchange argument**: take any optimal solution, show it can be changed to include the greedy choice without getting worse, then apply the same reasoning to the remaining subproblem.
:::

:::quiz
Q. In activity selection, the greedy algorithm sorts activities by...
- start time
- duration
* finish time
- number of conflicts
= Choosing the earliest-finishing compatible activity leaves the most time for others.

Q. For coins {1, 3, 4} and amount 6, what does greedy (largest coin first) produce?
- 2 coins
* 3 coins
- 4 coins
- No solution
= 4 + 1 + 1. The optimum is 3 + 3, so greedy fails for these coins.

Q. Items (value, weight): (60, 10), (100, 20), (120, 30); capacity 50. What is the maximum value for **fractional** knapsack?
- 160
- 220
* 240
- 280
= Take all of the first two (160, weight 30), then 20/30 of the third (80).

Q. Which two properties make a greedy algorithm correct?
* Greedy-choice property and optimal substructure
- Overlapping subproblems and memoisation
- Divide and conquer
- Backtracking and pruning
= Overlapping subproblems is the hallmark of dynamic programming instead.
:::

=== huffman | Huffman Coding
desc: Optimal prefix-free codes for data compression: why prefix codes, building the Huffman tree with a min-priority queue, reading off codes, and computing the compressed size.

Text is stored with fixed-length codes: ASCII uses 8 bits for every character. But in English text, `e` is far more common than `z`. **Huffman coding** (David Huffman, 1952) gives **frequent characters short codes and rare characters long codes**, producing an optimal compression for a given set of frequencies. It is used inside ZIP, gzip, PNG and JPEG.

## Prefix-free codes

To decode a bit stream without separators, no code may be a **prefix** of another. If `a = 0` and `b = 01`, then `01` could be "ab…" or "b". Huffman codes are always prefix-free because every character sits at a **leaf** of a binary tree.

## The algorithm

1. Create a leaf node for each character with its frequency, and put them all in a **min-priority queue**.
2. Repeat until one node remains:
   - Remove the **two lowest-frequency** nodes.
   - Create a new internal node with these two as children and frequency = their sum.
   - Insert it back into the queue.
3. The remaining node is the root. Label left edges **0** and right edges **1**; each character's code is the path from the root.

The greedy choice is "merge the two rarest symbols first", which pushes them deepest into the tree.

## Example

| Character | a | b | c | d | e | f |
|---|---|---|---|---|---|---|
| Frequency | 45 | 13 | 12 | 16 | 9 | 5 |

Merges: f(5)+e(9)=14 → c(12)+b(13)=25 → 14+d(16)=30 → 25+30=55 → a(45)+55=100.

:::diagram tree
tree: 100(a:45,55(25(c:12,b:13),30(14(f:5,e:9),d:16)))
shape: box
caption: The Huffman tree. Left edges are 0, right edges are 1, so a = 0, c = 100, b = 101, f = 1100, e = 1101, d = 111.
:::

```cpp run
#include <iostream>
#include <queue>
#include <vector>
#include <map>
#include <string>
using namespace std;

struct Node {
    char ch;
    int freq;
    Node *left, *right;
    Node(char c, int f, Node *l = nullptr, Node *r = nullptr) : ch(c), freq(f), left(l), right(r) {}
};

struct ByFreq {
    bool operator()(Node *a, Node *b) const {
        return a->freq != b->freq ? a->freq > b->freq : a->ch > b->ch;   // min-heap, ties broken by char
    }
};

void collect(Node *n, const string &code, map<char, string> &codes) {
    if (!n->left) { codes[n->ch] = code.empty() ? "0" : code; return; }
    collect(n->left, code + "0", codes);
    collect(n->right, code + "1", codes);
}

int main() {
    vector<pair<char, int>> freq = {{'a', 45}, {'b', 13}, {'c', 12}, {'d', 16}, {'e', 9}, {'f', 5}};
    priority_queue<Node *, vector<Node *>, ByFreq> pq;
    for (auto [c, f] : freq) pq.push(new Node(c, f));
    char nextId = '1';                       // labels for internal nodes, used only for tie-breaking
    while (pq.size() > 1) {
        Node *x = pq.top(); pq.pop();
        Node *y = pq.top(); pq.pop();
        pq.push(new Node(nextId++, x->freq + y->freq, x, y));
    }
    map<char, string> codes;
    collect(pq.top(), "", codes);
    int bits = 0, total = 0;
    for (auto [c, f] : freq) {
        cout << c << " (freq " << f << "): " << codes[c] << endl;
        bits += f * codes[c].size();
        total += f;
    }
    cout << "Huffman bits: " << bits << ", fixed 3-bit code: " << total * 3
         << ", saving " << 100 - bits * 100 / (total * 3) << "%" << endl;
    return 0;
}
```

The program's codes may differ from the diagram in which child goes left (ties can be broken either way), but the **code lengths and total bits are always the same**: 224 bits versus 300 for a fixed 3-bit code.

## Analysis

- n − 1 merges, each doing O(log n) priority-queue operations → **O(n log n)**.
- Huffman's code is **optimal** among prefix codes: no other prefix code gives a smaller total Σ freq × code length.

## Decoding

Start at the root; read bits, going left on 0 and right on 1; when you reach a leaf, output its character and return to the root. With the codes in the diagram, `0101100` splits in only one way, 0 | 101 | 100, and decodes to **abc**.

:::exam Typical question
"Construct the Huffman tree and codes for the given frequencies, and find the average code length." Average length = Σ(freq × length) / Σ freq. For the example: 224 / 100 = **2.24 bits per character**.
:::

:::quiz
Q. Which two nodes does Huffman's algorithm merge at each step?
- The two most frequent
* The two least frequent
- The first two in alphabetical order
- One frequent and one rare
= Merging the rarest symbols first pushes them deepest, giving them the longest codes.

Q. Why can Huffman codes be decoded without separators?
* They are prefix-free: every character is at a leaf
- Each code has the same length
- They use a special end marker
- They are stored in ASCII
= No code is the beginning of another code.

Q. What data structure makes Huffman's algorithm O(n log n)?
- Stack
- Hash table
* Min-priority queue (heap)
- Sorted array
= Each extract-min and insert costs O(log n).

Q. With frequencies a:45, b:13, c:12, d:16, e:9, f:5, how many bits does the Huffman encoding need?
- 300
* 224
- 100
- 250
= 45·1 + 13·3 + 12·3 + 16·3 + 9·4 + 5·4 = 224.
:::

=== mst | Minimum Spanning Trees
desc: Connect every vertex at minimum total cost: spanning trees, Kruskal's algorithm with union-find, Prim's algorithm with a priority queue, traced on the same graph.

A **spanning tree** of a connected, undirected graph is a subset of its edges that connects **all** vertices with **no cycles** — exactly V − 1 edges. A **minimum spanning tree (MST)** is a spanning tree with the smallest possible total edge weight.

Uses: laying cable or pipelines to connect cities at minimum cost, designing networks, clustering, and approximating harder problems like TSP.

:::diagram graph
nodes: A(0,0.8) B(1.4,0) C(2.8,0) D(4.2,0.8) E(2.8,1.6) F(1.4,1.6)
edges: A-B:4 A-F:8 B-C:10 B-F:11 C-D:7 C-E:2 C-F:5 D-E:9 E-F:6 D-F:14
hl-edges: C-E A-B C-F C-D A-F
unit: 105
caption: A weighted graph with its minimum spanning tree highlighted: C–E (2), A–B (4), C–F (5), C–D (7) and A–F (8), total weight 26. Because all weights are distinct, this MST is unique.
:::

## Kruskal's algorithm

**Greedy rule:** consider edges from **lightest to heaviest**; add an edge if it does **not create a cycle**.

To test "would this edge create a cycle?" quickly, Kruskal uses a **union-find** (disjoint set) structure: each vertex starts in its own set; an edge (u, v) creates a cycle exactly when u and v are already in the same set.

```cpp run
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

struct Edge { int u, v, w; };
vector<int> parent;
int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }   // path compression

int main() {
    const char *name = "ABCDEF";
    vector<Edge> edges = {{0,1,4},{0,5,8},{1,2,10},{1,5,11},{2,3,7},{2,4,2},{2,5,5},{3,4,9},{4,5,6},{3,5,14}};
    sort(edges.begin(), edges.end(), [](const Edge &a, const Edge &b) { return a.w < b.w; });
    parent.resize(6);
    iota(parent.begin(), parent.end(), 0);
    int total = 0, used = 0;
    for (const Edge &e : edges) {
        int ru = find(e.u), rv = find(e.v);
        cout << name[e.u] << "-" << name[e.v] << " (" << e.w << "): ";
        if (ru == rv) { cout << "skip, would form a cycle" << endl; continue; }
        parent[ru] = rv;                                   // union the two trees
        total += e.w;
        cout << "take" << endl;
        if (++used == 5) break;                            // V - 1 edges: done
    }
    cout << "MST weight = " << total << endl;
    return 0;
}
```

Time: sorting dominates → **O(E log E)** (= O(E log V)).

## Prim's algorithm

**Greedy rule:** grow **one tree** from a start vertex; at each step add the **cheapest edge connecting the tree to a new vertex**. A min-priority queue holds the candidate edges.

```cpp run
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    const char *name = "ABCDEF";
    int V = 6;
    vector<vector<pair<int, int>>> adj(V);          // (neighbour, weight)
    int e[][3] = {{0,1,4},{0,5,8},{1,2,10},{1,5,11},{2,3,7},{2,4,2},{2,5,5},{3,4,9},{4,5,6},{3,5,14}};
    for (auto &x : e) { adj[x[0]].push_back({x[1], x[2]}); adj[x[1]].push_back({x[0], x[2]}); }

    vector<bool> inTree(V, false);
    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> pq;   // (weight, vertex, from)
    pq.push({0, 0, -1});
    int total = 0;
    while (!pq.empty()) {
        auto [w, v, from] = pq.top(); pq.pop();
        if (inTree[v]) continue;                     // stale entry
        inTree[v] = true;
        total += w;
        if (from >= 0) cout << "add " << name[from] << "-" << name[v] << " (" << w << ")" << endl;
        for (auto [to, wt] : adj[v])
            if (!inTree[to]) pq.push({wt, to, v});
    }
    cout << "MST weight = " << total << endl;
    return 0;
}
```

Time with a binary heap: **O(E log V)**. With an adjacency matrix and no heap: O(V²), which is better for dense graphs.

## Kruskal vs Prim

| | Kruskal | Prim |
|---|---|---|
| Grows | a forest that merges into one tree | a single tree |
| Picks | globally lightest safe edge | lightest edge leaving the tree |
| Data structure | sorted edges + union-find | priority queue |
| Time | O(E log E) | O(E log V) with a heap; O(V²) with a matrix |
| Better for | sparse graphs | dense graphs |

Both always find a minimum spanning tree. If all edge weights are distinct, the MST is **unique**, so both find the same one.

:::exam Trace in a table
For Kruskal, list edges in sorted order and mark each "take" or "reject (cycle)". For Prim, show the tree after each step and the edge added. Always state the final MST weight.
:::

:::quiz
Q. How many edges does a spanning tree of a graph with 10 vertices have?
- 10
* 9
- 45
- It depends on the graph
= Every spanning tree of V vertices has V − 1 edges.

Q. What does Kruskal's algorithm use to detect cycles efficiently?
- DFS from scratch each time
* Union-find (disjoint sets)
- A priority queue
- An adjacency matrix
= Two endpoints in the same set means the edge would close a cycle.

Q. Which algorithm grows a single tree from a start vertex?
- Kruskal
* Prim
- Dijkstra
- Bellman–Ford
= Prim adds the cheapest edge leaving the current tree.

Q. What is Kruskal's running time?
* O(E log E)
- O(V²)
- O(E + V)
- O(V³)
= Sorting the edges dominates; union-find operations are nearly constant.
:::

=== shortest-paths | Shortest Paths: Dijkstra & Bellman–Ford
desc: Single-source shortest paths in weighted graphs: relaxation, Dijkstra's greedy algorithm with a priority queue, why it fails on negative edges, and Bellman–Ford with negative-cycle detection.

Given a weighted graph and a **source** vertex s, find the shortest-path distance from s to **every** other vertex. (BFS solves this only when all edges have the same weight.)

## Relaxation

Both algorithms repeatedly **relax** edges. For an edge u → v with weight w:

```pseudo
RELAX(u, v, w)
    if dist[u] + w < dist[v]
        dist[v] = dist[u] + w
        parent[v] = u
```

"If going through u gives a shorter route to v, use it."

## Dijkstra's algorithm

**Greedy rule:** repeatedly pick the unvisited vertex with the **smallest known distance**, mark it final, and relax its outgoing edges. Works when **all edge weights are non-negative**.

:::diagram graph
nodes: S(0,0.9) A(1.5,0) B(1.5,1.8) C(3,0) D(3,1.8) T(4.5,0.9)
edges: S>A:10 S>B:3 B>A:4 A>C:2 B>D:8 B>C:9 C>T:4 D>T:5 C>D:1
caption: A directed weighted graph. The shortest path S → B → A → C → T has length 3 + 4 + 2 + 4 = 13.
:::

```cpp run
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <string>
using namespace std;

int main() {
    const string name = "SABCDT";
    int V = 6;
    vector<vector<pair<int, int>>> adj(V);
    int e[][3] = {{0,1,10},{0,2,3},{2,1,4},{1,3,2},{2,4,8},{2,3,9},{3,5,4},{4,5,5},{3,4,1}};
    for (auto &x : e) adj[x[0]].push_back({x[1], x[2]});

    vector<int> dist(V, INT_MAX), parent(V, -1);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;   // (distance, vertex)
    dist[0] = 0;
    pq.push({0, 0});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;                         // outdated entry
        cout << "finalise " << name[u] << " at distance " << d << endl;
        for (auto [v, w] : adj[u])
            if (dist[u] + w < dist[v]) {                   // relax
                dist[v] = dist[u] + w;
                parent[v] = u;
                pq.push({dist[v], v});
            }
    }
    string path;
    for (int v = 5; v != -1; v = parent[v]) path = string(1, name[v]) + (path.empty() ? "" : " -> ") + path;
    cout << "shortest S to T: " << dist[5] << " via " << path << endl;
    return 0;
}
```

Time with a binary heap: **O((V + E) log V)**.

:::warn Negative edges break Dijkstra
Dijkstra assumes that once a vertex is finalised, no later path can be shorter. A negative edge discovered later can violate that. Use Bellman–Ford instead.
:::

## Bellman–Ford

Relax **every edge**, V − 1 times. After round k, every shortest path using at most k edges is correct, and a shortest path never needs more than V − 1 edges. A **V-th** round that still improves some distance proves a **negative cycle** is reachable (no shortest path exists).

```cpp run
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

struct Edge { int u, v, w; };

void bellmanFord(int V, const vector<Edge> &edges, int src) {
    vector<long> dist(V, LONG_MAX);
    dist[src] = 0;
    for (int round = 1; round < V; round++)
        for (const Edge &e : edges)
            if (dist[e.u] != LONG_MAX && dist[e.u] + e.w < dist[e.v]) dist[e.v] = dist[e.u] + e.w;
    for (const Edge &e : edges)
        if (dist[e.u] != LONG_MAX && dist[e.u] + e.w < dist[e.v]) { cout << "negative cycle detected!" << endl; return; }
    for (int v = 0; v < V; v++) cout << "dist[" << v << "] = " << dist[v] << endl;
}

int main() {
    vector<Edge> g1 = {{0,1,6},{0,2,7},{1,2,8},{1,3,5},{1,4,-4},{2,3,-3},{2,4,9},{3,1,-2},{4,0,2},{4,3,7}};
    bellmanFord(5, g1, 0);
    cout << "---" << endl;
    vector<Edge> g2 = {{0,1,1},{1,2,-1},{2,3,-1},{3,1,-1}};      // cycle 1 -> 2 -> 3 -> 1 has weight -3
    bellmanFord(4, g2, 0);
    return 0;
}
```

Time: **O(V · E)** — slower than Dijkstra but handles negative weights.

## Comparison

| | BFS | Dijkstra | Bellman–Ford | Floyd–Warshall |
|---|---|---|---|---|
| Edge weights | all equal | non-negative | any (detects negative cycles) | any (no negative cycles) |
| Sources | single | single | single | **all pairs** |
| Time | O(V + E) | O((V + E) log V) | O(VE) | O(V³) |
| Technique | traversal | greedy | dynamic programming | [dynamic programming](@daa/floyd-warshall) |

:::quiz
Q. What condition must edge weights satisfy for Dijkstra's algorithm to be correct?
- All weights equal
* All weights non-negative
- All weights distinct
- No condition
= A negative edge can make a "finalised" distance wrong.

Q. How many rounds of relaxing all edges does Bellman–Ford perform before the cycle check?
- V
* V − 1
- E
- log V
= A shortest simple path has at most V − 1 edges.

Q. How does Bellman–Ford detect a negative cycle?
* If an extra round still decreases some distance
- If a distance becomes zero
- If the graph is disconnected
- If two edges have equal weight
= Without negative cycles, distances are final after V − 1 rounds.

Q. What is the time complexity of Dijkstra with a binary heap?
- O(V²)
* O((V + E) log V)
- O(VE)
- O(V³)
= Each vertex is extracted once and each edge may cause a heap insertion.
:::
