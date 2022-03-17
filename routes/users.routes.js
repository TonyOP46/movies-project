const express = require('express');

// Controllers
const {
    getAllUsers,
    getUserById, 
    createNewUser, 
    updateUser, 
    deleteUser
} = require('../controllers/users.controller');

const router = express.Router();

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/', createNewUser);

router.delete('/:id', deleteUser);

router.patch('/:id', updateUser);

module.exports = { userRouter: router };