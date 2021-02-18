const { getUserInterests, updateUserInterest, addUserInterest } = require("../../db/services/interestsService")

const addInterest = async (req, res) => {
    const { email, interest } = req.query
    console.log(email, interest)
    try {
        const data = await getUserInterests(email)
        console.log(data, "datonaa")
        const { username } = data[0]
        let interestDB = JSON.parse(data[0].interests_arr)
        console.log(interestDB, "intdb")
        if (data && data.length) {
            const wasInterested = interestDB.find(tag => tag === interest)
            const updatedInterests = wasInterested ?
                interestDB.filter(tag => tag !== interest)
                :
                [...interestDB, interest];
            console.log(updatedInterests, "intsssupt")
            await updateUserInterest(username, updatedInterests)
            console.log("interests updated")
            res.status(200).send(updatedInterests)
        } else {
            await addUserInterest(username, interest)
            console.log("user interest inserted")
            res.status(200).send(interest)
        }
    }
    catch (err) {
        res.status(400).send(err.message)
        throw new Error(err.message)
    }
}

const populate = async (req, res) => {
    const { email } = req.query
    try {
        const data = await getUserInterests(email)
        console.log(data, "datonaa")
        const { username } = data[0]
        let interestDB = JSON.parse(data[0].interests_arr)
        console.log(interestDB)
        const promiseArr = interestDB.map(ticker => fetchStockTwits(ticker))
        const resultado = await Promise.allSettled(promiseArr)
        const validResults = resultado.
            filter(proms => proms.value.response.status === 200)
            .flatMap(response => response.value.messages)
        console.log(validResults, "riiisult")
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
const fetchStockTwits = (ticker) => {
    return fetch(`https://api.stocktwits.com/api/2/streams/symbol/${ticker}.json`)
        .then(res => res.json())
}

module.exports = { addInterest, populate }


