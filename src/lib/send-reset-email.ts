import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const publicURL = process.env.PUBLIC_URL;

export const sendPasswordResetEmail = async (
    email: string,
    token: string,
  ) => {


    let resetLink = ""
    if (process.env.NODE_ENV === "production"){
      resetLink = `${publicURL}/new-password?token=${token}`
    } else {
      resetLink = `http://localhost:3000/new-password?token=${token}`
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password reset link",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    });
  };