import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import ReactMarkdown from "react-markdown"
import "../../styles/global.css"
import { Container, Item} from "semantic-ui-react"
import FilterMenu from "../FilterMenu"

const apiURL = process.env.GATSBY_API_URL
const Dashboard = () => {
  const data = useStaticQuery(graphql`
    {
      allStrapiPost {
        edges {
          node {
            id
            Title
            content
            category {
              Category_name
            }
            author {
              username
              department
              id
            }
          }
        }
      }
    }
  `)
  const [posts, setPosts] = useState(data)
  return (
    <Container style={{ position: "relative" }}>
      <FilterMenu data={data} setPosts={setPosts} />
      <Container text>
        <Item.Group divided relaxed unstackable>
          {posts.allStrapiPost.edges.map(post => (
            <Item key={post.node.id}>
              <Item.Content>
                <Item.Header>
                  <Link to={`/app/${post.node.id}`}>{post.node.Title}</Link>
                </Item.Header>
                <Item.Meta></Item.Meta>

                <Item.Description>
                  <ReactMarkdown
                    source={post.node.content.substring(0, 500).concat("...")}
                    transformImageUri={uri =>
                      uri.startsWith("http") ? uri : `${apiURL}${uri}`
                    }
                    className="indexArticle"
                    escapeHtml={false}
                  />
                </Item.Description>

                <Link to={`/app/${post.node.id}`}>Read more</Link>
              </Item.Content>
            </Item>
          ))}
        </Item.Group>
      </Container>
    </Container>
  )
}
export default Dashboard
