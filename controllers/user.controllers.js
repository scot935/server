const {
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
} = require("../servise/user.servise");
const {
  validateRegisterInput,
  validateRegisterEmail,
  validateLoginInput,
  validateUserName,
  validateEmail,
  validatePassword,
} = require("../validations/user.validations");
const {
  createVerificationEmail,
  sendMail,
} = require("../servise/email.servise");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    let data = req.body;
    const { error } = validateRegisterInput(data);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const existingUser = await findUserBy("email", data.email);
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "Email already registered. Choose another email." });
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    data.password = hashPassword;

    const newUser = await createUser(data);

    const OTP = await getOTP(newUser.email, "register");

    if (!OTP) {
      return res.status(400).send({ message: "Error generating OTP." });
    }

    const verificationEmail = createVerificationEmail(newUser.email, OTP);
    try {
      await sendMail(verificationEmail);
      return res
        .status(200)
        .send({ message: "Success", email: newUser.email, OTP: OTP });
    } catch (error) {
      return res.status(503).send({
        message: `Unable to send an email to ${newUser.email}. Please try again later.`,
      });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal Server Error");
  }
};

const verifyUser = async (req, res) => {
  const { error } = validateRegisterEmail(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const data = req.body;

  try {
    const verified = await verifyEmail(data.email, data.OTP);
    if (!verified)
      return res.status(400).send({ message: "Invalid OTP or Email!" });

    return res.status(200).send({ message: "Success", verified });
  } catch (error) {
    return res.status(500).send("An unexpected error occurred");
  }
};

const loginUser = async (req, res) => {
  const { error } = validateLoginInput(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const data = req.body;

  try {
    const isLogin = await login(data.email, data.password);
    if (!isLogin)
      return res.status(400).send({ message: "Invalid email or password" });

    return res.status(200).send({ message: "Success", isLogin });
  } catch (error) {
    return res.status(500).send("An unexpected error occurred");
  }
};

const getAllUsers = async (req, res) => {
  const { error } = validateUserName(req.params);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const data = req.params.userName;
  try {
    const user = await findUserBy("userName", data);
    if (!user) return res.status(404).send({ message: "User not found" });

    const getUsers = await allUsers(user._id);

    return res.status(200).send({ message: "Success", getUsers });
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    return res.status(500).send("An unexpected error occurred");
  }
};

const getSingleUser = async (req, res) => {
  const { error } = validateUserName(req.params);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const data = req.params;

  try {
    const getUser = await findUserBy("userName", data.userName);
    if (!getUser) return res.status(404).send({ message: "User not found" });

    return res.status(200).send({ message: "Success", getUser });
  } catch (error) {
    return res.status(500).send("An unexpected error occurred");
  }
};

const deleteUser = async (req, res) => {
  const { error } = validateUserName(req.params);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const data = req.params;

  try {
    const getUser = await findUserBy("userName", data.userName);
    if (!getUser) return res.status(404).send({ message: "User not found" });

    const getUsers = await allUsers(getUser._id);

    getUsers.map((user) => {
      user.freand.map(async (e) => {
        if (e.userName === data.userName) {
          deleteFeand(user._id, data.userName);
        }
      });
    });

    const deleteUser = await delUser(data.userName);
    return res.status(200).send({ message: "Success", deleteUser });
  } catch (error) {
    return res.status(500).send("An unexpected error occurred");
  }
};

const editUserAcc = async (req, res) => {
  const id = req.params.id;

  try {
    const getUser = await findUserByID(id);
    if (!getUser) return res.status(404).send({ message: "User not found" });

    const updates = {};

    if (req.body.userName && req.body.userName == getUser.userName) {
      return res.status(400).send({ message: "Same User Name !" });
    } else if (req.body.userName) {
      const { error } = validateUserName({ userName: req.body.userName });
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      updates.userName = req.body.userName;
    }

    if (req.body.email && req.body.email == getUser.email) {
      return res.status(400).send({ message: "Same Email !" });
    } else if (req.body.email) {
      const { error } = validateEmail({ email: req.body.email });
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      updates.email = req.body.email;
    }

    if (req.body.password && getUser.password == req.body.password) {
      return res.status(400).send({ message: "Same Password !" });
    } else if (req.body.password) {
      const { error } = validatePassword({ password: req.body.password });
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    if (Object.keys(updates).length > 0) {
      const updatedUser = await updateUser("_id", id, updates);
      return res.status(200).send({
        message: "Success",
        updatedUser,
      });
    } else {
      return res.status(400).send({ message: "No updates provided" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

const addFreand = async (req, res) => {
  const freandId = req.params.id;
  const userId = req.body.user;

  try {
    const cheackFreandId = await findUserByID(freandId);
    if (!cheackFreandId)
      return res.status(404).send({ message: "Freand not found" });

    const cheackUserId = await findUserByID(userId);
    if (!cheackUserId)
      return res.status(404).send({ message: "User not found" });

    const freandExists = cheackUserId.freand.some(
      (friend) => friend.userName === cheackFreandId.userName
    );

    console.log(freandExists);

    if (freandExists) {
      return res.status(500).send({ message: "Freand Already Exists" });
    } else {
      let userNameFreand = cheackFreandId.userName;
      let emailFreand = cheackFreandId.email;

      let userNameUser = cheackUserId.userName;
      let emailUser = cheackUserId.email;

      await cheackUserId.freand.push({
        userName: userNameFreand,
        email: emailFreand,
      });
      await cheackFreandId.freand.push({
        userName: userNameUser,
        email: emailUser,
      });

      await cheackUserId.save();
      await cheackFreandId.save();

      return res.status(200).send({
        message: "Success",
        cheackFreandId,
        cheackUserId,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

const getFreands = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await findUserByID(userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const freands = user.freand;

    return res.status(200).send({
      message: "Success",
      freands,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

const getUserByID = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await findUserByID(id);
    if (!user) return res.status(404).send({ message: "User not found" });

    return res.status(200).send({
      message: "Success",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

const deleteFreand = async (req, res) => {
  const id = req.body.id;
  const userName = req.params.userName;

  try {
    const user = await findUserByID(id);
    if (!user) return res.status(404).send({ message: "User not found" });
    const freand = await findUserBy("userName", userName);
    if (!freand) return res.status(404).send({ message: "Freand not found" });

    const freandId = String(freand._id);

    await deleteFeand(id, userName);
    await deleteFeand(freandId, user.userName);

    return res.status(200).send({
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

const getUnknownPeople = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await findUserByID(id);
    if (!user) return res.status(404).send({ message: "User not found" });

    const nonFreand = await unknownPeople(user.freand, user._id);

    return res.status(200).send({
      message: "Success",
      nonFreand,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  editUserAcc,
  addFreand,
  getFreands,
  getUserByID,
  deleteFreand,
  getUnknownPeople,
};
