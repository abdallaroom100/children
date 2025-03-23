// import nodemailer from "nodemailer"



// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587, // استخدم 587 لـ TLS أو 465 لـ SSL
//   secure: false, // خليها false مع port 587
//   auth: {
//     user: "88aafa001@smtp-brevo.com", // الـ SMTP Login
//     pass: "ngfBVcOUF39D8GsS", // الـ Master Password
//   },
// });


  
// export const sendForgetPassowrdMessage = async (email,message) =>{

//   const mailOptions = {
//     from: '"Al Madrasa" <abdallaroom25@gmail.com>',  // غيرها للبريد اللي مسجل به في Brevo
//     to: email,
//     subject: "Forget your Password", // Subject line
//     html: `<b>
//     please use this link to update your account password , notice that the link will get expired after 15 minutes <br/>
//     link:<a href="${message}">${message}</a>
//    </b>`, // html body
//   };
  
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log("Error:", error);
//     } else {
//       console.log("Email sent:", info.response);
//     }
//   });
        
         

// } 
import nodemailer from "nodemailer";

// إعداد Transporter مع تحسينات إضافية
const transporter = nodemailer.createTransport({
  pool: true, // تفعيل الاتصال المجمع
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "88aafa001@smtp-brevo.com", // الـ SMTP Login
    pass: "ngfBVcOUF39D8GsS", // الـ Master Password
  },
  maxConnections: 5, // الحد الأقصى لعدد الاتصالات
  maxMessages: 50, // عدد الرسائل لكل اتصال
  rateLimit: 10, // الحد الأقصى لعدد الرسائل في الثانية (لتجنب الحظر)
  connectionTimeout: 5000, // 5 ثوانٍ timeout للاتصال
  socketTimeout: 5000, // 5 ثوانٍ timeout للسوكت
  tls: {
    rejectUnauthorized: false, // لتجنب مشاكل الشهادات (اختياري)
  },
});

// التحقق من الاتصال عند بدء التطبيق
transporter.verify((error, success) => {
  if (error) {
    console.error("خطأ في الاتصال بـ SMTP:", error);
  } else {
    console.log("الاتصال بـ SMTP جاهز!");
  }
});

// دالة لإرسال رسالة نسيان كلمة المرور
export const sendForgetPassowrdMessage = async (email, message) => {
  const mailOptions = {
    from: '"Al Madrasa" <abdallaroom25@gmail.com>', // تأكد أن هذا البريد مُصرّح به في Brevo
    to: email,
    subject: "Forget your Password",
    html: `<b>
      Please use this link to update your account password. Notice that the link will expire after 15 minutes.<br/>
      Link: <a href="${message}">${message}</a>
    </b>`,
    headers: {
      "X-Priority": "1", // إعطاء الأولوية للرسالة
    },
  };

  // إضافة آلية إعادة المحاولة مع تأخير
  const maxRetries = 3;
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        console.error("Failed to send email after all retries:", error);
        return { success: false, error: error.message };
      }
      // الانتظار قبل المحاولة التالية (تأخير تصاعدي)
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
      attempt++;
    }
  }
};

// دالة لإغلاق الاتصال عند إغلاق التطبيق (اختياري)
export const closeTransporter = () => {
  transporter.close();
  console.log("Transporter closed.");
};

// استدعاء إغلاق الاتصال عند إغلاق التطبيق (اختياري)
process.on("SIGINT", () => {
  closeTransporter();
  process.exit();
});