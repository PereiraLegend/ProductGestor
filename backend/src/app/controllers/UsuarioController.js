const { Usuarios: UsuarioModel } = require('../models/UsuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UsuarioController = {
    register: async (req, res) => {
        const { nome, email, password, regra, sistema } = req.body;
        try {
            let usuario = await UsuarioModel.findOne({ email });
            if (usuario) {
                return res.status(400).json({ msg: 'Usuario já existe' });
            }
            usuario = new UsuarioModel({
                nome,
                email,
                password,
                regra,
                sistema,
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
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
            res.status(400).send("Erro ao registrar usuário");
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            let usuario = await UsuarioModel.findOne({ email });
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
                    nome: usuario.nome,
                    sistema: usuario.sistema
                },
            };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (error, token) => {
                if (error) throw error;
                res.json({ token, email, regra: usuario.regra, nome: usuario.nome, sistema: usuario.sistema });
            });
        } catch (error) {
            console.log(`Deu erro em ${error}`)
            res.status(400).send("Erro ao fazer o login");
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
            res.status(400).send("Erro ao procurar usuário")
        }
    },

    getAll: async (req, res) => {
        try {
            const usuarios = await UsuarioModel.find()
            res.status(200).json(usuarios)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
            res.status(400).send("Erro ao listar usuários")
        }
    },

    getMe: async (req, res) => {
        try {
            const token = req.header("Authorization").replace("Bearer", "")
            if (!token) {
                return res.status(401).json({ msg: "Token não encontrado" })
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (!decoded || !decoded.usuario || !decoded.usuario.id) {
                return res.status(401).json({ msg: "Token não fornecido ou não possui informações do usuário" })
            }

            const userId = decoded.usuario.id
            const sistemaId = decoded.usuario.sistema

            res.status(200).json({ id: userId, sistema: sistemaId })
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
            res.status(400).send("Erro ao buscar minhas informações")
        }
    },

    update: async (req, res) => {
        try {
            const id = req.params.id

            const usuario = {
                nome: req.body.nome,
                regra: req.body.regra,
                sistema: req.body.sistema
            }

            const updateUsuario = await UsuarioModel.findByIdAndUpdate(id, usuario)

            if (!updateUsuario) {
                res.status(404).json({ msg: "Usuario não encontrado" })
                return;
            }

            res.status(200).json({ updateUsuario, msg: "Usuario atualizado com sucesso!" })
        } catch (error) {
            console.log(`Deu erro em ${error}`)
            res.status(400).send("Erro ao atualizar usuário")
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
            res.status(400).send("Erro ao deletar usuário")
        }
    }

}

module.exports = UsuarioController