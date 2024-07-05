class ApiError extends Error{
    constructor(message, statusCode, errors, stack){
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.errors = errors;

        if (stack) {
            this.stack = stack
        } else {
            console.log("Something went wrong")
        }
    }
}

export default ApiError