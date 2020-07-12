var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');

const WorkshopsController = require('../controllers/workshops-controller');

router.get('/', WorkshopsController.getWorkshops);
router.get('/:id', WorkshopsController.getWorkshopById);
router.post('/', auth, WorkshopsController.postWorkshop);
router.put('/:id', auth, WorkshopsController.putWorkshop);
router.delete('/:id', auth, WorkshopsController.deleteWorkshop);

module.exports = router;