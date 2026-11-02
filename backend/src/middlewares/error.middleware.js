function notFoundHandler(req, res) {
    res.status(404).json({
        message: "The requested API endpoint was not found."
    })
}

function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error)
    }

    let status = Number(error.statusCode || error.status)
    let message = error.userMessage

    if (error.name === "MulterError") {
        if (error.code === "LIMIT_FILE_SIZE") {
            status = 413
            message = "Your resume is too large. Upload a PDF no larger than 3 MB."
        } else {
            status = 400
            message = "The uploaded file could not be processed. Please choose a PDF resume."
        }
    } else if (error.type === "entity.parse.failed") {
        status = 400
        message = "The request contains invalid JSON."
    } else if (error.type === "entity.too.large") {
        status = 413
        message = "The request is too large. Please reduce the amount of submitted information."
    } else if (error.name === "ValidationError") {
        status = 400
        message = Object.values(error.errors)[0]?.message || "Some submitted information is invalid."
    } else if (error.name === "CastError") {
        status = 400
        message = "The interview report ID is invalid."
    } else if (error.code === 11000) {
        status = 409
        message = "An account with these details already exists."
    }

    if (!Number.isInteger(status) || status < 400 || status > 599) {
        status = 500
    }

    if (!message) {
        message = status >= 500
            ? "Something went wrong on our end. Please try again."
            : error.message || "The request could not be completed."
    }

    if (status >= 500) {
        console.error("API request failed", error)
    }

    return res.status(status).json({message})
}

module.exports = {notFoundHandler, errorHandler}
