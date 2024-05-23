const { Usuarios: UsuarioModel } = require('../models/UsuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UsuarioController = {
    register: async (req, res) => {
        const { nome, password, regra } = req.body;
        try {
            let usuario = await UsuarioModel.findOne({ nome });
            if (usuario) {
                return res.status(400).json({ msg: 'Usuario já existe' });
            }
            usuario = new UsuarioModel({
                nome,
                password,
                regra,
            });
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(password, salt);
            await usuario.save();

            const payload = {
                usuario: {
                    id: usuario._id,
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
    },

    login: async (req, res) => {
        const { nome, password } = req.body;
        try {
            let usuario = await UsuarioModel.findOne({ nome });
            if (!usuario) {
                return res.status(400).json({ msg: 'Credenciais Inválidas' });
            }
            const checarSenha = await bcrypt.compare(password, usuario.password);
            if (!checarSenha) {
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
    },

    getId: async (req, res) => {
        try {
            const id = req.params.id
            const usuarios = await UsuarioModel.findById(id)

            if (!usuarios) {
                res.status(404).json({ msg: "Usuário não encontrado!" })
                return;
            }

            res.status(200).json(usuarios)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    getAll: async (req, res) => {
        try {
            const usuarios = await UsuarioModel.find()
            res.status(200).json(usuarios)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id
            const usuario = await UsuarioModel.findById(id)
            if (!usuario) {
                res.status(404).json({ msg: "Usuário não encontrado" })
                return;
            }
            const deleteUsuario = await UsuarioModel.findByIdAndDelete(id)
            res.status(200).json({ deleteUsuario, msg: "Usuário deletado com sucesso!" })
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    }

}

module.exports = UsuarioController