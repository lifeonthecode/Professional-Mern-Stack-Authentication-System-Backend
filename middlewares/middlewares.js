const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/utils');


const authMiddleware = async(req, res, next) => {
    try {

        const token = req.cookies.accessToken;
        if(!token) {
            return errorResponse(res, 401, 'Unauthorized! token missing')
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

        req.user = decoded;

        next()
        
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
};


module.exports = {
    authMiddleware,
}