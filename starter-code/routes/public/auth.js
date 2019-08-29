const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');

const saltRounds = 10;

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

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  try {
    await User.create({ username, password: hash });
    res.redirect('/login');
  } catch (error) {
    console.log(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.render('public/login', { errorMessage: 'Please fill both username and password fields' });
    return;
  }

  const user = await User.findOne({ username });
  if (!user) {
    res.render('public/login', { errorMessage: 'Username does not exist' });
    return;
  }

  if (bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    // redirect to private route
  } else {
    res.render('public/login', { errorMessage: 'Incorrect password' });
  }
});

module.exports = router;
