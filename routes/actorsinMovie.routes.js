const express = require('express');

// Controllers
const {
  createNewActorinMovies,
  getAllActorinMovies,
  getActorinMoviesById,
  updateActorinMovie,
  deleteActorinMovie
} = require('../controllers/actorsinMovie.controller');

const {
  validateSession,
  validateSessionAdmin
} = require('../middlewares/auth.middleware');

const router = express.Router();
router.use(validateSession);
router.use(validateSessionAdmin);

router.post('/', createNewActorinMovies);
router.get('/', getAllActorinMovies);
router.get('/:id', getActorinMoviesById);
router.patch('/:id', updateActorinMovie);
router.delete('/:id', deleteActorinMovie);

module.exports = { actorinMoviesRouter: router };
