const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send({ movies }))
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден.');
      }
      if (String(movie.owner) === req.user._id) {
        return Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.send({ message: 'Фильм удален.' });
          });
      }
      throw new ForbiddenError('Нельзя удалить чужой фильм.');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления фильма.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
