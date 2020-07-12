var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');

const UsersController = require('../controllers/users-controller');

router.get('/', auth, UsersController.getUsers);
router.get('/:id', auth, UsersController.getUserById);
router.post('/', auth, UsersController.postUser);
router.put('/:id', auth, UsersController.putUser);
router.delete('/:id', auth, UsersController.deleteUser);

module.exports = router;
