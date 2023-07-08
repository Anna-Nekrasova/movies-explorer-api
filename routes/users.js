const express = require('express');
const { celebrate, Joi } = require('celebrate');

const routerUsers = express.Router();
const {
  editProfile, getUserAuth,
} = require('../controllers/users');

routerUsers.get('/users/me', getUserAuth);
routerUsers.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), editProfile);

module.exports = routerUsers;
