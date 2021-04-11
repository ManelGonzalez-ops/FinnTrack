import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useUserLayer } from '../UserContext'
import { ContactDetails } from './ContactDetails'
import { ImageUploader } from './ImageUploader'

//the user has to signin to access this route
export const UpdateInfoView = () => {
    
    const userInfo = useFetchUser("populate")
    //const image = useFetchUser("image") 

    return (
        <div>

             <ImageUploader />
           <ContactDetails/> 
           
            {/* <StatusHandler
                loading={userInfo.loading}
                error={userInfo.error}
                data={userInfo.data}
            >
                {(userInfo) => {
                    return <ContactDetails {...{ userInfo }} />
                }}
            </StatusHandler> */}

        </div>
    )
}

const StatusHandler = ({ loading, error, data, children }) => {

    if (loading) {
        return <p>fetching user data...</p>
    }
    if (error) {
        return <p>{error}</p>
    }
    if (data) {
        return <>{children(data)}</>
    }
    else {
        return <h3>WATAFAK</h3>
    }
}

export const useFetchUser = (query) => {
    const { userState } = useUserLayer()
    const [{ data, loading, error }, setRequest] = useState({ data: "", loading: true, error: null })
    useEffect(() => {
        fetch(`http://localhost:8001/api/v1/users/${query}`, {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userState.info.email }),
            method: "POST"
        })
            .then(res => query === "image" ? res.blob() : res.json())
            .then(res => { setRequest(prev => ({ ...prev, loading: false, data: res })) })
            .catch(err => { setRequest(prev => ({ ...prev, loading: false, error: err.message })) })
    }, [])

    return { data, loading, error }
}


export const AuthMiddleware = ({ children }) => {
    const { userState } = useUserLayer()

    if (!userState.isAuthenticated) {
        return <Redirect to={{ pathname: "/pruebaLogin" }} />
    }
    //children wont render useIAuth gives laoding=false 
    return <>{children}</>
}
