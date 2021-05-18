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
import React, { useEffect, useRef, useState } from "react";
import { useCellWidth } from "../../../utils/useCellWidth";
import { useViewport } from "../../../utils/useViewport";
import * as styles from "../Rows";
import { Collapsible, TableSectionAlone, TableSectionChunk, TableSubSubtitleChunk, TableSubtitleChunk } from "../Rows";

const useStylos = makeStyles((theme) => ({

    root: {
        background: "white",
        borderRadius: "10px",
        margin: "0 auto",
        width: "400px",
        // [theme.breakpoints.up("sm")]: {
        //     width: "700px"
        // },
        [theme.breakpoints.up("lg")]: {
            width: "1000px"
        },
        [theme.breakpoints.up("xl")]: {
            width: "1250px"
        }
    },
}))

const cellWidthBreakpoints = {
    small: {
        cellSize: 80,
    },
    medium: {
        breakpoint: 1280,
        cellSize: 125,
    },
    large: {
        breakpoint: 1900,
        cellSize: 160
    }
}

export const TableUI2 = ({ anualdata, readyData }) => {


    const { cellWidth, breakpoint } = useCellWidth(cellWidthBreakpoints)


    //const cellWidth = 128
    //we need to loop each field, which is an object with the  values of 5 different years
    const classes = useStylos()
    return (
        <TableContainer

        >
            <Table
                classes={{
                    root: classes.root,
                }}
                className={breakpoint === "small" && "financials-table--small"}
            >
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

                <Collapsible fieldName="assets"
                    renderTitleSection={
                        (injectedOpen, setInjectedOpen) => <TableSectionChunk
                            open={injectedOpen}
                            setOpen={setInjectedOpen}
                            title="Total Current Assets"
                            data={readyData}
                            lookupKey="totalCurrentAssets"
                        />
                    }>

                    <TableSubtitleChunk hackWidth={cellWidth} title="Cash and Short Term Investments" lookupKey="cashAndShortTermInvestments" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={cellWidth} title="Cash" lookupKey="cash" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={cellWidth} title="short Term Investments" lookupKey="shortTermInvestments" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="net Receivables" lookupKey="netReceivables" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Total Inventory" lookupKey="inventory" data={readyData} />
                </Collapsible>

                <Collapsible fieldName="total assets"
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Assets"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalAssets"
                        data={readyData}
                    />}
                >

                    <TableSubtitleChunk hackWidth={cellWidth} title="Property / Plant / Equipment" lookupKey="propertyPlantEquipment" data={readyData}

                    />
                    <TableSubSubtitleChunk hackWidth={cellWidth} title="Accumulated Depreciation" lookupKey="accumulatedDepreciation" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Goodwill" lookupKey="goodwill" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Intangibles" lookupKey="intangibleAssets" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Long Term Investments" lookupKey="longTermInvestments" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Other Assets" lookupKey="otherAssets" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Other Non Current Assets" lookupKey="otherNonCurrrentAssets" data={readyData} />
                </Collapsible>
                <Collapsible
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Current Liabilities"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalCurrentLiabilities"
                        data={readyData}
                    />}
                >
                    <TableSubtitleChunk hackWidth={cellWidth} title="Accounts Payable" lookupKey="accountsPayable" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={cellWidth} title="Current Long Term Debt" lookupKey="currentLongTermDebt" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Other Current Liabilities" lookupKey="otherCurrentLiabilities" data={readyData} />
                </Collapsible>
                <Collapsible
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Non Current Liabilities"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalNonCurrentLiabilities"
                        data={readyData}
                    />}
                >
                    <TableSubtitleChunk hackWidth={cellWidth} title="Total Long Term Debt" lookupKey="totalLongTermDebt" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={cellWidth} title="Long Term Debt" lookupKey="longTermDebt" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={cellWidth} title="Other Non Current Liabilities" lookupKey="otherNonCurrentLiabilities" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={cellWidth} title="Long Liabilities" lookupKey="otherLiabilities" data={readyData} />
                </Collapsible>
                <Collapsible
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Equity"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalShareholderEquity"
                        data={readyData}
                    />}
                >
                    <TableSubtitleChunk hackWidth={cellWidth} title="Redeemable Preferred Stock, Total" lookupKey="preferredStockRedeemable" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Preferred Stock" lookupKey="preferredStockTotalEquity" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Common Stock, Total" lookupKey="commonStock" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Additional Paid-in Capital" lookupKey="additionalPaidInCapital" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Retained Earnings (Accumulated Deficit)" lookupKey="retainedEarnings" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Retained Earnings (Accumulated Deficit)" lookupKey="treasuryStock" data={readyData} />
                    <TableSubtitleChunk hackWidth={cellWidth} title="Other Equity" lookupKey="otherShareholderEquity" data={readyData} />
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
                />
            </Table>
        </TableContainer>
    );
};


//1r big problem:
//long strings without spaces like Property/plant/equipment breaks alignment