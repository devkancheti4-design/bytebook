=== how-computers-work | How Computers Work
unit: Computer Basics
desc: What is inside a computer — CPU, memory, storage and I/O — the fetch–decode–execute cycle, the memory hierarchy, and what an operating system does for your programs.

Every program you will write in C, Python or C++ eventually runs on the same few pieces of hardware. Knowing them explains why some code is fast and some is slow.

## The main parts

| Part | Job | Analogy |
|---|---|---|
| **CPU** (processor) | executes instructions: arithmetic, comparisons, jumps | the chef |
| **RAM** (main memory) | holds running programs and their data; fast but **volatile** (erased when power goes off) | the kitchen counter |
| **Storage** (SSD/HDD) | keeps files permanently; much slower than RAM | the pantry |
| **Input devices** | keyboard, mouse, camera, microphone, network | orders coming in |
| **Output devices** | screen, speakers, printer, network | plates going out |
| **Motherboard / bus** | connects everything and carries data between parts | the corridors |

This design — a CPU that fetches both **instructions** and **data** from the same memory — is the **von Neumann architecture** (1945), and nearly every computer still follows it.

## Inside the CPU

- **ALU** (arithmetic logic unit): adds, subtracts, compares, does AND/OR/NOT.
- **Control unit**: decodes instructions and directs the other parts.
- **Registers**: a few tiny, ultra-fast storage slots inside the CPU, including the **program counter** (address of the next instruction).
- **Cache**: small fast memory between the CPU and RAM (L1, L2, L3).
- **Clock**: a 3 GHz CPU ticks 3 billion times per second. Modern chips have several **cores**, each able to run its own stream of instructions.

## The fetch–decode–execute cycle

The CPU repeats three steps billions of times per second:

:::diagram flow
start: Power on
process: FETCH the instruction at the program counter
process: DECODE it: which operation, which data?
process: EXECUTE it in the ALU, read or write memory
process: Move the program counter to the next instruction
end: Repeat (billions of times per second)
caption: The instruction cycle. A loop in your code is just the CPU jumping the program counter back to an earlier instruction.
:::

## The memory hierarchy

Faster memory is more expensive and smaller. Computers stack several layers:

| Level | Typical size | Typical access time |
|---|---|---|
| Registers | under 1 KB | under 1 ns |
| L1 cache | 32–64 KB per core | about 1 ns |
| L2 / L3 cache | 1–64 MB | 3–15 ns |
| RAM | 8–32 GB | about 100 ns |
| SSD | 256 GB–2 TB | about 100,000 ns (0.1 ms) |
| Hard disk | 1–10 TB | about 10,000,000 ns (10 ms) |

Reading from RAM is about **100 times** slower than from L1 cache. Programs that access memory **sequentially** (like walking through an array) let the cache prefetch data and run much faster than programs that jump around (like following linked-list pointers).

## Units of data

| Unit | Size |
|---|---|
| bit | a single 0 or 1 |
| byte | 8 bits — one character in ASCII |
| kilobyte (KB) | 1,024 bytes (strictly, KiB) |
| megabyte (MB) | 1,024 KB |
| gigabyte (GB) | 1,024 MB |
| terabyte (TB) | 1,024 GB |

(Storage makers use powers of 1000, which is why a "1 TB" drive shows up as about 931 GB.)

## The operating system

The **operating system** (Linux, Windows, macOS, Android) is the program that manages the hardware for every other program:

- **Process management** — runs many programs at once by switching the CPU between them very quickly.
- **Memory management** — gives each program its own memory space and protects it from others.
- **File system** — organises storage into files and folders.
- **Device drivers** — talk to hardware like printers, Wi-Fi and cameras.
- **User interface** — a command line (shell) or a graphical desktop.
- **Security** — users, permissions and passwords.

When your C program calls `printf` or `fopen`, the C library asks the operating system to do the actual work through a **system call**.

## Software layers

:::diagram tree
tree: You(Applications(Browser,VS Code,Your programs),System software(Operating system(Kernel,Drivers),Compilers & tools))
shape: box
caption: Software sits in layers: applications rely on system software, which controls the hardware.
:::

:::quiz
Q. Which part of the computer loses its contents when power is switched off?
* RAM
- SSD
- Hard disk
- USB pen drive
= RAM is volatile; storage devices keep data without power.

Q. What are the three steps of the instruction cycle?
- Input, process, output
* Fetch, decode, execute
- Compile, link, run
- Read, write, delete
= The CPU fetches an instruction, decodes it and executes it, over and over.

Q. Which is fastest to access?
- RAM
- SSD
* CPU registers
- L3 cache
= Registers are inside the CPU and are the fastest storage of all.

Q. Which job belongs to the operating system?
- Compiling C code
* Sharing the CPU between running programs
- Drawing websites
- Writing spreadsheets
= Process scheduling is a core OS responsibility.
:::

=== number-systems | Number Systems
desc: Binary, octal, decimal and hexadecimal: place values, converting between any two bases, and why programmers use hex — with an interactive converter.

We count in **decimal** (base 10) because we have ten fingers. Computers use **binary** (base 2) because a transistor is either off (0) or on (1). Programmers also use **octal** (base 8) and **hexadecimal** (base 16) as compact ways to write binary.

| System | Base | Digits | Example | C / Python literal |
|---|---|---|---|---|
| Binary | 2 | 0 1 | 1011 | `0b1011` |
| Octal | 8 | 0–7 | 755 | `0755` (C), `0o755` (Python) |
| Decimal | 10 | 0–9 | 255 | `255` |
| Hexadecimal | 16 | 0–9, A–F (A = 10 … F = 15) | FF | `0xFF` |

## Place values

In base b, each position is worth a power of b, growing from right to left.

> 1011₂ = 1·2³ + 0·2² + 1·2¹ + 1·2⁰ = 8 + 0 + 2 + 1 = **11**
> 2F₁₆ = 2·16¹ + 15·16⁰ = 32 + 15 = **47**
> 157₈ = 1·8² + 5·8¹ + 7·8⁰ = 64 + 40 + 7 = **111**

## Decimal to any base: repeated division

Divide by the base, record the **remainder**, repeat with the quotient until it reaches 0, then **read the remainders bottom to top**.

Convert 45 to binary:

| Divide | Quotient | Remainder |
|---|---|---|
| 45 ÷ 2 | 22 | 1 |
| 22 ÷ 2 | 11 | 0 |
| 11 ÷ 2 | 5 | 1 |
| 5 ÷ 2 | 2 | 1 |
| 2 ÷ 2 | 1 | 0 |
| 1 ÷ 2 | 0 | 1 |

Reading upwards: **45 = 101101₂**.

## Try it

:::widget base-converter
:::

## Binary ↔ octal and hexadecimal: grouping

Because 8 = 2³ and 16 = 2⁴, each octal digit is exactly **3 bits** and each hex digit exactly **4 bits**. Group bits from the right:

> 1101 0110 1010₂ → D 6 A → **D6A₁₆**
> 110 101 101 010₂ → 6 5 5 2 → **6552₈**

| Hex | Binary | Hex | Binary |
|---|---|---|---|
| 0 | 0000 | 8 | 1000 |
| 1 | 0001 | 9 | 1001 |
| 2 | 0010 | A | 1010 |
| 3 | 0011 | B | 1011 |
| 4 | 0100 | C | 1100 |
| 5 | 0101 | D | 1101 |
| 6 | 0110 | E | 1110 |
| 7 | 0111 | F | 1111 |

That is why programmers love hex: one hex digit = 4 bits, two hex digits = one byte. Colours (`#FF8800`), memory addresses (`0x7ffe…`) and file signatures are all written in hex.

## Fractions in binary

Positions after the point are negative powers: 0.101₂ = 1/2 + 0/4 + 1/8 = 0.625. To convert a decimal fraction, **multiply by 2 repeatedly** and take the integer parts: 0.625 → 1.25 (1) → 0.5 (0) → 1.0 (1) → 0.101₂. Some fractions never terminate in binary — 0.1 is 0.000110011…₂ — which is why `0.1 + 0.2 != 0.3` in every language.

## Converting in code

```c run
#include <stdio.h>

void toBase(unsigned n, unsigned base) {
    const char *digits = "0123456789ABCDEF";
    char buf[40];
    int i = 0;
    if (n == 0) buf[i++] = '0';
    while (n > 0) { buf[i++] = digits[n % base]; n /= base; }   // remainders, last first
    while (i > 0) putchar(buf[--i]);                            // print them in reverse
}

int main(void) {
    unsigned n = 2026;
    printf("%u in decimal\n", n);
    printf("binary: "); toBase(n, 2); printf("\n");
    printf("octal:  %o\nhex:    %X\n", n, n);
    printf("base 5: "); toBase(n, 5); printf("\n");
    printf("0x7E2 = %d, 0b11111101010 = %d\n", 0x7E2, 0b11111101010);
    return 0;
}
```

```python run
n = 2026
print(bin(n), oct(n), hex(n))
print(int("11111101010", 2), int("3752", 8), int("7ea", 16), int("31101", 5))
print(f"{n:b} {n:o} {n:X} {n:#010b}")
```

:::quiz
Q. What is 110101₂ in decimal?
- 43
* 53
- 45
- 106
= 32 + 16 + 4 + 1 = 53.

Q. What is 200 in hexadecimal?
- B8
* C8
- C0
- 12C
= 200 = 12 × 16 + 8, and 12 is C.

Q. How many bits does one hexadecimal digit represent?
- 2
- 3
* 4
- 8
= 16 = 2⁴, so each hex digit is exactly 4 bits.

Q. What is 10110111₂ in hexadecimal?
- A7
* B7
- 7B
- 267
= Group as 1011 0111 → B 7.
:::

=== data-representation | Data Representation
desc: How computers store everything as bits: unsigned and signed integers, two's complement, overflow, floating point, characters with ASCII and Unicode, and images and sound.

Inside a computer, **everything** — numbers, text, images, music, your code — is a pattern of bits. The meaning depends on how the program interprets those bits.

## Unsigned integers

With n bits you can store 2ⁿ patterns: unsigned values 0 to 2ⁿ − 1.

| Bits | Unsigned range |
|---|---|
| 8 | 0 to 255 |
| 16 | 0 to 65,535 |
| 32 | 0 to about 4.29 billion |
| 64 | 0 to about 1.8 × 10¹⁹ |

## Signed integers: two's complement

To store negative numbers, computers use **two's complement**. The leftmost bit has a **negative** place value: in 8 bits it is worth −128.

To find the 8-bit pattern for **−x**: write x in binary, **invert all the bits**, then **add 1**.

> 5 = 0000 0101 → invert → 1111 1010 → add 1 → **1111 1011** = −5

Check: −128 + 64 + 32 + 16 + 8 + 2 + 1 = −5 ✓.

8-bit two's complement ranges from **−128 to +127**; in general, −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1. Two's complement is used because addition works the same way for positive and negative numbers — the CPU needs only one adder circuit.

```c run
#include <stdio.h>

void bits8(signed char x) {
    for (int i = 7; i >= 0; i--) putchar((x >> i) & 1 ? '1' : '0');
}

int main(void) {
    signed char values[] = {5, -5, 127, -128, -1};
    for (int i = 0; i < 5; i++) {
        printf("%5d = ", values[i]);
        bits8(values[i]);
        printf("\n");
    }
    return 0;
}
```

## Overflow

When a result does not fit in the available bits, it **wraps around**:

```c run
#include <stdio.h>
#include <limits.h>

int main(void) {
    unsigned char u = 255;
    u = u + 1;                                   // 256 does not fit in 8 bits
    printf("255 + 1 in an unsigned char = %d\n", u);
    printf("INT_MAX = %d\n", INT_MAX);
    long long big = (long long)INT_MAX + 1;
    printf("INT_MAX + 1 as a long long = %lld\n", big);
    printf("(int)(INT_MAX + 1LL) = %d\n", (int)(INT_MAX + 1LL));   // wraps to INT_MIN
    return 0;
}
```

The 2038 problem is an overflow waiting to happen: many systems store time as seconds since 1 January 1970 in a signed 32-bit integer, which runs out on 19 January 2038.

## Floating point

Real numbers use **IEEE 754** floating point — a binary version of scientific notation:

> value = (−1)^sign × 1.mantissa × 2^(exponent − bias)

| Type | Bits | Sign | Exponent | Mantissa | Precision |
|---|---|---|---|---|---|
| `float` | 32 | 1 | 8 | 23 | about 7 decimal digits |
| `double` | 64 | 1 | 11 | 52 | about 15–16 decimal digits |

Most decimal fractions cannot be stored exactly, so small errors creep in:

```python run
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
print(abs((0.1 + 0.2) - 0.3) < 1e-9)          # compare with a tolerance instead
print(f"{0.1:.20f}")                          # what is really stored
print(1e308 * 10, -1e308 * 10)                 # overflow to infinity
total = 0.0
for _ in range(10):
    total += 0.1                               # tiny errors accumulate
print(total, total == 1.0)
```

:::warn Never use floats for money
Rounding errors add up. Store money as an integer number of paise (or use a decimal type).
:::

## Characters

Text is stored as numbers too.

- **ASCII** (1963) uses 7 bits for 128 characters: 'A' = 65, 'a' = 97, '0' = 48, space = 32, newline = 10.
- **Unicode** assigns a **code point** to every character in every script — over 150,000 of them, including Devanagari, Tamil, emoji and ₹ (U+20B9).
- **UTF-8** encodes Unicode in 1 to 4 bytes, and is identical to ASCII for the first 128 characters. It is the encoding of the web.

```python run
for ch in ["A", "a", "0", "₹", "अ", "😀"]:
    data = ch.encode("utf-8")
    print(f"{ch!r}: code point U+{ord(ch):04X} ({ord(ch)}), UTF-8 bytes = {data.hex(' ')} ({len(data)} byte{'s' if len(data) > 1 else ''})")
```

## Images and sound

- An **image** is a grid of **pixels**; each pixel stores a colour, often as 3 bytes for red, green and blue (24-bit colour). A 1920 × 1080 photo has about 2 million pixels × 3 bytes ≈ **6 MB** uncompressed — which is why JPEG and PNG compression matter.
- **Sound** is sampled thousands of times per second: CD audio stores 44,100 samples per second, 16 bits each, per channel.

:::quiz
Q. What is the 8-bit two's complement representation of −1?
- 1000 0001
- 0000 0001
* 1111 1111
- 1111 1110
= 1 = 0000 0001; invert to 1111 1110; add 1 → 1111 1111.

Q. What is the range of an 8-bit two's complement integer?
- 0 to 255
* −128 to 127
- −127 to 127
- −255 to 255
= −2⁷ to 2⁷ − 1.

Q. Why does `0.1 + 0.2 == 0.3` evaluate to false?
* 0.1 and 0.2 cannot be represented exactly in binary floating point
- Python rounds additions down
- 0.3 is stored as an integer
- It is a bug in the CPU
= Each value is the nearest representable binary fraction, and the tiny errors do not cancel.

Q. How many bytes does UTF-8 use for an ASCII character like 'A'?
* 1
- 2
- 3
- 4
= UTF-8 is backward-compatible with ASCII for the first 128 characters.
:::

=== logic-gates | Logic Gates & Circuits
desc: The building blocks of hardware: AND, OR, NOT, NAND, NOR and XOR gates with truth tables, building circuits, the half adder and full adder, and how they add numbers.

A **logic gate** is a tiny electronic circuit (made of transistors) that takes one or more bits as input and produces a bit as output. Billions of them inside a CPU perform every calculation your programs do.

:::diagram gates
show: AND OR NOT NAND NOR XOR XNOR
caption: The seven standard gates. A small circle (bubble) on the output means the result is inverted.
:::

## Truth tables

| A | B | AND | OR | NAND | NOR | XOR | XNOR |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 1 | 0 | 1 |
| 0 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 |

NOT has one input: NOT 0 = 1, NOT 1 = 0.

| Gate | Output is 1 when… | Boolean expression |
|---|---|---|
| AND | all inputs are 1 | A · B |
| OR | at least one input is 1 | A + B |
| NOT | the input is 0 | A′ |
| NAND | not all inputs are 1 | (A · B)′ |
| NOR | no input is 1 | (A + B)′ |
| XOR | the inputs differ | A ⊕ B |
| XNOR | the inputs are equal | (A ⊕ B)′ |

## Building circuits

Connect gates and you get a circuit for any Boolean expression. Explore one:

:::widget truth-table
expr: (A & !B) | (!A & B)
:::

That expression, (A AND NOT B) OR (NOT A AND B), is exactly **XOR**.

:::info Universal gates
NAND alone can build every other gate — chip makers often build entire processors mostly from NAND gates. NOR is universal too. The algebra behind this is in [Boolean Algebra](@discrete/boolean-algebra).
:::

## Adding binary numbers

Binary addition follows simple rules: 0 + 0 = 0, 0 + 1 = 1, 1 + 1 = 10 (0, carry 1), 1 + 1 + 1 = 11 (1, carry 1).

```text
    1 0 1 1   (11)
  + 0 1 1 1   ( 7)
  ---------
  1 0 0 1 0   (18)
```

### Half adder

Adds two bits A and B:

- **Sum** = A XOR B
- **Carry** = A AND B

### Full adder

Adds two bits **plus a carry in**, so adders can be chained for multi-bit numbers:

- **Sum** = A XOR B XOR Cin
- **Carry out** = (A AND B) OR (Cin AND (A XOR B))

Chain 32 or 64 full adders, each passing its carry to the next, and you have the adder inside a CPU's ALU — a **ripple-carry adder**:

```python run
def full_adder(a, b, carry_in):
    s = a ^ b ^ carry_in
    carry_out = (a & b) | (carry_in & (a ^ b))
    return s, carry_out

def add_bits(x, y, width=8):
    carry, result = 0, 0
    for i in range(width):                       # from the least significant bit
        bit, carry = full_adder((x >> i) & 1, (y >> i) & 1, carry)
        result |= bit << i
    return result, carry

for x, y in [(11, 7), (100, 55), (200, 100)]:
    total, overflow = add_bits(x, y)
    print(f"{x:3} + {y:3} = {total:3}  (binary {x:08b} + {y:08b} = {total:08b}, carry out {overflow})")
```

The last line shows **overflow**: 300 does not fit in 8 bits, so the result wraps to 44 and the carry-out bit is 1.

## Beyond adders

- **Multiplexers** select one of several inputs (the hardware version of `switch`).
- **Flip-flops** use feedback between gates to **remember** a bit — the basis of registers and memory.
- Combining adders, multiplexers and flip-flops with a clock gives you a CPU.

:::quiz
Q. Which gate outputs 1 only when both inputs are 1?
* AND
- OR
- XOR
- NOR
= AND requires all inputs to be 1.

Q. What does XOR output for inputs 1 and 1?
- 1
* 0
- 2
- 10
= XOR is 1 only when the inputs differ.

Q. In a half adder, which gate produces the carry?
- XOR
- OR
* AND
- NOT
= The carry is 1 only when both bits are 1.

Q. Which is a universal gate?
- AND
- XOR
* NAND
- OR
= Every Boolean function can be built from NAND gates alone.
:::
