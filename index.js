import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import projectsRoutes from "./routes/projectsRoutes.js";
import authorsRoutes from "./routes/authorsRoutes.js";
const { MONGO_URI } = process.env;

//creo il mio server
const app = express();

//middleware generici
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json());

//rotte
app.use("/projects", projectsRoutes);
app.use("/authors", authorsRoutes);

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
