const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

router.route("/usuario/register").post((req, res) => UsuarioController.register(req, res))
router.route("/usuario/login").post((req, res) => UsuarioController.login(req, res))

router.route("/usuario/all").get(auth, adminAuth, (req, res) => UsuarioController.getAll(req, res))
router.route("/usuario/:id").get(auth, adminAuth, (req, res) => UsuarioController.getId(req, res))
router.route("/usuario/:id").delete(auth, adminAuth, (req, res) => UsuarioController.delete(req, res))
router.route("/usuario/:id").put(auth, adminAuth, (req,res) => UsuarioController.update(req,res))

module.exports = router