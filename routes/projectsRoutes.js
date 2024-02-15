import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
const { SECRET_KEY } = process.env;

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    const newProject = new Project({ ...req.body, user });
    const result = await newProject.save();
    // const projects = await Project.find();
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const category = req.query.categories;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  try {
    let query = userId ? { user: userId } : {};
    if (category) {
      query.categories = category;
    }
    const totalProjects = await Project.countDocuments(query);
    const totalPages = Math.ceil(totalProjects / limit);

    const projects = await Project.find(query)
      .populate("user", "user_name -_id")
      .populate("categories")
      .skip((page - 1) * limit)
      .limit(limit);

    const response = {
      projects: projects.map((p) => ({
        _id: p._id,
        title: p.title,
        cover_img: p.cover_img,
        user: p.user.user_name,
        categories: p.category_name,
      })),
      currentPage: page,
      totalPages: totalPages,
    };

    res.send(response);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id })
      .populate(
        "user",
        "user_name cover_img profession_title description description_preview _id"
      )
      .populate("categories");

    if (project === null) {
      throw new Error("Not found");
    }
    res.send(project);
  } catch (err) {
    res.status(404).send("Server error");
  }
});

router.get("/:id/related", async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id }).populate(
      "user"
    );

    if (!project) {
      throw new Error("Project not found");
    }

    const relatedProjects = await Project.find({
      "user._id": project.user._id,
      _id: { $ne: project._id },
    }).select("_id title cover_img");

    res.send(relatedProjects);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id });

    if (String(project.user._id) === req.userId) {
      await Project.deleteOne({ _id: req.params.id });
      res.send("Project deleted successfully");
    } else {
      res.status(500).send("You are not authourized to delete this project");
    }
  } catch (e) {
    res.status(404).send(err.message);
  }
});

router.patch("/:id", async (req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
    res.status(400).send("You must enter a body with at least one property");
  }
  try {
    const project = await Project.findOne({ _id: req.params.id });

    if (String(project.user._id) === req.userId) {
      Object.entries(req.body).forEach(([key, value]) => {
        if (key !== "_id") {
          project[key] = value;
        }
      });
      await project.save();
      res.send("Project updated successfully");
    } else {
      res.status(500).send("You are not authourized to delete this project");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;
