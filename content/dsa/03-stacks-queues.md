=== stack | Stack
unit: Stacks & Queues
desc: Last in, first out: push, pop and peek, overflow and underflow, and two implementations — with an array and with a linked list.

A **stack** is a collection where you can only add or remove at **one end**, called the **top**. The last item pushed is the first one popped: **LIFO** (Last In, First Out). Think of a pile of plates, the browser Back button, or Undo in a text editor.

:::diagram stack
items: 10 20 30 40
caption: Items are pushed and popped at the top. 40 was pushed last, so it will be popped first.
:::

## Operations

| Operation | Meaning | Cost |
|---|---|---|
| `push(x)` | put `x` on top | O(1) |
| `pop()` | remove and return the top item | O(1) |
| `peek()` / `top()` | look at the top item without removing it | O(1) |
| `isEmpty()` | is the stack empty? | O(1) |
| `isFull()` | (array version) is it at capacity? | O(1) |

Pushing onto a full array stack is **overflow**; popping from an empty stack is **underflow**.

## Try it

:::widget stack
:::

## Array implementation

Keep an array and an index `top` of the current top element. An empty stack has `top = -1`.

```c run
#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

int isEmpty(void) { return top == -1; }
int isFull(void)  { return top == MAX - 1; }

void push(int x) {
    if (isFull()) { printf("Overflow: cannot push %d\n", x); return; }
    stack[++top] = x;
    printf("pushed %d\n", x);
}

int pop(void) {
    if (isEmpty()) { printf("Underflow\n"); return -1; }
    return stack[top--];
}

int peek(void) { return isEmpty() ? -1 : stack[top]; }

int main(void) {
    for (int i = 1; i <= 6; i++) push(i * 10);    // the 6th push overflows
    printf("top is %d\n", peek());
    printf("popped %d\n", pop());
    printf("popped %d\n", pop());
    printf("top is now %d\n", peek());
    return 0;
}
```

## Linked-list implementation

Push and pop at the **head** of a linked list — both O(1) — and the stack never overflows (until memory runs out):

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;
Node *top = NULL;

void push(int x) {
    Node *n = malloc(sizeof(Node));
    n->data = x;
    n->next = top;
    top = n;
}

int pop(void) {
    if (top == NULL) { printf("Underflow\n"); return -1; }
    Node *t = top;
    int x = t->data;
    top = t->next;
    free(t);
    return x;
}

int main(void) {
    const char *word = "STACK";
    for (int i = 0; word[i]; i++) push(word[i]);
    printf("Reversed: ");
    while (top != NULL) printf("%c", pop());     // LIFO reverses the order
    printf("\n");
    pop();
    return 0;
}
```

## Array vs linked-list stack

| | Array | Linked list |
|---|---|---|
| Size | fixed (overflow possible) | grows as needed |
| Memory per item | just the data | data + pointer |
| Speed | very fast, cache-friendly | `malloc` per push |

## Where stacks are used

- **Function calls** — the call stack stores each function's local variables and return address.
- **Undo/redo** and the **browser Back button**.
- **Expression evaluation** and **bracket matching** — next lesson.
- **Depth-first search** and **backtracking** (mazes, Sudoku).
- **Reversing** anything: strings, lists, the digits of a number.

:::quiz
Q. A stack follows which order?
- FIFO
* LIFO
- Random
- Sorted
= Last In, First Out: the newest item is removed first.

Q. Push 1, 2, 3, then pop twice, then push 4. What is on top?
- 1
- 2
- 3
* 4
= After the pops only 1 remains; pushing 4 puts it on top.

Q. In the array implementation, what does `top == -1` mean?
* The stack is empty
- The stack is full
- The top element is −1
- Overflow happened
= `top` is the index of the top element, so −1 means no elements.

Q. What is popping from an empty stack called?
- Overflow
* Underflow
- Segmentation
- Collision
= Underflow is removing from an empty stack; overflow is pushing onto a full one.
:::

=== stack-applications | Stack Applications
desc: Balanced brackets, infix to postfix conversion and postfix evaluation — the three stack algorithms every CSE 102 exam asks you to trace.

## 1. Balanced brackets

Every opening bracket must be closed by the matching bracket **in the right order**. Push each opener; on each closer, pop and check it matches.

```c run
#include <stdio.h>

int isBalanced(const char *s) {
    char st[100];
    int top = -1;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') st[++top] = c;
        else if (c == ')' || c == ']' || c == '}') {
            if (top == -1) return 0;                       // closer with nothing open
            char o = st[top--];
            if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) return 0;
        }
    }
    return top == -1;                                      // anything left open?
}

int main(void) {
    const char *tests[] = {"{[a+b]*(c-d)}", "([)]", "((x)", "a[i] = (b + c) * {d}"};
    for (int i = 0; i < 4; i++)
        printf("%-22s %s\n", tests[i], isBalanced(tests[i]) ? "balanced" : "NOT balanced");
    return 0;
}
```

## Infix, prefix and postfix

| Notation | Operator position | `A + B * C` | Needs brackets? |
|---|---|---|---|
| Infix | between operands | `A + B * C` | yes, plus precedence rules |
| Prefix (Polish) | before operands | `+ A * B C` | no |
| Postfix (Reverse Polish) | after operands | `A B C * +` | no |

Computers prefer **postfix**: it can be evaluated left to right with one stack and no precedence rules.

## 2. Infix to postfix (shunting-yard)

Scan the infix expression left to right:

1. **Operand** → write it to the output.
2. **`(`** → push it.
3. **`)`** → pop to the output until the matching `(`; discard both brackets.
4. **Operator** → while the stack top is an operator of **higher precedence**, or **equal precedence and left-associative**, pop it to the output. Then push the new operator.
5. At the end, pop everything left to the output.

Precedence: `^` (highest, right-associative) > `* /` > `+ -`.

```c run
#include <stdio.h>
#include <ctype.h>

int prec(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

void toPostfix(const char *in, char *out) {
    char st[100];
    int top = -1, k = 0;
    for (int i = 0; in[i]; i++) {
        char c = in[i];
        if (isalnum((unsigned char)c)) out[k++] = c;
        else if (c == '(') st[++top] = c;
        else if (c == ')') {
            while (top >= 0 && st[top] != '(') out[k++] = st[top--];
            top--;                                            // discard '('
        } else if (prec(c)) {
            while (top >= 0 && st[top] != '(' &&
                   (prec(st[top]) > prec(c) || (prec(st[top]) == prec(c) && c != '^')))
                out[k++] = st[top--];
            st[++top] = c;
        }
    }
    while (top >= 0) out[k++] = st[top--];
    out[k] = '\0';
}

int main(void) {
    const char *exprs[] = {"A+B*C", "(A+B)*C", "A+B*C-D/E", "A*(B+C)/D", "A^B^C", "(A-B/C)*(A/K-L)"};
    char post[100];
    for (int i = 0; i < 6; i++) {
        toPostfix(exprs[i], post);
        printf("%-18s ->  %s\n", exprs[i], post);
    }
    return 0;
}
```

### Tracing `A+B*C-D/E`

| Symbol | Action | Stack | Output |
|---|---|---|---|
| A | output | | A |
| + | push | + | A |
| B | output | + | AB |
| * | higher than +, push | + * | AB |
| C | output | + * | ABC |
| - | pop `*` and `+` (≥ precedence), push `-` | - | ABC*+ |
| D | output | - | ABC*+D |
| / | higher than -, push | - / | ABC*+D |
| E | output | - / | ABC*+DE |
| end | pop all | | ABC*+DE/- |

:::exam How to score full marks
Draw exactly this three-column table (symbol, stack, postfix) for every step. Examiners award most of the marks for the trace, not just the final answer.
:::

## 3. Evaluating postfix

Scan left to right. Push numbers. On an operator, **pop two** values — the first pop is the **right** operand — apply the operator and push the result.

```c run
#include <stdio.h>
#include <ctype.h>

int evalPostfix(const char *s) {
    int st[100], top = -1;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == ' ') continue;
        if (isdigit((unsigned char)c)) {
            int num = 0;
            while (isdigit((unsigned char)s[i])) num = num * 10 + (s[i++] - '0');
            i--;
            st[++top] = num;
        } else {
            int b = st[top--], a = st[top--];       // b is popped first: the right operand
            switch (c) {
                case '+': st[++top] = a + b; break;
                case '-': st[++top] = a - b; break;
                case '*': st[++top] = a * b; break;
                case '/': st[++top] = a / b; break;
            }
        }
    }
    return st[top];
}

int main(void) {
    printf("2 3 1 * + 9 -  = %d\n", evalPostfix("2 3 1 * + 9 -"));
    printf("6 2 / 3 -      = %d\n", evalPostfix("6 2 / 3 -"));
    printf("10 2 8 * + 3 - = %d\n", evalPostfix("10 2 8 * + 3 -"));
    return 0;
}
```

Trace of `2 3 1 * + 9 -`: push 2, 3, 1 → `*` pops 1 and 3, pushes 3 → `+` pops 3 and 2, pushes 5 → push 9 → `-` pops 9 and 5, pushes 5 − 9 = **−4**.

:::mistake Operand order
For `-` and `/`, order matters. With postfix `6 2 /`, the first value popped (2) is the **right** operand: 6 / 2 = 3, not 2 / 6.
:::

## Prefix evaluation

Prefix works the same way but scanning **right to left**, and the first value popped is the **left** operand. Example: `- + 2 * 3 1 9` evaluates to (2 + 3 × 1) − 9 = −4.

:::quiz
Q. What is the postfix form of `(A + B) * (C - D)`?
- `A B C D + - *`
* `A B + C D - *`
- `* + A B - C D`
- `A + B C - D *`
= Each bracketed part becomes its own postfix group, followed by `*`.

Q. Evaluate the postfix expression `5 1 2 + 4 * + 3 -`.
- 12
* 14
- 18
- 10
= 1 + 2 = 3; 3 × 4 = 12; 5 + 12 = 17; 17 − 3 = 14.

Q. Which string is **not** balanced?
- `{[()]}`
- `()[]{}`
* `([)]`
- `((()))`
= In `([)]`, `)` arrives when `[` is on top of the stack.

Q. Why is postfix easier for a computer to evaluate than infix?
* It needs no brackets or precedence rules — one left-to-right pass with a stack
- It uses fewer operators
- It is shorter
- Computers can only read postfix
= Postfix encodes the order of operations in the order of the symbols.
:::

=== queue | Queue & Circular Queue
desc: First in, first out: enqueue and dequeue, why a simple array queue wastes space, and how the circular queue fixes it — plus a linked-list queue.

A **queue** adds at one end (the **rear**) and removes from the other (the **front**): **FIFO** — First In, First Out. It models every real queue: people at a ticket counter, print jobs, network packets, processes waiting for the CPU.

:::diagram queue
items: 10 20 30 40
caption: Enqueue at the rear, dequeue from the front. 10 arrived first, so it leaves first.
:::

| Operation | Meaning | Cost |
|---|---|---|
| `enqueue(x)` | add `x` at the rear | O(1) |
| `dequeue()` | remove and return the front item | O(1) |
| `front()` / `peek()` | look at the front item | O(1) |
| `isEmpty()`, `isFull()` | status checks | O(1) |

## The problem with a simple array queue

Use `front` and `rear` indexes into an array. Enqueue does `a[++rear] = x`; dequeue does `front++`. But after a few dequeues, the empty slots at the start of the array are **never reused**: the queue reports "full" when `rear` reaches the end, even if it is mostly empty.

:::diagram array
values: _ _ _ 40 50
pointers: front=3 rear=4
caption: Linear queue after three dequeues: slots 0–2 are wasted, and `rear` is already at the end.
:::

## Circular queue

The fix: let the indexes **wrap around** to 0 using `% capacity`. The array behaves like a ring.

- enqueue: `rear = (rear + 1) % N; a[rear] = x;`
- dequeue: `x = a[front]; front = (front + 1) % N;`
- keep a `count` to tell full from empty.

:::widget queue
:::

```c run
#include <stdio.h>
#define N 5

int q[N], front = 0, rear = -1, count = 0;

int enqueue(int x) {
    if (count == N) { printf("Queue full, cannot add %d\n", x); return 0; }
    rear = (rear + 1) % N;
    q[rear] = x;
    count++;
    return 1;
}

int dequeue(void) {
    if (count == 0) { printf("Queue empty\n"); return -1; }
    int x = q[front];
    front = (front + 1) % N;
    count--;
    return x;
}

void show(void) {
    printf("queue (front -> rear): ");
    for (int i = 0; i < count; i++) printf("%d ", q[(front + i) % N]);
    printf("  [front=%d rear=%d]\n", front, rear);
}

int main(void) {
    for (int i = 1; i <= 5; i++) enqueue(i * 10);
    show();
    enqueue(60);                         // full
    printf("dequeued %d\n", dequeue());
    printf("dequeued %d\n", dequeue());
    enqueue(60);                         // reuses slot 0
    enqueue(70);                         // reuses slot 1
    show();
    return 0;
}
```

:::note Without a count variable
Many textbooks leave one slot empty instead: the queue is **empty** when `front == rear` and **full** when `(rear + 1) % N == front`. Both approaches are correct — know whichever your teacher uses.
:::

## Linked-list queue

Keep pointers to **both** ends: enqueue at the tail, dequeue at the head. Both are O(1), and there is no fixed capacity.

```c run
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;
Node *front = NULL, *rear = NULL;

void enqueue(int x) {
    Node *n = malloc(sizeof(Node));
    n->data = x; n->next = NULL;
    if (rear == NULL) front = rear = n;
    else { rear->next = n; rear = n; }
}

int dequeue(void) {
    if (front == NULL) return -1;
    Node *t = front;
    int x = t->data;
    front = front->next;
    if (front == NULL) rear = NULL;      // queue became empty
    free(t);
    return x;
}

int main(void) {
    const char *jobs[] = {"report.pdf", "notes.docx", "photo.png"};
    for (int i = 0; i < 3; i++) { enqueue(i); printf("queued %s\n", jobs[i]); }
    int j;
    while ((j = dequeue()) != -1) printf("printing %s\n", jobs[j]);
    return 0;
}
```

## Stack vs queue

| | Stack | Queue |
|---|---|---|
| Order | LIFO | FIFO |
| Insert at | top | rear |
| Remove from | top | front |
| Typical uses | undo, recursion, DFS, parsing | scheduling, buffering, BFS |

:::quiz
Q. Enqueue 5, 8, 3, then dequeue once. What is at the front?
- 5
* 8
- 3
- The queue is empty
= FIFO: 5 leaves first, so 8 is now at the front.

Q. In a circular queue of size 6, `rear` is 5. Where does the next element go?
* Index 0
- Index 6
- Index 5 again
- Nowhere, the queue is full
= `(5 + 1) % 6 = 0`, provided the queue is not full.

Q. What problem does a circular queue solve?
- It makes dequeue O(1)
* Space freed at the front of a linear array queue can be reused
- It allows random access
- It sorts the elements
= Wrapping indexes around turns the array into a ring.

Q. Which algorithm uses a queue?
- Depth-first search
* Breadth-first search
- Infix-to-postfix conversion
- Recursion
= BFS explores level by level, processing vertices in the order they were discovered.
:::

=== deque-priority | Deque & Priority Queue
desc: Two useful queue variations: the double-ended queue and the priority queue, with array-based implementations and where each one shines.

## Deque (double-ended queue)

A **deque** (pronounced "deck") allows insertion and deletion at **both ends**. It can act as a stack *or* a queue.

| Operation | Effect |
|---|---|
| `pushFront(x)` / `pushBack(x)` | insert at the front / rear |
| `popFront()` / `popBack()` | remove from the front / rear |

Special cases: an **input-restricted deque** allows insertion at one end only; an **output-restricted deque** allows deletion at one end only.

A circular array makes every deque operation O(1):

```c run
#include <stdio.h>
#define N 8

int d[N], front = 0, size = 0;

void pushBack(int x)  { d[(front + size) % N] = x; size++; }
void pushFront(int x) { front = (front - 1 + N) % N; d[front] = x; size++; }
int popFront(void)    { int x = d[front]; front = (front + 1) % N; size--; return x; }
int popBack(void)     { size--; return d[(front + size) % N]; }

void show(const char *msg) {
    printf("%-14s [", msg);
    for (int i = 0; i < size; i++) printf(i ? " %d" : "%d", d[(front + i) % N]);
    printf("]\n");
}

int main(void) {
    pushBack(20); pushBack(30); show("pushBack x2:");
    pushFront(10); show("pushFront 10:");
    pushBack(40); show("pushBack 40:");
    printf("popFront -> %d\n", popFront());
    printf("popBack  -> %d\n", popBack());
    show("now:");
    return 0;
}
```

:::info Sliding-window problems
Deques power a famous trick: the maximum of every window of size k in an array, in O(n) total, by keeping indexes of useful candidates in a deque.
:::

## Priority queue

In a **priority queue**, each element has a priority, and `dequeue` always removes the element with the **highest priority** (or lowest, for a min-priority queue) — not the oldest. Hospital emergency rooms, CPU scheduling and Dijkstra's shortest-path algorithm all use one.

Possible implementations:

| Implementation | Insert | Remove highest |
|---|---|---|
| Unsorted array | O(1) | O(n) — scan for the max |
| Sorted array | O(n) — shift into place | O(1) |
| **Binary heap** | **O(log n)** | **O(log n)** |

A sorted array is simple and fine for small inputs:

```c run
#include <stdio.h>

typedef struct { char name[12]; int priority; } Patient;
Patient pq[10];
int n = 0;

void insert(const char *name, int pr) {           // keep sorted by priority, highest last
    int i = n - 1;
    while (i >= 0 && pq[i].priority > pr) { pq[i + 1] = pq[i]; i--; }
    snprintf(pq[i + 1].name, sizeof pq[i + 1].name, "%s", name);
    pq[i + 1].priority = pr;
    n++;
}

Patient removeMax(void) { return pq[--n]; }

int main(void) {
    insert("Anil", 2);     // 1 = mild ... 5 = critical
    insert("Bhavna", 5);
    insert("Chetan", 1);
    insert("Divya", 4);
    while (n > 0) {
        Patient p = removeMax();
        printf("treating %-7s (priority %d)\n", p.name, p.priority);
    }
    return 0;
}
```

For large inputs, use a **binary heap**, which gives O(log n) for both operations — covered in [Heaps & Heap Sort](@dsa/heaps).

:::quiz
Q. Which structure allows insertion and deletion at both ends?
- Stack
- Queue
* Deque
- Priority queue
= A double-ended queue supports push and pop at the front and rear.

Q. In a max-priority queue, which element is removed first?
- The oldest
- The newest
* The one with the highest priority
- A random one
= Priority, not arrival time, decides the order.

Q. What is the best common implementation of a priority queue?
- Sorted linked list
* Binary heap
- Stack
- Circular queue
= A heap gives O(log n) insertion and removal.

Q. An output-restricted deque allows deletion at...
* only one end
- both ends
- no end
- the middle
= Output-restricted means removals happen at one end only, while insertions can happen at both.
:::
