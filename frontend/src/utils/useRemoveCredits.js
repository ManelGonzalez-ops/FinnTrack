import React, { useEffect, useLayoutEffect } from 'react'
import { useHistory } from 'react-router'

export const useRemoveCredits = (isLoaded) => {

    useEffect(() => {
        if (!isLoaded) {
            return
        }
        const creditsComps = Array.from(document.querySelectorAll(".highcharts-credits"))
        console.log(creditsComps, "creditsss")
        creditsComps.forEach(el=>{el.remove()})
    }, [isLoaded])

}
