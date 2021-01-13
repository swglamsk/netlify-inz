import React, { useState } from "react"
import {
  Container,
  Item,
  Menu,
  TextArea,
  Form,
  Grid,
  Button,
  Header,
  Divider,
} from "semantic-ui-react"
import useAuth from "../../hooks/useAuth"
import { graphql, useStaticQuery, Link } from "gatsby"
import axios from "axios"
import ReactMarkdown from "react-markdown"
const apiURL = process.env.GATSBY_API_URL
const AccountForms = () => {
  const user = useAuth().state.user.id
  const [active, setActive] = useState("received")
  const [comment, setComment] = useState("")
  const [receivedForms, setReceivedForms] = useState(false)
  const [submittedForms, setSubmittedForms] = useState(false)
  const [hiddenArchive, setHiddenArchive] = useState(true)
  
  const data = useStaticQuery(graphql`
    {
      allStrapiForm {
        edges {
          node {
            post {
              Title
              content
              id
              author
            }
            user_resolving {
              email
              id
            }
            user_submiting {
              email
              id
            }
            comment
            created_at
            problem
            is_resolved
            id
          }
        }
      }
    }
  `)
  const submittedByUser = data.allStrapiForm.edges.filter(form => {
    return form.node.user_submiting.id === user
  })
  const submittedByUserActive = submittedByUser.filter(form => {
    return form.node.is_resolved === false
  })
  const submittedByUserArchived = submittedByUser.filter(form => {
    return form.node.is_resolved === true
  })
  const receivedByUser = data.allStrapiForm.edges.filter(form => {
    return form.node.post.author !== user
  })
  const receivedByUserActive = receivedByUser.filter(form => {
    return form.node.is_resolved === false
  })
  const receivedByUserArchived = receivedByUser.filter(form => {
    return form.node.is_resolved === true
  })
  const handleResposne = async formID => {
    await axios.put(`${apiURL}/forms/${formID}`, {
      comment: comment,
      is_resolved: true,
      user_resolving: user,
    })
    await axios.post(`http://localhost:8000/__refresh`)
  }
  return (
    <Container textAlign="center">
      <Menu
        pointing
        secondary
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Menu.Item
          active={active === "received"}
          onClick={() => {setActive("received")
          setSubmittedForms(false)
          setReceivedForms(false)
        setHiddenArchive(true)}}
        >
          Forms you received
        </Menu.Item>
        <Menu.Item
          active={active === "submiting"}
          onClick={() => {setActive("submiting")
          setSubmittedForms(false)
          setReceivedForms(false)
        setHiddenArchive(true)}}
        >
          Forms you submitted
        </Menu.Item>
        <Menu.Item active={submittedForms===true} onClick={() => {
          setActive("")
          setSubmittedForms(true)
          setReceivedForms(false)
          setHiddenArchive(false)}}>
        Resolved submitted forms
        </Menu.Item>
        <Menu.Item active={receivedForms===true} onClick={() => {
          setActive("")
          setSubmittedForms(false)
          setReceivedForms(true)
          setHiddenArchive(false)}}>
        Resolved received forms
        </Menu.Item>

      </Menu>

      {hiddenArchive ? active === "received" ? (
        receivedByUserActive.map(form => (
          <div>
             <Grid columns={2} celled="internally" textAlign="left" >
            <Grid.Column width={5} >
              <Form>
                <Container style={{ marginBottom: 5 }}>
                  <Header>Problem:</Header>
                  {form.node.problem}
                </Container>
                <TextArea
                  placeholder="Put your comment in"
                  onChange={data => setComment(data.target.value)}
                />
              </Form>
              <Button onClick={() => handleResposne(form.node.id.toString().split("_")[1])}>
                Submit comment
              </Button>
            </Grid.Column>
            <Grid.Column width={10}>
              <Container>
                <Item.Group>
                  <Item>
                    <Item.Content>
                      <Item.Header>{form.node.post.Title}</Item.Header>
                      <Item.Meta>
                        Submitted by: {form.node.user_submiting.email}
                      </Item.Meta>
                        <ReactMarkdown
                          source={form.node.post.content
                            .substring(0, 500)
                            .concat("...")}
                          transformImageUri={uri =>
                            uri.startsWith("http") ? uri : `${apiURL}${uri}`
                          }
                          className="indexArticle"
                          escapeHtml={false}
                        />

                      <Link to={`/app/Post_${form.node.post.id}`}>
                        Read more
                      </Link>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Container>
            </Grid.Column>
          </Grid>
          <Divider></Divider>
          </div>
         

        ))
      ) : (
        submittedByUserActive.map(form => (
          <div>
            <Grid columns={2} celled="internally" textAlign="left" style={{ display: "flex" }}>
            <Grid.Column width={5}>
                <Container style={{ marginBottom: 5 }}>
                  <Header>Problem was:</Header>
                  {form.node.problem}
                </Container>
                <Header>Waiting to be resolved...</Header>
            </Grid.Column>
            <Grid.Column width={10}>
              <Container>
                <Item.Group>
                  <Item>
                    <Item.Content>
                      <Item.Header>{form.node.post.Title}</Item.Header>
                      <Item.Meta>
                        Submitted by: you
                      </Item.Meta>
                        <ReactMarkdown
                          source={form.node.post.content
                            .substring(0, 500)
                            .concat("...")}
                          transformImageUri={uri =>
                            uri.startsWith("http") ? uri : `${apiURL}${uri}`
                          }
                          className="indexArticle"
                          escapeHtml={false}
                        />

                      <Link to={`/app/Post_${form.node.post.id}`}>
                        Read more
                      </Link>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Container>
            </Grid.Column>
            <Divider></Divider>
          </Grid>
            <Divider>
            </Divider>
          </div>
          
        ))
      ) : submittedForms ? (submittedByUserArchived.map(form => (
        <div>
          <Grid columns={2} textAlign="left" celled="internally" >
          <Grid.Column width={5} >
            <Form>
              <Container style={{ marginBottom: 5 }}>
                <Header>Problem was:</Header>
                {form.node.problem}
              </Container>
            </Form>
            <Form>
              <Container >
                <Header>Comment:
                  <Header.Subheader>
                    Resolved by: {form.node.user_resolving.email}
                  </Header.Subheader>
                </Header>
                {form.node.comment}
              </Container>
            </Form>
          </Grid.Column>
          <Grid.Column width={10}>
            <Container>
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Item.Header>{form.node.post.Title}</Item.Header>
                    <Item.Meta>
                      Submitted by: you
                    </Item.Meta>
                      <ReactMarkdown
                        source={form.node.post.content
                          .substring(0, 500)
                          .concat("...")}
                        transformImageUri={uri =>
                          uri.startsWith("http") ? uri : `${apiURL}${uri}`
                        }
                        className="indexArticle"
                        escapeHtml={false}
                      />

                    <Link to={`/app/Post_${form.node.post.id}`}>
                      Read more
                    </Link>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Container>
          </Grid.Column>
          <Divider></Divider>
        </Grid>
        </div>
        
      ))
    ) : (receivedByUserArchived.map(form => (
      <Grid columns={2} textAlign="left" celled="internally" >
        <Grid.Column width={5} >
          <Form>
            <Container style={{ marginBottom: 5 }}>
              <Header>Problem was:</Header>
              {form.node.problem}
            </Container>
          </Form>
          <Form>
            <Container >
              <Header>Comment:
              </Header>
              {form.node.comment}
            </Container>
          </Form>
        </Grid.Column>
        <Grid.Column width={10}>
          <Container>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Item.Header>{form.node.post.Title}</Item.Header>
                  <Item.Meta>
                    Submitted by: {form.node.user_submiting.email}
                  </Item.Meta>
                  <Item.Description style={{ marginBottom: 5 }}>
                    <ReactMarkdown
                      source={form.node.post.content
                        .substring(0, 500)
                        .concat("...")}
                      transformImageUri={uri =>
                        uri.startsWith("http") ? uri : `${apiURL}${uri}`
                      }
                      className="indexArticle"
                      escapeHtml={false}
                    />
                  </Item.Description>

                  <Link to={`/app/Post_${form.node.post.id}`}>
                    Read more
                  </Link>
                </Item.Content>
              </Item>
            </Item.Group>
          </Container>
        </Grid.Column>
        <Divider></Divider>
      </Grid>
    ))
  )}
      
    </Container>
  )
}
export default AccountForms
