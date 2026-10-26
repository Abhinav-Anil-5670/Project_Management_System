import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new Schema(
    {
        avatar: {
            type: {
                url: String,
                localPath: String
            },
            default: {
                url: `https://placehold.co/200x200`,
                localPath: ""
            }
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
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
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        },
        forgotPasswordToken: {
            type: String
        },
        forgotPasswordExpiry: {
            type: Date
        },
        emailVerificationToken: {
            type: String
        },
        emailVerificationExpiry: {
            type: Date
        }
    }, {
    timestamps: true
}
)

//To run this everytime an account is created or when password is changed
userSchema.pre("save", async function(){
    
    if(!this.isModified(this.password)) return
    else this.password = await bcrypt.hash(this.password, 10)
})

//Other Custom Methods - 

//to check password while logging in

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn : process.env.ACCESS_TOKEN_EXPIRY }
)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id : this.id
        },
        process.env.ACCESS_REFRESH_SECRET,
        { expiresIn: process.env.ACCESS_REFRESH_EXPIRY }
    )
}

//Temporary token for verifying the user or password reset
userSchema.methods.generateTemporaryToken = function () {
    const unhashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto
        .createHash("sha256")
        .update(unhashedToken)
        .digest("hex")

    const tokenExpiry = Date.now() + (20 * 60 * 1000) //20 mins
    return { unhashedToken, hashedToken, tokenExpiry }
}

export const User = mongoose.model("User", userSchema)