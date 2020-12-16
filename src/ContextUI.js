import React, { createContext, useContext, useState,  } from 'react'
const Context = createContext()


export const UIProvider =({children})=>{

    const [sidebarOpen, setSidebarOpen] = useState(false)
   
    return (
        <Context.Provider value={{sidebarOpen, setSidebarOpen}}>
            {children}
        </Context.Provider>
    )
}

export const useUILayer =()=> useContext(Context)
