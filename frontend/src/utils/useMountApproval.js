import React, { useEffect } from 'react'
import { useUILayer } from '../ContextUI'

export const useMountApproval = () => {
    const { setMountApproval } = useUILayer()
    useEffect(() => {
        setMountApproval(false)

    }, [])

}
