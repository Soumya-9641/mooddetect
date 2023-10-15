const express= require('express');
require("./db/connection");
const cors = require('cors');
const app= express();
const user= require("./router/user")
const admin= require("./router/admin")
const response= require("./router/response")
app.use(express.json())
app.use(cors());
app.use("/user",user);
app.use("/admin",admin);
app.use("/response",response);
app.get("/",(req,res)=>{
    res.send("hello world");
})

app.listen(5000,()=>{
    console.log("app is running on port 5000");
})