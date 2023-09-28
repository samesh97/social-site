const { Router } = require('express');
const postRoute = Router();

postRoute.post('/', async (req, res, next) => {
    return res.json('Hello world');
});

module.exports = { postRoute };