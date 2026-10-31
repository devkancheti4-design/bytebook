=== trees | Trees & Binary Trees
unit: Trees
desc: Hierarchical data: tree vocabulary, types of binary trees, array and linked representations, and the four traversals — inorder, preorder, postorder and level order.

A **tree** stores data in a hierarchy: one **root** at the top, and every other node has exactly one **parent**. File systems, the HTML of a web page, an organisation chart and a family tree are all trees.

:::diagram tree
tree: A(B(D,E),C(F,G))
caption: A binary tree with root A. B and C are A's children; D, E, F and G are leaves.
:::

## Vocabulary

| Term | Meaning (for the tree above) |
|---|---|
| **Root** | the top node with no parent — A |
| **Parent / child** | B is the parent of D and E |
| **Siblings** | nodes with the same parent — D and E |
| **Leaf** | a node with no children — D, E, F, G |
| **Internal node** | a node with at least one child — A, B, C |
| **Edge** | a link between parent and child (a tree with n nodes has n − 1 edges) |
| **Depth** of a node | edges from the root to it — depth(D) = 2 |
| **Height** of a tree | edges on the longest root-to-leaf path — 2 here |
| **Degree** of a node | number of children — degree(A) = 2 |
| **Subtree** | a node together with all its descendants |

## Binary trees

A **binary tree** is a tree where each node has **at most two** children, called **left** and **right**.

| Type | Definition |
|---|---|
| **Full** (strict) | every node has 0 or 2 children |
| **Perfect** | full, and all leaves at the same level: 2ʰ⁺¹ − 1 nodes |
| **Complete** | every level full except possibly the last, which is filled **left to right** |
| **Skewed** | every node has only one child — basically a linked list |
| **Balanced** | heights of left and right subtrees differ by at most 1 at every node |

:::exam Formulas worth memorising
- Maximum nodes at level `l` = 2ˡ (root is level 0).
- Maximum nodes in a binary tree of height `h` = 2ʰ⁺¹ − 1.
- Minimum height with `n` nodes = ⌈log₂(n + 1)⌉ − 1.
- In a full binary tree, leaves = internal nodes + 1.
:::

## Representing a binary tree

**Linked representation** — each node holds data plus `left` and `right` pointers:

```c
typedef struct TreeNode {
    int data;
    struct TreeNode *left, *right;
} TreeNode;
```

**Array representation** — store level by level. For the node at index `i` (0-based): left child at `2i + 1`, right child at `2i + 2`, parent at `(i − 1) / 2`. Perfect for **complete** trees (like heaps); wasteful for skewed ones.

:::diagram array
values: A B C D E F G
caption: The tree above stored level by level. B is at index 1, so its children are at 3 (D) and 4 (E).
:::

## Traversals

A **traversal** visits every node once. Depth-first traversals differ only in **when** you visit the node relative to its subtrees:

| Traversal | Order | Result for the tree above |
|---|---|---|
| **Preorder** | Node, Left, Right | A B D E C F G |
| **Inorder** | Left, Node, Right | D B E A F C G |
| **Postorder** | Left, Right, Node | D E B F G C A |
| **Level order** | level by level, left to right (uses a queue) | A B C D E F G |

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct T { char data; struct T *left, *right; } T;

T *node(char d, T *l, T *r) { T *t = malloc(sizeof(T)); t->data = d; t->left = l; t->right = r; return t; }

void preorder(T *t)  { if (!t) return; printf("%c ", t->data); preorder(t->left); preorder(t->right); }
void inorder(T *t)   { if (!t) return; inorder(t->left); printf("%c ", t->data); inorder(t->right); }
void postorder(T *t) { if (!t) return; postorder(t->left); postorder(t->right); printf("%c ", t->data); }

void levelOrder(T *root) {
    T *queue[100];
    int front = 0, rear = 0;
    queue[rear++] = root;
    while (front < rear) {
        T *t = queue[front++];
        printf("%c ", t->data);
        if (t->left)  queue[rear++] = t->left;
        if (t->right) queue[rear++] = t->right;
    }
}

int height(T *t) {
    if (!t) return -1;                         // empty tree has height -1
    int l = height(t->left), r = height(t->right);
    return 1 + (l > r ? l : r);
}
int count(T *t)  { return t ? 1 + count(t->left) + count(t->right) : 0; }
int leaves(T *t) { return !t ? 0 : (!t->left && !t->right) ? 1 : leaves(t->left) + leaves(t->right); }

int main(void) {
    T *root = node('A', node('B', node('D', NULL, NULL), node('E', NULL, NULL)),
                        node('C', node('F', NULL, NULL), node('G', NULL, NULL)));
    printf("Preorder:    "); preorder(root);   printf("\n");
    printf("Inorder:     "); inorder(root);    printf("\n");
    printf("Postorder:   "); postorder(root);  printf("\n");
    printf("Level order: "); levelOrder(root); printf("\n");
    printf("Height %d, nodes %d, leaves %d\n", height(root), count(root), leaves(root));
    return 0;
}
```

:::tip A quick way to write traversals by hand
Trace a line around the tree, starting left of the root and hugging every node. **Preorder** lists a node when you pass its left side, **inorder** when you pass underneath it, **postorder** when you pass its right side.
:::

## Rebuilding a tree from traversals

Given **inorder + preorder** (or inorder + postorder), the tree is unique:

1. The first preorder element (or last postorder element) is the **root**.
2. Find the root in the inorder sequence: everything to its left is the left subtree, everything to its right is the right subtree.
3. Repeat for each subtree.

Preorder + postorder alone is **not** enough unless the tree is full.

:::quiz
Q. What is the inorder traversal of this tree: root 1, left child 2, right child 3, and 2 has a left child 4?
- 1 2 4 3
* 4 2 1 3
- 4 2 3 1
- 1 2 3 4
= Inorder is Left, Node, Right: visit 4, then 2, then the root 1, then 3.

Q. What is the maximum number of nodes in a binary tree of height 3?
- 8
* 15
- 7
- 16
= 2ʰ⁺¹ − 1 = 2⁴ − 1 = 15.

Q. In the array representation, where is the left child of the node at index 4 (0-based)?
- 8
* 9
- 10
- 5
= Left child is at 2i + 1 = 9.

Q. Which traversal uses a queue?
- Preorder
- Inorder
- Postorder
* Level order
= Level-order visits nodes breadth-first, using a queue to remember the next level.
:::

=== bst | Binary Search Tree
desc: A binary tree that keeps itself sorted: search, insert, find min and max, and the three cases of deletion — plus why balance matters.

A **binary search tree (BST)** is a binary tree with one rule at **every** node:

> All keys in the **left** subtree are **smaller**, and all keys in the **right** subtree are **larger**.

:::diagram tree
tree: 50(30(20,40),70(60,80))
caption: A BST. Every key left of 50 is smaller than 50; every key right of 50 is larger. The same holds at 30 and 70.
:::

Because of that rule, an **inorder traversal of a BST prints the keys in sorted order**, and searching can discard half the remaining tree at each step — like binary search.

## Try it

Insert, search and delete keys, and watch the tree and its traversals update:

:::widget bst
:::

## Search and insert

To search, start at the root: go left if the key is smaller, right if it is larger, stop if equal. Insertion searches for the key and attaches a new leaf where the search fell off the tree.

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int key; struct Node *left, *right; } Node;

Node *insert(Node *root, int key) {
    if (root == NULL) {
        Node *n = malloc(sizeof(Node));
        n->key = key; n->left = n->right = NULL;
        return n;
    }
    if (key < root->key)      root->left = insert(root->left, key);
    else if (key > root->key) root->right = insert(root->right, key);
    return root;                                  // duplicates are ignored
}

Node *search(Node *root, int key) {
    while (root != NULL && root->key != key)
        root = (key < root->key) ? root->left : root->right;
    return root;
}

void inorder(Node *r) { if (r) { inorder(r->left); printf("%d ", r->key); inorder(r->right); } }

int main(void) {
    int keys[] = {50, 30, 70, 20, 40, 60, 80, 35};
    Node *root = NULL;
    for (int i = 0; i < 8; i++) root = insert(root, keys[i]);
    printf("Inorder (sorted): ");
    inorder(root);
    printf("\n");
    printf("search 60: %s\n", search(root, 60) ? "found" : "not found");
    printf("search 65: %s\n", search(root, 65) ? "found" : "not found");
    return 0;
}
```

## Minimum and maximum

The smallest key is the **leftmost** node; the largest is the **rightmost**:

```c
Node *minNode(Node *r) { while (r && r->left)  r = r->left;  return r; }
Node *maxNode(Node *r) { while (r && r->right) r = r->right; return r; }
```

## Deletion: three cases

1. **Leaf** — just remove it.
2. **One child** — replace the node with its child.
3. **Two children** — replace the node's key with its **inorder successor** (the smallest key in its right subtree), then delete that successor from the right subtree. (The inorder predecessor works too.)

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int key; struct Node *left, *right; } Node;

Node *insert(Node *r, int k) {
    if (!r) { r = malloc(sizeof(Node)); r->key = k; r->left = r->right = NULL; return r; }
    if (k < r->key) r->left = insert(r->left, k); else if (k > r->key) r->right = insert(r->right, k);
    return r;
}

Node *deleteKey(Node *root, int key) {
    if (root == NULL) return NULL;
    if (key < root->key)      root->left = deleteKey(root->left, key);
    else if (key > root->key) root->right = deleteKey(root->right, key);
    else {
        if (root->left == NULL)  { Node *r = root->right; free(root); return r; }   // cases 1 and 2
        if (root->right == NULL) { Node *l = root->left;  free(root); return l; }
        Node *succ = root->right;                                                   // case 3
        while (succ->left) succ = succ->left;
        root->key = succ->key;
        root->right = deleteKey(root->right, succ->key);
    }
    return root;
}

void preorder(Node *r) { if (r) { printf("%d ", r->key); preorder(r->left); preorder(r->right); } }

int main(void) {
    int keys[] = {50, 30, 70, 20, 40, 60, 80};
    Node *root = NULL;
    for (int i = 0; i < 7; i++) root = insert(root, keys[i]);
    printf("start:            "); preorder(root); printf("\n");
    root = deleteKey(root, 20);  printf("delete 20 (leaf): "); preorder(root); printf("\n");
    root = deleteKey(root, 30);  printf("delete 30 (one):  "); preorder(root); printf("\n");
    root = deleteKey(root, 50);  printf("delete 50 (two):  "); preorder(root); printf("\n");
    return 0;
}
```

After deleting 50, its inorder successor **60** takes its place as the new root.

## Why balance matters

Every BST operation costs **O(h)**, where `h` is the height.

- A **balanced** BST with `n` keys has height about log₂ n → operations are **O(log n)**.
- Insert keys in sorted order (10, 20, 30, 40…) and every new key goes right: the tree becomes a **skewed** chain with height n − 1 → **O(n)**, no better than a linked list.

:::diagram tree
tree: 10(_,20(_,30(_,40)))
caption: Inserting 10, 20, 30, 40 in order produces a skewed BST — effectively a linked list.
:::

That is why self-balancing trees such as **AVL trees** (next lesson) and red-black trees exist.

| Operation | Balanced BST | Skewed BST |
|---|---|---|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Inorder traversal | O(n) | O(n) |

:::quiz
Q. Which traversal of a BST lists the keys in ascending order?
- Preorder
* Inorder
- Postorder
- Level order
= Left subtree (smaller), node, right subtree (larger) — sorted order.

Q. Insert 45 into the BST with root 50, left child 30 (children 20, 40) and right child 70. Where does 45 go?
- Left child of 30
- Left child of 70
* Right child of 40
- Left child of 40
= 45 < 50 → go left to 30; 45 > 30 → right to 40; 45 > 40 → right child of 40.

Q. When deleting a node with two children, what replaces it?
- Its left child
- Its parent
* Its inorder successor (smallest key in the right subtree)
- The root
= The successor keeps the BST ordering intact (the inorder predecessor also works).

Q. What is the worst-case search time in a BST with `n` nodes?
- O(1)
- O(log n)
* O(n)
- O(n log n)
= A skewed BST has height n − 1, so search may visit every node.
:::

=== avl | AVL Trees
desc: Self-balancing BSTs: balance factors, the four rotation cases (LL, RR, LR, RL), and an insertion that stays O(log n) whatever order the keys arrive in.

An **AVL tree** (named after Adelson-Velsky and Landis, 1962) is a BST that keeps itself **balanced**. After every insertion or deletion it checks each node's **balance factor** and fixes any imbalance with **rotations**.

## Balance factor

> balance factor = height(left subtree) − height(right subtree)

In an AVL tree, every node's balance factor must be **−1, 0 or +1**. If an insertion makes some node's balance factor **+2 or −2**, that node is rebalanced. This keeps the height at most about 1.44 log₂ n, so search, insert and delete are all **O(log n)** guaranteed.

## The four imbalance cases

Let **Z** be the lowest unbalanced node on the path from the inserted key up to the root.

| Case | Inserted into | Fix |
|---|---|---|
| **LL** | left subtree of Z's left child | one **right** rotation at Z |
| **RR** | right subtree of Z's right child | one **left** rotation at Z |
| **LR** | right subtree of Z's left child | left rotation at the child, then right rotation at Z |
| **RL** | left subtree of Z's right child | right rotation at the child, then left rotation at Z |

### LL case: right rotation

Inserting 30, 20, 10 makes 30 left-heavy (balance factor +2):

:::diagram tree
tree: 30(20(10,_),_)
highlight: 30
caption: Before: 30 has balance factor +2 (left-heavy).
:::

Rotate **right** at 30: the left child **20 moves up** to become the root, **30 moves down** to become 20's right child, and 20's old right subtree (empty here) becomes 30's new left subtree.

:::diagram tree
tree: 20(10,30)
highlight: 20
caption: After one right rotation the tree is balanced.
:::

### RR case: left rotation

Inserting 10, 20, 30 is the mirror image: rotate **left** at 10 and 20 becomes the root.

### LR case: double rotation

Inserting 30, 10, 20: the imbalance is at 30 (left-heavy), but the new key went into the **right** of the left child. A single right rotation would not fix it. First rotate **left at 10** (turning it into the LL case), then rotate **right at 30**. The result is again 20 with children 10 and 30.

## Insertion in C

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int key, height; struct Node *left, *right; } Node;

int h(Node *n) { return n ? n->height : 0; }
int max(int a, int b) { return a > b ? a : b; }
void update(Node *n) { n->height = 1 + max(h(n->left), h(n->right)); }
int balance(Node *n) { return n ? h(n->left) - h(n->right) : 0; }

Node *rotateRight(Node *z) {
    Node *y = z->left, *t = y->right;
    y->right = z;
    z->left = t;
    update(z); update(y);
    return y;
}

Node *rotateLeft(Node *z) {
    Node *y = z->right, *t = y->left;
    y->left = z;
    z->right = t;
    update(z); update(y);
    return y;
}

Node *insert(Node *n, int key) {
    if (!n) { n = malloc(sizeof(Node)); n->key = key; n->height = 1; n->left = n->right = NULL; return n; }
    if (key < n->key) n->left = insert(n->left, key);
    else if (key > n->key) n->right = insert(n->right, key);
    else return n;

    update(n);
    int b = balance(n);
    if (b > 1 && key < n->left->key)  { printf("  LL at %d\n", n->key); return rotateRight(n); }
    if (b < -1 && key > n->right->key) { printf("  RR at %d\n", n->key); return rotateLeft(n); }
    if (b > 1 && key > n->left->key)  { printf("  LR at %d\n", n->key); n->left = rotateLeft(n->left); return rotateRight(n); }
    if (b < -1 && key < n->right->key) { printf("  RL at %d\n", n->key); n->right = rotateRight(n->right); return rotateLeft(n); }
    return n;
}

void preorder(Node *r) { if (r) { printf("%d ", r->key); preorder(r->left); preorder(r->right); } }

int main(void) {
    int keys[] = {10, 20, 30, 40, 50, 25};
    Node *root = NULL;
    for (int i = 0; i < 6; i++) {
        printf("insert %d\n", keys[i]);
        root = insert(root, keys[i]);
    }
    printf("Preorder: ");
    preorder(root);
    printf("\nHeight: %d (a plain BST built from the same keys has height 5)\n", h(root));
    return 0;
}
```

The final AVL tree for 10, 20, 30, 40, 50, 25:

:::diagram tree
tree: 30(20(10,25),40(_,50))
caption: Sorted-ish input that would make a plain BST a chain stays balanced with height 3 (counting nodes).
:::

:::exam Typical question
"Construct an AVL tree by inserting 14, 17, 11, 7, 53, 4, 13, 12, 8." Draw the tree after **each** insertion, label each node's balance factor, and name the rotation (LL, RR, LR or RL) whenever one happens.
:::

:::quiz
Q. What balance factors are allowed in an AVL tree?
- 0 only
- 0 and 1
* −1, 0 and +1
- Any value between −2 and +2
= A node whose balance factor reaches ±2 must be rotated.

Q. Insert 10, 20, 30 into an empty AVL tree. Which rotation happens?
- LL (right rotation)
* RR (left rotation)
- LR
- RL
= The tree becomes right-heavy along a straight line, so one left rotation at 10 fixes it.

Q. Inserting 30, 10, 20 creates which case?
- LL
- RR
* LR
- RL
= The new key went into the right subtree of the left child of 30 — a double rotation is needed.

Q. Why are AVL operations O(log n) in the worst case?
* Rotations keep the height proportional to log n
- AVL trees store keys in an array
- Rotations sort the keys
- AVL trees never have more than 100 nodes
= Bounded height guarantees logarithmic search, insert and delete.
:::

=== heaps | Heaps & Heap Sort
desc: Complete binary trees stored in arrays: max-heaps and min-heaps, insert with sift-up, extract with sift-down, building a heap in O(n), and heap sort.

A **binary heap** is a **complete binary tree** with the **heap property**:

- **Max-heap**: every parent ≥ its children, so the **largest** key is at the root.
- **Min-heap**: every parent ≤ its children, so the **smallest** key is at the root.

Unlike a BST, a heap says nothing about left versus right — only parent versus child.

:::diagram tree
tree: 90(70(40,50),80(30,60))
caption: A max-heap. Every parent is larger than its children; 90, the maximum, is the root.
:::

## Stored in an array

Because a heap is complete, it fits perfectly in an array with no gaps — no pointers needed. For index `i` (0-based): parent `(i − 1) / 2`, left child `2i + 1`, right child `2i + 2`.

:::diagram array
values: 90 70 80 40 50 30 60
caption: The same heap stored level by level.
:::

## Insert: add at the end, then sift up

Put the new key in the next free slot (keeping the tree complete), then **swap it with its parent while it is larger**. At most one swap per level: **O(log n)**.

## Extract max: move the last key to the root, then sift down

Remove the root (the maximum). Move the last element to the root, then **swap it with its larger child while it is smaller than that child**. Also **O(log n)**.

```c run
#include <stdio.h>

int heap[100], n = 0;

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void siftUp(int i) {
    while (i > 0 && heap[(i - 1) / 2] < heap[i]) {
        swap(&heap[(i - 1) / 2], &heap[i]);
        i = (i - 1) / 2;
    }
}

void siftDown(int i) {
    for (;;) {
        int largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && heap[l] > heap[largest]) largest = l;
        if (r < n && heap[r] > heap[largest]) largest = r;
        if (largest == i) return;
        swap(&heap[i], &heap[largest]);
        i = largest;
    }
}

void insert(int key) { heap[n] = key; siftUp(n); n++; }

int extractMax(void) {
    int top = heap[0];
    heap[0] = heap[--n];
    siftDown(0);
    return top;
}

void show(void) { for (int i = 0; i < n; i++) printf("%d ", heap[i]); printf("\n"); }

int main(void) {
    int keys[] = {40, 70, 30, 90, 50, 80, 60};
    for (int i = 0; i < 7; i++) insert(keys[i]);
    printf("heap array: "); show();
    printf("extract: %d\n", extractMax());
    printf("heap array: "); show();
    printf("extract all: ");
    while (n > 0) printf("%d ", extractMax());
    printf("\n");
    return 0;
}
```

## Building a heap in O(n)

Inserting `n` keys one by one costs O(n log n). **Heapify** does better: start from the last internal node (index n/2 − 1) and sift each node down, moving towards the root. Most nodes are near the bottom and sift down only a little, which adds up to **O(n)**.

## Heap sort

1. Build a max-heap from the array — O(n).
2. Repeatedly swap the root (maximum) with the last element of the heap, shrink the heap by one, and sift the new root down — n × O(log n).

Total **O(n log n)** in every case, using **O(1)** extra space. It is not stable.

```c run
#include <stdio.h>

void siftDown(int a[], int n, int i) {
    for (;;) {
        int big = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && a[l] > a[big]) big = l;
        if (r < n && a[r] > a[big]) big = r;
        if (big == i) return;
        int t = a[i]; a[i] = a[big]; a[big] = t;
        i = big;
    }
}

void heapSort(int a[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) siftDown(a, n, i);      // build max-heap
    for (int end = n - 1; end > 0; end--) {
        int t = a[0]; a[0] = a[end]; a[end] = t;                 // move max to the end
        siftDown(a, end, 0);                                     // fix the smaller heap
    }
}

int main(void) {
    int a[] = {12, 3, 45, 7, 23, 9, 31, 1};
    heapSort(a, 8);
    for (int i = 0; i < 8; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
```

## Heap operation costs

| Operation | Cost |
|---|---|
| Find max (max-heap) | O(1) |
| Insert | O(log n) |
| Extract max | O(log n) |
| Build heap from n keys | O(n) |
| Heap sort | O(n log n) |

Heaps are the standard way to implement **priority queues** — used in Dijkstra's shortest paths, Prim's MST, CPU scheduling and "top-k" problems.

:::quiz
Q. In a max-heap stored in an array, where is the largest element?
* Index 0
- The last index
- The middle
- Anywhere
= The root of a max-heap holds the maximum, and the root is stored at index 0.

Q. What is the parent of the element at index 9 (0-based)?
- 3
* 4
- 5
- 18
= Parent = (9 − 1) / 2 = 4.

Q. What is the time complexity of building a heap from n elements with bottom-up heapify?
* O(n)
- O(log n)
- O(n log n)
- O(n²)
= Most nodes sit near the leaves and sift down only a few levels, which sums to O(n).

Q. Is `[50, 30, 40, 35, 10]` a valid max-heap?
- Yes
* No, because 35 is larger than its parent 30
- No, because 40 is larger than 30
- No, because it is not sorted
= Index 3 (35) has parent index 1 (30), and 35 > 30 breaks the heap property.
:::
