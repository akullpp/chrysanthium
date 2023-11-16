---
title: "CSS Preprocessors"
date: 2014-04-11
tags: post
permalink: /css-preprocessors
---

A preprocessor is a program that processes input which is then used as input for another program. Take for example the C preprocessor which uses `#` directives for includes. The CPP could be considered a independent language and CSS preprocessors are indeed a kind of scripting language which generate style sheets.

So why does Cascading Style Sheets need a preprocessor?

**Short answer:**
It's 2014 and in this day and age you shouldn't make development a finger but a mind exercise.

**Long answer:**
The intrinsic concepts of CSS are not trivial like many think. Even in a middle-sized project, it's a tremendous task to write hundreds of rules by hand. I've seen it several times that the styling rules become de facto unmaintainable and every change hurts, especially in combination with JSF.

The language has a wealth of [selectors](http://www.w3.org/TR/CSS21/selector.html), a priority scheme and the concept of specificity (see [Wikipedia](http://en.wikipedia.org/wiki/Cascading_Style_Sheets#CSS_Priority_scheme_.28highest_to_lowest.29)) which many back-end developers underestimate. Don't misunderstand me, it's still absolutely necessary that you learn these concepts. Otherwise you just hide the errors beneath a layer of pseudo-knowledge.

On the other hand web designers - which work on the front-end and are not necessarily programmers - tend to be oblivious of the [limitations](https://en.wikipedia.org/wiki/Css#Limitations) in a programmatic sense which often results in non-modular, unnecessary and verbose code.

The [most popular preprocessors](http://css-tricks.com/poll-results-popularity-of-css-preprocessors/) are [Sass](http://sass-lang.com/), [Less](http://lesscss.org/) and [Stylus](http://learnboost.github.io/stylus/). Sass and Less can be used in NetBeans projects, so we will focus on the both of them. In any case, the preprocessors are very similar in their latest versions. All code samples can be compiled in-browser via [CodePen](http://codepen.io/pen) which is included at the start of each example.

## Installation

Although there are graphical applications which allow you to use the preprocessors and even support both of them, we will concentrate on the CLI versions since we can use them in NetBeans.

You install Sass by downloading [Ruby](http://www.rubyinstaller.org/) and execute the packagemanager via:

```
gem install sass
sass -v
Sass 3.3.4 (Maptastic Maple)`
```

Likewise you need [Node's npm](http://nodejs.org/) for Less:

```
npm install less -g
lessc -v
lessc 1.7.0 (LESS Compiler) [JavaScript]
```

Once you installed the compilers you can set up the binaries in NetBeans in your project settings. Also, select the "Compile on Save" option in the _Project Properties_ and every _.scss file in the folder called "scss" will be compiled to a _.css file which will be located in the new folder "css".

## Variables

Variables can be numbers, strings, colors or boolean and the preprocessor substitutes the expressions.

[Sass](http://codepen.io/akullpp/pen/AsEGi/): The declaration begins with `$` and the value is assigned with `:`

```scss
$mainfont: "Comic Sans MS", cursive, sans-serif;

body {
  font: 500% $mainfont;
}
```

[Less](http://codepen.io/akullpp/pen/jCxur/): The only difference is the declaration of variables with `@`

```scss
@mainfont: "Comic Sans MS", cursive, sans-serif;

body {
  font: 500% @mainfont;
}
```

However, they handle scope differently and Sass allows you to overwrite global variables within a selector whereas Less doesn't.

## Nesting

Unlike HTML, CSS doesn't allow a nested hierarchy which reduces the readability of the markup. The preprocessors not only implement this feature but also allow to refer to the parent selector with `&`.

[Sass/Less](http://codepen.io/akullpp/pen/dGsxq/):

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: inline-block;
  }
  a {
    color: blue;
    &:hover {
      color: red;
    }
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

## Mixins

Mixins are blocks of reusable code with optional arguments and can be imported into style declarations.

[Sass](http://codepen.io/akullpp/pen/fFruH):

```scss
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  -ms-border-radius: $radius;
  border-radius: $radius;
}

div {
  border: 1px solid black;
  @include border-radius(10px);
}
```

[Less](http://codepen.io/akullpp/pen/IinzK):

```scss
 .border-radius(@radius: 5px) {
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
  -ms-border-radius: @radius;
  border-radius: @radius;
}

div {
  border: 1px solid black;
  .border-radius(10px);
}
```

## Inheritance

The most important feature regarding the DRY principle is the usage of inheritance similar to the concepts in programming languages.

[Sass](http://codepen.io/akullpp/pen/kqBtc):

```scss
#message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

#success {
  @extend #message;
  border-color: green;
}

#error {
  @extend #message;
  border-color: red;
}

#warning {
  @extend #message;
  border-color: yellow;
}
```

[Less](http://codepen.io/akullpp/pen/DKyHL/):

```scss
#message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

#success {
  &: extend(#message);
  border-color: green;
}

#error {
  &: extend(#message);
  border-color: red;
}

#warning {
  &: extend(#message);
  border-color: yellow;
}
```

## Miscellaneous

Additionally we have the [typical arithmetic operations](http://sass-lang.com/guide#topic-8). Sass has a weak type system as opposed to Less' which won't convert units of different measure.

Looping and conditionals are also supported but are best left for the advanced section of the relevant documentation and used when needed.

While Sass is definitely better at looping, Less has the ability to use JavaScript within style sheets. At the end of the day, it's just preference which you pick.
