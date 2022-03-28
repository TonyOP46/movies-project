const { ref, uploadBytes} = require('firebase/storage');

// Models
const { Movies } = require('../models/movies.model');
const { Actors } = require('../models/actors.model');
const { Reviews } = require('../models/reviews.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { storage } = require('../util/firebase');

exports.createNewMovie = catchAsync(
  async (req, res, next) => {
    const { title, description, duration, rating, genre } =
      req.body;

    if (
      !title ||
      !description ||
      !duration ||
      !rating ||
      !genre
    ) {
      return next(
        new AppError(
          400,
          'Must provide a valid title, description, duration, rating, genre'
        )
      );
    }

    const imgRef = ref(
      storage,
      `imgs/${Date.now()}-${req.file.originalname}`
    );
    const result = await uploadBytes(
      imgRef,
      req.file.buffer
    );

    const newMovies = await Movies.create({
      title,
      description,
      duration,
      rating,
      img: result.metadata.fullPath,//userId: req.currentUser.id,
      genre
    });

    res.status(201).json({
      status: 'success',
      data: { newMovies }
    });
  }
);
exports.getAllMovies = catchAsync(
  async (req, res, next) => {
    const movies = await Movies.findAll({
      where: { status: 'active' },
     /* inclide: [{ model: Reviews }, { model: Actors }]*/
    });
    res.status(200).json({
      status: 'sucess',
      data: { movies }
    });
  }
);
exports.getMoviesById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    const movies = await Movies.findOne({ where: { id } });

    if (!movies) {
      return next(new AppError(404, 'Movie not found'));
    }

    res.status(200).json({
      status: 'success',
      data: { movies }
    });
  }
);
exports.updateMovie = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { title, description, duration, genre } = req.body;
  const data = {
    title,
    description,
    duration,
    genre
  };
  const movies = await Movies.findOne({
    where: { id: id, status: 'active' }
  });

  if (!movies) {
    return next(
      new AppError(404, 'Cant update movie, invalid ID')
    );
  }

  await movies.update({ ...data });

  res.status(204).json({ status: 'success' });
});
exports.deleteMovie = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const movies = await Movies.findOne({
    where: { id: id, status: 'active' }
  });

  if (!movies) {
    return next(
      new AppError(404, 'Cant delete movies, invalid ID')
    );
  }
  await movies.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});
