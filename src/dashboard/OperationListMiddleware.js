import React from 'react'
import { useUserLayer } from '../UserContext'

export const AuthMiddleware = ({ children }) => {

    const { userState } = useUserLayer()

    if (!userState.isAuthenticated) {
        return <Redirect
            to={{
                pathname: "/login",
                search="?redirect=operations"
            }}
        />
    }
    return (
        <>
            {children}
        </>
    )
}
