const express = require('express');
const mongoose = require('mongoose');

const app = express();

// connecting to mongoDB

app.listen(3000, ()=>{
    console.log("Server is running on port 3000...");
});