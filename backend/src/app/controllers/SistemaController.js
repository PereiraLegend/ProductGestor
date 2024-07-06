const { Sistemas: SistemaModel } = require("../models/SistemaModel")
const path = require('path');
const fs = require('fs')

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

    getIdByName: async (req,res) => {
        try {
            const { nome } = req.params;
            const sistema = await SistemaModel.findOne({ nome });

            if (!sistema) {
                return res.status(404).json({ msg: "Sistema não encontrado!" });
            }

            res.status(200).json({ id: sistema._id });
        } catch (error) {
            console.error(`Erro ao buscar ID do sistema pelo nome: ${error}`);
            res.status(400).send("Erro ao buscar ID do sistema pelo nome");
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

    // update: async (req, res) => {
    //     try {
    //         const id = req.params.id

    //         const file = req.path

    //         const sistema = {
    //             nome: req.body.nome,
    //             descricao: req.body.descricao,
    //             documentacaoAr: file.path
    //         }

    //         const updateSistema = await SistemaModel.findByIdAndUpdate(id, sistema)

    //         if (!updateSistema) {
    //             res.status(404).json({ msg: "Sistema não encontrado" })
    //             return;
    //         }

    //         res.status(200).json({ updateSistema, msg: "Sistema atualizado com sucesso!" })
    //     } catch (error) {
    //         console.log(`Erro ao atualizar o sistema: ${error}`)
    //         res.status(400).send("Erro ao atualizar sistema")
    //     }
    // },

    update: async (req, res) => {
        try {
            const id = req.params.id;

            let sistema = {
                nome: req.body.nome,
                descricao: req.body.descricao
            };

            // Verifica se há um novo arquivo para ser atualizado
            // if (req.file) {
            //     sistema.documentacaoAr = req.file.path;
            // }

            if (req.file) {
                // Se um novo arquivo foi enviado, exclua o arquivo antigo
                const sistemaAntigo = await SistemaModel.findById(id);
                if (sistemaAntigo.documentacaoAr) {
                    fs.unlinkSync(sistemaAntigo.documentacaoAr);
                }
                sistema.documentacaoAr = req.file.path;
            }

            const updateSistema = await SistemaModel.findByIdAndUpdate(id, sistema, { new: true });

            if (!updateSistema) {
                return res.status(404).json({ msg: "Sistema não encontrado" });
            }

            res.status(200).json({ updateSistema, msg: "Sistema atualizado com sucesso!" });
        } catch (error) {
            console.error(`Erro ao atualizar o sistema: ${error}`);
            res.status(400).send("Erro ao atualizar sistema");
        }
    },

    downloadFile: async (req, res) => {
        try {
            const id = req.params.id;
            const sistema = await SistemaModel.findById(id);
    
            if (!sistema || !sistema.documentacaoAr) {
                return res.status(404).json({ msg: "Arquivo não encontrado!" });
            }
    
            const filePath = path.resolve(sistema.documentacaoAr);
            res.download(filePath);
        } catch (error) {
            console.log(`Erro ao baixar arquivo: ${error}`);
            res.status(400).send("Erro ao baixar arquivo");
        }
    },

    // delete: async (req, res) => {
    //     try {
    //         const id = req.params.id
    //         const sistema = await SistemaModel.findById(id)
    //         if (!sistema) {
    //             res.status(404).json({ msg: "Sistema não encontrado" })
    //             return;
    //         }
    //         const deleteSistema = await SistemaModel.findByIdAndDelete(id)
    //         res.status(200).json({ deleteSistema, msg: "Sistema deletado com sucesso!" })
    //     } catch (error) {
    //         console.log(`Deu erro em: ${error}`)
    //         res.status(400).send("Erro ao deletar sistema")
    //     }
    // }

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const sistema = await SistemaModel.findById(id);
    
            if (!sistema) {
                return res.status(404).json({ msg: "Sistema não encontrado" });
            }
    
            // Excluir arquivo se existir
            if (sistema.documentacaoAr) {
                const filePath = path.resolve(sistema.documentacaoAr);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(`Erro ao deletar arquivo: ${err}`);
                    }
                });
            }
    
            const deleteSistema = await SistemaModel.findByIdAndDelete(id);
            res.status(200).json({ deleteSistema, msg: "Sistema deletado com sucesso!" });
        } catch (error) {
            console.log(`Erro ao deletar sistema: ${error}`);
            res.status(400).send("Erro ao deletar sistema");
        }
    }
    
}

module.exports = SistemaController