const User = require('../model/user');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = async(req,res,next)=>{
    try {

        //Get the auth header value

        const bearerHeader = req.headers['authorization'];


        // console.log(req.headers);
        // const {token}  = req.cookies;

        const token = req.headers.authorization.split(" ")[1]
        console.log(token)
        if (!token) {
            return res.status(401).json({
                error: "Please login first",
                success: false
            })
        }
        
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.user._id);

        if(!req.user){
            return res.status(401).json({
                error: "Please login first",
                success: false
            })
        }

        next();
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}