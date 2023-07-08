const express = require("express");
const urlRouter =  express.Router();

const { general_short,
    login_short,
    get_Url,
    getMyUrl,
    viewUrl
         } = require("../controller/url.controller");

const { isAuthenticated } = require("../authentication/authentication")



urlRouter.post("/api/url",general_short); 
urlRouter.post("/api/url/v1", isAuthenticated, login_short);
urlRouter.get("/api/urls", isAuthenticated, getMyUrl);
urlRouter.get("/api/view/:shorturl", isAuthenticated, viewUrl);
urlRouter.get("/:shorturl", get_Url);


module.exports = urlRouter