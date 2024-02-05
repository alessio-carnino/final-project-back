import express from "express";
import Project from "../models/Project.js";
import Author from "../models/Author.js";

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    const authors = await Author.find();
    res.send(authors);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const authors = await Author.find().select("projects");
    res.send(authors);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

export default router;
