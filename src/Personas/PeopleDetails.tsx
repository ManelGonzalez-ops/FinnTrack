import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userActivity } from '../portfolio/logicPruebasConAdd'
import { PortfolioPriceChart } from '../portfolio/PortfolioPriceChart'
import { StockShop } from '../portfolio/StockShop2'
import { ChartsSection } from './ChartsSection'
import { PeopleData } from './interfaces'
import { PortfolioChartPeople } from './PortfolioChartPeople'
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
        console.log(data, "la datana")
        getPortfolioPrice()
    }, [data])

    const getPortfolioPrice = () => {
        // const dataKeys = Object.keys(data)
        // const lastKey = dataKeys[dataKeys.length - 1]
        if (!data) {
            return
        }
        console.log(data, "portfoliou")
        const portfolio = Object.keys(data.portfolio)
        const lastDate = portfolio[portfolio.length - 1]
        setCurrentPrice(data.portfolio[lastDate].liquidativeValue)
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
                    : <>
                        <StockShop ticker={data?.user.username}
                            {...shopProps}
                            assetType="peopleFund"
                            fundId={id}
                        />
                        {data &&

                            <ChartsSection {...{ data }} />}
                    </>}

        </div>
    )
}
