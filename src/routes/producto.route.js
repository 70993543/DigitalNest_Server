'use strict';

const express = require('express');
const productoController = require('../controllers/producto.controller');
const path = require('path');
const multiparty = require('connect-multiparty');

const uploadDir = path.join(__dirname, '../uploads/productos');
const pathMiddleware = multiparty({ uploadDir });

const api = express.Router();
const auth = require('../middlewares/authenticate');

api.post('/registro_producto_admin', [auth.auth, pathMiddleware], productoController.registro_producto_admin);
api.get('/listar_productos_admin/:filtro?', auth.auth, productoController.listar_productos_admin);
api.get('/obtener_portada/:img', productoController.obtener_portada)
api.get('/obtener_producto_admin/:id', auth.auth, productoController.obtener_producto_admin)
api.put('/actualizar_producto_admin/:id', [auth.auth, pathMiddleware], productoController.actualizar_producto_admin)


module.exports = api;
