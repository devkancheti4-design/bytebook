=== oop-concepts | OOP Concepts
unit: Classes & Objects
desc: Why object-oriented programming exists, the difference from procedural code, and the four pillars — encapsulation, abstraction, inheritance and polymorphism.

**Procedural programming** (what you did in C) organises a program around **functions** that act on separate data. As programs grow, any function can modify any data, and changes ripple everywhere.

**Object-oriented programming (OOP)** organises a program around **objects** — bundles of **data** (attributes) and the **functions** that operate on it (methods). A bank account object owns its balance; nothing else may change it except through the account's own `deposit` and `withdraw` methods.

| Procedural | Object-oriented |
|---|---|
| program = functions + separate data | program = interacting objects |
| top-down design | bottom-up design: build objects, then combine them |
| data is often global and exposed | data is hidden inside objects |
| harder to reuse and extend | reuse through inheritance and composition |
| C, Pascal, Fortran | C++, Java, Python, C# |

## Class and object

- A **class** is a blueprint: it describes what data and behaviour objects of that kind have.
- An **object** is an **instance** of a class: a real thing built from the blueprint, with its own data.

`Car` is a class; *your* red Swift with registration KA-01-1234 is an object.

## The four pillars

### 1. Encapsulation

Bundling data with the methods that use it, and **hiding** the data from outside code (making it `private`). Outside code must go through public methods, which can check every change.

> A capsule hides the medicine inside; you just swallow it.

### 2. Abstraction

Showing **what** an object does while hiding **how** it does it. You call `car.start()` without knowing about fuel injection. In C++, abstraction comes from public interfaces, abstract classes and header files.

### 3. Inheritance

Creating a new class from an existing one, **reusing** its members and adding or changing some. A `Student` and a `Teacher` can both inherit from `Person`. It models an **is-a** relationship: a Student *is a* Person.

### 4. Polymorphism

"Many forms": the **same call** behaves differently depending on the object. `shape->area()` computes a circle's area for a `Circle` and a rectangle's for a `Rectangle`.

- **Compile-time** polymorphism: function and operator overloading.
- **Run-time** polymorphism: virtual functions.

## A preview in code

You will understand every line by the end of this unit:

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Shape {                               // abstraction: what every shape can do
public:
    virtual double area() const = 0;
    virtual string name() const = 0;
    virtual ~Shape() {}
};

class Circle : public Shape {               // inheritance
    double r;                               // encapsulation: hidden data
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
    string name() const override { return "Circle"; }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    string name() const override { return "Rectangle"; }
};

int main() {
    Circle c(1.5);
    Rectangle r(4, 2.5);
    const Shape *shapes[] = {&c, &r};
    for (const Shape *s : shapes)           // polymorphism: one call, many behaviours
        cout << s->name() << " area = " << s->area() << endl;
    return 0;
}
```

## Other OOP terms

| Term | Meaning |
|---|---|
| **Message passing** | objects interact by calling each other's methods |
| **Dynamic binding** | the method to run is chosen at run time (virtual functions) |
| **Composition** | a class contains objects of other classes — a **has-a** relationship (a Car *has an* Engine) |
| **Coupling** | how much classes depend on each other — keep it low |
| **Cohesion** | how focused a class is on one job — keep it high |

:::exam Pillars with examples
For "Explain the features of OOP", define each pillar in one line and give a C++ example: `private` members (encapsulation), an abstract class (abstraction), `class Student : public Person` (inheritance), overloading and virtual functions (polymorphism).
:::

:::quiz
Q. What is an object?
- A blueprint for creating classes
* An instance of a class
- A function inside a class
- A kind of pointer
= The class is the blueprint; each object is one concrete instance with its own data.

Q. Hiding a class's data and allowing access only through its methods is called...
* Encapsulation
- Inheritance
- Polymorphism
- Overloading
= Encapsulation bundles data with methods and restricts direct access.

Q. "A `Dog` is an `Animal`" is modelled with...
- Composition
* Inheritance
- Encapsulation
- A friend function
= An is-a relationship is inheritance; has-a is composition.

Q. Function overloading is an example of...
* Compile-time polymorphism
- Run-time polymorphism
- Encapsulation
- Inheritance
= The compiler picks the overload from the argument types at compile time.
:::

=== classes-objects | Classes & Objects
desc: Define a class with data members and member functions, create objects, control access with public and private, and define methods outside the class with ::.

## Defining a class

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Student {
public:                         // accessible from anywhere
    string name;
    int roll;
    double marks[3];

    double average() {          // member function (method)
        return (marks[0] + marks[1] + marks[2]) / 3;
    }
    void print() {
        cout << roll << " " << name << " avg " << average() << endl;
    }
};                              // note the semicolon!

int main() {
    Student s1;                 // create an object
    s1.name = "Asha";
    s1.roll = 7;
    s1.marks[0] = 88; s1.marks[1] = 92; s1.marks[2] = 79;
    s1.print();

    Student s2 = s1;            // copy: s2 has its own data
    s2.name = "Ravi";
    s2.roll = 8;
    s1.print();
    s2.print();
    return 0;
}
```

Each object has its **own copy of the data members**; member functions are shared by all objects of the class.

## Access specifiers

| Specifier | Accessible from |
|---|---|
| `public` | anywhere |
| `private` | only inside the class (and its friends) |
| `protected` | inside the class and classes derived from it |

In a `class`, members are **private by default**. In a `struct`, they are **public by default** — that is the only difference between the two in C++.

```cpp run
#include <iostream>
using namespace std;

class BankAccount {
private:
    double balance = 0;               // hidden: no one outside can set it to -1000

public:
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    bool withdraw(double amount) {
        if (amount <= 0 || amount > balance) return false;
        balance -= amount;
        return true;
    }
    double getBalance() { return balance; }
};

int main() {
    BankAccount acc;
    acc.deposit(5000);
    cout << "withdraw 7000: " << (acc.withdraw(7000) ? "ok" : "refused") << endl;
    cout << "withdraw 1200: " << (acc.withdraw(1200) ? "ok" : "refused") << endl;
    cout << "balance: " << acc.getBalance() << endl;
    // acc.balance = 1000000;   // error: 'balance' is a private member
    return 0;
}
```

## Defining methods outside the class

For longer methods, declare them inside the class and define them outside using the **scope resolution operator** `::`. This is how real projects split code between a header (`.h`) and a source file (`.cpp`).

```cpp run
#include <iostream>
using namespace std;

class Rectangle {
    double length, width;
public:
    void set(double l, double w);
    double area();
    double perimeter();
};

void Rectangle::set(double l, double w) { length = l; width = w; }
double Rectangle::area()                { return length * width; }
double Rectangle::perimeter()           { return 2 * (length + width); }

int main() {
    Rectangle r;
    r.set(7, 3);
    cout << "area " << r.area() << ", perimeter " << r.perimeter() << endl;
    return 0;
}
```

## Arrays of objects and objects as arguments

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Item {
public:
    string name;
    int qty;
    double price;
    double total() const { return qty * price; }
};

double billTotal(const Item items[], int n) {
    double sum = 0;
    for (int i = 0; i < n; i++) sum += items[i].total();
    return sum;
}

int main() {
    Item cart[3] = {{"Notebook", 4, 45.0}, {"Pen", 10, 12.5}, {"Geometry box", 1, 180.0}};
    for (const Item &it : cart)
        cout << it.name << " x" << it.qty << " = " << it.total() << endl;
    cout << "Bill: Rs " << billTotal(cart, 3) << endl;
    return 0;
}
```

## Memory for objects

`sizeof` an object counts only its **data members** (plus padding). Member functions are stored once, in the code, not inside each object:

```cpp run
#include <iostream>
using namespace std;

class Point {
    int x, y;
public:
    void move(int dx, int dy) { x += dx; y += dy; }
    int getX() { return x; }
};

int main() {
    cout << "sizeof(Point) = " << sizeof(Point) << " bytes (two ints)" << endl;
    return 0;
}
```

:::mistake Forgetting the semicolon after a class
`class A { ... }` without a trailing `;` produces confusing errors on the **next** line of code.
:::

:::quiz
Q. What is the default access level of members in a `class`?
- public
* private
- protected
- It depends on the compiler
= Class members are private unless you say otherwise; struct members are public.

Q. What does `::` do in `double Rectangle::area()`?
- Calls `area` on every Rectangle
* Says that `area` belongs to the class `Rectangle`
- Makes `area` static
- Creates a new object
= The scope resolution operator ties the definition to the class.

Q. Two objects of the same class...
* each have their own copy of the data members but share the member functions
- share all data members
- each have their own copy of the member functions
- cannot exist at the same time
= Data is per object; code is shared.

Q. Which line would fail to compile for the `BankAccount` class?
- `acc.deposit(100);`
- `acc.getBalance();`
* `acc.balance = 100;`
- `acc.withdraw(50);`
= `balance` is private, so code outside the class cannot touch it.
:::

=== constructors | Constructors & Destructors
desc: Initialise objects automatically: default, parameterised and copy constructors, initialiser lists, constructor overloading, and destructors with the order they run in.

A **constructor** is a special member function that runs **automatically when an object is created**. Its job is to put the object into a valid starting state.

- Same name as the class.
- **No return type** — not even `void`.
- Can be overloaded.

## Default and parameterised constructors

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Student {
    string name;
    int roll;
public:
    Student() {                                   // default constructor: no arguments
        name = "Unknown";
        roll = 0;
        cout << "default constructor" << endl;
    }
    Student(string n, int r) {                    // parameterised constructor
        name = n;
        roll = r;
        cout << "parameterised constructor for " << n << endl;
    }
    void show() { cout << roll << ": " << name << endl; }
};

int main() {
    Student a;                    // calls Student()
    Student b("Meera", 12);       // calls Student(string, int)
    Student c = {"Kiran", 13};    // also the parameterised one
    a.show(); b.show(); c.show();
    return 0;
}
```

:::warn The compiler's free constructor disappears
If you write **no** constructors, the compiler supplies a default one. As soon as you write **any** constructor, it does not — so `Student a;` stops compiling unless you also write `Student()`.
:::

## Initialiser lists

The preferred way to initialise members is a **member initialiser list**, after a colon. It initialises members directly instead of assigning them afterwards, and it is **required** for `const` members, reference members and base classes.

```cpp run
#include <iostream>
using namespace std;

class Circle {
    const double PI;           // const members must use the initialiser list
    double radius;
public:
    Circle(double r = 1.0) : PI(3.14159), radius(r) {}    // also a default constructor
    double area() const { return PI * radius * radius; }
};

int main() {
    Circle unit, big(10);
    cout << unit.area() << " " << big.area() << endl;
    return 0;
}
```

## Copy constructor

The **copy constructor** creates a new object as a copy of an existing one. It takes a **`const` reference** to an object of the same class. It runs when you:

1. initialise one object from another: `Point b = a;` or `Point b(a);`
2. pass an object **by value** to a function;
3. return an object by value (often optimised away).

```cpp run
#include <iostream>
using namespace std;

class Point {
    int x, y;
public:
    Point(int x, int y) : x(x), y(y) {}
    Point(const Point &other) : x(other.x), y(other.y) {     // copy constructor
        cout << "copying (" << x << ", " << y << ")" << endl;
    }
    void show() const { cout << "(" << x << ", " << y << ")" << endl; }
};

void display(Point p) { p.show(); }          // by value: copies

int main() {
    Point a(3, 4);
    Point b = a;                             // copy constructor
    display(a);                              // copy constructor again
    b.show();
    return 0;
}
```

:::exam Why must the copy constructor take a reference?
If it took its parameter **by value**, calling it would require copying the argument — which calls the copy constructor again, forever. Passing by reference breaks the infinite recursion.
:::

## Destructors

A **destructor** runs automatically when an object is destroyed — when it goes out of scope, or when you `delete` it. Its name is the class name with a tilde: `~Student()`. It takes no arguments, returns nothing, and cannot be overloaded. Use it to release resources: memory, files, network connections.

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Tracer {
    string name;
public:
    Tracer(string n) : name(n) { cout << "  construct " << name << endl; }
    ~Tracer()                  { cout << "  destroy   " << name << endl; }
};

Tracer global("global");

int main() {
    cout << "main starts" << endl;
    Tracer a("a");
    {
        Tracer b("b");
        Tracer c("c");
        cout << "  leaving inner block" << endl;
    }                                       // c then b destroyed here
    Tracer *d = new Tracer("d (heap)");
    delete d;                               // destroyed only when deleted
    cout << "main ends" << endl;
    return 0;
}                                           // a destroyed, then global
```

Objects are destroyed in the **reverse order** of construction — like a stack.

## Managing a resource: a dynamic array class

```cpp run
#include <iostream>
using namespace std;

class IntArray {
    int *data;
    int size;
public:
    IntArray(int n) : data(new int[n]()), size(n) {}          // () zero-initialises
    IntArray(const IntArray &o) : data(new int[o.size]), size(o.size) {   // deep copy
        for (int i = 0; i < size; i++) data[i] = o.data[i];
    }
    ~IntArray() { delete[] data; }
    int &at(int i) { return data[i]; }
    int length() const { return size; }
};

int main() {
    IntArray a(5);
    for (int i = 0; i < a.length(); i++) a.at(i) = i * i;
    IntArray b = a;                  // deep copy: b gets its own memory
    b.at(0) = 100;
    cout << "a[0] = " << a.at(0) << ", b[0] = " << b.at(0) << endl;
    return 0;
}
```

Without the copy constructor, `b` would share `a`'s pointer (a **shallow copy**): changing `b` would change `a`, and both destructors would `delete[]` the same memory. More on this in [Dynamic Memory & Smart Pointers](@cpp/memory).

:::quiz
Q. Which is true of constructors?
- They must return `void`
* They have no return type and the same name as the class
- They must be called explicitly
- A class can have only one constructor
= Constructors run automatically, have no return type and can be overloaded.

Q. When is the copy constructor **not** called?
- `Point b = a;`
- Passing a `Point` by value
* Assigning `b = a;` when `b` already exists
- `Point b(a);`
= Assigning to an existing object uses the copy **assignment operator**, not the copy constructor.

Q. In what order are local objects `x`, `y`, `z` (created in that order) destroyed?
- x, y, z
* z, y, x
- y, z, x
- Unspecified
= Destruction happens in reverse order of construction.

Q. Which members **must** be initialised in the initialiser list?
- All `int` members
* `const` members and references
- Static members
- Public members
= Const and reference members cannot be assigned after construction, only initialised.
:::

=== encapsulation | Encapsulation, this & static Members
desc: Getters and setters with validation, the this pointer, const member functions, and static data and functions shared by every object.

## Getters and setters

Encapsulation means keeping data `private` and exposing **controlled** access. A **setter** can validate input; a **getter** can return a value without exposing the variable itself.

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Employee {
    string name;
    double salary = 0;
public:
    void setName(const string &n) { if (!n.empty()) name = n; }
    void setSalary(double s) {
        if (s < 0) { cout << "Rejected negative salary " << s << endl; return; }
        salary = s;
    }
    string getName() const  { return name; }
    double getSalary() const { return salary; }
};

int main() {
    Employee e;
    e.setName("Divya");
    e.setSalary(65000);
    e.setSalary(-500);                         // the class protects its own data
    cout << e.getName() << " earns " << e.getSalary() << endl;
    return 0;
}
```

## The this pointer

Inside a member function, **`this`** is a pointer to the object the function was called on. You use it to tell members apart from parameters with the same name, and to return the object itself (which allows **method chaining**):

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Pizza {
    string size = "medium";
    int toppings = 0;
public:
    Pizza &setSize(const string &size) { this->size = size; return *this; }   // this->size is the member
    Pizza &addTopping()                { toppings++; return *this; }
    void print() const { cout << size << " pizza with " << toppings << " toppings" << endl; }
};

int main() {
    Pizza p;
    p.setSize("large").addTopping().addTopping().addTopping();   // chaining
    p.print();
    return 0;
}
```

## const member functions

A member function marked **`const`** promises not to modify the object. Only const functions can be called on `const` objects and through `const` references — so mark every getter `const`.

```cpp
class Account {
    double balance;
public:
    double getBalance() const { return balance; }   // OK: only reads
    void reset() const { balance = 0; }             // error: modifies a member in a const function
};
```

## static data members

A **static data member** belongs to the **class**, not to any object: there is exactly **one copy shared by all objects**. It must be defined once outside the class (or declared `inline static` in C++17).

## static member functions

A **static member function** can be called without any object, as `ClassName::function()`. It has no `this` pointer, so it can only use static members.

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Student {
    string name;
    int id;
    static int count;                 // one shared counter
public:
    Student(const string &n) : name(n), id(++count) {}
    ~Student() { count--; }
    void show() const { cout << "#" << id << " " << name << endl; }
    static int total() { return count; }   // no object needed
};

int Student::count = 0;               // definition of the static member

int main() {
    cout << "students: " << Student::total() << endl;
    Student a("Asha"), b("Ravi");
    {
        Student c("Meera");
        c.show();
        cout << "students: " << Student::total() << endl;
    }
    a.show(); b.show();
    cout << "students: " << Student::total() << endl;
    return 0;
}
```

| | Regular member | static member |
|---|---|---|
| Copies | one per object | one per class |
| Accessed via | an object: `s.name` | the class: `Student::count` |
| Function has `this`? | yes | no |
| Can use non-static members? | yes | no |

:::quiz
Q. What is `this` inside a member function?
* A pointer to the object the function was called on
- A copy of the object
- The class itself
- A reference to the first object ever created
= `this` points at the current object, so `this->x` is that object's `x`.

Q. How many copies of a static data member exist if you create 50 objects?
- 50
* 1
- 0
- 51
= Static members belong to the class and are shared.

Q. Which member functions can be called on a `const` object?
- Any member function
* Only those marked `const`
- Only static functions
- None
= Non-const functions might modify the object, so they are not allowed on const objects.

Q. Why can a static member function not access non-static members?
- They are private
* It has no `this` pointer, so there is no particular object to read from
- Static functions cannot return values
- It would be too slow
= A static function is called on the class, not on an object.
:::

=== friend | Friend Functions & Classes
desc: Grant selected functions or classes access to private members — when it is useful, how it works, and why to use it sparingly.

Private members are hidden from everything outside the class. Sometimes a function that is **not** a member genuinely needs that access — for example, a function that compares two objects of different classes, or an operator like `<<` whose left side is `cout`. A class can declare such a function its **friend**.

## Friend function

```cpp run
#include <iostream>
using namespace std;

class Box {
    double length, width, height;
public:
    Box(double l, double w, double h) : length(l), width(w), height(h) {}
    friend double volume(const Box &b);        // grant access
};

double volume(const Box &b) {                  // NOT a member: no Box:: and no this
    return b.length * b.width * b.height;      // but it may read private members
}

int main() {
    Box b(2, 3, 4);
    cout << "Volume: " << volume(b) << endl;
    return 0;
}
```

Properties of a friend function:

- It is declared inside the class with `friend`, but it is **not a member** — it is called like a normal function, `volume(b)`, not `b.volume()`.
- It can access the class's `private` and `protected` members through an object.
- The declaration can go in the `public` or `private` section; it makes no difference.

## A friend of two classes

A classic use: one function needs the private data of **two** classes.

```cpp run
#include <iostream>
using namespace std;

class Rupees;                                  // forward declaration

class Dollars {
    double amount;
public:
    Dollars(double a) : amount(a) {}
    friend bool richer(const Dollars &d, const Rupees &r);
};

class Rupees {
    double amount;
public:
    Rupees(double a) : amount(a) {}
    friend bool richer(const Dollars &d, const Rupees &r);
};

bool richer(const Dollars &d, const Rupees &r) {
    const double rate = 84.0;                  // rupees per dollar
    return d.amount * rate > r.amount;
}

int main() {
    Dollars savingsUS(150);
    Rupees savingsIN(11000);
    cout << (richer(savingsUS, savingsIN) ? "Dollar account is bigger" : "Rupee account is bigger") << endl;
    return 0;
}
```

## Friend class

A whole class can be a friend: all its member functions get access.

```cpp run
#include <iostream>
using namespace std;

class Engine {
    int horsepower = 120;
    friend class Mechanic;                     // Mechanic may see inside
};

class Mechanic {
public:
    void tune(Engine &e) { e.horsepower += 15; }
    int inspect(const Engine &e) { return e.horsepower; }
};

int main() {
    Engine e;
    Mechanic m;
    cout << "before: " << m.inspect(e) << " hp" << endl;
    m.tune(e);
    cout << "after:  " << m.inspect(e) << " hp" << endl;
    return 0;
}
```

## Friendship rules

1. **Not mutual**: if A declares B a friend, B can access A, but A cannot access B.
2. **Not inherited**: a friend of the base class is not automatically a friend of derived classes.
3. **Not transitive**: a friend of a friend is not a friend.

:::tip Use friends sparingly
Every friend weakens encapsulation. The most common legitimate use is overloading `<<` and `>>` for your class — see [Operator Overloading](@cpp/operator-overloading).
:::

:::quiz
Q. How is a friend function `f` of class `A` called?
- `a.f();`
* `f(a);`
- `A::f();`
- `this->f();`
= A friend is not a member, so it is called like an ordinary function.

Q. If class A declares class B as a friend, which is true?
* B's member functions can access A's private members
- A can access B's private members
- Both can access each other's private members
- Classes derived from B can access A's private members
= Friendship is one-way and not inherited.

Q. Does a friend function have a `this` pointer?
- Yes
* No
- Only if it is declared public
- Only inside the class body
= It is not a member function, so there is no current object.

Q. Why does the two-class example need `class Rupees;` before `Dollars`?
- To make Rupees a friend
* So `Dollars` can mention `Rupees` in the friend declaration before `Rupees` is defined
- To create a Rupees object
- It is optional style
= A forward declaration tells the compiler the name is a class.
:::
