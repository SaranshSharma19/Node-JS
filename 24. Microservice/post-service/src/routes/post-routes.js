const express = require('express')
const {createPost} = require('../controllers/post-controller')
const {authenticateRequest} = require('../middleware/authMiddleware')

const router = express();

// MiddleWare -> This will tell if the user is auth user or not
router.use(authenticateRequest);

router.post("/create-post", createPost);

module.exports = router;