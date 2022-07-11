const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const path = require('path');
const Spotify = require('spotifydl-core').default
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const credentials = {
    clientId: "cef3063f69524e5c83e07b6c960a51a7",
    clientSecret: "06a8d71512d24d8c8642a6f050a5b346"
}
const spotify = new Spotify(credentials);

router.get('/', async (req, res) => {
    const songUrl = req.query.songUrl;
    if(songUrl == undefined) res.send('No song url provided').status(400);

    const song = await spotify.getTrack(songUrl);
    const songData = await spotify.downloadTrackFromInfo(song);
    fs.writeFile(`./song-cache/${song.name}.wav`, songData).then(() => {
        console.log(`${song.name} saved`);
        res.sendFile(path.resolve(`./song-cache/${song.name}.wav`));
        fs.remove(`./song-cache/${song.name}.wav`).then(() => {
            console.log('Removed file ' + song.name + '.wav');
        });
    }).catch(err => {
        console.log(err);
        res.send("Error occurred while downloading the song").status(500);
    });
});

module.exports = router;