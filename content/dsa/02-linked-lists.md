=== singly-linked-list | Singly Linked List
unit: Linked Lists
desc: Nodes joined by pointers: create, traverse, insert at the head, tail or a position, delete, and search — with every operation's cost.

A **linked list** stores elements in separate **nodes** scattered around memory. Each node holds its **data** and a **pointer to the next node**. The list is reached through a pointer to the first node, called the **head**; the last node points to `NULL`.

:::diagram list
nodes: 10 20 30 40
caption: A singly linked list. Each box is a node: data on the left, the `next` pointer on the right.
:::

Unlike an array, a linked list can grow one node at a time and insert anywhere **without shifting** other elements — you only rewire pointers.

## The node

```c
typedef struct Node {
    int data;
    struct Node *next;     // a pointer to another node of the same type
} Node;
```

A structure that contains a pointer to its own type is called **self-referential**.

## Try it

Insert and delete nodes and watch the pointers change:

:::widget linked-list
:::

## The complete program

Every function receives `Node **head` (a pointer to the head pointer) when it may need to change which node is first.

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

Node *newNode(int data) {
    Node *n = malloc(sizeof(Node));
    n->data = data;
    n->next = NULL;
    return n;
}

void insertHead(Node **head, int data) {          // O(1)
    Node *n = newNode(data);
    n->next = *head;
    *head = n;
}

void insertTail(Node **head, int data) {          // O(n): walk to the end
    Node *n = newNode(data);
    if (*head == NULL) { *head = n; return; }
    Node *p = *head;
    while (p->next != NULL) p = p->next;
    p->next = n;
}

void insertAt(Node **head, int pos, int data) {   // pos 0 = new head
    if (pos == 0) { insertHead(head, data); return; }
    Node *p = *head;
    for (int i = 0; p != NULL && i < pos - 1; i++) p = p->next;
    if (p == NULL) { printf("position %d out of range\n", pos); return; }
    Node *n = newNode(data);
    n->next = p->next;                            // 1. new node points to the rest
    p->next = n;                                  // 2. previous node points to new node
}

void deleteValue(Node **head, int key) {
    Node *p = *head, *prev = NULL;
    while (p != NULL && p->data != key) { prev = p; p = p->next; }
    if (p == NULL) { printf("%d not found\n", key); return; }
    if (prev == NULL) *head = p->next;            // deleting the head
    else prev->next = p->next;                    // bypass the node
    free(p);
}

int search(Node *head, int key) {
    for (int i = 0; head != NULL; head = head->next, i++)
        if (head->data == key) return i;
    return -1;
}

void print(Node *head) {
    for (; head != NULL; head = head->next) printf("%d -> ", head->data);
    printf("NULL\n");
}

void freeList(Node **head) {
    while (*head) { Node *t = *head; *head = t->next; free(t); }
}

int main(void) {
    Node *head = NULL;
    insertTail(&head, 20);
    insertTail(&head, 30);
    insertHead(&head, 10);
    print(head);
    insertAt(&head, 2, 25);
    print(head);
    deleteValue(&head, 10);
    print(head);
    deleteValue(&head, 99);
    printf("30 is at position %d\n", search(head, 30));
    freeList(&head);
    print(head);
    return 0;
}
```

## Inserting in the middle, step by step

To insert 25 after node 20:

:::diagram list
nodes: 10 20 30
highlight: 1
caption: Before: `p` points at 20.
:::

1. Create the new node: `n->data = 25`.
2. Point it at the rest of the list: `n->next = p->next;` (25 → 30).
3. Point 20 at it: `p->next = n;` (20 → 25).

:::diagram list
nodes: 10 20 25 30
highlight: 2
caption: After: only two pointers changed. No other node moved.
:::

:::warn Order matters
If you do step 3 before step 2, `p->next` already points at the new node, and the link to 30 (and everything after it) is lost forever.
:::

## Deleting a node

Find the node **and the one before it**, make the previous node skip over it, then `free` it. Deleting the head is a special case: move `head` forward.

## Costs: array vs linked list

| Operation | Array | Singly linked list |
|---|---|---|
| Access the i-th element | **O(1)** | O(n) |
| Insert / delete at the front | O(n) | **O(1)** |
| Insert / delete at the end | O(1) | O(n), or O(1) with a tail pointer |
| Insert / delete after a known node | O(n) | **O(1)** |
| Search | O(n) | O(n) |
| Extra memory | none | one pointer per node |
| Memory layout | contiguous, cache-friendly | scattered |

:::exam Advantages and disadvantages
**Advantages:** dynamic size, O(1) insertion/deletion once you have the position, no wasted capacity.
**Disadvantages:** no random access (no binary search), extra memory for pointers, poor cache performance, can only be traversed forwards.
:::

:::quiz
Q. What does the last node of a singly linked list point to?
- The head
* `NULL`
- Itself
- The previous node
= `NULL` marks the end of a (non-circular) singly linked list.

Q. What is the cost of inserting a node at the head of a linked list with `n` nodes?
* O(1)
- O(log n)
- O(n)
- O(n²)
= Only the new node's `next` and the `head` pointer change.

Q. Why do insertion functions take `Node **head` instead of `Node *head`?
- Double pointers are faster
* So the function can change the caller's head pointer
- To store two nodes
- It is required by `malloc`
= Inserting or deleting at the front changes which node is the head. Changing `main`'s pointer needs its address.

Q. Which operation is **slower** on a linked list than on an array?
- Inserting at the front
- Deleting the first element
* Accessing the 500th element
- Inserting after a given node
= A list must be walked node by node; an array computes the address directly.
:::

=== linked-list-problems | Linked List Problems
desc: The classic interview and exam problems: reverse a list, find the middle, detect a cycle with Floyd's algorithm, merge two sorted lists and remove duplicates.

These problems appear constantly in CSE 102 exams and placement interviews. Each uses a small trick with pointers. All of them use this node type and helper:

```c
typedef struct Node { int data; struct Node *next; } Node;
```

## Reverse a linked list

Walk the list once, turning each `next` pointer around. Keep three pointers: `prev`, `cur` and `next`.

:::diagram list
nodes: 1 2 3 4
caption: Before: 1 → 2 → 3 → 4 → NULL
:::

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

Node *build(const int *a, int n) {
    Node *head = NULL, **tail = &head;
    for (int i = 0; i < n; i++) {
        *tail = malloc(sizeof(Node));
        (*tail)->data = a[i];
        (*tail)->next = NULL;
        tail = &(*tail)->next;
    }
    return head;
}
void print(const Node *h) { for (; h; h = h->next) printf("%d ", h->data); printf("\n"); }

Node *reverse(Node *head) {
    Node *prev = NULL, *cur = head;
    while (cur != NULL) {
        Node *next = cur->next;   // 1. remember the rest
        cur->next = prev;         // 2. turn this pointer around
        prev = cur;               // 3. step forward
        cur = next;
    }
    return prev;                  // prev is the new head
}

int main(void) {
    int a[] = {1, 2, 3, 4, 5};
    Node *head = build(a, 5);
    print(head);
    head = reverse(head);
    print(head);
    return 0;
}
```

It runs in **O(n) time and O(1) extra space**. The recursive version is shorter but uses O(n) stack space:

```c
Node *reverseRec(Node *head) {
    if (head == NULL || head->next == NULL) return head;
    Node *rest = reverseRec(head->next);
    head->next->next = head;      // the node after head now points back
    head->next = NULL;
    return rest;
}
```

## Find the middle: slow and fast pointers

Move `slow` one step and `fast` two steps at a time. When `fast` reaches the end, `slow` is in the middle — one pass, no counting.

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

Node *push(Node *head, int v) { Node *n = malloc(sizeof(Node)); n->data = v; n->next = head; return n; }

int middle(Node *head) {
    Node *slow = head, *fast = head;
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow->data;
}

int main(void) {
    Node *odd = NULL, *even = NULL;
    for (int v = 5; v >= 1; v--) odd = push(odd, v);    // 1 2 3 4 5
    for (int v = 6; v >= 1; v--) even = push(even, v);  // 1 2 3 4 5 6
    printf("middle of 1..5 = %d\n", middle(odd));
    printf("middle of 1..6 = %d\n", middle(even));     // second of the two middles
    return 0;
}
```

## Detect a cycle: Floyd's tortoise and hare

If a bug makes some node point back to an earlier one, traversal loops forever. Floyd's algorithm uses the same slow/fast idea: in a cycle, the fast pointer eventually **laps** the slow one and they meet.

:::diagram list
nodes: 1 2 3 4 5
kind: circular
caption: A list whose last node points back to the first. `slow` and `fast` must meet inside the loop.
:::

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int hasCycle(Node *head) {
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return 1;
    }
    return 0;
}

int main(void) {
    Node n[5];
    for (int i = 0; i < 5; i++) { n[i].data = i + 1; n[i].next = (i < 4) ? &n[i + 1] : NULL; }
    printf("straight list has cycle? %s\n", hasCycle(&n[0]) ? "yes" : "no");
    n[4].next = &n[1];                     // 5 -> 2 creates a loop
    printf("after 5 -> 2, has cycle? %s\n", hasCycle(&n[0]) ? "yes" : "no");
    return 0;
}
```

Time O(n), space O(1). (A simpler approach stores visited nodes in a hash set, but that costs O(n) memory.)

## Merge two sorted lists

Repeatedly take the smaller head. A **dummy node** avoids special-casing the first element:

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

Node *fromArray(const int *a, int n) {
    Node *head = NULL;
    for (int i = n - 1; i >= 0; i--) { Node *x = malloc(sizeof(Node)); x->data = a[i]; x->next = head; head = x; }
    return head;
}
void print(const Node *h) { for (; h; h = h->next) printf("%d ", h->data); printf("\n"); }

Node *merge(Node *a, Node *b) {
    Node dummy = {0, NULL}, *tail = &dummy;
    while (a && b) {
        if (a->data <= b->data) { tail->next = a; a = a->next; }
        else                    { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;          // attach whatever is left
    return dummy.next;
}

int main(void) {
    int x[] = {2, 7, 9, 15}, y[] = {1, 3, 8, 20, 21};
    print(merge(fromArray(x, 4), fromArray(y, 5)));
    return 0;
}
```

## Remove duplicates from a sorted list

In a sorted list, duplicates sit next to each other, so one pass suffices:

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int main(void) {
    int a[] = {1, 1, 2, 3, 3, 3, 4, 5, 5};
    Node *head = NULL;
    for (int i = 8; i >= 0; i--) { Node *x = malloc(sizeof(Node)); x->data = a[i]; x->next = head; head = x; }

    for (Node *p = head; p && p->next; ) {
        if (p->data == p->next->data) {
            Node *dup = p->next;
            p->next = dup->next;
            free(dup);
        } else p = p->next;
    }
    for (Node *p = head; p; p = p->next) printf("%d ", p->data);
    printf("\n");
    return 0;
}
```

:::tip Pointer-problem toolkit
Almost every linked-list problem uses one of four tricks: a **dummy head node**, **two pointers at different speeds**, **two pointers with a gap of k** (k-th node from the end), or **reversal** of all or part of the list.
:::

:::quiz
Q. In iterative reversal, which pointer becomes the new head?
- `cur`
* `prev`
- `next`
- The old head
= When `cur` becomes `NULL`, `prev` points at the old last node, which is the new first node.

Q. In Floyd's cycle detection, how fast do the two pointers move?
- Both one step
* One step and two steps
- Two steps and three steps
- One step and n steps
= The fast pointer gains one node per round, so it must meet the slow one inside a cycle.

Q. What extra space does Floyd's algorithm use?
* O(1)
- O(log n)
- O(n)
- O(n²)
= Just two pointers, regardless of list length.

Q. How can you find the 3rd node from the end in one pass?
- Reverse the list first
* Move a lead pointer 3 nodes ahead, then move both pointers until the lead hits `NULL`
- Use the slow and fast pointers at speeds 1 and 3
- It cannot be done in one pass
= The gap of 3 is kept, so when the lead pointer runs off the end, the trailing pointer is 3 from the end.
:::

=== doubly-circular | Doubly & Circular Linked Lists
desc: Lists that go both ways or loop around: node structure, insertion and deletion in a doubly linked list, circular lists, and when to use each.

## Doubly linked list

Each node in a **doubly linked list** has two pointers: `prev` and `next`. You can walk in both directions, and you can delete a node when you only have a pointer to it.

:::diagram list
nodes: 10 20 30 40
kind: doubly
tail: true
caption: A doubly linked list. Slashes show `NULL`: the first node's `prev` and the last node's `next`.
:::

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct DNode {
    int data;
    struct DNode *prev, *next;
} DNode;

DNode *head = NULL, *tail = NULL;

void pushBack(int v) {                    // O(1) with a tail pointer
    DNode *n = malloc(sizeof(DNode));
    n->data = v; n->next = NULL; n->prev = tail;
    if (tail) tail->next = n; else head = n;
    tail = n;
}

void pushFront(int v) {
    DNode *n = malloc(sizeof(DNode));
    n->data = v; n->prev = NULL; n->next = head;
    if (head) head->prev = n; else tail = n;
    head = n;
}

void removeNode(DNode *n) {               // O(1): no need to search for the previous node
    if (n->prev) n->prev->next = n->next; else head = n->next;
    if (n->next) n->next->prev = n->prev; else tail = n->prev;
    free(n);
}

void printForward(void)  { for (DNode *p = head; p; p = p->next) printf("%d ", p->data); printf("\n"); }
void printBackward(void) { for (DNode *p = tail; p; p = p->prev) printf("%d ", p->data); printf("\n"); }

int main(void) {
    pushBack(20); pushBack(30); pushBack(40); pushFront(10);
    printf("forward:  "); printForward();
    printf("backward: "); printBackward();
    removeNode(head->next);               // remove 20 using just its pointer
    printf("after removing 20: "); printForward();
    removeNode(tail);
    printf("after removing tail: "); printForward();
    return 0;
}
```

When inserting in the middle of a doubly linked list, **four** pointers change: the new node's `prev` and `next`, the previous node's `next` and the following node's `prev`.

## Circular linked list

In a **circular** list, the last node points back to the first instead of `NULL`. There is no natural end, so traversal stops when you return to the starting node. It is often accessed through a pointer to the **last** node, because `last->next` is the first node — giving O(1) insertion at both ends.

:::diagram list
nodes: 10 20 30 40
kind: circular
caption: A circular singly linked list. The last node's `next` points back to the first.
:::

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

Node *insertEnd(Node *last, int v) {          // returns the new last node
    Node *n = malloc(sizeof(Node));
    n->data = v;
    if (last == NULL) { n->next = n; return n; }   // one node points to itself
    n->next = last->next;                     // new node points to the first
    last->next = n;
    return n;
}

void print(Node *last) {
    if (!last) return;
    Node *p = last->next;                     // start at the first node
    do { printf("%d ", p->data); p = p->next; } while (p != last->next);
    printf("(back to %d)\n", last->next->data);
}

int main(void) {
    Node *last = NULL;
    for (int v = 10; v <= 40; v += 10) last = insertEnd(last, v);
    print(last);

    // Josephus-style round: remove every 2nd person until one remains
    Node *p = last;
    while (p->next != p) {
        p = p->next;                  // this person survives the round
        Node *out = p->next;          // the next one is removed
        p->next = out->next;
        printf("removed %d\n", out->data);
        free(out);
    }
    printf("survivor: %d\n", p->data);
    return 0;
}
```

:::info Where circular lists are used
Round-robin CPU scheduling (each process gets a turn, forever), multiplayer turn order, music playlists on repeat, and circular buffers in device drivers.
:::

## Which list should you use?

| | Singly | Doubly | Circular |
|---|---|---|---|
| Pointers per node | 1 | 2 | 1 (or 2 if doubly circular) |
| Traverse backwards | no | **yes** | no |
| Delete a node given only its pointer | no (needs previous) | **O(1)** | no |
| Memory | least | most | least |
| Natural use | stacks, simple lists | browser history, LRU caches, text editors | round-robin, repeating playlists |

:::quiz
Q. How many pointers change when inserting a node in the middle of a doubly linked list?
- 2
- 3
* 4
- 1
= The new node's `prev` and `next`, plus the neighbours' `next` and `prev`.

Q. How do you know you have finished traversing a circular linked list?
- When you reach `NULL`
* When you arrive back at the node you started from
- After exactly 100 steps
- When `data` is 0
= A circular list has no `NULL`, so you stop on returning to the start.

Q. Why is deleting a known node O(1) in a doubly linked list but not in a singly linked list?
* The doubly linked node knows its previous node through `prev`
- Doubly linked lists are always shorter
- Singly linked lists cannot be freed
- Doubly linked lists are stored in arrays
= In a singly linked list you must search from the head to find the previous node.

Q. Which application suits a circular linked list best?
- Undo history in a text editor
* Round-robin scheduling of processes
- Binary search
- Storing a sorted dictionary
= Round-robin cycles through items forever, exactly what a circular list models.
:::
