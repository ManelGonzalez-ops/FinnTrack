import React, { ReactNode } from 'react'
import { PortfolioPriceChart } from '../portfolio/PortfolioPriceChart'
import { PeopleItem } from './interfaces'
import styled from "styled-components"
import { makeStyles, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'

interface IProps {
    person: PeopleItem
}
const useStyles = makeStyles({
    root: {
        width: "350px"
    }
})
export const UserItem: React.FC<IProps> = ({ person }) => {
    const { user, portfolio } = person

    const StyledDiv = styled.div`
        width: 200px
    `
    const classes = useStyles()
    return (
        <Paper
            classes={{ root: classes.root }}
        >
            <UserInfo>
                <Link to={`/people/${user.userId}`}>
                    <h3>{user.firstName}</h3>
                </Link>
                <h6>{user.lastName}</h6>
            </UserInfo>
            <Portfolio>
                <PortfolioPriceChart datos={portfolio} title={`${user.firstName} Portfolio`} />
            </Portfolio>
        </Paper>
    )
}

interface ICProps {
    children: ReactNode
}
const UserInfo: React.FC<ICProps> = ({ children }) => <>{children}</>
const Portfolio: React.FC<ICProps> = ({ children }) => <>{children}</>