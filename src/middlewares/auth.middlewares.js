const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');


async function authUser(req, res, next){
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({
            Message : "Unauthorized."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

         const user = await userModel.findById(decoded.id);

        req.user = user;

        next();

    } catch (err) {
        res.status(401).json({
            Message : "Unauthorized user"
        })
    }
}

module.exports = {
    authUser
}