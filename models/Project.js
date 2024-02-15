import { Schema, SchemaTypes, model } from "mongoose";

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
    trim: true,
  },
  description: {
    type: String,
  },
  description2: {
    type: String,
  },
  cover_img: {
    type: String,
    required: true,
    default: "https://source.unsplash.com/random/300x300/?design",
  },
  img1: {
    type: String,
    default: "https://source.unsplash.com/random/900x900/?design",
  },
  img2: {
    type: String,
    default: "https://source.unsplash.com/random/900x900/?design",
  },
  user: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  categories: [
    {
      type: SchemaTypes.ObjectId,
      ref: "Category",
    },
  ],
});

const Project = model("Project", projectSchema);

export default Project;
