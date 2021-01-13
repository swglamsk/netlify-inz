import React, { useReducer, useCallback, useRef, useEffect } from "react"
import { Search, Label, Header } from "semantic-ui-react"
import _ from "lodash"
import { useStaticQuery, graphql, navigate } from "gatsby"

const initialState = {
  loading: false,
  results: [],
  value: "",
}
const reducer = (state, action) => {
  switch (action.type) {
    case "CLEAN_QUERY":
      return initialState
    case "START_SEARCH":
      return { ...state, loading: true, value: action.query }
    case "FINISH_SEARCH":
      return { ...state, loading: false, results: action.results }
    case "UPDATE_SELECTION":
      return { ...state, value: action.selection }
    default:
      throw new Error()
  }
}

const SearchBar = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { loading, results, value } = state
  const timeoutRef = useRef()
  const source = []
  const resultRenderer = ({ Title, author, category }) => (
    <div>
      <Header as="h3">
        {Title}
        <Header.Subheader as="h5">{category}</Header.Subheader>
      </Header>
      <Label content={author} color="teal" />
    </div>
  )
  const query = useStaticQuery(graphql`
    {
      allStrapiPost {
        edges {
          node {
            Title
            id
            category {
              Category_name
            }
            author {
              username
            }
          }
        }
      }
    }
  `)
  const makeData = () => {
    query.allStrapiPost.edges.map(node => {
      source.push({
        Title: node.node.Title,
        author: node.node.author.username,
        category: node.node.category.Category_name,
        id: node.node.id,
      })
    })
  }
  makeData()
  const handleSearchChange = useCallback(
    (e, data) => {
      clearTimeout(timeoutRef.current)
      dispatch({ type: "START_SEARCH", query: data.value })

      timeoutRef.current = setTimeout(() => {
        if (data.value.length === 0) {
          dispatch({ type: "CLEAN_QUERY" })
          return
        }

        const re = new RegExp(_.escapeRegExp(data.value), "i")
        const isMatch = result =>
          re.test(result.Title) ||
          re.test(result.category) ||
          re.test(result.author)

        dispatch({
          type: "FINISH_SEARCH",
          results: _.filter(source, isMatch),
        })
      }, 300)
      console.log(data)
    },
    [source]
  )

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div>
      <Search
        loading={loading}
        onSearchChange={handleSearchChange}
        resultRenderer={resultRenderer}
        onResultSelect={(e, data) => {
          navigate(`/app/${data.result.id}`)
          dispatch({ type: "UPDATE_SELECTION", selection: data.result.Title })
        }}
        results={results}
        value={value}
        placeholder="Search by title, username or category"
      ></Search>
    </div>
  )
}
export default SearchBar
