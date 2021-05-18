import React, {useState, useEffect} from 'react'

export const CurrentPriceRP = ({ticker, children}) => {
    const [{ currentPrice, loading, error }, setCurrentPrice] = useState({
        currentPrice: "",
        loading: false,
        error: ""
    })
    useEffect(() => {

        const getCurrentPrice = async (ticker) => {
            setCurrentPrice(prev => ({ ...prev, loading: true }))
            try {
                const request = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=btm6dp748v6ud360stcg`)
                const data = await request.json()
                setCurrentPrice(prev => ({ ...prev, loading: false, currentPrice: data.c }))
            }
            catch (err) {
                setCurrentPrice(prev => ({ ...prev, loading: false, error: err.message }))
            }
        }
        if (ticker) {

            getCurrentPrice(ticker)
        }
    }, [ticker])
    return (
        <>
            {children({currentPrice, loading, error})}
        </>
    )
}
