module.exports = {
  siteMetadata: {
    title: "KnowMan",
    description: "Gatsby blog with Strapi",
    author: "Jakub Modzelewski",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
{
resolve: `gatsby-plugin-webfonts`,
options: {
  fonts: {
    google:[
      {
        family: `Roboto`,
        variants: [`400`, `700`],
      }
    ]
  }
}
},
    {
      resolve: "gatsby-source-strapi",
      options: {
        apiURL: "https://aqueous-bastion-65270.herokuapp.com/",
        contentTypes: [
          // List of the Content Types you want to be able to request from Gatsby.
          "post",
          "user",
          "category",
          "form"
        ],
        queryLimit: 1000,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/gatsby-icon.png", // This path is relative to the root of the site.
      },
    },
    "gatsby-plugin-offline",
  ],
}
