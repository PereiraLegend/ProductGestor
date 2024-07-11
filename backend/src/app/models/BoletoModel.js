const mongoose = require("mongoose")
const { Schema } = mongoose
const BoletoSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        unique: true
    },
    vencimento: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDENTE', 'VENCIDO', 'PAGO'],
        default: 'PENDENTE'
    },
    boletoAr: {
        type: String,
    }
}, { timestamps: true })

// Middleware para atualizar o status antes de salvar
BoletoSchema.pre('save', function (next) {
    if (this.status !== 'PAGO' && this.status === 'PENDENTE') {
        const vencimentoDate = new Date(this.vencimento);
        const currentDate = new Date();
        const calvencimento = vencimentoDate + 1
        if (currentDate > calvencimento) {
            this.status = 'VENCIDO';
        }
    }
    next();
});

// Middleware para atualizar o status antes de atualizar
BoletoSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.status !== 'PAGO' && update.status === 'PENDENTE') {
        const vencimentoDate = new Date(update.vencimento);
        const currentDate = new Date();
        if (currentDate > vencimentoDate) {
            update.status = 'VENCIDO';
        }
    }
    next();
});

const Boletos = mongoose.model("Boleto", BoletoSchema)

module.exports = {
    Boletos,
    BoletoSchema,
}