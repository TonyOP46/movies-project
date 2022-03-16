// Models
const { Movies } = require('../models/movies.model');
const { Reviews } = require('../models/reviews.model');
const { Users } = require('../models/users.model');
const { Actors } = require('../models/actors.model');
const { ActorsinMoviesact } = require('../models/actorsinMoviesact.model');

const initModels = () => {
  // 1 Users <----> M Reviews
  Users.hasMany(Reviews);
  Reviews.belongsTo(Users);

  // 1 Movies <---> M Reviews
  Movies.hasMany(Reviews);
  Reviews.belongsTo(Movies);

  // M Movies <---> M ActorsinMoviesact
  Movies.hasMany(ActorsinMoviesact); 

  // M Actors <---> M ActorsinMoviesact;
  Actors.hasMany(ActorsinMoviesact);
};

module.exports = { initModels };