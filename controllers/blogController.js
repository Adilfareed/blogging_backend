const Blog = require("../models/blogModel");
const supabase = require("../config/supabase");


exports.createBlog = async (req, res) => {
    try {
        console.log("Received Request:", req.body);
        console.log("Uploaded File:", req.file);

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(`blogs/${Date.now()}_${req.file.originalname}`, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (error) {
            console.error("Supabase Upload Error:", error);
            return res.status(500).json({ error: "Failed to upload to Supabase" });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .getPublicUrl(data.path);

        console.log("Uploaded Image URL:", publicUrlData.publicUrl);

        // Save blog to database
        const blog = new Blog({
            title: req.body.title,
            description: req.body.description,
            image: publicUrlData.publicUrl, // Store the image URL in DB
        });

        await blog.save();

        res.status(201).json({ message: "Blog created successfully!", blog });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Function to get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Function to get a blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Function to update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    let imageUrl = null;

    // If a new image is uploaded, replace the old one
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;
      const filePath = `${Date.now()}_${req.file.originalname}`;


      const { data, error } = await supabase.storage
        .from("blogs")
        .upload(filePath, buffer, {
          contentType: mimetype,
          upsert: false,
        });

      if (error) throw error;

      const { publicUrl } = supabase.storage.from("blogs").getPublicUrl(filePath);
      imageUrl = publicUrl;
    }

    const updatedData = {
      title,
      description,
      ...(imageUrl && { image: imageUrl }),
    };

    const blog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Function to delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
