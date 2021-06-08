import React, { useReducer, useContext } from 'react'
import Cookie from "js-cookie"
const context = React.createContext()
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
  
const getToken = () => {
    let token;
    token = localStorage.getItem("token")
    console.log(token, "localstorage token")
    //we need to see in the cookies for the social auth redirect
    console.log(readCookie("token"), "token3")
    token = token? token : readCookie("token");
    if (!token) return ""
    // return token
    try {
        console.log("dentra", token)
        const readyToken = JSON.parse(token)
        console.log("dentra2", token)
        return readyToken
    }
    catch (err) {
        console.log(err.message, "erur")
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

            //console.log(URL.createObjectURL(action.payload), "qe cojoeee2")
            return {
                ...state,
                info: {
                    ...state.info,
                    imageUrl: action.payload
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
