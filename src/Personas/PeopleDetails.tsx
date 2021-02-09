import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userActivity } from '../portfolio/logicPruebasConAdd'
import { StockShop } from '../portfolio/StockShop'
import { PeopleData } from './interfaces'
interface ParamType {
    id: string
}

interface IpeopleDetail {
    data: PeopleData | null,
    loading: boolean,
    error: string
}

export const PeopleDetails = () => {
    const { id } = useParams<ParamType>()
    const [{ data, loading, error }, setState] = useState<IpeopleDetail>({ data: null, loading: false, error: "" })
    const [currentPrice, setCurrentPrice] = useState<number | null>(null)

    useEffect(() => {
        console.log("randarad")
        setState(prev => ({ ...prev, loading: true }))
        fetch(`http://localhost:8001/api/v1/people/${id}`)
            .then(res => res.json())
            .then(res => {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    data: res
                }))
            })
            .catch(err => {
                setState(prev => ({
                    ...prev,
                    error: err.message,
                    loading: false
                }))
            })
    }, [])

    useEffect(() => {
        getPortfolioPrice()
    }, [data])

    const getPortfolioPrice = () => {
        // const dataKeys = Object.keys(data)
        // const lastKey = dataKeys[dataKeys.length - 1]
        if (!data) {
            return
        }
        const portfolio = Object.keys(data.portfolio)
        const lastDate = portfolio[portfolio.length - 1]
        setCurrentPrice(data.portfolio[lastDate].liquidativeValue / 10)
    }
    const shopProps = {
        loading: false,
        error: "",
        currentPrice
    }
    return (
        <div>
            {loading ? <p>Loading...</p>
                : error ? <p>{error}</p>
                    : <StockShop ticker={data?.user.username}
                    {...shopProps}
                />}
            
        </div>
    )
}
