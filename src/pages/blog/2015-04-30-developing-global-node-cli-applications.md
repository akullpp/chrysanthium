---
title: "Developing Global Node CLI Applications"
date: 2015-04-30
category: post
path: /developing-global-node-cli-applications
---

When you install a global node module via `npm i -g` you can use the module everywhere just like typing a shell command. Developing such a command-line module is a bit different from developing just another node library. I will explain how to do it and what the best practices are in the process.

## Folder structure

The structure is pretty simple since the module should only solve one particular problem:

    packageName/
      bin/            -- location of the binaries
      lib/            -- location of the source code
      test/           -- location of the test code
      .gitignore
      LICENSE
      README.md
      package.json

There can be rare scenarios where it is necessary to create another folder in the lib folder if you provide it as library too in order to avoid namespace clashes. Further, it may be sensible to differentiate between unit- and integration-tests. However, this structure should be enough in general.

## package.json

First you will need a `package.json`. Many people use `npm init` but since I will change everything afterwards anyway, I tend to write it manually in an editor. Here is the entire skeleton:

    {
      "name": "",
      "version": "",
      "description": "",
      "keywords": [
      ],
      "homepage": "",
      "license": "",
      "author": "",
      "main": "",
      "bin": {
        "": "",
      },
      "repository": {
        "type": "git",
        "url": ""
      },
      "scripts": {
        "test": "mocha"
      },
      "dependencies": {
      },
      "devDependencies": {
        "mocha": "*",
        "chai": "*"
      },
      "preferGlobal": true
    }

You can [read up](https://docs.npmjs.com/files/package.json) the particularities of each option but this is pretty standard. There is a difference regarding the `bin` options. This is the command you will use to run the node application, e.g.

    "bin": {
      "global-node-module": "./bin/global-node-module",
      "gnm": "./bin/global-node-module"
    }

You can either type `global-node-module` or `gnm` to run the file in the `bin` folder. But how does the binary file look like?

    #!/usr/bin/env node

    require('../lib/global-node-module');

It is just a script file with the environment in a shebang notation.

The second specific option is the `preferGlobal` flag. It will provide a warning if the package is installed locally.

## Testing Libraries

I added two development dependencies which I use regardless of the functionality of the library:

* [Mocha](http://mochajs.org/) is a framework which is preferable to Jasmine since it provides a more convenient way to test asynchronous code.
* [Chai](http://chaijs.com/) is a assertion library which works very well with the whole testing stack.

For specific testing purposes I can recommend:

* [Chai as Promised](https://github.com/domenic/chai-as-promised/) is used to provide fluent assertions when using promises.
* [Sinon](http://sinonjs.org/) provides spies, stubs and mocks.
* [Sinon-Chai](https://github.com/domenic/sinon-chai) extends Chai with assertions about Sinon.
* [mock-fs](https://github.com/tschaub/mock-fs) allows for in-memory filesystem mocking.
* [rewire](https://github.com/jhnns/rewire) adds setters/getters so you can modify the private behavior of modules.

## Other Libraries

I strongly advise to use [Promises/A+](https://promisesaplus.com/) instead of callbacks which is also supported by Mocha. There is the obvious choice of:

* [Q](https://github.com/kriskowal/q) is a solid choice if you start out with promises.
* [BlueBird](https://github.com/petkaantonov/bluebird) is a better choice if you already have experience with promises.

You will want the functional utility library [lodash](https://lodash.com/) everything else is just cargo. Some cargo is more valuable than other, so for CLI applications I can recommend:

* [Commander](https://github.com/tj/commander.js) which should cover all your command-line needs.
* [Chalk](https://github.com/sindresorhus/chalk) for styling your terminal output.

## Finishing

Finally you can install and test your library by running `npm i -g .` in the module's folder. If you want to publish your work, assuming you have a npm user (`npm adduser`) you can do it with:

    npm version [major|minor|patch]
    npm prune
    npm shrinkwrap
    npm publish

The first will update the version inside the `package.json` and furthermore create a new commit with a version tag. The pruning removes unused dependencies and shrinkwrap ensures that the versions of the dependencies are frozen. The latter will ensure that no incompatibilities are introduced if a dependency is updated.
