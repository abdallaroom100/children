
import express from "express"

import connectDb from "./models/config.js"
import compoundRouter from "./routers/compound.router.js"
import apartmentRouter from "./routers/apartment.router.js"
import userRouter from "./routers/user.router.js"
import cors from "cors"
import cookieParser from "cookie-parser"
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
app.use("/api/v1/user", userRouter);
// Routes
connectDb()
// connection
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening to port ${port}`));

