import React, { useEffect, useState } from 'react'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import { Badge, IconButton } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {PostPnp, Post} from "./FeedViews"
interface Props {
    post: PostPnp | Post,
    handleLike: (postId: number) => void,
}

export const Likes: React.FC<Props> = ({ post, handleLike }) => {
    const {likes, usersLiked, postId} = post
    const userName = "Manilox"
    const [isLiked, setIsLiked] = useState(false)
    useEffect(() => {
        const isLiked = usersLiked.find(username => username === userName)
        setIsLiked(!!isLiked)
    }, [usersLiked])
    return (
        <div>

            <IconButton
                onClick={()=>handleLike(postId)}
            >
                <Badge badgeContent={likes} color="primary"
                    style={{ height: "15px", minWidth: "15px", padding: 0 }}
                >
                    <FavoriteIcon 
                    style={{ color: isLiked ? "red" : "blue" }}
                    />
                </Badge>
            </IconButton>

        </div>
    )
}
