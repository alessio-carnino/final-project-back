import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  category_name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
    trim: true,
  },
});

const Category = model("Category", categorySchema);

export default Category;
