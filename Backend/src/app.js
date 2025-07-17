import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"));
app.use(cookieParser())

// routes import 
import userRouter from "./routers/user.router.js"
import propertyRouter from "./routers/property.router.js"
import subscriptionRouter from "./routers/subscription.routes.js"


//decleration routes
app.use("/api/user", userRouter)
app.use('/api/property', propertyRouter);
app.use("/api/subscription", subscriptionRouter)





export { app }