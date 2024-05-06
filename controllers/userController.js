// Importar modulos
import userModel from '../models/User.js';
import validate from '../helpers/validate.js';
import bcrypt from 'bcrypt';
import * as jwt from '../helpers/jwt.js';
import nodemailer from 'nodemailer';
import config from '../config.js';

// // Configuracion del nodemailer
// const transporter = nodemailer.createTransport({
//     host: config.LocalUrl,
//     port: 465,
//     secure: true,
//     auth: {
//       user: config.EMAIL,
//       pass: config.EMAIL_pass,
//     },
// });

// const mailOptions = async (user, token) => {
//     // send mail with defined transport object
//     const info = {
//         from: `"vicefedezdev" <${config.EMAIL}>`, // sender address
//         to: user.email, // list of receivers
//         subject: "Password Change", // Subject line
//         text: "Your password recovery url:", // plain text body
//         // html: `<u href='http://127.0.0.1:3000/api/user/updatePass/${token}'></u>`, // html body
//     };

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

//     return info;
// }



// Funcionalidades
const test = (req, res) => {
    return res.status(200).send({
        status: 'Success',
        message: 'Ruta de prueba para User'
    });
}

const register = async (req, res) => {

    // Obtener datos del body
    let user = req.body;

    // comprobar que llegan bien los datos
    if(!user || user.length == 0) return res.status(400).send({
        status: 'Error',
        message: 'Error al obtener datos del body'
    });

    // validar datos del body
    if(!validate.User(user)) return res.status(400).send({
        status: 'Error',
        message: 'Faltan datos por introducir, por favor revise los datos ingresados'
    });

    // Verificar que el usuario no exista
    const userExists = await userModel.exists({$or: [{email: user.email}, {username: user.username}]}).exec()
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar verificar al usuario'
            });
        });
    
    if(userExists) return res.status(400).send({
        status: 'Error',
        message: 'El usuario con ese username o email ya existe'
    });

    // Encriptar password
    const encriptedPassword = await bcrypt.hash(user.password, 10)
        .then(encriptedPass => {
            if(!encriptedPass || encriptedPass.length == 0) return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar encriptar la contraseña'
            });

            return encriptedPass;
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar encriptar la contraseña'
            });
        });

    // reemplazar pass al usuario al usuario a guardar
    user.password = encriptedPassword;
    
    // hacer un create
    userModel.create(user)
        .then(created_user => {
            if(!created_user || created_user.length == 0) return res.status(400).send({
                status: 'Error',
                message: 'No se pudo registrar al usuario'
            });

            return res.status(200).send({
                status: 'Success',
                message: 'Usuario registrado con exito'
            });
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar registrar al usuario en DB'
            });
        });
}

const login = (req, res) => {

    // Obtener datos del body
    let data = req.body;

    // verificar que llegan bien los datos
    if(!data || data.length == 0) return res.status(400).send({
        status: 'Error',
        message: 'No se ha ingresado un usuario'
    });

    // hacer find de usuario en db por username o email
    userModel.findOne({$or:[{username: data.username}, {email: data.username}]}).exec()
        .then(user => {
            if(!user || user.length == 0) return res.status(404).send({
                status: 'Not Found',
                message: 'El usuario no existe'
            });

            // si el usuario existe decodificar la contraseña y comparar
            const match = bcrypt.compareSync(data.password, user.password);

            if(match){
                // generar token jwt
                const token = jwt.createToken(user);

                // Limpiar campos del usuario
                const userLogged = user.toObject();

                delete userLogged.password;
                // delete userLogged.role;
                delete userLogged.created_at;
                delete userLogged.__v;

                // devolver respuesta con el token
                return res.status(200).send({
                    status: 'Success',
                    message: 'Usuario logeado corrctamente',
                    userLogged,
                    token
                });
            }

            return res.status(400).send({
                status: 'Error',
                message: 'Contraseña incorrecta'
            });
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al ejecutar la busqueda del usuario en DB'
            });
        });

    

    
}

const update = async (req, res) => {

    // obtener datos del usuario identificado
    let userIdentity = req.user;

    // obtener datos del body
    let bodyData = req.body;

    // crear usuario a actualizar
    let userToUpdate = {...bodyData};

    // si llega contraseña encriptarla
    if(bodyData.password) {
        try{
            let newPass = await bcrypt.hash(bodyData.password, 10);
            userToUpdate.password = newPass;
        }catch(exception){
            return res.status(500).send({
                status: 'Error',
                message: 'Error al encriptar la contraseña'
            });
        }
    }

    // hacer una find by id and update
    userModel.findByIdAndUpdate(userIdentity.id, userToUpdate, {new: true}).exec()
        .then(updatedUser => {
            if(!updatedUser || updatedUser.length == 0) return res.status(404).send({
                status: 'Success',
                message: 'No se pudo encontrar el usuario'
            });

            return res.status(200).send({
                status: 'Success',
                message: 'Usuario actualizado con exito',
                updatedUser
            });
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar actualizar al usuario'
            });
        });
}

const deleteUser = (req, res) => {
    // Obtener datos del usuario identificado
    let userIdentity = req.user;

    // Hacer un findByIdAndDelete
    userModel.findByIdAndDelete(userIdentity.id).exec()
        .then(deletedUser => {
            if(!deletedUser || deletedUser.length == 0) return res.status(404).send({
                status: 'Error',
                message: 'Usuario no encontrado'
            });

            return res.status(200).send({
                status: 'Success',
                message: 'Usuario eliminado exitosamente'
            });
        })
        .catch(error => {
            return res.status(500).send({
                status: 'Error',
                message: 'Error al intentar eliminar al usuario'
            });
        });
}

// const passwordRecovery = async (req, res) => {

//     if(!req.body.username || req.body.username.lenght == 0) return res.status(400).send({
//         status: 'Error',
//         message: 'Debe indicar el username o email de la cuenta'
//     });

//     // Obtener datos del body
//     let data = req.body.username;

//     // hacer un findOne
//     userModel.findOne({$or:[{username: data}, {email: data}]}).exec()
//         .then(user => {
//             if(!user || user.length == 0) return res.status(404).send({
//                 status: 'Error',
//                 message: 'Usuario no encontrado'
//             });

//             // Si el usuario existe, crear token
//             let token = jwt.createToken(user);

//             // enviar mail con url y token en get
//             try {
//                 transporter.sendMail(mailOptions(user, token), (error, info) => {
//                     if(error || !info) return res.status(500).send({
//                         status: 'Error',
//                         message: 'Error al enviar el mail'
//                     });
                    
//                     return res.status(200).send({
//                         status: 'Success',
//                         message: 'Mail enviado con exito',
//                         user,
//                         token
//                     });
//                 });
//             } catch (error) {
//                 console.log('no se pudo enviar el mail'),
//                 console.log(error)
//             }

//         })
//         .catch(error => {
//             return res.status(500).send({
//                 status: 'Error',
//                 message: 'Error al intentar buscar al usuario'
//             });
//         });
// }


// funcionalidades admin


export {
    test,
    register,
    login,
    update,
    deleteUser,
}