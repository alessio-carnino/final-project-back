import { Schema, SchemaTypes, model } from "mongoose";

const authorSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20,
    trim: true,
  },
  user_name: {
    type: String,
    trim: true,
  },
  profession_title: {
    type: String,
  },
  cover_img: {
    type: String,
    required: true,
    default: "https://source.unsplash.com/random/100×100/?headshot",
  },
});

const Author = model("Author", authorSchema);

export default Author;
