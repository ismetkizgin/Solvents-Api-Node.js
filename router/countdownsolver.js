const express = require('express');
const router = express();
const countdownsolver = require('../solvent/countdownsolver');


router.get("/countdownsolver", async (req, res) => {
    const numbers = req.body.numbers.replace('[', '').replace(']', '').trim().split(',');
    const target = parseInt(req.body.target.trim());
    const result = await countdownsolver(numbers.map(Number), target);
    res.send(result);
});

module.exports = router;