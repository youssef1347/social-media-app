
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ensure uploads directory exists when using disk storage
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (err) {
        console.error('Failed to create uploads directory:', err.message);
    }
}

// use disk storage locally, memory storage in production (e.g. Vercel)
const storage = process.env.NODE_ENV === 'production'
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });

module.exports = { uploads: multer({ storage }) };