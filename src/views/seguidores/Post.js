import { Badge, Chip, Collapse } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react'
import { time_ago } from "../../utils/datesUtils"
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { GiphyFetch } from '@giphy/js-fetch-api'
import "../../styles/feed/feed.scss"
import { Transition } from 'react-transition-group';
import { CustomCircularProgress } from '../../components/components/CustomCircularProgress';



const Post = ({ message, selectPost, selectImg, isSelected = false }) => {
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

    const replyGuard = () => {
        if (conversationData &&
            conversationData.messages &&
            conversationData.messages.length > 0) {
            return true
        }
        return false
    }
    console.log(conversationData, "conversdataaa")
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
                <p className="message-text">
                    {message.body}
                </p>
                {chart && <img src={chart.original} alt="chart caption"
                    className={isSelected ? "body-img bigger" : "body-img"}
                    onClick={(e) => {
                        e.stopPropagation()
                        selectImg(chart.original)
                    }}
                />
                }
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

                </div>
                <div
                    className="post-replys"
                >

                    <Transition
                        in={isSelected}
                        unmountOnExit
                        mountOnEnter

                    >
                        {(state) => {

                            return <Collapse
                                in={conversationData && conversationData.messages}

                            >

                                <div
                                >
                                    {conversationData && conversationData.messages && conversationData.messages.map((msg) => <Reply message={msg} key={msg.user.username} />)}

                                </div>

                            </Collapse>
                        }}
                    </Transition>
                </div>
            </div>
        </div>
    )
}

const defaultStyles = {
    // display: "flex", flexDirection: "column",
    // transition: "opacity 0.5s ease",
    background: "orange"
    //opacity: 0
}
const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 },
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
                <p className="message-text">
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