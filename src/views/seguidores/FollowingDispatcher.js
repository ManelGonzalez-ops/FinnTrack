import React, { useState } from 'react'
//import { usercontext, useUserLayer } from '../../UserContext'
import { Post } from './Post'

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
        currentChunk: 0
    }


    componentDidMount() {

    }

    //we have to sort all message by date, and store them by chunks 
    componentDidUpdate(prevProps, prevState) {
        console.log(prevState, prevProps, "prevv propss")
        if (prevState.data !== this.state.data) {
            console.log(this.state.data, "data recibida")
        }
        if (prevProps.valores !== this.props.valores)
            if (prevProps.valores.userState.ready) {
                this.fetchInterests()
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
        fetch(`http://localhost:8001/api/v1/users/populate?email=${this.props.valores.userState.info.email}`)
            .then(res => res.json())
            .then(res => {
                this.setState({ responseType: res.type })
                const readyData = this.prepareData(res)
                console.log(readyData, "readyData bibor")
                this.setState({
                    loading: false,
                    data: readyData,
                })
            })
            .catch(err => { this.setState({ laoding: false, error: err.message }) })
    }
    render() {
        //console.log(this.context.userState.info, "los proops")
        const { data, loading, responseType, currentChunk } = this.state
        if (loading) {
            return <h3>Loading...</h3>
        }

        if (responseType === "interests") {
            return (
                <div>
                    {data &&
                        data[currentChunk].map(message => (
                            <Post {...{ message }} />
                        ))
                    }
                </div>
            )
        }
        return (
            null
            // <div>
            //     {data && data.map(message => (
            //         <Post {...{ message }} />
            //     ))}
            //     {type && type}
            // </div>
        )
    }
}

// export default withUserState(FollowingDispatcher)

// const withUserState = (component) => {
//     const { userState } = useUserLayer()
//     const Component = component
//     return function (props) {
//         return <Component {...props} email={userState.info.email} />
//     }
// }

const Koko = ({ message }) => {
    return <div>{message.body}</div>
}