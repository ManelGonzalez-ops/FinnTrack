import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router'

export const DeletionStatus = ({ status = "deleted" }) => {
    const { id } = useParams()

    return (
        <div>
            <h1>UserId: {id}</h1>
            Account status {status}
        </div>
    )
}
