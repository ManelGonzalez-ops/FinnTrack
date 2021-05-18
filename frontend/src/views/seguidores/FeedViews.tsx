import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import MessageIcon from '@material-ui/icons/Message';
import { IconButton } from '@material-ui/core';
import { TextEditor } from "./TextEditor"
import { useDataLayer } from '../../Context';
import { useUserLayer } from '../../UserContext';
import { convertUnixToHuman } from '../../utils/datesUtils';
import { ContactlessOutlined } from '@material-ui/icons';
import { Likes } from './Likes';

export interface PostPnp {
    postId: number,
    msg: string,
    likes: number,
    username: string,
    date: string,
    avatar: string,
    tags: string[],
    answers: Post[] | [],
    parentId: null | number,
    usersLiked: string[]
}
export interface Post extends PostPnp {
    ancestorId: number,
    answers: Post[] | []
}

const fakeData: PostPnp[] = [
    {
        postId: 1,
        parentId: null,
        msg: "I’ve seen the original, nice twist. If I was writing the algorithm it would probably come back with infinite eggs because I forgot to close the loop somewhere",
        likes: 13,
        username: "Perico Palotes",
        date: "15-08-2020",
        avatar: "https://avatars.stocktwits.com/production/3327008/large-1607135425.png",
        tags: ["Tesla"],
        usersLiked: [],
        answers: [
            {
                postId: 2,
                parentId: 1,
                username: "mamarraxo",
                msg: "I’ve seen the original, nice twist. If I was writing the algorithm it would probably come back with infinite eggs because I forgot to close the loop somewhere",
                date: "15-08-2020",
                likes: 2,
                avatar: "https://avatars.stocktwits.com/production/3327008/large-1607135425.png",
                tags: ["Tesla"],
                ancestorId: 1,
                usersLiked: [],
                answers: [
                    {
                        postId: 3,
                        parentId: 2,
                        username: "mamarraxo",
                        msg: "I’ve seen the original, nice twist. If I was writing the algorithm it would probably come back with infinite eggs because I forgot to close the loop somewhere",
                        date: "15-08-2020",
                        likes: 2,
                        answers: [],
                        avatar: "https://avatars.stocktwits.com/production/3327008/large-1607135425.png",
                        tags: ["Tesla"],
                        ancestorId: 1,
                        usersLiked: []
                    }
                ]
            },
            {
                postId: 4,
                parentId: 1,
                username: "mamarraxo",
                msg: "I’ve seen the original, nice twist. If I was writing the algorithm it would probably come back with infinite eggs because I forgot to close the loop somewhere",
                likes: 2,
                date: "15-08-2020",
                avatar: "https://avatars.stocktwits.com/production/3327008/large-1607135425.png",
                tags: ["Tesla"],
                ancestorId: 1,
                usersLiked: [],
                answers: [
                    {
                        postId: 5,
                        parentId: 4,

                        username: "mamarraxo",
                        msg: "I’ve seen the original, nice twist. If I was writing the algorithm it would probably come back with infinite eggs because I forgot to close the loop somewhere",
                        likes: 2,
                        date: "15-08-2020",
                        answers: [],
                        avatar: "https://avatars.stocktwits.com/production/3327008/large-1607135425.png",
                        ancestorId: 1,
                        tags: ["Tesla"],
                        usersLiked: []

                    },
                    {
                        postId: 6,
                        parentId: 4,
                        username: "mamarraxo",
                        msg: "I’ve seen the original, nice twist. If I was writing the algorithm it would probably come back with infinite eggs because I forgot to close the loop somewhere",
                        likes: 2,
                        date: "15-08-2020",
                        answers: [],
                        avatar: "https://avatars.stocktwits.com/production/3327008/large-1607135425.png",
                        tags: ["Tesla"],
                        ancestorId: 1,
                        usersLiked: []

                    },
                ]
            },
        ],
    }
]

const PostWrapper = styled.div({
    background: "lightblue",
    marginBottom: "100px",
    display: "grid",
})

const LongColumn = styled.div({

})

const initial: [] = []

export const FeedViews = () => {
    const [posts, setPosts] = useState<PostPnp[] | []>(initial)
    const [error, setError] = useState("")
    const { state } = useUserLayer()
    const handleNewPost = (content: string) => {

        const post = {
            username: "Manilox",
            avatar: "https://i.pinimg.com/originals/29/24/89/292489e7d0bf8ce7d5ffd81be62d0800.png",
            msg: content,
            date: convertUnixToHuman(Date.now()),
        }
        fetch("http://localhost:8001/api/v1/posts", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post),
            method: "POST"
        })
            .then(res => res.json())
            .then(res => { setPosts(prev => ([...prev, res])) })
            .catch(err => { throw new Error(err.message) })

    }


    const updatePost = (updatedPost: any) => {
        console.log(updatedPost, "updated post")
        console.log(posts, "state before update")
        const updatedPosts = (posts as PostPnp[]).map(post => {
            if (post.postId === updatedPost.postId) {
                return updatedPost
            }
            return post
        })
        console.log(updatedPosts, "updatedstattee")

        setPosts(updatedPosts)
    }

    const handleReply = (content: string, parentId: number, ancestorId: number) => {
        const newPost = {
            parentId,
            ancestorId,
            username: "Manilox",
            avatar: "https://i.pinimg.com/originals/29/24/89/292489e7d0bf8ce7d5ffd81be62d0800.png",
            msg: content,
            date: convertUnixToHuman(Date.now()),
            tags: ["whateeever"],
        }

        fetch("http://localhost:8001/api/v1/posts/reply", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost),
            method: "POST"
        })
            .then(res => res.json())
            .then(res => { updatePost(res[0]) })
            .catch(err => { throw new Error(err.message) })
    }

    useEffect(() => {
        fetch("http://localhost:8001/api/v1/posts")
            .then(res => res.json())
            .then(res => {
                console.log(res, "all posts")
                setPosts(res)
            })
            .catch(err => { setError(err.message) })
    }, [])
    // const addPost = async (parentId: number, postInfo: Post) => {
    //     const postsCopy = [...posts]
    //     let encontrado = false
    //     const loopi = (arr: Post[] | [], resolve: () => void) => {
    //         if (arr.length) {
    //             (arr as Post[]).forEach((post: Post) => {
    //                 if (post.postId === parentId) {
    //                     (post.answers as any).push(postInfo)
    //                     resolve()
    //                 }
    //                 else {
    //                     loopi(post.answers, resolve)
    //                 }
    //             })
    //         }
    //     }
    //     const updatePost = (): Promise<void> => {
    //         //as soon as we find postId parent we resolve, to optimize
    //         return new Promise(resolve => {
    //             postsCopy.forEach(post => {
    //                 if (post.postId === parentId) {
    //                     (post.answers as Post[]).push(postInfo)
    //                     resolve()
    //                 }
    //                 else {
    //                     loopi(post.answers, resolve)
    //                 }
    //             })

    //         })
    //     }
    //     await updatePost()
    //     setPosts(postsCopy)
    // }

    console.log(posts, "posttttt")

    return (
        <div style={{ marginTop: "100px" }}>
            {error && <p>{error}</p>}
            {
                posts.length &&
                (posts as PostPnp[]).map((item: PostPnp) => {
                    return (
                        <FeedPost
                            key={item.postId}
                            post={item}
                            handleReply={handleReply}
                            updatePost={updatePost}
                        />
                    )
                })}
            <TextEditor
                email="manilo@gmail.com"
                postId={0}
                handleNewPost={handleNewPost}
                type="post"
            />
        </div>
    )
}

interface Props {
    post: PostPnp,
    handleReply: (content: string, parentId: number, ancestorId: number) => void,
    updatePost: (updatedPost: any) => void
}

//here is where first reply is handled, parentId = ancestorId
const FeedPost: React.FC<Props> = ({ post, handleReply, updatePost }) => {

    const [inputOpened, setInputOpened] = useState(false)

    const { state } = useUserLayer()

    function toggleEditor() {
        setInputOpened(prev => !prev)
    }

    const handleLike = (postId: number) => {
        fetch(`http://localhost:8001/api/v1/posts/like?username=Manilox&postId=${postId}`)
            .then(res => res.json())
            .then(res => {
                console.log(res, "respuesta");
                updatePost(res)
            })
            .catch(err => { console.log(err) })
    }



    return (
        <div className="feed-wrapper">
            <div className="tall-part">
                <img src={post.avatar} />
                <div className="line-wrapper">
                    <p className="line"></p>
                </div>
            </div>
            <div className="feed-main">
                <header className="feed-header">
                    <p>{post.username}</p>
                    <p>{post.date}</p>
                </header>
                <Likes
                    post={post}
                    {...{ handleLike }}
                />
                <div className="feed-body">
                    <div className="feed-msg">
                        {post.msg}
                    </div>
                    <div className="feed-footer">
                        <IconButton
                            onClick={toggleEditor}
                        >
                            <MessageIcon />
                        </IconButton>
                    </div>
                    {inputOpened &&
                        <div className="editor-wrapper">
                            <TextEditor
                                email="manilo@gmail.com"
                                parentId={post.postId}
                                ancestorId={post.postId}
                                handleReply={handleReply}
                                type="reply"
                            />
                        </div>
                    }
                </div>

                {!!post.answers.length &&
                    (post.answers as any[]).map((reply: Post) => {
                        return <FeedItem
                            key={reply.postId}
                            {...{ reply, handleReply, handleLike, updatePost }} />
                    })
                }

            </div>

        </div>
    )
}






interface PropsReply {
    reply: Post,
    handleReply: (content: string, parentId: number, ancestorId: number) => void,
    updatePost: (updatedPost: any) => void,
    handleLike: (postId: number) => void
}

const FeedItem: React.FC<PropsReply> = ({ reply, handleReply, handleLike, updatePost }) => {

    const [inputOpened, setInputOpened] = useState(false)
    const [likes, setLikes] = useState(reply.likes)
    const { state } = useUserLayer()

    function toggleEditor() {
        setInputOpened(prev => !prev)
    }
    console.log(reply, "iiitem")


    return (
        <div className="feed-wrapper">
            <div className="tall-part">
                <img src={reply.avatar} />
                <div className="line-wrapper">
                    <p className="line"></p>
                </div>
            </div>
            <div className="feed-main">
                <header className="feed-header">
                    <p>{reply.username}</p>
                    <p>{reply.date}</p>
                </header>
                <Likes
                    post={reply}
                    {...{ handleLike }}
                />
                <div className="feed-body">
                    <div className="feed-msg">
                        {reply.msg}
                    </div>
                    <div className="feed-footer">
                        <IconButton
                            onClick={toggleEditor}
                        >
                            <MessageIcon />
                        </IconButton>
                    </div>
                    {inputOpened &&
                        <div className="editor-wrapper">
                            <TextEditor
                                email="manilo@gmail.com"
                                parentId={reply.postId}
                                handleReply={handleReply}
                                ancestorId={reply.ancestorId}
                                type="reply"
                            />
                        </div>
                    }
                </div>

                {!!reply.answers.length &&
                    (reply.answers as any[]).map((reply: Post) => {
                        return <FeedItem
                            key={reply.postId}
                            {...{ reply, handleReply, handleLike, updatePost }} />
                    })
                }

            </div>

        </div>
    )
}

// const FeedResponse = () => {
//     <div className="feed-wrapper">
//         <div className="tall-part">
//             <img src={item.avatar} />
//             {item.answers.length && <p class="line"></p>}
//         </div>
//         <div className="feed-main">
//             <header className="feed-header">
//                 <p>{item.username}</p>
//                 <p>{item.date}</p>
//             </header>
//             <div className="feed-body">
//                 {item.body}
//             </div>
//         </div>
//         <div className="feed-footer">
//         </div>
//         {item.answers.length &&
//             item.answers.map(item => {
//                 <FeedResponse {...{ item }} />
//             })}
//     </div>
// }