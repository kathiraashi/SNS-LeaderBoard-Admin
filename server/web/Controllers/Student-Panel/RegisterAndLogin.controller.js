var CryptoJS = require("crypto-js");
var StudentsModel = require('./../../models/Students.model');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');
var crypto = require("crypto");
var multer = require('multer');
var SHA256 = require("crypto-js/sha256");
var parser = require('ua-parser-js');



var profile_Image_Storage = multer.diskStorage({
   destination: (req, file, cb) => { cb(null, './Uploads/Students'); },
   filename: (req, file, cb) => { cb(null, 'Stu_' + Date.now() + '.png'); }
});
var profile_Image_Upload = multer({
   storage: profile_Image_Storage,
   fileFilter: function (req, file, callback) {
       let extArray = file.originalname.split(".");
       let extension = (extArray[extArray.length - 1]).toLowerCase();
       if(extension !== 'png' && extension !== 'jpg' && extension !== 'gif' && extension !== 'jpeg') {
           return callback("Only 'png, gif, jpg and jpeg' images are allowed");
       }
       callback(null, true);
   }
}).single('profile');


// Student Registration Validate -----------------------------------------------
exports.StudentRegistration_Validate = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Reg_No || ReceivingData.Reg_No === '' ) {
      res.status(400).send({Status: false, Message: "Registration Number Or Registered Email can not be empty" });
   }else {
      StudentsModel.StudentsSchema.findOne( { 'Reg_No': { $regex : new RegExp("^" + ReceivingData.Reg_No + "$", "i") }, 'If_Deleted': false },
                                             { Institution_Management: 1, Registration_Completed: 1, Yearly_Badge: 1, Name: 1, Reg_No: 1}, {})
      .populate({ path: 'Institution_Management', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
      .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
      .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears', 'Course_ShortCode'] } })
      .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
      .exec(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Student Registration Validate Find Query Error', 'RegisterAndLogin.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find Student Registration Validate!."});
         } else {
            if (result !== null) {
               if (result.Registration_Completed !== undefined && result.Registration_Completed ) {
                  res.status(200).send({Status: false, Message: 'Your Account Already Activated!' });
               } else {
                  const Key = crypto.randomBytes(16).toString("hex");
                  StudentsModel.StudentsSchema.update( { _id : result._id }, { $set: { EmailToken : Key } } ).exec();
                  result = JSON.parse(JSON.stringify(result));
                  result = Object.assign({EmailToken: Key}, result);
                  var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
                  res.status(200).send({Status: true, Response: ReturnData });
               }
            } else {
               res.status(200).send({Status: false, Message: 'Your Details Not Valid!' });
            }
         }
      });
   }
}; 

// Student Account Activate Validate -----------------------------------------------
exports.StudentAccountActivate_Validate = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Student || ReceivingData.Student === '' ) {
      res.status(400).send({Status: false, Message: "Account Details Not Valid!" });
   }else if(!ReceivingData.EmailToken || ReceivingData.EmailToken === '' ) {
      res.status(400).send({Status: false, Message: "Account Details Not Valid!" });
   }else {
      StudentsModel.StudentsSchema.findOne(  { '_id': mongoose.Types.ObjectId(ReceivingData.Student), 'EmailToken': ReceivingData.EmailToken },
                                             { Department: 0, EmailToken: 0, Created_By: 0, Last_Modified_By: 0, createdAt: 0, Password: 0, updatedAt: 0}, {})
      .populate({ path: 'Institution_Management', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
      .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
      .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears', 'Course_ShortCode'] } })
      .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
      .exec(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Student Registration Validate Find Query Error', 'RegisterAndLogin.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find Student Registration Validate!."});
         } else {
            if (result !== null) {
               if (result.Registration_Completed !== undefined && result.Registration_Completed ) {
                  res.status(200).send({Status: true, Registration_Completed: true, Message: 'Your Account Already Activated!' });
               } else {
                  var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
                  res.status(200).send({Status: true, Registration_Completed: false, Response: ReturnData });
               }
            } else {
               res.status(200).send({Status: false, Message: 'Account Details Not Valid!' });
            }
         }
      });
   }
};

// Student Activate Update And Login -----------------------------------------------
exports.StudentActivate_UpdateAndLogin = function(req, res) {
   profile_Image_Upload(req, res, function(upload_err) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Student || ReceivingData.Student === '' ) {
         res.status(400).send({Status: false, Message: "Account Details Not Valid!" });
      }else if(!ReceivingData.EmailToken || ReceivingData.EmailToken === '' ) {
         res.status(400).send({Status: false, Message: "Account Details Not Valid!" });
      }else if(!ReceivingData.Email || ReceivingData.Email === '' ) {
         res.status(400).send({Status: false, Message: "Email is Required!" });
      }else if(!ReceivingData.Password || ReceivingData.Password === '' ) {
         res.status(400).send({Status: false, Message: "Password is Required!" });
      }else {
         var _Image = {};
         if(req.file !== null && req.file !== undefined && req.file !== ''){
            _Image = { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size };
         }
         const Key = crypto.randomBytes(16).toString("hex");
         StudentsModel.StudentsSchema
            .updateOne( {'_id': mongoose.Types.ObjectId(ReceivingData.Student), 'EmailToken': ReceivingData.EmailToken},
                        { $set: {   Email: (ReceivingData.Email.toString()).toLowerCase(),
                                    Contact_Number: ReceivingData.Mobile,
                                    Blood_Group: ReceivingData.Blood_Group,
                                    DateOfBirth: ReceivingData.DOB,
                                    Password: SHA256(ReceivingData.Password).toString(),
                                    Image: _Image,
                                    Registration_Completed: true,
                                    LoginToken: Key,
                                    LastActive: new Date()
                                 } })
            .exec(function(err, result) {
               if (err) {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Student Activate Validate Find Query Error', 'RegisterAndLogin.controller.js', err);
                  res.status(417).send({status: false, Message: "Some error occurred while Find Student Activate!."});
               } else {
                  if (result.nModified === 1) {
                     StudentsModel.StudentsSchema
                        .findOne(   {'_id': mongoose.Types.ObjectId(ReceivingData.Student), 'EmailToken': ReceivingData.EmailToken},
                                    {Institution: 0, Department: 0, Password: 0, LoginToken: 0, EmailToken: 0, LastActive: 0, Created_By: 0, Last_Modified_By: 0, createdAt: 0, updatedAt: 0 },
                                    { } )
                        .populate({ path: 'Institution_Management', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
                        .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
                        .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears', 'Course_ShortCode'] } })
                        .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
                        .exec(function(err_1, result_1) {
                           if (err_1) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Student Activate Update Find Query Error', 'RegisterAndLogin.controller.js', err_1);
                              res.status(417).send({status: false, Message: "Some error occurred while Update Student Activate!."});
                           } else {
                              var Ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
                              var DeviceInfo = parser(req.headers['user-agent']);
                              const VarStudentLoginDetails = new StudentsModel.StudentLoginDetailsSchema({
                                                               Student: result_1._id,
                                                               LoginToken: Key,
                                                               LoginTime: new Date(),
                                                               From: req.headers.referer,
                                                               Ip: Ip,
                                                               Device_Info: DeviceInfo,
                                                               Active_Status: true,
                                                               If_Deleted: false
                                                            });
                              VarStudentLoginDetails.save();
                              result_1 = JSON.parse(JSON.stringify(result_1));
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_1), Key);
                              ReturnData = ReturnData.toString();
                              const NewReturnData = (ReturnData + Key).concat('==');
                              res.status(200).send({ Status: true, Response: NewReturnData });
                           }
                        })
                  } else {
                     res.status(200).send({Status: false, Message: 'Invalid Account Details!' });
                  }
               }
            })
      }
   });
};

// Student Login Validate -----------------------------------------------
exports.StudentLogin_Validate = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Email || ReceivingData.Email === '' ) {
      res.status(400).send({Status: false, Message: "Registered Email is Not Valid!" });
   }else if(!ReceivingData.Password || ReceivingData.Password === '' ) {
      res.status(400).send({Status: false, Message: "Password is Not Valid!" });
   }else {
      StudentsModel.StudentsSchema
         .findOne(   { 'Email': (ReceivingData.Email.toString()).toLowerCase(), 'Password': SHA256(ReceivingData.Password).toString(), 'Active_Status': true, 'If_Deleted': false },
                     {Institution: 0, Department: 0, Password: 0, LoginToken: 0, EmailToken: 0, LastActive: 0, Created_By: 0, Last_Modified_By: 0, createdAt: 0, updatedAt: 0 },
                     { } )
         .populate({ path: 'Institution_Management', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
         .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
         .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears', 'Course_ShortCode'] } })
         .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
         .exec(function(err, result) {
            if (err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Student Login Validate Find Query Error', 'RegisterAndLogin.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Validate Student Login!."});
            } else {
               if (result !== null) {
                  const Key = crypto.randomBytes(16).toString("hex");
                  var Ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
                  var DeviceInfo = parser(req.headers['user-agent']);
                  const VarStudentLoginDetails = new StudentsModel.StudentLoginDetailsSchema({
                                                   Student: result._id,
                                                   LoginToken: Key,
                                                   LoginTime: new Date(),
                                                   From: req.headers.referer,
                                                   Ip: Ip,
                                                   Device_Info: DeviceInfo,
                                                   Active_Status: true,
                                                   If_Deleted: false
                                                });
                  VarStudentLoginDetails.save();
                  StudentsModel.StudentsSchema.update( { _id : result._id }, { $set: { LoginToken : Key, LastActive: new Date() } } ).exec();
                  result = JSON.parse(JSON.stringify(result));
                  var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), Key);
                  ReturnData = ReturnData.toString();
                  const NewReturnData = (ReturnData + Key).concat('==');
                  res.status(200).send({ Status: true, Response: NewReturnData });
               } else {
                  res.status(200).send({Status: false, Message: 'Invalid Account Details!' });
               }
            }
         })
   }
};