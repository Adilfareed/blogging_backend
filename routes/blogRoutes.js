const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

const {
    createBlog,
    getAllBlogs,
    getBlogById,
} = require('../controllers/blogController');

// Routes
router.post('/blogs', upload.single('image'), createBlog);
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);

module.exports = router;
