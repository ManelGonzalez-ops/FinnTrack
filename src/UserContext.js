import React, { useReducer, useContext } from 'react'

const context = React.createContext()
const getToken = () => {
    const token = localStorage.getItem("token")
    return token ?
        JSON.parse(token)
        :
        ""
}
const initialState = {
    isAuthenticated: false,
    token: getToken()
}
const userReducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                isAuthenticated: true,
                info: action.payload
            }
        case "SET_USER_NULL":
            return {
                ...state,
                isAuthenticated: false,
                info: null
            }
        case "SET_TOKEN":
            return {
                ...state,
                token: action.payload
            }
        default:
            return state
    }
}
export const UserContext = ({ children }) => {
    const [userState, userDispatch] = useReducer(userReducer, initialState)
    return (
        <context.Provider value={{ userState, userDispatch }}>
            {children}
        </context.Provider>
    )
}

export const useUserLayer = () => useContext(context)