const { Actors } = require('../models/actors.model');
const { Movies} = require('../models/movies.model')
const { Reviews} = require('../models/reviews.model')


require('../controllers/')

exports.getAllActors = catchAsync (async(req, res) => {
    try {
		// SELECT * FROM users
		// JOIN address ON users.id = addresses.userId
		// JOIN posts ON posts.userId = users.id

		// Step 2: Use the attribute include
		const actors = await Actors.findAll({
			include: [{ model: Movies }, { model: Reviews }],
		});

		res.status(200).json({
			status: 'success',
			data: { Actors },
		});
	} catch (error) {
		console.log(error);
	}
    });

exports.getActorById = catchAsync (async(req, res) => {
    try {
		const { id } = req.params;

		const Actor = await Actors.findOne({ where: { id } });

		res.status(200).json({
			status: 'success',
			data: { user },
		});
	} catch (error) {
		console.log(error);
	}
});

exports.createNewActor = catchAsync (async(req, res) => {
    try {
		const { name } = req.body;

		const newActor = await Actors.create({ name });

		res.status(201).json({
			status: 'success',
			data: { newUser },
		});
	} catch (error) {
		console.log(error);
	}
});

exports.deleteActor = catchAsync (async(req, res) => {
    const {id}=req.params;

    const ActorId= Actors.findIndex(actor=>actor.id===+id);


    if(ActorId===-1){
        res.status(404).json({
            status: 'error',
            message: 'Cant delete actor, invalid ID',
        });
        return;
    }

    Actors.splice(ActorId, 1);

    res.status(204).json({status: 'success'});
});

exports.updateActor = catchAsync (async(req, res) => {
    const { id } = req.params;
	const data = filterObj(req.body, 'name', 'age');

	const ActorId = Actors.findIndex(actor => actor.id === +id);

	if (ActorId === -1) {
		res.status(404).json({
			status: 'error',
			message: 'Cant update user, not a valid ID',
		});
		return;
	}

	let updatedActor = Actors[ActorId];

	updatedActor = { ...updatedActor, ...data };

	Actors[ActorId] = updatedActor;

	res.status(204).json({ status: 'success' });
});
