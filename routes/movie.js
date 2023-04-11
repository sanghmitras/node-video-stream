var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  let range = req.headers.range
  if(!range){
    res.status(400).send('range not found')
  }
  const videoPath = './kantara-hindi.mp4'
  const videoSize = fs.statSync(videoPath).size
  const CHUNK_SIZE = 10**6 // 1Mb

  // or Number(range.split("-")[0])
  const start = Number(range.replace(/\D/g, ""))
  
  const end = Math.min(start+CHUNK_SIZE, videoSize-1)
  const contentLength = end - start +1;
  // Range,Accept Ranges, CLength, CType-> CR-AR-CL-CT
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": 'bytes',
    "Content-Length": contentLength,
    "Content-Type": "video/mp4"
  }
  res.writeHead(206, headers);
  // console.log('start', start,end, range, headers)
  const videoStream = fs.createReadStream(videoPath, {start, end})
  // console.log('file size',  videoSize)
  videoStream.pipe(res)

});

module.exports = router;
