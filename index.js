require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/Authentication/auth');
const getUserDataRoute = require('./Routes/User/getUserData');

// connecting to mongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((err)=>{
        console.log("Failed to connect to MongoDB", err);
    });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/', authRoutes);
app.use('/', getUserDataRoute);

app.get('/', (req,res)=>{
    res.send("Hello from the homepage");
});

app.listen(3000, ()=>{
    console.log("Server is running on port 3000...");
});