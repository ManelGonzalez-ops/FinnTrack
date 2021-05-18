import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDataLayer } from '../Context'

export const useCompanyGuard = () => {
    const { dispatch } = useDataLayer()
    const params = useParams()

    useEffect(() => {
        const {company} = params
        dispatch({ type: "SET_COMPANY", payload: { ticker: company } })
    }, [])

}
