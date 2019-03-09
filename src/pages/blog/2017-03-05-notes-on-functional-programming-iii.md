---
title: "Notes on Functional Programming III: Functor, Applicative & Monad"
date: 2017-03-05
category: post
path: /notes-on-functional-programming-iii
---

Preliminary: [The Fantasy Land](https://github.com/fantasyland/fantasy-land) algebra is a specification which many good functional libraries implement and covers additional laws of algebraic structures which I won't cover.

## Functor

A **functor** is just a container for values with a `map` method that applies a function to the values while consistently returning the new values in the same container.

According to this definition an array is a functor:

```js
const xs = [1, 2, 3];
// Array.isArray(xs) === true
const ys = xs.map(x => x);
// Array.isArray(ys) === true
```

You have an array with values, apply a function via `map` to each of the values and get an array with values back.

Unfortunately, not all data structures have a map function so you might need to write a wrapper which could be as simple as:

```js
class Wrapper {
  constructor (value) {
    this.value = value;
  }

  map(f) {
    return new Wrapper(f(this.value));
  }
}
```

### Advantages of a functor

**A functor enables generalized behavior**

It allows you to map over values without being tied to a specific structure.

Furthermore, all advantages of `map` over `for` loops apply to which is mainly compactness and expressiveness.

## Applicative

An **applicative** is an extension of a functor and is used to be able to apply functors to each other. In order to do this, it wraps a function around the value which is wrapped by the functor. The required `ap` method is used to automatically apply the already partially applied and wrapped function via `map` to the wrapped value of another functor:

```js
Wrapper.prototype.ap = function (wrapped) {
  return wrapped.map(this.value);
};
```

Additionally, an applicative must provide an `of` method which is used to create an instance with default minimal context:

```js
Wrapper.of = x => new Wrapper(x);
```

> Functors which only have an `ap` method are called Apply. Functors which only have an `of` method are called Pointed Functors. If they have both they are called Applicatives.

We will use `of` to write a new `map` method:

```js
Wrapper.prototype.map = function (f) {
  return Wrapper.of(f(this.value);
};
```

Let's assume we have the following setup:

```js
const add = x => y => x + y;
const wrapperOne = Wrapper.of(1);
const wrapperTwo = Wrapper.of(2);
const wrapperOneAdd = wrapperOne.map(add);
```

where `add` is a curried function and `wrapperOneAdd` is an object of type `Wrapper` with the wrapped value of `y => 1 + y`.

To be explicit:
The first box contains the integer `1`. The second box the result, i.e. `y => 1 + y`, of the function `add` which was applied to the boxed `1`. So we are two levels deep now.

Using the `ap` method would result in a new wrapped value:

```js
wrapperOneAdd.ap(wrapperTwo);
// Wrapper {value: 3}
```

The wrapped partial function `y => 1 + x` is applied to the unwrapped value of `2`, i.e. `y => 1 + 2` which is then returned as a wrapped value `3`.

Keep in mind the box is always of the same type, the values not necessarily.

### Advantages of an Applicative

An applicative is best used if you have several tasks which don't depend on each other, e.g. if you have several independent calls you could write the following interface:

```js
Task.of(renderPage)
  .ap(Http.get('orders'))
  .ap(Http.get('billing'));
  .ap(Http.get('ads'));
  .ap(Http.get('tracking'));
```

**An applicative promotes simplicity**

Generally speaking it creates a simple interface for complex code. However the real advantages can only be grasped if a specific applicative is used. General applicatives like the one described above are rather rare. Further information will be provided in the monad section.

## Monads

A **monad** applies a function which returns a wrapped value to a wrapped value. The main advantage over applicatives is that they run sequentially by providing the `chain` method. Here is an implementation of a general monad:

```js
class Monad {

  static of(value) {
    return new Monad(value);
  }

  constructor (value) {
    this.value = value;
  }

  map(f) {
    return Monad.of(f(this.value));
  }

  ap(monad) {
    return monad.map(this.value);
  };

  chain(f) {
    return this.map(f).value;
  }
}
```

Normally you would also implement the `join` method which is a straight forward helper method to return the value which helps us to flatten monads when chained:

```js
join() {
  return this.value;
}

chain(f) {
  return this.map(f).join();
}
```

However, just like general applicatives, a general implementation of a monad doesn't make much sense. One of the most common practical examples of a specific monad is the **Maybe monad**:

```js
class Maybe extends Monad {

  static of(value) {
    return new Maybe(value);
  }

  constructor(value) {
    super(value);
  }

  isNothing() {
    return (this.value === null || this.value === undefined);
  }

  map(f) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.value));
  }
}
```

It just checks whether the wrapped value is `null` or `undefined` and if it is, returns a wrapped `null`. Why is this interesting? Well, first of all it avoids pesky null checks. Additionally, it provides safety from runtime errors when chaining several methods where one may fail to return a value:

```js
const prop = p => o => o[p];

const getUsername = account => Maybe
  .of(account)
  .map(prop('personal'))
  .map(prop('user'))
  .map(prop('name'));

// Might be retrieved async!
const user = {
  personal: {
    user: {
      name: 'John Doe'
    }
  }
}

getUsername(user);
// Maybe { value: 'John Doe' }
```

If one property in the path wouldn't exist, we wouldn't get an error but a `Maybe` with value `null`.

Right now you probably think you have a déjà vu and yes you are correct *Promise* is a monad.

### Advantages of a monad

In general monads are concise and expressive with the ability to encapsulate side-effects.

The advantages of specific monads are as numerous as their implementations ranging from the simple forms of *State* ensuring the correct state flow, *Sequence* where `;` can be a monad for control flow, *Maybe* handling null checks, *Promise* handling asynchronicity up to the complex ones of *Probability Distribution* or *Transaction* for databases.

## Links

* [Notes on Functional Programming I: First-class, Pure, Curried Functions](/notes-on-functional-programming-i)
* [Notes on Functional Programming II: Composition & Point-free Style](/notes-on-functional-programming-ii)

