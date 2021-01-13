import React from "react"
import { Container, Divider, Header, Icon } from "semantic-ui-react"

const Footer = () => {
  return (

      <Container textAlign="center">
        <Divider  section />
        <Header as="h5"> 
          2020 
          <Icon name="copyright outline"></Icon>
          Delivered by: Jakub Modzelewski
        </Header>
      </Container>

  )
}
export default Footer
