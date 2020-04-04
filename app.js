const express = require('express');
//const CompanyControl = require('./CompanyExpress');
var bodyParser = require('body-parser');

const PORT = 3000 || process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(CompanyControl);

app.get("/", (req, res, next) => {
    res.send("OK!");
})

app.use((req, res, next) => {
    res.send("404 NOT FOUND");
})
app.listen(PORT, () => {
    console.log("Ready on http://localhost:" + PORT)
});