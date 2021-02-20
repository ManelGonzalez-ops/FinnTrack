import React, { useEffect, useRef, useState } from 'react'
import { useIntersection } from 'react-use'

export const PopulateOnScroll = ({ children }) => {
    const [reponseType, setResponseType] = useState("")
    const [isDataReady, setIsDataReady] = useState(false)
    const interestionRef = useRef(null)
    const intersection = useIntersection(interestionRef, {
        root: null,
        rootMargin: "0px",
        threshold: 1
    })

    useEffect(()=>{
       if(intersection && intersection.intersectionRatio < 1.5){
           console.log("intersection crossed")
       }
    }, [intersection])
    return (
        <div>
            {children}
            <div style={{ height: "20px" }}
                    ref={interestionRef}
                >
                </div>
            {/* { isDataReady &&
                reponseType === "interests" &&
                <div style={{ height: "20px" }}
                    ref={interestionRef}
                >
                </div>
            } */}
        </div>
    )
}
