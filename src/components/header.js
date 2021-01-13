import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import {Icon} from "semantic-ui-react"
const Header = ({ siteTitle }) => {
  return (
    <header
      style={{
        background: `teal`,
        marginBottom: `1rem`,
        height: `60px`,
        fontFamily: 'Helvetica'
      }}
    >
      <div style={{ justifyContent: "center", display: "flex" }}>
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <h1 style={{fontSize:"3rem", fontFamily:"Roboto"}}>
                <Link
                  to="/"
                  style={{
                    color: `white`,
                    textDecoration: `none`,
                  }}
                >
                  <Icon  name="book"></Icon>
                  {siteTitle}
                </Link>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
