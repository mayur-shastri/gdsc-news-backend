require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./Routes/Authentication/auth');
const getUserDataRoute = require('./Routes/User/getSelfData');
const getUserProfileRoute = require('./Routes/User/viewUserProfile');
const commentRoutes = require('./Routes/Comments/comments');
const storyRoutes = require('./Routes/Story/story');

// connecting to mongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((err)=>{
        console.log("Failed to connect to MongoDB", err);
    });

const app = express();

const corsOptions = {
    origin: process.env.FRONT_END_URL, //only front-end can talk to the server
    credentials: true, // allow cookies to be sent
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// routes
app.use('/', authRoutes);
app.use('/', getUserDataRoute);
app.use('/', getUserProfileRoute);
app.use('/', commentRoutes);
app.use('/', storyRoutes);

app.get('/', (req,res)=>{
    res.send("Hello from the homepage");
});

app.use((err,req,res,next)=>{
    const {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).send(message);
});

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Server is running on port 3000...");
});