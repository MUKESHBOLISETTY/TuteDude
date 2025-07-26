const errorHandler = (res) => {
    return res.status(500).json({
        success: false,
        message: "Error Occured"
    })
}

export default errorHandler;