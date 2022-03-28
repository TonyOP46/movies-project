const express = require('express');

// Controllers
const {
  createNewUser,
  getAllUsers,
  getUsersById,
  updateUser,
  deleteUser,
  loginUser
} = require('../controllers/users.controller');

const {
  validateSession
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', createNewUser);
router.post('/login', loginUser);

router.use(validateSession);

router.get('/', getAllUsers);
router.get('/:id', getUsersById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = { usersRouter: router };
