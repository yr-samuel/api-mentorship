const mongoose = require('mongoose');
var Post = require('../models/post.model');


exports.getPosts = async (req, res) => {
    try {
        let posts =  await Post.find(
            { title: { '$regex': `.*${req.query.title}.*`, '$options': 'i' }}
        );

        if(posts) {
            return res.status(202).json(posts);
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }

       
    } catch (error) {
        return res.status('400').send(error);
    }
};

exports.getPostsByUser = async (req, res) => {
    try {

        let posts =  await Post.find(
            { user: req.params.id }
        ).populate(
            {
                path: "user",
                model: "User",
            }
        );

        if(posts) {
            return res.status(202).json(posts);
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }

       
    } catch (error) {
        return res.status('400').send(error);
    }
};

exports.getPost = async (req, res) => {
    try {
        let post = await Post.findById({_id: req.params.id});

        if(post) {
            return res.status(202).json(post);
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }
       
    } catch (error) {
        return res.status(400).send({message: "Post not found."});
    }
};




exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = req.body;

        const postUpdated = await Post.findByIdAndUpdate(mongoose.Types.ObjectId(postId), { $set: post }, { new: true });

        if (postUpdated) {
            return res.status(202).json({ message: "Post Updated", data: postUpdated });
        } else {
            return res.status(400).json({ message: "An error has occured! Post not updated!"});
        }

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await Post.deleteOne({ _id: postId });

        if (deletedPost.n > 0) {
            return res.status(200).json({ message: "Post deleted" });
        } else {
            return res.status(400).json({ message: "Sorry, post not deleted!" });
        }
    } catch (error) {
        return res.status(400).send(error);
    }
};