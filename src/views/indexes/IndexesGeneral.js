import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { GeneralIndexDispatcher } from '../../charts/GeneralIndexDispatcher'
import { IndexesChart2 } from '../../charts/indexesChart2'
import { MiniatureChart } from '../../charts/MiniatureChartIndex'
import { CustomCircularProgress } from '../../components/components/CustomCircularProgress'
import { useFetch } from '../../utils/useFetch'
import fakeQuotes from "./fakequotes.json"
//each index comes with quote, so we have it all
export const IndexesGeneral = () => {
    const category = "indexes"
    const subCategory = "index-list"
    const options = { explicitUrl: true }
    const [chartSelected, setChartSelected] = useState("")
    // const { datos, loading, error } = useFetch("https://financialmodelingprep.com/api/v3/quotes/index?apikey=651d720ba0c42b094186aa9906e307b4", subCategory, category, options)
    
    const [{allIndexPrices, loading2, error2}, setAllIndexPrices] = useState({allIndexPrices: [], loading: false, error2: ""})
    const getAllIndexPrices = () => {
        setAllIndexPrices(prev=>({...prev, loading: true}))
        fetch("http://localhost:8001/pricesIndex")
            .then(res => res.json())
            .then(res => { 
                let datus = []
                res.forEach(arr=>{
                    arr.forEach(arri=>{
                        datus = [...datus, arri]
                    })
                })
                setAllIndexPrices(prev=>({...prev, loading2: false, allIndexPrices: datus})) })
            .catch(err=>{setAllIndexPrices(prev=>({...prev, loading2: false, error2: err})) })
    }
 
    useEffect(()=>{
       
            getAllIndexPrices()
        
    },[])
    console.log(allIndexPrices, "putaprices")
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
                            price
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

                    {fakeQuotes.length > 0 && fakeQuotes.map((item, index) => (
                        <TableRow>
                            <TableCell>
                                {item.name}
                            </TableCell>
                            <TableCell>
                                {item.price}
                            </TableCell>
                            <TableCell>
                                {item.open}
                            </TableCell>
                            <TableCell>
                                {item.close}
                            </TableCell>
                            <TableCell>
                                {item.dayHigh}
                            </TableCell>
                            <TableCell>
                                {item.dayLow}
                            </TableCell>
                            <TableCell>
                                {item.change}
                            </TableCell>
                            <TableCell
                            style={{padding: 0, width: "100px"}}
                            >
                                {allIndexPrices.length > 0 && <GeneralIndexDispatcher 
                                datos={allIndexPrices[index]} 
                                setChartSelected={setChartSelected}
                                chartSelected={chartSelected}
                                />}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* {datos.length > 0 && datos.map(item => <p>{JSON.stringify(item, null, 2)}</p>)} */}
        </div>
    )
}

