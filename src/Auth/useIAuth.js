import React, { useState, useEffect } from 'react'
import { useUserLayer } from '../UserContext'

export const useIAuth = () => {
    const [hasPermission, setHasPermission] = useState(false)
    const [loading, setLoading] = useState(true)
    const { userState: { token } } = useUserLayer()
    useEffect(() => {
        setLoading(true)
        fetch("http://localhost:8001/api/v1/auth/post", {
            headers: {
                "Authorization": `bearer ${token}`
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
