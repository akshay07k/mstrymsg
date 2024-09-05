import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if(!session || !session.user){
        return Response.json(
            {
                sucess: false,
                message: 'Unauthorized'
            },
            { status: 401 }
        )
    }
    const user = session.user as User;
    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );

        if(!updatedUser){
            return Response.json(
                {
                    sucess: false,
                    message: 'Failed to update user status to accept messages'
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                sucess: true,
                message: 'Message acceptance status updated successfully'
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed to update user status to accept messages", error);
        
        return Response.json(
            {
                sucess: false,
                message: 'Failed to update user status to accept messages'
            },
            { status: 500 }
        )
        
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if(!session || !session.user){
        return Response.json(
            {
                sucess: false,
                message: 'Unauthorized'
            },
            { status: 401 }
        )
    }
    const user = session.user as User;
    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json(
                {
                    sucess: false,
                    message: 'User not found'
                },
                { status: 404 }
            )
        }
        return Response.json(
            {
                sucess: true,
                acceptMessages: foundUser.isAcceptingMessage
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed to get user status to accept messages", error);
        return Response.json(
            {
                sucess: false,
                message: 'Failed to get user status to accept messages'
            },
            { status: 500 }
        )
        
    }
}
