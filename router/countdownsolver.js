const express = require('express');
const router = express();
const countdownsolver = require('../solvent/countdownsolver');


router.get("/countdownsolver/:numbers/:target", async (req, res) => {
    const numbers = req.params.numbers.replace('[', '').replace(']', '').trim().split(',');
    const target = parseInt(req.params.target.trim());
    const result = await countdownsolver(numbers.map(Number), target);
    res.send(result);
});

module.exports = router;