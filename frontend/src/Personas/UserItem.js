import React, { ElementRef, LegacyRef, ReactNode, useEffect, useRef, useState } from 'react'
import { PortfolioPriceChart } from '../portfolio/PortfolioPriceChart'
import { PeopleItem, User } from './interfaces'
import styled from "styled-components"
import { makeStyles, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { PortfolioChartPeople } from './PortfolioChartPeople'
import { Skeleton } from '@material-ui/lab'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';


export const UserItem = ({ person }) => {
    const { user, portfolio } = person
    const [currentPerformance, setCurrentPerformance] = useState(null)
    
    return (
        <Paper
            className="people-item"
        >

            {
                user.username &&
                <UserInfo>
                    <div
                        className="people-item__header"
                    >
                        <Link to={`/people/${user.userId}`}>
                            <ImagePeople user={user} />
                        </Link>
                        {/* <h3>
                            {user.firstName && user.firstName}
                            {user.lastName && user.lastName}
                        </h3> */}
                        <h6 className="people-item__username">
                        <Link to={`/people/${user.userId}`}>{user.username}
                        </Link>
                        </h6>
                    </div>
                </UserInfo>}
            <Portfolio>
                {(chartWrapper) =>
                    <PortfolioChartPeople datos={portfolio} title={`${user.firstName} Portfolio`}
                        {...{ setCurrentPerformance, chartWrapper }}
                    />}
            </Portfolio>

            <PerformanceStatus {...{ currentPerformance }} />
        </Paper>
    )
}

const UserInfo = ({ children }) => <>{children}</>


const Portfolio = ({ children }) => {
    const chartWrapper = useRef(null)

    return <div
        ref={chartWrapper}
        className="people-item__chartWrapper"
    >{children(chartWrapper)}</div>
}



const ImagePeople = ({ user }) => {
    const [imgLoaded, setImgLoaded] = useState(false)

    return (
        <div className="people-item__image-container">
            {
                user.image ?
                    <img src={`${process.env.REACT_APP_API}/${user.image}`}
                        className={imgLoaded ?
                            "people-item__image--loaded" : "people-item__image"}
                        onLoad={() => { setImgLoaded(true) }}
                    />
                    :
                    <img src="https://hope.be/wp-content/uploads/2015/05/no-user-image.gif"
                        className={imgLoaded ? "people-item__image--loaded" : "people-item__image"}
                        onLoad={() => { setImgLoaded(true) }}
                    />
            }

            {!imgLoaded && <Skeleton style={{ width: "100%", height: "100%" }} />}

        </div>
    )
}

const PerformanceStatus = ({ currentPerformance }) => {

    if (!currentPerformance) {
        return null
    }
    return <p
        className="people__item__performace"
    ><ArrowUpwardIcon style={{ transform: "scale(0.7)" }} />{currentPerformance}%</p>
}