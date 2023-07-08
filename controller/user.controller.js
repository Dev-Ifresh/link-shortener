const express = require('express');
const UserModel = require("../model/user");
const jwt = require("jsonwebtoken");
const config = require('../config/config')
// require('dotenv').config();


const createToken = function(user){
    const payload = { user }

    const token = jwt.sign(payload, config.JWT_SECRET,{
        expiresIn: config.JWT_EXPIRY_TIME,
    })
    return token;
}

exports.sign_up = async (req,res, next) => {
        try {
        
            const { firstname, lastname, email, password} = req.body;
            const user = await UserModel.create({
                firstname,
                lastname,
                email,
                password
            });
        
            user.password = undefined;
            const token = createToken(user)
            return res.status(201).json({
                staus: "success",
                token,
                data: {
                    user,
                },
            });
            
        } catch (error) {
            return next(error);
            
        }
        };
        

        exports.login = async (req,res, next) => {
        try {
        
            const { email, password} = req.body;
            const user = await UserModel.findOne({ email });
    
                    if (!user) {
                        return next( new Error ('User not found'));
                    }
    
                    const validate = await user.toCheckPassword(password);
    
                    if (!validate) {
                        return next ( new Error ('Wrong Password'));
                    }
    
                    // return next('Logged in Successfully');
        
            user.password = undefined;
            const token = createToken(user)
            return res.status(201).json({
                staus: "success",
                token,
                data: {
                    user,
                },
            });
            
        } catch (error) {
            return next(error);
            
        }
        };
    
