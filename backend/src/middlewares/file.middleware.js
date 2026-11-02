const multer = require("multer")

const upload = multer({
    storage:multer.memoryStorage(),
    fileFilter(req, file, callback) {
        if (file.mimetype !== "application/pdf") {
            const error = new Error("Please upload your resume as a PDF file.")
            error.statusCode = 400
            error.userMessage = error.message
            return callback(error)
        }
        return callback(null, true)
    },
    limits:{
        fileSize:3*1024*1024 // 3MB
    }
})

module.exports = upload