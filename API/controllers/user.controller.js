const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const RequestStatus = require('../utils/requestStatus');
const TokenBlacklist = require('../blacklist-token/blacklist.model');
var User = require('../models/user.model');

function generateToken(params = {}) {
    return jwt.sign({ params }, config.secret, {
        expiresIn: config.timer
    });
};


exports.getUsers = async (req, res) => {
    try{
        let users = await User.find({});

        if(users) {
            return res.status(202).json(users);
        }else {
            return res.status(400).json({message: 'An error has occured!'});
        } 
        
        
    }catch (error) {
        return res.status('400').send(error);
    }

};

exports.getUser = async (req, res) => {
    try {
        let user = await User.findById({_id: req.params.id});

        if(user) {
            return res.status(202).json(user);
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }
       
    } catch (error) {
        return res.status(400).send({message: "User not found."});
    }
};


exports.createUser = async (req, res) => {
    try {
        var user = req.body;

        const newUser = await User.create(user);
        newUser.password = undefined;

        if(newUser) {
            return res.status(201).send({ message: "User created!", data: newUser });
        } else {
            return res.status(400).send({ message: "An error has occured! User not created!" });
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = req.body;

        const userUpdated = await User.findByIdAndUpdate(mongoose.Types.ObjectId(usertId), { $set: user }, { new: true });

        if (userUpdated) {
            return res.status(202).json({ message: "User Updated", data: userUpdated });
        } else {
            return res.status(400).json({ message: "An error has occured! User not updated!"});
        }

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.deleteOne({ _id: userId });

        if (deletedUser.n > 0) {
            return res.status(200).json({ message: "User deleted" });
        } else {
            return res.status(400).json({ message: "Sorry, user not deleted!" });
        }
    } catch (error) {
        return res.status(400).send(error);
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ message: 'Invalid password! Try again!' });
        }
        user.password = undefined;
        return res.send({ message: "Welcome "+ user.email, data: user, token: generateToken({ id: user.id }) });
    } catch (err) {
        return res.status(400).send(err.message);
    }
};

exports.logout = async (req, res) => {
    const token = req.headers.authorization;

    if (!token)
        return res.status(RequestStatus.BAD_REQUEST).json({ message: "Nenhum token fornecido!" });

    if (!await TokenBlacklist.findOne({ token: token })) {
        await TokenBlacklist.create({ token });
        return res.status(RequestStatus.OK).json({ message: "Logout realizado!" });
    } else {
        return res.status(RequestStatus.NOT_MODIFIED).json({ message: "Logout já realizado!" });
    }
};