import express from "express";
import Category from "../models/Category.js";
import jwt from "jsonwebtoken";
const { SECRET_KEY } = process.env;

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
