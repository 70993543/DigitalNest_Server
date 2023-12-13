'use strict';

const express = require('express');
const configController = require('../controllers/config.controller')
const path = require('path')
const multiparty = require('connect-multiparty');

const uploadDir = path.join(__dirname, '../uploads/configuraciones');
const pathMiddleware = multiparty({ uploadDir });

const api = express.Router()
const auth = require('../middlewares/authenticate')

api.put('/actualizar_config_admin/:id', [auth.auth, pathMiddleware], configController.actualizar_config_admin)
api.get('/obtener_config_admin', auth.auth, configController.obtener_config_admin)
api.get('/obtener_logo/:img', configController.obtener_logo)
api.get('/obtener_config_publico', configController.obtener_config_publico)


module.exports = api

