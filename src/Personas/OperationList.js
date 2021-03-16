import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography } from '@material-ui/core';
import { DataGrid } from "@material-ui/data-grid";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";


export const OperationList = ({ operations }) => {

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div>
            <GridHeader />
            {operations.map((op, index) => {
                return (
                    <Accordion
                        key={index}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >

                            <Gridi {...{ op }} />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                                Aliquam eget maximus est, id dignissim quam.
          </Typography>
                        </AccordionDetails>
                    </Accordion>
                )
            })
            }
        </div>
    )
}



export const Gridi = ({ op }) => {


    const { details: { ticker, amount, unitaryCost } } = op
    const rows = [
        {
            id: 1,
            date: op.date,
            type: op.operationType,
            ticker: ticker,
            amount: amount,
            price: unitaryCost
        },
    ];

    const columns = [
        { field: "id", hide: true },
        { field: "date", headerName: "Column 1", width: 150 },
        { field: "type", headerName: "Column 2", width: 150 },
        { field: "ticker", headerName: "Column 2", width: 150 },
        { field: "amount", headerName: "Column 2", width: 150 },
        { field: "price", headerName: "Column 2", width: 150 },
    ];


    return <DataGrid rows={rows} columns={columns}
        headerHeight={0}
        hideFooter={true}
        autoHeight={true}
    />;
};

const useStyles = makeStyles({
    accordeon: {
        display: "none"
    }
})
const GridHeader = () => {
    const styles = useStyles()
    const rows = [{
        id: 1,
        date: "",
        type: "",
        ticker: "",
        amount: "",
        price: ""
    }];
    const columns = [
        { field: "id", hide: true },
        { field: "date", headerName: "date", width: 150 },
        { field: "type", headerName: "type", width: 150 },
        { field: "ticker", headerName: "ticker", width: 150 },
        { field: "amount", headerName: "amount", width: 150 },
        { field: "price", headerName: "price", width: 150 },
    ]
    return (
        <DataGrid rows={rows} columns={columns}
            hideFooter={true}
            autoHeight={true}
            rowHeight={0}
            classes={{ overlay: styles.accordeon }}
        />
    )
}
