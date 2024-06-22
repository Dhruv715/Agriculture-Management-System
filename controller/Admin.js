const Admin = require('../model/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.addNewAdmin = async (req, res) => {
  const { Adminname, email, password, role } = req.body;
  try {
    // Check if the admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin instance
    admin = new Admin({
      Adminname,
      email,
      password: hashedPassword,
      role
    });

    // Save the admin to the database
    await admin.save();

    res.status(201).json({ 
        status: 'Success',
        msg: 'Admin created successfully'
    });
  } catch (err) {
    res.status(401).json({
        status: 'Failed',
        message: 'Error Occured',
        error : err.message
    });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Password' });
    }
    var token = await jwt.sign(admin.id,'token');
    res.status(201).json({
        status : 'Success',
        message : 'Admin Login Successfully',
        token
    });
  } catch (err) {
    res.status(401).json({
        status: 'Failed',
        message: 'Error Occured',
        error : err.message
    });
  }
};
