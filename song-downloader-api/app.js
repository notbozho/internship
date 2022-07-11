const express = require('express');
const app = express();

const helmet = require('helmet');

app.use(helmet());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});