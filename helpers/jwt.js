import jwt from 'jwt-simple';
import config from '../config.js';
import moment from 'moment';

// llave secreta
const secret = config.JWT_Key;

// Crear funcion para generar tokens
const createToken = (user) => {

    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(15, "days").unix()
    };

    // Devolver el token
    return jwt.encode(payload, secret);
}

// Exportar modulo
export {
    secret,
    createToken
}