var CryptoJS = require("crypto-js");
var RedemptionMethodModel = require('./../../../models/Configuration/ActivityConfig/RedemptionMethod.model.js');
var ErrorManagement = require('./../../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');




// ************************************************** RedemptionMethod *****************************************************
   // RedemptionMethod Async Validate -----------------------------------------------
   exports.RedemptionMethod_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.RedemptionMethod || ReceivingData.RedemptionMethod === '' ) {
         res.status(400).send({Status: false, Message: "Redemption Method Title can not be empty" });
      } else if (!ReceivingData.Institution || typeof ReceivingData.Institution !== 'object' || ReceivingData.Institution.length <= 0) {
         res.status(400).send({Status: false, Message: "Institutions List can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         ReceivingData.Institution = ReceivingData.Institution.map( obj => mongoose.Types.ObjectId(obj));
         RedemptionMethodModel.RedemptionMethodSchema.findOne({   'RedemptionMethod': { $regex : new RegExp("^" + ReceivingData.RedemptionMethod + "$", "i") },
                                                            'Institution': { $in : ReceivingData.Institution },
                                                            'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Redemption Method Find Query Error', 'RedemptionMethod.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Redemption Method!."});
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
   // RedemptionMethod Update Async Validate -----------------------------------------------
   exports.RedemptionMethodUpdate_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.RedemptionMethod || ReceivingData.RedemptionMethod === '' ) {
         res.status(400).send({Status: false, Message: "Redemption Method Title can not be empty" });
      } else if (!ReceivingData.Institution || typeof ReceivingData.Institution === '') {
         res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         RedemptionMethodModel.RedemptionMethodSchema.findOne({   'RedemptionMethod': { $regex : new RegExp("^" + ReceivingData.RedemptionMethod + "$", "i") },
                                                            'Institution': mongoose.Types.ObjectId(ReceivingData.Institution) ,
                                                            'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Redemption Method Find Query Error', 'RedemptionMethod.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Redemption Method!."});
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
// RedemptionMethod Create -----------------------------------------------
   exports.RedemptionMethod_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.RedemptionMethod || ReceivingData.RedemptionMethod === '' ) {
         res.status(400).send({Status: false, Message: "Redemption Method Title can not be empty" });
      } else if (!ReceivingData.MaximumPointsRegarding || ReceivingData.MaximumPointsRegarding === ''  ) {
         res.status(400).send({Status: false, Message: "Maximum Points Regarding can not be empty" });
      } else if (!ReceivingData.ConvertedToDescription || ReceivingData.ConvertedToDescription === ''  ) {
         res.status(400).send({Status: false, Message: "Converted To Description can not be empty" });
      }else if(!ReceivingData.Institution || typeof ReceivingData.Institution !== 'object' || ReceivingData.Institution.length <= 0 ) {
            res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {
         ReceivingData.Institution = ReceivingData.Institution.map(obj => mongoose.Types.ObjectId(obj));
         Promise.all(
            ReceivingData.Institution.map(obj => SaveRedemptionMethod(obj))
         ).then(response => {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }).catch( err => {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Redemption Method Creation Query Error', 'RedemptionMethod.controller.js');
            res.status(417).send({status: false, Error:err, Message: "Some error occurred while Create The RedemptionMethods!."});
         })

         function SaveRedemptionMethod(obj) {
            return new Promise( (resolve, reject) => {
               var Create_RedemptionMethod = new RedemptionMethodModel.RedemptionMethodSchema({
                  RedemptionMethod: ReceivingData.RedemptionMethod,
                  MaximumPointsRegarding: ReceivingData.MaximumPointsRegarding,
                  ConvertedToDescription: ReceivingData.ConvertedToDescription,
                  Institution: obj,
                  Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                  Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                  Active_Status: true,
                  If_Deleted: false
               });
               Create_RedemptionMethod.save(function(err, result) { // RedemptionMethod Save Query
                  if(err) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Redemption Method Creation Query Error', 'RedemptionMethod.controller.js');
                     reject(err);
                  } else {
                     RedemptionMethodModel.RedemptionMethodSchema
                        .findOne({'_id': result._id})
                        .populate({ path: 'Institution', select: ['Institution'] })
                        .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                        .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                        .exec(function(err_1, result_1) { // RedemptionMethod FindOne Query
                        if(err_1) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Redemption Method Find Query Error', 'RedemptionMethod.controller.js', err_1);
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
// RedemptionMethod List -----------------------------------------------
   exports.RedemptionMethod_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         RedemptionMethodModel.RedemptionMethodSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Institution', select: ['Institution'] })
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // RedemptionMethod FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Redemption Method Find Query Error', 'RedemptionMethod.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The RedemptionMethods!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// RedemptionMethod Simple List -----------------------------------------------
   exports.RedemptionMethod_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
      }else {
         RedemptionMethodModel.RedemptionMethodSchema.find({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution), 'If_Deleted': false }, { RedemptionMethod : 1 }, {sort: { updatedAt: -1 }}, function(err, result) { // RedemptionMethod FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Redemption Method Find Query Error', 'RedemptionMethod.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The RedemptionMethods!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// RedemptionMethod Update -----------------------------------------------
   exports.RedemptionMethod_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.RedemptionMethod_Id || ReceivingData.RedemptionMethod_Id === '' ) {
         res.status(400).send({Status: false, Message: "Redemption Method Details can not be empty" });
      }else if(!ReceivingData.RedemptionMethod || ReceivingData.RedemptionMethod === '' ) {
         res.status(400).send({Status: false, Message: "Redemption Method can not be empty" });
      }else if(!ReceivingData.MaximumPointsRegarding || ReceivingData.MaximumPointsRegarding === '' ) {
         res.status(400).send({Status: false, Message: "Maximum Points Regarding can not be empty" });
      }else if(!ReceivingData.ConvertedToDescription || ReceivingData.ConvertedToDescription === '' ) {
         res.status(400).send({Status: false, Message: "Converted To Description can not be empty" });
      }else if(!ReceivingData.Institution || typeof ReceivingData.Institution === 'object') {
         res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         RedemptionMethodModel.RedemptionMethodSchema.findOne({'_id': ReceivingData.RedemptionMethod_Id}, {}, {}, function(err, result) { // RedemptionMethod FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Redemption Method FindOne Query Error', 'RedemptionMethod.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The RedemptionMethod!."});
            } else {
               if (result !== null) {
                  result.RedemptionMethod = ReceivingData.RedemptionMethod;
                  result.MaximumPointsRegarding = ReceivingData.MaximumPointsRegarding;
                  result.ConvertedToDescription = ReceivingData.ConvertedToDescription;
                  result.Institution = mongoose.Types.ObjectId(ReceivingData.Institution);
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // RedemptionMethod Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Redemption Method Update Query Error', 'RedemptionMethod.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Redemption Method!."});
                     } else {
                        RedemptionMethodModel.RedemptionMethodSchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Institution', select: ['Institution'] })
                           .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                           .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                           .exec(function(err_2, result_2) { // RedemptionMethod FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Redemption Method Find Query Error', 'RedemptionMethod.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The Redemption Methods!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Redemption Method Details can not be valid!" });
               }
            }
         });
      }
   };
// RedemptionMethod Delete -----------------------------------------------
   exports.RedemptionMethod_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.RedemptionMethod_Id || ReceivingData.RedemptionMethod_Id === '' ) {
         res.status(400).send({Status: false, Message: "Redemption Method Details can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         RedemptionMethodModel.RedemptionMethodSchema.findOne({'_id': ReceivingData.RedemptionMethod_Id}, {}, {}, function(err, result) { // RedemptionMethod FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Redemption Method FindOne Query Error', 'RedemptionMethod.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The RedemptionMethod!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // RedemptionMethod Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Redemption Method Delete Query Error', 'RedemptionMethod.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the RedemptionMethod!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Redemption Method Details can not be valid!" });
               }
            }
         });
      }
   };