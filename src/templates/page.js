import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../layout'

export const pageQuery = graphql`
  query PageQuery($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt
      frontmatter {
        title
        path
        date(formatString: "MM/YYYY")
      }
    }
  }
`

const Page = ({
  data: {
    markdownRemark: {
      html,
      excerpt,
      frontmatter: { title, path, date },
    },
  },
}) => (
  <Layout {...{ title, path, excerpt }}>
    <div>
      <h1>{title}</h1>
      <h6>Last update on {date}</h6>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  </Layout>
)

export default Page
