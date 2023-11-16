---
title: 'Five Minute JAM'
date: 2019-02-28
path: /five-minute-jam
templateEngineOverride: md
---

The [JAM stack](https://jamstack.org) is one of the hottest topics in web development right now and you just cannot get around it because it is so convenient and going to dominate in 2019 when it comes to websites or content management systems. The acronym stands for:

- **J**avascript on the client-side
- **A**PIs that are reusable
- **M**arkup which is prebuilt

> Compared traditional stacks we delegate complex technologies and focus on the content and how it is displayed.

This means we often use a headless CMS as a service like [Contentful](https://www.contentful.com) to focus on the structure of our domain or provide a lightweight interface like [Netlify CMS](https://www.netlifycms.org) and have our content in Git. No matter how you get your content, you will not have DevOps overhead.

Although the definition does not include specific technologies, we will look at an extremely fitting pair - **Netlify** & **Gatsby** - to run a basic website. We will do this from the very scratch without any starters since they often do not provide the quality desired and to prove that you can have a running MVP in less than five minutes.

This will be a very detailed step by step tutorial, so if you are interested in the solution, you can find the final page [hosted on Netlify](https://friendly-williams-3154af.netlify.com) and the [code on GitHub](https://github.com/akullpp/gatsby-demo).

After the positive experience with Gatsby and Netlify, I decided to migrate this website and blog. The code can be found [on GitHub](https://github.com/akullpp/chrysanthium) and shows a complete example of a productive system.

## Netlify

To say that [Netlify](https://www.netlify.com) is a hosting platform is an understatement. Not only did they coin the term **JAM** but their service is probably the best thing that happened for web development since GitHub and far better than GitHub Pages. For me it rivals the awesomeness of [Zeit's Now](https://zeit.co/now) and is one reason I would say that you only need your own backend systems if it is a legal obligation.

Unfortunately, I am not sponsored by Netlify but stunned by their great free tier and features which include...

- Atomic branch deploys with snapshots, rollbacks and notifications
- Automatic domain, subdomains and custom domains
- CDN with cache invalidation
- SSL from Let's Encrypt
- Redirects, rewrites and proxy rules
- Custom header control
- AWS Lambda functions
- Identity management
- Form management
- A/B, multi-variant or split testing

## Gatsby

The second player in our game is [Gatsby](https://www.gatsbyjs.org/), a static site generator - similar to Jekyll but built from scratch with modern technologies - written on top of React which generates HTML by applying content to templates. Its conventions are suitable for small projects, especially blogs. However it becomes really cumbersome if you want to do fancy stuff or work against its conventions, so do not try to be too smart.

If you have a large-scale or highly individuals projects with a few hundred or even thousands of pages, you should look at [Next.js](https://nextjs.org/). It also does server-side rendering and therefore scales better because you do not need to rebuild on every change.

Out of the box it features advanced progressive web technologies like offline access, prefetching an caching which makes faster than traditional generators. The best feature however is the modern development environment since you can transfer your React knowledge and have the same feedback loop.

## Getting started

Let us assume that you created a new project with `npm init`, you will need to install the following dependencies:

```shell
npm i -S gatsby gatsby-source-filesystem gatsby-transformer-remark react react-dom
```

### Configuring Gatsby

Create the Gatsby configuration file `gatsby-config.js` in your root directory with the following content:

```js
module.exports = {
  siteMetadata: {
    title: "Doe's corner",
    author: 'John Doe',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    'gatsby-transformer-remark',
  ],
}
```

The first plugin `gatsby-source-filesystem` gets the markdown files from the `pages` folder and the second plugin `gatsby-transformer-remark` transforms them to HTML.

### Setting up the markdown

```
src/
  pages/
    blog/
      2019-01-01---first-post/
        index.md
      2019-01-02---second-post/
        index.md
      2019-01-01---third-post/
        index.md
```

> First lesson: Keep your content grouped together

Everything what is part of a post goes into the same folder and you want your folder structure to match the site structure as closely as possible. Do not try to be too fancy. You could of course infer some metadata but this will soon become a mess. Do not use the default structure by Gatsby since it only leads to a higher maintenance cost.

Regarding the content of the markdown files I just want to give one small example which you can adapt accordingly:

```markdown
---
title: First Post
date: 2019-01-01

path: /first-post
---

This is the **first** post.
```

> Second lesson: Keep metadata close to the content.

Otherwise you will need to create code that is specific to the framework and you will have a hard time migrating your stuff. Take for example the path metadata, you will always know the original URL under which the post was published and therefore do not have to change internal links.

### Creating a template

We provide `src/templates/post.js` which will be used for each markdown file in the `src/pages/blog` folder:

```jsx
import React from 'react'
import { graphql } from 'gatsby'

export default ({
  data: {
    markdownRemark: {
      html,
      frontmatter: { title, date },
    },
  },
}) => (
  <div>
    <h1>{title}</h1>
    <h2>{date}</h2>
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </div>
)

export const postQuery = graphql`
  query PostQuery($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        date(formatString: "DD.MM.YYYY")
      }
    }
  }
`
```

The only interesting thing that happens here, is that the exported [GraphQL](https://graphql.org/learn/) query automatically populates the component function with the fetched data. Although the destructuring might look scary, the default export is just a plain functional component that wraps the data in blocks and headlines.

The GraphQL schema gets generated by Gatsby automatically and can be queried with [GraphiQL](https://github.com/graphql/graphiql) which is available under `/___graphql`.

### Generating views

The instructions required to create the views from our markdown files are created by implementing Gatsby's `createPages` API inside `gatsby-node.js` at the root:

```jsx
const path = require('path')

exports.createPages = ({ actions: { createPage }, graphql }) =>
  graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            html
            frontmatter {
              category
              path
            }
          }
        }
      }
    }
  `).then(
    ({
      data: {
        allMarkdownRemark: { edges },
      },
    }) =>
      edges.forEach(({ node: { frontmatter } }) =>
        createPage({
          path: frontmatter.path,
          component: path.resolve(`src/templates/${frontmatter.category}.js`),
        }),
      ),
  )
```

The `category` field in our markdown determines which template we are going to use in order to be more flexible. You can also enrich the nodes by implementing `onCreateNode` but this often does lead to very specific code which we do not want because it would violate our second lesson learnt.

### Creating the final pages

In general Gatsby is full of automagical conventions and if you create a `js` file in the `pages` folder, it will be included as a view with a specific route, e.g. a `pages/404.js` will be accessible under `/404`, `/404.html` and used for every unknown route:

```jsx
import React from 'react'

export default () => (
  <div>
    <h1>Page not found</h1>
  </div>
)
```

For our `/blog` route we want to create a simple listing of all posts sorted by date descending. According to the module pattern we create an `index.js` file in `src/pages/blog` where we will only select markdown files in the `post` category:

```jsx
import React from 'react'
import { Link, graphql } from 'gatsby'

export default ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => (
  <div>
    <h1>Post</h1>
    <ul>
      {edges.map(
        ({
          node: {
            frontmatter: { title, date, path },
          },
        }) => (
          <li key={path}>
            <Link to={path}>
              {title} ({date})
            </Link>
          </li>
        ),
      )}
    </ul>
  </div>
)

export const blogQuery = graphql`
  query BlogQuery {
    allMarkdownRemark(
      filter: { frontmatter: { category: { eq: "post" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "DD.MM.YYYY")
            category
            path
          }
        }
      }
    }
  }
`
```

Let us keep the landing page simple and display the site metadata from `gatsby-config.js`. We will provide a link to an about page yet to be created and our blog overview:

```jsx
import React from 'react'
import { Link, graphql } from 'gatsby'

export default ({
  data: {
    site: {
      siteMetadata: { title, author },
    },
  },
}) => (
  <div>
    <h1>
      Hello, welcome to {title} by {author}
    </h1>

    <ul>
      <li>
        <Link to="/blog">Blog</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
    </ul>
  </div>
)

export const rootQuery = graphql`
  query rootQuery {
    site {
      siteMetadata {
        title
        author
      }
    }
  }
`
```

Since the about page is mainly content, we also create a markdown file for it, i.e. `src/about/index.md`:

```markdown
---
title: About
category: page
path: /about
---

I am a software developer.
```

As you can see, it uses a separate template for demonstration purposes which resides in `src/templates/page.js` and is quite similar to the post template:

```jsx
import React from 'react'
import { graphql } from 'gatsby'

export default ({
  data: {
    markdownRemark: {
      html,
      frontmatter: { title },
    },
  },
}) => (
  <div>
    <h1>{title}</h1>
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </div>
)

export const pageQuery = graphql`
  query PageQuery($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
```

If you followed the steps, you will have the following structure:

```
src/
  pages/
    about/
      index.md
    blog/
      2019-01-01---first-post/
        index.md
      2019-01-02---second-post/
        index.md
      2019-01-03---third-post/
        index.md
      index.js
    404.js
    index.js
  templates/
    page.js
    post.js
gatsby-config.js
gatsby-node.js
package.json
```

If you are coming from a CMS with frontend, you are probably missing the UI for your users to create posts. There is Netlify CMS but it is not ready yet for serious usage because it does not integrate well with a sensible Gatsby setup right now. However there are a lot of really good markdown editors which can be integrated quite well.
