const router = require("express").Router();

const usersModel = require("../models/usersModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authmiddleware = require("../middlewares/authmiddleware");

router.post("/register", async (req, res) => {
  try {
    let user = await usersModel.findOne({
      email: req.body.email,
    });

    if (user) {
      return res.send({
        success: false,
        message: "user already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    const newUser = new usersModel(req.body);
    await newUser.save();

    res.send({
      message: "user created successfully",
      data: null,
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = await usersModel.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "user does not exists",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }

    if (!user.isVerified) {
      return res.send({
        success: false,
        message: "user is not verified yet or has been suspended",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    res.send({
      message: "user login successfully",
      data: token,
      success: true,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get user info

router.get("/get-user-info", authmiddleware, async (req, res) => {
  try {
    const user = await usersModel.findById(req.body.userId);
    user.password = "";
    res.send({
      message: "user info fetched successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all users
router.get("/get-all-users", authmiddleware, async (req, res) => {
  try {
    const users = await usersModel.find();
    res.send({
      message: "users fetched successfully",
      data: users,
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

//update user verified status

router.post(
  "/update-user-verified-status",
  authmiddleware,
  async (req, res) => {
    try {
      await usersModel.findByIdAndUpdate(req.body.selectedUser, {
        isVerified: req.body.isVerified,
      });
      res.send({
        data: null,
        message: "user verified status updated successfully",
        success: true,
      });
    } catch (error) {
      res.send({
        data: error,
        message: error.message,
        success: false,
      });
    }
  }
);

module.exports = router;
