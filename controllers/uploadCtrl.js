const cloudinary = require('cloudinary');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const { v4: uuidv4 } = require('uuid');
const db = require('../db/dbConnect');

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
  upload_csv_file: (req, res) => {
    try {
      const file = req.files.file;
      // console.log(file);
      // removeTmp(file.tempFilePath);
      // res.json({ success: true, url: 'waiting' });

      const dat = new Date();
      let filename = `CSV_DATA_${
        dat.toLocaleDateString() + '_' + dat.toLocaleTimeString()
      }`;
      filename = filename.split(' ').join('');
      filename = filename.split('/').join('_');
      filename = filename.split(':').join('_');
      // console.log(filename);
      let extName = path.extname(file.name);
      let uploadDir = path.join(
        __dirname,
        '../upload',
        'upload_' + filename + extName
      );
      file.mv(uploadDir, async (err) => {
        if (err) {
          console.log(err);
        } else {
          cloudinary.v2.uploader.upload(
            uploadDir,
            { resource_type: 'auto' },
            async (err, result) => {
              if (err) throw err;

              let wb = xlsx.readFile(uploadDir, { cellDates: true });
              const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
              const data = xlsx.utils.sheet_to_json(ws);
              // console.log(data);
              // console.log(data.length);

              removeTmp(uploadDir);
              // removeTmp(file.tempFilePath);
              data.forEach((item, index) => {
                let v_id = uuidv4().slice(0, 4);
                let a_id = uuidv4().slice(0, 4);

                let date_var = new Date();
                const visitor_data = {
                  // visitor_id: v_id,
                  visitor_id: item.VisitorID,
                  firstname: item.FirstName,
                  middlename: item.MiddleName ? item.MiddleName : '',
                  lastname: item.LastName,
                  dateOfBirth:
                    item.DateOfBirth.length > 0
                      ? new Date(
                          item.DateOfBirth.split('-')[2] +
                            '-' +
                            item.DateOfBirth.split('-')[1] +
                            '-' +
                            item.DateOfBirth.split('-')[0]
                        )
                      : item.DateOfBirth,
                  gender: item.Gender,
                  blood_group: item.BloodGroup,
                  email: item.Email,
                  phone: item.PhoneNumber,
                  recordtimestamp: date_var.valueOf(),
                  rowCreated: date_var.valueOf(),
                  rowModified: date_var.valueOf(),
                  origin_file: filename + extName,
                  origin_file_link: result.secure_url,
                };

                const address_data = {
                  address_id: a_id,
                  houseno: item.HouseNo,
                  street: item.Street,
                  city: item.City,
                  district: item.District,
                  state: item.State,
                  country: item.Country,
                  zip: item.Zip,
                  recordtimestamp: date_var.valueOf(),
                  rowCreated: date_var.valueOf(),
                  rowModified: date_var.valueOf(),
                  origin_file: filename + extName,
                  origin_file_link: result.secure_url,
                };
                // console.log();
                const event_data = {
                  event_id: uuidv4().slice(0, 4),
                  visitorID: item.VisitorID,
                  orgName: item.OrganizationName,
                  orgCode: item.OrganizationCode,
                  visitDate:
                    item.visitDate.length > 0
                      ? new Date(
                          item.visitDate.split('-')[2] +
                            '-' +
                            item.visitDate.split('-')[1] +
                            '-' +
                            item.visitDate.split('-')[0]
                        )
                      : item.visitDate,
                  type: item.Type,
                  admissionDepartment: item.AdmissionDepartment,
                  consultingDr: item.ConsultingDr,
                  symptoms: item.Symptoms,
                  height: item.Height,
                  weight: item.Weight,
                  prescription: item.Prescription,
                  tests: item.Tests ? item.Tests : '{}',
                  surgeryHistoryFlag: item['SurgeryHistoryFlag(Y/N)'],
                  surgeryType: item.SurgeryType ? item.SurgeryType : '',
                  ancestralHisotryFlag: item.AncestralHisotryFlag,
                  ancestralHistoryDetails: item.AncestralHistoryDetails
                    ? item.AncestralHistoryDetails
                    : '',
                  synopsys: item.Synopsys ? item.Synopsys : '',
                  recordtimestamp: date_var.valueOf(),
                  rowCreated: date_var.valueOf(),
                  rowModified: date_var.valueOf(),
                  origin_file: filename + extName,
                  origin_file_link: result.secure_url,
                };

                const address_ref_data = {
                  add_ref_id: uuidv4().slice(0, 4),
                  visitorID: v_id,
                  addressID: a_id,
                  recordtimestamp: date_var.valueOf(),
                  rowCreated: date_var.valueOf(),
                  rowModified: date_var.valueOf(),
                  origin_file: filename + extName,
                  origin_file_link: result.secure_url,
                };

                let checkid_sql = `select * from visitor where visitor_id='${item.VisitorID}'`;
                db.query(checkid_sql, (err, resut) => {
                  if (err) {
                    console.log(err);
                  }
                  if (resut.length > 0) {
                    // console.log(resut[0].visitor_id);

                    //update visitor
                    let update_visitor_sql =
                      'UPDATE `visitor` SET `recordtimestamp`=? ,  `rowModified`=? ,`origin_file`=? , `origin_file_link`=?   WHERE visitor_id = ?';
                    const vis_values = [
                      date_var.valueOf(),
                      date_var.valueOf(),
                      filename + extName,
                      result.secure_url,
                      resut[0].visitor_id,
                    ];
                    // console.log(vis_values);
                    db.query(
                      update_visitor_sql,
                      [...vis_values],
                      (err, data) => {
                        if (err) {
                          console.log(err);
                        }
                      }
                    );
                  } else {
                    const visitor_sql = 'INSERT INTO `visitor` SET ?';
                    db.query(visitor_sql, visitor_data, (err, res) => {
                      if (err) {
                        console.log(err);
                      }
                    });

                    const address_sql = 'INSERT INTO `address` SET ?';
                    db.query(address_sql, address_data, (err, res) => {
                      if (err) {
                        console.log(err);
                      }
                    });

                    const event_sql = 'INSERT INTO `event` SET ?';
                    db.query(event_sql, event_data, (err, res) => {
                      if (err) {
                        console.log(err);
                      }
                    });

                    const address_ref_sql =
                      'INSERT INTO `visitoraddressxref` SET ?';
                    db.query(address_ref_sql, address_ref_data, (err, res) => {
                      if (err) {
                        console.log(err);
                      }
                    });
                  }
                });

                const visitor_sql = 'INSERT INTO `raw_visitor` SET ?';
                db.query(visitor_sql, visitor_data, (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                });

                const address_sql = 'INSERT INTO `raw_address` SET ?';
                db.query(address_sql, address_data, (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                });

                const event_sql = 'INSERT INTO `raw_event` SET ?';
                db.query(event_sql, event_data, (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                });

                const address_ref_sql =
                  'INSERT INTO `raw_visitoraddressxref` SET ?';
                db.query(address_ref_sql, address_ref_data, (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                });

                //end
              });

              res.status(201).json({
                success: true,
                msg: 'Data Upload Successfully',
              });
            }
          );
        }
      });
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
