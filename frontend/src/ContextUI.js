import React, { createContext, useContext, useState, } from 'react'
const Context = createContext()

const UiReducer = (state, action) => {
    switch (action) {
        case "CLOSE_SIDEBAR":
            return {
                ...state,
                sidebarOpen: false
            }
        case "OPEN_SIDEBAR":
            return {
                ...state,
                sidebarOpen: false
            }
        default:
            return state
    }
}


export const UIProvider = ({ children }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showOverlay, setShowOverlay] = useState(false)
    const [tickerMove, setTickerMove] = useState(true)
    const [mountApproval, setMountApproval] = useState(true)
    const [drawerWidth, setDrawerWidth] = useState(240)
    const [imageUrl, setImageUrl] = useState("")


    return (
        <Context.Provider value={{
            sidebarOpen,
            setSidebarOpen,
            showOverlay,
            setShowOverlay,
            tickerMove,
            setTickerMove,
            mountApproval,
            setMountApproval,
            drawerWidth,
            setDrawerWidth,
            imageUrl,
            setImageUrl
        }}>
            {children}
        </Context.Provider>
    )
}

export const useUILayer = () => useContext(Context)
// useReducer(UiReducer, {sidebarOpen: false}