const express = require('express');
const app = express();

const helmet = require('helmet');

const downloadSongRouter = require('./routes/downloadSong.route');

app.use(helmet());

app.use('/download-song', downloadSongRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});