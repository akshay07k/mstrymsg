import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponse> {
    // console.log(email);
    
    try {
        const resendResponse = await resend.emails.send({
            from: 'Acme <noreply@mstrymsg.com>',
            to: [email],
            subject: "Mystry message | Verification code",
            react: VerificationEmail({username, otp: verifyCode}),
        });

        console.log(resendResponse);
        if(resendResponse?.error){
            throw new Error("Error sending verification email")
        }
    
    
        return {
            success: true,
            message: "Verification email send successfully"
        }
    } catch (emailError) {
        console.log("Error sending verification email");
        return {
            success: false,
            message: `${emailError}`
        }
    }
}