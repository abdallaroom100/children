
import express from "express"

import connectDb from "./models/config.js"

import homeRouter from "./routers/home.js"
import userRouter from "./routers/user.router.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import complaintsRouter from "./routers/complaint.router.js"
dotenv.config()
// Middlewares
const app = express();
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser())

// app.use("/compound", compoundRouter);
// app.use("/apartment", apartmentRouter);
app.use("/user", userRouter);
app.use("/", homeRouter);
app.use("/complaint",complaintsRouter)
// Routes
connectDb()
// connection
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening to port ${port}`));

 