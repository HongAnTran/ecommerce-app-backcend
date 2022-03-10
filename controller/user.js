import { UserModel } from "../models/userModel.js";

export const getCurrentUsers = async (req, res) => {
  try {
    const uidCurrentUser = req.query.uid;
    const currentUsers = await UserModel.find({ uid: uidCurrentUser });
    res.status(200).json(currentUsers);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const createUser = async function (req, res) {
  try {
    const newUser = req.body;
    const user = await new UserModel(newUser);
    user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
export const getUsers = async (req, res) => {
  try {
    const Users = await UserModel.find();
    res.status(200).json(Users);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const editUser = async function (req, res) {
  try {
    const editUser = req.body;
    const user = await UserModel.findOneAndUpdate(
      {
        _id: editUser._id,
      },
      editUser,
      {
        new: true,
      }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
