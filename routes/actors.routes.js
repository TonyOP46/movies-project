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

const {
  validateSession,
  validateSessionAdmin
} = require('../middlewares/auth.middleware');

const router = express.Router();
router.use(validateSession);

router.get('/', getAllActors);
router.get('/:id', getActorById);
router.patch('/:id', updateActor);

router.use(validateSessionAdmin);

router.post(
  '/',
  upload.single('profilePic'),
  createNewActor
);
router.delete('/:id', deleteActor);

module.exports = { actorsRouter: router };
