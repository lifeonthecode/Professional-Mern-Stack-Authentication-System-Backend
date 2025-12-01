const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { errorResponse, successResponse, sendMail } = require('../utils/utils');
const User = require('../models/user.model');




// USER CREATE: // POST METHOD
const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return errorResponse(res, 404, 'Please Name, Email & Password Required!')
        };

        const user = await User.findOne({ email });
        if (user) {
            return errorResponse(res, 400, 'Already user is exists');
        };

        const hashPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashPassword,
        });

        return successResponse(res, 202, 'User successfully registered!')

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
};


const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return errorResponse(res, 404, 'Please Email & Password Required!')
        };

        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 404, 'User not found! Please Register')
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return errorResponse(res, 404, 'Invalid password!');
        }

        const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: '24h'
        });

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return successResponse(res, 200, 'Logged user successfully');

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
};


const userLogout = async (req, res) => {
    try {
        console.log('logout called')
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return res.status(200).json({
            success: true,
            message: 'Logout successfully'
        })
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}


const me = async(req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        return res.status(200).json({
            success: true,
            message: 'Fetched user',
            user
        })
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
};



const forgetPassword = async(req, res) => {
    try {
        const {email} = req.body;
        if(!email) {
            return errorResponse(res, 404, "Email required!")
        };

        const user = await User.findOne({email});
        if(!user) {
            return errorResponse(res, 404, 'User not found')
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashToken;
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000 // 1hour
        await user.save();
        
        const resetUrl = `https://professional-mern-stack-authenticat.vercel.app/reset-password/${resetToken}`;

        const mailOptions = {
            email: user.email,
            message: 'Reset Your Password',
            url: resetUrl
        }
        await sendMail(mailOptions);

        return successResponse(res, 200, 'Password reset link sent to your email!');

        
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
};



const resetPassword = async (req, res) => {
     try {
        const {token} = req.params;
        const {password} = req.body;
        if(!token || !password) {
            return errorResponse(res, 404, "Token & Password required!")
        };


        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {$gt: Date.now()}
        });
        if(!user) {
            return errorResponse(res, 404, 'Token invalid or expired!')
        }

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        await user.save();


        return successResponse(res, 200, 'Password reset successfully');

        
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
};


module.exports = {
    userRegister,
    userLogin,
    userLogout,
    me,
    forgetPassword,
    resetPassword,
}