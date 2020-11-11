import { TableCell } from '@material-ui/core'
import React from 'react'

export const Cell = ({data, ...props}) => {
    return (
        <TableCell  {...props}>
            {data}
        </TableCell>
    )
}
