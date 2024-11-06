import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

dotenv.config();

const app = express();
const port = 3000;

//Middleware
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";

// //Parent Router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);
app.use(notFound);
app.use(errorHandler);
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Aplikasi berjalan di port ${port}`);
});

//Koneksi Database
mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log("Database Berhasil Terhubung!");
});
