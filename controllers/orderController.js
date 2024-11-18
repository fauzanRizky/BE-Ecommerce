import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import MidtransClient from "midtrans-client";
import dotenv from "dotenv";

dotenv.config();

let snap = new MidtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER,
});

export const createOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem, cartItemMidtrans } =
    req.body;

  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("Belum ada item di dalam keranjang belanja!");
  }

  let orderItem = [];
  let orderMidtrans = [];
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

    const shortName = name.substring(0, 30);
    const singleProductMidtrans = {
      quantity: cart.quantity,
      name: shortName,
      price,
      id: _id,
    };
    orderMidtrans = [...orderMidtrans, singleProductMidtrans];

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

  // const token = "1234";

  let parameter = {
    transaction_details: {
      order_id: order._id,
      gross_amount: total,
    },
    // credit_card: {
    //   secure: true,
    // },
    item_details: orderMidtrans,
    customer_details: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      // billing_address: {
      //   first_name: "Budi",
      //   last_name: "Susanto",
      //   email: "budisusanto@example.com",
      //   phone: "08123456789",
      //   address: "Sudirman No.12",
      //   city: "Jakarta",
      //   postal_code: "12190",
      //   country_code: "IDN",
      // },
      // "shipping_address": {
      //   "first_name": "Budi",
      //   "last_name": "Susanto",
      //   "email": "budisusanto@example.com",
      //   "phone": "0812345678910",
      //   "address": "Sudirman",
      //   "city": "Jakarta",
      //   "postal_code": "12190",
      //   "country_code": "IDN"
      // }
    },
  };

  const token = await snap.createTransaction(parameter);
  // .then((transaction) => {
  //   // transaction token
  //   let transactionToken = transaction.token;
  //   console.log("transactionToken:", transactionToken);
  // });

  // console.log(token);

  return res.status(201).json({
    order,
    total,
    orderItem,
    message: "Berhasil buat order produk!",
    token,
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

export const callbackPayment = asyncHandler(async (req, res) => {
  const statusResponse = await snap.transaction.notification(req.body);

  let orderId = statusResponse.order_id;
  let transactionStatus = statusResponse.transaction_status;
  let fraudStatus = statusResponse.fraud_status;

  const orderData = await Order.findById(orderId);

  if (!orderData) {
    res.status(404);
    throw new Error("Order tidak ditemukan!");
  }

  // Log status yang diterima
  console.log(
    `Order ID: ${orderId}, Status Transaksi: ${transactionStatus}, Fraud Status: ${fraudStatus}`
  );

  /*
  try {
    const statusResponse = await snap.transaction.notification(req.body);

    let orderId = statusResponse.order_id;
    let transactionStatus = statusResponse.transaction_status;
    let fraudStatus = statusResponse.fraud_status;

    const orderData = await Order.findById(orderId);

    if (!orderData) {
      res.status(404);
      throw new Error("Order tidak ditemukan!");
    }

    // Log status yang diterima
    console.log(
      `Order ID: ${orderId}, Status Transaksi: ${transactionStatus}, Fraud Status: ${fraudStatus}`
    );

    // Logika penanganan status transaksi
    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept") {
        const productOrder = orderData.itemsDetail;

        for (const productItem of productOrder) {
          const productData = await Product.findById(productItem.product);
          if (!productData) {
            res.status(404);
            throw new Error(
              `Produk dengan ID ${productItem.product} tidak ditemukan!`
            );
          }

          // Kurangi stok produk
          productData.stock -= productItem.quantity;
          await productData.save();
          console.log(
            `Produk ${productData.name} stok dikurangi sebanyak ${productItem.quantity}. Stok baru: ${productData.stock}`
          );
        }

        orderData.status = "success";
      }
    } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
      orderData.status = "failed";
    } else if (transactionStatus === "pending") {
      orderData.status = "pending";
    }

    await orderData.save();
    console.log(`Order status diperbarui ke: ${orderData.status}`);

    // Respon setelah semua operasi berhasil
    return res.status(200).send("Notifikasi pembayaran berhasil diproses!");
  } catch (error) {
    console.error("Error pada callback pembayaran:", error);
    res
      .status(500)
      .send("Terjadi kesalahan saat memproses notifikasi pembayaran.");
  }
  */
});
