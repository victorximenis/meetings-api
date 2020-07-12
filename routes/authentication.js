var express = require('express');
var router = express.Router();

const AuthenticationController = require('../controllers/authentication-controller');

router.post('/', AuthenticationController.postAuthentication);

module.exports = router;