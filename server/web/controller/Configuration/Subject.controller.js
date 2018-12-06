var CryptoJS = require("crypto-js");
var SubjectModel = require('./../../models/Configuration/Subject.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');




// ************************************************** Subject *****************************************************
// Subject Async Validate -----------------------------------------------
   exports.Subject_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Subject || ReceivingData.Subject === '' ) {
         res.status(400).send({Status: false, Message: "Subject can not be empty" });
      } else if (!ReceivingData.Institution || typeof ReceivingData.Institution !== 'object' || ReceivingData.Institution.length <= 0) {
         res.status(400).send({Status: false, Message: "Institutions List can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         ReceivingData.Institution = ReceivingData.Institution.map( obj => mongoose.Types.ObjectId(obj));
         SubjectModel.SubjectSchema.findOne({   'Subject': { $regex : new RegExp("^" + ReceivingData.Subject + "$", "i") },
                                                            'Institution': { $in : ReceivingData.Institution },
                                                            'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Subject Find Query Error', 'Subject.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Subject!."});
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
// Subject Update Async Validate -----------------------------------------------
   exports.SubjectUpdate_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Subject || ReceivingData.Subject === '' ) {
         res.status(400).send({Status: false, Message: "Subject can not be empty" });
      } else if (!ReceivingData.Institution || typeof ReceivingData.Institution === '') {
         res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         SubjectModel.SubjectSchema.findOne({   'Subject': { $regex : new RegExp("^" + ReceivingData.Subject + "$", "i") },
                                                            'Institution': mongoose.Types.ObjectId(ReceivingData.Institution) ,
                                                            'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Subject Find Query Error', 'Subject.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Subject!."});
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
// Subject Create -----------------------------------------------
   exports.Subject_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Subject || ReceivingData.Subject === '' ) {
         res.status(400).send({Status: false, Message: "Subject can not be empty" });
      }else if(!ReceivingData.Institution || typeof ReceivingData.Institution !== 'object' || ReceivingData.Institution.length <= 0 ) {
            res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {
         ReceivingData.Institution = ReceivingData.Institution.map(obj => mongoose.Types.ObjectId(obj));
         Promise.all(
            ReceivingData.Institution.map(obj => SaveSubject(obj))
         ).then(response => {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }).catch( err => {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Subject Creation Query Error', 'Subject.controller.js');
            res.status(417).send({status: false, Error:err, Message: "Some error occurred while Create The Subjects!."});
         })

         function SaveSubject(obj) {
            return new Promise( (resolve, reject) => {
               var Create_Subject = new SubjectModel.SubjectSchema({
                  Subject: ReceivingData.Subject,
                  Institution: obj,
                  Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                  Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                  Active_Status: true,
                  If_Deleted: false
               });
               Create_Subject.save(function(err, result) { // Subject Save Query
                  if(err) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Subject Creation Query Error', 'Subject.controller.js');
                     reject(err);
                  } else {
                     SubjectModel.SubjectSchema
                        .findOne({'_id': result._id})
                        .populate({ path: 'Institution', select: ['Institution'] })
                        .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                        .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                        .exec(function(err_1, result_1) { // Subject FindOne Query
                        if(err_1) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Subject Find Query Error', 'Subject.controller.js', err_1);
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
// Subject List -----------------------------------------------
   exports.Subject_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         SubjectModel.SubjectSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Institution', select: ['Institution'] })
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // Subject FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Subject Find Query Error', 'Subject.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Subjects!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Subject Simple List -----------------------------------------------
   exports.Subject_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
      }else {
         SubjectModel.SubjectSchema.find({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution), 'If_Deleted': false }, { Subject : 1 }, {sort: { updatedAt: -1 }}, function(err, result) { // Subject FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Subject Find Query Error', 'Subject.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Subjects!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Subject Update -----------------------------------------------
   exports.Subject_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Subject_Id || ReceivingData.Subject_Id === '' ) {
         res.status(400).send({Status: false, Message: "Subject Id can not be empty" });
      }else if(!ReceivingData.Subject || ReceivingData.Subject === '' ) {
         res.status(400).send({Status: false, Message: "Subject can not be empty" });
      }else if(!ReceivingData.Institution || typeof ReceivingData.Institution === 'object') {
         res.status(400).send({Status: false, Message: "Institutions can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         SubjectModel.SubjectSchema.findOne({'_id': ReceivingData.Subject_Id}, {}, {}, function(err, result) { // Subject FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Subject FindOne Query Error', 'Subject.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Subject!."});
            } else {
               if (result !== null) {
                  result.Subject = ReceivingData.Subject;
                  result.Institution = mongoose.Types.ObjectId(ReceivingData.Institution);
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Subject Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Subject Update Query Error', 'Subject.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Subject!."});
                     } else {
                        SubjectModel.SubjectSchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Institution', select: ['Institution'] })
                           .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                           .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                           .exec(function(err_2, result_2) { // Subject FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Subject Find Query Error', 'Subject.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The Subjects!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Subject Id can not be valid!" });
               }
            }
         });
      }
   };
// Subject Delete -----------------------------------------------
   exports.Subject_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Subject_Id || ReceivingData.Subject_Id === '' ) {
         res.status(400).send({Status: false, Message: "Subject Id can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         SubjectModel.SubjectSchema.findOne({'_id': ReceivingData.Subject_Id}, {}, {}, function(err, result) { // Subject FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Subject FindOne Query Error', 'Subject.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Subject!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Subject Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Subject Delete Query Error', 'Subject.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the Subject!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Subject Id can not be valid!" });
               }
            }
         });
      }
   };