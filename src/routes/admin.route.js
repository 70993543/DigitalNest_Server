'use strict';

const express = require('express');
const adminController = require('../controllers/admin.controller')

const api = express.Router()

api.post('/registro_admin', adminController.registro_admin)
api.post('/login_admin', adminController.login_admin);

module.exports = api

