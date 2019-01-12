var CryptoJS = require("crypto-js");
var DepartmentModel = require('./../../../models/Configuration/Department.model.js');
var ErrorManagement = require('./../../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');




// ************************************************** Department *****************************************************
   // Department Async Validate -----------------------------------------------
   exports.Department_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Department || ReceivingData.Department === '' ) {
         res.status(400).send({Status: false, Message: "Department can not be empty" });
      } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         DepartmentModel.DepartmentSchema.findOne({ 'Department': { $regex : new RegExp("^" + ReceivingData.Department + "$", "i") }, 'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Department Find Query Error', 'Department.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Department!."});
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
// Department Create -----------------------------------------------
   exports.Department_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Department || ReceivingData.Department === '' ) {
         res.status(400).send({Status: false, Message: "Department can not be empty" });
      }else if(!ReceivingData.Department_Code || ReceivingData.Department_Code === '' ) {
            res.status(400).send({Status: false, Message: "Department Code can not be empty" });
      }else if(!ReceivingData.Courses || typeof ReceivingData.Courses !== 'object' || ReceivingData.Courses.length <= 0 ) {
            res.status(400).send({Status: false, Message: "Courses can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {
         ReceivingData.Courses = ReceivingData.Courses.map( obj => mongoose.Types.ObjectId(obj))
         var Create_Department = new DepartmentModel.DepartmentSchema({
            Department: ReceivingData.Department,
            Department_Code: ReceivingData.Department_Code,
            Courses: ReceivingData.Courses,
            Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Active_Status: true,
            If_Deleted: false
         });
         Create_Department.save(function(err, result) { // Department Save Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Department Creation Query Error', 'Department.controller.js');
               res.status(417).send({Status: false, Message: "Some error occurred while creating the Department!."});
            } else {
               DepartmentModel.DepartmentSchema
                  .findOne({'_id': result._id})
                  .populate({ path: 'Courses', select: ['Course'] })
                  .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                  .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                  .exec(function(err_1, result_1) { // Department FindOne Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Department Find Query Error', 'Department.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Departments!."});
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
// Department List -----------------------------------------------
   exports.Department_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         DepartmentModel.DepartmentSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Courses', select: ['Course'] })
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // Department FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Department Find Query Error', 'Department.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Departments!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Department Simple List -----------------------------------------------
   exports.Department_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         DepartmentModel.DepartmentSchema.find({ 'If_Deleted': false }, { Department : 1, Department_Code: 1 }, {sort: { updatedAt: -1 }}, function(err, result) { // Department FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Department Find Query Error', 'Department.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Departments!."});
            } else {
               result = result.map(obj => {
                  const newObj = {
                     _id : obj._id,
                     Department : obj.Department + ' ('+ obj.Department_Code +') '
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
// Department Update -----------------------------------------------
   exports.Department_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Department_Id || ReceivingData.Department_Id === '' ) {
         res.status(400).send({Status: false, Message: "Department Id can not be empty" });
      }else if(!ReceivingData.Department || ReceivingData.Department === '' ) {
         res.status(400).send({Status: false, Message: "Department can not be empty" });
      }else if(!ReceivingData.Department_Code || ReceivingData.Department_Code === '' ) {
         res.status(400).send({Status: false, Message: "Department Code can not be empty" });
      }else if(!ReceivingData.Courses || typeof ReceivingData.Courses !== 'object' || ReceivingData.Courses.length <= 0 ) {
         res.status(400).send({Status: false, Message: "Courses can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         DepartmentModel.DepartmentSchema.findOne({'_id': ReceivingData.Department_Id}, {}, {}, function(err, result) { // Department FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Department FindOne Query Error', 'Department.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Department!."});
            } else {
               if (result !== null) {
                  ReceivingData.Courses =  ReceivingData.Courses.map(obj => mongoose.Types.ObjectId(obj))
                  result.Department = ReceivingData.Department;
                  result.Department_Code = ReceivingData.Department_Code;
                  result.Courses = ReceivingData.Courses;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Department Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Department Update Query Error', 'Department.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Department!."});
                     } else {
                        DepartmentModel.DepartmentSchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Courses', select: ['Course'] })
                           .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                           .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                           .exec(function(err_2, result_2) { // Department FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Department Find Query Error', 'Department.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The Departments!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Department Id can not be valid!" });
               }
            }
         });
      }
   };
// Department Delete -----------------------------------------------
   exports.Department_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Department_Id || ReceivingData.Department_Id === '' ) {
         res.status(400).send({Status: false, Message: "Department Id can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         DepartmentModel.DepartmentSchema.findOne({'_id': ReceivingData.Department_Id}, {}, {}, function(err, result) { // Department FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Department FindOne Query Error', 'Department.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Department!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Department Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Department Delete Query Error', 'Department.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the Department!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Department Id can not be valid!" });
               }
            }
         });
      }
   };