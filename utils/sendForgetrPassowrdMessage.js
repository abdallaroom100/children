import nodemailer from "nodemailer"



const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587, // استخدم 587 لـ TLS أو 465 لـ SSL
  secure: false, // خليها false مع port 587
  auth: {
    user: "88aafa001@smtp-brevo.com", // الـ SMTP Login
    pass: "ngfBVcOUF39D8GsS", // الـ Master Password
  },
});


  
export const sendForgetPassowrdMessage = async (email,message) =>{

  const mailOptions = {
    from: '"Al Madrasa" <abdallaroom25@gmail.com>',  // غيرها للبريد اللي مسجل به في Brevo
    to: email,
    subject: "Forget your Password", // Subject line
    html: `<b>
    please use this link to update your account password , notice that the link will get expired after 15 minutes <br/>
    link:<a href="${message}">${message}</a>
   </b>`, // html body
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
        
         

} 

// from: "Al Madrasacom ", // sender address
// to: String(email), // list of receivers
// subject: "Forget your Password", // Subject line
// text: "forget password", // plain text body
// html: `<b>
//  please use this link to update your account password , notice that the link will get expired after 15 minutes <br/>
//  link:<a href="${message}">${message}</a>
// </b>`, // html body