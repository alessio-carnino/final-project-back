import express from "express";
import User from "../models/User.js";

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  console.log("ciao");
  try {
    let users = await User.find();
    users = users.map((u) => ({
      _id: u._id,
      user_name: u.user_name,
      profession_title: u.profession_title,
      cover_img: u.cover_img,
    }));
    res.send(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (user === null) {
      throw new Error("User not found");
    }
    delete user.password; //REMOVES THE PASSWORD FROM THE USER OBJECT
    res.send(user);
  } catch (err) {
    res.status(404).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.params.id });
    res.send("User seccessfully deleted");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.patch("/:id", async (req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
    res.status(400).send("You must enter a body with at least one property");
  }
  try {
    const user = await User.findOne({ _id: req.params.id });
    Object.entries(req.body).forEach(([key, value]) => {
      if (key !== "_id") {
        user[key] = value;
      }
    });
    await user.save();
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;
