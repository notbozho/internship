const express = require('express');
const app = express();

const helmet = require('helmet');

const youtubeRouter = require('./routes/youtube.route');
const spotifyRouter = require('./routes/spotify.route');

app.use(helmet());

app.use('/api/v1/youtube', youtubeRouter);
app.use('/api/v1/spotify', spotifyRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(5000, () => {
    console.log('Song Downloader API listening on port 5000!');
});