import React from "react"
import { Link, navigate } from "gatsby"
import { Dropdown, Menu } from "semantic-ui-react"
import useAuth from "../../hooks/useAuth"
import SearchBar from "../SearchBar"
const Nav = () => {
  const { state, logout, isAuthenticated } = useAuth()

  const handleLogout = e => {
    e.preventDefault()
    logout()
    navigate("/app")
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      <Menu
        compact
        color="teal"
        size="massive"
        style={{ border: "1px solid  rgba(34,36,38,.15)", borderRadius: 8 }}
      >
        <Menu.Item >
          <Link to="/app/dashboard">Dashboard</Link>
        </Menu.Item>
        <Dropdown item text="Account">
          <Dropdown.Menu>
          <Dropdown.Item>
            <Menu.Item
              link
              onClick={() => {
                navigate(`/app/authors/User_${state.user.id}`)
              }}
            ><Link>Posts</Link>
            </Menu.Item>
          </Dropdown.Item>
          <Dropdown.Item>
            <Menu.Item>
              <Link to="/app/forms">Forms</Link>
            </Menu.Item>
          </Dropdown.Item>
          </Dropdown.Menu>
          
        </Dropdown>

        <Menu.Item link>
          <Link to="/app/panel">Add post</Link>
        </Menu.Item>
        <Menu.Item>
          <a href="http://localhost:3001/admin">Admin Panel</a>

        </Menu.Item>
        <Menu.Item>
          <div className="w-1/2 text-right">
            {isAuthenticated ? (
              <a onClick={handleLogout} className="text-white" href="/">
                Logout
              </a>
            ) : (
              <Link to="/login" className="text-white">
                Login
              </Link>
            )}
          </div>
        </Menu.Item>

        <Menu.Item>
          <SearchBar></SearchBar>
        </Menu.Item>
      </Menu>
    </div>
  )
}
export default Nav
