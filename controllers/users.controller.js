const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

const {Users}= require('../models/users.model');
const {Actors} = require('../models/actors.model');
const {Movies}=require('../models/movies.model');

const {catchAsync} = require('../util/catchAsync');
const { AppError } = require('../../multer-example/util/appError');

dotenv.config({path: './config.env'});

exports.getAllUsers = catchAsync (async(req, res, next) => {
    // Nested includes
  const users = await Users.findAll({
    where: { status: 'active' },
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Actors,
        include: [
          {
            model: Movies,
            include: [
              {
                model: Users,
                attributes: { exclude: ['password'] }
              }
            ]
          }
        ]
      },
      { model: Movies, include: [{ model: Actors }] }
    ]
  });

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});

exports.getUserById = catchAsync (async(req, res, next) => {
  const {id}=req.params;

  const user=await Users.findOne({where: {id}});

  if(!Users){
    return next(new AppError(404, 'User not found'));
  }

  res.status(200).json({
    status: 'success',
    data: {Users}
  });
});

exports.createNewUser = catchAsync (async(req, res, next) => {
  const {name, email, password}=req.body;

  if(!name || !email || !password){
    return next(new AppError(400, 'Must provide a invalid name, email and password'))
  };

  const salt = await bcrypt.genSalt(12);

  const hashedPassword=await bcrypt.hash(password, salt);

  const newUser= await Users.create({
    name, 
    email, 
    password: hashedPassword
  });

  newUser.password=undefined;

  res.status(201).json({
    status: 'success',
    data:{newUser}
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({
    where: { email, status: 'active' }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }

  // Create JWT
  const token = await jwt.sign(
    { id: user.id }, // Token payload
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});

exports.deleteUser = catchAsync (async(req, res, next) => {
    const { id } = req.params;

    const user = await Users.findOne({
      where: { id: id, status: 'active' }
    });

    if (!user) {
      return next(new AppError(404, 'User not found'));
    }

    await user.update({ status: 'deleted' });

    res.status(204).json({ status: 'success' });
});

exports.updateUser = catchAsync (async(req, res, next) => {
    const { id } = req.params;
    const data = filterObj(req.body, 'name', 'email', 'password'); // { title } | { title, author } | { content }

    const user = await Users.findOne({
      where: { id: id, status: 'active' }
    });

    if (!user) {
      return next(new AppError(404, 'User not found'));
    }

    await user.update({ ...data }); 

    res.status(204).json({ status: 'success' });
});