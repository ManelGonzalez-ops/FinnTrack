import { InputLabel, MenuItem, Select, FormControl, Button, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useUserLayer } from '../UserContext'
import countries from "../utils/countries.json"
import { CgGenderFemale, CgGenderMale } from "react-icons/cg"
import styled from "styled-components"
import { CircularProgress } from '@material-ui/core'

const Container = styled.div({
    width: "600px",
    margin: "0 auto"
})


export const ImageUploader = ({ image }) => {
    const [imageUpload, setImageUpload] = useState(image ? image : "")
    const [response, setResponse] = useState("")
    const [loading, setLoading] = useState(false)
    const [generatedUrl, setGeneratedUrl] = useState("")
    const { userState } = useUserLayer()

    useEffect(() => {
        if (image) {
            setGeneratedUrl(URL.createObjectURL(image))
        }
    }, [image])

    const handleImageUpload = (e) => {
        setImageUpload(e.target.files[0])
        setGeneratedUrl(URL.createObjectURL(e.target.files[0]))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const imageData = new FormData()
        imageData.append("image", imageUpload)
        imageData.append("email", userState.info.email)
        setLoading(true)
        fetch("http://localhost:8001/api/v1/users/upload", {
            body: imageData,
            method: "POST"
        })
            .then(res => res.blob())
            .then(image => {
                setGeneratedUrl(URL.createObjectURL(image))
                setLoading(false)
            })
            .catch(err => { setResponse(JSON.stringify(err)) })
    }
    return (
        <div className="contact-details">
            {/* {generatedUrl && <img src={generatedUrl} />} */}
            <form onSubmit={handleSubmit}>
                <label style={{ height: "100px", width: "100px", background: "red", display: "block" }} htmlFor="upload">
                    {generatedUrl && <img src={generatedUrl} style={{ height: "100%" }} />}
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                        id="upload"
                    />
                </label>
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