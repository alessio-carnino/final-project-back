import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import projectsRoutes from "./routes/projectsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
const { MONGO_URI } = process.env;
const PORT = process.env.PORT || 3000;

//creo il mio server
const app = express();

//middleware generici
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json());

//rotte
app.use("/projects", projectsRoutes);
app.use("/users", usersRoutes);

//connect MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected succesfully");
    app.listen(PORT, () => {
      console.log("Server running - listening on port 3000");
    });
  })
  .catch((err) => console.error(err));

export default app;
