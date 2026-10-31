=== graphs | Graphs: Terminology & Representation
unit: Graphs & Hashing
desc: Vertices and edges: directed, weighted and connected graphs, degree, paths and cycles, and storing graphs as adjacency matrices and adjacency lists.

A **graph** G = (V, E) is a set of **vertices** (nodes) V connected by **edges** E. Graphs model anything with connections: road maps, social networks, the web, course prerequisites, computer networks.

:::diagram graph
nodes: A(0,0) B(2,0) C(0,1.5) D(2,1.5) E(3.4,0.75)
edges: A-B A-C B-D C-D D-E B-E
caption: An undirected graph with 5 vertices and 6 edges.
:::

## Vocabulary

| Term | Meaning |
|---|---|
| **Undirected** graph | edges have no direction: A–B means both ways |
| **Directed** graph (digraph) | edges are arrows: A → B does not imply B → A |
| **Weighted** graph | each edge carries a number (distance, cost, time) |
| **Adjacent** | two vertices joined by an edge |
| **Degree** | number of edges at a vertex; in digraphs, **in-degree** and **out-degree** |
| **Path** | a sequence of vertices joined by edges |
| **Cycle** | a path that starts and ends at the same vertex |
| **Connected** | there is a path between every pair of vertices |
| **Tree** | a connected graph with no cycles (n vertices, n − 1 edges) |
| **DAG** | directed acyclic graph — a digraph with no directed cycles |

:::exam Handshake lemma
In any undirected graph, the sum of all degrees is **twice** the number of edges, because each edge adds 1 to the degree of both ends. In the graph above: 2 + 3 + 2 + 3 + 2 = 12 = 2 × 6. A consequence: the number of odd-degree vertices is always even.
:::

## Directed and weighted graphs

:::diagram graph
nodes: S(0,0.8) A(1.6,0) B(1.6,1.6) T(3.2,0.8)
edges: S>A:4 S>B:2 B>A:1 A>T:5 B>T:8
caption: A weighted directed graph. Shortest-path algorithms like Dijkstra's work on graphs like this.
:::

## Representation 1: adjacency matrix

A V × V grid where `adj[i][j] = 1` (or the weight) if there is an edge from i to j.

:::diagram matrix
rows: 0 1 1 0 0 | 1 0 0 1 1 | 1 0 0 1 0 | 0 1 1 0 1 | 0 1 0 1 0
row-headers: A B C D E
col-headers: A B C D E
caption: Adjacency matrix of the first graph. It is symmetric because the graph is undirected.
:::

- Check "is there an edge i–j?" in **O(1)**.
- Uses **O(V²)** memory even if there are few edges.
- Listing a vertex's neighbours takes O(V).

## Representation 2: adjacency list

An array of lists: `adj[i]` holds the neighbours of vertex i.

```text
A: B C
B: A D E
C: A D
D: B C E
E: B D
```

- Uses **O(V + E)** memory — ideal for **sparse** graphs (most real graphs).
- Listing neighbours is fast: O(degree).
- Checking a specific edge takes O(degree).

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Edge { int to; struct Edge *next; } Edge;

#define V 5
Edge *adj[V];
const char *name = "ABCDE";

void addEdge(int u, int v) {                 // undirected: add both directions
    Edge *e = malloc(sizeof(Edge)); e->to = v; e->next = adj[u]; adj[u] = e;
    e = malloc(sizeof(Edge));       e->to = u; e->next = adj[v]; adj[v] = e;
}

int main(void) {
    int edges[][2] = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {3, 4}, {1, 4}};
    for (int i = 0; i < 6; i++) addEdge(edges[i][0], edges[i][1]);

    int matrix[V][V] = {0};
    for (int u = 0; u < V; u++) {
        printf("%c:", name[u]);
        int deg = 0;
        for (Edge *e = adj[u]; e; e = e->next) { printf(" %c", name[e->to]); matrix[u][e->to] = 1; deg++; }
        printf("  -> degree %d\n", deg);
    }
    printf("\nAdjacency matrix:\n  ");
    for (int j = 0; j < V; j++) printf(" %c", name[j]);
    printf("\n");
    for (int i = 0; i < V; i++) {
        printf("%c ", name[i]);
        for (int j = 0; j < V; j++) printf(" %d", matrix[i][j]);
        printf("\n");
    }
    return 0;
}
```

(The list shows neighbours in reverse insertion order because each new edge is added at the head of the list.)

## Matrix or list?

| | Adjacency matrix | Adjacency list |
|---|---|---|
| Memory | O(V²) | O(V + E) |
| Is (u, v) an edge? | O(1) | O(deg(u)) |
| Visit all neighbours of u | O(V) | O(deg(u)) |
| Best for | dense graphs, quick edge checks | sparse graphs, traversals |

:::quiz
Q. An undirected graph has degrees 3, 3, 2, 2, 2. How many edges does it have?
- 12
* 6
- 5
- 10
= Sum of degrees = 12 = 2 × edges, so there are 6 edges.

Q. How much memory does an adjacency matrix need for V vertices?
- O(V)
- O(E)
* O(V²)
- O(V + E)
= It stores a cell for every ordered pair of vertices.

Q. Which representation is better for a sparse graph with a million vertices?
* Adjacency list
- Adjacency matrix
- Both are the same
- Neither can store it
= A matrix would need 10¹² cells; a list stores only the edges that exist.

Q. What is a DAG?
- A graph where every vertex has degree 2
* A directed graph with no directed cycles
- A disconnected graph
- A graph with weighted edges
= Directed acyclic graphs model dependencies, like course prerequisites.
:::

=== bfs-dfs | Graph Traversal: BFS & DFS
desc: Explore a graph level by level with a queue (BFS) or as deep as possible with a stack or recursion (DFS) — with step-by-step traces, shortest paths and applications.

To **traverse** a graph is to visit every vertex reachable from a starting vertex. Unlike a tree, a graph can have cycles, so we keep a **visited** array to avoid looping forever.

## Breadth-first search (BFS)

BFS visits the start, then **all its neighbours**, then all **their** unvisited neighbours — expanding outward in rings, like ripples in water. It uses a **queue**.

1. Mark the start visited and enqueue it.
2. While the queue is not empty: dequeue a vertex, visit it, and enqueue each **unvisited** neighbour (marking it visited).

## Depth-first search (DFS)

DFS goes **as deep as possible** along one path before backtracking. It uses a **stack** — usually the call stack, via recursion.

1. Visit the vertex and mark it visited.
2. For each unvisited neighbour, recursively DFS from it.

## Step through both

Pick a start vertex and step through BFS or DFS. Watch the queue or stack and the visit order:

:::widget graph-traversal
:::

## BFS and DFS in C

```c run
#include <stdio.h>

#define V 7
int adj[V][V];
const char *name = "ABCDEFG";
int visited[V];

void addEdge(int u, int v) { adj[u][v] = adj[v][u] = 1; }

void bfs(int start) {
    int queue[V], front = 0, rear = 0, dist[V];
    for (int i = 0; i < V; i++) visited[i] = 0;
    visited[start] = 1; dist[start] = 0;
    queue[rear++] = start;
    printf("BFS: ");
    while (front < rear) {
        int u = queue[front++];
        printf("%c(%d) ", name[u], dist[u]);
        for (int v = 0; v < V; v++)
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1;
                dist[v] = dist[u] + 1;      // one more edge than its parent
                queue[rear++] = v;
            }
    }
    printf("\n");
}

void dfs(int u) {
    visited[u] = 1;
    printf("%c ", name[u]);
    for (int v = 0; v < V; v++)
        if (adj[u][v] && !visited[v]) dfs(v);
}

int main(void) {
    // A-B, A-C, B-D, B-E, C-F, E-F, F-G
    int e[][2] = {{0, 1}, {0, 2}, {1, 3}, {1, 4}, {2, 5}, {4, 5}, {5, 6}};
    for (int i = 0; i < 7; i++) addEdge(e[i][0], e[i][1]);
    bfs(0);
    for (int i = 0; i < V; i++) visited[i] = 0;
    printf("DFS: ");
    dfs(0);
    printf("\n");
    return 0;
}
```

The number in brackets after each BFS vertex is its distance (in edges) from A — **BFS finds shortest paths in unweighted graphs**.

:::diagram graph
nodes: A(1.5,0) B(0.5,1) C(2.5,1) D(0,2) E(1,2) F(2.5,2) G(2.5,3)
edges: A-B A-C B-D B-E C-F E-F F-G
caption: The graph used in the program. BFS from A: A B C D E F G. DFS from A: A B D E F C G.
:::

## BFS vs DFS

| | BFS | DFS |
|---|---|---|
| Data structure | queue | stack / recursion |
| Explores | level by level | one branch to the end, then backtracks |
| Shortest path (unweighted) | **yes** | no |
| Memory | can hold a whole level | holds one path |
| Time | O(V + E) with a list, O(V²) with a matrix | same |
| Typical uses | shortest paths, nearest neighbours, web crawling, social "degrees of separation" | cycle detection, topological sort, connected components, mazes, backtracking |

## Applications

- **Connected components**: run DFS/BFS from every unvisited vertex; each run discovers one component.
- **Cycle detection**: in DFS, reaching a visited vertex that is not your parent means a cycle (undirected graphs).
- **Topological sort** of a DAG: output vertices in reverse order of DFS completion — see [Graph Algorithms](@daa/graph-algorithms).
- **Bipartite check**: BFS-colour vertices in two colours; a conflict means not bipartite.

:::mistake Forgetting visited marks
Without the `visited` array, BFS and DFS loop forever on any graph with a cycle — and even on a single undirected edge, which goes both ways.
:::

:::quiz
Q. Which data structure does BFS use?
* Queue
- Stack
- Heap
- Hash table
= BFS processes vertices in the order they were discovered: first in, first out.

Q. What is the time complexity of BFS with an adjacency list?
- O(V²)
* O(V + E)
- O(E log V)
- O(V × E)
= Each vertex is enqueued once and each edge is examined once (twice for undirected).

Q. For the graph in this lesson, which vertex does DFS from A visit right after D?
- C
* E
- F
- G
= DFS goes A → B → D (dead end), backtracks to B, then visits E.

Q. Which traversal finds the minimum number of edges between two vertices?
* BFS
- DFS
- Inorder
- Both always do
= BFS reaches vertices in increasing order of distance from the start.
:::

=== hashing | Hashing
desc: Near O(1) search with hash tables: hash functions, collisions, separate chaining, linear and quadratic probing, double hashing and the load factor.

Arrays give O(1) access **by index**. What if you could turn any key — a roll number, a name — into an index? That is **hashing**: a **hash function** converts a key into an index of an array called a **hash table**.

```text
h(key) = key % tableSize

h(23) = 23 % 10 = 3   -> store 23 in slot 3
h(47) = 47 % 10 = 7   -> store 47 in slot 7
```

Search, insert and delete then take **O(1) on average**.

## Good hash functions

A good hash function is **fast**, **deterministic**, and spreads keys **uniformly** over the table.

| Method | Formula | Notes |
|---|---|---|
| Division | `h(k) = k mod m` | choose `m` prime, away from powers of 2 |
| Multiplication | `h(k) = ⌊m × frac(k × A)⌋`, 0 < A < 1 | `m` can be anything |
| Mid-square | square `k`, take the middle digits | old textbook method |
| Folding | split `k` into parts and add them | for long keys like phone numbers |
| Strings | `h = h × 31 + c` for each character | how Java hashes strings |

## Collisions

Two keys can hash to the same slot: with `m = 10`, both 23 and 33 go to slot 3. That is a **collision**, and every hash table needs a strategy for it.

## Separate chaining

Each slot holds a **linked list** of all keys that hash there.

:::diagram hashtable
keys: 50 700 76 85 92 73 101
size: 7
mode: chain
caption: Separate chaining with h(k) = k mod 7. 50, 85 and 92 all hash to slot 1 and share a chain.
:::

```c run
#include <stdio.h>
#include <stdlib.h>

#define M 7
typedef struct Node { int key; struct Node *next; } Node;
Node *table[M];

int h(int k) { return k % M; }

void insert(int k) {
    Node *n = malloc(sizeof(Node));
    n->key = k;
    n->next = NULL;
    Node **p = &table[h(k)];
    while (*p) p = &(*p)->next;       // walk to the end of the chain
    *p = n;
}

int search(int k) {
    for (Node *p = table[h(k)]; p; p = p->next)
        if (p->key == k) return 1;
    return 0;
}

int main(void) {
    int keys[] = {50, 700, 76, 85, 92, 73, 101};
    for (int i = 0; i < 7; i++) insert(keys[i]);
    for (int i = 0; i < M; i++) {
        printf("%d:", i);
        for (Node *p = table[i]; p; p = p->next) printf(" %d ->", p->key);
        printf(" NULL\n");
    }
    printf("search 92: %s, search 15: %s\n", search(92) ? "found" : "missing", search(15) ? "found" : "missing");
    return 0;
}
```

## Open addressing

All keys live **inside the array**. On a collision, **probe** other slots in a fixed sequence until an empty one is found.

| Probing | Try slots | Weakness |
|---|---|---|
| **Linear** | h, h+1, h+2, … (mod m) | **primary clustering** — long runs of filled slots |
| **Quadratic** | h, h+1², h+2², h+3², … | **secondary clustering**; may miss empty slots |
| **Double hashing** | h, h + h₂(k), h + 2·h₂(k), … | best spread; needs h₂(k) ≠ 0 |

:::diagram hashtable
keys: 50 700 76 85 92 73 101
size: 7
mode: linear
caption: The same keys with linear probing. 85 wanted slot 1 (taken by 50) and moved to 2; 92 wanted 1 and ended in 3.
:::

## Try it

Insert keys and compare chaining, linear probing and quadratic probing:

:::widget hash-table
:::

```c run
#include <stdio.h>

#define M 7
int table[M];

void insert(int k) {
    for (int i = 0; i < M; i++) {
        int slot = (k % M + i) % M;              // linear probing
        if (table[slot] == -1) {
            table[slot] = k;
            printf("%3d -> slot %d%s\n", k, slot, i ? " (after collision)" : "");
            return;
        }
    }
    printf("table full, cannot insert %d\n", k);
}

int main(void) {
    for (int i = 0; i < M; i++) table[i] = -1;
    int keys[] = {50, 700, 76, 85, 92, 73, 101};
    for (int i = 0; i < 7; i++) insert(keys[i]);
    return 0;
}
```

:::warn Deleting with open addressing
You cannot simply empty a slot: a later search would stop at the hole and miss keys that probed past it. Mark deleted slots with a special **tombstone** value instead.
:::

## Load factor and rehashing

The **load factor** α = n / m (keys stored ÷ table size) measures how full the table is.

- Chaining: average chain length is α, so keep α around 1.
- Open addressing: performance falls sharply as α approaches 1; keep α below about 0.7.
- When α gets too high, **rehash**: allocate a table about twice the size and reinsert every key.

## Costs

| | Average | Worst case |
|---|---|---|
| Search / insert / delete | **O(1)** | O(n) — everything collides |

Hash tables power dictionaries in Python, `unordered_map` in C++, database indexes, caches and compilers' symbol tables.

:::quiz
Q. Using h(k) = k mod 11, which slot does 46 go to?
- 4
* 2
- 6
- 11
= 46 = 4 × 11 + 2, so the remainder is 2.

Q. Which collision technique stores colliding keys in linked lists?
* Separate chaining
- Linear probing
- Quadratic probing
- Double hashing
= Each slot points to a chain of all keys with that hash value.

Q. What is primary clustering?
- Keys spread evenly
* Long runs of occupied slots forming in linear probing
- Two keys with identical values
- A table that is exactly full
= Linear probing tends to grow existing runs, making future collisions longer.

Q. A table of size 20 holds 15 keys. What is the load factor?
- 1.33
* 0.75
- 15
- 0.25
= α = n / m = 15 / 20 = 0.75.
:::
