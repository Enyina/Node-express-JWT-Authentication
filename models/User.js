const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "invalid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a Password"],
      minlength: [6, "Password must have minimum of 6 characters"],
    },
  },
  { collection: "Users" }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("password incorrect");
  }
  throw Error("email incorrect");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
