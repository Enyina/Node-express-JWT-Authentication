const User = require("../models/User");
const jwt = require("jsonwebtoken");

const errorHandler = (err) => {
  let errors = { email: "", password: "" };
  console.log(err.message);
  if (err.message === "incorrect email") {
    errors.email = "email is not registered";
  }
  if (err.message === "incorrect password") {
    errors.password = "password incorrect";
  }
  if (err.code === 11000) {
    errors.email = "email already exits";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.jwtSercret, { expiresIn: maxAge });
};

const getSignup = (req, res) => {
  res.render("signup");
};

const getLogin = (req, res) => {
  res.render("login");
};

const postSignup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({ errors });
  }
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = errorHandler(err);
    console.log(err);
    res.status(400).json({ errors });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", { expiresIn: 1 });
  res.redirect("/");
};

module.exports = {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  logout,
};
