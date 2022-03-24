const dotenv=require('dotenv');

const { Reviews } = require('../models/reviews.model');
const { Movies} = require('../models/movies.model');

const {catchAsync} = require('../util/catchAsync');
const { AppError } = require('../../multer-example/util/appError');

dotenv.config({path: './config.env'});

exports.getAllMovies = catchAsync (async(req, res, next) => {
    const movies = await Movies.findAll({
		where: { status: 'active' },
		attributes: { exclude: ['password'] },
		include: [
		  {
				model: Movies,
				include: [
				  {
					model: Reviews,
					attributes: { exclude: ['password'] }
				  }
				]
		  }
		]
	  });
	
	  res.status(200).json({
		status: 'success',
		data: { movies}
	  });
});

exports.getMoviesById = catchAsync (async(req, res, next) => {
    const { id } = req.params;

		const movies = await Movies.findOne({ where: { id } });

		if(!movies){
			return next(new AppError(404, 'Movie not found'));
		  }

		res.status(200).json({
			status: 'success',
			data: { movies },
		});
});

exports.createNewMovie = catchAsync (async(req, res, next) => {
    const { title, description, duration, rating=0, img, genre } = req.body;

    if(!title || !description || !duration || !rating || !img || !genre){
        return next(new AppError(400, 'Must provide a invalid title, description, duration, rating, img and genre'))
    };

    const newMovie = await Actors.create({ title, description, duration, rating, img, genre});

    res.status(201).json({
        status: 'success',
        data: { newMovie },
    }); 
});

exports.deleteMovie = catchAsync (async(req, res, next) => {
    const {id}=req.params;

    const movies = await Movies.findOne({where: {id: id, status: 'active'}});

    if (!movies) {
		return next(new AppError(404, 'Movie not found'));
	  }

	  await movies.update({ status: 'deleted' });

	  res.status(204).json({ status: 'success' });
});

exports.updateMovie =catchAsync (async(req, res, next) => {
    const { id } = req.params;
    const data = filterObj(req.body, 'name');

    const movies = await Movies.findOne({
      where: { id: id, status: 'active' }
    });

    if (!movies) {
      return next(new AppError(404, 'Movie not found'));
    }

    await movies.update({ ...data }); 

    res.status(204).json({ status: 'success' });
});