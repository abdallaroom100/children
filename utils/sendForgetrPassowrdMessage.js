import nodemailer from "nodemailer"



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "abdallaroom7@gmail.com",
      pass: "zbvh tszg pgxc pwym",
    },
  });


  
export const sendForgetPassowrdMessage = async (email,message) =>{

        await transporter.sendMail({
            from: "Al Madrasacom ", // sender address
            to: String(email), // list of receivers
            subject: "Forget your Password", // Subject line
            text: "forget password", // plain text body
            html: `<b>
             please use this link to update your account password , notice that the link will get expired after 15 minutes <br/>
             link:<a href="${message}">${message}</a>
            </b>`, // html body
          });

        
         

}