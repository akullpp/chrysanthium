import React from 'react'
import { Link, graphql } from 'gatsby'
import styled from '@emotion/styled'

import Layout from '../layout'

const Post = styled.div`
  position: relative;
  margin: 2em 0 2em 0;
  text-align: center;

  &:after {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    z-index: -1;
    transition: width 0.3s ease 0s;
    content: '';
    background: #e81c4f;
    transform: skew(-20deg);
  }

  &:hover:after {
    width: 100%;
  }
`

const PostTitle = styled.div`
  color: black;
  font-weight: bold;
`

const PostDate = styled.div`
  display: block;
  width: 100%;
  font-family: 'Consolas', monospace;
  font-size: 0.6em;
  font-weight: normal;
  color: #333;
`

export default ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => (
  <Layout title="Blog">
    {edges.map(({ node: { frontmatter: { title, date, path } } }) => (
      <Post key={path}>
        <Link to={path}>
          <PostTitle>{title}</PostTitle>
          <PostDate>{date}</PostDate>
        </Link>
      </Post>
    ))}
  </Layout>
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
