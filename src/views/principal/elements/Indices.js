import React from 'react'
import { useFetchWithCors } from '../../../utils/useFetchWithCors'


export const Indices = () => {
    const url = "https://financialmodelingprep.com/api/v3/quotes/index?apikey=651d720ba0c42b094186aa9906e307b4"
    const {data, loading, error} = useFetchWithCors(url, "index-overview")
    
    return (
        <>
            {loading && <p>loading...</p>}
            {error && <p>{error}</p>}
            {data && data.map(item =>
                <li>
                    <div>{item.name}</div>
                    <div>{item.changesPercentage} %</div>
                </li>)}
        </>
    )
}
