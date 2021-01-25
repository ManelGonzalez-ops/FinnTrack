import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom"
import { CustomCircularProgress } from '../../components/components/CustomCircularProgress'
import { useDataLayer } from '../../Context'
import { FinancialOptions } from './FinancialOptions'
import { CashFlow } from './FinancialStatements/CashFlow'
import { IncomeStatement } from './FinancialStatements/IncomeStatement'
import { TableUI2 } from './FinancialStatements/TableUI2'


export const Financials = () => {


    const [field, setField] = useState("BALANCE_SHEET")
    const [{ data, loading, error }, setRequest] = useState({ data: "", loading: false, error: "" })
    const { company } = useParams()
    const campo = useRef("")
    const { state, dispatch } = useDataLayer()

    useEffect(() => {
        console.log(campo.current, company, "elements")
        if (data && !state.financials[campo.current][company]) {
            dispatch({ type: "SET_FINANCIALS", payload: { field: campo.current, ticker: company, value: data } })
        }
    }, [data])

    console.log(data, field, "putaadata")

    return (
        <div>
            {error && <p>{error}</p>}
            <FinancialOptions {...{ field, setField, setRequest, campo, company }} />

            {
                loading ? <CustomCircularProgress /> :
                    error ? <p>{error}</p> :
                        data && <TableDataPrep
                            data={data}
                            field={field}
                        />}

        </div>
    )
}

const TableDataPrep = ({ data, field }) => {

    const [readyData, setReadyData] = useState("");
    let anualdata = useRef({});

    useEffect(() => {
        if (data) {
            console.log(data, "error tabla")
            data.annualReports.forEach((item) => {
                anualdata.current = {
                    ...anualdata.current,
                    [item.fiscalDateEnding]: item,
                };
            });

            console.log(anualdata.current, "first step");
            let structuredData = {};
            //every year has the same fields, so we take first index as a template
            Object.keys(data.annualReports[0]).forEach((field) => {
                console.log(field, "campo");
                structuredData[field] = {};
                Object.keys(anualdata.current).forEach((year) => {
                    structuredData[field][year] = anualdata.current[year][field];
                    console.log(anualdata.current[year]);
                });
            });
            setReadyData(structuredData);
        }
    }, [data]);

    useEffect(() => {
        console.log(readyData, "ready");
    }, [readyData]);

    return (
        data &&
            field === "BALANCE_SHEET" ?
            <TableUI2
                {...{
                    anualdata,
                    readyData
                }}
            />
            :
            field === "INCOME_STATEMENT" ?
                <IncomeStatement
                    {...{
                        anualdata,
                        readyData
                    }}
                />
                :
                field === "CASH_FLOW" ?
                    <CashFlow
                        {...{
                            anualdata,
                            readyData
                        }}
                    />
                    :
                    <p>Somethign went wrong</p>
    )
}

