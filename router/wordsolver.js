const express = require('express');
const router = express();
const wordSolver = require('../solvent/wordsolver');

function getTrim(letter){
    return letter.trim();
}

function getTurkishLetter(letter){
    return letter.replace('%C3%96','Ö').replace('%C5%9E','Ş').replace('%C4%9E','Ğ').replace('%C4%B0','İ').replace('%C3%9C','Ü');
}

router.get("/wordsolver/:letters", async (req, res) => {
    const letters = req.params.letters.replace('[', '').replace(']', '').trim().split(',');
    const word = await wordSolver(letters.map(getTurkishLetter).map(getTrim));
    res.send(word);
});

module.exports = router;