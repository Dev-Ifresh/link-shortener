const express = require('express');
const User = require('../model/user');

const router = express.Router();

const { sign_up,
login}             = require("../controller/user.controller")


router.post('/register', sign_up)
router.post('/login', login )
    


module.exports = router;