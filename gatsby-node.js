/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`)
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  if (page.path.match(/^\/app/)) {
    page.matchPath = "/app/*"
    createPage(page)
  }
}

const makeRequest = (graphql, request) =>
  new Promise((resolve, reject) => {
    // Query for nodes to use in creating pages.
    resolve(
      graphql(request).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        return result
      })
    )
  })

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const getPosts = makeRequest(
    graphql,
    `  {
        allStrapiPost {
          edges {
            node {
              id
            }
          }
        }
      }
    `
  ).then(result => {
    result.data.allStrapiPost.edges.forEach(({ node }) => {
      createPage({
        path: `/app/${node.id}`,
        component: path.resolve(`src/templates/PostTemplate.js`),
        context: {
          id: node.id,
        },
      })
    })
  })
  const getAuthors = makeRequest(
    graphql,
    `
  {
    allStrapiUser {
      edges {
        node {
          id
        }
      }
    }
  }
  `
  ).then(result => {
    // Create pages for each user.
    result.data.allStrapiUser.edges.forEach(({ node }) => {
      createPage({
        path: `/app/authors/${node.id}`,
        component: path.resolve(`src/templates/author.js`),
        context: {
          id: node.id,
        },
      }) 
    })
  })
  return Promise.all([getPosts, getAuthors])
}
