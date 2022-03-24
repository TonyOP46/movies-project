const express = require('express');

const { actorRouter} = require('./routes/actor.routes');
const { userRouter } = require('./routes/users.routes');
const { movieRouter } = require('./routes/movies.routes');

const { AppError } = require('./util/appError');

const app = express();

app.use('/api/v1/posts', actorRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/comments', movieRouter);




module.exports = { app };