import nodemailer from "nodemailer";

import { Resend } from "resend";

const resend = new Resend("re_K5qeZB3S_HH7o3vZQk3fTvCZ9pweeXSfz");

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for port 465, false for other ports
//     auth: {
//       user: "abdallaroom7@gmail.com",
//       pass: "zbvh tszg pgxc pwym",
//     },
//     disableFileAccess: true,  // يمنع الكاش من الملفات
//     disableUrlAccess: true,
//   });

export const sendForgetPassowrdMessage = async (email, message) => {
  resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Forget your Password",
    html: `<b>
             please use this link to update your account password , notice that the link will get expired after 15 minutes <br/>
             link:<a href="${message}">${message}</a>
            </b>`, // html body
  });
  // await transporter.sendMail({
  //     from: "Al Madrasacom ", // sender address
  //     to: String(email), // list of receivers
  //     subject: "Forget your Password", // Subject line
  //     text: "forget password", // plain text body
  //     messageId:`<${new Date().getTime()}@gmail.com>`,
  //     html: `<b>
  //      please use this link to update your account password , notice that the link will get expired after 15 minutes <br/>
  //      link:<a href="${message}">${message}</a>
  //     </b>`, // html body
  //   });
  //   transporter.close();
};
