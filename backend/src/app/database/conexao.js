const mongoose = require('mongoose')

async function main() {
    try {
        mongoose.set("strictQuery", true)
        await mongoose.connect(`${process.env.MONGODB}`)
        console.log("Conectado ao banco de dados")
    } catch (error) {
        console.log(`Erro ao conectar ao banco de dados: ${error}`)
    }
}

module.exports = main