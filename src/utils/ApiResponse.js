class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        // HTTP status code (e.g., 200, 201, 404, etc.)
        this.statusCode = statusCode;

        // Actual data you want to return in the response
        this.data = data;

        // Message to explain the result (defaults to "Success")
        this.message = message;

        // Indicates success or failure: true if status is < 400, otherwise false
        this.success = statusCode < 400;
    }
}

export { ApiResponse }
