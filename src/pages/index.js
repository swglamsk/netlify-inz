import React from "react"
import { navigate } from "gatsby"
import 'fontsource-roboto';
import "../styles/global.css"
import Layout from "../components/layout"
import "semantic-ui-css/semantic.min.css"
import {Container, Header, Button, Icon} from "semantic-ui-react"
const IndexPage = ({ data }) => (
  <Layout>
  <Container textAlign="center">
    <Header
      as='h1'
      content='Witamy'
      style={{
        fontSize: '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop:'3em',
      }}
    />
    <Header
      as='h2'
      content='Firmowy serwis do zarzadzania wiedza'
      style={{
        fontSize:'1.7em',
        fontWeight: 'normal',
        marginTop:'1.5em',
      }}
    />
    <Button size='huge' color='teal' onClick={() => navigate("/app/dashboard")} >
      Zaczynamy!
      <Icon name='right arrow' />
    </Button>
  </Container>
  </Layout>
)

export default IndexPage
