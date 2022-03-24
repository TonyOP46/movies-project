const dotenv=require('dotenv');

const { Actors } = require('../models/actors.model');
const { Movies} = require('../models/movies.model');

const {catchAsync} = require('../util/catchAsync');
const { AppError } = require('../../multer-example/util/appError');

dotenv.config({path: './config.env'});


exports.getAllActors = catchAsync (async(req, res, next) => {
	const actors = await Actors.findAll({
		where: { status: 'active' },
		attributes: { exclude: ['password'] },
		include: [
		  {
				model: Movies,
				include: [
				  {
					model: Actors,
					attributes: { exclude: ['password'] }
				  }
				]
		  }
		]
	  });
	
	  res.status(200).json({
		status: 'success',
		data: { actors}
	  });
	});

exports.getActorById = catchAsync (async(req, res, next) => {
		const { id } = req.params;

		const actors = await Actors.findOne({ where: { id } });

		if(!actors){
			return next(new AppError(404, 'User not found'));
		  }

		res.status(200).json({
			status: 'success',
			data: { actors },
		});
	
});

exports.createNewActor = catchAsync (async(req, res, next) => {
		const { name, country, age, profilePic, rating=0 } = req.body;

		if(!name || !country || !age || !profilePic || !rating){
			return next(new AppError(400, 'Must provide a invalid name, country, age, profilePic and rating'))
		};

		const newActor = await Actors.create({ name, country, age, profilePic, rating  });

		res.status(201).json({
			status: 'success',
			data: { newActor },
		});
});

exports.deleteActor = catchAsync (async(req, res, next) => {
    const {id}=req.params;

    const actors = await Actors.findOne({where: {id: id, status: 'active'}});

    if (!actors) {
		return next(new AppError(404, 'Actor not found'));
	  }


	  await actors.update({ status: 'deleted' });

	  res.status(204).json({ status: 'success' });
});

exports.updateActor = catchAsync (async(req, res, next) => {
    const { id } = req.params;
    const data = filterObj(req.body, 'name');

    const actors = await Actors.findOne({
      where: { id: id, status: 'active' }
    });

    if (!actors) {
      return next(new AppError(404, 'Actor not found'));
    }

    await actors.update({ ...data }); 

    res.status(204).json({ status: 'success' });
});
