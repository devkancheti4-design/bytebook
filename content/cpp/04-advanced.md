=== templates | Templates
unit: Beyond the Basics
desc: Write code once for any type: function templates, class templates, multiple type parameters, non-type parameters and specialisation — the foundation of the STL.

Suppose you need `maximum` for `int`, `double` and `string`. Overloading means three copies of identical code. A **template** lets you write the code **once** with a placeholder type; the compiler generates each version you use. This is **generic programming**.

## Function templates

```cpp run
#include <iostream>
#include <string>
using namespace std;

template <typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

template <typename T>
void swapAny(T &a, T &b) { T t = a; a = b; b = t; }

int main() {
    cout << maximum(3, 9) << endl;                          // T = int
    cout << maximum(2.5, 1.75) << endl;                     // T = double
    cout << maximum(string("apple"), string("mango")) << endl;
    cout << maximum<double>(4, 7.5) << endl;                // T given explicitly

    string a = "left", b = "right";
    swapAny(a, b);
    cout << a << " " << b << endl;
    return 0;
}
```

`typename` and `class` mean the same thing in a template parameter list: `template <class T>` is equally valid.

## Templates with arrays

```cpp run
#include <iostream>
using namespace std;

template <typename T>
T sum(const T arr[], int n) {
    T total = T();                 // zero for numbers
    for (int i = 0; i < n; i++) total += arr[i];
    return total;
}

template <typename T>
int linearSearch(const T arr[], int n, const T &key) {
    for (int i = 0; i < n; i++) if (arr[i] == key) return i;
    return -1;
}

int main() {
    int marks[] = {78, 85, 92};
    double prices[] = {9.99, 24.5, 3.25};
    char grades[] = {'A', 'B', 'O', 'C'};
    cout << sum(marks, 3) << " " << sum(prices, 3) << endl;
    cout << "'O' at index " << linearSearch(grades, 4, 'O') << endl;
    return 0;
}
```

## Class templates

A class template describes a family of classes. The STL's `vector<int>` and `stack<string>` are class templates.

```cpp run
#include <iostream>
#include <string>
#include <stdexcept>
using namespace std;

template <typename T, int CAPACITY = 100>       // a type parameter and a non-type parameter
class Stack {
    T items[CAPACITY];
    int top = -1;
public:
    void push(const T &x) {
        if (top == CAPACITY - 1) throw overflow_error("stack full");
        items[++top] = x;
    }
    T pop() {
        if (top == -1) throw underflow_error("stack empty");
        return items[top--];
    }
    bool empty() const { return top == -1; }
    int size() const { return top + 1; }
};

int main() {
    Stack<int> numbers;
    for (int i = 1; i <= 4; i++) numbers.push(i * i);
    cout << "popping ints:";
    while (!numbers.empty()) cout << " " << numbers.pop();
    cout << endl;

    Stack<string, 3> words;                      // capacity 3
    words.push("templates"); words.push("are"); words.push("neat");
    try { words.push("overflow!"); }
    catch (const overflow_error &e) { cout << "error: " << e.what() << endl; }
    cout << "words on stack: " << words.size() << endl;
    return 0;
}
```

## Two type parameters

```cpp run
#include <iostream>
#include <string>
using namespace std;

template <typename K, typename V>
class Pair {
public:
    K key;
    V value;
    Pair(K k, V v) : key(k), value(v) {}
    void show() const { cout << key << " -> " << value << endl; }
};

int main() {
    Pair<string, int> p1("Asha", 92);
    Pair<int, double> p2(7, 8.75);
    p1.show();
    p2.show();
    return 0;
}
```

## Template specialisation

Give a type its own special version when the generic code does not fit:

```cpp run
#include <iostream>
#include <cstring>
using namespace std;

template <typename T>
bool isEqual(T a, T b) { return a == b; }

template <>                                       // full specialisation for C strings
bool isEqual<const char *>(const char *a, const char *b) { return strcmp(a, b) == 0; }

int main() {
    char x[] = "hello", y[] = "hello";
    cout << boolalpha << isEqual(4, 4) << " " << isEqual<const char *>(x, y) << endl;
    return 0;
}
```

Without the specialisation, comparing two `const char *` would compare **addresses**, not text.

| Templates | Overloading | Macros |
|---|---|---|
| one definition, many types | one definition per type | text substitution |
| type-checked | type-checked | no type checking |
| code generated per type used | written by hand | expanded inline |

:::quiz
Q. What does `template <typename T>` do?
* Declares `T` as a placeholder type for the following function or class
- Creates a variable called `T`
- Includes the template library
- Makes the function inline
= The compiler substitutes the real type for `T` when the template is used.

Q. For `template <typename T> T big(T a, T b)`, what does `big(3, 4.5)` do?
- Returns 4.5
* Fails to compile, because T cannot be both `int` and `double`
- Returns 4
- Converts both to `float`
= Write `big<double>(3, 4.5)` to choose the type explicitly.

Q. In `template <typename T, int N> class Buffer`, what is `N`?
- A second type
* A non-type template parameter (a compile-time constant)
- A default argument
- The class size in bytes
= Non-type parameters let you pass constant values such as array sizes.

Q. Which STL component is a class template?
- `cout`
* `vector`
- `endl`
- `main`
= `vector<int>`, `vector<string>` and so on are generated from one class template.
:::

=== exceptions | Exception Handling
desc: Handle errors cleanly with try, throw and catch: standard exception classes, multiple and catch-all handlers, custom exceptions, and stack unwinding.

Programs meet errors at run time: division by zero, a missing file, bad input, memory exhaustion. Checking return codes everywhere clutters code and errors are easy to ignore. **Exceptions** separate error **detection** from error **handling**.

- **`throw`** — signal an error.
- **`try`** — wrap code that might throw.
- **`catch`** — handle a specific kind of error.

```cpp run
#include <iostream>
using namespace std;

double divide(double a, double b) {
    if (b == 0) throw "Division by zero!";        // throw a value
    return a / b;
}

int main() {
    try {
        cout << divide(10, 4) << endl;
        cout << divide(1, 0) << endl;              // throws: the rest of try is skipped
        cout << "never printed" << endl;
    } catch (const char *msg) {
        cout << "Error: " << msg << endl;
    }
    cout << "Program continues normally." << endl;
    return 0;
}
```

## Standard exception classes

The standard library throws objects derived from `std::exception`. Each has a `what()` method returning a message.

| Class (header `<stdexcept>`) | Typical cause |
|---|---|
| `invalid_argument` | a bad argument, e.g. `stoi("abc")` |
| `out_of_range` | index past the end, e.g. `vector::at(100)` |
| `length_error` | a container grown beyond its maximum |
| `overflow_error`, `underflow_error` | arithmetic range errors |
| `runtime_error` | general errors detectable only at run time |
| `bad_alloc` (`<new>`) | `new` failed to get memory |

```cpp run
#include <iostream>
#include <vector>
#include <string>
#include <stdexcept>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    try {
        cout << v.at(1) << endl;
        cout << v.at(10) << endl;                   // .at() checks bounds and throws
    } catch (const out_of_range &e) {
        cout << "out_of_range caught" << endl;
    }

    string inputs[] = {"42", "abc", "99999999999"};
    for (const string &s : inputs) {
        try {
            int n = stoi(s);                            // may throw
            cout << "stoi(\"" << s << "\") = " << n << endl;
        } catch (const invalid_argument &) {
            cout << "\"" << s << "\" is not a number" << endl;
        } catch (const out_of_range &) {
            cout << "\"" << s << "\" is too big for an int" << endl;
        }
    }
    return 0;
}
```

## Multiple catch blocks and catch-all

Handlers are tried **in order**; the first matching one runs. Put **specific** types before general ones, and `catch (...)` (catch anything) last:

```cpp run
#include <iostream>
#include <stdexcept>
using namespace std;

void risky(int option) {
    if (option == 1) throw 404;
    if (option == 2) throw runtime_error("disk not ready");
    if (option == 3) throw 3.14;
    cout << "option " << option << " ran fine" << endl;
}

int main() {
    for (int option = 0; option <= 3; option++) {
        try {
            risky(option);
        } catch (int code) {
            cout << "int error code " << code << endl;
        } catch (const exception &e) {                 // catches every std exception
            cout << "std::exception: " << e.what() << endl;
        } catch (...) {
            cout << "unknown error" << endl;
        }
    }
    return 0;
}
```

## Custom exceptions

Derive from `std::exception` (or `runtime_error`) to describe your own errors:

```cpp run stdin="2500"
#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

class InsufficientFunds : public runtime_error {
public:
    double shortBy;
    InsufficientFunds(double s) : runtime_error("insufficient funds"), shortBy(s) {}
};

class Account {
    double balance = 1000;
public:
    void withdraw(double amt) {
        if (amt <= 0) throw invalid_argument("amount must be positive");
        if (amt > balance) throw InsufficientFunds(amt - balance);
        balance -= amt;
    }
    double getBalance() const { return balance; }
};

int main() {
    Account acc;
    double amt;
    cout << "Withdraw how much? ";
    cin >> amt;
    try {
        acc.withdraw(amt);
        cout << "Done. Balance: " << acc.getBalance() << endl;
    } catch (const InsufficientFunds &e) {
        cout << "Failed: " << e.what() << " (short by Rs " << e.shortBy << ")" << endl;
    } catch (const invalid_argument &e) {
        cout << "Failed: " << e.what() << endl;
    }
    return 0;
}
```

## Stack unwinding

When an exception propagates out of functions, every local object on the way is **destroyed properly** — its destructor runs. This is why C++ resources should be owned by objects (RAII): cleanup happens automatically even on errors.

```cpp run
#include <iostream>
#include <stdexcept>
using namespace std;

struct Guard {
    const char *name;
    Guard(const char *n) : name(n) { cout << "acquire " << name << endl; }
    ~Guard() { cout << "release " << name << endl; }
};

void level2() { Guard g("file"); throw runtime_error("parse failed"); }
void level1() { Guard g("lock"); level2(); cout << "not reached" << endl; }

int main() {
    try { level1(); }
    catch (const exception &e) { cout << "caught: " << e.what() << endl; }
    return 0;
}
```

:::tip Catch by const reference
Write `catch (const exception &e)`. Catching by value copies the object and can **slice** a derived exception down to the base class, losing its information.
:::

:::quiz
Q. What happens to the remaining statements in a `try` block after an exception is thrown?
- They run before the catch block
* They are skipped; control jumps to a matching catch block
- The program restarts the try block
- They run after the catch block
= Throwing transfers control immediately to the nearest matching handler.

Q. Where should `catch (...)` appear?
- First
* Last
- Anywhere
- It is not valid C++
= It matches everything, so any handler after it would never run.

Q. Which exception does `vector::at()` throw for a bad index?
- `bad_alloc`
- `invalid_argument`
* `out_of_range`
- `overflow_error`
= `at()` checks bounds; `operator[]` does not.

Q. During stack unwinding, what happens to local objects in the functions being exited?
* Their destructors run
- They are leaked
- They are copied to the catch block
- Nothing
= Unwinding destroys each local object, which is why RAII cleanup is reliable.
:::

=== memory | Dynamic Memory & Smart Pointers
desc: new and delete, arrays on the heap, shallow vs deep copy, the rule of three, and modern smart pointers — unique_ptr and shared_ptr — that free memory for you.

## new and delete

C++ replaces `malloc`/`free` with **`new`** and **`delete`**. `new` allocates memory **and calls the constructor**; `delete` calls the **destructor** and frees the memory.

```cpp run
#include <iostream>
using namespace std;

class Book {
public:
    string title;
    Book(const string &t) : title(t) { cout << "construct " << title << endl; }
    ~Book() { cout << "destroy " << title << endl; }
};

int main() {
    int *n = new int(42);                 // one int, initialised to 42
    cout << *n << endl;
    delete n;

    int *arr = new int[5]{1, 2, 3, 4, 5}; // an array
    for (int i = 0; i < 5; i++) cout << arr[i] << " ";
    cout << endl;
    delete[] arr;                         // arrays need delete[]

    Book *b = new Book("C++ Primer");     // constructor runs
    cout << "reading " << b->title << endl;
    delete b;                             // destructor runs
    return 0;
}
```

| `malloc` / `free` | `new` / `delete` |
|---|---|
| function from `<cstdlib>` | operator built into the language |
| returns `void *`, needs a cast | returns the correct pointer type |
| size given in bytes | size computed from the type |
| does not call constructors/destructors | **calls constructors and destructors** |
| returns `NULL` on failure | throws `bad_alloc` on failure |

:::mistake delete vs delete[]
Memory from `new` must be released with `delete`; memory from `new[]` with `delete[]`. Mixing them is undefined behaviour.
:::

## Shallow copy vs deep copy

If a class owns heap memory through a pointer, the compiler's default copy copies the **pointer**, not the data — a **shallow copy**. Two objects then share one buffer, and both destructors free it: a crash.

A **deep copy** allocates new memory and copies the contents.

## The rule of three

If a class needs a custom **destructor**, it almost certainly also needs a custom **copy constructor** and **copy assignment operator**:

```cpp run
#include <iostream>
#include <cstring>
using namespace std;

class Name {
    char *text;
public:
    Name(const char *s) : text(new char[strlen(s) + 1]) { strcpy(text, s); }
    ~Name() { delete[] text; }                                     // 1. destructor
    Name(const Name &o) : text(new char[strlen(o.text) + 1]) {     // 2. copy constructor (deep)
        strcpy(text, o.text);
    }
    Name &operator=(const Name &o) {                               // 3. copy assignment (deep)
        if (this != &o) {                                          // guard against a = a
            char *fresh = new char[strlen(o.text) + 1];
            strcpy(fresh, o.text);
            delete[] text;
            text = fresh;
        }
        return *this;
    }
    void setFirst(char c) { text[0] = c; }
    const char *get() const { return text; }
};

int main() {
    Name a("asha");
    Name b = a;          // copy constructor
    Name c("x");
    c = a;               // copy assignment
    b.setFirst('U');
    c.setFirst('N');
    cout << a.get() << " " << b.get() << " " << c.get() << endl;   // each has its own buffer
    return 0;
}
```

(C++11 extends this to the **rule of five** by adding a move constructor and move assignment. Even better is the **rule of zero**: let standard types like `string`, `vector` and smart pointers own the memory, and write none of these functions.)

## Smart pointers

Manual `delete` is easy to forget, especially when exceptions fly. **Smart pointers** in `<memory>` own heap objects and free them automatically — the RAII idea applied to memory.

### unique_ptr: sole ownership

```cpp run
#include <iostream>
#include <memory>
using namespace std;

struct Sensor {
    int id;
    Sensor(int i) : id(i) { cout << "sensor " << id << " on" << endl; }
    ~Sensor() { cout << "sensor " << id << " off" << endl; }
};

int main() {
    unique_ptr<Sensor> a = make_unique<Sensor>(1);
    cout << "reading sensor " << a->id << endl;
    // unique_ptr<Sensor> b = a;          // error: cannot copy a unique_ptr
    unique_ptr<Sensor> b = std::move(a);  // ownership moves to b
    cout << "a is " << (a ? "set" : "empty") << ", b owns sensor " << b->id << endl;
    {
        auto c = make_unique<Sensor>(2);
    }                                     // c's sensor freed here automatically
    cout << "end of main" << endl;
    return 0;
}                                         // b's sensor freed here
```

### shared_ptr: shared ownership

A `shared_ptr` keeps a **reference count**; the object is deleted when the last `shared_ptr` to it is destroyed.

```cpp run
#include <iostream>
#include <memory>
#include <string>
using namespace std;

struct Playlist {
    string name;
    Playlist(string n) : name(n) {}
    ~Playlist() { cout << "deleting playlist " << name << endl; }
};

int main() {
    shared_ptr<Playlist> mine = make_shared<Playlist>("Coding Lo-fi");
    cout << "owners: " << mine.use_count() << endl;
    {
        shared_ptr<Playlist> friendCopy = mine;
        cout << "owners: " << mine.use_count() << endl;
    }
    cout << "owners: " << mine.use_count() << endl;
    mine.reset();                          // last owner gone: object deleted
    cout << "done" << endl;
    return 0;
}
```

| Smart pointer | Ownership | Copyable? | Use for |
|---|---|---|---|
| `unique_ptr` | exactly one owner | no (move only) | the default choice |
| `shared_ptr` | many owners, reference counted | yes | genuinely shared objects |
| `weak_ptr` | observes a `shared_ptr` without owning | yes | breaking reference cycles |

:::quiz
Q. What does `new` do that `malloc` does not?
- Allocates memory on the stack
* Calls the object's constructor
- Returns `void *`
- Frees memory automatically
= `new` allocates and constructs; `delete` destructs and frees.

Q. Memory allocated with `new int[10]` must be freed with...
- `delete`
* `delete[]`
- `free`
- nothing
= Array allocations need the array form of delete.

Q. Which three functions does the rule of three refer to?
* Destructor, copy constructor, copy assignment operator
- Constructor, destructor, `main`
- `new`, `delete`, `malloc`
- Getter, setter, constructor
= A class managing a resource usually needs all three to copy and clean up correctly.

Q. When is the object owned by `shared_ptr` deleted?
- When the first `shared_ptr` is destroyed
* When the last `shared_ptr` owning it is destroyed or reset
- Never
- At the end of `main` only
= The reference count reaching zero triggers deletion.
:::

=== stl-containers | STL Containers
desc: The Standard Template Library's ready-made data structures: vector, list, deque, stack, queue, priority_queue, set, map and their unordered versions — with costs.

The **Standard Template Library (STL)** gives you tested, fast implementations of every structure from the Data Structures course. It has three parts: **containers** (data structures), **iterators** (a uniform way to walk through containers) and **algorithms** (sort, search and more — next lesson).

## vector: the default container

A `vector` is a **dynamic array**: contiguous memory that grows as needed (the `realloc` doubling trick from C, done for you).

```cpp run
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {5, 3, 8};
    v.push_back(1);                       // add at the end: amortised O(1)
    v.push_back(9);
    cout << "size " << v.size() << ", front " << v.front() << ", back " << v.back() << endl;
    v.insert(v.begin() + 1, 42);          // insert at index 1: O(n)
    v.pop_back();                         // remove the last element
    v.erase(v.begin());                   // remove the first element: O(n)
    for (int x : v) cout << x << " ";
    cout << endl;

    vector<vector<int>> grid(3, vector<int>(4, 0));   // 3x4 matrix of zeros
    grid[1][2] = 7;
    cout << "grid[1][2] = " << grid[1][2] << ", rows " << grid.size() << endl;
    return 0;
}
```

## Stack, queue and priority_queue

These are **container adapters** with a restricted interface — exactly the ADTs from Data Structures:

```cpp run
#include <iostream>
#include <stack>
#include <queue>
#include <vector>
#include <functional>
using namespace std;

int main() {
    stack<int> s;
    for (int i = 1; i <= 3; i++) s.push(i);
    cout << "stack pops:";
    while (!s.empty()) { cout << " " << s.top(); s.pop(); }

    queue<string> q;
    q.push("first"); q.push("second"); q.push("third");
    cout << "\nqueue pops:";
    while (!q.empty()) { cout << " " << q.front(); q.pop(); }

    priority_queue<int> maxHeap;                                  // largest on top
    priority_queue<int, vector<int>, greater<int>> minHeap;       // smallest on top
    for (int x : {40, 10, 70, 30}) { maxHeap.push(x); minHeap.push(x); }
    cout << "\nmax-heap top: " << maxHeap.top() << ", min-heap top: " << minHeap.top() << endl;
    return 0;
}
```

## set and map

`set` stores **unique keys in sorted order**; `map` stores **sorted key → value pairs**. Both are balanced binary search trees (red-black trees): O(log n) insert, find and erase.

```cpp run
#include <iostream>
#include <set>
#include <map>
#include <string>
using namespace std;

int main() {
    set<int> s = {5, 1, 5, 3, 1, 9};          // duplicates ignored
    s.insert(4);
    cout << "set:";
    for (int x : s) cout << " " << x;          // always sorted
    cout << "\ncontains 3? " << (s.count(3) ? "yes" : "no") << endl;

    map<string, int> marks;
    marks["Asha"] = 91;
    marks["Ravi"] = 78;
    marks["Meera"] = 85;
    marks["Ravi"] += 5;                        // update
    for (const auto &[name, m] : marks)        // sorted by key
        cout << name << ": " << m << endl;
    if (marks.find("Zoya") == marks.end()) cout << "Zoya not found" << endl;
    return 0;
}
```

## unordered_map: hash tables

`unordered_map` and `unordered_set` are **hash tables**: O(1) average lookup, but no ordering. Perfect for counting:

```cpp run
#include <iostream>
#include <unordered_map>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string text = "the cat and the dog and the bird";
    unordered_map<string, int> freq;
    stringstream ss(text);
    string word;
    while (ss >> word) freq[word]++;           // missing keys start at 0
    for (string w : {"the", "and", "cat", "fish"})
        cout << w << ": " << freq[w] << endl;
    return 0;
}
```

## Choosing a container

| Container | Underlying structure | Access | Insert/erase | Find |
|---|---|---|---|---|
| `vector` | dynamic array | O(1) by index | O(1) at end, O(n) elsewhere | O(n) |
| `deque` | blocks of arrays | O(1) by index | O(1) at both ends | O(n) |
| `list` | doubly linked list | O(n) | O(1) with an iterator | O(n) |
| `stack` / `queue` | adapter (deque by default) | top / front only | O(1) | — |
| `priority_queue` | binary heap | top only | O(log n) | — |
| `set` / `map` | red-black tree | — | O(log n) | O(log n), sorted |
| `unordered_set` / `unordered_map` | hash table | — | O(1) average | O(1) average |

:::tip Default to vector
Start with `vector`. Switch to `unordered_map` for fast lookup by key, `map`/`set` when you need sorted order, and the adapters when the problem is literally a stack, queue or priority queue.
:::

:::quiz
Q. Which container is a dynamic array?
* `vector`
- `list`
- `set`
- `map`
= `vector` stores elements contiguously and grows automatically.

Q. What does iterating over a `std::map<string, int>` produce?
- Pairs in insertion order
* Pairs sorted by key
- Pairs in random order
- Only the values
= `map` is a balanced BST ordered by key.

Q. What is the average lookup cost in `unordered_map`?
* O(1)
- O(log n)
- O(n)
- O(n log n)
= It is a hash table; the worst case is O(n), the average O(1).

Q. Which declaration creates a **min**-heap of ints?
- `priority_queue<int> pq;`
* `priority_queue<int, vector<int>, greater<int>> pq;`
- `set<int> pq;`
- `stack<int> pq;`
= The default priority_queue is a max-heap; `greater<int>` reverses the order.
:::

=== stl-algorithms | Iterators, Algorithms & Lambdas
desc: Walk any container with iterators, then use the STL algorithms — sort, find, count, binary_search, accumulate, transform — with lambda functions for custom behaviour.

## Iterators

An **iterator** is an object that points to an element of a container and can move to the next one — a generalised pointer. `begin()` points to the first element; `end()` points **one past** the last.

```cpp run
#include <iostream>
#include <vector>
#include <list>
using namespace std;

int main() {
    vector<int> v = {10, 20, 30, 40};
    for (vector<int>::iterator it = v.begin(); it != v.end(); ++it)
        cout << *it << " ";                    // dereference like a pointer
    cout << endl;

    list<string> names = {"Asha", "Ravi", "Meera"};
    for (auto it = names.rbegin(); it != names.rend(); ++it)   // reverse iterators
        cout << *it << " ";
    cout << endl;
    return 0;
}
```

Because every container offers iterators, one algorithm works on **all** of them.

## Lambda expressions

A **lambda** is an unnamed function written inline: `[capture](parameters) { body }`. It is the easiest way to give an algorithm custom behaviour.

```cpp run
#include <iostream>
using namespace std;

int main() {
    auto square = [](int x) { return x * x; };
    int bonus = 5;
    auto addBonus = [bonus](int m) { return m + bonus; };     // captures bonus by value
    int calls = 0;
    auto counter = [&calls]() { calls++; };                    // captures calls by reference
    counter(); counter(); counter();
    cout << square(7) << " " << addBonus(80) << " " << calls << endl;
    return 0;
}
```

## The essential algorithms

```cpp run
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <string>
using namespace std;

void show(const vector<int> &v) { for (int x : v) cout << x << " "; cout << endl; }

int main() {
    vector<int> v = {42, 7, 19, 7, 88, 3, 25};

    sort(v.begin(), v.end());                                   // ascending
    cout << "sorted:        "; show(v);
    sort(v.begin(), v.end(), [](int a, int b) { return a > b; });   // descending
    cout << "descending:    "; show(v);

    cout << "max element:   " << *max_element(v.begin(), v.end()) << endl;
    cout << "sum:           " << accumulate(v.begin(), v.end(), 0) << endl;
    cout << "count of 7:    " << count(v.begin(), v.end(), 7) << endl;
    cout << "count > 20:    " << count_if(v.begin(), v.end(), [](int x) { return x > 20; }) << endl;

    auto it = find(v.begin(), v.end(), 19);
    cout << "19 found at index " << (it - v.begin()) << endl;

    sort(v.begin(), v.end());
    cout << "binary_search 25: " << boolalpha << binary_search(v.begin(), v.end(), 25) << endl;
    v.erase(unique(v.begin(), v.end()), v.end());              // remove adjacent duplicates
    cout << "unique:        "; show(v);
    reverse(v.begin(), v.end());
    cout << "reversed:      "; show(v);

    vector<int> doubled(v.size());
    transform(v.begin(), v.end(), doubled.begin(), [](int x) { return 2 * x; });
    cout << "doubled:       "; show(doubled);
    return 0;
}
```

## Sorting objects

Pass a comparison lambda to sort by any field:

```cpp run
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

struct Student { string name; int marks; };

int main() {
    vector<Student> cls = {{"Asha", 88}, {"Ravi", 95}, {"Meera", 88}, {"Kiran", 72}};
    stable_sort(cls.begin(), cls.end(), [](const Student &a, const Student &b) {
        return a.marks > b.marks;               // highest marks first; ties keep their order
    });
    int rank = 1;
    for (const auto &s : cls) cout << rank++ << ". " << s.name << " " << s.marks << endl;
    return 0;
}
```

| Algorithm | Does | Cost |
|---|---|---|
| `sort` | sort a range (introsort) | O(n log n) |
| `stable_sort` | sort, keeping equal elements in order | O(n log n) |
| `find`, `find_if` | first match | O(n) |
| `count`, `count_if` | number of matches | O(n) |
| `binary_search`, `lower_bound` | search a **sorted** range | O(log n) |
| `accumulate` (`<numeric>`) | sum or fold | O(n) |
| `min_element`, `max_element` | position of the min / max | O(n) |
| `reverse`, `rotate`, `unique` | rearrange | O(n) |
| `transform` | apply a function to every element | O(n) |

:::quiz
Q. What does `v.end()` point to?
- The last element
* One position past the last element
- The first element
- `nullptr`
= `end()` is a sentinel; dereferencing it is invalid.

Q. Which call sorts `v` in descending order?
- `sort(v.begin(), v.end());`
* `sort(v.begin(), v.end(), [](int a, int b) { return a > b; });`
- `reverse(v.begin(), v.end());` on an unsorted vector
- `sort(v.end(), v.begin());`
= The comparator returns true when `a` should come before `b`.

Q. In `[&total](int x) { total += x; }`, how is `total` captured?
- By value
* By reference
- Not at all
- As a global
= `&` captures by reference, so the lambda can modify the original.

Q. What must be true before calling `binary_search`?
* The range must be sorted
- The range must contain no duplicates
- The container must be a `set`
- Nothing
= Binary search relies on order to halve the range.
:::

=== file-io | File I/O with fstream
desc: Read and write files the C++ way with ifstream, ofstream and fstream: modes, line-by-line reading, parsing records with stringstream, and binary files.

C++ file handling uses **streams**, exactly like `cin` and `cout`. Include `<fstream>`:

| Class | Purpose |
|---|---|
| `ofstream` | write to a file (output) |
| `ifstream` | read from a file (input) |
| `fstream` | both |

## Writing and reading text

```cpp run
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    ofstream out("notes.txt");                    // creates or truncates the file
    if (!out) { cerr << "cannot open file" << endl; return 1; }
    out << "Templates make code generic." << endl;
    out << "Exceptions separate error handling." << endl;
    out << "RAII frees resources automatically." << endl;
    out.close();

    ifstream in("notes.txt");
    string line;
    int n = 0;
    while (getline(in, line))                      // read until end of file
        cout << ++n << ": " << line << endl;
    return 0;                                     // in closes automatically (RAII)
}
```

## File modes

| Flag | Meaning |
|---|---|
| `ios::in` | open for reading |
| `ios::out` | open for writing (truncates by default) |
| `ios::app` | append: every write goes to the end |
| `ios::ate` | start at the end, but allow moving around |
| `ios::trunc` | erase existing contents |
| `ios::binary` | binary mode (no newline translation) |

Combine flags with `|`: `fstream f("data.txt", ios::in | ios::out);`

## Reading structured records

Write records as text, then read them back with `>>` or parse each line with a `stringstream`:

```cpp run
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <iomanip>
using namespace std;

int main() {
    ofstream out("students.csv");
    out << "roll,name,marks\n101,Asha,88\n102,Ravi,93\n103,Meera,79\n";
    out.close();

    ifstream in("students.csv");
    string line;
    getline(in, line);                                  // skip the header
    double total = 0;
    int count = 0;
    cout << left << setw(6) << "Roll" << setw(8) << "Name" << "Marks" << endl;
    while (getline(in, line)) {
        stringstream ss(line);
        string roll, name, marksText;
        getline(ss, roll, ',');                         // split on commas
        getline(ss, name, ',');
        getline(ss, marksText, ',');
        int marks = stoi(marksText);
        cout << setw(6) << roll << setw(8) << name << marks << endl;
        total += marks;
        count++;
    }
    cout << "Average: " << fixed << setprecision(2) << total / count << endl;

    ofstream log("students.csv", ios::app);              // append a new record
    log << "104,Kiran,85\n";
    return 0;
}
```

## Binary files

Binary I/O writes raw bytes — compact and fast, but not human-readable:

```cpp run
#include <iostream>
#include <fstream>
using namespace std;

struct Reading { int sensor; double value; };

int main() {
    Reading data[3] = {{1, 21.5}, {2, 22.25}, {3, 19.75}};
    ofstream out("readings.bin", ios::binary);
    out.write(reinterpret_cast<const char *>(data), sizeof(data));
    out.close();

    ifstream in("readings.bin", ios::binary);
    in.seekg(sizeof(Reading) * 2);                   // jump to the third record
    Reading r;
    in.read(reinterpret_cast<char *>(&r), sizeof(r));
    cout << "sensor " << r.sensor << " read " << r.value << endl;
    cout << "file size: " << sizeof(data) << " bytes" << endl;
    return 0;
}
```

`seekg` / `tellg` move and report the **get** (read) position; `seekp` / `tellp` do the same for the **put** (write) position.

:::quiz
Q. Which class do you use to read from a file?
- `ofstream`
* `ifstream`
- `ostream`
- `cout`
= `ifstream` is an input file stream.

Q. How do you open `log.txt` so new writes are added at the end?
- `ofstream f("log.txt");`
* `ofstream f("log.txt", ios::app);`
- `ifstream f("log.txt", ios::app);`
- `ofstream f("log.txt", ios::trunc);`
= `ios::app` appends; the default for ofstream truncates.

Q. What does `while (getline(in, line))` stop on?
* End of file (or a read error)
- An empty line
- A line containing a space
- After 100 lines
= `getline` returns the stream, which converts to false when reading fails.

Q. Why is it often unnecessary to call `close()` explicitly on file streams?
- Files never need closing
* The stream's destructor closes the file when it goes out of scope
- `endl` closes the file
- The OS closes it immediately after each write
= File streams follow RAII.
:::

=== cheatsheet | C++ OOP Cheat Sheet & Exam Prep
desc: The whole OOPS course on one page: syntax for classes, constructors, inheritance and polymorphism, the comparisons examiners love, and programs to practise.

## Class skeleton

```cpp
class Name : public Base {             // inheritance
private:                               // hidden data
    int value;
    static int count;                  // shared by all objects
public:
    Name(int v = 0) : Base(), value(v) { count++; }      // constructor + initialiser list
    Name(const Name &o) : Base(o), value(o.value) {}     // copy constructor
    Name &operator=(const Name &o);                      // copy assignment
    virtual ~Name() {}                                   // virtual destructor

    int get() const { return value; }                    // const getter
    void set(int v) { if (v >= 0) value = v; }           // validating setter
    virtual void show() const override;                  // runtime polymorphism
    static int total() { return count; }                 // class-level function
    friend ostream &operator<<(ostream &, const Name &); // friend operator
};
int Name::count = 0;
```

## OOP pillars in one table

| Pillar | Idea | C++ tool |
|---|---|---|
| Encapsulation | bundle data and methods, hide data | `private`, getters/setters |
| Abstraction | expose what, hide how | public interface, abstract classes |
| Inheritance | reuse and extend (is-a) | `class D : public B` |
| Polymorphism | one interface, many forms | overloading (compile time), `virtual` (run time) |

## Comparisons examiners ask

| Topic | Key difference |
|---|---|
| `struct` vs `class` | default access: public vs private |
| Constructor vs destructor | creates/initialises vs cleans up; destructor has `~`, no parameters, no overloading |
| Copy constructor vs assignment | initialise a **new** object vs overwrite an **existing** one |
| Shallow vs deep copy | copies the pointer vs copies the pointed-to data |
| Overloading vs overriding | same name, different parameters (compile time) vs same signature in derived class (run time, `virtual`) |
| Static vs dynamic binding | decided at compile time vs at run time through vtable |
| Abstract class vs interface | has some pure virtual functions vs only pure virtual functions |
| Pointer vs reference | nullable, re-seatable vs always bound, alias |
| `new`/`delete` vs `malloc`/`free` | calls constructors/destructors, type-safe, throws `bad_alloc` |
| Function template vs overloading | one generic definition vs one definition per type |

## Inheritance access table

| Base member | public inheritance | protected inheritance | private inheritance |
|---|---|---|---|
| public | public | protected | private |
| protected | protected | protected | private |
| private | not accessible | not accessible | not accessible |

## Operators you cannot overload

`::` &nbsp; `.` &nbsp; `.*` &nbsp; `?:` &nbsp; `sizeof` &nbsp; `typeid`

## STL quick picks

| Need | Use |
|---|---|
| growable array | `vector<T>` |
| LIFO / FIFO | `stack<T>` / `queue<T>` |
| always the largest (smallest) | `priority_queue<T>` (with `greater<T>`) |
| sorted unique keys | `set<T>` |
| sorted key → value | `map<K, V>` |
| fastest lookup by key | `unordered_map<K, V>` |
| sort / search | `sort`, `binary_search`, `lower_bound` |

## Programs to practise

1. Class `Student`/`Employee`/`BankAccount` with constructors, getters, setters and validation.
2. Count objects with a `static` member.
3. Copy constructor demonstrating deep copy.
4. `Complex` or `Fraction` with `+`, `-`, `*`, `==`, `<<`, `>>` overloaded.
5. Multilevel inheritance showing constructor/destructor order.
6. Shape hierarchy with an abstract base class and virtual functions.
7. Function template `maximum`, class template `Stack<T>`.
8. Custom exception class with `try`/`catch`.
9. Word frequency with `map` or `unordered_map`.
10. Read and write student records with `fstream`.

:::quiz Final check: mixed revision
Q. Which is resolved at run time?
- Function overloading
- Operator overloading
* A virtual function called through a base-class pointer
- A template instantiation
= Virtual dispatch happens at run time via the vtable; the others are compile time.

Q. What is printed?
```cpp
class A { public: A() { cout << "A"; } ~A() { cout << "a"; } };
class B : public A { public: B() { cout << "B"; } ~B() { cout << "b"; } };
int main() { B obj; }
```
- `ABab`
* `ABba`
- `BAab`
- `BAba`
= Constructors run base first (A then B); destructors run in reverse (b then a).

Q. Which declaration makes `Shape` abstract?
- `virtual void draw();`
* `virtual void draw() = 0;`
- `void draw() const;`
- `static void draw();`
= A pure virtual function (`= 0`) makes the class abstract.

Q. Which container would you choose to count word frequencies fastest?
- `vector<string>`
- `list<string>`
* `unordered_map<string, int>`
- `stack<string>`
= Hash-table lookups are O(1) on average.
:::
