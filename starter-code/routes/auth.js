const express = require('express');

const router = express.Router();

const User = require('../models/User');

router.get('/login', (req, res) => {
  res.render('public/login');
});

router.get('/signup', (req, res) => {
  res.render('public/signup');
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.render('public/signup', { errorMessage: 'Please fill both username and password fields' });
    return;
  }

  const user = await User.findOne({ username });
  if (user) {
    res.render('public/signup', { errorMessage: 'Username already in use' });
    return;
  }
  try {
    await User.create({ username, password });
    res.redirect('/login');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
