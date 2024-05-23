const {Sistemas: SistemaModel} = require("../models/SistemaModel")

const SistemaController = {
    getId: async(req,res) => {
        try {
            const id = req.params.id
            const sistemas = await SistemaModel.findById(id)

            if(!sistemas){
                res.status(404).json({msg:"Sistema não encontrado!"})
                return;
            }
            
            res.status(200).json(sistemas)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    getAll: async(req,res) => {
        try {
            const sistemas = await SistemaModel.find()
            res.status(200).json(sistemas)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    create: async(req,res) => {
        try{
            const sistemas = {
                nome: req.body.nome,
                descricao: req.body.descricao,
            }

            const response = await SistemaModel.create(sistemas)

            res.status(201).json({response, msg: "Sistema cadastrado com sucesso!"})
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    update: async(req,res) => {
        try {
            const id = req.params.id

            const sistema = {
                nome: req.body.nome,
                descricao: req.body.descricao,
            }

            const updateSistema = await SistemaModel.findByIdAndUpdate(id, sistema)

            if (!updateSistema) {
                res.status(404).json({msg:"Sistema não encontrado"})
                return;
            }

            res.status(200).json({updateSistema, msg:"Sistema atualizado com sucesso!"})
        } catch (error) {
            
        }
    },

    delete: async(req,res) => {
        try {
            const id = req.params.id
            const sistema = await SistemaModel.findById(id)
            if (!sistema) {
                res.status(404).json({msg:"Sistema não encontrado"})
                return;
            }
            const deleteSistema = await SistemaModel.findByIdAndDelete(id)
            res.status(200).json({deleteSistema, msg: "Sistema deletado com sucesso!"})
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    }
}

module.exports = SistemaController