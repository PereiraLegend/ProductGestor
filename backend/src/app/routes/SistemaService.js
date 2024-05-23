const router = require("express").Router()
const SistemaController = require("../controllers/SistemaController")
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

router.route("/sistema").get(auth, (req,res) => SistemaController.getAll(req,res))
router.route("/sistema/:id").get(auth, (req,res) => SistemaController.getId(req,res))
router.route("/sistema").post(auth, adminAuth, (req,res) => SistemaController.create(req,res))
router.route("/sistema/:id").put(auth, adminAuth, (req,res) => SistemaController.update(req,res))
router.route("/sistema/:id").delete(auth, adminAuth, (req,res) => SistemaController.delete(req,res))

module.exports = router