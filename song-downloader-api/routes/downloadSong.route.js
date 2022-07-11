const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');

router.get('/', (req, res) => {
    const videoId = req.query.id;
    const audio = req.query.audio;
    if(videoId == undefined) res.send('No video id provided').status(400);

    const isAudioOnly = audio === 'true';

    if(isAudioOnly) {
        res.header('Content-Disposition', 'attachment; filename=audio.wav');
        res.header('Content-Type', 'audio/wav');
        ytdl(videoId, { quality: 'highestaudio', format: 'wav', filter: 'audioonly'}).pipe(res);
    } else {
        res.header('Content-Disposition', 'attachment; filename=video.mp4');
        res.header('Content-Type', 'video/mp4');
        ytdl(videoId, { quality: 'highest', format: 'mp4'}).pipe(res);
    }
});

module.exports = router;