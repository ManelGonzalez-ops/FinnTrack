import { debounce } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { useIntersection } from 'react-use'

export const PopulateOnScroll = ({ children }) => {
    const [chunkCount, setChunkCount] = useState(0)
    const [isDataReadyScroll, _setIsDataReadyScroll] = useState(false)
    const [currentChunk, setCurrentChunk] = useState(1)
    const interestionRef = useRef(null)
    const intersection = useIntersection(interestionRef, {
        root: null,
        rootMargin: "0px",
        threshold: 1
    })

    const debounce = useRef(false)
    useEffect(() => {
        if (!isDataReadyScroll) return;
        if (intersection && intersection.intersectionRatio < 1.5 && currentChunk <= chunkCount) {
            console.log("interesected")
            if (!debounce.current) {
                debounce.current = true
                setCurrentChunk(prev => prev + 1)
                console.log("intersection crossed")
                let timeout = setTimeout(() => {
                    debounce.current = false
                    clearTimeout(timeout)
                }, 800)
            }
        }
    }, [intersection])
    return (
        <div>
            {children({ setChunkCount, _setIsDataReadyScroll, currentChunk })}
            {/* <div style={{ height: "20px" }}
                ref={interestionRef}
            >
            </div> */}
            { isDataReadyScroll &&
                <div style={{ height: "20px" }}
                    ref={interestionRef}
                >
                </div>
            }
        </div>
    )
}
