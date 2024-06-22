const User  = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.RegisterUser = async (req, res) => {
    try {
        const Emailcheck = await User.find({ email: req.body.email });

        if (Emailcheck.length > 0) {
            return res.status(409).json({
                status: 'Failed',
                message: 'Email Already Exists'
            });
        }
        req.body.password = await bcrypt.hash(req.body.password, 12);
        const Data = await User.create(req.body);
        
        res.status(201).json({
            status: 'Success',
            message: 'User Registered Successfully',
            data: Data
        });

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });
    }
};


exports.LoginUser = async (req,res) =>{
    try {
        const { email, password }  = req.body;
        const UserData = await User.findOne({ email });
        console.log(UserData);
        if(!UserData){
            return res.status(400).json({ msg: 'Email Does Not Exist' });
        }

        const isMatch = await bcrypt.compare(password, UserData.password);
        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid Password' });
        }
        var token = await jwt.sign(UserData.id,'token');
        res.status(201).json({
            status : 'Success',
            message : 'User Login Successfully',
            token
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error Occurred',
            error: error.message
        });
    }
}

exports.getData = async (req,res)=>{
    const token = req.headers.auth;
        if (!token) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Authorization token not provided',
            });
        }

    const decoded = jwt.verify(token, 'token'); 
    console.log(decoded)
}

