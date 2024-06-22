const Cart = require('../model/Cart');
const jwt = require('jsonwebtoken');
const User  = require('../model/user');
const Product = require('../model/Product');
// All Cart related Controller
exports.addCart = async (req, res) => {
    try {
        const token = req.headers.auth;

        if (!token) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Authorization token not provided',
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, 'token'); 
        } catch (error) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token',
                error: error.message
            });
        }

        const userId = decoded; 
        const productId = req.params.productId;
        const { quantity } = req.body; 

        if (!productId || !quantity) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Missing product details',
            });
        }

          // Fetch product details based on productId
          const product = await Product.findById(productId);
          if (!product) {
              return res.status(404).json({
                  status: 'Failed',
                  message: 'Product not found',
              });
          }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                products: [{
                    productId,
                    name: product.name,
                    price: product.price,
                    quantity
                }]
            });
        } else {
            const existingProduct = cart.products.find(product => product.productId.toString() == productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ productId, name: product.name, price: product.price, quantity });
            }
        }

        await cart.save();

        res.status(200).json({
            status: 'Success',
            message: 'Cart updated successfully',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error occurred',
            error: error.message
        });
    }
};

exports.getCartDetails = async (req, res) => {
    try {
        const token = req.headers.auth;

        if (!token) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Authorization token not provided',
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, 'token'); // Replace with your actual secret key
        } catch (error) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token',
                error: error.message
            });
        }

        const userId = decoded; // Use user ID from the decoded token

        // Fetch user data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User not found',
            });
        }

        // Fetch cart data
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Cart not found',
            });
        }

        // Calculate total amount (in case it's not updated)
        cart.calculateTotal();

        res.status(200).json({
            status: 'Success',
            message: 'Cart retrieved successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                cart: {
                    products: cart.products,
                    totalAmount: cart.totalAmount
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error occurred',
            error: error.message
        });
    }
};

// Remove Any Perticular Product Into Cart
exports.RemoveProducFromtCart = async (req,res)=>{
    try {
        const token = req.headers.auth;

        if (!token) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Authorization token not provided',
            });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, 'token'); 
        } catch (error) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token',
                error: error.message
            });
        }

        const userId = decoded; 
        const productId = req.params.productId;

        // Find the user's cart and remove the product
        const result = await Cart.updateOne(
            { userId: userId },
            { $pull: { products: { productId: productId } } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Product not found in cart',
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Product removed from cart successfully',
        });

    } catch (error) {
            res.status(500).json({
                status : 'Failed',
                message : 'Error Eccured',
                error : error.message
            })
    }
}

// Update Product Quantity In Cart
exports.updateProductQuantityInCart = async (req, res) => {
    try {
        const token = req.headers.auth;

        if (!token) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Authorization token not provided',
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, 'token');
        } catch (error) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token',
                error: error.message
            });
        }

        const userId = decoded;
        const productId = req.params.productId;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Invalid quantity provided',
            });
        }
       
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Cart not found',
            });
        }

        const product = cart.products.find(product => product.productId.toString() === productId);

        if (!product) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Product not found in cart',
            });
        }

        product.quantity = quantity;

        await cart.save();

        res.status(200).json({
            status: 'Success',
            message: 'Product quantity updated successfully',
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error occurred',
            error: error.message
        });
    }
};

// Bill Generate
exports.getCartDetails = async (req, res) => {
    try {
        const token = req.headers.auth;

        if (!token) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Authorization token not provided',
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, 'token'); 
        } catch (error) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token',
                error: error.message
            });
        }

        const userId = decoded; 

        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User not found',
            });
        }

     
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Cart not found',
            });
        }

        if (!cart.totalAmount || cart.totalAmount === 0) {
            cart.totalAmount = cart.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
            await cart.save(); 
        }

        res.status(200).json({
            status: 'Success',
            message: 'Bill Generate successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                cart: {
                    products: cart.products,
                    totalAmount: cart.totalAmount
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error occurred',
            error: error.message
        });
    }
};