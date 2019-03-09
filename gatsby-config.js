module.exports = {
  siteMetadata: {
    title: 'Chrysanthium',
    description: 'A technical blog about software development and technology',
    author: 'Andreas Kull',
    email: 'akullpp@gmail.com',
    twitterUsername: '@akullpp',
    siteUrl: 'https://chrysanthium.com',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    'gatsby-plugin-emotion',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            maxWidth: 480,
          },
          {
            resolve: 'gatsby-remark-prismjs',
          },
        ],
      },
    },
  ],
}
