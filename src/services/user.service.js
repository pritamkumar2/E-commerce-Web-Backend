const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const jwtProvider = require("../config/jwtProvider");

const createUser = async (userData) => {
  try {
    let { firstName, lastName, email, password, role, isVerifted, token } =
      userData;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      throw new Error("user already exist with email : ", email);
    } else {
      // console.log("created user", userData);
    }

    password = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      isVerifted,
      token,
    });

    console.log("here is the user  ", user);

    return user;
  } catch (error) {
    console.log("error - ", error.message);
    throw new Error(error.message);
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found with id : ", userId);
    }
    return user;
  } catch (error) {
    console.log("error :------- ", error.message);
    throw new Error(error.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("user found with email : ", email);
    }

    return user;
  } catch (error) {
    console.log("error - ", error.message);
    throw new Error(error.message);
  }
};

const getUserProfileByToken = async (token) => {
  try {
    const userId = jwtProvider.getUserIdFromToken(token);

    console.log("userr id ", userId);

    const user = (await findUserById(userId)).populate("addresses");
    user.password = null;

    if (!user) {
      throw new Error("user not exist with id : ", userId);
    }
    return user;
  } catch (error) {
    console.log("error ----- ", error.message);
    throw new Error(error.message);
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log("error - ", error);
    throw new Error(error.message);
  }
};

const updateUserPassword = async (userId, hashedPassword) => {
  console.log(
    "update pass ---- userId ",
    userId,
    "hashedPassword ",
    hashedPassword
  );

  try {
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    console.log("Error updating password:", error.message);
    throw new Error("Error updating password");
  }
};

const findByIdAndUpdate = async (userId, update) => {
  try {
    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.log("Error in findByIdAndUpdate:", error.message);
    throw new Error(error.message);
  }
};
const findUserByEmail = async (email,token) => {
  try {
    const user = await User.findOne({ email });
    
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  findUserById,
  getUserProfileByToken,
  getUserByEmail,
  getAllUsers,
  updateUserPassword,
  findByIdAndUpdate,
  findUserByEmail,
};
