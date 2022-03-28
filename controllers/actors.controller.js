const { ref, uploadBytes} = require('firebase/storage');

// Models
const { Actors } = require('../models/actors.model');
const { Movies } = require('../models/movies.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { storage } = require('../util/firebase');
/*const { filterObj } = require('../util/filterObj');*/

exports.createNewActor = catchAsync(
  async (req, res, next) => {
    const { name, country, rating, age } = req.body;

    if (!name || !country || !rating || !age) {
      return next(
        new AppError(
          400,
          'Must provide a valid name, country, rating, age'
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

    const newActors = await Actors.create({
      name,
      country,
      rating,
      age,
      profilePic: result.metadata.fullPath
    });

    res.status(201).json({
      status: 'success',
      data: { newActors }
    });
  }
);
exports.getAllActors = catchAsync(
  async (req, res, next) => {
    const actors = await Actors.findAll({
      where: { status: 'active' }
      /*include: [{ model: Movies }]*/
    });

    res.status(200).json({
      status: 'sucess',
      data: { actors }
    });
  }
);
exports.getActorById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    const actors = await Actors.findOne({ where: { id } });

    if (!actors) {
      return next(new AppError(404, 'Actor not found'));
    }

    res.status(200).json({
      status: 'success',
      data: { actors }
    });
  }
);
exports.updateActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  /*const data = filterObj(
    req.body,
    'name',
    'country',
    'rating',
    'age'
  );*/
  const { name, country, rating, age } = req.body;
  const data = { name, country, rating, age };
  const actors = await Actors.findOne({
    where: { id: id, status: 'active' }
  });

  if (!actors) {
    return next(
      new AppError(404, 'Cant update actor, invalid ID')
    );
  }

  await actors.update({ ...data });

  res.status(204).json({ status: 'success' });
});
exports.deleteActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const actors = await Actors.findOne({
    where: { id: id, status: 'active' }
  });

  if (!actors) {
    return next(
      new AppError(404, 'Cant delete actor, invalid ID')
    );
  }
  await actors.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});
