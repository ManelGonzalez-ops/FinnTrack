import React, { useEffect, useRef, useState } from 'react'
//import { usercontext, useUserLayer } from '../../UserContext'
import Post from './Post'
import gsap from "gsap"
import { Backdrop, Button, Dialog, IconButton } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';
export class FollowingDispatcher extends React.Component {

    //static contextType = usercontext
    constructor(props, context) {
        super(props, context)
    }
    state = {
        loading: true,
        data: null,
        error: null,
        responseType: null,
        backdropOpen: false,
        selectedPost: null,
        rotatingIcon: false,
        imgSelected: null
    }
    // messageRef = React.createRef()
    // timeline = gsap.timeline()

    componentDidMount() {
        if (this.props.valores.userState.ready) {

            this.fetchInterests()
        }
    }

    //we have to sort all message by date, and store them by chunks 
    componentDidUpdate(prevProps, prevState) {
        console.log(prevState, prevProps, "prevv propss")
        if (prevState.data !== this.state.data) {
            console.log(this.state.data, "data recibida")

        }
        //in case user navigate to /interests directly in url
        if (prevProps.valores !== this.props.valores) {
            console.log("valores change", this.props.valores.userState.ready)
            if (this.props.valores.userState.ready) {
                this.fetchInterests()
            }
        }
    }

    prepareData(res) {
        console.log(res.data, "jooooiia")
        if (!res.data || !res.data.length) {
            console.log("es nulo")
            return null
        }
        const sortedData = res.data
            .map(msg => {
                const unixTime = new Date(msg.created_at).getTime()
                msg.unixTime = unixTime
                return msg
            })
            .sort((previous, current) => current.unixTime - previous.unixTime);
        console.log(sortedData, "sortedData")
        if (this.state.responseType === "trending") {
            return sortedData
        }
        if (this.state.responseType === "interests") {
            const chunkedData = this.chunkData(sortedData, 30)
            return chunkedData
        }
    }

    chunkData(arr, postsXChunk) {
        let result = []
        const chunkNumber = Math.round(arr.length / postsXChunk)
        this.props.setChunkCount(chunkNumber)
        const sobrantes = arr.length - postsXChunk * chunkNumber
        let iteration = 0
        Array(chunkNumber).fill(null).forEach(() => {
            result = [...result, arr.slice(iteration, iteration + 30)]
            iteration += 30
        })
        if (sobrantes) result = [...result, arr.slice(iteration, iteration + sobrantes)];

        return result
    }
    fetchInterests() {
        this.setState({
            rotatingIcon: true,
            data: null,
        })
        fetch(`${process.env.REACT_APP_API}/api/v1/interests/populate?email=${this.props.valores.userState.info.email}`)
            .then(res => res.json())
            .then(res => {
                this.setState({ responseType: res.type })
                //this.props._setResponseType(res.type)
                const readyData = this.prepareData(res)
                console.log(readyData, "readyData bibor")
                this.setState({
                    loading: false,
                    data: readyData,
                    rotatingIcon: false
                })
                if (this.state.responseType === "interests") {
                    this.props._setIsDataReadyScroll(readyData !== null)
                }
            })
            .catch(err => { this.setState({ laoding: false, error: err.message, rotatingIcon: false }) })
    }

    selectPost = (post) => {
        // console.log(this.state.data, "dataoo")
        //const selection = this.state.data.find(post => post.id === id)
        console.log("selectpost fired")
        this.setState({ selectedPost: post, backdropOpen: true })
    }
    unselectPost = () => {
        { this.setState({ backdropOpen: false, selectedPost: null }) }
    }

    selectImg = (url) => {
        console.log("selectIMG fired")

        this.setState(prev => ({
            ...prev,
            imgSelected: url
        }))
    }

    unselectImg = () => {
        this.setState(prev => ({ ...prev, imgSelected: null }))
    }
    render() {
        console.log(this.props.valores.userState, "wopo")
        //console.log(this.context.userState.info, "los proops")
        const { data, loading, responseType, backdropOpen, selectedPost, rotatingIcon, imgSelected } = this.state
        console.log(data, "lo dataa")
        const { currentChunk } = this.props
        if (loading) {
            return <h3>Loading...</h3>
        }

        if (responseType === "interests") {
            return (
                <>
                    <div>
                        {data && data.length &&
                            data.slice(0, currentChunk).map((chunk, index) => {
                                console.log(chunk, "qe collons chu")
                                return (<PostChunk key={index} {...{ chunk }}
                                    selectPost={this.selectPost}
                                    selectImg={this.selectImg}
                                />
                                )
                            }
                            )
                        }
                    </div>
                    {selectedPost &&
                        <ModalSelection
                            isOpen={backdropOpen}
                            unselectPost={this.unselectPost}>
                            <Post message={selectedPost} selectPost={this.selectPost} isSelected={true} />
                        </ModalSelection>
                    }
                    {
                        imgSelected &&
                        <ModalImg
                            open={!!imgSelected}
                            unselectImg={this.unselectImg}
                        >
                            <img src={imgSelected} alt="image" />
                        </ModalImg>
                    }

                </>
            )
        }
        if (responseType === "trending") {
            return (
                <>
                    <Button
                        startIcon={<RefreshIcon className={rotatingIcon ? "rotating-icon" : ""} />}
                        onClick={() => { this.fetchInterests() }}
                    >
                        Refresh
                </Button>
                    {data && <GsapFadeInStagger>
                        {data.map(message => (
                            <Post {...{ message }}
                                selectPost={this.selectPost}
                            />
                        ))}
                    </GsapFadeInStagger>}

                    {selectedPost &&
                        <ModalSelection
                            isOpen={backdropOpen}
                            unselectPost={this.unselectPost}>
                            <Post message={selectedPost} selectPost={this.selectPost} isSelected={true} />
                        </ModalSelection>
                    }

                </>
            )
        }
        return <p>No responseType returned from server</p>
    }
}

const ModalSelection = ({ unselectPost, children, isOpen }) => {
    return (
        <Dialog open={isOpen}
            onClick={unselectPost}
            //style={{ zIndex: 100 }}
            maxWidth={false}
        //fullScreen
        >

            { children}
        </Dialog>
    )
}

const ModalImg = ({ children, open, unselectImg }) => {

    return (
        <Dialog
            open={open}
            onClose={unselectImg}
            maxWidth="lg"
        >
            <div
                style={{ position: "relative" }}
            >
                {children}
                <IconButton
                    onClick={unselectImg}
                >
                    <CloseIcon
                        style={{ position: "absolute", right: "0", top: "0", fontSize: "35px" }}
                    />
                </IconButton>
            </div>
        </Dialog>
    )
}

const GsapFadeInStagger = ({ children }) => {
    const chunkRef = useRef(null)
    const timeline = gsap.timeline()
    useEffect(() => {
        timeline.to(chunkRef.current.childNodes, {
            //y: 100,
            opacity: 1,
            ease: "power3.inOut",
            duration: 0.4,
            stagger: 0.1
        });
    }, [])
    return (
        <div ref={chunkRef}>
            {children}
        </div>
    )
}

const PostChunk = ({ chunk, selectPost, selectImg }) => {

    return <GsapFadeInStagger>
        {chunk.map((message, index) => (
            <Post key={message.id} {...{ message, selectPost, selectImg }} />
        ))}
    </GsapFadeInStagger>
}


const Koko = ({ message }) => {
    return <div>{message.body}</div>
}