const {Usuarios: UsuarioModel} = require("../models/UsuarioModel")

const UsuarioController = {
    getId: async(req,res) => {
        try {
            const id = req.params.id
            const usuarios = await UsuarioModel.findById(id)

            if(!usuarios){
                res.status(404).json({msg:"Usuário não encontrado!"})
                return;
            }
            
            res.status(200).json(usuarios)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    getAll: async(req,res) => {
        try {
            const usuarios = await UsuarioModel.find()
            res.status(200).json(usuarios)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    create: async(req,res) => {
        try{
            const usuarios = {
                nome: req.body.nome,
                password: req.body.password,
            }

            const response = await UsuarioModel.create(usuarios)

            res.status(201).json({response, msg: "Usuário cadastrado com sucesso!"})
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    update: async(req,res) => {
        try {
            const id = req.params.id

            const usuario = {
                nome: req.body.nome,
                password: req.body.password,
            }

            const updateUsuario = await UsuarioModel.findByIdAndUpdate(id, usuario)

            if (!updateUsuario) {
                res.status(404).json({msg:"Usuário não encontrado"})
                return;
            }

            res.status(200).json({updateUsuario, msg:"Usuário atualizado com sucesso!"})
        } catch (error) {
            
        }
    },

    delete: async(req,res) => {
        try {
            const id = req.params.id
            const usuario = await UsuarioModel.findById(id)
            if (!usuario) {
                res.status(404).json({msg:"Usuário não encontrado"})
                return;
            }
            const deleteUsuario = await UsuarioModel.findByIdAndDelete(id)
            res.status(200).json({deleteUsuario, msg: "Usuário deletado com sucesso!"})
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    }
}

module.exports = UsuarioController