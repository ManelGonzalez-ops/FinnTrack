import React, { useEffect } from 'react'
import Cookie from "js-cookie"
import { useUserLayer } from '../UserContext'

//necesary for social login
//this sets state from the cookie as soon as posible after the success callback

export const useSocialAuth = () => {
    const {userDispatch} = useUserLayer()
    useEffect(()=>{
        const token = Cookie.getJSON("token")
        console.log(token, "errrtoken")
        token && userDispatch({type: "SET_TOKEN", payload: token})
    }, [])
}
