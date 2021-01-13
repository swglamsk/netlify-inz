import React, { useState, useContext } from "react"
import MDEditor from "@uiw/react-md-editor"
import axios from "axios"
import { useStaticQuery, graphql, navigate } from "gatsby"
import {
  Form,
  Dropdown,
  Button,
  Container,
  Input,
  Message,
} from "semantic-ui-react"

import useAuth from "../hooks/useAuth"
const apiURL = process.env.GATSBY_API_URL
export const CreatePost = () => {
  const [title, setTitle] = useState(null)
  const [content, setContent] = useState(null)
  const [category, setCategory] = useState(null)
  const [active, setActive] = useState(true)
  const [requiredTitleError, setRequiredTitleError] = useState(false)
  const [requiredCategoryError, setRequiredCategoryError] = useState(false)
  const [requiredContentError, setRequiredContentError] = useState(false)
  const user = useAuth().state.user.id
  const data = useStaticQuery(graphql`
    {
      allStrapiCategory {
        edges {
          node {
            Category_name
            id
          }
        }
      }
    }
  `)
  const categories = data.allStrapiCategory.edges.map(element => ({
    key: element.node.id,
    text: element.node.Category_name,
    value: element.node.id,
  }))
  const handleSubmit = async () => {
    console.log(requiredCategoryError)
    console.log(requiredContentError)
    console.log(requiredTitleError)
    if (title === null || undefined) {
      setRequiredTitleError(true)
    }
    if (category === null || undefined) {
      setRequiredCategoryError(true)
    }
    if (content === null || undefined) {
      setRequiredContentError(true)
    }
    if (
      requiredCategoryError ||
      requiredContentError ||
      requiredTitleError
    ) {
      return
    }
    setRequiredTitleError(false)
    setRequiredCategoryError(false)
    setRequiredContentError(false)
    await axios
      .post(`${apiURL}/posts`, {
        Title: title,
        author: user,
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

    setActive(false)
    await axios.post(`http://localhost:8000/__refresh`)
    setTimeout(() => {
      navigate("/app/dashboard")
    }, 2000)
  }
  return (
    <Container
      style={{
        padding: 16,
        border: "1px solid  rgba(34,36,38,.15)",
        borderRadius: 8,
      }}
    >
      <Form>
        <div style={{ marginTop: "10px" }}>
          {requiredTitleError ? (
            <Form.Field required>
              <label>Title:</label>
              <Form.Input
                error="Please enter title first"
                placeholder="Title"
                onChange={data => setTitle(data.target.value)}
                size="large"
              />
            </Form.Field>
          ) : (
            <Form.Field required>
              <label>Title:</label>
              <Form.Input
                placeholder="Title"
                onChange={data => setTitle(data.target.value)}
                size="large"
              />
            </Form.Field>
          )}
          {requiredCategoryError ? (
            <Form.Field required error="Please select a category first">
              <label>Category:</label>
              <Dropdown
                placeholder="Select category"
                fluid
                selection
                options={categories}
                onChange={(e, { value }) =>
                  setCategory({ value }.value.toString().split("_")[1])
                }
              />
            </Form.Field>
          ) : (
            <Form.Field required>
              <label>Category:</label>
              <Dropdown
                placeholder="Select category"
                fluid
                selection
                options={categories}
                onChange={(e, { value }) =>
                  setCategory({ value }.value.toString().split("_")[1])
                }
              />
            </Form.Field>
          )}
          <Form.Field required>
            <label>Your post:</label>
            <MDEditor value={content} onChange={setContent} />
            {requiredContentError ? (
              <Message negative content="Please add post content first" />
            ) : (
              <></>
            )}
            {active ? (
              <></>
            ) : (
              <Message
                positive
                header="Post added"
                content="You will now be redirected to Dashboard"
              />
            )}
          </Form.Field>
          <div style={{ marginTop: "10px" }}>
            <Button positive onClick={() => handleSubmit()}>
              Add post
            </Button>
          </div>
        </div>
      </Form>
    </Container>
  )
}
export default CreatePost
