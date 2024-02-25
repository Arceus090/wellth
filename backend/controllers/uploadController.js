const uploadController = require('express').Router()
const multer = require("multer")
const verifyToken = require('../middleware/verifyToken')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.filename)
    }
})

const upload = multer({
    storage: storage
})

uploadController.post('/image', verifyToken, upload.single('image'), async (req, res) => {
    try {
        return res.status(200).json({ msg: "Image successfully uploaded" });
    } catch (error) {

        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = uploadController;
