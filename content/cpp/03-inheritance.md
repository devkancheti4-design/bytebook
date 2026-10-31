=== inheritance | Inheritance
unit: Inheritance & Polymorphism
desc: Reuse and extend classes: base and derived classes, public/protected/private inheritance, the five types of inheritance, constructor order, and the diamond problem.

**Inheritance** lets a new class (the **derived** or child class) take on the members of an existing class (the **base** or parent class), then add its own or change some. It models an **is-a** relationship and avoids writing the same code twice.

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Person {                                   // base class
protected:
    string name;
    int age;
public:
    Person(const string &n, int a) : name(n), age(a) {}
    void introduce() const { cout << "I am " << name << ", " << age << " years old." << endl; }
};

class Student : public Person {                  // Student is-a Person
    string course;
public:
    Student(const string &n, int a, const string &c) : Person(n, a), course(c) {}
    void study() const { cout << name << " is studying " << course << "." << endl; }   // can use protected name
};

int main() {
    Student s("Asha", 19, "Data Structures");
    s.introduce();      // inherited from Person
    s.study();          // Student's own
    return 0;
}
```

## Access in derived classes

A derived class can use the base's `public` and `protected` members, but **never** its `private` ones. The **mode** of inheritance (`public`, `protected`, `private`) then decides how inherited members appear to the outside world:

| Base member | `public` inheritance | `protected` inheritance | `private` inheritance |
|---|---|---|---|
| `public` | public | protected | private |
| `protected` | protected | protected | private |
| `private` | not accessible | not accessible | not accessible |

`public` inheritance is by far the most common — it is the one that means "is-a".

## Types of inheritance

| Type | Shape | Example |
|---|---|---|
| **Single** | one base → one derived | `Car : Vehicle` |
| **Multilevel** | chain: A → B → C | `Vehicle → Car → ElectricCar` |
| **Multiple** | one class, several bases | `SmartPhone : Phone, Camera` |
| **Hierarchical** | one base, several derived | `Shape → Circle, Square, Triangle` |
| **Hybrid** | a mix of the above | multiple + multilevel together |

:::diagram tree
tree: Vehicle(Car(ElectricCar),Bike,Truck)
shape: box
caption: Multilevel (Vehicle → Car → ElectricCar) and hierarchical (Vehicle → Car, Bike, Truck) inheritance in one picture.
:::

## Multilevel inheritance and constructor order

Constructors run from the **base down** to the most derived class; destructors run in the **reverse** order.

```cpp run
#include <iostream>
using namespace std;

class Vehicle {
public:
    Vehicle()  { cout << "Vehicle constructor" << endl; }
    ~Vehicle() { cout << "Vehicle destructor" << endl; }
};
class Car : public Vehicle {
public:
    Car()  { cout << "  Car constructor" << endl; }
    ~Car() { cout << "  Car destructor" << endl; }
};
class ElectricCar : public Car {
public:
    ElectricCar()  { cout << "    ElectricCar constructor" << endl; }
    ~ElectricCar() { cout << "    ElectricCar destructor" << endl; }
};

int main() {
    ElectricCar tesla;
    cout << "--- object in use ---" << endl;
    return 0;
}
```

## Multiple inheritance

```cpp run
#include <iostream>
using namespace std;

class Camera {
public:
    void takePhoto() const { cout << "Click! Photo saved." << endl; }
};
class Phone {
public:
    void call(const char *who) const { cout << "Calling " << who << "..." << endl; }
};
class SmartPhone : public Phone, public Camera {      // two bases
public:
    void browse() const { cout << "Opening browser." << endl; }
};

int main() {
    SmartPhone p;
    p.call("Mom");
    p.takePhoto();
    p.browse();
    return 0;
}
```

## The diamond problem and virtual base classes

In hybrid inheritance, a class can inherit the **same base twice**:

:::diagram graph
nodes: Person(1,0) Student(0,1) Employee(2,1) TA(1,2)
edges: Student>Person Employee>Person TA>Student TA>Employee
caption: The diamond: a teaching assistant is both a Student and an Employee, and both are Persons. Arrows point from derived to base.
:::

Without help, `TA` would contain **two** copies of `Person`, and `ta.name` would be **ambiguous**. Declaring the shared base `virtual` makes the derived classes share **one** copy:

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Person {
public:
    string name;
    Person(const string &n = "") : name(n) { cout << "Person(" << n << ")" << endl; }
};
class Student  : virtual public Person { public: Student()  { cout << "Student" << endl; } };
class Employee : virtual public Person { public: Employee() { cout << "Employee" << endl; } };

class TA : public Student, public Employee {
public:
    TA(const string &n) : Person(n) { cout << "TA" << endl; }   // the most derived class builds the shared base
};

int main() {
    TA ta("Nikhil");
    cout << "name = " << ta.name << " (only one Person inside)" << endl;
    return 0;
}
```

## Overriding (redefining) base functions

A derived class can define a function with the same signature as the base, replacing its behaviour. The base version is still reachable with `Base::function()`:

```cpp run
#include <iostream>
using namespace std;

class Account {
public:
    double interestRate() const { return 3.0; }
};
class SeniorCitizenAccount : public Account {
public:
    double interestRate() const { return Account::interestRate() + 0.5; }   // reuse, then extend
};

int main() {
    Account a;
    SeniorCitizenAccount s;
    cout << "regular: " << a.interestRate() << "%, senior: " << s.interestRate() << "%" << endl;
    return 0;
}
```

Without `virtual`, which version runs depends on the **declared type** of the pointer or reference — the problem that [virtual functions](@cpp/virtual-functions) solve.

:::exam Questions to expect
1. Define inheritance and list its types with diagrams.
2. Table of access specifiers vs inheritance modes (above).
3. Order of constructor and destructor calls in multilevel inheritance.
4. What is the diamond problem and how do virtual base classes solve it?
:::

:::quiz
Q. Can a derived class access its base class's `private` members directly?
- Yes, always
- Only with public inheritance
* No, never
- Only in constructors
= Private members are only accessible inside the class that declares them (and its friends). Use `protected` for members derived classes need.

Q. With `class B : protected A`, a `public` member of A becomes...
- public in B
* protected in B
- private in B
- inaccessible in B
= Protected inheritance demotes public members to protected.

Q. Constructing an object of `C` where `C : B` and `B : A` runs constructors in which order?
* A, B, C
- C, B, A
- B, A, C
- Only C
= Base classes are constructed first; destructors run in the reverse order.

Q. What does a virtual base class prevent?
- Calling virtual functions
* Duplicate copies of a shared base class in diamond inheritance
- Creating objects of the base class
- Multiple inheritance
= `virtual` inheritance makes all paths share a single base subobject.
:::

=== operator-overloading | Operator Overloading
desc: Make your own types work with +, ==, <<, [] and more: member vs friend operators, unary and binary operators, and the rules you must follow.

Operator overloading lets you define what operators mean for **your own classes**, so code reads naturally: `c1 + c2` instead of `add(c1, c2)`. It is a form of **compile-time polymorphism**.

An overloaded operator is just a function named `operator` followed by the symbol: `operator+`, `operator==`, `operator<<`.

## Binary operators as members

For `a + b` written as a member function, `a` is the object the function is called on and `b` is the parameter.

```cpp run
#include <iostream>
using namespace std;

class Complex {
    double re, im;
public:
    Complex(double r = 0, double i = 0) : re(r), im(i) {}
    Complex operator+(const Complex &o) const { return Complex(re + o.re, im + o.im); }
    Complex operator-(const Complex &o) const { return Complex(re - o.re, im - o.im); }
    Complex operator*(const Complex &o) const {
        return Complex(re * o.re - im * o.im, re * o.im + im * o.re);   // (a+bi)(c+di)
    }
    bool operator==(const Complex &o) const { return re == o.re && im == o.im; }
    void print() const { cout << re << (im < 0 ? " - " : " + ") << (im < 0 ? -im : im) << "i" << endl; }
};

int main() {
    Complex a(3, 2), b(1, -4);
    Complex sum = a + b;           // calls a.operator+(b)
    sum.print();
    (a - b).print();
    (a * b).print();
    cout << boolalpha << (a + b == Complex(4, -2)) << endl;
    return 0;
}
```

## Unary operators

Prefix and postfix `++` are told apart by a dummy `int` parameter on the postfix version:

```cpp run
#include <iostream>
using namespace std;

class Counter {
    int value;
public:
    Counter(int v = 0) : value(v) {}
    Counter &operator++()   { ++value; return *this; }                 // prefix: ++c
    Counter operator++(int) { Counter old = *this; ++value; return old; }  // postfix: c++
    Counter operator-() const { return Counter(-value); }              // unary minus
    int get() const { return value; }
};

int main() {
    Counter c(5);
    Counter a = c++;     // a gets 5, c becomes 6
    Counter b = ++c;     // c becomes 7, b gets 7
    cout << a.get() << " " << b.get() << " " << c.get() << " " << (-c).get() << endl;
    return 0;
}
```

## Overloading << and >> with friends

`cout << obj` has `cout` (an `ostream`) on the **left**, so it cannot be a member of your class. Write it as a **non-member** — usually a `friend` so it can read private data — and return the stream to allow chaining:

```cpp run stdin="7 3"
#include <iostream>
using namespace std;

class Fraction {
    int num, den;
    static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
    void reduce() { int g = gcd(num < 0 ? -num : num, den); if (g) { num /= g; den /= g; } }
public:
    Fraction(int n = 0, int d = 1) : num(n), den(d) { reduce(); }
    Fraction operator+(const Fraction &o) const { return Fraction(num * o.den + o.num * den, den * o.den); }
    friend ostream &operator<<(ostream &out, const Fraction &f) { return out << f.num << "/" << f.den; }
    friend istream &operator>>(istream &in, Fraction &f) { in >> f.num >> f.den; f.reduce(); return in; }
};

int main() {
    Fraction a(1, 2), b;
    cout << "Enter a fraction (numerator denominator): ";
    cin >> b;
    cout << a << " + " << b << " = " << a + b << endl;
    cout << "6/8 simplifies to " << Fraction(6, 8) << endl;
    return 0;
}
```

## Subscript and comparison operators

```cpp run
#include <iostream>
#include <stdexcept>
using namespace std;

class SafeArray {
    int data[5] = {10, 20, 30, 40, 50};
public:
    int &operator[](int i) {                     // returns a reference so a[i] = x works
        if (i < 0 || i >= 5) throw out_of_range("index " + to_string(i));
        return data[i];
    }
};

int main() {
    SafeArray a;
    a[2] = 99;
    cout << a[2] << endl;
    try { cout << a[7] << endl; }
    catch (const out_of_range &e) { cout << "caught bad " << e.what() << endl; }
    return 0;
}
```

## Rules

- You **cannot** create new operators or change precedence, associativity or the number of operands.
- At least one operand must be a user-defined type (you cannot redefine `int + int`).
- These **cannot** be overloaded: `::` `.` `.*` `?:` `sizeof` `typeid`.
- `=`, `()`, `[]` and `->` must be **member** functions.
- `<<` and `>>` for streams must be **non-members** (usually friends).

| Member operator | Friend / non-member operator |
|---|---|
| left operand is `*this` | both operands are parameters |
| one parameter for binary operators | two parameters for binary operators |
| left operand must be your class | left operand can be any type (`cout << x`, `5 + x`) |

:::quiz
Q. How many parameters does a **member** `operator+` take?
- 0
* 1
- 2
- 3
= The left operand is the object itself (`this`); the right operand is the single parameter.

Q. Why must `operator<<` for `cout << obj` be a non-member?
* Its left operand is an `ostream`, not your class
- Member functions cannot return references
- `<<` cannot be overloaded as a member of any class
- For speed
= A member operator always has the class object on the left.

Q. Which operator **cannot** be overloaded?
- `+`
- `[]`
* `::`
- `==`
= Scope resolution, member access `.`, `?:` and `sizeof` cannot be overloaded.

Q. How does C++ distinguish postfix `operator++` from prefix?
- Postfix returns `void`
* Postfix takes a dummy `int` parameter
- Prefix is declared `static`
- It cannot distinguish them
= `operator++(int)` is postfix; `operator++()` is prefix.
:::

=== virtual-functions | Virtual Functions & Runtime Polymorphism
desc: Base-class pointers to derived objects, why virtual changes which function runs, override, virtual destructors, and how the vtable makes it work.

## The problem: static binding

A base-class pointer can point to a derived object. But by default, calling a function through it runs the **base** version — the compiler decides at **compile time** from the pointer's type. This is **static (early) binding**.

```cpp run
#include <iostream>
using namespace std;

class Animal {
public:
    void speak() const { cout << "..." << endl; }          // NOT virtual
};
class Dog : public Animal {
public:
    void speak() const { cout << "Woof!" << endl; }
};

int main() {
    Dog d;
    Animal *p = &d;      // base pointer, derived object
    d.speak();           // Woof!
    p->speak();          // "..." — chosen by the pointer type
    return 0;
}
```

## The fix: virtual functions

Mark the base function **`virtual`**. Now the function is chosen at **run time** from the **actual object** — **dynamic (late) binding**. This is **runtime polymorphism**.

```cpp run
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Employee {
protected:
    string name;
    double base;
public:
    Employee(const string &n, double b) : name(n), base(b) {}
    virtual double pay() const { return base; }
    virtual string role() const { return "Employee"; }
    virtual ~Employee() {}
    void payslip() const { cout << name << " (" << role() << "): Rs " << pay() << endl; }
};

class Manager : public Employee {
    double bonus;
public:
    Manager(const string &n, double b, double bo) : Employee(n, b), bonus(bo) {}
    double pay() const override { return base + bonus; }
    string role() const override { return "Manager"; }
};

class Intern : public Employee {
public:
    Intern(const string &n) : Employee(n, 15000) {}
    string role() const override { return "Intern"; }       // keeps Employee::pay
};

int main() {
    Manager m("Priya", 90000, 25000);
    Intern i("Rahul");
    Employee e("Sanjay", 60000);
    vector<const Employee *> staff = {&e, &m, &i};
    for (const Employee *s : staff) s->payslip();          // one loop, three behaviours
    return 0;
}
```

`payslip()` is written once in the base class, yet it calls the right `pay()` and `role()` for each object. Adding a new kind of employee requires **no change** to `payslip` — that is the real power of polymorphism.

:::tip Always write override
`override` (C++11) asks the compiler to check that you really are overriding a virtual function. A typo like `double pay()` without `const` would otherwise silently create a new, unrelated function.
:::

## Virtual destructors

If you `delete` a derived object through a base pointer and the base destructor is **not** virtual, only the base destructor runs — the derived part leaks.

```cpp run
#include <iostream>
using namespace std;

class Base {
public:
    virtual ~Base() { cout << "~Base" << endl; }     // remove 'virtual' and ~Derived is skipped
};
class Derived : public Base {
    int *buffer = new int[1000];
public:
    ~Derived() { delete[] buffer; cout << "~Derived (freed buffer)" << endl; }
};

int main() {
    Base *p = new Derived;
    delete p;            // runs ~Derived, then ~Base
    return 0;
}
```

:::key Rule
Any class meant to be used through base pointers should have a **virtual destructor**.
:::

## How it works: the vtable

For each class with virtual functions, the compiler builds a **virtual table (vtable)**: an array of pointers to that class's versions of the virtual functions. Each object gets a hidden pointer (the **vptr**) to its class's vtable. A virtual call follows `object → vptr → vtable → function`. That is one extra pointer lookup per call, and one extra pointer per object:

```cpp run
#include <iostream>
using namespace std;

class Plain   { int x = 0; public: int f() { return x; } };
class Virtual { int x = 0; public: virtual int f() { return x; } };

int main() {
    cout << "sizeof(Plain)   = " << sizeof(Plain) << endl;
    cout << "sizeof(Virtual) = " << sizeof(Virtual) << " (int + hidden vptr, padded)" << endl;
    return 0;
}
```

| Static binding | Dynamic binding |
|---|---|
| decided at compile time | decided at run time |
| normal and overloaded functions | `virtual` functions called through pointers/references |
| faster | tiny overhead (vtable lookup) |
| also called early binding | also called late binding |

:::mistake Object slicing
Polymorphism only works through **pointers or references**. Assigning a derived object to a base **object** (`Employee e = m;`) copies just the base part — the derived data is "sliced off" and `e.pay()` uses the base version.
:::

:::quiz
Q. What decides which function runs when a **virtual** function is called through a base pointer?
- The pointer's declared type
* The actual type of the object pointed to
- The order of class definitions
- Whichever function was defined first
= Virtual calls are dispatched at run time on the object's real type.

Q. What happens if a base class destructor is not virtual and you `delete` a derived object through a base pointer?
- Both destructors run
* Only the base destructor runs, so the derived part is not cleaned up
- Only the derived destructor runs
- Compile error
= Technically it is undefined behaviour, and in practice the derived destructor is skipped.

Q. What is a vtable?
* A per-class table of pointers to that class's virtual functions
- A table of all variables in a program
- The list of an object's data members
- A table used by templates
= Each object's hidden vptr points to its class's vtable.

Q. What does `override` do?
- Makes a function virtual in the base class
* Asks the compiler to verify the function really overrides a base virtual function
- Prevents a function from being overridden
- Makes the function static
= It turns silent signature mistakes into compile errors.
:::

=== abstract-classes | Abstract Classes & Interfaces
desc: Pure virtual functions, abstract base classes that cannot be instantiated, interfaces, and the final keyword — designing a clean class hierarchy.

## Pure virtual functions

Sometimes a base class cannot sensibly implement a function. What is the area of a generic "Shape"? Declare it **pure virtual** with `= 0`: it has no body in the base, and **every concrete derived class must override it**.

```cpp
virtual double area() const = 0;   // pure virtual
```

## Abstract classes

A class with at least one pure virtual function is an **abstract class**:

- You **cannot create objects** of it: `Shape s;` is a compile error.
- You **can** have pointers and references to it.
- A derived class that does not override every pure virtual function is abstract too.

```cpp run
#include <iostream>
#include <cmath>
using namespace std;

class Shape {                                    // abstract base class
public:
    virtual double area() const = 0;
    virtual double perimeter() const = 0;
    virtual const char *name() const = 0;
    void describe() const {                      // concrete function using the abstract ones
        cout << name() << ": area " << area() << ", perimeter " << perimeter() << endl;
    }
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double r;
public:
    explicit Circle(double r) : r(r) {}
    double area() const override { return M_PI * r * r; }
    double perimeter() const override { return 2 * M_PI * r; }
    const char *name() const override { return "Circle"; }
};

class Square : public Shape {
    double s;
public:
    explicit Square(double s) : s(s) {}
    double area() const override { return s * s; }
    double perimeter() const override { return 4 * s; }
    const char *name() const override { return "Square"; }
};

int main() {
    // Shape s;              // error: cannot declare variable 's' to be of abstract type
    Circle c(1);
    Square q(2.5);
    const Shape &a = c, &b = q;
    a.describe();
    b.describe();
    return 0;
}
```

## Interfaces

C++ has no `interface` keyword (Java does). An **interface** in C++ is simply an abstract class with **only pure virtual functions** and a virtual destructor. A class can implement several interfaces through multiple inheritance:

```cpp run
#include <iostream>
#include <string>
using namespace std;

class Printable { public: virtual void print() const = 0; virtual ~Printable() = default; };
class Payable   { public: virtual double amountDue() const = 0; virtual ~Payable() = default; };

class Invoice : public Printable, public Payable {
    string client;
    double hours, rate;
public:
    Invoice(string c, double h, double r) : client(c), hours(h), rate(r) {}
    double amountDue() const override { return hours * rate; }
    void print() const override { cout << "Invoice for " << client << ": Rs " << amountDue() << endl; }
};

void printAll(const Printable *items[], int n) { for (int i = 0; i < n; i++) items[i]->print(); }

int main() {
    Invoice a("Acme Labs", 12, 1500), b("Nova Foods", 4.5, 2000);
    const Printable *docs[] = {&a, &b};
    printAll(docs, 2);
    const Payable &p = a;
    cout << "Total due from Acme: " << p.amountDue() << endl;
    return 0;
}
```

## final

`final` stops further overriding or inheritance:

```cpp
class Base { virtual void f(); };
class Mid : public Base { void f() override final; };   // no class may override f again
class Leaf final : public Mid { };                       // no class may inherit from Leaf
```

## Abstract class vs concrete class

| Abstract class | Concrete class |
|---|---|
| has at least one pure virtual function | all functions have bodies |
| cannot be instantiated | can create objects |
| defines a contract for derived classes | provides a full implementation |
| used through pointers/references | used directly or through pointers |

:::exam Design question
"Design a class hierarchy for shapes / payments / employees using an abstract base class." Show the abstract base with pure virtual functions, two or three derived classes overriding them, and a `main` that stores base pointers in an array and calls the functions polymorphically.
:::

:::quiz
Q. What makes a class abstract?
- Having a constructor
- Having only private members
* Having at least one pure virtual function
- Being used as a base class
= A pure virtual function (`= 0`) makes the class abstract.

Q. Which statement about an abstract class `Shape` is true?
- `Shape s;` creates a shape with default values
* You can declare `Shape *p;` and point it at a derived object
- It cannot have any implemented functions
- It cannot have a constructor
= Abstract classes cannot be instantiated but can be used through pointers and references, and they may have constructors and ordinary functions.

Q. A class derives from an abstract class but overrides only some of its pure virtual functions. It is...
- a concrete class
* also abstract
- a compile error
- an interface
= It still has an unimplemented pure virtual function.

Q. How is an "interface" usually written in C++?
* An abstract class with only pure virtual functions (and a virtual destructor)
- With the `interface` keyword
- As a struct with no members
- As a template
= C++ has no interface keyword; a pure abstract class plays that role.
:::
