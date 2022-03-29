// Models
const {
  ActorsinMovie
} = require('../models/actorsinMovie.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');

exports.createNewActorinMovies = catchAsync(
  async (req, res, next) => {
    const { actorId, movieId } = req.body;

    if (!actorId || !movieId) {
      return next(
        new AppError(
          400,
          'Must provide a valid actorId, movieId'
        )
      );
    }
    const newActorinMovies = await ActorsinMovie.create({
      actorId,
      movieId
    });

    res.status(201).json({
      status: 'success',
      data: { newActorinMovies }
    });
  }
);
exports.getAllActorinMovies = catchAsync(
  async (req, res, next) => {
    const actorsinMovie = await ActorsinMovie.findAll({
      where: { status: 'active' }
    });

    if (!actorsinMovie) {
      return next(
        new AppError(404, 'ActorsinMovie not found')
      );
    }

    res.status(200).json({
      status: 'sucess',
      data: { actorsinMovie }
    });
  }
);
exports.getActorinMoviesById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const actorsinMovie = await ActorsinMovie.findOne({
      where: { id }
    });

    if (!actorsinMovie) {
      return next(
        new AppError(404, 'actorsinMovie not found')
      );
    }
    res.status(200).json({
      status: 'success',
      data: { actorsinMovie }
    });
  }
);
exports.updateActorinMovie = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    const { actorId, movieId } = req.body;
    const data = {
      actorId,
      movieId
    };
    const actorsinMovie = await ActorsinMovie.findOne({
      where: { id: id, status: 'active' }
    });

    if (!actorsinMovie) {
      return next(
        new AppError(
          404,
          'Cant update ActorsinMovie, invalid ID'
        )
      );
    }

    await reviews.update({ ...data });

    res.status(204).json({ status: 'success' });
  }
);
exports.deleteActorinMovie = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const actorsinMovie = await ActorsinMovie.findOne({
      where: { id: id, status: 'active' }
    });

    if (!actorsinMovie) {
      return next(
        new AppError(
          404,
          'Cant delete actorsinMovie, invalid ID'
        )
      );
    }
    await actorsinMovie.update({ status: 'deleted' });

    res.status(204).json({ status: 'success' });
  }
);
