import { useEffect, useState } from "react"
import { useViewport } from "./useViewport"

export const useCellWidth = (breakpoints) => {
    const { viewport } = useViewport()
    const { medium, small, large } = breakpoints

    const [{ cellWidth, breakpoint }, setCellWidth] = useState({ cellWidth: 0, breakpoint: "small" })

    const resizeCell = (viewport) => {
        if (viewport < medium.breakpoint) {
            setCellWidth({ cellWidth: small.cellSize, breakpoint: "small" })
            return
        }
        if (viewport < large.breakpoint) {
            setCellWidth({ cellWidth: medium.cellSize, breakpoint: "medium" })
            return
        }
        else {
            setCellWidth({ cellWidth: large.cellSize, breakpoint: "large" })
        }
    }

    useEffect(() => {
        resizeCell(viewport)
    }, [viewport])

    return { cellWidth, breakpoint }
}