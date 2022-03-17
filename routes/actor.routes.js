const express = require('express');

// Controllers
const {
    getAllActors,
	createNewActor,
	getActorById,
    updateActor,
    deleteActor
} = require('../controllers/actor.controller');

const router = express.Router();

router.get('/', getAllActors);

router.get('/:id', getActorById);

router.post('/', createNewActor);

router.delete('/:id', deleteActor );

router.patch('/:id', updateActor);

module.exports = { userRouter: router };
