const app = require('express');
const router = app.Router();
const Blog = require('../models/blog');


/**
 * return JSON all blogs
 */

router.get('/blogs', (req, res) => {
  Blog.find((err, blogs) => {
    if(err) throw err;
    res.json(blogs);
  });
});

/**
 * Post Create Blog
 */

router.post('/blog/create', (req, res) => {
  Blog.create(req.body, (err) => {
    if(err) throw err;

    res.json({ success: true });
  });
});

/**
 * Post Update Blog
 */

router.post('/blog/:id/update', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body, (err) => {
    if(err) throw err;

    res.json({ success: true });
  });
});

module.exports = router;