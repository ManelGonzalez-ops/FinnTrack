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
import { Collapsible, TableSectionAlone, TableSectionChunk, TableSubSubtitleChunk , TableSubtitleChunk } from "../Rows";

const useStyles = makeStyles((theme) => ({

    root: {
        background: "white",
        borderRadius: "10px",
        margin: "0 auto",
        width: "650px",
        // [theme.breakpoints.up("sm")]: {
        //     width: "700px"
        // },
        [theme.breakpoints.up("md")]: {
            width: "1000px"
        },
        [theme.breakpoints.up("lg")]: {
            width: "1250px"
        }
    },
    // tableConatiner: {

    // },

    // iconButton: {
    //     padding: 0
    // },

    // cell: {
    //     borderBottom: "none"
    // },
    // sectionTitleCell: {
    //     [theme.breakpoints.up("md")]: {
    //         paddingLeft: 0, paddingRight: 0
    //     },
    //     [theme.breakpoints.up("lg")]: {

    //         paddingLeft: 0, paddingRight: "35px"
    //     }
    // },
    // subtitles: {
    //     [theme.breakpoints.up("md")]: {
    //         maxWidth: "130px"
    //     },
    //     [theme.breakpoints.up("lg")]: {
    //         maxWidth: "none",
    //         width: "200px"
    //     },
    //     maxWidth: "none"
    // }
}))

export const TableUI2 = ({ anualdata, readyData }) => {
    
//lg const nestedHackWidth = 165
const nestedHackWidth = 128
    //we need to loop each field, which is an object with the  values of 5 different years
    const classes = useStyles()
    return (
        <TableContainer
            classes={{
                root: classes.root,
            }}
            
        >
            <Table className="statement-table">
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

                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Cash and Short Term Investments" lookupKey="cashAndShortTermInvestments" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={nestedHackWidth} title="Cash" lookupKey="cash" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={nestedHackWidth} title="short Term Investments" lookupKey="shortTermInvestments" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="net Receivables" lookupKey="netReceivables" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Total Inventory" lookupKey="inventory" data={readyData} />
                </Collapsible>

                <Collapsible fieldName="total assets"
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Assets"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalAssets"
                        data={readyData}
                    />}
                >

                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Property / Plant / Equipment" lookupKey="propertyPlantEquipment" data={readyData}

                    />
                    <TableSubSubtitleChunk hackWidth={nestedHackWidth} title="Accumulated Depreciation" lookupKey="accumulatedDepreciation" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Goodwill" lookupKey="goodwill" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Intangibles" lookupKey="intangibleAssets" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Long Term Investments" lookupKey="longTermInvestments" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Other Assets" lookupKey="otherAssets" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Other Non Current Assets" lookupKey="otherNonCurrrentAssets" data={readyData} />
                </Collapsible>
                <Collapsible
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Current Liabilities"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalCurrentLiabilities"
                        data={readyData}
                    />}
                >
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Accounts Payable" lookupKey="accountsPayable" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={nestedHackWidth} title="Current Long Term Debt" lookupKey="currentLongTermDebt" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Other Current Liabilities" lookupKey="otherCurrentLiabilities" data={readyData} />
                </Collapsible>
                <Collapsible
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Non Current Liabilities"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalNonCurrentLiabilities"
                        data={readyData}
                    />}
                >
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Total Long Term Debt" lookupKey="totalLongTermDebt" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={nestedHackWidth} title="Long Term Debt" lookupKey="longTermDebt" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={nestedHackWidth} title="Other Non Current Liabilities" lookupKey="otherNonCurrentLiabilities" data={readyData} />
                    <TableSubSubtitleChunk hackWidth={nestedHackWidth} title="Long Liabilities" lookupKey="otherLiabilities" data={readyData} />
                </Collapsible>
                <Collapsible
                    renderTitleSection={(injectedOpen, setInjectedOpen) => <TableSectionChunk title="Total Equity"
                        open={injectedOpen}
                        setOpen={setInjectedOpen}
                        lookupKey="totalShareholderEquity"
                        data={readyData}
                    />}
                >
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Redeemable Preferred Stock, Total" lookupKey="preferredStockRedeemable" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Preferred Stock" lookupKey="preferredStockTotalEquity" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Common Stock, Total" lookupKey="commonStock" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Additional Paid-in Capital" lookupKey="additionalPaidInCapital" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Retained Earnings (Accumulated Deficit)" lookupKey="retainedEarnings" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Retained Earnings (Accumulated Deficit)" lookupKey="treasuryStock" data={readyData} />
                    <TableSubtitleChunk hackWidth={nestedHackWidth} title="Other Equity" lookupKey="otherShareholderEquity" data={readyData} />
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