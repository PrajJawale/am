import { resend } from "@/lib/resend";
import VerificationEmailTemplate  from "../../emails/VerificationEmailTemplate";
import { ApiResponse } from "../../types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
  ): Promise<ApiResponse> {
    try {
      await resend.emails.send({
        from: 'dev@prajwaljawale.com',
        to: email,
        subject: 'Mystery Message Verification Code',
        react: VerificationEmailTemplate({ username, otp: verifyCode }),
      });
      return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return { success: false, message: 'Failed to send verification email.' };
    }
  }

