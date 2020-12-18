import { List, ListItem, ListItemText } from '@material-ui/core'
import React from 'react'
import { useFetchWithCors } from '../../../utils/useFetchWithCors'



export const Sectors = ({classnames}) => {
    const url = "https://financialmodelingprep.com/api/v3/sectors-performance?apikey=651d720ba0c42b094186aa9906e307b4"
    const { data, loading, error } = useFetchWithCors(url, "sectors")

    return (
        <div className={classnames}>
            <List>
                {loading && <p>loading...</p>}
                {error && <p>{error}</p>}
                {data.length > 0 && data.map(item =>
                    <ListItem>
                        <ListItemText>{item.sector}</ListItemText>
                        <ListItemText style={{ textAlign: "right" }}>{item.changesPercentage}</ListItemText>
                    </ListItem>)}
            </List>
        </div>
    )
}
