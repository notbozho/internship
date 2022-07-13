const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const { getInfo } = require('ytdl-getinfo')

router.get('/info', async (req, res) => {
    const url = req.query.url;
    if(url == undefined) res.send('No url provided').status(400);

    let responseData;
    if(url.includes('playlist')) {
        console.log('Getting playlist info');
        const info = await getInfo(url, [], true);
        
        responseData = {
            playlistTitle: info.items[0].playlist_title,
            songs: []
        }

        info.items.forEach(item => {
            responseData['songs'].push({
                title: item.fulltitle,
                url: item.webpage_url
            })
        });
    } else {
        console.log('Getting song info');
        const info = await getInfo(url);
        responseData = {
            title: info.items[0].fulltitle,
            url: info.items[0].webpage_url
        }
    }
    res.send(responseData).status(200);
});

router.get('/downloadSingle', async (req, res) => {
    const url = req.query.url;
    const audio = req.query.audio;
    if(url == undefined) res.send('No url provided').status(400);

    const isAudioOnly = audio === 'true';

    console.log(url);

    if(isAudioOnly) {
        res.header('Content-Disposition', 'attachment; filename=audio.wav');
        res.header('Content-Type', 'audio/wav');
        await ytdl(url, { quality: 'highestaudio', format: 'wav', filter: 'audioonly'}).pipe(res);
    } else {
        res.header('Content-Disposition', 'attachment; filename=video.mp4');
        res.header('Content-Type', 'video/mp4');
        await ytdl(url, { quality: 'highest', format: 'mp4'}).pipe(res);
    }
});

router.get('/downloadPlaylist', async (req, res) => {
    const url = req.query.url;
    const audio = req.query.audio;
    if(url == undefined) res.send('No url provided').status(400);

    const isAudioOnly = audio === 'true';

    if(isAudioOnly) {
        res.header
    }
});


module.exports = router;