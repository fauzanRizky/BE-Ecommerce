import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem } = req.body;

  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("Belum ada item di dalam keranjang belanja!");
  }

  let orderItem = [];
  let total = 0;

  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });
    if (!productData) {
      res.status(404);
      throw new Error("Id produk tidak ditemukan!");
    }

    const { name, price, _id } = productData;
    const singleProduct = {
      quantity: cart.quantity,
      name,
      price,
      product: _id,
    };
    orderItem = [...orderItem, singleProduct];

    total += cart.quantity * price;
  }

  const order = await Order.create({
    itemsDetail: orderItem,
    total,
    firstName,
    lastName,
    email,
    phone,
    user: req.user.id,
  });

  return res.status(201).json({
    order,
    total,
    orderItem,
    message: "Berhasil buat order produk!",
  });
});

export const showAllOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  return res.status(200).json({
    data: orders,
    message: "Berhasil tampilkan semua order produk!",
  });
});

export const detailOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  return res.status(200).json({
    data: order,
    message: "Berhasil tampilkan detail order produk!",
  });
});

export const currentUserOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    user: req.user.id,
  });
  return res.status(200).json({
    data: order,
    message: "Berhasil tampilkan order produk dari user!",
  });
});
