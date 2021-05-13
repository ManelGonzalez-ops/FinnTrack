import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { CustomCircularProgress } from "../../components/components/CustomCircularProgress";
import { useDataLayer } from "../../Context";
import { useFatch } from "../../utils/useFatch";

export const Constituents = ({ category, categorySan }) => {

    const { state, dispatch } = useDataLayer()
    const subCategory = "constituents"
    const url = `https://finnhub.io/api/v1/index/constituents?symbol=${categorySan[1]}&token=btm6dp748v6ud360stcg`
    const options = { explicitUrl: true }
    const debounce = useRef(false)
    const { datos, loading, error } = useFatch(url, subCategory, category, options)
    const readyTickers = useRef({})
    const [constituents, setConstituents] = useState("")
  
    useEffect(() => {
        console.log("executed", category)
        if (state.indexes[category] && state.indexes[category][subCategory]) {
            console.log(state.indexes[category][subCategory], "pota")
            fetch(`http://localhost:8001/api/v1/recurringTasks/indexes/constituents/${category}`, {
                body: JSON.stringify({ ticker: state.indexes[category][subCategory].constituents }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => res.json())
                .then(res => { setConstituents(res.data) })
                .catch(err => { console.log(err.message) })
            // .then(res=>{res.json()})
            // .then(res=>{setConstituents(res )})
        }
    }, [state.indexes, category, debounce])



    return (
        <>
            {loading && <CustomCircularProgress />}
            {error && <p>{error}</p>}
            {/* {datos.constituents && datos.constituents.length > 0 && datos.constituents.map(item => <p>{JSON.stringify(item, null, 2)}</p>)} */}
            { constituents && (<Table>
                <TableHead>
                    <TableRow>
                       <TableCell>ticker</TableCell>
                       <TableCell>open</TableCell>
                       <TableCell>close</TableCell>
                       <TableCell>high</TableCell>
                       <TableCell>low</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {constituents.map(item => <TableRow>
                        <TableCell>{item.ticker}</TableCell>
                        <TableCell>{item.open}</TableCell>
                        <TableCell>{item.close}</TableCell>
                        <TableCell>{item.high}</TableCell>
                        <TableCell>{item.low}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>)
            }
            {/* {constituents && constituents.map(item => <ul>{Object.keys(item).map(fieldname => <li>{item[fieldname]}</li>)}</ul>)} */}
        </>
    )

}
