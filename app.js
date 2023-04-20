const express = require('express');
const app = express();

const path = require('path');
const pages = path.join(__dirname,'pages');
app.use(express.static(pages,{extensions:['html']}));
app.use(express.urlencoded({extended:true}));

const mongoose = require('mongoose');
var url = "mongodb+srv://BrianKK:kKb.56.89@locatedb.9mqgp10.mongodb.net/locateDB";
mongoose.set('strictQuery', false);
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

const mustache = require('mustache-express');
app.engine('mustache',mustache());
app.set('view engine','mustache');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

require('dotenv').config();

const router = require('./routes/routes');
app.use('/',router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Application running on port 3000. Click 'ctrl^c' to quit.");
});