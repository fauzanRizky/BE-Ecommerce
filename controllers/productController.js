// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const showAllProduct = asyncHandler(async (req, res) => {
  //Req Query
  const queryObj = { ...req.query };

  // Fungsi untuk mengabaikan jika ada req page dan limit
  const excludeField = ["page", "limit"];
  excludeField.forEach((element) => delete queryObj[element]);
  //   const data = await Product.find();

  let query;

  if (req.query.name && req.query.category) {
    query = Product.find({
      name: { $regex: req.query.name, $options: "i" },
      category: req.query.category,
    });
  } else if (req.query.name) {
    query = Product.find({
      name: {
        $regex: req.query.name,
        $options: "i",
      },
    });
  } else {
    query = Product.find(queryObj);
  }

  // if (req.query.category) {
  //   query.category = req.query.category;
  // }

  const page = req.query.page * 1 || 1; // Agar menjadi integer
  const limitData = req.query.limit * 1 || 4;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countProduct = await Product.countDocuments(queryObj);
  if (req.query.page) {
    // const numProduct = await Product.countDocuments();

    if (skipData >= countProduct) {
      res.status(404);
      throw new Error("Halaman tidak tersedia!");
    }
  }

  const data = await query;
  const totalPage = Math.ceil(countProduct / limitData);

  return res.status(200).json({
    message: "Berhasil menampilkan semua produk!",
    data,
    pagination: {
      totalPage,
      page,
      totalProduct: countProduct,
    },
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    message: "Berhasil tambah product!",
    data: newProduct,
  });
});

export const detailProduct = asyncHandler(async (req, res) => {
  const paramsID = req.params.id;
  const dataProduct = await Product.findById(paramsID);

  if (!dataProduct) {
    res.status(404);
    throw new Error("Produk tidak ditemukan!");
  }

  return res.status(200).json({
    message: "Detail data produk berhasil ditampilkan!",
    data: dataProduct,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const paramsID = req.params.id;
  const updatedProduct = await Product.findByIdAndUpdate(paramsID, req.body, {
    runValidators: false,
    new: true,
  });

  return res.status(201).json({
    message: "Update produk berhasil!",
    data: updatedProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const paramsID = req.params.id;
  const deletedProduct = await Product.findByIdAndDelete(paramsID);

  return res.status(201).json({
    message: "Produk telah dihapus!",
  });
});

export const fileUploadProduct = asyncHandler(async (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "uploads",
      allowed_formats: ["jpg", "png", "jpeg"],
    },
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Gagal upload gambar!",
          error: err,
        });
      }

      res.json({
        message: "Gambar berhasil diupload!",
        url: result.secure_url,
      });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);

  /*
    const file = req.file;

    if (!file) {
      res.status(400);
      throw new Error("Tidak ada file yang diinput!");
    }

    const imageFileName = file.filename;
    const pathImageFile = `/uploads/${imageFileName}`;

    res.status(200).json({
      message: "File berhasil diupload!",
      image: pathImageFile,
    });
  **/
});
