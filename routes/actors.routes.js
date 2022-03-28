const express = require('express');

// Controllers
const {
  createNewActor,
  getAllActors,
  getActorById, 
  updateActor,
  deleteActor
} = require('../controllers/actors.controller');

const { upload } = require('../util/multer');

const router = express.Router();

router.post('/', upload.single('postImg'), createNewActor);
router.get('/', getAllActors);
router.get('/:id', getActorById);
router.patch('/:id', updateActor);
router.delete('/:id', deleteActor);


module.exports = { actorsRouter: router };
