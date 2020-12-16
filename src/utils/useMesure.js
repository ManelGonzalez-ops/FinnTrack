import React, { useEffect, useState } from 'react'
import { useViewport } from './useViewport'

export const useMesure = (ref) => {
    //we also make sure we respnond ref dimension change due to viewport changes
    const {viewport} = useViewport()

    const [{ height, width }, setDimensions] = useState({
        height: 60,
        width: 0
    })
    useEffect(() => {
        if (ref.current) {
            setDimensions({
                height: ref.current.offsetHeight,
                width: ref.current.offsetWidth,
            })
        }
    }, [ref, viewport])

    return (
        { height, width }
    )
}
