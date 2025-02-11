const multer = require('multer');

const storage = multer.memoryStorage(); // Store file in memory

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit: 5MB
    fileFilter,
});

module.exports = upload;
