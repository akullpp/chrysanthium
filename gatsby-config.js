module.exports = {
  siteMetadata: {
    title: 'Chrysanthium',
    description: 'A technical blog about software development and technology',
    author: 'ak',
    email: 'akullpp@gmail.com',
    twitterUsername: '@akullpp',
    siteUrl: 'https://chrysanthium.com',
  },
  plugins: [
    'gatsby-plugin-preact',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-emotion',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-images',
          'gatsby-remark-static-images',
          'gatsby-remark-autolink-headers',
          'gatsby-remark-prismjs',
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    'gatsby-plugin-catch-links',
  ],
  trailingSlash: 'never',
}
