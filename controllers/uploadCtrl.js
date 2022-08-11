const cloudinary = require('cloudinary');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// cloudinary.config({
//     cloud_name: 'pigeon',
//     api_key: '495646937389657',
//     api_secret: 'S1K0AgjafNxSuPJderDMLRl1YGk'
//   });

const uploadCtrl = {
  uploadAvatar: (req, res) => {
    try {
      const file = req.files.file;

      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        {
          folder: 'avatar',
          width: 150,
          height: 150,
          crop: 'fill',
        },
        async (err, result) => {
          if (err) throw err;

          removeTmp(file.tempFilePath);

          res.json({ success: true, url: result.secure_url });
        }
      );
    } catch (err) {
      return res.status(500).json({ success: false, msg: err.message });
    }
  },
  upload_resume: (req, res) => {
    try {
      const file = req.files.file;
      // const params = {
      //   Bucket: process.env.AWS_BUCKET,
      //   Key: imgname,
      //   Body: targetFile.tempFilePath,
      //   ContentType: targetFile.minetype,
      // };
    } catch (err) {
      return res.status(500).json({ success: false, msg: err.message });
    }
  },
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = uploadCtrl;
