import multer from "multer";
import path from "path";

const FILE_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFormat = FILE_TYPE[file.mimetype];
    let uploadError = new Error(
      "Invalid file format! Only jpg, jpeg and png allowed."
    );

    if (isValidFormat) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueFilename);
  },
});

export const upload = multer({ storage: storage });
