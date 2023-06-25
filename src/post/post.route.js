const { Post } = require('./post.model');
const { Router } = require('express');
const { hasRole } = require('../auth/auth.route');
const { Roles } = require('../role/role.model');
const app = Router();

app.get('/', hasRole(Roles.ADMIN), async (req, res) => {
    const posts = await Post.findAll();
    return res.json(posts);
});

app.post('/', hasRole(Roles.ADMIN), (req, res) => {
    const post = new Post();
    post.topic = "Hi";
    post.save();
    res.status(201).json("Post created");
});
module.exports = app;