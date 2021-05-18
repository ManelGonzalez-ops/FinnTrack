import React, { useEffect } from 'react'
import { useUserLayer } from '../UserContext'

//we have to handle image separately
export const useHandleProfileImage = () => {

    const { userState, userDispatch } = useUserLayer()
    useEffect(() => {
        if (!userState.isAuthenticated) {
            return
        }
        if (!userState.info.static_image) {
            //we already habe handled the image in the useEffect of above
            return
        }
        console.log(userState, "userState")
        const { email } = userState.info

        fetch("http://localhost:8001/api/v1/users/image", {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email }),
            method: "POST"
        })
            //we need to manually catch the error otherwise empty image will be passed as payload.
            .then(res => {
                if (!res.ok) throw new Error("no image, is not really an error")
                return res
            })
            .then(res => res.blob())
            .then(res => { userDispatch({ type: "UPDATE_IMAGE", payload: res }) })
            .catch(err => { alert(err.message) })


    }, [userState.isAuthenticated, userState.info.static_image])

}
