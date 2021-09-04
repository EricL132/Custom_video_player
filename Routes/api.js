const router = require("express").Router()
const fs = require("fs")
router.get('/video',(req,res)=>{
    const range = req.headers.range
    if(!range) return res.status(400).send("Requires range header")
    const videoPath = './test.mp4'
    const videoSize = fs.statSync(videoPath).size
    const downloadSize = 1000000
    const start = Number(range.replace(/\D/g,""))
    const end = Math.min(start+downloadSize,videoSize-1)
    const contentLength = end - start + 1
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges':'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
    }

    res.writeHead(206,headers)
    const videoStream = fs.createReadStream(videoPath,{start,end})
    videoStream.pipe(res)
})




module.exports = router