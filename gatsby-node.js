const path = require('path')
const childProcess = require('child_process')

exports.onCreateNode = ({ actions: { createNodeField }, node }) => {
  if (node.internal.type === 'MarkdownRemark') {
    childProcess.exec(
      `git log -1 --pretty=format:%aI -- ${node.fileAbsolutePath}`,
      (_, stdout) => {
        const date = new Date(stdout)
        const [year, month, day] = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split('T')[0]
          .split('-')

        createNodeField({
          node,
          name: 'authorDate',
          value: `${day}/${month}/${year}`,
        })
      }
    )
  }
}

exports.createPages = ({ actions: { createPage }, graphql }) =>
  graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            html
            fields {
              authorDate
            }
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then(({ data: { allMarkdownRemark: { edges } } }) =>
    edges.forEach(({ node: { frontmatter, fields: { authorDate } } }) =>
      createPage({
        path: frontmatter.path,
        component: path.resolve(`src/templates/page.js`),
        context: {
          authorDate,
        },
      })
    )
  )
