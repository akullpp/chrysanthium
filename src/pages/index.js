import React from 'react'
import { Link, graphql } from 'gatsby'
import styled from '@emotion/styled'

import Layout from '../layout'

const Post = styled.div`
  position: relative;
  margin-bottom: 0.25em;

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

const PostText = styled.div`
  margin-left: 1em;
`

const PostDate = styled.span`
  width: 100%;
  margin-right: 1em;
  font-family: 'Consolas', monospace;
  font-weight: normal;
  color: #333;
`

const PostTitle = styled.span`
  color: black;
  font-weight: 300;
`

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
            date(formatString: "MM/YYYY")
            category
            path
          }
        }
      }
    }
  }
`

const Blog = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => (
  <Layout title="Blog">
    {edges.map(
      ({
        node: {
          frontmatter: { title, date, path },
        },
      }) => (
        <Post key={path}>
          <Link to={path}>
            <PostText>
              <PostDate className="post-date">{date}</PostDate>
              <PostTitle className="post-title">{title}</PostTitle>
            </PostText>
          </Link>
        </Post>
      ),
    )}
  </Layout>
)

export default Blog
