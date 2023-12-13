const jwtHelper = require('../helpers/jwt');
const moment = require('moment')

exports.auth = (req, res, next) => {
    if (!req.headers.authorization) {
        console.log('No se proporcionó la autorización en las cabeceras.');
        return res.status(403).send({ message: 'NoHeadersError' });
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        const payload = jwtHelper.verifyToken(token);

        if (payload.exp <= moment().unix()) {
            console.log('Token expirado.');
            return res.status(403).send({ message: 'TokenExpirado' });
        }

        console.log('Token válido. Usuario:', payload);
        req.user = payload;
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(403).send({ message: 'InvalidToken' });
    }
};


