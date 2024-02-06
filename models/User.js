import { Schema, SchemaTypes, model } from "mongoose";

const userSchema = new Schema({
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
    required: true,
    minLength: 1,
    maxLength: 50,
    trim: true,
  },
  profession_title: {
    type: String,
  },
  cover_img: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);

export default User;
