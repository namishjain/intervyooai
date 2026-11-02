export function getErrorMessage(error, fallback) {
    const serverMessage = error?.response?.data?.message
    if (typeof serverMessage === "string" && serverMessage.trim()) {
        return serverMessage
    }

    if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
        return "The request took too long. Please try again."
    }

    if (error?.isAxiosError && !error.response) {
        return "Unable to reach the server. Check your connection and try again."
    }

    const messagesByStatus = {
        400: "Some information is invalid. Check your entries and try again.",
        401: "Your session has expired. Please sign in again.",
        403: "You do not have permission to do that.",
        404: "The requested information could not be found.",
        413: "The uploaded file is too large.",
        429: "Too many requests. Please wait a moment and try again.",
    }

    return messagesByStatus[error?.response?.status] || fallback
}
