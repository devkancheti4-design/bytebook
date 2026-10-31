=== intro | C++ Introduction
unit: From C to C++
desc: Where C++ came from, what it adds to C, your first program with iostream and namespaces, and how to compile it.

**C++** was created by **Bjarne Stroustrup** at Bell Labs, starting in **1979** as "C with Classes". It keeps almost everything from C — the speed, the pointers, the control over memory — and adds tools for organising large programs: **classes and objects**, **references**, **function overloading**, **templates**, **exceptions** and a huge **Standard Template Library (STL)**.

C++ powers game engines (Unreal), browsers (Chrome, Firefox), databases, trading systems, compilers and most performance-critical software you use.

## Your first C++ program

```cpp run
#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    std::cout << "2 + 3 = " << 2 + 3 << "\n";
    return 0;
}
```

| Line | Meaning |
|---|---|
| `#include <iostream>` | the input/output stream library (no `.h`) |
| `std::cout` | the standard **c**haracter **out**put stream — the screen |
| `<<` | the **insertion operator**: sends the value on its right into the stream |
| `std::endl` | ends the line and flushes the output; `"\n"` just ends the line |
| `std::` | everything in the standard library lives in the namespace `std` |

## Namespaces and using

A **namespace** groups names to avoid clashes — two libraries can both have a `sort` function if they live in different namespaces. Writing `std::` everywhere is precise; `using namespace std;` lets you drop the prefix:

```cpp run
#include <iostream>
using namespace std;

namespace physics { double g = 9.8; }
namespace games   { double g = 1.6; }     // same name, different namespace

int main() {
    cout << "Earth gravity: " << physics::g << endl;
    cout << "Moon gravity in our game: " << games::g << endl;
    return 0;
}
```

:::tip using namespace std
It is fine in small programs and exam answers. In large projects and header files, prefer writing `std::` so names from different libraries never collide.
:::

## Compiling

```bash
g++ hello.cpp -o hello      # g++ is the C++ compiler from GCC
./hello
g++ -std=c++17 -Wall hello.cpp -o hello   # pick a standard and turn on warnings
```

## What C++ adds to C

| Feature | C | C++ |
|---|---|---|
| Programming style | procedural | procedural **and** object-oriented **and** generic |
| Input/output | `printf`, `scanf` | `cout`, `cin` (type-safe) |
| Data + functions together | no | **classes** |
| References | no | `int &r = x;` |
| Function overloading | no | yes |
| Default arguments | no | yes |
| Dynamic memory | `malloc` / `free` | `new` / `delete` |
| Strings | `char` arrays | `std::string` |
| Error handling | return codes | **exceptions** |
| Generic code | macros, `void *` | **templates** |
| Ready-made data structures | none | **STL**: vector, map, set, … |

Almost any valid C program is also a valid C++ program, so everything from CSE 101 still applies.

:::exam C vs C++
A common 5-mark question. Use the table above, and add: C++ supports the four OOP pillars (encapsulation, abstraction, inheritance, polymorphism); C does not. C++ has stricter type checking.
:::

:::quiz
Q. Who created C++?
* Bjarne Stroustrup
- Dennis Ritchie
- James Gosling
- Ken Thompson
= Stroustrup started "C with Classes" at Bell Labs in 1979.

Q. What does `<<` do in `cout << x;`?
- Shifts `x` left by one bit
* Inserts the value of `x` into the output stream
- Reads a value into `x`
- Compares `cout` with `x`
= With streams, `<<` is the insertion operator.

Q. Why does C++ have namespaces?
- To make programs run faster
* To avoid name clashes between different libraries
- To replace classes
- To store variables in the heap
= Two libraries can define the same name in different namespaces.

Q. Which of these is **not** a C++ feature that C lacks?
- References
- Function overloading
* Pointers
- Templates
= C already has pointers; references, overloading and templates are C++ additions.
:::

=== io-references | Input/Output, Strings & References
desc: Read and write with cin and cout, use the std::string class, format output with iomanip, and meet references — C++'s safer alias for a variable.

## cin: reading input

`cin` (character input) reads values with the **extraction operator** `>>`. It works out the type from the variable — no format specifiers and no `&`:

```cpp run stdin="Ravi 19 8.6"
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    int age;
    double cgpa;
    cout << "Name, age and CGPA: ";
    cin >> name >> age >> cgpa;
    cout << name << " is " << age << " with a CGPA of " << cgpa << endl;
    return 0;
}
```

Like `scanf("%s")`, `cin >> name` stops at whitespace. To read a whole line, use `getline`:

```cpp run stdin="21\nRavi Kumar Sharma"
#include <iostream>
#include <string>
using namespace std;

int main() {
    int roll;
    string fullName;
    cout << "Roll number: ";
    cin >> roll;
    cin.ignore();                       // skip the newline left after the number
    cout << "Full name: ";
    getline(cin, fullName);
    cout << "#" << roll << ": " << fullName << " (" << fullName.length() << " characters)" << endl;
    return 0;
}
```

## The string class

`std::string` grows automatically, knows its own length, and supports `+`, `==` and `<` directly:

```cpp run
#include <iostream>
#include <string>
using namespace std;

int main() {
    string a = "Data", b = "Structures";
    string full = a + " " + b;                 // concatenation
    cout << full << " has " << full.size() << " characters" << endl;
    cout << "First letter: " << full[0] << ", last: " << full.back() << endl;
    cout << "Substring: " << full.substr(5, 6) << endl;         // from index 5, length 6
    cout << "\"Struct\" found at " << full.find("Struct") << endl;
    full.replace(0, 4, "Algo");
    cout << "After replace: " << full << endl;
    cout << boolalpha << ("apple" < string("banana")) << endl;   // dictionary order
    for (char c : string("abc")) cout << char(c - 32);           // range-based for
    cout << endl;
    return 0;
}
```

## Formatting with iomanip

```cpp run
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double pi = 3.14159265;
    cout << fixed << setprecision(2) << pi << endl;          // 2 decimal places
    cout << setw(8) << 42 << "|" << endl;                      // width 8, right-aligned
    cout << left << setw(8) << 42 << "|" << endl;              // left-aligned
    cout << setfill('0') << right << setw(5) << 7 << endl;     // pad with zeros
    cout << hex << 255 << " " << oct << 8 << dec << endl;      // number bases
    return 0;
}
```

## References

A **reference** is another name (an alias) for an existing variable. It must be initialised when declared and can never be re-seated to refer to something else.

```cpp run
#include <iostream>
using namespace std;

int main() {
    int marks = 70;
    int &r = marks;          // r is another name for marks
    r += 15;
    cout << "marks = " << marks << ", r = " << r << endl;
    cout << "same address? " << (&marks == &r ? "yes" : "no") << endl;
    return 0;
}
```

The real power of references is in function parameters — the subject of the next lesson.

| Pointer | Reference |
|---|---|
| can be `nullptr` | always refers to a valid object |
| can be re-pointed later | bound once, forever |
| needs `*` to read, `&` to take an address | used like the variable itself |
| can do arithmetic | no arithmetic |
| has its own memory | usually just an alias |

## bool and auto

C++ has a built-in `bool` type with `true` and `false`. And `auto` lets the compiler deduce a variable's type from its initialiser:

```cpp run
#include <iostream>
#include <vector>
using namespace std;

int main() {
    bool passed = true;
    auto count = 42;            // int
    auto ratio = 0.75;          // double
    auto name = string("Asha"); // std::string
    cout << boolalpha << passed << " " << count << " " << ratio << " " << name << endl;
    vector<int> v = {3, 1, 4};
    for (auto x : v) cout << x * 10 << " ";
    cout << endl;
    return 0;
}
```

:::quiz
Q. Which reads a full line, including spaces, into `string s`?
- `cin >> s;`
* `getline(cin, s);`
- `scanf("%s", s);`
- `cin.get(s);`
= `>>` stops at whitespace; `getline` reads up to the newline.

Q. What is printed by `string s = "hello"; cout << s.size();`?
- 6
* 5
- 4
- An error
= `size()` (or `length()`) counts characters; there is no separate `'\0'` to count.

Q. Which statement about references is true?
- A reference can be null
* A reference must be initialised and cannot be changed to refer to another variable
- A reference stores a copy of the value
- References require `*` to read the value
= A reference is a permanent alias bound at initialisation.

Q. What does `cout << fixed << setprecision(1) << 2.46;` print?
- 2.46
* 2.5
- 2.4
- 2
= `fixed` with precision 1 rounds to one decimal place.
:::

=== functions | Functions: Overloading, Defaults & Inline
desc: What C++ adds to functions: pass by reference, const references, function overloading, default arguments and inline functions.

## Pass by reference

A reference parameter lets a function change the caller's variable — without pointers:

```cpp run
#include <iostream>
using namespace std;

void swapValues(int &a, int &b) {     // a and b are aliases for the caller's variables
    int t = a;
    a = b;
    b = t;
}

int main() {
    int x = 3, y = 8;
    swapValues(x, y);                 // no & needed at the call
    cout << "x = " << x << ", y = " << y << endl;
    return 0;
}
```

Compare the three ways of passing an argument:

| | By value | By pointer (C style) | By reference |
|---|---|---|---|
| Declaration | `void f(int a)` | `void f(int *a)` | `void f(int &a)` |
| Call | `f(x)` | `f(&x)` | `f(x)` |
| Can change caller's variable | no | yes | yes |
| Copies the argument | yes | no (copies an address) | no |

## const references

Passing a large object (like a long `string` or `vector`) **by value** copies the whole thing. Pass it as a **`const` reference** instead: no copy, and the function promises not to change it.

```cpp run
#include <iostream>
#include <string>
using namespace std;

int countVowels(const string &s) {      // fast and read-only
    int n = 0;
    for (char c : s)
        if (string("aeiouAEIOU").find(c) != string::npos) n++;
    return n;
}

int main() {
    string text = "Object Oriented Programming";
    cout << countVowels(text) << " vowels" << endl;
    return 0;
}
```

:::tip Rule of thumb
Small built-in types (`int`, `double`, `char`): pass by value. Objects (`string`, `vector`, your own classes): pass by `const &`, or by `&` if the function must modify them.
:::

## Function overloading

Several functions can share a name if their **parameter lists differ** (in number or types). The compiler picks the right one from the arguments — this is **compile-time polymorphism**.

```cpp run
#include <iostream>
using namespace std;

int area(int side)                 { return side * side; }               // square
int area(int length, int width)    { return length * width; }            // rectangle
double area(double radius)         { return 3.14159 * radius * radius; } // circle

int main() {
    cout << "square 4:      " << area(4) << endl;
    cout << "rectangle 4x6: " << area(4, 6) << endl;
    cout << "circle 2.0:    " << area(2.0) << endl;
    return 0;
}
```

:::warn Return type alone is not enough
`int f(int)` and `double f(int)` cannot coexist: a call like `f(3)` would be ambiguous. Overloads must differ in their **parameters**.
:::

## Default arguments

Parameters can have default values, used when the caller leaves them out. Defaults must come **last** in the parameter list:

```cpp run
#include <iostream>
using namespace std;

double simpleInterest(double principal, double rate = 7.5, int years = 1) {
    return principal * rate * years / 100;
}

int main() {
    cout << simpleInterest(10000) << endl;          // rate 7.5, 1 year
    cout << simpleInterest(10000, 8) << endl;       // 1 year
    cout << simpleInterest(10000, 8, 3) << endl;
    return 0;
}
```

## Inline functions

`inline` suggests that the compiler paste the function body at each call, avoiding call overhead for tiny functions. It is a safer replacement for function-like macros because arguments are evaluated once and type-checked:

```cpp run
#include <iostream>
using namespace std;

inline int cube(int x) { return x * x * x; }
#define CUBE(x) x * x * x

int main() {
    cout << "inline cube(1 + 2) = " << cube(1 + 2) << endl;    // 27
    cout << "macro  CUBE(1 + 2) = " << CUBE(1 + 2) << endl;    // 1 + 2*1 + 2*1 + 2 = 7
    return 0;
}
```

Modern compilers decide on inlining by themselves, so `inline` is mostly a hint (and today it matters mainly for functions defined in headers).

:::quiz
Q. Which declaration lets `f` change the caller's `int` without pointers?
- `void f(int a)`
* `void f(int &a)`
- `void f(const int &a)`
- `void f(int a = 0)`
= A non-const reference parameter aliases the caller's variable.

Q. Which pair is a **valid** overload?
- `int f(int)` and `double f(int)`
* `int f(int)` and `int f(double)`
- `int f(int a)` and `int f(int b)`
- None of these
= Overloads must differ in parameter types or count; return type and parameter names do not count.

Q. Which default-argument declaration is valid?
- `void f(int a = 1, int b);`
* `void f(int a, int b = 2);`
- `void f(int a = 1, int b, int c = 3);`
- `void f(= 1);`
= Parameters with defaults must come after all parameters without defaults.

Q. Why pass a large `string` as `const string &`?
* It avoids copying the string and prevents the function from modifying it
- It makes the string longer
- It is required for strings
- It converts the string to a C string
= A const reference gives read-only access without the cost of a copy.
:::
