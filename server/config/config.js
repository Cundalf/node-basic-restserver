require('dotenv').config();

//* Puerto
process.env.PORT = process.env.PORT || 3000;

//* Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//* Vencimiento del token
process.env.EXP_TOKEN = '15m';

//* Seed
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'devseed';

//* DB
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = process.env.MONGO_DEV;
} else {
    urlDB = process.env.MONGO_PROD;
}

process.env.URLDB = urlDB;

// Google Client ID: process.env.GOOGLE_CLIENT_ID