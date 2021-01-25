import React, { useReducer, useContext } from 'react'

const context = React.createContext()
const initialState = {
    isAuthenticated: false
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