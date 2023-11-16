---
title: 'Yeoman Batch Updates in Modular Projects'
date: 2015-08-05
tags: post
path: /yeoman-batch-updates
---

If you generated modules with Yeoman and you want to apply changes for each module, you can add these changes to the generator instead and run it on the modules again. This is beneficial in a setup with many modules and complex changes with different roll-out priority.

Most people know the scaffolding tool [Yeoman](http://yeoman.io/) for its ability to kickstart projects which can be nice if you don't want to concern yourself too much with the intricacies of your build tool. It gets even more interesting if you generate many modules to ensure consistency.

Few people know it for its approach to generate code for single components, e.g. Angular directives. Even fewer know its useful application in highly modular environments.

## A real-life example

Let's say you have 100 modules, each initialized with your custom generator:

1. You want to add an `.editorconfig` ([EditorConfig](http://editorconfig.org/)) to each module which is achievable with a shell command, no big deal.

2. After some days you decide to roll your own private npm repository because it has many advantages, i.e. reducing build time. Therefore you want to add the `private` and `registry` properties to each node module. Afterwards, for each dependent's `package.json`, you want to replace the repository string with the actual name. Possible with the shell but it definitely requires advanced knowledge.

3. After a few weeks you decide to replace JSHint with [ESLint](http://eslint.org/) everywhere because it provides the ability to write your own rules. Many adaptations necessary here and it would be a real chore using shell syntax which you may not be too familiar with.

## A more convenient way

Since you've created each module with a particular generator you can modify said generator once and run it again on each module to propagate the changes. Furthermore you don't want and need to trigger the change immediately since you'd rather wait for more substantial changes. Taking the previous example:

1. You add the `.editorconfig` to the root of the template. Since it's purely sugar in your opinion, you decide to wait to run and not run `yo`.

2. You add the properties to the `package.json` of your node module generator and the dependency changes to the respective `package.json` of your other module generator. You also decide to wait since you may know that more changes are coming soon and the previous repository notation will still work.

3. You add the new files for ESLint each in it's respective directory in the templates. Then you add the new dependencies to the `package.json` and finally remove all JSHint dependencies and files from the template.

Of course you apply these changes also to the generator module too. Afterwards you can run the generator in each base folder of a module, overwrite the changes, review them and finally commit & push. Three changes, one execution.
