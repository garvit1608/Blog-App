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

router.post('/blog/create', (req, res) => {
  let blog = {};
  blog.sname = req.body.short_name,
  blog.name = req.body.name,
  blog.sdesc = req.body.short_desc,
  blog.content = req.body.content;

  Blog.create(blog, (err) => {
    if(err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;