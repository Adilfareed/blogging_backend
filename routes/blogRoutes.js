const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} = require('../controllers/blogController');

// Routes
router.post('/blogs', upload.single('image'), createBlog);
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);
router.put('/blogs/:id', upload.single('image'), updateBlog); // Edit Blog
router.delete('/blogs/:id', deleteBlog); // Delete Blog

module.exports = router;
