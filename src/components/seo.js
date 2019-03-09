import React from 'react'
import { Helmet } from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

const seoQuery = graphql`
  query SeoQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
        twitterUsername
      }
    }
  }
`

const seoRender = (title, url) => ({
  site: {
    siteMetadata: { title: defaultTitle, description, siteUrl: defaultUrl },
  },
}) => {
  const displayTitle = title ? `${defaultTitle} // ${title}` : defaultTitle
  const displayUrl = url ? `${defaultUrl}${url}` : defaultUrl

  return (
    <>
      <Helmet title={displayTitle}>
        <meta name="description" content={description} />
        <meta property="og:url" content={displayUrl} />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={description} />
      </Helmet>
    </>
  )
}

export default ({ title, path }) => (
  <StaticQuery query={seoQuery} render={seoRender(title, path)} />
)
