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
    siteMetadata: {
      title: defaultTitle,
      description,
      siteUrl: defaultUrl,
      twitterUsername,
    },
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={twitterUsername} />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={description} />
      </Helmet>
    </>
  )
}

export default ({ title, path }) => (
  <StaticQuery query={seoQuery} render={seoRender(title, path)} />
)
