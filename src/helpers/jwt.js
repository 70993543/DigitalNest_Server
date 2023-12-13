'use strict';

require('dotenv').config(); 
const jwt = require('jsonwebtoken');
const moment = require('moment');

const secret = process.env.JWT_SECRET;

/* console.log('Valor de JWT_SECRET:', secret);  */

exports.createToken = (user, expiresIn = null) => {
    try {
        const payload = {
            sub: user._id,
            nombres: user.nombres,
            apellidos: user.apellidos,
            email: user.email,
            role: user.rol,
            iat: moment().unix(), // Redondear la fecha UNIX
            ...(expiresIn ? { exp: moment().add(moment.duration(expiresIn)).unix() } : {}), // Agregar exp solo si expiresIn está presente
            refreshToken: jwt.sign({ sub: user._id }, secret, {algorithm: 'HS256'})
        };

        const token = jwt.sign(payload, secret, {algorithm: 'HS256'})
        return token;
    } catch (error) {
        console.error('Error al codificar el token:', error);
        throw new Error('Error al generar el token');
    }
};

exports.verifyToken = (token) => {
    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('Token expirado.');
            throw new Error('TokenExpirado');
        } else {
            console.error('Error al verificar el token:', error);
            throw new Error('InvalidToken');
        }
    }
};
