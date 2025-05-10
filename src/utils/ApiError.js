class ApiError extends Error {
    // this is classes of apiError
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        // overwriteing the classes
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.stack = stack || this.stack;
        this.success = false;//bcoz we are handlling api errors and not api responses 
        this.data = null;

        // Optional: Ensures this class shows up in stack traces
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
