const { Sistemas: SistemaModel } = require("../models/SistemaModel")
const path = require('path');

const SistemaController = {
    getId: async (req, res) => {
        try {
            const id = req.params.id
            const sistemas = await SistemaModel.findById(id)

            if (!sistemas) {
                res.status(404).json({ msg: "Sistema não encontrado!" })
                return;
            }

            res.status(200).json(sistemas)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
            res.status(400).send("Erro ao listar sistema")
        }
    },

    getAll: async (req, res) => {
        try {
            const sistemas = await SistemaModel.find()
            res.status(200).json(sistemas)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
            res.status(400).send("Erro ao listar sistemas")
        }
    },

    create: async (req, res) => {
        try {

            const file = req.file

            const sistemas ={
                nome: req.body.nome,
                descricao: req.body.descricao,
                documentacaoAr: file.path,
            }

            const response = await SistemaModel.create(sistemas)

            res.status(201).json({ response, msg: "Sistema cadastrado com sucesso!" })
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
            res.status(400).send("Erro ao criar sistema")
        }
    },

    update: async (req, res) => {
        try {
            const id = req.params.id

            const sistema = {
                nome: req.body.nome,
                descricao: req.body.descricao,
                documentacaoAr: req.body.documentacaoAr
            }

            const updateSistema = await SistemaModel.findByIdAndUpdate(id, sistema)

            if (!updateSistema) {
                res.status(404).json({ msg: "Sistema não encontrado" })
                return;
            }

            res.status(200).json({ updateSistema, msg: "Sistema atualizado com sucesso!" })
        } catch (error) {
            console.log(`Erro ao atualizar o sistema: ${error}`)
            res.status(400).send("Erro ao atualizar sistema")
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id
            const sistema = await SistemaModel.findById(id)
            if (!sistema) {
                res.status(404).json({ msg: "Sistema não encontrado" })
                return;
            }
            const deleteSistema = await SistemaModel.findByIdAndDelete(id)
            res.status(200).json({ deleteSistema, msg: "Sistema deletado com sucesso!" })
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
            res.status(400).send("Erro ao deletar sistema")
        }
    }
}

module.exports = SistemaController