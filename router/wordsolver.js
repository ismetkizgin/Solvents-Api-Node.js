const express = require('express');
const router = express();
const wordSolver = require('../solvent/wordsolver');

function getTrim(letter){
    return letter.trim();
}

router.get("/wordsolver/:letters", async (req, res) => {
    const letters = req.params.letters.replace('[', '').replace(']', '').trim().split(',');
    const word = await wordSolver(letters.map(getTrim));
    res.send(word);
});

module.exports = router;