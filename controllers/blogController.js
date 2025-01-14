const Blog = require('../models/blogModel');

exports.createBlog = async (req, res) => {
    try {
        const { title, description } = req.body;
        // Save only the filename, not the full path
        const image = req.file ? req.file.filename : null;

        if (!title || !description || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const blog = new Blog({ title, description, image });
        await blog.save();

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
