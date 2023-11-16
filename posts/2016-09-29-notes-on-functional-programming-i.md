---
title: "Notes on Functional Programming I: First-class, Pure, Curried Functions"
date: 2016-09-29
tags: post
permalink: /notes-on-functional-programming-i
---

## First-class functions

A necessity for functional programming is the concept of **first-class functions**. Functions are _first-class citizens_ of a language if they can be:

- stored
- passed as argument
- returned

JavaScript is one of many languages which consider functions to be just another kind of object and allow their assignment:

```js
const square = (x) => x * x;
// square(2) = 4
```

Or to pass them as argument to other functions:

```js
const twice = (f) => (x) => f(x) + f(x);
// twice(square)(2) = 8
```

The constant `twice` takes a function `f` and returns a function which takes an argument `x` and applies `f` to `x`. This is done separately two times and then the two results are summed up. Interestingly, in a non-functional context this is might not always be equivalent to doubling the result of a function.

### What are the advantages of using first-class functions?

**First-class functions remove layers of indirection which would result in visual/cognitive strain and maintenance complexity.**

```js
// Indirection
const Controller = {
  create: (args) => Db.create(args),
};
```

The explicit wrapping in another function is unnecessary. We can pass the function like any other object to be executed later:

```js
// Without indirection
const Controller = {
  create: Db.create,
};
```

**First-class functions allow the maintenance of the application to become less complex since refactoring happens in one place.**

```js
// Indirection
getPost("/api/post", (json) => renderPost(json));
```

If we need to add another parameter, we need make a change in two places:

```js
// Refactoring
getPost("/api/post", (json, err) => renderPost(json, err));
```

Using the same technique as above, passing the function as object, we move the parameter definition to the implementation:

```js
// Better
getPost("/api/post", renderPost);
```

**First-class functions minimize naming issues which are introduced by coupling to a specific naming. Subjectivity, competence or changing requirements often introduce misnomers.**

```js
// Specifc
const validPosts = (posts) =>
  posts.filter((post) => post !== null && post !== undefined);
```

The code above is specifically tied to a certain domain where it doesn't have to be.

```js
// Abstract
const compact = (xs) => xs.filter((x) => x !== null && x !== undefined);
```

`xs` being the plural of `x` which is common in functional languages, e.g. [Clojure](http://dev.clojure.org/display/community/Library+Coding+Standards).

## Pure functions

Mutable state is probably the number one reason for software complexity [[Moseley & Marks 2006](http://shaffner.us/cs/papers/tarpit.pdf)].
However state is a necessity therefore it has to be encapsulated. **Pure functions** help you to reduce the complexity since it is self-contained and specifies everything it needs to produce a result:

```js
// Pure
const above = (n, limit) => return n > limit;
```

Therefore functions that rely on external state are not pure:

```js
// Impure
let limit = 0;
const above = n => return n > limit;
```

Given the same input it always returns the same output without observable side effects:

```js
let foo = [1, 2, 3];

// No side effect
foo.slice(0, 1);
// foo = [1, 2, 3]

// Side effect
foo.splice(0, 1);
// foo = [2, 3]
```

Described in this way, a programmatic function becomes identical to the mathematical definition of a function and can be understood as a mapping from one value to another, e.g. the values `[1, 2, 3]` could be mapped to `[2, 3, 4]` with:

```js
const addOne = {
  1: 2,
  2: 3,
  3: 4,
};
```

Indeed the function `f(x) = x + 1` is just a convenience.

### What are the advantages of using pure functions?

Given the example:

```js
const signUp = (db, credentials) => { ... };
```

**Pure functions are self-documenting via signature.**

Everything required to sign up a user is clear by the signature alone, you need a database for persistence and the credentials to persist.

**Pure functions are flexible due to parameterization.**

We have all dependencies as parameters and the implementation details of the database are irrelevant.

**Pure functions reduce the cognitive load and complexity introduced by introducing external environments.**

The implementation of the dependency is not relevant for the caller if the API is defined via signature.

**Pure functions are easier to test since we don't need complex mocks.**

Since we pass the dependencies as argument, we can pass the most simplistic version that satisfies the minimal requirements for the function to run.

**Pure functions enable cacheability via memoization.**

The behavior of a pure function is deterministic. No matter how often the function is executed, if the input stays the same so does the output. Therefore we can cache the result for a specific input.

**Pure functions have referential transparency which allows for easier refactoring and understanding of the code.**

> **Referential Transparency**: If an expression can be replaced by its value without changing the behavior of the program.

```js
// Referential transparency
const foo = () => "Hello world";
const foo = "Hello world";
```

Because a pure function is deterministic, we can replace it with its evaluated value. In fact, if our program would only consist of pure functions, we could mathematically proof its behavior and result.

On a smaller scale however, this becomes also handy in smaller chains of pure functions which are easier to refactor since you can reason about them a lot easier.

**Pure functions are parallelizable.**

They don't have shared memory and therefore can't have a race condition.

## Currying

**Currying** is the technique to translate a function with `n` arguments into `n` functions with one argument. The terminology is to say that the arity is reduced to one:

> **Arity**: The number of arguments a function takes.

```js
// Uncurried
const add = (x, y) => x + y;

// Curried
const add = (x) => (y) => x + y;
```

There are libraries which can help to create curried functions like [lodash.curry](https://www.npmjs.com/package/lodash.curry) and functional libraries like [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide) or [Ramda](http://ramdajs.com/) provide curried functions by default.

### Advantages of currying?

**Currying enables syntactical conciseness and expressiveness.**

Unfortunately, it is extremely difficult to find simple examples that convey the advantages of currying.

With growing complexity, the usefulness of currying increases, especially if you use a library like React with higher-order components or just plain higher-order functions.

> **Higher-order Function**: A function receiving a function and/or returning a function.

Let's look at an artificial example:

```js
const get = (prop) => (obj) => obj[prop];
const map = (fn) => (xs) => xs.map(fn);

const getIds = map(get("id"));
getId([{ id: 1 }, { id: 2 }, { id: 3 }]);
// [1, 2, 3]
```

You can create a specific function from an abstract one with no cost at all.

## Bonus: Partial Application

Often confused with currying, **partial application** is the pre-filling of some arguments to create a new function. Curried functions are therefore always partially applied. For the example we use lodash's `_.partial` method to enable placeholders:

```js
const getPersons = (division, active, external) => { ... };
const getActivePersons = _.partial(getPersons, _, true, _);
const getActiveInternalPersons = _.partial(getPersons, _, true, true);
```

If the order is not important, you can use JavaScript's `bind`:

```js
const add = (x, y, z) => x + y + z;
const addOneMore = add.bind(null, 1, 2);
addOneMore(3);
// 1 + 2 + 3 = 6
```

**Partial Application creates concise and fluent APIs without repetition.**

By deriving specific functions from an abstract one, partial application makes your code more readable.

## Links

- [Notes on Functional Programming II: Composition & Point-free Style](/notes-on-functional-programming-ii)
