import React, { useEffect, useState } from 'react'

export const useViewport = () => {
    const [viewport, setViewport] = useState(window.innerWidth)
    const updateViewport = () => {
        setViewport(window.innerWidth)
    }
    useEffect(() => {

        window.addEventListener("resize", updateViewport)
        return () => {
            window.removeEventListener("resize", updateViewport)
        }
    }, [])
    return { viewport }
}
