import React, { useEffect, useState } from 'react'

export const useDebounce = (searchTerm, fieldChanging, debounceTime) => {
    const [debouncedQuery, setDebouncedQuery] = useState({ username: "", email: "" })
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (fieldChanging && searchTerm[fieldChanging] !== "") {
                setDebouncedQuery(searchTerm)
            }
        }, debounceTime)

        return () => clearTimeout(timeout)
    }, [searchTerm])
    return { debouncedQuery }
}
