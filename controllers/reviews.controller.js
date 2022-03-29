// Models
const { Movies } = require('../models/movies.model');
const { Users } = require('../models/users.model');
const { Reviews } = require('../models/reviews.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');

exports.createNewReview = catchAsync(
  async (req, res, next) => {
    const { title, comment, userId, movieId } = req.body;

    if (!title || !comment || !userId || !movieId) {
      return next(
        new AppError(
          400,
          'Must provide a valid title, comment, userId, movieId'
        )
      );
    }
    const newReviews = await Reviews.create({
      title,
      comment,
      userId,
      movieId
    });

    res.status(201).json({
      status: 'success',
      data: { newReviews }
    });
  }
);
exports.getAllreviews = catchAsync(
  async (req, res, next) => {
    const reviews = await Reviews.findAll({
      where: { status: 'active' },
      include: [{ model: Movies }, { model: Users }]
    });

    if (!reviews) {
      return next(new AppError(404, 'Review not found'));
    }

    res.status(200).json({
      status: 'sucess',
      data: reviews
    });
  }
);
exports.getReviewsById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const reviews = await Reviews.findOne({
      where: { id },
      include: [{ model: Movies }, { model: Actors }]
    });

    if (!reviews) {
      return next(new AppError(404, 'Review not found'));
    }
    res.status(200).json({
      status: 'success',
      data: { reviews }
    });
  }
);
exports.updateReview = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const { title, comment, userId, movieId } = req.body;
    const data = {
      title,
      comment,
      userId,
      movieId
    };
    const reviews = await Reviews.findOne({
      where: { id: id, status: 'active' }
    });

    if (!reviews) {
      return next(
        new AppError(404, 'Cant update reviews, invalid ID')
      );
    }

    await reviews.update({ ...data });

    res.status(204).json({ status: 'success' });
  }
);
exports.deleteReview = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const reviews = await Reviews.findOne({
      where: { id: id, status: 'active' }
    });

    if (!reviews) {
      return next(
        new AppError(404, 'Cant delete review, invalid ID')
      );
    }
    await reviews.update({ status: 'deleted' });

    res.status(204).json({ status: 'success' });
  }
);
