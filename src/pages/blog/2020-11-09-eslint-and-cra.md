---
title: "ESLint and CRA"
date: 2020-11-09
category: post
path: /eslint-and-cra
---

create-react-app's handling of ESLint was always bad in the past but with recent changes has become unbearable. There is not only the issue that the dependencies are extremely outdated, extending the configuration is next to impossible - and flaky at best - but also the lacking feature of disabling ESLint has become a near blocker in term of performance for large code bases that do not want to eject.

Additionally, many projects nowadays use commit hooks and/or have their CI configured correctly for running the lint task which makes the linting of the entire source during **every** recompilation, no matter how small the change, unnecessary waiting time. The actual straw that broke the camel's back was the frequent [blocking of rendering](https://github.com/facebook/create-react-app/issues/9887) which occurs much more frequent in CRA v4 and totally breaks the development flow.

So here's how to set up CRA and ESLint in a sensible manner:

## Use CRA v3

```shell
npm i -DE react-scripts@3
```

## Use library to overwrite CRA's settings

```shell
npm i -DE @craco/@craco
```

I currently use the "Create React App Configuration Override" library but there are a lot of alternatives, e.g.:

* [react-app-rewired](https://github.com/timarney/react-app-rewired)
* [customize-cra](https://github.com/arackaf/customize-cra)
* [rescripts](https://github.com/harrysolovay/rescripts)

Add a `craco.config.js` at the root with the following content:

```js
module.exports = {
  eslint: {
		enable: false,
	},
};
```

## Substitute `react-scripts` with `craco`

In the scripts section of your `package.json`:

```json
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
  }
```

If you want to additionally improve your linting experience I suggest the following two steps:

## Update libraries

```shell
npm i -DE eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks
```

```json
	"eslintConfig": {
		"env": {
			"browser": true,
			"es6": true,
			"jest": true
		},
		"parser": "babel-eslint",
		"settings": {
			"import/resolver": {
				"node": {
					"paths": [
						"src"
					]
				}
			}
		},
		"extends": [
			"plugin:react/recommended",
			"airbnb",
			"airbnb/hooks",
			"prettier",
			"prettier/react",
			"plugin:prettier/recommended"
		],
		"parserOptions": {
			"ecmaFeatures": {
				"jsx": true
			},
			"ecmaVersion": 2018,
			"sourceType": "module"
		},
		"plugins": [
			"react",
			"prettier"
		],
		"rules": {
			"prettier/prettier": "error",
		}
	},
```

I strongly suggest to use [Prettier](https://prettier.io/) if you don't yet.

## Commit hook

```shell
npm i -DE husky lint-staged pretty-quick
```

```json
	"husky": {
		"hooks": {
			"pre-commit": "lint-staged"
		}
	},
	"lint-staged": {
		"src/**/*.js": [
			"pretty-quick --staged",
			"eslint --fix"
		]
	},
```
