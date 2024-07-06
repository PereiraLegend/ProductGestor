const router = require("express").Router()
const BoletoController = require("../controllers/BoletoController")
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const upload = require("../config/multer")

router.route("/boleto").get(auth, adminAuth, (req,res) => BoletoController.getAll(req,res))
router.route("/boleto/:id").get(auth, (req,res) => BoletoController.getId(req,res))
//router.route("/boleto/titulo/:titulo/id").get(auth, (req, res) => BoletoController.getIdByName(req, res));
router.route("/boleto").post(upload.single("boletoAr"), auth, adminAuth, (req,res) => BoletoController.create(req,res))
router.route("/boleto/:id").put(upload.single("boletoAr"), auth, adminAuth, (req,res) => BoletoController.update(req,res))
router.route("/boleto/:id").delete(auth, adminAuth, (req,res) => BoletoController.delete(req,res))
router.route("/boleto/:id/download").get(auth, (req, res) => BoletoController.downloadFile(req, res));

module.exports = router