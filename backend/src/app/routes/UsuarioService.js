const router = require("express").Router()
const UsuarioController = require("../controllers/UsuarioController")

router.route("/usuario").get((req,res) => UsuarioController.getAll(req,res))
router.route("/usuario/:id").get((req,res) => UsuarioController.getId(req,res))
router.route("/usuario").post((req,res) => UsuarioController.create(req,res))
router.route("/usuario/:id").put((req,res) => UsuarioController.update(req,res))
router.route("/usuario/:id").delete((req,res) => UsuarioController.delete(req,res))

module.exports = router