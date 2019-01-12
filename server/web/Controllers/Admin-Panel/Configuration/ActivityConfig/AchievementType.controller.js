var CryptoJS = require("crypto-js");
var AchievementTypeModel = require('./../../../../models/Configuration/ActivityConfig/AchievementType.model.js');
var ErrorManagement = require('./../../../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');




// ************************************************** AchievementType *****************************************************
   // AchievementType Async Validate -----------------------------------------------
   exports.AchievementType_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.AchievementType || ReceivingData.AchievementType === '' ) {
         res.status(400).send({Status: false, Message: "AchievementType can not be empty" });
      } else if (!ReceivingData.Institution || typeof ReceivingData.Institution !== 'object' || ReceivingData.Institution.length <= 0) {
         res.status(400).send({Status: false, Message: "Institutions List can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         ReceivingData.Institution = ReceivingData.Institution.map( obj => mongoose.Types.ObjectId(obj));
         AchievementTypeModel.AchievementTypeSchema.findOne({   'AchievementType': { $regex : new RegExp("^" + ReceivingData.AchievementType + "$", "i") },
                                                            'Institution': { $in : ReceivingData.Institution },
                                                            'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Activity Level Find Query Error', 'AchievementType.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Activity Level!."});
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
      // AchievementType Update Async Validate -----------------------------------------------
      exports.AchievementTypeUpdate_AsyncValidate = function(req, res) {
         var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
         var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
   
         if(!ReceivingData.AchievementType || ReceivingData.AchievementType === '' ) {
            res.status(400).send({Status: false, Message: "AchievementType can not be empty" });
         } else if (!ReceivingData.Institution || typeof ReceivingData.Institution === '') {
            res.status(400).send({Status: false, Message: "Institutions can not be empty" });
         } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
            res.status(400).send({Status: false, Message: "User Details can not be empty" });
         }else {
            AchievementTypeModel.AchievementTypeSchema.findOne({   'AchievementType': { $regex : new RegExp("^" + ReceivingData.AchievementType + "$", "i") },
                                                               'Institution': mongoose.Types.ObjectId(ReceivingData.Institution) ,
                                                               'If_Deleted': false }, {}, {}, function(err, result) {
               if(err) {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Activity Level Find Query Error', 'AchievementType.controller.js', err);
                  res.status(417).send({status: false, Message: "Some error occurred while Find Activity Level!."});
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
// AchievementType Create -----------------------------------------------
   exports.AchievementType_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.AchievementType || ReceivingData.AchievementType === '' ) {
         res.status(400).send({Status: false, Message: "AchievementType can not be empty" });
      }else if(!ReceivingData.Institution || typeof ReceivingData.Institution !== 'object' || ReceivingData.Institution.length <= 0 ) {
            res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {
         ReceivingData.Institution = ReceivingData.Institution.map(obj => mongoose.Types.ObjectId(obj));
         Promise.all(
            ReceivingData.Institution.map(obj => SaveAchievementType(obj))
         ).then(response => {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }).catch( err => {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'AchievementType Creation Query Error', 'AchievementType.controller.js');
            res.status(417).send({status: false, Error:err, Message: "Some error occurred while Create The AchievementTypes!."});
         })

         function SaveAchievementType(obj) {
            return new Promise( (resolve, reject) => {
               var Create_AchievementType = new AchievementTypeModel.AchievementTypeSchema({
                  AchievementType: ReceivingData.AchievementType,
                  Institution: obj,
                  Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                  Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                  Active_Status: true,
                  If_Deleted: false
               });
               Create_AchievementType.save(function(err, result) { // AchievementType Save Query
                  if(err) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations AchievementType Creation Query Error', 'AchievementType.controller.js');
                     reject(err);
                  } else {
                     AchievementTypeModel.AchievementTypeSchema
                        .findOne({'_id': result._id})
                        .populate({ path: 'Institution', select: ['Institution'] })
                        .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                        .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                        .exec(function(err_1, result_1) { // AchievementType FindOne Query
                        if(err_1) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations AchievementType Find Query Error', 'AchievementType.controller.js', err_1);
                           reject(err_1);
                        } else {
                           resolve(result_1);
                        }
                     });
                  }
               });
            })
         }
      }
   };
// AchievementType List -----------------------------------------------
   exports.AchievementType_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         AchievementTypeModel.AchievementTypeSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Institution', select: ['Institution'] })
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // AchievementType FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations AchievementType Find Query Error', 'AchievementType.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The AchievementTypes!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Institution Based Achievement Type List -----------------------------------------------
   exports.InstitutionBased_AchievementType_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      } else if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
         res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
      }else {
         AchievementTypeModel.AchievementTypeSchema
            .find({ 'If_Deleted': false, Institution: mongoose.Types.ObjectId(ReceivingData.Institution) }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Institution', select: ['Institution'] })
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // AchievementType FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations AchievementType Find Query Error', 'AchievementType.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The AchievementTypes!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// AchievementType Simple List -----------------------------------------------
   exports.AchievementType_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
      }else {
         AchievementTypeModel.AchievementTypeSchema.find({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution), 'If_Deleted': false }, { AchievementType : 1 }, {sort: { updatedAt: -1 }}, function(err, result) { // AchievementType FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations AchievementType Find Query Error', 'AchievementType.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The AchievementTypes!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// AchievementType Update -----------------------------------------------
   exports.AchievementType_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.AchievementType_Id || ReceivingData.AchievementType_Id === '' ) {
         res.status(400).send({Status: false, Message: "AchievementType Id can not be empty" });
      }else if(!ReceivingData.AchievementType || ReceivingData.AchievementType === '' ) {
         res.status(400).send({Status: false, Message: "AchievementType can not be empty" });
      }else if(!ReceivingData.Institution || typeof ReceivingData.Institution === 'object') {
         res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         AchievementTypeModel.AchievementTypeSchema.findOne({'_id': ReceivingData.AchievementType_Id}, {}, {}, function(err, result) { // AchievementType FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations AchievementType FindOne Query Error', 'AchievementType.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The AchievementType!."});
            } else {
               if (result !== null) {
                  result.AchievementType = ReceivingData.AchievementType;
                  result.Institution = mongoose.Types.ObjectId(ReceivingData.Institution);
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // AchievementType Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations AchievementType Update Query Error', 'AchievementType.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the AchievementType!."});
                     } else {
                        AchievementTypeModel.AchievementTypeSchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Institution', select: ['Institution'] })
                           .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                           .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                           .exec(function(err_2, result_2) { // AchievementType FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations AchievementType Find Query Error', 'AchievementType.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The AchievementTypes!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "AchievementType Id can not be valid!" });
               }
            }
         });
      }
   };
// AchievementType Delete -----------------------------------------------
   exports.AchievementType_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.AchievementType_Id || ReceivingData.AchievementType_Id === '' ) {
         res.status(400).send({Status: false, Message: "AchievementType Id can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         AchievementTypeModel.AchievementTypeSchema.findOne({'_id': ReceivingData.AchievementType_Id}, {}, {}, function(err, result) { // AchievementType FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations AchievementType FindOne Query Error', 'AchievementType.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The AchievementType!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // AchievementType Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations AchievementType Delete Query Error', 'AchievementType.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the AchievementType!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "AchievementType Id can not be valid!" });
               }
            }
         });
      }
   };