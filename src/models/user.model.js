import mongoose, { mongo, Schema } from "mongoose";
// Destructuring = pulling out parts of an object or array and storing them in variables.
//{Schema} means  just pull out Schema from it directly (using destructuring)..so we don't need to do mongoose.Schema

// to make any field in db searchable in optimized manner , then make its index true like username ko use krke bahut searches hote ha
// sab fields ki indexing nhi krni else performance slows down
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
// direct encrypt krna is not possible so we take help of some mongoose hooks: pre hook

// ! note: don't use arrow fxn in pre middleware bcoz in pre we don't know the context 
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,//It will automatically remove extra spaces from the beginning and end of the string before saving it to the database.
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,//cloudinary url string
        required: true
    },
    coverImage: {
        type: String,//cloudinary url string
    },
    watchHistory: [
        // watchHistory is an array
        {
            // by default it will be 0
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        // refresh tokens are not required when the user registers
        // by default it will be empty
        type: String
    }
}, {
    timestamps: true //for createdAt and updatedAt
})

userSchema.pre("save", async function (next) {
    // password will be automaticlly encrypted while saving
    // this code is run only when the password field is modified
    if (!this.isModified("password")) return next;

    this.password = await bcrypt.hash(this.password, 10);//pswrd encrypt time also takes...so used await
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    // bcrypt libraray can both hash and chk the password
    return await bcrypt.compare(password, this.password);//returns true/false
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        // lhs is the name of payload and rhs is coming from the db
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
// refresh token has less info. than access token as it keeps on refreshing but both tokens has same syntax
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        // lhs is the name of payload and rhs is coming from the db
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

// jwt package has sign method which generates the token
export const User = mongoose.model("User", userSchema);
// ye export hua jo User ha it can directly contact the db
// this User can call mongodb in controller.js