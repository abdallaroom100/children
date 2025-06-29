import express from "express"

import connectDb from "./models/config.js"
import cors from "cors"
import path from "path"
import complaintsRouter from "./routers/complaint.router.js"
import userRouter from "./routers/user.router.js"
import bodyParser from "body-parser"
import { sendForgetPassowrdMessage } from "./utils/sendForgetrPassowrdMessage.js"
import dotenv from "dotenv"
import multer from "multer"



dotenv.config()
import {dirname} from "path"
import {fileURLToPath} from "url"

// Configure multer storag
// Middlewares
const app = express();
// sendForgetPassowrdMessage()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/user", userRouter);
app.use("/complaint",complaintsRouter)
// Routes

// Middleware لمعالجة أخطاء Multer وأخطاء رفع الملفات
app.use((err, req, res, next) => {
  // أخطاء Multer أو الفلتر
  if (err instanceof multer.MulterError || (typeof err.message === 'string' && err.message.startsWith("Only images (JPEG, PNG) and PDFs are allowed"))) {
    // استخراج اسم الملف إن وجد
    let fileName = "";
    if (err.message.includes(":")) {
      fileName = err.message.split(":")[1]?.trim();
    }
    return res.status(400).json({
      error: `فقط الصور (JPG, JPEG, PNG) وملفات PDF مسموح بها. الملف المرفوع${fileName ? ` (${fileName})` : ""} امتداده غير مدعوم.`
    });
  }
  // أخطاء أخرى
  res.status(500).json({ error: "حدث خطأ غير متوقع في السيرفر." });
});

connectDb()
// connection
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening to port ${port}`));

 