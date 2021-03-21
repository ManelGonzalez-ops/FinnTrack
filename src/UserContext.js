import React, { useReducer, useContext } from 'react'

const context = React.createContext()
const getToken = () => {
    const token = localStorage.getItem("token")
    if (token === "undefined") return ""
    return token ?
        JSON.parse(token)
        :
        ""
}
const initialState = {
    isAuthenticated: false,
    token: getToken(),
    info: { email: null },
    ready: false
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
            return {
                ...state,
                isAuthenticated: false,
                info: { email: null },
                ready: true,
                token: null
            }
        case "SET_TOKEN":
            return {
                ...state,
                token: action.payload
            }
        case "ADD_USER_INFO":
            // const { image, ...rest } = action.payload
            // const imageUrl = URL.createObjectURL(image)
            // console.log(image, "imagana")
            console.log("quetemueras")
            console.log(action.payload, "dedeeee")
            return {
                ...state,
                info: {
                    ...state.info,
                    ...action.payload
                }
            }
        case "UPDATE_IMAGE":
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
