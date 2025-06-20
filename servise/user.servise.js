import Users from "../models/user.model.js";
require("dotenv").config();
import OTP from "../models/OTP.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const findUserBy = async (prop, value) => Users.findOne({ [prop]: value });

const createUser = async ({ email, userName, password }) => {
  return await Users.create({ userName, email, password });
};

const getOTP = async (email, purpose) => {
  const user = await Users.findOne({ email });
  if (!user) false;

  const exist = await OTP.findOne({ email, for: purpose });
  if (exist) false;

  return await OTP.create({ OTP: getCode(), for: purpose, email });
};

const verifyEmail = async (email, otp) => {
  const verified = await OTP.findOne({ email, OTP: otp, for: "register" });
  if (!verified) return false;

  const user = await Users.findOneAndUpdate({ email }, { isVerified: true });

  const data = {
    email: user.email,
    id: user._id,
  };

  await findOneAndDelete({
    email,
    OTP: otp,
    for: "register",
  });

  return {
    user,
    Authorization: await getToken(data),
  };
};

const login = async (email, password) => {
  let data = await Users.findOne({ email, isVerified: true });

  const comparePassword = await bcrypt.compare(password, data.password);

  if (!comparePassword) return false;

  const tokenData = {
    email: data?.email,
    id: data?._id,
  };

  return {
    data,
    Authorization: await getToken(tokenData),
  };
};

const allUsers = async (id) => await Users.find({ _id: { $ne: id } });

const delUser = async (userName) =>
  await Users.deleteOne({ userName: userName });

const findUserByID = async (id) => await Users.findById(id);

const updateUser = async (prop, value, updateFields) =>
  Users.findOneAndUpdate(
    { [prop]: value },
    { $set: updateFields },
    { new: true }
  );

const deleteFeand = async (id, userName) => {
  try {
    const deleteF = await Users.updateOne(
      { _id: id },
      { $pull: { freand: { userName: userName } } }
    );
    if (!deleteF)
      return res.status(404).send({ message: "Cannot Delete Your Frean" });

    return deleteF;
  } catch (error) {
    console.log(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

const unknownPeople = async (freandUserNames, id) => {
  try {
    const userNames = freandUserNames.map((user) => user.userName);

    const users = await Users.find({ userName: { $in: userNames } }, "_id");
    const userIds = users.map((user) => user._id);

    return await Users.find({
      _id: { $nin: [...userIds, id] },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

let getToken = async (body) =>
  jwt.sign(body, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRY,
  });

let getCode = () =>
  Math.floor(Math.random() * (9 * Math.pow(10, 4 - 1))) + Math.pow(10, 4 - 1);

export {
  findUserBy,
  createUser,
  getOTP,
  verifyEmail,
  login,
  allUsers,
  delUser,
  findUserByID,
  updateUser,
  deleteFeand,
  unknownPeople,
};
