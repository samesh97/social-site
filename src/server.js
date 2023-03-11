const express = require('express');
const userRoute = require('./user/user.route');
const postRoute = require('./post/post.route');
const { authentication, authRoute } = require('./auth/auth.route');
const { } = require('./database');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.SERVER_PORT;
const app = express();
app.use( express.json() );
app.use(
  cors({
    origin: ["http://localhost:4200/"],
    methods: ["GET","PUT","POST","DELETE","UPDATE","PATCH"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

//authenticate
app.use(authentication);

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/posts', postRoute);

app.listen(PORT, (req, res) => {
    console.log(`Server is up & running on port ${PORT}`);
});