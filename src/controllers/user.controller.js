import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

// this User can call mongodb while chking if user already exists or not


// //fxn to register a user: below is a fixed syntax that we hv to use everytime
// const registerUser = asyncHandler(async (req, res) => {
//     // In JavaScript, especially in Express, once you send a response using res.json() or res.send(), the function doesn't need to return
//     /*You should use return if:1. You have more code after the response that you want to skip | 2. You're inside a conditional block*/
//     res.status(200).json({
//         // here instead of 200 any http status code u could write like400,403 etc. to show to the client...it totally depends on the backend engineer what he wants to show
//         message: "chai ausadsar code"
//     })
// })

const registerUser = asyncHandler(async (req, res) => {
    // & steps hi algorithm hote ha
    // steps called as algorithm for userRegister logic :
    //1. get user details from frontend
    //2. do validation if user has enterd data properly in corres. fields(phn->no.,email ->@,chk if fields are not empty etc.) ...these validations needs to be done in backend bcoz frontend might miss them sometimes
    //3. chk if user already exists: {existing username,email}
    //4. chk if images /avatar are uploaded
    //5. upload them to cloudinary: cloudinary file sends url in form of response ,chk mainly for avatar since its mandatory

    //& 6. create user object - create entry in db means: 
    // create user object for db collections - then create entry in db through db calls ( password: is usually hashed before saving)

    //7. remove password and refresh token field from response {You never want to send sensitive data like passwords or refresh tokens back to the frontend — it's unsafe! You remove these fields before sending the user object in the API response although the password would be encrypted and refreshtoken would be an empty field during user register time}

    //8. check for user creation
    //9. return response

    //&  now writing steps in form of fxns
    // req.body me sare details mil jati ha jab bhi requst body se aati ha

    // data can come from direct url,json or form //request.body se always data mil jayega except in case of url
    // note: Params is also a way to send data from frontend
    // but we will send data in postman through body(form/xform/rawdata(in json form))
    const { fullName, email, username, password } = req.body //req.body will store now user details
    console.log("body is : ", req.body);
    // console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === ""
            // If any one of the fields is empty (even just spaces), the if block runs.
        )
    ) {
        throw new ApiError(400, "All fields are required.")
        // the **new** keyword is used because ApiError is a class, and when you want to create an object (or instance) of a class in JavaScript, you use new.
    }
    if (!email.includes("@")) {
        throw new ApiError(400, "Invalid email. '@' symbol is missing.");
    }


    //& 2nd fxn: validating if user already exists
    // $or is a logical operator in MongoDB that allows you to specify multiple conditions, and at least one of them must be true for a document to match.
    // & both the username and email must be diff. from user.model.js

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists")
        // 409 Conflict
        // Meaning: The request could not be completed because it conflicts with the current state of the target resource.
    }

    // & chk if images /avatar are uploaded
    //req.body me sara data aata ha. in case we use middleware then it adds more fields to routes 
    // multer gives access to files
    // we may or may not hv access to files...so we check conditionally
    // TODO watch again : v14  31:38

    const avatarLocalPath = req.files?.avatar[0]?.path;//means if req.files is present ..then take 1st object from it and then take path from it
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    // if user don't uploads the cover image then cloudinary returns an empty string

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        // Makes sure that at least one coverImage file was uploaded
        coverImageLocalPath = req.files.coverImage[0].path
    }

    console.log(req.files);
    // since avatar is needed

    // A 400 Bad Request error is an HTTP status code that means:  "The server couldn't understand your request because it was malformed or missing required data."

    if (!avatarLocalPath) { //ye chking hogi if user has uploaded file or not
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath); //we need to wait a while until the file is uploaded on cloudinary ...it would take time
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);


    if (!avatar) { //ye chking hogi if cloudinary has sent response url or not successfully
        throw new ApiError(500, "Avatar upload failed. Please try again.")
    }
    //here we created userObject to store in db bcoz db me potential error can come up
    const user = await User.create({
        // & The user returned by User.create() is the saved document, and Mongoose automatically assigns and returns the _id (which MongoDB creates upon insertion). So the moment the user is created in MongoDB, you already have access to user._id.
        // JavaScript (ES6) provides a shorthand object property syntax. If the key and the variable name are the same, you can just write the key once.
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // ^ CORNER CASE: # safety measure: means if user provided coverImage then take its url else keep it empty
        email,
        password,
        username: username.toLowerCase(),//aise hi man kia toh we wanted ki db me lowercase me store ho
    })
    // mongodb stores with every entry in db an _id field
    //& chking if userData hs been uploaded in db or not AND REMOVING PASSWORD AND REFRSH TOKEN
    // TODO: Why exclude password and refreshToken?
    // These are sensitive fields that should never be sent to the frontend.Even though the password is hashed, it’s still best practice to keep it hidden from the client.
    // & We just created a user. Now, let’s go back to MongoDB and retrieve that same user using their unique _id, to confirm creation or get the fresh version.
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
        // 	Select all fields except password and refreshToken. The minus (-) sign means exclude those fields. by default all the fields are selected
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.")
    }

    // ! nxt step: if user gets properly created: send a response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully.")
    )
})

export { registerUser }