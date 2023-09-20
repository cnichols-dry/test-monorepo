const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
require('dotenv').config();

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors())
app.use(express.json());
// app.use(express.urlencoded({ extended: false }))

mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@${process.env.MONGO_ATLAS_CLUSTER}/${process.env.MONGO_DB_NAME}`,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log('Connected to Databse');
}).catch(()=>{
  console.log("Connection failed!");
  process.exit();
});

app.use('/api/books',booksRoutes);
app.use('/api/user',userRoutes);

module.exports = app;
