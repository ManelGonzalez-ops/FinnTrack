import React, { ReactNode } from 'react'
import { PortfolioPriceChart } from '../portfolio/PortfolioPriceChart'
import { PeopleItem } from './interfaces'
import styled from "styled-components"
import { makeStyles, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { PortfolioChartPeople } from './PortfolioChartPeople'

interface IProps {
    person: PeopleItem
}
const useStyles = makeStyles({
    root: {
        width: "max(30%, 280px)",
        margin: "0 1rem",
        marginBottom: "2rem",
         //margin: "5%"
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
           // classes={{ root: classes.root }}
           className="portfolio-chart--people"
        >
            {
                user.username &&
                <UserInfo>
                    <Link to={`/people/${user.userId}`}>
                        <h6>{user.username}</h6>
                    </Link>
                    <h3>{user.firstName}</h3>

                </UserInfo>}
            <Portfolio>
                <PortfolioChartPeople datos={portfolio} title={`${user.firstName} Portfolio`} />
            </Portfolio>
        </Paper>
    )
}

interface ICProps {
    children: ReactNode
}
const UserInfo: React.FC<ICProps> = ({ children }) => <>{children}</>
const Portfolio: React.FC<ICProps> = ({ children }) => <>{children}</>