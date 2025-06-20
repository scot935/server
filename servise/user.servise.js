import {
  findOne,
  create,
  findOneAndUpdate,
  find,
  deleteOne,
  findById,
  updateOne,
} from "../models/user.model.js";
require("dotenv").config();
import {
  findOne as _findOne,
  create as _create,
  findOneAndDelete,
} from "../models/OTP.model.js";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";

const findUserBy = async (prop, value) => findOne({ [prop]: value });

const createUser = async ({ email, userName, password }) => {
  return await create({ userName, email, password });
};

const getOTP = async (email, purpose) => {
  const user = await findOne({ email });
  if (!user) false;

  const exist = await _findOne({ email, for: purpose });
  if (exist) false;

  return await _create({ OTP: getCode(), for: purpose, email });
};

const verifyEmail = async (email, otp) => {
  const verified = await _findOne({ email, OTP: otp, for: "register" });
  if (!verified) return false;

  const user = await findOneAndUpdate({ email }, { isVerified: true });

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
  let data = await findOne({ email, isVerified: true });

  const comparePassword = await compare(password, data.password);

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

const allUsers = async (id) => await find({ _id: { $ne: id } });

const delUser = async (userName) => await deleteOne({ userName: userName });

const findUserByID = async (id) => await findById(id);

const updateUser = async (prop, value, updateFields) =>
  findOneAndUpdate({ [prop]: value }, { $set: updateFields }, { new: true });

const deleteFeand = async (id, userName) => {
  try {
    const deleteF = await updateOne(
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

    const users = await find({ userName: { $in: userNames } }, "_id");
    const userIds = users.map((user) => user._id);

    return await find({
      _id: { $nin: [...userIds, id] },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

let getToken = async (body) =>
  sign(body, process.env.JWT_SECRET || "", {
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
