'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ClienteSchema = Schema({
    nombres: {
        type: 'string',
        required: true
    },
    apellidos: {
        type: 'string',
        required: true
    },
    pais: {
        type: 'string',
        required: false
    },
    email: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    perfil: {
        type: 'string',
        default: 'perfil.png',
        required: false
    },
    telefono: {
        type: 'string',
        required: false
    },
    genero: {
        type: 'string',
        required: false
    },
    f_nacimiento: {
        type: 'string',
        required: false
    },
    dni: {
        type: 'string',
        required: false
    },
    createdAt: {type: Date, default: Date.now, required: true}
})

module.exports = mongoose.model('cliente', ClienteSchema);

