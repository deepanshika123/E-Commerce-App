const router = require('express').Router();
const productCtrl = require('../controllers/productCtrl');

router.route('/product')
.get(productCtrl.getProducts)
.post(productCtrl.createProduct)

router.route('/product/:id')
.delete(productCtrl.deleteProduct)
.put(productCtrl.updateProduct)

module.exports = router;