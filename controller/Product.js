const Product  = require('../model/Product');

exports.addProduct = async(req,res)=>{
    try {
        if (req.files) {
            req.body.image = req.files.map(file => file.originalname);
        }
        const newProduct = await Product.create(req.body);
        res.status(200).json({
            status: 'Success',
            message: 'New Product Added Successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: 'Error Occured',
            error : error.message
        });
    }
}

exports.ViewProduct  = async (req,res) =>{
    try {
        const AllProduct = await Product.find();
        res.status(200).json({
            status: 'Success',
            message: 'Product Fetch Successfully',
            data: AllProduct
        });

    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: 'Error Occured',
            error : error.message
        });
    }
}


exports.SingleViewProduct  = async (req,res) =>{
    try {
        const id = req.params.id;
        const AllProduct = await Product.findById(id);
        res.status(200).json({
            status: 'Success',
            message: 'Product Fetch Successfully',
            data: AllProduct
        });

    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: 'Error Occured',
            error : error.message
        });
    }
}


exports.deleteProduct = async(req,res) =>{
    try {
        const id = req.params.id;
        const DeleteTask = await Product.deleteOne({_id : id});
        res.status(200).json({
            status: 'Success',
            message: 'Product Delete Successfully'
        });
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: 'Error Occured',
            error : error.message
        });
    }
}

// Delete Images Specific
exports.deleteProductImage = async (req, res) => {
    try {
        const id = req.params.id;
        const imageIndex = parseInt(req.params.index);

        let product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Product not found'
            });
        }

        if (imageIndex < 0 || imageIndex >= product.image.length) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Invalid image index'
            });
        }

        // Remove the image at the specified index
        product.image.splice(imageIndex, 1);

        // Save the updated product
        await product.save();

        res.status(200).json({
            status: 'Success',
            message: 'Image deleted successfully',
            data: product
        });
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: 'Error occurred',
            error: error.message
        });
    }
};



exports.updateProduct = async (req,res) =>{
    try {
        const id = req.params.id;
        let product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Product not found'
            });
        }

        if (req.files) {
            req.body.image = req.files.map(file => file.originalname);
        }

        // if (req.files) {
        //     const newImages = req.files.map(file => file.originalname);
        //     req.body.image = [...product.image, ...newImages];
        // }
        const newProduct = await Product.findByIdAndUpdate(id,req.body);
        res.status(200).json({
            status: 'Success',
            message: 'New Product Update Successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: 'Error Occured',
            error : error.message
        });
    }
}