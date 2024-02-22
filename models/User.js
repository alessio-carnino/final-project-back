import { Schema, model } from "mongoose";
import validator from "validator";
import { comparePwd, hashPasssword } from "../library/authorizationHelper.js";
const { isEmail, isStrongPassword } = validator;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
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
    description: {
      type: String,
    },
    description_preview: {
      type: String,
    },
    cover_img: {
      type: String,
      default:
        "https://diabetestrialsctn.ie/wp-content/uploads/2023/06/Blank-Headshot.jpg",
    },
  },

  { timestamps: true }
);

const passwordCriteria = {
  minLength: 8,
  minLowerCase: 1,
  minUpperCase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

// STATICS for signUp
userSchema.statics.signUp = async function (
  email,
  password,
  first_name,
  last_name,
  user_name,
  profession_title,
  cover_img,
  description,
  description_preview
) {
  if (!isEmail(email)) {
    throw new Error(`${email} is not a valid email`);
  }

  if (!isStrongPassword(password, passwordCriteria)) {
    throw new Error(`Password is not strong enough`);
  }

  const emailExists = await this.exists({ email });
  if (emailExists) {
    const error = new Error(`${email} is already in use`);
    error.statusCode = 401;
    throw error;
  }

  const hashedPwd = await hashPasssword(password);

  const user = await this.create({
    email,
    password: hashedPwd,
    first_name,
    last_name,
    user_name,
    profession_title,
    cover_img,
    description,
    description_preview,
  });

  console.log({ user, description, description_preview });
  return user;
};

// STATICS for logIn
userSchema.statics.logIn = async function (email, password) {
  const user = await this.findOne({ email });
  const passwordMatch = await comparePwd(password, user.password);
  if (!user || !passwordMatch) {
    const error = new Error("Incorrect email or password");
    error.statusCode = 401;
    throw error;
  }
  return user;
};

const User = model("User", userSchema);

export default User;
