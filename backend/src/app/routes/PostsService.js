const router = require("express").Router()
const PostsController = require("../controllers/PostsController")
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

router.route("/post").get(auth, (req,res) => PostsController.getAll(req,res))
router.route("/post/:id").get(auth, (req,res) => PostsController.getId(req,res))
router.route("/post").post(auth, adminAuth, (req,res) => PostsController.create(req,res))
router.route("/post/:id").put(auth, adminAuth, (req,res) => PostsController.update(req,res))
router.route("/post/:id").delete(auth, adminAuth, (req,res) => PostsController.delete(req,res))

module.exports = router