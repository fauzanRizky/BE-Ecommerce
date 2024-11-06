import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama produk harus diisi!"],
    unique: [true, "Nama Produk sudah digunakan!"],
  }, // String is shorthand for {type: String}
  price: {
    type: Number,
    required: [true, "Harga produk harus diisi!"],
  },
  description: {
    type: String,
    required: [true, "Deskripsi produk harus diisi!"],
    minLength: [6, "Password minimal 6 karakter!"],
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: [true, "Kategori produk harus dipilih!"],
    enum: ["sepatu", "baju", "celana", "jaket"],
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
