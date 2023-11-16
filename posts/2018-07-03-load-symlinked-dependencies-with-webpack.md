---
title: "Load symlinked dependencies with webpack"
date: 2018-07-03
tags: post
permalink: /load-symlinked-dependencies-with-webpack
---

Sometimes you need to use a specific webpack loader for a dependency which is only available locally as a symlink via `npm link`. This might be the case if you require the processing of certain file types or the transpilation of ES2015+ files with `babel-loader` as it was in my case with [Storybook](https://storybook.js.org/). Unfortunately, if you face hidden webpack configurations like in [create-react-app](https://github.com/facebook/create-react-app) or aforementioned Storybook this won't work out of the box and requires to overwrite the defaults.

A rough description of my use case is the locally linking of a CRA SPA as dependency and the import of it's components in a separate Storybook project where they are used and tested. However, the `node_modules` are typically excluded with the common default configuration since it would not only take an enormous amount of time and memory to process each applicable file but would also require very complex and rather individual configuration:

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: "node_modules",
      use: {
        loader: "babel-loader",
        options: {
          presets: ["env"],
        },
      },
    },
  ];
}
```

The steps I had to do to achieve what I wanted:

1. In the SPA directory execute `npm link`.
2. In the Storybook directory execute `npm link single-page-application`.
3. Create a custom webpack configuration to include the symlinked module

There were a few issues with Storybook itself since it did use it's pre-defined `.babelrc` and didn't want to extend the rules. The solution is to

- overwrite the entire rules
- disable the usage of `.babelrc`
- pass the `babel-loader` options programmatically

Do not forget that you additionally have to install the each used loader as dependency.

However webpack couldn't resolve the real path to the symlinked module no matter what. The solution is actually the combination of `fs.realpathSync` with `path.resolve` to get the correct path on the file system. Here's what the final `webpack.config.js` looks like:

```js
const path = require("path");
const fs = require("fs");

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules = [
    {
      test: /\.js$/,
      include: [
        __dirname,
        fs.realpathSync(
          path.resolve(
            path.join(
              __dirname,
              "..",
              "node_modules",
              "single-page-application",
              "src"
            )
          )
        ),
      ],
      loader: "babel-loader",
      options: {
        presets: ["env", "react"],
        babelrc: false,
      },
    },
  ];
  return defaultConfig;
};
```

A working example can be found on [GitHub](https://github.com/akullpp/linked-storybook).
