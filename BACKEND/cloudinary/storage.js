const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary')

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params: {
        folder: 'realtimepictures', 
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    },
});


const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = upload;