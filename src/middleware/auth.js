const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) =>{
    //console.log("Authentication Middleware");
    const token=req.header('Authorization').replace('Bearer ','')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user=await User.findOne({_id : decoded._id, 'tokens.token':token})
    //console.log(user)
    if(!user){
        throw new Error()
    }
    req.user=user
    req.token=token
    next()
}

module.exports = auth