import React, { useEffect, useState } from 'react'
import { Sectors } from '../views/principal/elements/Sectors'

//this is made to search directly to resourse without requesting to server
export const useFetchWithCors = (url, topic) => {
    const [{ data, loading, error }, setRequest] = useState({ data: [], loading: false, error: "" })

    useEffect(() => {
        const fetcharb = async (dir) => {
            const isInStore = isInLocalStorage(topic)
            if (!isInStore) {
                try {
                    setRequest(prev => ({
                        ...prev,
                        loading: true
                    }))
                    const rawdata = await fetch(dir)
                    const data = await rawdata.json()
                    setRequest(prev => ({
                        ...prev,
                        loading: false,
                        data
                    }))
                    localStorage.setItem(topic, JSON.stringify(data))
                }
                catch (err) {
                    setRequest(prev => ({
                        ...prev,
                        loading: false,
                        error: err.message
                    }))
                }
            }
        }
        if (url) {
            fetcharb(url)
        }
    }, [])

    const isInLocalStorage = (item) => {
        //check if we have this data already in localStorage
        if (localStorage.getItem(item)) {
            setRequest(prev => ({
                ...prev,
                loading: false,
                data: JSON.parse(localStorage.getItem(item))
            }))
            //we won't make additional request
            return true
        }
        return false
    }

    return { data, loading, error }
}

//posible topics:{
// sectors
// index-overview
// gainers
//}