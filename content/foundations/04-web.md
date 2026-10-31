=== how-the-web-works | How the Internet & Web Work
unit: The Web
desc: What happens when you open a website: clients and servers, IP addresses, DNS, TCP and packets, HTTP requests and responses, status codes, HTTPS, and front end vs back end.

The **Internet** is a global network of networks — billions of devices connected by cables, fibre, Wi-Fi and cell towers, all speaking common **protocols** (agreed rules). The **World Wide Web**, invented by Tim Berners-Lee in 1989, is one service that runs on top of the Internet: web pages linked together and fetched with HTTP. Email, video calls and online games are other services on the same Internet.

## Clients and servers

- A **client** requests something — your browser or a mobile app.
- A **server** is a computer that waits for requests and responds — with a web page, an image, or data.

## Addresses: IP and DNS

Every device on the Internet has an **IP address**:

- **IPv4**: four numbers 0–255, e.g. `142.250.193.78` (about 4.3 billion addresses — not enough).
- **IPv6**: eight groups of hex, e.g. `2404:6800:4007:81a::200e`.

Humans prefer names. The **Domain Name System (DNS)** is the Internet's phone book: it translates a name such as `www.example.com` into an IP address, asking a hierarchy of DNS servers (root → `.com` → `example.com`) and caching the answer.

## Packets, TCP and routing

Data travels in small **packets**. Each packet carries the source and destination IP addresses and is forwarded hop by hop by **routers**. Packets of one message may take different routes.

- **IP** delivers packets on a best-effort basis.
- **TCP** sits on top: it numbers packets, re-sends lost ones and reassembles them in order — a reliable stream. (**UDP** skips that for speed — video calls, games.)

## What happens when you visit a website

:::diagram flow
start: You type https://example.com and press Enter
process: DNS lookup: example.com → 93.184.215.14
process: TCP connection + TLS handshake (HTTPS encryption)
process: Browser sends an HTTP request: GET /
process: Server responds: 200 OK + HTML
process: Browser parses HTML, fetches CSS, JS and images
end: Page is rendered and becomes interactive
caption: The journey of one page load, usually completed in well under a second.
:::

## HTTP: requests and responses

**HTTP** (HyperText Transfer Protocol) is a simple text conversation:

```text
GET /courses/c HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

```text
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1532

<!doctype html>
<html> ... </html>
```

| Method | Meaning |
|---|---|
| `GET` | read a resource |
| `POST` | create something / submit a form |
| `PUT` / `PATCH` | update |
| `DELETE` | delete |

| Status code | Meaning |
|---|---|
| **200** OK | success |
| **301 / 302** | moved — redirect |
| **400** Bad Request | the request was malformed |
| **401 / 403** | not logged in / not allowed |
| **404** Not Found | no such resource |
| **500** Internal Server Error | the server crashed |

**HTTPS** is HTTP inside an encrypted **TLS** connection, so nobody between you and the server can read or alter the traffic — that is what the padlock in the address bar means.

## URLs

`https://shop.example.com:443/search?q=keyboard&page=2#reviews`

| Part | Value |
|---|---|
| Scheme | `https` |
| Host (domain) | `shop.example.com` |
| Port | `443` (the default for HTTPS) |
| Path | `/search` |
| Query string | `q=keyboard&page=2` |
| Fragment | `#reviews` (handled by the browser only) |

```js run
const url = new URL("https://shop.example.com:443/search?q=keyboard&page=2#reviews");
console.log(url.protocol, url.hostname, url.pathname);
console.log("q =", url.searchParams.get("q"), "| page =", url.searchParams.get("page"));
console.log("fragment:", url.hash);
```

## Front end and back end

| | Front end (client side) | Back end (server side) |
|---|---|---|
| Runs in | the browser | a server |
| Languages | HTML, CSS, JavaScript | JavaScript (Node.js), Python, Java, Go, C# … |
| Job | layout, styling, interaction | data, logic, authentication, databases |
| Talks via | HTTP requests to **APIs** (often JSON) | HTTP responses |

A **full-stack** developer works on both.

:::quiz
Q. What does DNS do?
- Encrypts web traffic
* Translates domain names into IP addresses
- Stores web pages
- Assigns MAC addresses
= DNS is the Internet's phone book.

Q. Which HTTP status code means the page was not found?
- 200
- 301
* 404
- 500
= 4xx codes are client errors; 404 means the resource does not exist.

Q. Which protocol guarantees packets arrive complete and in order?
* TCP
- IP
- UDP
- DNS
= TCP re-sends lost packets and reorders them.

Q. What does the "S" in HTTPS add?
- Speed
* Encryption through TLS
- Search
- Server-side code
= HTTPS is HTTP over an encrypted TLS connection.
:::

=== html-css | HTML & CSS Essentials
desc: Build and style a web page: HTML document structure, common elements, links, images, lists, tables and forms, then CSS selectors, the box model, colours, fonts and Flexbox — with a live editor.

Every web page is built from three languages:

| Language | Role | Analogy |
|---|---|---|
| **HTML** | structure and content | the skeleton |
| **CSS** | presentation and layout | the clothes |
| **JavaScript** | behaviour and interaction | the muscles |

## HTML: structure

HTML marks up content with **elements**, written as tags: `<p>A paragraph</p>`. Tags can have **attributes**: `<a href="https://example.com">a link</a>`.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My first page</title>
</head>
<body>
  <h1>Hello, I'm Asha</h1>
  <p>I study <strong>computer science</strong> at Kalvium.</p>
  <a href="https://github.com">My GitHub</a>
</body>
</html>
```

- `<head>` holds information **about** the page (title, character set, CSS links).
- `<body>` holds what is **shown**.

## Common elements

| Element | Purpose |
|---|---|
| `<h1>` … `<h6>` | headings, from most to least important |
| `<p>` | paragraph |
| `<a href="…">` | link |
| `<img src="…" alt="…">` | image (the `alt` text is read by screen readers) |
| `<ul>`, `<ol>`, `<li>` | bulleted list, numbered list, list item |
| `<table>`, `<tr>`, `<th>`, `<td>` | table, row, header cell, data cell |
| `<form>`, `<input>`, `<button>`, `<label>` | forms |
| `<div>`, `<span>` | generic block and inline containers |
| `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` | **semantic** layout regions |

Semantic elements tell browsers, search engines and screen readers what each part **means** — prefer them to plain `<div>`s.

## CSS: style

CSS rules have a **selector** and **declarations**:

```css
h1 {
  color: #2e8b47;
  font-size: 2rem;
}
.card {                 /* class selector: <div class="card"> */
  padding: 16px;
  border-radius: 12px;
}
#signup { }             /* id selector: <form id="signup"> */
nav a:hover { }         /* descendant + state */
```

| Selector | Matches |
|---|---|
| `p` | every `<p>` |
| `.card` | elements with `class="card"` |
| `#main` | the element with `id="main"` |
| `nav a` | `<a>` elements inside `<nav>` |
| `a:hover` | links under the mouse pointer |

When rules conflict, the more **specific** selector wins (id > class > element), and later rules beat earlier ones of equal specificity — the **cascade**.

## The box model

Every element is a box: **content**, surrounded by **padding**, then a **border**, then **margin** (space outside).

```css
.box {
  width: 200px;
  padding: 16px;          /* inside the border */
  border: 2px solid #333;
  margin: 24px auto;      /* outside; auto centres horizontally */
  box-sizing: border-box; /* width now includes padding and border */
}
```

## Flexbox layout

Flexbox arranges children in a row or column with easy alignment and spacing:

```css
.row {
  display: flex;
  gap: 12px;
  justify-content: space-between;   /* along the main axis */
  align-items: center;              /* across it */
  flex-wrap: wrap;
}
```

## Try it: a live editor

Edit the HTML and CSS — the preview updates as you type:

:::widget web-playground
<style>
  body { font-family: system-ui, sans-serif; margin: 24px; background: #f6f7fb; }
  .card { background: white; border-radius: 14px; padding: 20px; max-width: 360px;
          box-shadow: 0 8px 24px rgba(0,0,0,.08); }
  h1 { margin: 0 0 6px; font-size: 22px; color: #2e8b47; }
  .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .tags span { background: #e7f5ec; color: #1f6d36; padding: 4px 10px; border-radius: 99px; font-size: 13px; }
</style>
<div class="card">
  <h1>Asha Rao</h1>
  <p>First-year CS student. I like C, DSA and building things for the web.</p>
  <div class="tags"><span>C</span><span>Python</span><span>HTML</span><span>Git</span></div>
</div>
:::

## Responsive design

Phones, tablets and laptops need different layouts. Two essentials:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

```css
@media (max-width: 600px) {
  .row { flex-direction: column; }   /* stack on small screens */
}
```

:::tip Keep learning HTML
For a deeper, hands-on HTML course with an exercise for every element, try [Tagbench](https://devkancheti4-design.github.io/tagbench/).
:::

:::quiz
Q. Which element creates a link?
- `<link>`
* `<a>`
- `<href>`
- `<url>`
= `<a href="…">` is the anchor element; `<link>` connects stylesheets in the head.

Q. Which CSS selector matches `<div class="card">`?
- `#card`
* `.card`
- `card`
- `div#card`
= A dot selects by class; a hash selects by id.

Q. In the box model, which property adds space **inside** the border?
* padding
- margin
- outline
- gap
= Padding sits between the content and the border; margin is outside the border.

Q. Why should `<img>` have an `alt` attribute?
- It makes the image load faster
* It describes the image for screen readers and when the image fails to load
- It sets the image size
- It is required for CSS to work
= Alt text makes images accessible.
:::

=== javascript | JavaScript Essentials
desc: The language of the web: variables, types, functions, arrays and objects, loops, and making pages interactive with the DOM and events — with runnable examples.

**JavaScript (JS)** is the programming language every web browser runs. It makes pages interactive — buttons, form validation, live updates — and with **Node.js** it also runs on servers. Despite the name, it is unrelated to Java.

## Variables and types

```js run
let name = "Asha";        // can be reassigned
const year = 2026;        // cannot be reassigned
let cgpa = 9.1;
let enrolled = true;
let nothing = null;
let notSet;               // undefined

console.log(typeof name, typeof year, typeof enrolled, typeof notSet);
console.log(`${name} joined in ${year} with a CGPA of ${cgpa}`);   // template literal
```

Use `const` by default and `let` when the value changes. Avoid the old `var`.

:::warn == vs ===
`==` converts types before comparing, with surprising results (`"5" == 5` is true, `0 == ""` is true). Always use `===` and `!==`, which compare value **and** type.
:::

```js run
console.log("5" == 5, "5" === 5);
console.log(0 == "", 0 === "");
console.log(0.1 + 0.2);                  // the same floating-point behaviour as C and Python
console.log("3" + 4, "3" * 4);           // + joins strings; * converts to numbers
```

## Functions

```js run
function area(length, width = length) {        // default parameter
  return length * width;
}
const square = x => x * x;                       // arrow function
const greet = (name) => `Hello, ${name}!`;

console.log(area(4, 5), area(3), square(9), greet("Ravi"));
```

## Arrays and objects

```js run
const marks = [78, 92, 65, 88];
marks.push(71);
const total = marks.reduce((sum, m) => sum + m, 0);
const passed = marks.filter(m => m >= 70);
const curved = marks.map(m => Math.min(100, m + 5));
console.log(marks.length, total, passed, curved);
console.log([...marks].sort((a, b) => a - b));   // numeric sort needs a compare function

const student = { name: "Meera", roll: 12, skills: ["C", "JS"] };
student.city = "Hyderabad";
console.log(student.name, student["roll"], student.skills.join(", "));
console.log(JSON.stringify(student));
for (const [key, value] of Object.entries(student)) console.log(`  ${key}: ${value}`);
```

## Control flow

```js run
for (let i = 1; i <= 15; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}
```

`if/else`, `for`, `while`, `switch`, `break` and `continue` work just like in C.

## The DOM: making pages interactive

In the browser, JavaScript sees the page as a tree of objects — the **Document Object Model (DOM)**. You can **select** elements, **change** them and **react to events**:

```html
<button id="like">♥ Like</button>
<p id="count">0 likes</p>

<script>
  const button = document.querySelector("#like");
  const count = document.querySelector("#count");
  let likes = 0;
  button.addEventListener("click", () => {
    likes++;
    count.textContent = `${likes} like${likes === 1 ? "" : "s"}`;
  });
</script>
```

Try it — click the button, then change the code:

:::widget web-playground
<style>
  body { font-family: system-ui, sans-serif; margin: 24px; }
  button { font-size: 18px; padding: 10px 18px; border-radius: 10px; border: 0; background: #e8443a; color: white; cursor: pointer; }
  input { font-size: 16px; padding: 8px 10px; border-radius: 8px; border: 1px solid #ccc; }
</style>
<button id="like">♥ Like</button>
<p id="count">0 likes</p>
<p><input id="name" placeholder="Type your name"> <span id="hello"></span></p>
<script>
  const button = document.querySelector("#like");
  const count = document.querySelector("#count");
  let likes = 0;
  button.addEventListener("click", () => {
    likes++;
    count.textContent = `${likes} like${likes === 1 ? "" : "s"}`;
  });
  document.querySelector("#name").addEventListener("input", e => {
    document.querySelector("#hello").textContent = e.target.value ? `Hello, ${e.target.value}!` : "";
  });
</script>
:::

| DOM task | Code |
|---|---|
| Select one element | `document.querySelector(".card")` |
| Select many | `document.querySelectorAll("li")` |
| Change text | `el.textContent = "Hi"` |
| Change a style | `el.style.color = "red"` or `el.classList.add("active")` |
| React to events | `el.addEventListener("click", handler)` |
| Create elements | `document.createElement("li")` + `parent.append(li)` |

## Fetching data

Web apps load data from APIs without reloading the page:

```js
const response = await fetch("https://api.github.com/users/octocat");
const user = await response.json();
console.log(user.name, user.public_repos);
```

`await` waits for the network without freezing the page — JavaScript is **asynchronous**.

## Where to go next

JavaScript is the gateway to full-stack development: **React** for user interfaces, **Node.js** and **Express** for servers, and **TypeScript** for typed JavaScript in large projects.

:::quiz
Q. Which keyword declares a variable that cannot be reassigned?
- let
- var
* const
- static
= `const` bindings cannot be reassigned (though an object they point to can still be modified).

Q. What does `"5" === 5` evaluate to?
- true
* false
- an error
- undefined
= Strict equality also compares types, and a string is not a number.

Q. What does `[1, 2, 3].map(x => x * 2)` return?
* `[2, 4, 6]`
- `12`
- `[1, 2, 3, 2]`
- `6`
= `map` transforms every element.

Q. Which method runs a function when a button is clicked?
- `button.onclick()`
- `button.click(fn)` only
* `button.addEventListener("click", fn)`
- `document.event("click")`
= `addEventListener` registers an event handler.
:::
