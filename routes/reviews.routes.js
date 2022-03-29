const express = require('express');

// Controllers
const {
  createNewReview,
  getAllreviews,
  getReviewsById,
  updateReview,
  deleteReview
} = require('../controllers/reviews.controller');

const {
  validateSession,
  validateSessionAdmin
} = require('../middlewares/auth.middleware');

const router = express.Router();
router.use(validateSession);
router.post('/', createNewReview);
router.get('/', getAllreviews);
router.get('/:id', getReviewsById);
router.patch('/:id', updateReview);

router.use(validateSessionAdmin);
router.delete('/:id', deleteReview);

module.exports = { reviewsRouter: router };
