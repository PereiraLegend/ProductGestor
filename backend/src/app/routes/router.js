const router = require("express").Router()
const sRouter = require("./SistemaService")
const uRouter = require("./UsuarioService")
const pRouter = require("./PostsService")

router.use("/", pRouter)
router.use("/", sRouter)
router.use("/", uRouter)
module.exports = router