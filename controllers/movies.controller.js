const {
  ref,
  uploadBytes,
  getDownloadURL
} = require('firebase/storage');

// Models
const { Movies } = require('../models/movies.model');
const {
  ActorsinMovie
} = require('../models/actorsinMovie.model');
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

    const fileExtension =
      req.file.originalname.split('.')[1];

    const imgRef = ref(
      storage,
      `imgs/movies/${title}-${Date.now()}.${fileExtension}`
    );

    const imgUploaded = await uploadBytes(
      imgRef,
      req.file.buffer
    );

    const newMovies = await Movies.create({
      title,
      description,
      duration,
      rating,
      genre,
      img: imgUploaded.metadata.fullPath
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
      include: [
        { model: Actors, through: ActorsinMovie },
        { model: Reviews }
      ]
    });

    // Promise[]
    const moviesPromises = movies.map(
      async ({
        title,
        description,
        duration,
        rating,
        img,
        createdAt,
        updatedAt,
        actors,
        reviews
      }) => {
        const imgRef = ref(storage, img);

        const imgDownloadUrl = await getDownloadURL(imgRef);

        return {
          title,
          description,
          duration,
          rating,
          img: imgDownloadUrl,
          createdAt,
          updatedAt,
          actors,
          reviews
        };
      }
    );

    const resolvedMovies = await Promise.all(
      moviesPromises
    );

    res.status(200).json({
      status: 'sucess',
      data: resolvedMovies
    });
  }
);
exports.getMoviesById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const movies = await Movies.findOne({
      where: { id },
      include: [
        { model: Actors, through: ActorsinMovie },
        { model: Reviews }
      ]
    });

    //console.log(movies);

    if (!movies) {
      return next(new AppError(404, 'Movie not found'));
    }

    const {
      title,
      description,
      duration,
      rating,
      img,
      createdAt,
      updatedAt,
      actors,
      reviews
    } = movies;

    const imgRef = ref(storage, img);

    const imgDownloadUrl = await getDownloadURL(imgRef);

    const resolvedMovies = {
      title,
      description,
      duration,
      rating,
      img: imgDownloadUrl,
      createdAt,
      updatedAt,
      actors,
      reviews
    };

    res.status(200).json({
      status: 'success',
      data: resolvedMovies
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
