module.exports = {

    userDetailsFactory: ({ country, gender, dateBirth, firstName, lastName, image }) => {
        const body = {
            static_image: false
        }
        if (country) body.country = country;
        if (gender) body.gender = gender;
        if (dateBirth) body.nacimiento = dateBirth;
        if (firstName) body.firstName = firstName;
        if (lastName) body.lastName = lastName;
        if (image) body.image = image;
        return body
    },

    
    getBirthday: (profile) => {
        const gender = profile._json.birthday
        if (!gender) {
            return null
        }
        const chunks = gender.split("/")
        return `${chunks[2]}-${chunks[0]}-${chunks[1]}`
    }

}
