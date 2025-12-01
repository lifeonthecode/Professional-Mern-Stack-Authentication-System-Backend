const express = require('express');
const { authMiddleware } = require('../middlewares/middlewares');
const { me, userRegister, userLogin, forgetPassword, resetPassword, userLogout } = require('../controllers/user.controller');

const authRouter = express.Router();

authRouter.get('/me', authMiddleware, me);
authRouter.post('/register', userRegister);
authRouter.post('/login', userLogin);
authRouter.post('/logout', authMiddleware, userLogout);
authRouter.post('/forget-password', forgetPassword);
authRouter.post('/reset-password/:token', resetPassword);

module.exports = authRouter;
