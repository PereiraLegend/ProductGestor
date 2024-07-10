const mongoose = require("mongoose")
const { Schema } = mongoose
const BoletoSchema = new Schema({
    titulo: {
        type: String,
        required: true,
    },
    vencimento: {
        type: String,
        required: true
    },
    usuario: [{
        type: Array,
    }],
    boletoAr: {
        type: String,
    }
}, { timestamps: true })

const Boletos = mongoose.model("Boleto", BoletoSchema)

module.exports = {
    Boletos,
    BoletoSchema,
}