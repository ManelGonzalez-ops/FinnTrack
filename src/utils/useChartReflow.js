import React, { useEffect } from 'react'
import { useUILayer } from '../ContextUI'
import { useViewport } from './useViewport'

export const useChartReflow = (chartInstance) => {
    const { sidebarOpen } = useUILayer()
    //const {viewport} = useViewport()
    useEffect(() => {

        if (chartInstance && Object.keys(chartInstance).length > 0) {
            console.log(chartInstance, "popo")
            setTimeout(() => {
                console.log("reflowwww")
                chartInstance.reflow()
            }, 200)
        }
    }, [sidebarOpen])
}
