const express = require('express');

const {
  globalErrorHandler
} = require('./controllers/error.controller');

// Routers
const { actorsRouter } = require('./routes/actors.routes');
const { moviesRouter } = require('./routes/movies.routes');
const { usersRouter } = require('./routes/users.routes');
const {
  reviewsRouter
} = require('./routes/reviews.routes');
const {
  actorinMoviesRouter
} = require('./routes/actorsinMovie.routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints
app.use('/api/v1/actors', actorsRouter);
app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/actorsinmovies', actorinMoviesRouter);

app.use(globalErrorHandler);

module.exports = { app };
