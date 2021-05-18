import { TableCell } from '@material-ui/core'
import React from 'react'

export const Cell = ({ data, index, ...props }) => {

    if(typeof data === "string"){
        console.log(data.split(/(?=[A-Z])/).join(" "))
    }
    return (
        <TableCell  {...props}>
            {data.replace(/([A-Z])/g, ' $1').trim()}
        </TableCell>
    )
}
