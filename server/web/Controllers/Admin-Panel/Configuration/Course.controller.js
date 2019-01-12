var CryptoJS = require("crypto-js");
var CourseModel = require('./../../../models/Configuration/Course.model.js');
var ErrorManagement = require('./../../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');




// ************************************************** Course *****************************************************
   // Course Async Validate -----------------------------------------------
   exports.Course_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Course || ReceivingData.Course === '' ) {
         res.status(400).send({Status: false, Message: "Course can not be empty" });
      } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         CourseModel.CourseSchema.findOne({ 'Course': { $regex : new RegExp("^" + ReceivingData.Course + "$", "i") }, 'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Course Find Query Error', 'Course.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Course!."});
            } else {
               if ( result !== null) {
                  res.status(200).send({Status: true, Available: false });
               } else {
                  res.status(200).send({Status: true, Available: true });
               }
            }
         });
      }
   };   
// Course Create -----------------------------------------------
   exports.Course_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Course || ReceivingData.Course === '' ) {
         res.status(400).send({Status: false, Message: "Course can not be empty" });
      } else if (!ReceivingData.Course_ShortCode || ReceivingData.Course_ShortCode === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Short Code can not be empty" });
      } else if (!ReceivingData.NoOfYears || ReceivingData.NoOfYears === ''  ) {
         res.status(400).send({Status: false, Message: "Course Duration Details can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {
         var Create_Course = new CourseModel.CourseSchema({
            Course: ReceivingData.Course,
            Course_ShortCode: ReceivingData.Course_ShortCode,
            NoOfYears: ReceivingData.NoOfYears,
            Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Active_Status: true,
            If_Deleted: false
         });
         Create_Course.save(function(err, result) { // Course Save Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course Creation Query Error', 'Course.controller.js');
               res.status(417).send({Status: false, Message: "Some error occurred while creating the Course!."});
            } else {
               CourseModel.CourseSchema
                  .findOne({'_id': result._id})
                  .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                  .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                  .exec(function(err_1, result_1) { // Course FindOne Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course Find Query Error', 'Course.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Courses!."});
                  } else {
                     var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_1), 'SecretKeyOut@123');
                        ReturnData = ReturnData.toString();
                     res.status(200).send({Status: true, Response: ReturnData });
                  }
               });
            }
         });
      }
   };
// Course List -----------------------------------------------
   exports.Course_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         CourseModel.CourseSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // Course FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course Find Query Error', 'Course.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Courses!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Course Simple List -----------------------------------------------
   exports.Course_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         CourseModel.CourseSchema.find({ 'If_Deleted': false }, { Course : 1, Course_ShortCode: 1 }, {sort: { updatedAt: -1 }}, function(err, result) { // Course FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course Find Query Error', 'Course.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Courses!."});
            } else {
               result = result.map(obj => {
                  const newObj = {
                     _id : obj._id,
                     Course : obj.Course + ' ('+ obj.Course_ShortCode +') '
                  }
                  return newObj;
               })
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Course Update -----------------------------------------------
   exports.Course_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Course_Id || ReceivingData.Course_Id === '' ) {
         res.status(400).send({Status: false, Message: "Course Id can not be empty" });
      }else if(!ReceivingData.Course || ReceivingData.Course === '' ) {
         res.status(400).send({Status: false, Message: "Course can not be empty" });
      }else if(!ReceivingData.Course_ShortCode || ReceivingData.Course_ShortCode === '' ) {
         res.status(400).send({Status: false, Message: "Course Short Code can not be empty" });
      }else if(!ReceivingData.NoOfYears || ReceivingData.NoOfYears === '' ) {
         res.status(400).send({Status: false, Message: "Course Duration can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         CourseModel.CourseSchema.findOne({'_id': ReceivingData.Course_Id}, {}, {}, function(err, result) { // Course FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course FindOne Query Error', 'Course.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Course!."});
            } else {
               if (result !== null) {
                  result.Course = ReceivingData.Course;
                  result.Course_ShortCode = ReceivingData.Course_ShortCode;
                  result.NoOfYears = ReceivingData.NoOfYears;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Course Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course Update Query Error', 'Course.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Course!."});
                     } else {
                        CourseModel.CourseSchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                           .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                           .exec(function(err_2, result_2) { // Course FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course Find Query Error', 'Course.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The Courses!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Course Id can not be valid!" });
               }
            }
         });
      }
   };
// Course Delete -----------------------------------------------
   exports.Course_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Course_Id || ReceivingData.Course_Id === '' ) {
         res.status(400).send({Status: false, Message: "Course Id can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         CourseModel.CourseSchema.findOne({'_id': ReceivingData.Course_Id}, {}, {}, function(err, result) { // Course FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course FindOne Query Error', 'Course.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Course!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Course Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course Delete Query Error', 'Course.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the Course!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Course Id can not be valid!" });
               }
            }
         });
      }
   };