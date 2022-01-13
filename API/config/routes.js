var express = require('express');
var router = express.Router();

const userRouter = require('../routes/user.router');
const postRouter = require('../routes/post.router');
const CommentRouter = require('../routes/comment.router');
const adminRouter = require('../routes/admin.router');

module.exports = (app) => {
    app.use("/api/users", userRouter);
    app.use("/api/post", postRouter);
    app.use("/api/comment", CommentRouter);
    app.use("/api/admin", adminRouter);

    app.get("/", function(req, res) {
        res.set('content-type', 'text/html');
        res.send('Great! It works. Welcome to MERN API!');
    })
};