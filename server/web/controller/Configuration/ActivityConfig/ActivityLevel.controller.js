var CryptoJS = require("crypto-js");
var ActivityLevelModel = require('./../../../models/Configuration/ActivityConfig/ActivityLevel.model.js');
var ErrorManagement = require('./../../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');




// ************************************************** ActivityLevel *****************************************************
// ActivityLevel Async Validate -----------------------------------------------
   exports.ActivityLevel_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.ActivityLevel || ReceivingData.ActivityLevel === '' ) {
         res.status(400).send({Status: false, Message: "ActivityLevel can not be empty" });
      } else if (!ReceivingData.Institution || typeof ReceivingData.Institution !== 'object' || ReceivingData.Institution.length <= 0) {
         res.status(400).send({Status: false, Message: "Institutions List can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         ReceivingData.Institution = ReceivingData.Institution.map( obj => mongoose.Types.ObjectId(obj));
         ActivityLevelModel.ActivityLevelSchema.findOne({   'ActivityLevel': { $regex : new RegExp("^" + ReceivingData.ActivityLevel + "$", "i") },
                                                            'Institution': { $in : ReceivingData.Institution },
                                                            'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Activity Level Find Query Error', 'ActivityLevel.controller.js', err);
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
// ActivityLevel Update Async Validate -----------------------------------------------
   exports.ActivityLevelUpdate_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.ActivityLevel || ReceivingData.ActivityLevel === '' ) {
         res.status(400).send({Status: false, Message: "ActivityLevel can not be empty" });
      } else if (!ReceivingData.Institution || typeof ReceivingData.Institution === '') {
         res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         ActivityLevelModel.ActivityLevelSchema.findOne({   'ActivityLevel': { $regex : new RegExp("^" + ReceivingData.ActivityLevel + "$", "i") },
                                                            'Institution': mongoose.Types.ObjectId(ReceivingData.Institution) ,
                                                            'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Activity Level Find Query Error', 'ActivityLevel.controller.js', err);
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
// ActivityLevel Create -----------------------------------------------
   exports.ActivityLevel_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.ActivityLevel || ReceivingData.ActivityLevel === '' ) {
         res.status(400).send({Status: false, Message: "ActivityLevel can not be empty" });
      }else if(!ReceivingData.Institution || typeof ReceivingData.Institution !== 'object' || ReceivingData.Institution.length <= 0 ) {
            res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {
         ReceivingData.Institution = ReceivingData.Institution.map(obj => mongoose.Types.ObjectId(obj));
         Promise.all(
            ReceivingData.Institution.map(obj => SaveActivityLevel(obj))
         ).then(response => {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }).catch( err => {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'ActivityLevel Creation Query Error', 'ActivityLevel.controller.js');
            res.status(417).send({status: false, Error:err, Message: "Some error occurred while Create The ActivityLevels!."});
         })

         function SaveActivityLevel(obj) {
            return new Promise( (resolve, reject) => {
               var Create_ActivityLevel = new ActivityLevelModel.ActivityLevelSchema({
                  ActivityLevel: ReceivingData.ActivityLevel,
                  Institution: obj,
                  Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                  Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                  Active_Status: true,
                  If_Deleted: false
               });
               Create_ActivityLevel.save(function(err, result) { // ActivityLevel Save Query
                  if(err) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations ActivityLevel Creation Query Error', 'ActivityLevel.controller.js');
                     reject(err);
                  } else {
                     ActivityLevelModel.ActivityLevelSchema
                        .findOne({'_id': result._id})
                        .populate({ path: 'Institution', select: ['Institution'] })
                        .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                        .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                        .exec(function(err_1, result_1) { // ActivityLevel FindOne Query
                        if(err_1) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations ActivityLevel Find Query Error', 'ActivityLevel.controller.js', err_1);
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
// ActivityLevel List -----------------------------------------------
   exports.ActivityLevel_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         ActivityLevelModel.ActivityLevelSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Institution', select: ['Institution'] })
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // ActivityLevel FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations ActivityLevel Find Query Error', 'ActivityLevel.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The ActivityLevels!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// ActivityLevel Simple List -----------------------------------------------
   exports.ActivityLevel_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
      }else {
         ActivityLevelModel.ActivityLevelSchema.find({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution), 'If_Deleted': false }, { ActivityLevel : 1 }, {sort: { updatedAt: -1 }}, function(err, result) { // ActivityLevel FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations ActivityLevel Find Query Error', 'ActivityLevel.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The ActivityLevels!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// ActivityLevel Update -----------------------------------------------
   exports.ActivityLevel_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.ActivityLevel_Id || ReceivingData.ActivityLevel_Id === '' ) {
         res.status(400).send({Status: false, Message: "ActivityLevel Id can not be empty" });
      }else if(!ReceivingData.ActivityLevel || ReceivingData.ActivityLevel === '' ) {
         res.status(400).send({Status: false, Message: "ActivityLevel can not be empty" });
      }else if(!ReceivingData.Institution || typeof ReceivingData.Institution === 'object') {
         res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         ActivityLevelModel.ActivityLevelSchema.findOne({'_id': ReceivingData.ActivityLevel_Id}, {}, {}, function(err, result) { // ActivityLevel FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations ActivityLevel FindOne Query Error', 'ActivityLevel.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The ActivityLevel!."});
            } else {
               if (result !== null) {
                  result.ActivityLevel = ReceivingData.ActivityLevel;
                  result.Institution = mongoose.Types.ObjectId(ReceivingData.Institution);
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // ActivityLevel Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations ActivityLevel Update Query Error', 'ActivityLevel.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the ActivityLevel!."});
                     } else {
                        ActivityLevelModel.ActivityLevelSchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Institution', select: ['Institution'] })
                           .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                           .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                           .exec(function(err_2, result_2) { // ActivityLevel FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations ActivityLevel Find Query Error', 'ActivityLevel.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The ActivityLevels!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "ActivityLevel Id can not be valid!" });
               }
            }
         });
      }
   };
// ActivityLevel Delete -----------------------------------------------
   exports.ActivityLevel_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.ActivityLevel_Id || ReceivingData.ActivityLevel_Id === '' ) {
         res.status(400).send({Status: false, Message: "ActivityLevel Id can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         ActivityLevelModel.ActivityLevelSchema.findOne({'_id': ReceivingData.ActivityLevel_Id}, {}, {}, function(err, result) { // ActivityLevel FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations ActivityLevel FindOne Query Error', 'ActivityLevel.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The ActivityLevel!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // ActivityLevel Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations ActivityLevel Delete Query Error', 'ActivityLevel.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the ActivityLevel!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "ActivityLevel Id can not be valid!" });
               }
            }
         });
      }
   };