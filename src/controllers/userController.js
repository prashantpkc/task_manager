const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      //   secure: true,
      sameSite: "none",
    });

    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: newUser,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      //   secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      status: true,
      message: "Login successful",
      token: token,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.changepassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmpassword } = req.body;

    //retrieve the user from  request object
    const user = req.user;

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: "Incorrect current password",
      });
    }

    if (newPassword !== confirmpassword) {
      return res.status(400).json({
        status: false,
        message: "new password and confirm password don't match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res
      .status(200)
      .json({ status: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
