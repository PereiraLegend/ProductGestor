const mongoose = require("mongoose")
const { Schema } = mongoose
const PostSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    sistema: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Sistemas', required: true,
    }
}, { timestamps: true })

const Posts = mongoose.model("Posts", PostSchema)

module.exports = {
    Posts,
    PostSchema,
}