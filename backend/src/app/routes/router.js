const router = require("express").Router()
const sRouter = require("./SistemaService")
const uRouter = require("./UsuarioService")
const aRouter = require("./auth")

router.use("/", aRouter)
router.use("/", sRouter)
router.use("/", uRouter)
module.exports = router