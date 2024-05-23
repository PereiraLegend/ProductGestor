const { Posts: PostsModel } = require("../models/PostsModel")

const PostsController = {
    getId: async (req, res) => {
        try {
            const id = req.params.id
            const posts = await PostsModel.findById(id)

            if (!posts) {
                res.status(404).json({ msg: "Post não encontrado!" })
                return;
            }

            res.status(200).json(posts)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    getAll: async (req, res) => {
        try {
            const posts = await PostsModel.find()
            res.status(200).json(posts)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    create: async (req, res) => {
        try {
            const posts = {
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                tags: req.body.tags,
                sistema: req.body.sistema,
            }

            const response = await PostsModel.create(posts)

            res.status(201).json({ response, msg: "Post cadastrado com sucesso!" })
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    update: async (req, res) => {
        try {
            const id = req.params.id

            const posts = {
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                tags: req.body.tags,
                sistema: req.body.sistema,
            }

            const updatePost = await PostsModel.findByIdAndUpdate(id, posts)

            if (!updatePost) {
                res.status(404).json({ msg: "Post não encontrado" })
                return;
            }

            res.status(200).json({ updatePost, msg: "Post atualizado com sucesso!" })
        } catch (error) {

        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id
            const post = await PostsModel.findById(id)
            if (!post) {
                res.status(404).json({ msg: "Post não encontrado" })
                return;
            }
            const deletePost = await PostsModel.findByIdAndDelete(id)
            res.status(200).json({ deletePost, msg: "Post deletado com sucesso!" })
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    }
}

module.exports = PostsController