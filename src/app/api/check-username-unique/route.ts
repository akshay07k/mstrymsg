import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";
import { use } from "react";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect();
    
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        //  validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log("result: ", result);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                  success: false,
                  message: 'Invalid username',
                  errors: usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameter'
                },
                { status: 400 }
              );
        }

        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true})
        if(existingVerifiedUser){
            return Response.json(
                {
                  success: false,
                  message: 'Username is already taken',
                },
                { status: 400 }
              );
        }

        return Response.json(
            {
              success: true,
              message: 'Username is available',
            },
            { status: 200 }
          );
        
    } catch (error) {
        console.log("Error checking username: ", error);
        return Response.json(
            {
              success: false,
              message: 'Error checking username',
            },
            { status: 500 }
          );
    }
}