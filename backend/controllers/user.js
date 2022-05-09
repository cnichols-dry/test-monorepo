const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    if (!hash) {
      throw new Error("hash gone wrong");
    }
    const user = new User({
      email: req.body.email,
      password: hash,
      cart: { items: [] }
    });

    await user.save();
    res.status(201).json({
      message: "User Created"
    });
  } catch (error) {
    res.status(500).json({
      message: "Invalid authentication credentials"
    });
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const isAuth = await bcrypt.compare(req.body.password, user.password);
    if (!isAuth) {
      throw new Error('passwords do not match');
    }
    const token = jwt.sign(
      { eamil: user.email, userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: user._id
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid authentication credentials"
    });
  }
};
