import React, { ReactNode, useState } from 'react'
import { PortfolioPriceChart } from '../portfolio/PortfolioPriceChart'
import { PeopleItem, User } from './interfaces'
import styled from "styled-components"
import { makeStyles, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { PortfolioChartPeople } from './PortfolioChartPeople'
import { Skeleton } from '@material-ui/lab'

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
    const [currentPerformance, setCurrentPerformance] = useState<number | null>(null)
    const classes = useStyles()
    return (
        <Paper
            // classes={{ root: classes.root }}
            className="people-item"
        >

            {
                user.username &&
                <UserInfo>
                    <div
                        className="people-item--header"
                    >
                        <Link to={`/people/${user.userId}`}>
                            <ImagePeople user={user} />
                        </Link>
                        <h3>
                            {user.firstName && user.firstName}
                            {user.lastName && user.lastName}
                        </h3>
                        <h6>{user.username}</h6>
                    </div>
                </UserInfo>}
            <Portfolio>

                <PortfolioChartPeople datos={portfolio} title={`${user.firstName} Portfolio`}
                    {...{ setCurrentPerformance }}
                />
            </Portfolio>

            <PerformanceStatus {...{ currentPerformance }} />
        </Paper>
    )
}

interface ICProps {
    children: ReactNode
}
const UserInfo: React.FC<ICProps> = ({ children }) => <>{children}</>

const Portfolio: React.FC<ICProps> = ({ children }) =>
    <div
        className="people-item--chart-wrapper"
    >{children}</div>



const ImagePeople: React.FC<{ user: User }> = ({ user }) => {
    const [imgLoaded, setImgLoaded] = useState(false)

    return (
        <div className="image-container">
            {
                user.image ?
                    <img src={`http://localhost:8001/${user.image}`}
                        className={imgLoaded ? "people-image loaded" : "people-image"}
                        onLoad={() => { setImgLoaded(true) }}
                    />
                    :
                    <img src="https://hope.be/wp-content/uploads/2015/05/no-user-image.gif"
                        className={imgLoaded ? "people-image loaded" : "people-image"}
                        onLoad={() => { setImgLoaded(true) }}
                    />
            }

            {!imgLoaded && <Skeleton style={{ width: "100%", height: "100%" }} />}

        </div>
    )
}
interface props {
    currentPerformance: number | null
}
const PerformanceStatus: React.FC<props> = ({ currentPerformance }) => {

    if (!currentPerformance) {
        return null
    }
    return <p
        className="people-item-performace"
    >{currentPerformance}%</p>
}