const router = require("express").Router();
import {
  registerUser,
  verifyUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  editUserAcc,
  addFreand,
  getFreands,
  getUserByID,
  deleteFreand,
  getUnknownPeople,
} from "../controllers/user.controllers.js";

router.post("/register", registerUser);
router.post("/verifyUser", verifyUser);
router.post("/login", loginUser);
router.get("/getAllUsers/:userName", getAllUsers);
router.get("/getSingleUser/:userName", getSingleUser);
router.delete("/deleteUser/:userName", deleteUser);
router.patch("/editUserAcc/:id", editUserAcc);
router.post("/addFeand/:id", addFreand);
router.get("/getFreands/:id", getFreands);
router.get("/getUserByID/:id", getUserByID);
router.delete("/deleteFeand/:userName", deleteFreand);
router.get("/getUnknownPeople/:id", getUnknownPeople);

export default router;
