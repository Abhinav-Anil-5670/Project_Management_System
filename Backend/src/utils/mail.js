import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https:taskmanagelink.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from : "mail.taskmanager@example.com",
    to:options.email,
    subject : options.subject,
    text : emailTextual,
    html : emailHtml
  }

  try{
    await transporter.sendMail(mail)
  }
  catch(err){
    console.error("Email server failed", err)
  }
};

const emailVerificationMaingenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we are excited to have you onboard",
      action: {
        instructions:
          "To verify your email please click on the following button",
        button: {
          color: "#1aae5aff",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro: "Need Help, or have questions??",
    },
  };
};

const forgotPasswordMaingenContent = (username, PasswordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "Change password",
      action: {
        instructions: "You can reset your password",
        button: {
          color: "#1aae5aff",
          text: "Reset your password",
          link: PasswordResetUrl,
        },
      },
      outro: "Need Help, or have questions??",
    },
  };
};

export { emailVerificationMaingenContent, forgotPasswordMaingenContent, sendEmail };
