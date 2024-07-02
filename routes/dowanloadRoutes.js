// const express = require('express');
// const userAuthentecation = require('../middleware/authentication.js');
// const downloadConstroller = require('../controllers/downloadController.js');
// // const purchaseController = require('../controllers/purchaseController.js');

// const router = express.Router();

// router.get('/getoldreports',userAuthentecation,downloadConstroller.getoldreports);
// router.get('/getfile', userAuthentecation, downloadConstroller.getfile);

// module.exports = router;

const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController'); // Ensure this path is correct
const userAuthentecation = require('../middleware/authentication'); // Ensure this path is correct

router.get('/getoldreports',userAuthentecation.authenticate,downloadController.getOldReports);
router.get('/getfile',userAuthentecation.authenticate ,downloadController.getFile);

module.exports = router;
