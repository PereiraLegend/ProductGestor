const mongoose = require("mongoose")
const { Schema } = mongoose
const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    regra: {
        type: String, enum: ['Admin', 'Usuario'], default: 'Usuario'
    },
    sistema: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Sistemas'
    }]
}, { timestamps: true })

const Usuarios = mongoose.model("Usuarios", UsuarioSchema)

module.exports = {
    Usuarios,
    UsuarioSchema,
}