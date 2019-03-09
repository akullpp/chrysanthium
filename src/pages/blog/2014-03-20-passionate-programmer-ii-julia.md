---
title: "The Passionate Programmer II: At The Edge with Julia"
date: 2014-03-20
category: post
path: /passionate-programmer-ii-julia
---

If you read the post about becoming [a passionate programmer](/act-on-it), you also read the advice to try a new language. Although I recommend to learn a more common language which you haven't had the chance to look at yet, you could also try one of those bleeding edge languages for fun and profit. It also provides you with the excellent opportunity to engage in open source activities and develop libraries or the language itself.

I'd like to give you a short introduction to a relatively new programming language which I think looks promising and was recently featured in a [Wired article](http://www.wired.com/wiredenterprise/2014/02/julia/). We will focus on the differences of this bleeding edge language and compare it to the most common mainstream languages.

I'm certainly not an expert regarding this language and just a humble learner myself, therefore I'm not able to cover the intrinsic issues which may lie deep inside the implementation of the theoretical concepts. All I want is to provide a short glimpse why this particular language might be worth a second look.

## Overview

This multi-paradigm language appeared in 2012 and is strongly influenced by Lisp and Python. In a negative sense, MATLAB and particular R also played a major role in the development of Julia since the speed and/or usability of languages designed for statistics are often abysmal. Its intention is to provide high-performance numerical and scientific computing while having the advantages of a dynamic language. Currently, it is being hyped as "C for data scientists".

## Advantages

* Fast
* Easy to learn and readable syntax
* Dynamic, clean type system with promotion
* Homoiconicity and macros
* Multiple dispatch
* Connectivity to other language libraries
* Optimized for numerical operations
* Standard library written in Julia

## Features

### Fast

The developers provide detailed information on their [website](http://julialang.org/) and indeed it is within reach of C as we can validate with a simple recursive fibonacci that takes twice as long as the C pendant.

The main point with the speed of Julia and the comparison with other languages is to write unvectorized code. If you optimize and vectorize your code in Python you are as fast as Julia if not a little bit faster.

It compiles to [LLVM](https://en.wikipedia.org/wiki/LLVM) bytecode which not only means speed improvements but also increases potential portability and interoperability.

### Syntax & Types

The syntax is essentially the same as Python and therefore as readable and easy to use. In fact, this strongly favors Julia since you often need to write [Cython](https://en.wikipedia.org/wiki/Cython) anyway in critical situations.

The clear advantage of Julia as compared to Python is the clean type and promotion system. Python has an awful type system which was [tacked on later](http://legacy.python.org/dev/peps/pep-3119/) while Julia had the advantage to learn from the mistakes of its predecessors and integrated a well rounded system.

### Homoiconicity

The concept of metaprogramming as specified by Lisp in 1958 is fundamental and states that programs are represented as datastructures of the language itself. Therefore, assembly is [homoiconic](http://en.wikipedia.org/wiki/Homoiconicity). Julia is also homoiconic which means a program can write a program, including itself. It can transform and generate its own code and reflect it.

### Multiple Dispatch

Methods are not functions. A function maps arguments to a return value, e.g. the addition function is conceptually the same for integers and floating points but are implemented differently regarding their behavior. These behavior-driven implementations are methods which can depend on the type, order or count. The choice which method to use, is called [(multiple) dispatching](https://en.wikipedia.org/wiki/Multiple_dispatch).

Let us look at a passage from the Julia manual:

> In C++ or Java, for example, in a method call like `obj.meth(arg1,arg2)`, the object `obj` "receives" the method call and is implicitly passed to the method via the this keyword, rather then as an explicit method argument. When the current this object is the receiver of a method call, it can be omitted altogether, writing just `meth(arg1,arg2)`, with this implied as the receiving object.

This doesn't sound like much, but it's big and allows for decoupling complex algorithms from implementation details. The set of methods is not closed, you can create or remove methods based on behavior. Out of all applicable methods, you can choose the effective method at runtime. For implementation details, check below.

### Connectivity

You can just call Fortran and C code from Julia, no glue code involved.

Other languages have packages, so that you can for example [call Python calling Julia](http://blog.leahhanson.us/julia-calling-python-calling-julia.html).

### The Standard Library

Julia's standard library is written in Julia.

This is a big deal since a native implementation reduces overhead from system library calls, which is important in a  high-performance language. Furthermore, the source code is simpler to read and to understand. If you know Python and want to work on the Core or a library like NumPy, you can't. It is entirely written in C which is a disadvantage for many people.

Currently the Julia environment is of course not as rich as R. To be honest, there might be not many programmers that actually like R, but what you definitely do like, is the vast code base. Would you rather implement MCMC from scratch in R or Python? The only way to fix this, is to get involved and create packages.

## A Look Inside

### Datatypes and Operators

The datatypes and operators are just like you would expect and for your sanity omitted. Additionally, we have a rational type that reduces to the lowest term thanks to the type system:

```julia
julia> 3//6
1//2
```

Int divided by Int results in a Float:

```julia
5/2 # 2.5
```

Strings are an array unicode chars. This will result in some peculiarities since UTF-8 uses more than a single byte for characters:

```julia
"Jül"[1] # 'J'
"Jül"[2] # 'ü'
"Jül"[3] # ERROR: invalid UTF-8 character index
"Jül"[4] # 'l'
```

Like Perl, we have string interpolation:

```julia
"1 + 1 = $(1 + 1)" # equal to "1 + 1 = 2"
```

Variable names support unicode, start with a letter and can contain digits, underscores and exclamation marks:

```julia
julia> ಠ_ಠ = bits(-0)
"0000000000000000000000000000000000000000000000000000000000000000"
```

If a variable is preceded by a numeric literal, it implies multiplication:

```julia
2(x-1)^2 - 3(x-1) + 1
```

Which also adds a lot of possible confusion with juxtaposition:

    (x-1)(x+1) # type error: apply: expected Function, got Int64

You can create constants with `const` which is only necessary for optimization of global variables.

Chain comparisons are allowed:

    1 < 2 <= 2 < 3 == 3 > 2 >= 1 == 1 < 3 != 5 # true

Julia is an 1-index language which is common in statistically-oriented languages. One dimensional array notation is as expected, two dimensional arrays are semicolon-separated:

    vector = [1, 2]
    vector[end] # last index
    matrix = [1 2; 3 4]
    push!(vector, 3) # results in vector = [1, 2, 3]

Functions with exclamation mark indicate that they modify their argument.

We also have the possibility to use multidimensional arrays, e.g.:

    julia> x = reshape(1:16, 4, 4)
    4x4 Int64 Array
    1 5  9 13
    2 6 10 14
    3 7 11 15
    4 8 12 16

    julia> x[2:3, 2:end-1]
    2x2 Int64 Array
    6 10
    7 11

Of course it is possible to call BLAS or LAPACK functions if they are not implemented in Julia and we have special structures, e.g. [sparse matrices](http://en.wikipedia.org/wiki/Sparse_matrix).

Further array and tuple methods, ranges, un/packing and slicing are similar to Python. Dictionaries also behave similar but the notation differs:

    for (k, v) in ["one"=>1,"two"=>2,"three"=>3]
        println("$k = $v")
    end

Indentation has no semantic meaning and block/control-statements close with an `end`.

Like Python, we have list comprehensions - except we don't have an `if` clause:

    [f(10)(i) for i = [1:5]] # [11, 12, 13, 14, 15]

### Functions

Julia has [first-class functions](https://en.wikipedia.org/wiki/First-class_function) which can be anonymous and are defined as follows:

    function f(x)
        function g(y)
            x + y
        end
        g
    end

    julia> f(10)(3)
    13

As we can see the `return` keyword is optional and the default is to return the last statement.

The function above is equal two following lambda syntax:

    function f(x)
        y -> x + y
    end

We also have the option to pass anonymous functions to other functions as arguments:

    map([A, B, C]) do x
        if x < 0 && iseven(x)
            return 0
        elseif x == 0
            return 1
        else
            return x
        end
    end

Compound expressions are a neat way to do one-liners:

    (x = 1; y = 2; x + y) # 3

Coroutines can be suspended and resumed:

    function producer()
      for n = 1:5
        produce(2n)
      end
    end

    p = Task(producer)
    consume(p) # 2
    consume(p) # 4
    consume(p) # 6
    consume(p) # 8
    consume(p) # 10

Furthermore and unfortunately too extensive to cover here, we have a myriad of [build-in mathematical functions](http://docs.julialang.org/en/release-0.2/stdlib/base/#mathematical-functions) like[ machine epsilon](http://en.wikipedia.org/wiki/Machine_epsilon).

### Types

Julia has a rich type system with promotion where every type is placed within a hierarchy:

    typeof(5) # Int64
    typeof(Int64) # DataType
    typeof(DataType) # DataType

    super(5) # Int64
    super(Int64) # Signed
    super(Signed) # Real
    super(Real) # Number
    super(Number) # Any
    super(Any) # Any

    subtypes(Signed) # [Int128, Int16, Int32, Int64, Int8]

A type is set with the `::` operator and can be attached to non-variables as assertion. If we don't set an explicit type, it will default to `::Any`.

We can also define our own types. Let us begin with defining an abstract type. An abstract has no instantiation since it is just a node in the type graph:

    abstract Integer <: Number
    You can define your own bits types:
    bitstype 32 Float32 <: FloatingPoint

Like C, Julia has structures which are really composite types, i.e. a collection of named fields. Additionally, the structures can be immutable or be part of a union. Please note, that there are no functions attached to a structure since we have multiple dispatching:

    type Product
        price::Float32
        name
    end

    p = Product(32., "Gadget")
    p.name # "Gadget"

Although not advised, you can define the constructor within the block:

    type UniquePair
       x::Number
       y::Number

       Pair(x,y) = x == y ? error("Arguments with same values") : new(x,y)
    end

You can add functionality by defining a new constructor method:

    UniquePair(x) = UniquePair(x,x) # distributes the argument to both fields

    UniquePair() = UniquePair(0, 1) # sets a default constructor method

Regarding generics Julia is very similar to Java's templating:

    type Point{T}
        x::T
        y::T
    end

### Methods

Julia allows to choose the method based on the type of arguments. This is called multiple dispatching and one critical feature of Julia. If you have a look at the addition function you see how many methods it has:

    julia> methods(+)
    # 92 methods for generic function "+":
    +(x::Bool,y::Bool) at bool.jl:38
    ...
    +(x::Int128,y::Int128) at int.jl:43
    ...

Defining a method is simple:

    f(x::Float64, y::Float64) = 2x + y
    f(2.0, 3.0) # 7.0
    f(2.0, 3) # no method f(Float64,Int64)

You can of course define a more abstract type and delegate the details to the arithmetic operation or use parametrics. However, specific behavior always overrules general. In our example, the method for floating point numbers would be used if possible instead of a more general one.

### Modules

One example to show almost the entire functionality of creating modules:

    module PointModule
    using Lib
    export Point, f

    type Point
        x
        y
    end

    g(x,y) = x * y
    f(p::Point) = g(p.x,p.y)

    import Base.show

    show(io:IO, p::Point) = print(io, "Point: x=$(p.x), y=$(p.y)")

    end

First we define the name of the modul, the standard library which is used for searching and which parts we would like to make public. Finally, we define types and functions. The module is used with:

    julia> Name.Pair(1,2)
    Pair: x=1, y=2

    Name.f(p) # 2

### Metaprogramming

Julia programs are represented as Julia data structures of the expression type:

    type Expr
        head::Symbol
        args::Array{Any,1}
        typ
    end

With the definition of:

    julia> a = 1
    1

    julia> :(a + 2)
    :(a + 1)

    julia> eval(ans)
    2

    julia> Expr(:call, :+, a, 1) # equivalent to shorthand :($a + 1)
    :(1 + 1)

    julia> eval(ans)
    2

This allows us to generate code from inside the language. Take for example the definition of the addition- and subtraction-function for three arguments which refer to the two argument form:

    for op = (:+, :-)
        eval(:(($op)(a,b,c) = ($op)(($op)(a,b),c)))
    end

Macros are convenient to generate code at compile time:

    macro assert(ex)
        :($ex ? nothing : error("Assertion failed: ", $(string(ex))))
    end

    julia> @assert 1 == 0 # 1 == 0 ? nothing : error("Assertion failed: ", "1 == 0")
    Assertion failed: 1 == 0

### And More...

Julia has immense capabilities for [parallel computing](http://docs.julialang.org/en/release-0.2/manual/parallel-computing/).

It can run external commands with the full implications, e.g. ``run(`ls`)``.

You can [call C and Fortran functions](http://docs.julialang.org/en/release-0.2/manual/calling-c-and-fortran-code/) without glue code.

If you need packages, it even has a [build-in package manager](http://docs.julialang.org/en/release-0.2/manual/packages/).
