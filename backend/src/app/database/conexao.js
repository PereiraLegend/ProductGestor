const mongoose = require('mongoose')

async function main() {
    try {
        mongoose.set("strictQuery", true)
        await mongoose.connect("mongodb://localhost:27017/desenvolvimentobd")
        console.log("Conectado ao banco de dados")
    } catch (error) {
        console.log(`Erro: ${error}`)
    }
}

module.exports = main