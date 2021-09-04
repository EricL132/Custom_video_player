const express = require('express')
const app = express()
const apiRoute = require('./Routes/api')

app.use('/api',apiRoute)

app.listen(9000,()=>{
    console.log("Listening to port 9000")
})

