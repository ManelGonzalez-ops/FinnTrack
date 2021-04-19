import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom"
import { CustomCircularProgress } from '../../components/components/CustomCircularProgress'
import { useDataLayer } from '../../Context'
import { useCompanyGuard } from '../../utils/useCurrentCompany'
import { FinancialOptions } from './FinancialOptions'
import { CashFlow } from './FinancialStatements/CashFlow'
import { IncomeStatement } from './FinancialStatements/IncomeStatement'
import { TableUI2 } from './FinancialStatements/TableUI2'


export const Financials = () => {

    useCompanyGuard()

    const { state, dispatch } = useDataLayer()
    const { currentCompany: { ticker } } = state
    const [field, setField] = useState("BALANCE_SHEET")
    const [{ data, loading, error }, setRequest] = useState({ data: "", loading: false, error: "" })
    //const { company } = useParams()
    const campo = useRef("")

    useEffect(() => {
        //console.log(campo.current, company, "elements")
        if (data && !state.financials[campo.current][ticker]) {
            dispatch({ type: "SET_FINANCIALS", payload: { field: campo.current, ticker, value: data } })
        }
    }, [data])


    return (
        <div>
            {error && <p>{error}</p>}
            {ticker && <FinancialOptions {...{ field, setField, setRequest, campo, ticker }} />}

            {
                loading ? <CustomCircularProgress /> :
                    error ? <p>{error}</p> :
                        data && data.annualReports ? <TableDataPrep
                            data={data}
                            field={field}
                        />
                            :
                            <p>Error With data provider</p>
            }

        </div>
    )
}

const TableDataPrep = ({ data, field }) => {

    const [readyData, setReadyData] = useState("");
    let anualdata = useRef({});

    useEffect(() => {

        data.annualReports.forEach((item) => {
            anualdata.current = {
                ...anualdata.current,
                [item.fiscalDateEnding]: item,
            };
        });

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

    }, [data]);

    useEffect(() => {
        console.log(readyData, "ready");
    }, [readyData]);

    return (

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

