import { InputLabel, MenuItem, Select, FormControl, Button, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useUserLayer } from '../UserContext'
import countries from "../utils/countries.json"
import { CgGenderFemale, CgGenderMale } from "react-icons/cg"
import styled from "styled-components"
import { CircularProgress } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import "./imageUploader.scss"

const Container = styled.div({
    width: "600px",
    margin: "0 auto"
})


export const ImageUploader = () => {
    const [imageUpload, setImageUpload] = useState("")
    const [response, setResponse] = useState("")
    const [loading, setLoading] = useState(false)
    const { userState: { info }, userDispatch } = useUserLayer()
    const [loaded, setLoaded] = useState(false)
    const [provisionalImg, setProvisionalImg] = useState(info.imageUrl ? info.imageUrl : "")

    const handleImageUpload = (e) => {
        setImageUpload(e.target.files[0])
        setProvisionalImg(URL.createObjectURL(e.target.files[0]))
    }

    const image = provisionalImg || info.imageUrl

    const handleSubmit = (e) => {
        e.preventDefault();
        const imageData = new FormData()
        imageData.append("image", imageUpload)
        imageData.append("email", info.email)
        setLoading(true)
        fetch("http://localhost:8001/api/v1/users/upload", {
            body: imageData,
            method: "POST"
        })
            .then(res => res.blob())
            .then(image => {
                userDispatch({ type: "UPDATE_IMAGE", payload: image })
                setLoading(false)
            })
            .catch(err => { setResponse(JSON.stringify(err)) })
    }
    return (
        <div className="contact-details">
            <form onSubmit={handleSubmit}>
                {image ?
                    <label style={{ height: "100px", width: "100px", display: "block" }} htmlFor="upload">
                        <img
                            src={image}
                            style={loaded ? { display: "inline" } : { display: "none" }}
                            onLoad={() => { setLoaded(true) }}
                        />

                        {!loaded && <Skeleton variant="rect" width={210} height={118} />}

                        <input
                            type="file"
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                            id="upload"
                        />
                    </label>
                    :
                    <div style={{ width: "100%", height: "100%", backgroundColor: "black" }}></div>
                }
                <LoadingButton
                    {...{ loading, handleSubmit }}
                >
                    submit</LoadingButton>
            </form>
        </div>
    )
}

const LoadingButton = ({ loading, handleSubmit }) => {

    return (<Button
        onClick={handleSubmit}
        endIcon={loading ? <CircularProgress /> : null}
        variant="contained"
        color="primary"
    >
        {loading ? "submiting.." : "submit"}
    </Button>
    )
}