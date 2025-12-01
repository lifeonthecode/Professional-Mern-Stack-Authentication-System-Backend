const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDatabase = require('./config/db');
const authRouter = require('./routes/user.route');
require('dotenv').config();


// MIDDLEWARES 
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://professional-mern-stack-authenticat.vercel.app', 'http://localhost:5173'],
    credentials: true,
}));


// root route 
app.get('/', (req, res) => {
    res.send({
        message: 'Server is running'
    })
});


app.use('/api/v1/auth', authRouter);


const port = process.env.PORT || 3000;
app.listen(port, async() => {
    await connectDatabase();
    console.log(`Server is running on port:${port}; http://localhost:${port}`);
})