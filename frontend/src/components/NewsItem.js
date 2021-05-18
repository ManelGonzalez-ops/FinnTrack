import { Divider } from '@material-ui/core'
import React, { useState } from 'react'


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
                    />
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
    const [loaded, setLoaded] = useState(false)
    return (
        <>
            <Divider />
            <div
                className="news-item-over fade-img-wrapper"
            >
                <div className="image-container">
                    <img
                        src={item.image}
                        alt={item.headline}
                    />
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
            className="news-layout-small fade-img-wrapper"
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