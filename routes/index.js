var express = require('express');
const { addNewAdmin, loginAdmin } = require('../controller/Admin');
const { addCategory } = require('../controller/Category');
const { addProduct, ViewProduct, deleteProduct, updateProduct, deleteProductImage, SingleViewProduct } = require('../controller/Product');
var router = express.Router();
var multer = require('multer');
const { RegisterUser, LoginUser, getData } = require('../controller/User');
const { addCart, getCartDetails, RemoveProducFromtCart, updateProductQuantityInCart } = require('../controller/Cart');

const storage = multer.diskStorage({
  destination : function(req,res,cd){
          cd(null , './public/images');
  },
  filename : function (req,file,cd){
      cd(null ,file.originalname);
  }
})

const upload = multer({storage : storage});


// ADMIN ADD
router.post('/AddAdmin',addNewAdmin);

// LOGIN ADMIN
router.post('/',loginAdmin);

// ADD CATEGORY
router.post('/AddCategory',addCategory);

// ADD product
router.post('/add_product',upload.array('image',10),addProduct);

// View All Product Data
router.get('/view_product',ViewProduct);

// View Product Specific
router.get('/SingleViewProduct/:id',SingleViewProduct);

// DELETE PRODUCT
router.delete('/delete_product/:id',deleteProduct);

// UPDATE PRODUCT
router.patch('/updateProduct/:id',upload.array('image',10),updateProduct);

// DELETE PRODUCT IMAGES SPECIFIC
router.delete('/product/:id/image/:index',deleteProductImage);

// Register For New User
router.post('/RegisterUser',RegisterUser);

// LOGIN USER
router.post('/userlogin',LoginUser);

// Verify Token User
router.get('/getData',getData);

// Add Cart 
router.post('/AddTocart/:productId',addCart);

// Get Current Login User Cart And Total Amount
router.get('/getCartDetails',getCartDetails);

// Remove any Product Into Cart
router.post('/updateCartRemoveProduct/:productId',RemoveProducFromtCart);

// Update Any Perticular Product Qnantity into database
router.post('/UpdateQuantity/:productId',updateProductQuantityInCart);

// Get Bill Generate 
router.get('/getCartDetails',getCartDetails);

module.exports = router;
