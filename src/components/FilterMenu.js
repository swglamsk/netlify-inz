import React, { useState } from "react"
import { Menu } from "semantic-ui-react"
import { useStaticQuery, graphql } from "gatsby"
const FilterMenu = ({ data, setPosts }) => {
  const [active, setActive] = useState("all")
  const categories = useStaticQuery(graphql`
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
  const handleOnClick = (e, { name }) => {
    setActive(name)
    if (active === "all") {
      setPosts(data)
    } else {
      console.log(active)
      setPosts({
        allStrapiPost: {
          edges: data.allStrapiPost.edges.filter(post => {
            return post.node.category.Category_name === active
          }),
        },
      })
    }
  }
  return (
    <Menu text vertical style={{ position: "absolute", left: -100 }}>
      <Menu.Item header>Sort By</Menu.Item>
      <Menu.Item name="all" active={active === "all"} onClick={handleOnClick} />
      {categories.allStrapiCategory.edges.map(category => (
        <Menu.Item
          name={category.node.Category_name}
          active={active === category.node.Category_name}
          onClick={(e, data) => handleOnClick(e, data)}
        />
      ))}
    </Menu>
  )
}
export default FilterMenu
