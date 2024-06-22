const Category = require('../model/Category');
// All Category Related Controller
exports.addCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const category = new Category({
        name,
        description
      });
  
      // Save the category to the database
      await category.save();
  
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the category' });
    }
  };