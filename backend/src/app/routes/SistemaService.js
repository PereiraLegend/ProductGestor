const router = require("express").Router()
const SistemaController = require("../controllers/SistemaController")
const auth = require('../middleware/auth')

router.route("/sistema").get(auth, (req,res) => SistemaController.getAll(req,res))
router.route("/sistema/:id").get(auth, (req,res) => SistemaController.getId(req,res))
router.route("/sistema").post(auth, (req,res) => SistemaController.create(req,res))
router.route("/sistema/:id").put(auth, (req,res) => SistemaController.update(req,res))
router.route("/sistema/:id").delete(auth, (req,res) => SistemaController.delete(req,res))

module.exports = router