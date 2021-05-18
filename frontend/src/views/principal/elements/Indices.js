import React from 'react'
import { useFetch } from '../../../utils/useFetch'
import { useFetchWithCors } from '../../../utils/useFetchWithCors'


export const Indices = () => {
    const category = "indexes"
    const subCategory = "index-list"
    const options = { explicitUrl: true }
    const url = "https://financialmodelingprep.com/api/v3/quotes/index?apikey=651d720ba0c42b094186aa9906e307b4"
    const { datos, loading, error } = useFetch(url, subCategory, category, options)

    return (
        <>
            {loading && <p>loading...</p>}
            {error && <p>{error}</p>}
            {datos.length > 0 && datos.map(item =>
                <li>
                    <div>{item.name}</div>
                    <div>{item.changesPercentage} %</div>
                </li>)}
        </>
    )
}
