import nodemailer from "nodemailer";
import { DEV_EMAIL_ACC } from "../constants";

export async function sendEmail(to: string, html: string, subject: string) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: DEV_EMAIL_ACC,
  });

  // send mail with defined transport object
  transporter.sendMail(
    {
      from: DEV_EMAIL_ACC.user, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: html,
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );

  // console.log("Message sent: %s", info.messageId);
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
