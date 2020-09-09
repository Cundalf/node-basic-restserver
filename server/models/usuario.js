const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let RolesValidos = {
    values: ['ADMIN_ROLE', "USER_ROLE"],
    message: '{VALUE} No es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio.']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: RolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObj = user.toObject();
    delete userObj.password;

    return userObj;
};

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico.' });

module.exports = mongoose.model('Usuario', usuarioSchema);