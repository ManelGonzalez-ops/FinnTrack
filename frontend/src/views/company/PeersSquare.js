import { arrayMin } from 'highcharts'
import React, { useEffect, useState } from 'react'
import { CustomCircularProgress } from '../../components/components/CustomCircularProgress'
import { useDataLayer } from '../../Context'
import { PeerCarousel } from './PeerCarousel'

export const PeersSquare = ({ ticker }) => {

    //const {datos, loading, error} = useFetch()
    const [{ peerTickers, fetching, error }, setPeerTickers] = useState({ peerTickers: "", fetching: false, error: "" })
    const [{ peersData, pfetching, perror }, setPeersData] = useState({ peersData: "", pfetching: false, perror: "" })

    const { state, dispatch } = useDataLayer()


    useEffect(() => {
        const fetchPeers = async () => {
            try {
                setPeerTickers(prev => ({ ...prev, fetching: true }))
                const rawData = await fetch(`https://finnhub.io/api/v1/stock/peers?symbol=${ticker}&token=btm6dp748v6ud360stcg`)
                const data = await rawData.json()
                if (data) {
                    setPeerTickers(prev => ({ ...prev, fetching: false, peerTickers: data }))
                }
                else {
                    throw new Error("no peers found")
                }
            }
            catch (err) {
                setPeerTickers(prev => ({ ...prev, fetching: false, error: err.message }))
                console.log(err.message)
            }
        }
        console.log(state.peers[ticker], "que cojoness")
        if (!state.peers[ticker]) {
            fetchPeers()
        } else {
            setPeersData(state.peers[ticker])
        }

    }, [])

    useEffect(() => {
        //this will only run if is the first time, to fetch all ticker info
        if (peerTickers && !state.peers[ticker]) {
            const promiseArr = peerTickers.slice(1, 4).map(async ticker => {
                try {
                    const rawData = await fetch(`https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=651d720ba0c42b094186aa9906e307b4`)
                    return await rawData.json()
                }
                catch (err) {
                    return ["error", err.message]
                }
            })
            const fetchAllPeers = async () => {
                setPeersData(prev=>({...prev, pfetching: true}))
                const dota = await Promise.all(promiseArr)
                console.log(dota, "zorra")
                const cleanData = dota.filter(item => item.length !== 0)
                let peersCombined = []
                cleanData.forEach(item => {
                    if (Array.isArray(item)) {
                        const peer = item[0]
                        peersCombined = [...peersCombined, peer]
                    }
                })
                setPeersData(prev=>({...prev, loading: false, peersData: peersCombined}))
                dispatch({ type: "STORE_DATA", payload: { ticker, field: "peers", value: peersCombined } })
            }
            fetchAllPeers()
        }
        //else we don't need to do anything else, we alry have all info
    }, [peerTickers])

    return (
        <>
            {/* {fetching && <CustomCircularProgress />}
            {peerTickers && JSON.stringify(peerTickers, null, 2)} */}
           {
            peersData &&
           <PeerCarousel peersData={peersData} />}
        </>
    )
}
