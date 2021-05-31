import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { GeneralIndexDispatcher } from '../../charts/GeneralIndexDispatcher'
import { rounder, formatter } from "../../utils/numFormatter"
//each index comes with quote, so we have it all
export const IndexesGeneral = () => {
    const category = "indexes"
    const subCategory = "index-list"
    const options = { explicitUrl: true }
    const [chartSelected, setChartSelected] = useState("")
    // const { datos, loading, error } = useFetch("https://financialmodelingprep.com/api/v3/quotes/index?apikey=651d720ba0c42b094186aa9906e307b4", subCategory, category, options)

    const [{ allIndexPrices, loading2, error2 }, setAllIndexPrices] = useState({ allIndexPrices: [], loading: false, error2: "" })
    const getAllIndexPrices = () => {
        setAllIndexPrices(prev => ({ ...prev, loading: true }))
        fetch(`${process.env.REACT_APP_API}/api/v1/recurringTasks/indexes/allprices`)
            .then(res => res.json())
            .then(res=>{
                console.log(res, "laassprecious")
                return res
            })
            .then(res => {
                let datus = []
                res.data.forEach(arr => {
                    arr.forEach(arri => {
                        datus = [...datus, arri]
                    })
                })
                console.log(datus,"datususus")
                setAllIndexPrices(prev => ({ ...prev, loading2: false, allIndexPrices: datus }))
            })
            .catch(err => { setAllIndexPrices(prev => ({ ...prev, loading2: false, error2: err })) })
    }

    useEffect(() => {

        getAllIndexPrices()

    }, [])
    console.log(allIndexPrices, "putaprices")
    const getProvisionalData = () => {
        if (allIndexPrices && allIndexPrices.length) {
            const indexPrincesCopy = [...allIndexPrices]
            console.log(indexPrincesCopy, "papapapa")
            return indexPrincesCopy
                .filter(index => index && index.prices)
                .map(index => {
                    console.log(index)
                    return { name: index.symbol, prices: index.prices[index.prices.length - 1] }
                })
        }
        return null
    }

    const provisionalData = getProvisionalData()
    if (!provisionalData) {
        return <SkeletonTable />
    }
    return (
        <div>
            {/* {loading && <CustomCircularProgress />}
            {error && <p>{error}</p>} */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Name
                        </TableCell>
                        <TableCell>
                            open
                        </TableCell>
                        <TableCell>
                            close
                        </TableCell>
                        <TableCell>
                            high
                        </TableCell>
                        <TableCell>
                            low
                        </TableCell>
                        <TableCell>
                            change
                        </TableCell>
                        <TableCell>
                            chart
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {provisionalData && provisionalData.map(({ prices, name }, index) => (
                        <TableRow>
                            <TableCell>
                                {name}
                            </TableCell>
                            <TableCell>
                                {formatter.format(prices.open)}
                            </TableCell>
                            <TableCell>
                                {formatter.format(prices.close)}
                            </TableCell>
                            <TableCell>
                                {formatter.format(prices.high)}
                            </TableCell>
                            <TableCell>
                                {formatter.format(prices.low)}
                            </TableCell>
                            <TableCell>
                                {rounder((prices.change / prices.close) * 100) + "%"}
                            </TableCell>
                            <TableCell
                                style={{ padding: 0, width: "100px" }}
                            ><GeneralIndexDispatcher
                                    datos={allIndexPrices[index]}
                                    setChartSelected={setChartSelected}
                                    chartSelected={chartSelected}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* {datos.length > 0 && datos.map(item => <p>{JSON.stringify(item, null, 2)}</p>)} */}
        </div>
    )
}

const SkeletonTable = () => {
    return (
        <Table>

            {Array(20).fill(null).map(() => {
                return <TableRow>
                    <TableCell>
                        <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="50%" />
                        <Skeleton variant="text" width="35%" />
                    </TableCell>
                    <TableCell>
                        <Skeleton height={20} />
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="50%" />
                    </TableCell>
                    <TableCell>
                        <Skeleton height={100} />
                    </TableCell>
                </TableRow>
            })}
        </Table>
    )
}
