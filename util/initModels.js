// Models
const { Movies } = require('../models/movies.model');
const { Reviews } = require('../models/reviews.model');
const { Users } = require('../models/users.model');
const { Actors } = require('../models/actors.model');
const {
  ActorsinMovie
} = require('../models/actorsinMovie.model');

const initModels = () => {
  // 1 Users <----> M Reviews
  Users.hasMany(Reviews);
  Reviews.belongsTo(Users);

  // 1 Movies <---> M Reviews
  Movies.hasMany(Reviews);
  Reviews.belongsTo(Movies);

  // M Movies <---> M Actor
  Movies.belongsToMany(Actors, { through: ActorsinMovie });
  Actors.belongsToMany(Movies, { through: ActorsinMovie });
};

module.exports = { initModels };
