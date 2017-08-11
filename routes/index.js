const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Blog = require('../models/blog');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/blogs', (req, res, next) => {
  Blog.find((err, blogs) => {
    if(err) throw err;
    res.render('blog', { list: blogs, admin: false });
  });
});

module.exports = router;