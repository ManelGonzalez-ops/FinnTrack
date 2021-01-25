import { TextField } from '@material-ui/core'
import React from 'react'

export const SearcherPositions = ({setQuery, query}) => {
    return (
        <TextField placeholder="..." value={query}
        onChange={(e) => { setQuery(e.target.value) }} />
    )
}
