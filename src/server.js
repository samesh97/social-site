const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors');

const { userRoute } = require("./routes/user.route");
const { postRoute } = require("./routes/post.route");
const { reactionRoute } = require('./routes/reaction.route');
const { authRoute } = require("./routes/auth.route");
const { authentication } = require("./utils/auth.util");
const { config } = require("./configurations/common.conf");

const app = express();

//middlewares
app.use( express.json() );
app.use( cookieParser() );
app.use( cors( config.CORS_CONFIG ) );

//auth route
app.use( authentication );

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use("/posts", postRoute);
app.use("/reactions", reactionRoute);


app.listen(config.SERVER_PORT, async () =>
{
    console.log(`Server is up & running on port ${config.SERVER_PORT}`);
});