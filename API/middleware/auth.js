const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const authConfig = require('../config/config');
const RequestStatus = require('../utils/requestStatus');
const TokenBlacklist = require('../blacklist-token/blacklist.model');


const _checkUserToken = async (userToken) => {
    let decoded = await jwt.verify(userToken, authConfig.secret);
    if (!decoded.params.id) {
        throw Error('Invalid token!');
    } else {
        // const userId = decoded.params.id;
        // return userId;

        const idDecoded = decoded.params.id;
        const _verificaUsuarioBlackList = async function (token) {
            const verify = await TokenBlacklist.findOne({ token: token });
            return verify;
        };

        if (await _verificaUsuarioBlackList(userToken)) {
            throw Error('Sorry! Your session has expired!');
        }

        return idDecoded;
    }

};

const _getUserId = async (authHeader) => {
    if (!authHeader) {
        throw new Error('Token not informed!');
    }
    const parts = authHeader.split(' ');
    if (!parts.length === 2)
        throw Error('Token error!');
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        throw Error('Invalid token format!');
    }
    console.log(token);
    return await _checkUserToken(token);
};

const _getUserPermissions = async (user) => {
    const userPermissions = [];
    if (user["__t"] && user["__t"] == 'ADMIN') {
        userPermissions.push("ADMIN");
    }
    return userPermissions;
};

const _checkIfUserHavePermission = (userPermissions, routerPermissions) => {
    let havePermission = false;
    const routerPermissionLength = routerPermissions.length;
    let index = 0;
    while (!havePermission && index < routerPermissionLength) {
        const permission = routerPermissions[index];
        havePermission = userPermissions.indexOf(permission) >= 0;
        index++;
    }
    // if (!havePermission) throw Error("The user doesn't have permission to access.");
};


const authMiddleware = (permissions) => {
    return async function (req, res, next) {
        try {

            const authHeader = req.headers.authorization;
            const _userId = await _getUserId(authHeader);
            const user = await User.findOne({ _id: _userId });

            if (!user) throw Error("The user does not exist");

            const userPermissions = await _getUserPermissions(user);

            await _checkIfUserHavePermission(userPermissions, permissions)

            req.userPermissions = userPermissions;
            console.log('user', _userId);
            req.userId = _userId;
            req.user = user;
            return next();

        } catch (err) {
            return res.status(RequestStatus.UNAUTHORIZED).json({ message: err.message });
        }
    };
};

module.exports = authMiddleware;