const express = require('express');

const { verificaToken } = require('../middlewares/authentication');

const app = express();

let Categoria = require('../models/categoria');
/*
app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email estado role google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, cant) => {

                res.json({
                    ok: true,
                    usuarios,
                    cant
                });

            });

        });
});
*/
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let usuario = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    usuario.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = req.body;
    
    let descCategoria = {
        descripcion: body.descripcion
    };

    Usuario.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true, useFindAndModify: false }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});
/*
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    //Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, useFindAndModify: false }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
*/
module.exports = app;