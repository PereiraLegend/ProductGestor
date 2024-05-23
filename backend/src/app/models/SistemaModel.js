const mongoose = require("mongoose")
const { Schema } = mongoose
const SistemaSchema = new Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    descricao: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Sistemas = mongoose.model("Sistemas", SistemaSchema)

module.exports = {
    Sistemas,
    SistemaSchema,
}