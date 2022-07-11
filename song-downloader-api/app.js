const express = require('express');
const app = express();

const helmet = require('helmet');

const downloadYoutubeRouter = require('./routes/downloadYoutube.route');
const downloadSpotifyRouter = require('./routes/downloadSpotify.route');

app.use(helmet());

app.use('/downloadYoutube', downloadYoutubeRouter);
app.use('/downloadSpotify', downloadSpotifyRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});