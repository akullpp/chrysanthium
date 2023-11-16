---
title: 'ESLint Integration'
date: 2015-09-04
tags: post
path: /eslint-integration
---

[ESLint](http://eslint.org/) is a JavaScript linter much more capable than JSHint in terms of customizability. This post will give you detailed instructions on how to integrate it in a multi-module project environment independent of its size. The approach presented is itself modular and creates a ESLint environment which is adaptable.

ESLint is to be preferred if programmatic enforcement with [JSCS](http://jscs.info/) is out of the question. It strength stems from the usage of Espree an JavaScript parser that produces an [Abstract Syntax Tree](http://felix-kling.de/esprima_ast_explorer/). The exposition of the AST allows for creating own rules. Furthermore it provides a great documentation, built-in features and testing framework.

## Setup

You want to create a plugin which governs your rules, therefore you will need to create a node module that will be added in each dependent's `package.json`. Please find a ready-to-use skeleton implementation [here](https://github.com/akullpp/eslint-plugin-skeleton).

> Note that the name of the folder and plugin itself must start with `eslint-plugin-`

## Structure

Let us analyze the minimal structure of the plugin module:

```
config/
  mixins/
  eslintrc.base
rules/
test/
index.js
package.json
```

The main configuration - with your rules initialized to a sensible default - is located in `config/eslintrc.base`. This file is also the `"root": true` of our environment. The most important adaption is:

```json
"plugins": {
  "skeleton"
}
```

which allows ESlint to recognize the folder `node_modules/eslint-plugin-skeleton/` as plugin once installed with npm.

> ESLint configuration files are YAML, a superset of JSON, which allow comments

## Mixins

It is common to have different environments in your application, e.g. in Angular you want different linting processes for your source folder and test folder. Probably you'll even want to distinguish between your tests based on whether they are unit, API or E2E tests. However, all of them can share a common ground and specify their individual needs.

> ESLint uses a cascading hierarchy, the proximate `.eslintrc` will have priority

This is the case for `config/mixins`. The base configuration gets extended by a mixin for a particular environment:

- Source environment `config/mixin/browser`:

```json
{
  "env": {
    "node": false,
    "browser": true
  },
  "rules": {
    "strict": [2, "function"],
    "no-console": 2
  }
}
```

- Test environment `config/mixin/test`:

```json
{
  "env": {
    "mocha": true
  },
  "rules": {
    "skeleton/leftover-only": 2
  }
}
```

Note the prefix of the custom rule is the same as the plugin name.

`leftover-only` is an example rule which detects `.only`

- Unit test environment `config/mixin/unit`:

```json
{
  "extends": ["./browser", "./test"],
  "globals": {
    "inject": true,
    "module": true,
    "sinon": true
  }
}
```

## Custom Rules

Custom rules go to `rules` and their respective tests to `test`. They have to be exported inside the `index.js`:

```js
'use strict'

module.exports = {
  rules: {
    'leftover-only': require('./rules/leftover-only'),
  },
}
```

## Integration

The dependent modules or applications will need to add following dependencies to their `package.json`:

```json
"eslint": "^1.1.0",
"eslint-plugin-skeleton": "^1.0.0"
```

> You'll need a private registry or you have to use git urls

Let's construct a typical Angular application structure enriched by ESLint:

```
app/
  bower_components/
  .eslintrc
node_modules/
test/
  e2e/
    .eslintrc
  api/
    .eslintrc
  unit/
    .eslintrc
.eslintignore
.eslintrc
```

The `.eslintignore` is similar to a `.gitignore` and should ignore your `app/bower_components` and your `dist`.

The base `.eslintrc` will extend the base configuration from the plugin and function as root:

```json
{
  "extends": "./node_modules/eslint-plugin-skeleton/config/eslintrc.base"
}
```

The specific configurations extend their mixin. Examples:

`app/.eslintrc`:

```json
{
  "extends": "../node_modules/eslint-plugin-skeleton/config/mixins/browser"
}
```

`app/test/unit/.eslintrc`:

```json
{
  "extends": "../node_modules/eslint-plugin-skeleton/config/mixins/unit"
}
```

and so on.

If you then run `npm i` it will install the plugin and it will be available. Changes to your linting can be made at a central location, your build tool isn't a special case and it works flawless with editor plugins.

> Global ESLint doesn't recognize local plugins. Always install ESLint and the plugin locally. Also you can't link your Gulp module with the lint task.
