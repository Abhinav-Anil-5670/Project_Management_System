import {asyncHandler} from '../utils/async-handler.js'
import {ApiError} from '../utils/api-error.js'
import {ApiResponse} from '../utils/api-response.js'
import {User} from '../models/user.model.js'
import { sendEmail, emailVerificationMaingenContent } from '../utils/mail.js'

const registerUser  = asyncHandler (async (req,res)=>{
    const {username, password, email, role} = req.body

    //check if a user already exists
    const existingUser = await User.findOne({
        $or :[{username}, {email}]
    })

    if(existingUser) throw new ApiError(409, "User Already Exists", [])

    //create a new entry

    const user = await User.create({
        username, password, email, isEmailVerified : false
    })

    const { unhashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave : true})

    await sendEmail({
        email: user?.email,
        subject: "Please verify your mail",
        mailgenContent: emailVerificationMaingenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        )
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    if (!createdUser) throw new ApiError(409, "Something went wrong while creating a user",[])

    return res.status(200).json(
         new ApiResponse(200, createdUser, "User Created and Registered" )
    )

})

export {registerUser}