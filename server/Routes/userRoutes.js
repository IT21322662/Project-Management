const express = require('express');
const { signupUser, loginUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware.');  // Correct the path to authmiddleware

const router = express.Router();

// Login route
router.post('/login', loginUser);

// Signup route
router.post('/signup', signupUser);

// Example of a protected route
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
