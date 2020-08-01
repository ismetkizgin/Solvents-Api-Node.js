require('dotenv/config');
const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const path = require('path');
const routers = require('./routers');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routers.wordsolver);
app.use(routers.countdownsolver);

app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname+'/public/index.html'));
})

app.use((req, res, next) => {
    res.send("404 NOT FOUND");
})

app.listen(PORT, () => {
    console.log("Ready on http://localhost:" + PORT)
})