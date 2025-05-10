// this will just create a mthd and export it

// A higher order function in JavaScript is a function that takes another function as an argument or returns a function.

//* 2nd mthd: using promises: IMP
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};

// This is a higher order function that wraps your async controller functions and automatically handles errors by forwarding them to the next() middleware.


export { asyncHandler }





//* 1st mthd :using try-catch
/*
// ! here asyncHandler is  a higher order fxn
// const asyncHandler = (fn) => {}
// const asyncHandler = (fn) => {()=>{}}
// const asyncHandler = (fn) = () => { } //just removed brackts here
// below we hv made it a async fxn

// ye fxn db se bat krne ke lie banaya gya ha in utils for increasing code reusability kyuki we need to talk to database numerous times so code becomes lengthy
const asyncHandler = (fn) = async (req, res, next) => {
    //  We can write this function using either async - await with try-catch, or with Promises using.then().catch().

    try {
        await fn(req, res, next)
    } catch (err) {
        res.status(err.code || 500).json({
            sucess: false,
            message: err.message
        })
        // * asynchandler is called a wrapper fxn which we will use everywhere
    }
}
export { asyncHandler }

*/