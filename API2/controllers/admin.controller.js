const mongoose = require('mongoose');
var Comment = require('../models/comment.model');
var Post = require('../models/post.model');
var User = require('../models/user.model');

exports.createComment = async (req, res) => {
    try {
        var comment = req.body;
        
        if(!req.body.user) {
            return res.status(400).send({ message: "An error has occured! User not informed!" });
        }else {
            if(!req.body.user){
                return res.status(400).send({ message: "An error has occured!  User not informed!" });
            }
        }
        const user = await User.findById({_id: req.body.user});
        if(user) {
            if(!user.admin){
                return res.status(400).send({ message: "An error has occured!  The user must be informed!" });
            }
        }else {
            return res.status(400).send({ message: "An error has occured!  User not found!" });
        }

        const newComment = await Comment.create(comment);

        if(newComment) {
            return res.status(202).send({ message: "Comment saved!", data: newComment });
        } else {
            return res.status(400).send({ message: "An error has occured! Comment not created!" });
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

exports.createPost = async (req, res) => {
    try {
        var post = req.body;

        if(!req.body.user) {
            return res.status(400).send({ message: "An error has occured! User not informed!" });
        }else {
            if(!req.body.user){
                return res.status(400).send({ message: "An error has occured!  User not informed!" });
            }
        }
        const user = await User.findById({_id: req.body.user});
        if(user) {
            if(!user.admin){
                return res.status(400).send({ message: "An error has occured!  The user must be informed!" });
            }
        }else {
            return res.status(400).send({ message: "An error has occured!  User not found!" });
        }
       

        const newPost = await Post.create(post);

        if(newPost) {
            return res.status(202).send({ message: "Post saved!", data: newPost });
        } else {
            return res.status(400).send({ message: "An error has occured! Post not created!" });
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
};