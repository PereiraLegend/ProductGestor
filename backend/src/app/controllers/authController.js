const {Usuarios} = require('../models/UsuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nome, password, regra } = req.body;
    try {
        let usuario = await Usuarios.findOne({ nome });
        if (usuario) {
            return res.status(400).json({ msg: 'Usuario já existe' });
        }
        usuario = new Usuarios({
            nome,
            password,
            regra,
        });
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
        await usuario.save();

        const payload = {
            usuario: {
                id: usuario.id,
                regra: usuario.regra,
            },
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { nome, password } = req.body;
    try {
        let usuario = await Usuarios.findOne({ nome });
        if (!usuario) {
            return res.status(400).json({ msg: 'Credenciais Inválidas' });
        }
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais Inválidas' });
        }
        const payload = {
            usuario: {
                id: usuario.id,
                regra: usuario.regra,
            },
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
};
