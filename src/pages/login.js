import React from "react"
import Layout from "../components/layout"
import Login from "../components/Login"
import { Container } from "semantic-ui-react"

const LoginPage = ({ location }) => {
  const {routeState } = location
  const redirect = !routeState
    ? `/app/dashboard`
    : routeState.redirect === "app"
    ? `/app`
    : `/app/${routeState.redirect}`

  return (
    <Layout>
      <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
        <Container textAlign="center">
        <Login redirect={redirect} />
        </Container>

      </div>
    </Layout>
  )
}
export default LoginPage
