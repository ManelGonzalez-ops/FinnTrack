import React, { useEffect, useRef } from 'react'
import { useDataLayer } from './Context'
import { useUserLayer } from './UserContext'

export const useUpdatePosessionsInDB = () => {
    const userRefreshed = useRef(true)
    const { state, dispatch } = useDataLayer()
    const {userState} = useUserLayer()
    useEffect(() => {
        //it's oibvious that is already authenticated,
        if (!userRefreshed.current && state.currentPossesions && userState.info.email){
            fetch("")
        }
    }, [state.currentPossesions])

    useEffect(()=>{
        userRefreshed.current = false
    },[])
    
    return (
        <div>

        </div>
    )
}
