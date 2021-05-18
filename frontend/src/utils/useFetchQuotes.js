import React, { useEffect, useState } from 'react'
//primero hacer versión normal en Middleware2
export const useFetchQuotes = ({ quotes }) => {
    const [tickers, setTickers] = useState("")
    useEffect(() => {
        const fetchQuote = () => {
            return fetch("jdhfjhdk/quotes")
                .then(res => res.json())
                .catch(err => err)
        }
        const promiseArr = quotes.map(ticker => fetchQuote)
        const fetchAllAtOnce = async () => {
            const quotesArr = await Promise.all(promiseArr)
            //transformQuotes

        }
    }, [])
    return (
        <div>

        </div>
    )
}
