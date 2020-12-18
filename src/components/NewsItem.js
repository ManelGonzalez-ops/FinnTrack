import { Divider } from '@material-ui/core'
import React, { Fragment } from 'react'

export const NewsItem = ({ item }) => {
    return (
        <>
            <Divider />
            <div
                className="news-item"
            >
                <div className="image-container">
                    <img
                        src={item.image}
                        alt={item.headline}
                    ></img>
                </div>
                <div className="content">
                    <p className="news-subtitle">{item.category}</p>
                    <h4 className="news-title">{item.headline}</h4>
                    <p
                        className="news-summary"
                    >{item.summary}</p>
                </div>

            </div>
        </>
    )
}



export const NewsItemOver = ({ item }) => {
    console.log(item, "xooo")
    return (
        <>
            <Divider />
            <div
                className="news-item-over"
            >
                <div className="image-container">
                    <img
                        src={item.image}
                        alt={item.headline}
                    ></img>
                </div>
                <div className="content">
                    <p className="news-subtitle">{item.category}</p>
                    <h2 className="news-title">{item.headline}</h2>
                    <p
                        className="news-summary"
                    >{item.summary}</p>
                </div>

            </div>
        </>
    )
}

export const GridComposition = ({ chunk }) => {
    //console.log(bigItem, "tiiiiii", smallItems)
    return (

        <div
            className="news-grid-parent"
        >
            <NewsItemOver item={chunk[0]} />
            <NewsItemSmall items={chunk.slice(1, 3)} />
        </div>
    )
}
export const NewsItemSmall = ({ items }) => {
    console.log(items, "toooo")

    return (
        <div
            className="news-layout-small"
        >
            {items.length > 0 && items.map(itam => <NewsItemNoStyled item={itam} />)}
        </div>
    )
}
export const NewsItemNoStyled = ({ item }) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
        <div
            style={{
                backgroundImage: `url(${item.image})`,
                height: "50%",
                backgroundSize: "cover",
                flex: 1
            }
            }
        >
        </div>
        <div >
            <h5
                style={{ marginTop: "0.5rem" }}
            >{item.summary}</h5>
        </div>

    </div >
)