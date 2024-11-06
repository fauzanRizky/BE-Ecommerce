import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama harus diisi!"],
    unique: [true, "Username sudah digunakan!"],
  }, // String is shorthand for {type: String}
  email: {
    type: String,
    required: [true, "Email harus diisi!"],
    unique: [true, "Email sudah terdaftar!"],
    validate: {
      validator: validator.isEmail,
      message: "Format email tidak valid! Contoh : email@server.com",
    },
  },
  password: {
    type: String,
    required: [true, "Password harus diisi!"],
    minLength: [6, "Password minimal 6 karakter!"],
  },
  role: {
    type: String,
    enum: ["user", "owner"],
    // required: [true, "Role harus diisi! ('user' atau 'owner' )"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
