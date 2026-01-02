import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, userName, clientUrl) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.userName} <${sender.email}>`,
    to: email,
    subject: "Welcome to Nympho",
    html: createWelcomeEmailTemplate(userName, clientUrl),
  });

  if (error) {
    console.log("Error sending welcome email:", error);
    throw new Error(error);
  }

  console.log("Welcome Email sent successfully:", data);
};
