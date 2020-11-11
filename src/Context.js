import React, { createContext, useContext, useReducer } from 'react'
const Context = createContext()

const checkLocalStorage =(field)=>{
    return (
        localStorage.getItem(field) ? 
        JSON.parse(localStorage.getItem(field))
        :
        {}
    )
}




const initialState = {
    keymetrics: checkLocalStorage("keymetrics"),
    prices: checkLocalStorage("prices")

}

const companyReducer = (state, action) => {
    console.log(action.payload, "tiiiiipo")
    console.log("heeey")
    switch (action.type) {
        case "STORE_DATA":
            return {
                ...state,
                [action.payload.field]: {
                    ...state[action.payload.field],
                    [action.payload.ticker]: action.payload.value
                }
            }
        default:
            return state
    }
}
export const ContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(companyReducer, initialState)
    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    )
}

export const useDataLayer = () => useContext(Context)