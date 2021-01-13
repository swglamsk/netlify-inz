import React, { useContext, useReducer, createContext } from "react"
import axios from "axios"
const apiURL = process.env.GATSBY_API_URL

const AuthContext = createContext()

// const AuthProvider = ({ children }) => {
//   const user =  localStorage.getItem('user') !== undefined && localStorage.getItem('user')


// const DEFAULT_STATE = {
//   jwt:  user ? JSON.parse(user).jwt : null,
//   user: user ? JSON.parse(user).user : {},
//   loggedIn: user  ? true : false
// }
const AuthProvider = ({ children }) => {
  // const user =  localStorage.getItem('user') !== undefined && localStorage.getItem('user')


const DEFAULT_STATE = {
  jwt:   null,
  user:  {},
  loggedIn: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const { jwt = null, user = {} } = action.payload
      return { ...state, jwt, user, loggedIn: true }
    case "LOGOUT":
      return { ...state, jwt: null, user: {}, loggedIn: false }
    default:
      return DEFAULT_STATE
  }
}


  return (
    <AuthContext.Provider value={useReducer(reducer, DEFAULT_STATE)}>
      {children}
    </AuthContext.Provider>
  )
}

export const wrapRootElement = ({ element }) => {
  return <AuthProvider>{element}</AuthProvider>
}

const useAuth = () => {
  const [state, dispatcher] = useContext(AuthContext)
  const isAuthenticated = state.loggedIn && Object.keys(state.user).length

  const login = async credentials =>
    new Promise(async (resolve, reject) => {
      try {
        const { data: payload } = await axios.post(
          `${apiURL}/auth/local`,
          credentials
        )
        dispatcher({ type: "LOGIN", payload })
        resolve(payload)
       // localStorage.setItem("user", JSON.stringify(payload))
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  const logout = () => {
    dispatcher({ type: "LOGOUT" })
   // localStorage.removeItem("user")
  }

  return { state, isAuthenticated, login, logout }
}
export default useAuth
