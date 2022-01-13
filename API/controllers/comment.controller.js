const mongoose = require('mongoose');
var Comment = require('../models/comment.model');


exports.getComments = async (req, res) => {
    try {
        let comments =  await Comment.find({});

        if(comments) {
            return res.status(202).json(comments);
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }

       
    } catch (error) {
        return res.status('400').send(error);
    }
};

exports.getPostComments = async (req, res) => {
    try {
        let comments =  await Comment.find({post: req.params.post}).populate([
            {
                path: "user",
                model: "User",
            },
            {
                path: 'post',
                model: "Post",
            }
        ]);

        if(comments) {
            return res.status(202).json(comments);
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }

       
    } catch (error) {
        return res.status('400').send(error);
    }
};

exports.getComment = async (req, res) => {
    try {
        let comment = await Comment.findById({_id: req.params.id});

        if(comment) {
            return res.status(202).json(comment);
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }
       
    } catch (error) {
        return res.status(400).send({message: "Comment not found."});
    }
};

exports.updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;

        const comment = req.body;

        const commentUpdated = await Comment.findByIdAndUpdate(mongoose.Types.ObjectId(commentId), { $set: comment }, { new: true });

        if (commentUpdated) {
            return res.status(202).json({ message: "Comment Updated", data: commentUpdated });
        } else {
            return res.status(400).json({ message: "An error has occured! Comment not updated!"});
        }

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const deletedComment = await Comment.deleteOne({ _id: commentId });

        if (deletedComment.n > 0) {
            return res.status(200).json({ message: "Comment deleted" });
        } else {
            return res.status(400).json({ message: "Sorry, comment not deleted!" });
        }
    } catch (error) {
        return res.status(400).send(error);
    }
};