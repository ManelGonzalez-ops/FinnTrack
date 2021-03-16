import { Badge, Chip } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react'
import { time_ago } from "../../utils/datesUtils"
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { GiphyFetch } from '@giphy/js-fetch-api'



const Post = ({ message, selectPost, isSelected = false }) => {
    const [{ conversationData, error, loading }, setConversationData] = useState({ conversationData: null, error: null, loading: true })
    const { user, created_at } = message
    const time = useRef(time_ago(new Date(created_at).getTime()))

    const chart = message.entities.chart ? message.entities.chart : null
    const giphy = message.entities.giphy ? message.entities.giphy : null
    //id ratio
    const [{ gifUrl, gifLoading, gifError }, setGif] = useState({ gifUrl: "", gifLoading: false, gifError: null })

    const getRandomNum = () => {
        const randomLike = [0, 0, 1, 3, Math.round(Math.random() * 10)]
        //console.log(randomLike, "la arr")
        return randomLike[Math.round(Math.random() * 4)]
    }
    const randomNum = useRef(getRandomNum())

    console.log("rereeenderoo")

    useEffect(() => {
        if (giphy) {
            setGif(prev => ({ ...prev, loading: true }))
            const gf = new GiphyFetch('dly39yAKgF2Yppvpsyxi9mLIG35m1eiR')
            gf.gif(giphy.id)
                //.then(res => res.json())
                .then(({ data }) => { setGif(prev => ({ ...prev, gifLoading: false, gifUrl: data.embed_url })) })
                .catch(err => { setGif(prev => ({ ...prev, gifLoading: false, gifError: err.message })) })
        }
    }, [])
    useEffect(() => {
        //if (!isSelected) return;
        console.log("mounting again")
        setConversationData(prev => ({ ...prev, loading: true }))
        fetch(`https://api.stocktwits.com/api/2/streams/conversation/${message.id}.json`)
            .then(res => res.json())
            .then(res => {
                //error means no replies found for message
                if (res.errors) {
                    setConversationData({ error: true, conversationData: null, laoding: false })
                }
                setConversationData(prev =>
                    ({ ...prev, conversationData: res, loading: false }))
            })
            .catch(err => {
                setConversationData(prev =>
                    ({ error: true, conversationData: null, laoding: false }))
            })
    }, [message])

    if (message.entities) {
        console.log(message.entities, "entitieees")
    }
    return (
        <div className={isSelected ? "post is-selected" : "post"}
            onClick={() => { selectPost(message) }}
        >
            <div className="post-avatar">
                <img className="avatar" src={user.avatar_url} alt={user.username} />
            </div>
            <div className="post-body">
                <div className="post-header">
                    {message.entities.sentiment ?
                        <Chip
                            size="small"
                            label={message.entities.sentiment.basic}
                        />
                        : null
                    }
                    <span>
                        {time.current}
                    </span>
                </div>
                <p>
                    {message.body}
                    {/* {giphy && <span style={{ background: "lightblue" }}>{JSON.stringify(giphy)}</span>}
                    {JSON.stringify(message)} */}
                </p>
                {chart && <img src={chart.original} alt="chart caption"/>}
                {giphy && <Giff {...{ gifUrl, gifLoading, gifError }} />}
                <div className="post-footer">
                    <Badge badgeContent={randomNum.current} color="secondary">
                        <FavoriteBorderIcon />
                    </Badge>
                    {
                        error ?
                            <Badge badgeContent={0} color="secondary">
                                <ChatBubbleOutlineIcon />
                            </Badge>
                            :
                            conversationData ?
                                <Badge badgeContent={conversationData.parent.conversation.replies} color="secondary">
                                    <ChatBubbleOutlineIcon />
                                </Badge>
                                :
                                <ChatBubbleOutlineIcon />
                    }

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {
                            isSelected && conversationData && conversationData.messages && conversationData.messages.length > 0 &&
                            conversationData.messages.map(msg => <Reply message={msg} />)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const Giff = ({ gifUrl, gifLoading, gifError }) => {

    return (
        <> { gifLoading ? <p>Loading...</p>
            : gifError ? <p>{gifError}</p>
                :
                <iframe src={gifUrl} width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>}
        </>
    )

}
Post.defaultProps = {
    selectPost: (param) => null
}

const Reply = ({ message }) => {
    const { user, created_at } = message
    return (
        <div
        >
            <div className="post-avatar">
                <img className="avatar" src={user.avatar_url} alt={user.username} />
            </div>
            <div className="post-body">
                <div className="post-header">
                    {message.entities.sentiment ?
                        <Chip
                            size="small"
                            label={message.entities.sentiment.basic}
                        />
                        : null
                    }
                    {/* <span>
                        {time_ago(time)}
                    </span> */}
                </div>
                <p>
                    {message.body}
                </p>
                <div className="post-footer">
                    <Badge badgeContent={0} color="secondary">
                        <FavoriteBorderIcon />
                    </Badge>
                </div>
            </div>
        </div>
    )
}
export default React.memo(Post)