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
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // EMAIL OPTIONS 
        const mailOptions = {
            from: `"Support Team" <${process.env.SMTP_EMAIL}>`,
            to: options.email,
            subject: "Reset Your Password",
            html: `
                <div style="max-width:600px;margin:0 auto;padding:20px;background:#ffffff;font-family:Arial,Helvetica,sans-serif;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.05)">
                    
                    <h2 style="color:#111;text-align:center;margin-bottom:10px">
                    Reset Your Password
                    </h2>

                    <p style="color:#555;font-size:15px;line-height:1.6">
                    Hello,
                    <br/>
                    You requested to reset your account password. Click the button below to proceed.
                    </p>

                    <div style="text-align:center;margin:30px 0">
                    <a href="${options.url}"
                        style="
                        background:#4f46e5;
                        color:#ffffff;
                        text-decoration:none;
                        padding:12px 18px;
                        border-radius:6px;
                        font-weight:600;
                        display:inline-block"
                    >
                        Reset Password
                    </a>
                    </div>

                    <p style="color:#666;font-size:14px">
                    Or copy and paste this link into your browser:
                    </p>

                    <p style="word-break:break-all;color:#2563eb;font-size:14px">
                    ${options.url}
                    </p>

                    <hr style="border:none;border-top:1px solid #eee;margin:25px 0" />

                    <p style="font-size:13px;color:#888;text-align:center">
                    If you didn’t request this reset, you can safely ignore this email.
                    <br/>
                    This link will expire in 10 minutes.
                    </p>

                </div>`
        };


        // SEND EMAIL 
        const info = await transporter.sendMail(mailOptions);
        console.log('info', info);

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    errorResponse,
    successResponse,
    sendMail,
}