import { Paper } from '@material-ui/core'
import React from 'react'
import Carousel from 'react-material-ui-carousel'

export const PeerCarousel = ({ peersData }) => {

    return (
        <Carousel
        animation="slide"
         className="carousel--ticker"
         >
            {peersData.map(item => <Peer info={item}/>)}
        </Carousel>
    )
}


const Peer = ({info}) => {
    const { name, symbol, pe, changesPercentage, price } = info
    return (
        <Paper
        style={{height: "100%"}}
        >
            <h5>{symbol}</h5>
            <p>{name}</p>
            <p>{pe}</p>
        </Paper>
    )
}