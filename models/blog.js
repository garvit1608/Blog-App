const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  short_name: String,
  name: { type: String, required: true },
  short_desc: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;