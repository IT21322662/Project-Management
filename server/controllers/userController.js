const bcrypt = require('bcrypt');
const User = require('../models/users');

// Signup user
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
}
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      message: 'User logged in successfully',
      token
    });
  } catch (error) {
    console.log('Error during login:', error);
    res.status(500).json({ error: 'Failed to login user' });
  }
}

module.exports = { signupUser, loginUser };
