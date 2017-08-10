const app = require('express');
const router = app.Router();
const Blog = require('../models/blog');

/**
 * Admin Middleware
 */

router.use((req, res, next) => {
  if(req.isAuthenticated()) {
    res.locals.login = req.isAuthenticated();
    next();
  } else {
    res.redirect('/');
  }
});

/**
 * Render new Blog
 */

router.get('/blogs/new', (req, res) => {
  res.render('blogs/new');
});

/**
 * return JSON all blogs
 */

router.get('/blogs', (req, res) => {
  // eval(pry.it)

  Blog.find((err, blogs) => {
    if(err) throw err;
    res.render('blog', {list: blogs});
  });
});

/**
 * Post Create Blog
 */

router.post('/blogs/create', (req, res) => {
  Blog.create(req.body, (err) => {
    if(err) throw err;

    res.json({ success: true });
  });
});

/**
 * Post Update Blog
 */

router.post('/blogs/:id/update', (req, res) => {
  console.log(req.body);
  Blog.findByIdAndUpdate(req.params.id, req.body, (err) => {
    if(err) throw err;

    res.redirect('/admin/blogs');
  });
});

/**
 * Post Delete Blog
 */

router.post('/blogs/:id/delete', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if(err) throw err;

    res.redirect('/admin/blogs');
  });
});


module.exports = router;