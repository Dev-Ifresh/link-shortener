const express = require ("express");
const bodyParser = require("body-parser");

const authRouter = require("../backend/routes/user.routes")
const urlRouter = require("../backend/routes/url.routes")

const config = require ("../backend/config/config");
const PORT = config.PORT;


const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json());



app.get ("/", (req, res)=>{
    console.log("Hello Server")
    res.send("Welcome Server")
})

app.use("/", authRouter);
app.use("/", urlRouter);


require ("../backend/db").connectToMongoDB();

app.listen( PORT|| "port",() => {

    console.log(`Server has started ${PORT}`);
})
