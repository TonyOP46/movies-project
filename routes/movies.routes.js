const express = require('express');

// Controllers
const {
  getAllMovies,
  createNewMovie,
  getMoviesById,
  updateMovie,
  deleteMovie
} = require('../controllers/movies.controller');

const {
  validateSession,
  validateSessionAdmin
} = require('../middlewares/auth.middleware');

const { upload } = require('../util/multer');

const router = express.Router();
router.use(validateSession);
router.get('/', getAllMovies);
router.get('/:id', getMoviesById);
router.patch('/:id', updateMovie);

router.use(validateSessionAdmin);
router.post('/', upload.single('img'), createNewMovie);
router.delete('/:id', deleteMovie);

module.exports = { moviesRouter: router };
