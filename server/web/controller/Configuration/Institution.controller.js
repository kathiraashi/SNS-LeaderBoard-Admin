var CryptoJS = require("crypto-js");
var InstitutionModel = require('./../../models/Configuration/Institution.model.js');
var InstitutionManagementModel = require('./../../models/Institution-Management.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');




// ************************************************** Institution *****************************************************
   // Institution Async Validate -----------------------------------------------
   exports.Institution_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution can not be empty" });
      } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         InstitutionModel.InstitutionSchema.findOne({ 'Institution': { $regex : new RegExp("^" + ReceivingData.Institution + "$", "i") }, 'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Find Query Error', 'Institution.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Institution!."});
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
// Institution Create -----------------------------------------------
   exports.Institution_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution can not be empty" });
      }else if(!ReceivingData.Institution_Code || ReceivingData.Institution_Code === '' ) {
            res.status(400).send({Status: false, Message: "Institution Code can not be empty" });
      }else if(!ReceivingData.Departments || typeof ReceivingData.Departments !== 'object' || ReceivingData.Departments.length <= 0 ) {
            res.status(400).send({Status: false, Message: "Departments can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {
         ReceivingData.Departments = ReceivingData.Departments.map( obj => mongoose.Types.ObjectId(obj))
         var Create_Institution = new InstitutionModel.InstitutionSchema({
            Institution: ReceivingData.Institution,
            Institution_Code: ReceivingData.Institution_Code,
            YearOfIncorporation: ReceivingData.YearOfIncorporation,
            Email: ReceivingData.Email,
            Phone: ReceivingData.Phone,
            Website: ReceivingData.Website,
            Address: ReceivingData.Address,
            Departments: ReceivingData.Departments,
            Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Active_Status: true,
            If_Deleted: false
         });
         Create_Institution.save(function(err, result) { // Institution Save Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Institution Creation Query Error', 'Institution.controller.js');
               res.status(417).send({Status: false, Message: "Some error occurred while creating the Institution!."});
            } else {
               InstitutionModel.InstitutionSchema
                  .findOne({'_id': result._id})
                  .populate({ path: 'Departments', select: ['Department'], populate: { path: 'Courses', select: ['Course'], } })
                  .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                  .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                  .exec(function(err_1, result_1) { // Institution FindOne Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Institution Find Query Error', 'Institution.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Institutions!."});
                  } else {
                     var Courses_Arr = [];
                     result_1.Departments.map( Obj => {
                        Obj.Courses.map( Obj_1 => {
                           const newObj = {
                              Institution : result._id,
                              Department : mongoose.Types.ObjectId(Obj._id),
                              Course : mongoose.Types.ObjectId(Obj_1._id),
                              Status : 'Incomplete',
                              Last_Modified_By : mongoose.Types.ObjectId(ReceivingData.Created_By),
                              Active_Status : true,
                              If_Deleted : false
                           }
                           Courses_Arr.push(newObj);
                        });
                     });
                     InstitutionManagementModel.InstitutionManagementSchema.collection.insert(Courses_Arr);
                     var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_1), 'SecretKeyOut@123');
                     ReturnData = ReturnData.toString();
                     res.status(200).send({Status: true, Response: ReturnData });
                  }
               });
            }
         });
      }
   };
// Institution List -----------------------------------------------
   exports.Institution_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         InstitutionModel.InstitutionSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Departments', select: ['Department'] })
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // Institution FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Institution Find Query Error', 'Institution.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Institutions!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Institution Simple List -----------------------------------------------
   exports.Institution_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         InstitutionModel.InstitutionSchema.find({ 'If_Deleted': false }, { Institution : 1, Institution_Code: 1 }, {sort: { updatedAt: -1 }}, function(err, result) { // Institution FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Institution Find Query Error', 'Institution.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Institutions!."});
            } else {
               result = result.map(obj => {
                  const newObj = {
                     _id : obj._id,
                     Institution : obj.Institution + ' ('+ obj.Institution_Code +') '
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
   // Institution Based Departments Simple List -----------------------------------------------
   exports.InstitutionBased_DepartmentsSimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      } else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
      }else {
         InstitutionModel.InstitutionSchema.findOne({ '_id': mongoose.Types.ObjectId(ReceivingData.Institution) }, { Departments : 1 }, {})
         .populate({ path: 'Departments', select: ['Department', 'Department_Code'] })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Institution Departments Find Query Error', 'Institution.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Institutions!."});
            } else {
               result = result.Departments.map(obj => {
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
// Institution Update -----------------------------------------------
   exports.Institution_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution_Id || ReceivingData.Institution_Id === '' ) {
         res.status(400).send({Status: false, Message: "Institution Id can not be empty" });
      }else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution can not be empty" });
      }else if(!ReceivingData.Institution_Code || ReceivingData.Institution_Code === '' ) {
         res.status(400).send({Status: false, Message: "Institution Code can not be empty" });
      }else if(!ReceivingData.Departments || typeof ReceivingData.Departments !== 'object' || ReceivingData.Departments.length <= 0 ) {
         res.status(400).send({Status: false, Message: "Departments can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         InstitutionModel.InstitutionSchema.findOne({'_id': ReceivingData.Institution_Id}, {}, {}, function(err, result) { // Institution FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Institution FindOne Query Error', 'Institution.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Institution!."});
            } else {
               if (result !== null) {
                  ReceivingData.Departments =  ReceivingData.Departments.map(obj => mongoose.Types.ObjectId(obj))
                  result.Institution = ReceivingData.Institution;
                  result.Institution_Code = ReceivingData.Institution_Code;
                  result.YearOfIncorporation = ReceivingData.YearOfIncorporation;
                  result.Email = ReceivingData.Email;
                  result.Phone = ReceivingData.Phone;
                  result.Website = ReceivingData.Website;
                  result.Address = ReceivingData.Address;
                  result.Departments = ReceivingData.Departments;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Institution Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Institution Update Query Error', 'Institution.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Institution!."});
                     } else {
                        InstitutionModel.InstitutionSchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Departments', select: ['Department'] })
                           .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                           .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                           .exec(function(err_2, result_2) { // Institution FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Institution Find Query Error', 'Institution.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The Institutions!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Institution Id can not be valid!" });
               }
            }
         });
      }
   };
// Institution Delete -----------------------------------------------
   exports.Institution_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution_Id || ReceivingData.Institution_Id === '' ) {
         res.status(400).send({Status: false, Message: "Institution Id can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         InstitutionModel.InstitutionSchema.findOne({'_id': ReceivingData.Institution_Id}, {}, {}, function(err, result) { // Institution FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Institution FindOne Query Error', 'Institution.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Institution!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Institution Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Institution Delete Query Error', 'Institution.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the Institution!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Institution Id can not be valid!" });
               }
            }
         });
      }
   };