import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1) Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2) Define Email options
  const mailOptions = {
    from: "Shahzeb Abro <shahzeb@invocraft.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email with nodemailer
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
