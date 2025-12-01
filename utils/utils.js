const nodemailer = require('nodemailer');

const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
    })
};

const successResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: true,
        message
    });
};


const sendMail = async (options) => {
    try {
        // CREATE TRANSPORTER 
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // EMAIL OPTIONS 
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: options.email,
            subject: options.message,
            html: `
            <p>Forget Password</p>
            <br/>
            <a href="${options.url}">click to forget password</a>
            <a href="${options.url}">${options.url}</a>
            `
        };

        // SEND EMAIL 
        const info = await transporter.sendMail(mailOptions);
        console.log('info', info);
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    errorResponse,
    successResponse,
    sendMail,
}