---
title: "Usable ECMAScript Snippets"
date: 2019-03-20
category: post
path: /usable-ecmascript-snippets
---

Initially, I had the tendency to outsource utility functionality to external modules, but the more I develop software, the more I want to be in control. If you are like me and value clarity far more than designing for every edge case that will never occur, then the advantages outweigh the disadvantages by far. Not only do you learn a lot more when you tailor code to the problem at hand and peer review them with other developers but you also save a lot of cognitive complexity stemming from external modules which are not in your domain of control. There us nothing wrong using the modules of [lodash](https://lodash.com) which has the best code I ever saw in a frontend library. However, by definition it must be far more elaborate and optimized to be called a library and even simple functions have hundreds if not thousands lines of code.

Many good snippets can be found on the [30 seconds of code](https://30secondsofcode.org) page which is a great resource and I want to share some stuff which I find myself reusing between projects relatively often.

## Console

This one is easy, yet it saves so much time if you have the names of the variables included automatically:

```js
console.log({ x, y, z })
// {x: "1", y: "2", z: "3"}
```

The `console#log` function returns `undefined` which is a falsy value and therefore you can pipe another expression:

```js
console.log() ||
```

Especially valuable if you work with React's functional components and want to log out props:

```jsx
export default () => ({ x, y }) => console.log({ x, y }) || (
  <H1 blink={x}>
    {y}
  </H1>
)
```

## Destructuring

I think that it is common to destructure object properties and you know the basics of nesting and naming so I included it with arrays because it is lesser known and can provide better readability:

```js
const [x, y, z] = [1, 2, 3]
// x === 1, x === 2, x === 3
```

This is interesting if you are calling a function which returns multiple values, e.g.

```js
const [count, setCount] = useState(0);
```

## Random

Sometimes you just need a seemingly random number or string. Instead of `Math#random` which produces a floating point number in the interval of [0 1) and has a very high chance of collisions, I like to use the modern crypto API to get a random integer or string. The `toString` method takes an optional radix parameter between 2 and 36 which converts to a specific base, e.g. 2 would generate binary and 16 hex:

```js
crypto.getRandomValues(new Uint32Array(1))[0]
// 3179082265
crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
// '13cqv2'
crypto.getRandomValues(new Uint32Array(1))[0] * Math.pow(2, -32)
// 0.8998060114681721
```

Picking up the example from before we want to often want to generate RFC4122 UUIDs of the form `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` where `x` can be in the range of `[0 F]` and `y` in `[8 B]`. The code replaces the numbers `0 1 8` with values in the said limits. The bit shifting is really awesome and explained [here](https://gist.github.com/jed/982883#gistcomment-55231):

```js
`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, c =>
  (
    c ^
    (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
  ).toString(16)
)
// "d0b744a0-635d-48d7-9137-9c0ce255b924"
```

## Validation

Many developers test specifically for `undefined` or `null` but in many cases cognitive complexity can be reduced by rejecting all falsy values, i.e. `false null undefined 0 '' "" NaN`:

```js
!x
```

If, e.g. an empty string is a valid value, you should do it in a concise manner:

```js
const isNil = (x) => [undefined, null].includes(x)
// isNil('') === false
```

Another option would be check for emptiness, e.g. `{}`, `[]` or `''`:

```js
const isEmpty = x => x == null || !(Object.keys(x) || x).length
```

Often we want to find out if something is a number:

```js
const isNumber = x => !isNaN(parseFloat(x)) &&
                      isFinite(x) &&
                      Number(x) == x
```

Or more generally has a specific type:

```js
const is = (type, x) => ![undefined, null].includes(x) &&
                          x.constructor === type
// is(Number, 1) === true
```

We can also check the truthiness of value by evaluating a predicate which might trigger a conditional:

```js
const when = (p, then) => x => (p(x) ? then(x) : x)
```

## String

Sanitize input by removing every characters that are not printable ASCII.

```js
const sanitizeAscii = s => s.replace(/[^\x20-\x7E]/g, '')
```

Often you need to display long strings for preview by truncating them:

```js
const truncate = (s, n) => s.length > n ?
                           `${s.substring(0, n - 1)}…` :
                           s
// truncate('Hello World', 5) === "Hell…"
```

Parses the parameters from a valid URL into an object:

```js
const parseParameters = url =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((a, v) =>
    (
      (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
    ),
    {}
  )
// const url = 'https://www.example.com?q=foo&s=bar'
// getParameters(url) === {q: "foo", s: "bar"}
```

## Array

Everything is a list, it either has zero or `n` elements. It is easier to work with lists, therefore:

```js
const toList = x => (Array.isArray(x) ? x : [x])
```

Get all truthy values out of an array:

```js
xs.filter(Boolean)
```

Filter out duplicates:

```js
const unique => xs => [...new Set(xs)]
```

With this snippet you will never overshoot and get `undefined` when the array index is out of bounds because it will start over which is ideal for slideshows:

```js
const getSafe = (xs, n) => xs[n % xs.length]
// getSafe(['a', 'b', 'c'], 6) === 'a'
```

Merge multiple arrays:

```js
const merge = (...xs) => [].concat(...xs)
// merge([1, 2], [3, 4]) === [1, 2, 3, 4]
```

Get the nth argument which might bring readability in some cases compared to named destructuring:

```js
const nth = n => xs => (
  n === -1 ?
  xs.slice(n) :
  xs.slice(n, n + 1)
)[0]
// const first = nth(0); first([1, 2, 3]) === 1
```

This range function can be used to generate steppers or provide to do execute n times:

```js
const range = (start, end, step = 1) =>
  Array.from(
    { length: Math.ceil((end - start) / step) },
    (_, i) => start + i * step
  )
// range(1, 2, 3) === [1]
```

Cut an array up in multiple chunks, often used in pagination for example:

```js
const chunk = (xs, size) =>
  Array.from({ length: Math.ceil(xs.length / size) }, (_, i) =>
    xs.slice(i * size, i * size + size)
  )
// chunk([1,2,3,4,5], 2) === [[1, 2], [3, 4], [5]]
```

Divide an array into two groups by evaluating a predicate on each value:

```js
const partition = (xs, fn) =>
  xs.reduce(
    (acc, x, i, xs) => {
      acc[fn(x, i, xs) ? 0 : 1].push(x)
      return acc
    },
    [[], []]
  )
// const users = [
//   { name: 'John', active: true },
//   { name: 'Ben', active: true },
//   { name: 'Sam' active: false },
// ]
// partition(users, user => user.active) === [
//   [{ name: 'John', active: true }, { name: 'Ben', active: true }],
//   [{ name: 'Sam' active: false }]
// ]
```

## Object

Assign default values for all `undefined` properties in multiple objects:

```js
const defaults = (obj, ...defs) =>
  Object.assign({}, obj, ...defs.reverse(), obj)
// defaults({ a: 1 }, { b: 2 }, { b: 6 }, { a: 3 }) === { a: 1, b: 2 }
```

One of the ugliest parts in many languages is to access deeply nested values. This code uses a specific string syntax with `[n]` to indicate array indices and paths separated by `.`:

```js
const get = (from, ...selectors) =>
  [...selectors].map(s =>
    s
      .replace(/\[([^\[\]]*)\]/g, ".$1.")
      .split(".")
      .filter(t => t !== "")
      .reduce((prev, cur) => prev && prev[cur], from)
  )
// const o = { target: [1, 2, { a: 'a' }] }
// get(o, 'target[0]', 'target[2].a') === [1, 'a']
```

Sometimes it is easier to omit one or more properties and not to destructure:

```js
const omit = (o, props) =>
  Object.keys(o)
    .filter(key => !props.includes(key))
    .reduce((acc, key) => ((acc[key] = o[key]), acc), {})
```

Immutability is sometimes required but always desired. Therefore it is good to ensure it:

```js
const deepFreeze = obj =>
  Object.keys(obj).forEach(prop =>
    !(obj[prop] instanceof Object) || Object.isFrozen(obj[prop])
      ? null
      : deepFreeze(obj[prop])
  ) || Object.freeze(obj)
```

Destructuring unfortunately keeps deeply nestled references:

```js
const deepClone = obj => {
  let clone = Object.assign({}, obj)
  Object.keys(clone).forEach(
    key =>
      (clone[key] =
        typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key])
  )
  return Array.isArray(obj) && obj.length
    ? (clone.length = obj.length) && Array.from(clone)
    : Array.isArray(obj)
    ? Array.from(obj)
    : clone
}
// const a = { foo: [{bar: 'bar'}] }
// const b = deepClone(a)
// b !== a && b.foo[0].bar !== a.foo[0].bar
```

## Date

Often a library like [Day.js](https://github.com/iamkun/dayjs) is not necessary in small applications which are not to concerned with complex time arithmetic:

```js
const isAfter = (a, b) => a > b
const isBefore = (a, b) => a < b
const isSame = (a, b) => a.toISOString() === b.toISOString()
const daysBetween = (from, to) => (to - from) / (1000 * 3600 * 24)
```

## Function

Sometimes you might want to throttle (asynchronous) function calls or need to simulate something:

```js
const sleep = ms => data =>
  new Promise(resolve => setTimeout(resolve, ms, data))
```

I [explained](/notes-on-functional-programming-ii) the advantages of function composition to create complex data flows before and like to do it from right to left:

```js
const compose = (...fns) =>
  fns.reduce((f, g) => (...args) => f(g(...args)))
// const a = () => console.log('a')
// const b = () => console.log('b')
// const c = () => console.log('c')
// const abc = compose(c, b, a)
// abc() === 'a' 'b' 'c'
```

Currying allows for conciseness and expressiveness as explained in the [first post](/notes-on-functional-programming-i) of functional programming series:

```js
const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ?
  fn(...args) :
  curry.bind(null, fn, arity, ...args)
//  curry(Math.pow)(2)(10) === 1024
```
