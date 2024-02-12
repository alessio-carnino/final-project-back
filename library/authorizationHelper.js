import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
// import User from "../models/User.js";
const { SECRET_KEY, PEPPER_KEY } = process.env;

export const hashPasssword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const pepperedPwd = process.env.PEPPER_KEY + password;
  const hashedPwd = bcrypt.hash(pepperedPwd, salt);
  return hashedPwd;
};

export const comparePwd = async (password, hashedPwd) => {
  const pepperedPwd = PEPPER_KEY + password;
  const match = await bcrypt.compare(pepperedPwd, hashedPwd);
  return match;
};

//payload... crea un token a signup e login
export const generateToken = (_id) => {
  const token = jwt.sign({ _id }, SECRET_KEY, { expiresIn: "365d" });
  return token;
};

export const requireAuthorization = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      const token = authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Token required");
      }

      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
          console.error(err);
          return res.sendStatus(403);
        }
        req.userId = String(user._id);
      });
    } catch (err) {
      console.error(err);
      return res.status(401).send(`Request is not authorized: ${err.message}`);
    }
    next();
  };
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM2MDFmOTk3N2ExZmM4M2IxZDAwMWUiLCJpYXQiOjE3MDc0NzU3MTIsImV4cCI6MTcwNzczNDkxMn0.VX2KiyXppU3dXXGFyTFg3v7WsEtISV5JT7EI2g1JmrY
