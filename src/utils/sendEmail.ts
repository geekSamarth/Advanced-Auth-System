import { Resend } from "resend";
import logger from "./logger";
const resend = new Resend(process.env.RESEND_API_KEY);
type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
};

export const sendMail = async ({
  to,
  subject,
  html,
}: SendEmailProps): Promise<void> => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
  });
  if (error) {
    throw new Error(error.message);
  }
  logger.info("Email sent successfully", data);
};
