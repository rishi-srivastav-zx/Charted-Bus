import nodemailer from "nodemailer";    

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (options) => {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.html
  });
};

export default { sendEmail };