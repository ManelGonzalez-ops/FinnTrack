const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { getUser, storeNewUser } = require("../db/services/AuthService");
const config = require("../config");

const signToken = (userid) => jwt.sign({
    iss: 'ManelGonzalez-ops',
    sub: userid,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day
}, config.JWT_SECRET);
const login = async (req, res) => {
    console.log("received");
    if (req.error) {
        return res.status(400).send(req.error);
    }

    const { user } = req;
    const token = signToken(user.userId);

    return res.status(200).send({ token });
};
const comparePassword = (password, hashedPassword) => new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) reject(false);
        resolve(result);
        // if (!result) reject("password is incorrect")
        // if (result) resolve()
    });
});
const protectedRoute = (req, res) => {
    console.log(req.token, "ell tokeeun");
    jwt.verify(req.token, "caranchoa", (err, decoded) => {
        if (err) {
            // if we put send instead of json the error won't be handle by .catch in the frontend, which is a fuckery
            return res.status(400).json("error token not valid");
        }
        return res.status(200).send(decoded);
    });
};
const checkCredentials = (req, res) => {
    console.log(req.token, "ell tokeeun");
    jwt.verify(req.token, "caranchoa", (err, decoded) => {
        if (err) {
            // if we put send instead of json the error won't be handle by .catch in the frontend, which is a fuckery
            return res.status(400).json("error token not valid");
        }
        return res.status(200).send(decoded);
    });
};

const unpackToken = (req, res, next) => {
    console.log(req.method);
    // if (req.method === "GET") { next() }
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(400).send("no authorization headers");
    }
    console.log(bearer, "el bearer");
    const token = bearer.split(" ")[1];
    req.token = token;
    next();
};

const hashPassword = (password) => {
    const saltRounds = 12;
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) { reject(err); }
            bcrypt.hash(password, salt, (err, hashedPwd) => {
                if (err) { reject(err); }
                console.log(hashedPwd, "hashed password");
                resolve(hashedPwd);
            });
        });
    });
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // we have to check that email & username doesn't exists yet
        const hashedPwd = await hashPassword(password);
        const userOkPacket = await storeNewUser({ username, email, hashedPwd });
        const token = signToken(userOkPacket.insertId);
        return res.status(200).send({ token });
    } catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
};

// const deleteUser = async (req, res, next) => {
//     const { signedRequest } = req;
//     const secret = "tuputamadre"
//     bcrypt.hash()
// };

const deleteUser =(req, res, next)=>{
    console.log(req.body, "er facebook body")
}

function base64decode(data) {
    while (data.length % 4 !== 0) {
        data += '=';
    }
    data = data.replace(/-/g, '+').replace(/_/g, '/');
    return new Buffer(data, 'base64').toString('utf-8');
}

function parseSignedRequest(signedRequest, secret) {
    const encoded_data = signedRequest.split('.', 2);
    // decode the data
    const sig = encoded_data[0];
    const json = base64decode(encoded_data[1]);
    const data = JSON.parse(json);
    if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
        throw Error(`Unknown algorithm: ${data.algorithm}. Expected HMAC-SHA256`);
    }
    const expected_sig = crypto.createHmac('sha256', secret).update(encoded_data[1]).digest('base64').replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace('=', '');
    if (sig !== expected_sig) {
        throw Error(`Invalid signature: ${sig}. Expected ${expected_sig}`);
    }
    return data;
}

module.exports = {
    login, protectedRoute, unpackToken, register, checkCredentials, signToken, comparePassword,deleteUser
};
