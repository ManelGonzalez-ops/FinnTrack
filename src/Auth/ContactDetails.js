import { InputLabel, MenuItem, Select, FormControl, Button, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { useUserLayer } from '../UserContext'
import countries from "../utils/countries.json"
import { CgGenderFemale, CgGenderMale } from "react-icons/cg"
import styled from "styled-components"

const Container = styled.div({
    width: "600px",
    margin: "0 auto"
})
const cleanDate = (date) => {
    return date.split("T")[0]
}

///props come directly from ajax call
export const ContactDetails = ({ userInfo }) => {
    const { userState } = useUserLayer()
    const [country, setCountry] = useState(userInfo.country ? userInfo.country : "")
    const [gender, setGender] = useState(userInfo.gender ? userInfo.gender : "")
    const [dateBirth, setDateBirth] = useState(userInfo.nacimiento ? cleanDate(userInfo.nacimiento) : "")
    const [{ firstName, lastName }, setNames] =
        useState({
            firstName: userInfo.firstName ? userInfo.firstName : "",
            lastName: userInfo.lastName ? userInfo.lastName : ""
        })

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            country, gender, dateBirth, firstName, lastName,
            email: userState.info.email
        }
        fetch("http://localhost:8001/api/v1/users/complete", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            method: "POST"
        })
            .then(res => { console.log(res); return res })
            .then(res => res.json())
            .catch(err => { throw new Error(err) })
    }


    return (
        <div className="contact-details">
            {/* {generatedUrl && <img src={generatedUrl} />} */}
            <form onSubmit={handleSubmit}>
                <CountrySelect {...{ country, setCountry }} />
                <Gender {...{ gender, setGender }} />
                <DateOfBirth {...{ dateBirth, setDateBirth }} />
                <Names {...{ firstName, lastName, setNames }} />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >submit</Button>
            </form>
        </div>
    )
}

const CountrySelect = ({ country, setCountry }) => {
    const [open, setOpen] = useState(false)
    return (
        <FormControl >
            <InputLabel id="select-country">Select Country</InputLabel>
            <Select
                labelId="select-country"
                open={open}
                onClose={() => { setOpen(false) }}
                onOpen={() => { setOpen(true) }}
                value={country}
                onChange={(e) => { setCountry(e.target.value) }}
            >
                <MenuItem value="">
                </MenuItem>
                {countries.map(countryName => (
                    <MenuItem value={countryName}>{countryName}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

const Gender = ({ gender, setGender }) => {

    // const GenderContainer = styled.div({
    //     display: "flex"
    // })
    return (
        <div className="form-group">
            <Label>gender:</Label>
            <Button
                variant={gender === "female" ? "contained" : "outlined"}
                color="secondary"
                onClick={() => { setGender("female") }}
            >
                <CgGenderFemale style={{ fontSize: "20px" }} />
            </Button>
            <Button
                variant={gender === "male" ? "contained" : "outlined"}
                color="primary"
                onClick={() => { setGender("male") }}
            ><CgGenderMale style={{ fontSize: "20px" }} />
            </Button>

        </div>
    )
}

const DateOfBirth = ({ setDateBirth, dateBirth }) => {
    const [focused, setFocused] = useState(false)
    return (
        <div className="form-group">
            <Label {...{ focused }}>Birthdate</Label>
            <TextField
                type="date"
                defaultValue={dateBirth}
                onChange={(e) => { setDateBirth(e.target.value) }}
                InputLabelProps={{
                    shrink: true,
                }}
                onFocus={() => { setFocused(true) }}
                onBlur={() => { setFocused(false) }}
            />
        </div>
    )
}

const Label = styled.label(props => ({
    display: "block",
    color: props.focused ? "#3f51b5" : "unset",
}))
const FormGroup = styled.div({

})
const Names = ({ firstName, lastName, setNames }) => {

    const [focusedField, setFocusedField] = useState("")

    const handleFocus = (e) => {
        setFocusedField(e.target.name)
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setNames(prev => ({ ...prev, [name]: value }))
    }
    return (
        <>
            <div className="form-group"
            >
                <Label htmlFor="firstName"
                    focused={"firstName" === focusedField}
                >First name</Label>
                <TextField
                    id="firstName"
                    type="text"
                    value={firstName}
                    name="firstName"
                    variant="outlined"
                    onFocus={handleFocus}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group"
            >
                <Label htmlFor="lastName"
                    focused={"lastName" === focusedField}
                >Last name</Label>
                <TextField
                    id="lastName"
                    type="text"
                    value={lastName}
                    name="lastName"
                    variant="outlined"
                    onFocus={handleFocus}
                    onChange={handleChange}
                />
            </div>
        </>
    )
}