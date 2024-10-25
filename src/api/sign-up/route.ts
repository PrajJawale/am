import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import bcrypt from 'bcrypt'


export async function POST(request: Request) {
    await dbConnect()  // to check the db is connected or not 

    try {
        const { username, email, password } = await request.json()

        //to check the userName already exist or not
        const existingUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        //At the time of signup if username already exist then dont  allowed to take that username
        if (existingUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exist"
                },
                { status: 400 }
            )
        }

        //To check the existing user by EnailId
        const existingUserByemail = await UserModel.findOne({
            email
        })
        //OTP
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserByemail) {
            if(existingUserByemail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already register with this email"
                    } ,
                    {
                        status:400
                    }
                )
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10)
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)
                existingUserByemail.password=hashedPassword;
                existingUserByemail.verifyCode = verifyCode;
                existingUserByemail.verifyCodeExpiry=expiryDate
                await existingUserByemail.save()

            }
        }

        //To register New user 
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []

            })

            await newUser.save()

        }

        //send verification code  
        const emailResponse = await sendVerificationEmail(
            username,
            email,
            password
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: "Username Already Taken"
            },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
            success: true,
            message: "User register successfully . Please verify your email"
            },
            { status: 500 }
        )



    } catch (error) {
        console.log("Error to send the message")
        return Response.json(
            {
                success: false,
                message: "Error to registring the User"
            },
            {
                status: 500
            }
        )
    }

}