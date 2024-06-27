const router = require("express").Router()
const SistemaController = require("../controllers/SistemaController")
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const upload = require("../config/multer")

router.route("/sistema").get(auth, (req,res) => SistemaController.getAll(req,res))
router.route("/sistema/:id").get(auth, (req,res) => SistemaController.getId(req,res))
router.route("/sistema").post(upload.single("documentacaoAr"), auth, adminAuth, (req,res) => SistemaController.create(req,res))
router.route("/sistema/:id").put(upload.single("documentacaoAr"), auth, adminAuth, (req,res) => SistemaController.update(req,res))
router.route("/sistema/:id").delete(auth, adminAuth, (req,res) => SistemaController.delete(req,res))
router.route("/sistema/:id/download").get(auth, (req, res) => SistemaController.downloadFile(req, res));

module.exports = router