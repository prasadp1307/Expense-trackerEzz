const express = require('express');

const router = express.Router();
const purchaseController = require('../controllers/purchaseController.js');
const userAuthentecation = require('../middleware/authentication.js');
const updateController = require('../controllers/updateController.js')


router.get('/premiumMembership',userAuthentecation.authenticate,purchaseController.purchasePremium);
router.post('/updateTransactionStatus',userAuthentecation.authenticate,updateController.updateTrans);

module.exports = router;
