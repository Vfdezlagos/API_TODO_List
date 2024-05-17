// Importar dependencias
import express from 'express';
import cors from 'cors';
import connection from './database/connection.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import config from "./config.js";
import sendEmail from './helpers/mailer.js';

// Importar rutas


// crear servidor
const app = express();
const port = config.PORT;

// Conectar a DB
connection();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Rutas
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

app.get('/', (req, res) => {
    res.send('TODO List API');
});

app.get('/mailer-test', async (req, res) => {

    const sendOptions = {
        to: 'v.fernandez.lagos@gmail.com',
        subject: 'Email de prueba de nodemailer',
        html: '<h1>Email de prueba de nodemailer</h1>'
    }

    await sendEmail(sendOptions);

    res.send('TODO List API mailer-tester');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});