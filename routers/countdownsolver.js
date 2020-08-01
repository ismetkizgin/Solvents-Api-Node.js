const express = require('express');
const router = express();
const { countdownSolver } = require('../solvent');

router.post("/countdownsolver", async (req, res) => {
    const numbers = req.body.numbers.replace('[', '').replace(']', '').trim().split(',');
    const target = parseInt(req.body.target);
    const result = await countdownSolver(numbers.map(Number), target);
    res.send(result);
});

module.exports = router;