const express = require('express');
const router = express();
const { countdownSolver } = require('../solvent');

router.get("/countdownsolver", async (req, res) => {
    const numbers = req.body.numbers.replace('[', '').replace(']', '').trim().split(',');
    const target = parseInt(req.body.target.trim());
    const result = await countdownSolver(numbers.map(Number), target);
    res.send(result);
});

module.exports = router;