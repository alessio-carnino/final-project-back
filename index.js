import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import projectRoutes from "./routes/projectRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
const { MONGO_URI } = process.env;

//creo il mio server
const app = express();

//middleware generici
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json());

//rotte
app.use("/projects", projectRoutes);
app.use("/authors", authorRoutes);

//connect MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected succesfully");
    app.listen(3000, () => {
      console.log("Server running - listening on port 3000");
    });
  })
  .catch((err) => console.error(err));

export default app;
