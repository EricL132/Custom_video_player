require('dotenv').config()
const PORT = process.env.PORT || 8000
const express = require('express')
const app = express()
const apiRoute = require('./Routes/api')
const path = require('path')

app.use('/api',apiRoute)

app.use(express.static(path.join(__dirname, '/front/build')))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname + '/front/build/index.html'));
})
app.listen(PORT,()=>{
    console.log("Server on port: "+PORT)
})

