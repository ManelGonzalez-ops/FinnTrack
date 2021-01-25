import React from 'react'
import {
    Collapse,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    withStyles,
} from "@material-ui/core";
import { Collapsible, TableSectionAlone, TableSectionChunk, TableSubSubtitleChunk, TableSubtitleChunk } from '../Rows'

const useStyles = makeStyles((theme) => ({
    root: {
        background: "white",
        borderRadius: "10px",
        margin: "0 auto",
        width: "100%",
        // [theme.breakpoints.up("sm")]: {
        //     width: "700px"
        // },
        [theme.breakpoints.up("md")]: {
            width: "1000px"
        },
        [theme.breakpoints.up("lg")]: {
            width: "1250px"
        }
    }
}))

export const IncomeStatement = ({ anualdata, readyData }) => {
    //lgconst nestedHackWidth = 175
    const nestedHackWidth = 138
    const classes = useStyles()
    console.log(readyData, "liisto")
    return (
        <TableContainer
            classes={{
                root: classes.root,
            }}
        >
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={3} />
                        {anualdata.current &&
                            Object.keys(anualdata.current).map((year) => (
                                <TableCell
                                    align="right"
                                >{year}</TableCell>
                            ))}
                    </TableRow>
                </TableHead>

                {/* {readyData && Object.keys(readyData).map(item=>{
           if(readyData)
       }) } */}
                {/* <TableRow>
                    <TableCell>Total Current Assets</TableCell>
                    {readyData && Object.keys(readyData["totalCurrentAssets"]).map(date => <TableCell>{readyData["totalCurrentAssets"][date]}</TableCell>)}
                </TableRow> */}
                {/* <Collapsible
                    renderTitleSection={
                        (injectedOpen, setInjectedOpen) => <TableSectionChunk
                            open={injectedOpen}
                            setOpen={setInjectedOpen}
                            title="Total Revenue"
                            data={readyData}
                            lookupKey=""
                        />
                    }
                >
                </Collapsible> */}
                <TableSectionAlone title="Total Revenue" lookupKey="totalRevenue" data={readyData} />
                <TableSectionAlone title="Cost Of Revenue" lookupKey="costOfRevenue" data={readyData} />
                <TableSectionAlone title="Gross Profit" lookupKey="grossProfit" data={readyData} />
                <TableSectionAlone title="Total Operating Expense" lookupKey="totalOperatingExpense" data={readyData} />
                <Collapsible
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Operating Expense"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalOperatingExpense"
                        data={readyData}
                    />}
                >
                    <TableSubtitleChunk title="selling / General / Administrative" lookupKey="sellingGeneralAdministrative" data={readyData}
                    hackWidth={nestedHackWidth}/>
                    <TableSubtitleChunk title="research & Development" lookupKey="researchAndDevelopment" data={readyData}
                    hackWidth={nestedHackWidth}/>
                    <TableSubtitleChunk title="interest Expense" lookupKey="interestExpense" data={readyData}
                    hackWidth={nestedHackWidth}/>
                    <TableSubtitleChunk title="Other Operating Expense" lookupKey="otherOperatingExpense" data={readyData}
                    hackWidth={nestedHackWidth}/>
                </Collapsible>
                <TableSectionAlone title="Operating Income" lookupKey="operatingIncome" data={readyData} />
                <TableSectionAlone title="Net Interest Income (Expense)" lookupKey="netInterestIncome" data={readyData} />
                <TableSectionAlone title="Net Income" lookupKey="netIncome" data={readyData} />
                <TableSectionAlone title="Extraordinary items" lookupKey="extraordinaryItems" data={readyData} />
                <TableSectionAlone title="Non Recurring" lookupKey="nonRecurring" data={readyData} />
                <TableSectionAlone title="Ordinary Net Income" lookupKey="netIncomeFromContinuingOperations" data={readyData} />
                <TableSectionAlone title="Income Tax Expenses" lookupKey="incomeTaxExpense" data={readyData} />
                <TableSectionAlone title="Discontinued Operations" lookupKey="discontinuedOperations" data={readyData} />
                <TableSectionAlone title="Tax Provision" lookupKey="taxProvision" data={readyData} />
                {/* <Collapsible fieldName="total assets"
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Assets"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalAssets"
                        data={readyData}
                    />}
                >

                    <TableSubtitleChunk title="Property / Plant / Equipment" lookupKey="propertyPlantEquipment" data={readyData}

                    />
                    <TableSubSubtitleChunk title="Accumulated Depreciation" lookupKey="accumulatedDepreciation" data={readyData} />
                    <TableSubtitleChunk title="Goodwill" lookupKey="goodwill" data={readyData} />
                    <TableSubtitleChunk title="Intangibles" lookupKey="intangibleAssets" data={readyData} />
                    <TableSubtitleChunk title="Long Term Investments" lookupKey="longTermInvestments" data={readyData} />
                    <TableSubtitleChunk title="Other Assets" lookupKey="otherAssets" data={readyData} />
                    <TableSubtitleChunk title="Other Non Current Assets" lookupKey="otherNonCurrrentAssets" data={readyData} />
                </Collapsible>
                <Collapsible fieldName="total assets"
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Current Liabilities"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalCurrentLiabilities"
                        data={readyData}
                    />}
                >
                    <TableSubtitleChunk title="Accounts Payable" lookupKey="accountsPayable" data={readyData} />
                    <TableSubtitleChunk title="Current Long Term Debt" lookupKey="currentLongTermDebt" data={readyData} />
                    <TableSubtitleChunk title="Other Current Liabilities" lookupKey="otherCurrentLiabilities" data={readyData} />
                </Collapsible>
                <Collapsible fieldName="total assets"
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Non Current Liabilities"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalNonCurrentLiabilities"
                        data={readyData}
                    />}
                >
                    <TableSubtitleChunk title="Total Long Term Debt" lookupKey="totalLongTermDebt" data={readyData} />
                    <TableSubSubtitleChunk title="Long Term Debt" lookupKey="longTermDebt" data={readyData} />
                    <TableSubSubtitleChunk title="Other Non Current Liabilities" lookupKey="otherNonCurrentLiabilities" data={readyData} />
                    <TableSubSubtitleChunk title="Long Liabilities" lookupKey="otherLiabilities" data={readyData} />
                </Collapsible>
                <Collapsible fieldName="total assets"
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Equity"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalShareholderEquity"
                        data={readyData}
                    />}
                >
                    <TableSubSubtitleChunk title="Redeemable Preferred Stock, Total" lookupKey="preferredStockRedeemable" data={readyData} />
                    <TableSubSubtitleChunk title="Preferred Stock" lookupKey="preferredStockTotalEquity" data={readyData} />
                    <TableSubSubtitleChunk title="Common Stock, Total" lookupKey="commonStock" data={readyData} />
                    <TableSubSubtitleChunk title="Additional Paid-in Capital" lookupKey="additionalPaidInCapital" data={readyData} />
                    <TableSubSubtitleChunk title="Retained Earnings (Accumulated Deficit)" lookupKey="retainedEarnings" data={readyData} />
                    <TableSubSubtitleChunk title="Retained Earnings (Accumulated Deficit)" lookupKey="treasuryStock" data={readyData} />
                    <TableSubSubtitleChunk title="Other Equity" lookupKey="otherShareholderEquity" data={readyData} />
                </Collapsible>
                <TableSectionAlone
                    title="Total Liabilities & Shareholders' Equity" lookupKey="liabilitiesAndShareholderEquity"
                    data={readyData}
                />
                <TableSectionAlone
                    title="Total Preferred Shares Outstanding" lookupKey="preferredStockTotalEquity"
                    data={readyData}
                />
                <TableSectionAlone
                    title="Total Common Shares Outstanding" lookupKey="commonStockSharesOutstanding"
                    data={readyData}
                /> */}
            </Table>
        </TableContainer>
    )
}


// Total Revenue	64698	59685	58313	91819
// Cost of Revenue, Total	40009	37005	35943	56602
// Gross Profit	24689	22680	22370	35217
// Total Operating Expenses	49923	46594	45460	66250
// Selling/General/Admin. Expenses, Total	4936	4831	4952	5197
// Research & Development	4978	4758	4565	4451
// Depreciation / Amortization	-	-	-	-
// Interest Expense (Income) - Net Operating	-	-	-	-
// Unusual Expense (Income)	-	-	-	-
// Other Operating Expenses, Total	-	-	-	-
// Operating Income	14775	13091	12853	25569
// Interest Income (Expense), Net Non-Operating	134	204	292	260
// Gain (Loss) on Sale of Assets	-	-	-	-
// Other, Net	-8	-158	-10	89
// Net Income Before Taxes	14901	13137	13135	25918
// Provision for Income Taxes	2228	1884	1886	3682
// Net Income After Taxes	12673	11253	11249	22236
// Minority Interest	-	-	-	-
// Equity In Affiliates	-	-	-	-
// U.S GAAP Adjustment	-	-	-	-
// Net Income Before Extraordinary Items	12673	11253	11249	22236
// Total Extraordinary Items	-	-	-	-
// Net Income	12673	11253	11249	22236
// Total Adjustments to Net Income	-	-	-	-
// Income Available to Common Excluding Extraordinary Items	12673	11253	11249	22236
// Dilution Adjustment	-	-	-	-
// Diluted Net Income	12673	11253	11249	22236
// Diluted Weighted Average Shares	17256.52	17419.15	17618.76	17818.42
// Diluted EPS Excluding Extraordinary Items	0.73	0.65	0.64	1.25
// DPS - Common Stock Primary Issue	0.2	0.2	0.19	0.19
// Diluted Normalized EPS