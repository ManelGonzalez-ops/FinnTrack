const { addtoPostRegister, addNewPost, updatePostStructure, getPostsDB, getStructureByAncestor, getPostRegisterByPostId, updatePostLikes } = require("../db/services/PostServices")

const addReply = async (req, res) => {
    const { parentId, ancestorId, msg, date, avatar, username, tags } = req.body
    let replyItem = {
        msg,
        date,
        avatar,
        username,
        parentId,
        ancestorId,
        tags,
        isPrincipal: false,
        likes: 0,
        answers: [],
        usersLiked: []
    }
    try {
        //we could add ancestorId too to postregisterDb
        const { insertId } = await addtoPostRegister({ parentId, date, isPrincipal: false, ancestorId })
        //console.log(newPost, "new post tenemos que cojr id")
        replyItem = { ...replyItem, postId: insertId }

        //tenemos que insertar
        const rawPostTree = await getStructureByAncestor(ancestorId)
        console.log(rawPostTree, "rawwPostttreee")
        const postTree = rawPostTree.
            //structure is an array of 1 key
            map(({ structure }) => JSON.parse(structure))
            .map(data => data[0])
        console.log(postTree, "posstree")
        console.log(replyItem, "replyyy")
        console.log(parentId, "parentiiid")
        await new Promise(resolve => {
            return searchAndInsertReply(postTree[0], parentId, replyItem, resolve)
        })

        // const recursivo = (postTree, parentId, replyItem) => new Promise(resolve => {
        //     searchAndInsertReply(postTree, parentId, replyItem, resolve)
        // })
        //await recursivo(postTree, parentId, replyItem)
        //console.log(postTree, JSON.stringify(postTree), "mierda")
        await updatePostStructure(postTree, ancestorId)
        return res.status(200).send(postTree)

    } catch (err) {
        console.log(err)
        return res.status(400).send(err.message)
    }
}

let lastValid;
const searchAndInsertReply = (postTree, parentId, replyItem, resolve) => {
    console.log(postTree, "array")
    const { answers } = postTree
    if (postTree.postId === parentId) {
        answers.push(replyItem)
        resolve()
    }
    answers.forEach((post) => {
        if (post.postId === parentId) {
            post.answers.push(replyItem)
            resolve()
        } else {
            searchAndInsertReply(post, parentId, replyItem, resolve)
        }
    })
}

const addPost = async (req, res) => {
    const {
        msg,
        date,
        avatar,
        username,
        tags
    } = req.body
    let postItem = {
        msg,
        date,
        avatar,
        username,
        tags,
        isPrincipal: true,
        parentId: 0,
        likes: 0,
        answers: [],
        usersLiked: []
    }

    try {
        const { insertId } = await addtoPostRegister({ isPrincipal: true, date, parentId: 0, ancestorId: 0 })
        postItem = { ...postItem, postId: insertId }
        await addNewPost(insertId, postItem)
        postItem = { ...postItem, postId: insertId }
        res.status(200).send(postItem)
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }
}



const getPosts = async (req, res) => {
    try {
        const allPosts = await getPostsDB()
        console.log(allPosts, "allPosts")
        const readyPosts = allPosts.map(({ structure }) => {
            console.log(structure[0], "structut¡ra")
            return JSON.parse(structure)
        })
            .map(data => data[0])
        console.log(readyPosts, "ready posts")
        res.status(200).send(readyPosts)
    } catch (err) {
        res.status(400).send(err.message)
    }
}


const handleLike = async (req, res) => {
    console.log("aaaattoon")
    const { postId, username } = req.query
    console.log(postId, username)
    try {
        let post = await getPostRegisterByPostId(postId)
        console.log(post)
        let { usersVoted, ancestorId, isPrincipal } = post
        usersVoted = JSON.parse(usersVoted)

        const userAlreadyVoted = usersVoted.find((usar) => usar === username)

        let updatedLikes, updatedUsersVoted;
        if (userAlreadyVoted) {
            updatedLikes = post.likes - 1
            updatedUsersVoted = usersVoted.filter(_username => _username !== username)
        } else {
            updatedLikes = post.likes + 1;
            updatedUsersVoted = [...usersVoted, username]
        }

        await updatePostLikes(updatedLikes, updatedUsersVoted, postId);
        const postTree = isPrincipal ?
            await getStructureByAncestor(postId) :
            await getStructureByAncestor(ancestorId);
        const structure = JSON.parse(postTree[0].structure)[0]
        console.log(structure, "posttree")
        await new Promise(resolve => {
            searchAndUpdate(structure, updatedLikes, updatedUsersVoted, parseInt(postId), resolve)
        })
        console.log(structure, "struci")
        isPrincipal ?
            await updatePostStructure([structure], postId)
            :
            await updatePostStructure([structure], ancestorId)
        return res.status(200).send(structure)
    }
    catch (err) {
        console.log(err)
    }
}




const searchAndUpdate = (postTree, newLikes, usersVoted, postId, resolve) => {
    console.log(postTree.postId, newLikes, postId, "wtfff")
    console.log("ue mierda")
    console.log(postTree, "array")
    const { answers } = postTree
    if (postTree.postId === postId) {
        postTree.likes = newLikes
        postTree.usersLiked = usersVoted
        resolve()
    }
    answers.forEach((post) => {
        if (postTree.postId === postId) {
            postTree.likes = newLikes
            postTree.usersLiked = usersVoted
            resolve()
        } else {
            searchAndUpdate(post, newLikes, usersVoted, postId, resolve)
        }
    })
}
module.exports = { addReply, addPost, getPosts, handleLike }

