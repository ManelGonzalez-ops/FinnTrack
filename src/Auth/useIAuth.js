import React, { useState, useEffect } from 'react'
import { useUserLayer } from '../UserContext'

export const useIAuth = () => {
    const [hasPermission, setHasPermission] = useState(false)
    const [loading, setLoading] = useState(true)
    const { userState, userDispatch } = useUserLayer()
    useEffect(() => {
        setLoading(true)
        fetch("http://localhost:8001/api/v1/auth/post", {
            headers: {
                "Authorization": `bearer ${userState.token}`
            },
        }).then(res => {
            console.log(res, "resposns")
            if (!res.ok) throw new Error("token not valid")
            console.log("success nena", res)
            setHasPermission(true)
            setLoading(false)
        })
            .catch(err => {
                setHasPermission(false)
                setLoading(false)
                console.log(err.message)
            })
    }, [])
    return { hasPermission, loading }
}
export const useIAuthh = () => {
    const [loading, setLoading] = useState(true)
    const { userState, userDispatch } = useUserLayer()
    useEffect(() => {
        //if there's no token user will have to login
        console.log(userState.token, "qe sddkfjdk")
        if (!userState.token) {
            console.log("setting user null")
            setLoading(false)
            userDispatch({ type: "SET_USER_NULL" })
            return
        }
        //if there's token we have to check if it's valid
        else if (userState.token) {
            setLoading(true)
            fetch("http://localhost:8001/api/v1/auth/secret", {
                headers: {
                    "Authorization": `bearer ${userState.token}`
                },
            })
                .then(res => {
                    if (!res.ok) throw new Error("token not valid");
                    return res
                })
                .then(res => res.json())
                //if token is valid we extract the userData from the token itself and send it to the client
                .then(res => {
                    console.log(res, "resposns")
                    userDispatch({ type: "SET_USER", payload: { email: res.email } })
                    console.log("success nena", res)
                    setLoading(false)
                })

                .catch(err => {
                    setLoading(false)
                    //necesary to initialize components that needs to know if user information is ready, like FOllowingDispatcher
                    userDispatch({ type: "SET_USER_NULL" })
                    console.log(err.message)
                })
        }
    }, [userState.token])

    return { loading }
}

// export const useAuthLogin = (setHasTried, hasTried) => {
//     const [hasPermission, setHasPermission] = useState(false)
//     const [loading, setLoading] = useState(true)
//     const { userState: { token } } = useUserLayer()
//     useEffect(() => {
//         if (hasTried) {
//             setLoading(true)
//             fetch("http://localhost:8001/api/v1/auth/post", {
//                 headers: {
//                     "Authorization": `bearer ${token}`
//                 },
//             }).then(res => {
//                 console.log(res, "resposns")
//                 if (!res.ok) throw new Error("token not valid")
//                 setHasTried(false)
//                 console.log("success nena", res)
//                 setHasPermission(true)
//                 setLoading(false)
//             })
//                 .catch(err => {
//                     setHasPermission(false)
//                     setLoading(false)
//                     setHasTried(false)
//                     console.log(err.message)
//                 })
//         }
//     }, [hasTried])
//     return { hasPermission, loading }
// }
