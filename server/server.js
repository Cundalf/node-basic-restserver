require('./config/config');

//* Dependencias
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');

const app = express();

//* Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
//* Parse application/json
app.use(express.json());
//* Habilitacion de carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//* Uso de helmet con fines de seguridad
app.use(helmet());

//* Seguridad para DDOS
app.enable('trust proxy');

// Sin delay de request. 100 request por IP en 15 minutos
var limiter = new RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    delayMs: 0 
});
app.use(limiter);

//* Configuracion global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log("Base de datos conectada");
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});