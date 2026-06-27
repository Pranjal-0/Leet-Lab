import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "../src/routes/auth.routes.js";
import problemRoutes from "../src/routes/problem.routes.js";

dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
const app = express();

app.use(cookieParser());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("welcome to leetLab")
})

app.use("/api/v1/auth" , authRoutes);


app.listen(8080,()=>{
    console.log(`Server is ruuning at port:${process.env.PORT}`)
})