const mongoose = require("mongoose")
const { Schema } = mongoose
const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    regra: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    sistema: [{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Sistemas'
        type: Array,
    }]
}, { timestamps: true })

const Usuarios = mongoose.model("Usuarios", UsuarioSchema)

module.exports = {
    Usuarios,
    UsuarioSchema,
}