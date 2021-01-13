import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import ReactMarkdown from "react-markdown"
import "../styles/global.css"
import { Container, Item, Card } from "semantic-ui-react"
import Nav from "../components/app/Nav"
import Img from "gatsby-image"
const URL = process.env.GATSBY_API_URL
const userTemplate = ({ data }) => (
  <Layout>
    <Nav />
    <Container text style={{ position: "relative" }}>
      <Card style={{ position: "absolute", left: -350 }}>
        <Img fluid={data.strapiUser.avatar.childImageSharp.fluid}></Img>
        <Card.Content>
          <Card.Header>
            {data.strapiUser.Name + " " + data.strapiUser.Surname}
          </Card.Header>
          <Card.Meta>Email: {data.strapiUser.email}</Card.Meta>
          <Card.Meta>Phone: {data.strapiUser.phone_number}</Card.Meta>
          <Card.Meta>{data.strapiUser.department}</Card.Meta>
        </Card.Content>
      </Card>
      <Container>
        <Item.Group divided relaxed unstackable>
          {data.strapiUser.posts.map(post => (
            <Item key={post.id}>
              <Item.Content>
                <Item.Header>
                  <Link to={`/app/${"Post_" + post.id}`}>{post.Title}</Link>
                </Item.Header>
                <Item.Description>
                  <ReactMarkdown
                    source={post.content.substring(0, 500).concat("...")}
                    transformImageUri={uri =>
                      uri.startsWith("http") ? uri : `${URL}${uri}`
                    }
                    className="indexArticle"
                    escapeHtml={false}
                  />
                </Item.Description>
                <Link to={`/app/Post_${post.id}`}>Read more</Link>
              </Item.Content>
            </Item>
          ))}
        </Item.Group>
      </Container>
    </Container>
  </Layout>
)
export default userTemplate

export const query = graphql`
  query AuthorData($id: String!) {
    strapiUser(id: { eq: $id }) {
      username
      email
      posts {
        category
        Title
        content
        created_at(formatString: "")
        id
      }
      phone_number
      department
      Name
      Surname
      avatar {
        childImageSharp {
          fluid(maxHeight: 150, maxWidth: 150) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`
