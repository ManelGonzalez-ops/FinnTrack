import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useIAuth } from './useIAuth'

export const ProtectedRoute = () => {

    const { hasPermission, loading } = useIAuth()
    //ojo loading tiene que empezar como true
    if (loading) {
        return <p>loading..</p>
    }
    return (
        <>
            { hasPermission ?
                <div>
                    Mira que horto,

                    sip estás autenticado
        </div>
                :
                // <p>no estas auth</p>
                <Redirect to={{ pathname: "/pruebaLogin" }} />
            }
        </>
    )
}
