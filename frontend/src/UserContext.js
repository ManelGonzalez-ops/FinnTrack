import React, { useReducer, useContext } from 'react'
import Cookie from "js-cookie"
const context = React.createContext()
const getToken = () => {
    const token = localStorage.getItem("token")
    if (!token || token === "undefined") return ""
    console.log(token, "tokeeun")
    // return token
    try {
        const readyToken = JSON.parse(token)
        return readyToken
    }
    catch (err) {
        return token
    }

}
const initialState = {
    isAuthenticated: false,
    token: getToken(),
    info: { email: null },
    ready: false,
    config: { staticImage: true }
}
const userReducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                isAuthenticated: true,
                info: action.payload,
                ready: true
            }
        case "SET_USER_NULL":
            localStorage.removeItem("token")
            console.log("user set nullllll")
            return {
                ...state,
                isAuthenticated: false,
                info: { email: null },
                ready: true,
                token: null
            }
        case "SET_TOKEN":
            console.log(action.payload, "setting user nulltokkenset")
            return {
                ...state,
                token: action.payload
            }
        case "ADD_USER_INFO":

            return {
                ...state,
                info: {
                    ...state.info,
                    ...action.payload
                }
            }
        case "SET_USER_AND_TOKEN":
            const { email, token } = action.payload
            return {
                ...state,
                isAuthenticated: true,
                info: { email },
                token: token
            }
        case "UPDATE_IMAGE":
            console.log("mmaaariccon")
            console.log(action.payload, "qe cojoeee")
            console.log(URL.createObjectURL(action.payload), "qe cojoeee2")
            return {
                ...state,
                info: {
                    ...state.info,
                    imageUrl: URL.createObjectURL(action.payload)
                }
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
//for class components
export const UserContextt = context
