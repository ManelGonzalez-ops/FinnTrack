import React from 'react'
import { useFetchWithCors } from '../../../utils/useFetchWithCors'

export const Gainers = () => {
    const url = "https://financialmodelingprep.com/api/v3/gainers?apikey=651d720ba0c42b094186aa9906e307b4"
    const {data, loading, error} = useFetchWithCors(url, "gainers")
    console.log(data)
    return (
        <>
        <ul>
        {loading && <p>loading...</p>}
            {error && <p>{error}</p>}
            {data.length >0 && data.map(item=><li>
                <span>{item.companyName}</span>
                <span>{item.price}</span>
                <span>{item.changes}</span>
                <span>{item.changesPercentage}</span>
            </li>)}
        </ul>
        </>
    )
}
