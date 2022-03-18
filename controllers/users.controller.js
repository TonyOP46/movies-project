const { Users } = require('../models/actors.model');

const {catchAsync} = require('../util/catchAsync')

exports.getAllUsers = catchAsync (async(req, res) => {
    // Nested includes
  const users = await Users.findAll({
    where: { status: 'active' },
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Post,
        include: [
          {
            model: Comment,
            include: [
              {
                model: User,
                attributes: { exclude: ['password'] }
              }
            ]
          }
        ]
      },
      { model: Comment, include: [{ model: Post }] }
    ]
  });

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});
});

exports.getUserById = catchAsync (async(req, res) => {
});

exports.createNewUser = catchAsync (async(req, res) => {
});

exports.deleteUser = catchAsync (async(req, res) => {
});

exports.updateUser = catchAsync (async(req, res) => {
});