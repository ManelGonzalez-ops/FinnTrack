import React, { useEffect, useState } from 'react'
import { useDataLayer } from '../Context'

//esto es para fechar data general, (no por ticker)
//tenemos ue renombrarlo a fetchGeneralData
export const useFetchWithCors = (url, topic, fromOwnServer = false) => {

    const { state, dispatch } = useDataLayer()
    const [{ data, loading, error }, setRequest] = useState({ data: [], loading: false, error: "" })

    useEffect(() => {
        const fetcharb = async (dir) => {
            // const isInStore = isInLocalStorage(topic)
            const isInStore = isInState(topic)
            console.log(isInLocalStorage(topic), topic, "esta o no")
            if (!isInStore) {
                try {
                    setRequest(prev => ({
                        ...prev,
                        loading: true
                    }))
                    console.log(dir, "fetch start")
                    const rawdata = await fetch(dir)
                    const data = await rawdata.json()
                    console.log(data, "fooooooooo")
                    console.log(dir, "fetch finished")
                    setRequest(prev => ({
                        ...prev,
                        loading: false,
                        data: fromOwnServer? data.data : data
                    }))
                    console.log(fromOwnServer, "sevidor propi")
                    dispatch({ type: "STORE_GENERAL_DATA", payload: { field: topic, value: fromOwnServer? data.data : data } })
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

    const isInState =(field)=>{
        //here field will be inside generalData
        if(state.generalData[field]){
            setRequest(prev=>({
                ...prev, 
                loading: false,
                data: state.generalData[field]
            }))
            return true
        }

        return false
    }


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