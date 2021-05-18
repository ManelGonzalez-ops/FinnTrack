import React, { useEffect, useState } from 'react'

let firstLoad = true

export const useDebounce = (fieldChanging, debounceTime, cancelTimeout = false) => {
    const [debouncedQuery, setDebouncedQuery] = useState("")

    useEffect(() => {
        if (firstLoad) {
            firstLoad = false
            return
        }

        if (cancelTimeout) {
            //hide resultList inmediately on blur
            setDebouncedQuery(fieldChanging)
            return
        }

        const timeout = setTimeout(() => {
            setDebouncedQuery(fieldChanging)
        }, debounceTime)

        return () => clearTimeout(timeout)
    }, [fieldChanging])

    return debouncedQuery
}
export const useDebounceCancelable = (fieldChanging, debounceTime) => {
    const [debouncedQuery, setDebouncedQuery] = useState("")

    useEffect(() => {
        if (firstLoad) {
            console.log(firstLoad, "firstlooo")
            firstLoad = false
            return
        }

        if (fieldChanging.cancel) {
            //hide resultList inmediately on blur
            setDebouncedQuery("")
            return
        }

        const timeout = setTimeout(() => {
            console.log(fieldChanging.value, "vallllll")
            setDebouncedQuery(fieldChanging.value)
        }, debounceTime)

        return () => clearTimeout(timeout)
    }, [fieldChanging])

    return debouncedQuery
}
