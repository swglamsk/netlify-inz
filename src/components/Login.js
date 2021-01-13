import React, { useState } from "react"
import useAuth from "../hooks/useAuth"
import { navigate } from "gatsby"
import {Grid, Header, Form, Segment, Button} from "semantic-ui-react"
const Login = ({ redirect }) => {
  const { state, login } = useAuth()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async event => {
    try {
      await login({ identifier, password })
      navigate(redirect)
    } catch (e) {
      console.log("error occured")
      const {
        response: {
          data: {
            message: [
              {
                messages: [error],
              },
            ],
          },
        },
      } = e
      const { message: msg } = error
      setError(msg)
    }
  }

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Log-in to your account
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              onChange={data => {setIdentifier(data.target.value)}}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={data => {setPassword(data.target.value)}}
            />

            <Button color="teal" fluid size="large" onClick={() => handleSubmit()}>
              Login
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  )
}
export default Login
