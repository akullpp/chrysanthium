import React from 'react'
import { Helmet } from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

const seoRender =
  (title, url, excerpt) =>
  ({
    site: {
      siteMetadata: { title: defaultTitle, description, siteUrl: defaultUrl, twitterUsername },
    },
  }) => {
    const displayTitle = title ? `${defaultTitle} // ${title}` : defaultTitle
    const displayUrl = url ? `${defaultUrl}${url}` : defaultUrl
    const displayDescription = excerpt || description

    return (
      <>
        <Helmet title={displayTitle}>
          <meta name="description" content={displayDescription} />
          <meta property="og:url" content={displayUrl} />
          <meta property="og:title" content={displayTitle} />
          <meta property="og:description" content={displayDescription} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:creator" content={twitterUsername} />
          <meta name="twitter:title" content={displayTitle} />
          <meta name="twitter:description" content={displayDescription} />
          <meta name="twitter:image" content="https://chrysanthium.com/logo.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#603cba" />
          <meta name="theme-color" content="#ffffff" />
          <html lang="en" />
        </Helmet>
      </>
    )
  }

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

export default ({ title, path, excerpt }) => <StaticQuery query={seoQuery} render={seoRender(title, path, excerpt)} />
