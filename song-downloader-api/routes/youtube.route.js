const express = require('express');
const router = express.Router();
const fs = require('fs');
const fsExtra = require('fs-extra')
const path = require('path');
const ytdl = require('ytdl-core');
const JSZip = require('jszip');
const { getInfo } = require('ytdl-getinfo')

router.get('/info', async (req, res) => {
    const url = req.query.url;
    if(url == undefined) res.send('No url provided').status(400);

    let responseData;
    if(url.includes('playlist')) {
        console.log('Getting playlist info');
        const info = await getInfo(url, [], true);
        
        responseData = {
            type: 'playlist',
            title: info.items[0].playlist_title,
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
            type: 'song',
            title: info.items[0].fulltitle,
            url: info.items[0].webpage_url
        }
    }

    res.send(responseData).status(200);
});

router.get('/downloadSingle', async (req, res) => {
    let url = req.query.url;
    const audio = req.query.audio;
    if(url == undefined) res.send('No url provided').status(400);

    const isAudioOnly = audio === 'true';

    if(isAudioOnly) {
        res.header('Content-Disposition', `attachment; filename=song.wav`);
        res.header('Content-Type', 'audio/wav');
        await ytdl(url, { quality: 'highestaudio', format: 'wav', filter: 'audioonly'}).pipe(res);
    } else {
        res.header('Content-Disposition', `attachment; filename=song.mp4`);
        res.header('Content-Type', 'video/mp4');
        await ytdl(url, { quality: 'highest', format: 'mp4'}).pipe(res);
    }
});

router.get('/downloadPlaylist', async (req, res) => {
    res.send('Not implemented yet').status(501);
    // console.log("download playlist");
    // let info = req.query.info;
    // const audio = req.query.audio;
    // if(info == undefined) res.send('No info provided').status(400);

    // info = JSON.parse(info);
    // console.log(info);
    // const isAudioOnly = audio === 'true';

    // if(isAudioOnly) {
    //     res.header('Content-Disposition', 'attachment; filename=playlist.zip');
    //     res.header('Content-Type', 'application/zip');
        
    //     const zip = new JSZip();

    //     for(const video of info.songs) {
    //         console.log("pochvam da teglq pesen " + video.title);
    //         video.title = video.title.replace(/[\\/:"*?<>|]/g, '');
    //         await ytdl(video.url, { quality: 'highestaudio', format: 'wav', filter: 'audioonly'})
    //             .pipe(fs.createWriteStream('./song-cache/' + info.title + '/' + video.title + '.wav'));

    //         console.log("pochvam da zapisvam pesen " + video.title);
    //         console.log(await fs.readdirSync('./song-cache/' + info.title));
    //         const songData = await fs.readFileSync('./song-cache/' + info.title + '/' + video.title + '.wav')
    //         zip.file(video.title + '.wav', songData);
    //     }
    //     console.log("pochvam da zipvam pesenni");
    //     zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    //         .pipe(res)
    //         .on('finish', function () {
    //             fsExtra.remove('../song-cache/' + info.playlistTitle).then(() => {
    //                 console.log('Removed folder ' + info.playlistTitle);
    //         });
    //     });
    // }
});


module.exports = router;