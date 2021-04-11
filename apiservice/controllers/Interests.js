const { getUsername } = require("../../db/services")
const { getUserInterests, updateUserInterest, addUserInterest } = require("../../db/services/interestsService")



const addInterest = async (req, res) => {
    const { email, interest } = req.query
    console.log(email, interest)
    try {
        const data = await getUserInterests(email)
        console.log(data, "datonaa")
        if (data && data.length) {
            const { username } = data[0]
            let interestDB = JSON.parse(data[0].interests_arr)
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
            const username = await getUsername(email)
            console.log(username, "nombre usuario")
            //we insert record for that user in Interest Table at it didnt exist before 
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

const populate = async (req, res, next) => {
    const { email } = req.query
    try {
        const data = await getUserInterests(email).catch(err => {

            //console.log(err, "error")
            throw new Error(err)
        })
        if (!data.length) {
            return await populateWithTrendingMessages((trendingMessages) => {
                console.log(trendingMessages, "trendng")
                return res.status(200).send({ data: trendingMessages, type: "trending" })
            }).catch(err =>next(err))
        }
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
        const validResultA = deleteDuplicates(validResults)
        if (validResultA.length) {
            return res.status(200).send({ data: validResultA, type: "interests" })
        } else {
            return await populateWithTrendingMessages((trendingMessages) => {
                console.log(trendingMessages, "trendng")
                return res.status(200).send({ data: trendingMessages, type: "trending" })
            }).catch(err => next(err))
        }

    }
    catch (err) {
        console.log(err)
        throw new Error(err)
        next(err)
    }
}

const deleteDuplicates = (arr) => {
    return arr.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
}
const populateWithTrendingMessages = async (cb) => {
    console.log("executao")
    const fetchStockTwitsTrendingUsers = () => {
        return fetch("https://api.stocktwits.com/api/2/streams/trending.json")
    }
    const trendingMessages = await fetchStockTwitsTrendingUsers()
        .then(res => res.json())
        .then(res => {
            console.log(res, "respuaesat trending");
            if (res.response.status === 429) {
                throw new Error(res.errors[0].message)
            }
            return res
        })
        .then(res => res.messages)
        .catch(err => { throw new Error(err) })

    cb(trendingMessages)
}

const fetchStockTwits = (ticker) => {
    return fetch(`https://api.stocktwits.com/api/2/streams/symbol/${ticker}.json`)
        .then(res => res.json())

}


module.exports = { addInterest, populate }


