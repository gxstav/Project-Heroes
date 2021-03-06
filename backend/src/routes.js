const express = require('express')
const { celebrate, Joi, Segments } = require('celebrate')
const ong = require('./controllers/OngController')
const project = require('./controllers/ProjectController')
const auth = require('./controllers/AuthController')
const service = require('./controllers/ServiceController')

const routes = express.Router()

//AUTH ROUTE
routes.post('/login', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
}), auth.login)

routes.delete('/logout', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    'x-refresh-token': Joi.string().required()
  }).options({ allowUnknown: true })
}), auth.logout)

routes.post('/token', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    'x-refresh-token': Joi.string().required()
  }).options({ allowUnknown: true })
}), auth.refresh)


// ONG ROUTES
routes.post('/cadastro', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    phone: Joi.string().required().min(10).max(11),
    city: Joi.string().required(),
    uf: Joi.string().required().length(2),
    url: Joi.string().optional().allow(''),
    about: Joi.string().required()
  })
}), ong.create)

// PROJECT ROUTES
routes.post('/projetos', auth.authenticate, celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.number().integer().required().valid(1, 2, 3),
    address: Joi.string().required(),
    date_start: Joi.string().required(),
    date_end: Joi.string().required(),
    segment: Joi.array().required().items(Joi.string().valid('ALIMENTACAO', 'ATIVIDADES', 'OUTROS', 'VESTIMENTAS').allow('')),
    description: Joi.string().required()
  })
}), project.create)

routes.get('/ong/projetos', auth.authenticate, project.verify, celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    'x-access-token': Joi.string().required(),
    'x-andamento': Joi.boolean().required()
  }).options({ allowUnknown: true })
}), project.get)

routes.delete('/projetos', auth.authenticate, celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    'x-access-token': Joi.string().required(),
    'x-project-id': Joi.number().required()
  }).options({ allowUnknown: true })
}), project.delete)

routes.get('/projetos/:id', project.verify, celebrate({
  [Segments.PARAMS]: {
    id: Joi.number().required()
  }
}), project.details)

routes.put('/projetos', project.verify, celebrate({
  [Segments.QUERY]: {
    page: Joi.number(),
    size: Joi.number()
  },
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().allow(''),
    uf: Joi.string().allow(''),
    types: Joi.array().items(Joi.string().valid('1', '2', '3').allow('')),
    segments: Joi.array().items(Joi.string().valid('ALIMENTACAO', 'ATIVIDADES', 'OUTROS', 'VESTIMENTAS').allow(''))
  })
}), project.index)

// USER ROUTES
routes.post('/mailer', service.mailer)

module.exports = routes