import jwt from 'jwt-simple';
import moment from 'moment';
import config from "../config.js";

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

// Crear funcion para generar tokens para recuperacion de contraseñas
const createMailerToken = (user) => {

    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(1, "days").unix()
    };

    // Devolver el token
    return jwt.encode(payload, secret);
}

// Exportar modulo
export {
    secret,
    createToken,
    createMailerToken
}