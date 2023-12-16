import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { userRoute } from './routes/user.route';
import { postRoute } from './routes/post.route';
import { reactionRoute } from './routes/reaction.route';
import { authRoute } from './routes/auth.route';
import { authentication } from './utils/auth.util';
import { config } from './conf/common.conf';
import { commentRoute } from './routes/comment.route';
import { getLogger } from './conf/logger.conf';
import { friendRoute } from './routes/friend.route';
import { suggestionRouter } from './routes/suggestion.route';

const app: Application = express();

//middlewares
app.use( express.json() );
app.use( cookieParser() );
app.use( cors( config.CORS_CONFIG ) );

//auth route
app.use( authentication );

//routes
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use("/posts", postRoute);
app.use("/reactions", reactionRoute);
app.use("/comments", commentRoute);
app.use("/friends", friendRoute);
app.use("/suggestions", suggestionRouter);


app.listen(config.SERVER_PORT, async () =>
{
    getLogger().info(`Server is up & running on port ${config.SERVER_PORT}`);
});