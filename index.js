require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const router = require('./app/routers/router');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static(path.join(__dirname, 'assets')));

app.use(express.urlencoded({ extended: false }));

app.use(router);

app.listen(port, () => {
    console.log(`${process.env.BASE_URL}:${port}`);
});
