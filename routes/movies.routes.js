const express = require('express');

// Controllers
const {
    getAllMovies,
    getMoviesById,
    createNewMovie,
    updateMovie,
    deleteMovie
} = require('../controllers/movies.controller');

const router = express.Router();

router.get('/', getAllMovies);

router.get('/:id', getMoviesById);

router.post('/', createNewMovie);

router.delete('/:id', deleteMovie );

router.patch('/:id', updateMovie);

module.exports = { userRouter: router };