import React from "react";
import { IndexesChart } from "../../charts/IndexesChart";
import { CustomCircularProgress } from "../../components/components/CustomCircularProgress";
import { useFatch } from "../../utils/useFatch";

export const ChartIndex = ({ category, categorySan }) => {
    const subCategory = "prices"
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${categorySan[0]}?apikey=651d720ba0c42b094186aa9906e307b4`
    const options = { explicitUrl: true }
    const { datos, loading, error } = useFatch(url, subCategory, category, options)
    console.log(loading, "cargando1")
    console.log(datos, "ostia1")
    return (
        <>
            {loading && <CustomCircularProgress />}
            {error && <p>{error}</p>}
            {datos && Object.keys(datos).length > 0 && <IndexesChart datos={datos} />}
        </>
    )

}