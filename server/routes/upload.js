const fs = require('fs');
const path = require('path');

const express = require('express');
const fileUpload = require('express-fileupload');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const { verificaToken } = require('../middlewares/authentication');

const app = express();

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', verificaToken, function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo.'
            }
        });
    }

    // Validar Tipo
    let tiposValidos = ['producto', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + tiposValidos.join(', ')
            }
        });
    }



    // Validar ID
    let archivo = req.files.archivo;

    // Extensiones permitiidas
    let validExt = ['png', 'jpg', 'gif', 'jpeg'];
    let filename = archivo.name.split('.');
    let ext = filename[filename.length - 1];

    if (validExt.indexOf(ext) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + validExt.join(', '),
                ext
            }
        });
    }

    // Cambio de nombre del archivo
    let newFilename = `${id}-${new Date().getMilliseconds()}.${ext}`;

    archivo.mv(`uploads/${tipo}/${newFilename}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (tipo) {
            case 'usuario':
                imagenUsuario(id, newFilename, res);
                break;
            case 'producto':
                imagenProducto(id, newFilename, res);
                break;
            default:
                return res.status(500).json({
                    ok: false
                });
        }
    });
});

function imagenUsuario(id, nombreArchivo, res) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuario');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuario');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuario');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGrabado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGrabado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, nombreArchivo, res) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'producto');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'producto');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        borrarArchivo(productoDB.img, 'producto');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGrabado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGrabado,
                img: nombreArchivo
            });
        });
    });
}

function borrarArchivo(filename, type) {
    let pathURL = path.resolve(__dirname, `../../uploads/${type}/${filename}`);
    if (fs.existsSync(pathURL)) {
        fs.unlinkSync(pathURL);
    }
}

module.exports = app;