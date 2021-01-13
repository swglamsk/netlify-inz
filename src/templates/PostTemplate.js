import React, { useEffect, useState } from "react"
import { Link, graphql, navigate } from "gatsby"
import Layout from "../components/layout"
import ReactMarkdown from "react-markdown"
import "../styles/global.css"
import {
  Container,
  Label,
  Modal,
  Button,
  Form,
  Icon,
  Header,
  Message,
  Dropdown
} from "semantic-ui-react"
import Nav from "../components/app/Nav"
import axios from "axios"
import useAuth from "../hooks/useAuth"
import MDEditor from "@uiw/react-md-editor"

const URL = process.env.GATSBY_API_URL

const PostTemplate = ({ data }) => {
  const userID = useAuth().state.user.id
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openIssue, setOpenIssue] = useState(false)
  const [comment, setComment] = useState(null)
  const [hiddenIssue, setHiddenIssue] = useState(true)
  const [hiddenDelete, setHiddenDelete] = useState(true)
  const [hiddenEdit, setHiddentEdit] = useState(true)
  const [Title, setTitle] = useState(data.strapiPost.Title)
  const [category, setCategory] = useState(data.strapiPost.category.id)
  const [content, setContent] = useState(data.strapiPost.content)
  const [isUserPost, setIsUserPost] = useState('')
  useEffect(() => {
    if(userID===data.strapiPost.author.id){
      setIsUserPost(true)
    }
    else{
      setIsUserPost(false)
    }
  })
  const messageIssue = () => (
    <Message
      positive
      header="Your complaint has been send"
      content="You will now be redirected to post"
    />
  )
  const messageDelete = () => (
    <Message
      positive
      header="Post has been deleted"
      content="You will now be redirected to dashboard"
    />
  )
  const messageEdit = () => (
    <Message
      positive
      header="Post has beed edited"
      content="You will now be redirected to post"
    />
  )
  const categories = data.allStrapiCategory.edges.map(element => ({
    key: element.node.id,
    text: element.node.Category_name,
    value: element.node.id,
  }))
  const handleSubmit = async () => {
    await axios
      .post(`${URL}/forms`, {
        comment: comment,
        user_submiting: userID.toString(),
        post: data.strapiPost.id.toString().split("_")[1],
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
      await axios.post(`http://localhost:8000/__refresh`)
  }

  const handleDelete = async () => {
    await axios
      .delete(`${URL}/posts/${data.strapiPost.id.toString().split("_")[1]}`)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
      await axios.post(`http://localhost:8000/__refresh`)
  }

  const handleEdit = async () => {
    await axios
      .put(`${URL}/posts/${data.strapiPost.id.toString().split("_")[1]}`, {
        Title: Title,
        category: category.toString(),
        content: content,
      })
      .then(response => {
        if (!!response) {
          console.log(response)
        }
      })
      .catch(error => {
        console.log(error)
      })
    setHiddentEdit(false)
    await axios.post(`http://localhost:8000/__refresh`)
    setTimeout(() => navigate("/app/dashboard"), 2000)
  }
  return (
    <Layout>
      <Nav></Nav>
      <Container text>
        <Header as="h1" dividing>
          {data.strapiPost.Title}{" "}
          <Header.Subheader>
            Created at: {data.strapiPost.created_at.split("T")[0]}
          </Header.Subheader>
          <Header as="h3">
            Category: {data.strapiPost.category.Category_name}
          </Header>
          <Link to={`/app/authors/User_${data.strapiPost.author.id}`}>
            <Label color="teal" style={{ marginLeft: 0 }}>
              {data.strapiPost.author.username}
              <Label.Detail>{data.strapiPost.author.department}</Label.Detail>
            </Label>
          </Link>
        </Header>
        <ReactMarkdown
          source={data.strapiPost.content}
          transformImageUri={uri =>
            uri.startsWith("http") ? uri : `${URL}${uri}`
          }
          className="articleContent"
          escapeHtml={false}
        />
      </Container>
      <Container textAlign="center" style={{ marginTop: 10 }}>
        {isUserPost ? 
        <div><Modal
          onClose={() => setOpenEdit(false)}
          onOpen={() => setOpenEdit(true)}
          open={openEdit}
          trigger={<Button color="blue">Edit</Button>}
        >
          <Modal.Header>Edit your post</Modal.Header>
          <Modal.Content>
            <Modal.Actions>
              <Form onSubmit={() => handleEdit()}>
                <Form.Field required>
                  <label>Title:</label>
                  <Form.Input
                    placeholder="Title"
                    onChange={data => setTitle(data.target.value)}
                    defaultValue={Title}
                    size="large"
                  />
                </Form.Field>
                <Form.Field required>
              <label>Category:</label>
              <Dropdown
                placeholder="Select category"
                fluid

                selection
                options={categories}
                defaultValue={`User_${category}`}
                onChange={(e, { value }) =>
                  setCategory({ value }.value.toString().split("_")[1])
                }
              />
            </Form.Field>
                <Form.Field>
                  <label>Content:</label>
                  <MDEditor value={content} onChange={setContent} />
                </Form.Field>
                {hiddenEdit ? <></> : messageEdit()}
              <Button type="submit">Apply changes</Button>
              </Form>

            </Modal.Actions>
          </Modal.Content>
        </Modal> 
        
        <Modal
          size="mini"
          onClose={() => setOpenDelete(false)}
          onOpen={() => setOpenDelete(true)}
          open={openDelete}
          trigger={<Button negative>Delete</Button>}
        >
          <Modal.Header>
            Are you sure you want to delete this post?
          </Modal.Header>
          <Modal.Content>
            The changes will be irrevesable
            <Modal.Actions>
              {hiddenDelete ? <></> : messageDelete()}
              <Button
                negative
                style={{ marginLeft: 0, marginTop: 10 }}
                onClick={() => {
                  handleDelete()
                  setHiddenDelete(false)
                  setTimeout(navigate("/app/dashboard"), 2000)
                }}
              >
                Delete
              </Button>
            </Modal.Actions>
          </Modal.Content>
        </Modal> </div>
: <></>}
        <Modal
          onClose={() => setOpenIssue(false)}
          onOpen={() => setOpenIssue(true)}
          open={openIssue}
          trigger={<Button>Send issue</Button>}
        >
          <Modal.Header>What's wrong?</Modal.Header>
          <Modal.Content>
            <Modal.Actions>
              <Form>
                <Form.Field required>
                  <label>Your comment to post</label>
                  <input
                    placeholder="Comment..."
                    onChange={data => setComment(data.target.value)}
                  ></input>
                </Form.Field>
              </Form>
              {hiddenIssue ? <></> : messageIssue()}
              <Button
                positive
                style={{ marginLeft: 0, marginTop: 10 }}
                onClick={() => {
                  handleSubmit()
                  setHiddenIssue(false)
                  setTimeout(() => setOpenIssue(false), 2000)
                }}
              >
                Submit issue
                <Icon name="hand point right" />
              </Button>
            </Modal.Actions>
          </Modal.Content>
        </Modal>
      </Container>
    </Layout>
  )
}

export default PostTemplate

export const query = graphql`
  query PostTemplate($id: String!) {
    strapiPost(id: { eq: $id }) {
      content
      id
      Title
      created_at
      category {
        Category_name
        id
      }
      author {
        username
        id
        department
      }
    }
    allStrapiCategory {
      edges {
        node {
          Category_name
          id
        }
      }
    }
  }
`
