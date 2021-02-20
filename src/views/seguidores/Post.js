import { Badge, Chip } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { time_ago } from "../../utils/datesUtils"
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';


export const Post = ({ message }) => {
    const [{ conversationData, error }, setConversationData] = useState({ conversationData: null, error: null })
    const { user, created_at } = message
    const time = new Date(created_at).getTime()
    console.log(time, "tiempo")
    const getRandomNum = () => {
        const randomLike = [0, 0, 1, 3, Math.round(Math.random() * 10)]
        console.log(randomLike, "la arr")
        return randomLike[Math.round(Math.random() * 4)]
    }
    const randomNum = getRandomNum()

    useEffect(() => {
        fetch(`https://api.stocktwits.com/api/2/streams/conversation/${message.id}.json`)
            .then(res => res.json())
            .then(res => {
                //error means no replies found for message
                if (res.errors) {
                    setConversationData({ error: true })
                }
                setConversationData(prev =>
                    ({ ...prev, conversationData: res }))
            })
            .catch(err => {
                setConversationData(prev =>
                    ({ error: true }))
            })
    }, [])
    if (message.entities) {
        console.log(message.entities, "entitieees")
    }
    return (
        <div className="post">
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
                        {time_ago(time)}
                    </span>
                </div>
                <p>
                    {message.body}
                </p>
                <div className="post-footer">
                    <Badge badgeContent={randomNum} color="secondary">
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
            </div>
        </div>
    )
}

// export const Replies = ({ message }) => {
//     return (

//     )
// }