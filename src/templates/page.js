import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../layout'

export default ({
  data: {
    markdownRemark: {
      html,
      frontmatter: { title, path },
    },
  },
}) => (
  <Layout {...{ title, path }}>
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  </Layout>
)

export const pageQuery = graphql`
  query PageQuery($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        path
      }
    }
  }
`
