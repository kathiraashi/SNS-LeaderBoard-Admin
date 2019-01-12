var CryptoJS = require("crypto-js");
var LevelsModel = require('./../../models/Levels.model');
var ActivitiesModel = require('./../../models/Activities.model');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');

// Activities List -----------------------------------------------
exports.Activities_List= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.Student || ReceivingData.Student === ''  ) {
      res.status(400).send({Status: false, Message: "Login Details Not Valid" });
   } else if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
         res.status(400).send({Status: false, Message: "Login Details Not Valid" });
   } else {
      LevelsModel.LevelsSchema
         .find({'Institution': mongoose.Types.ObjectId(ReceivingData.Institution), 'If_Deleted' : false},
               {Level_Name: 1, Activities: 1, Batch: 1, EligiblePoints: 1, EligiblePreviousLevel: 1, ItsBaseLevel: 1},
               {sort: { updatedAt: 1 }})
         .populate({ path: 'Activities', select: ['Activity_Type', 'Activity_Name', 'Description', 'MaxPoints_Array', 'Skip_Activity'] })
         .populate({ path: 'EligiblePreviousLevel', select: ['Level_Name', 'ItsBaseLevel'] })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Levels Find Query Error', 'Activities.controller.js', err);
               res.status(417).send({status: false, Message: "Some Error Occurred!."});
            } else {

               result = JSON.parse(JSON.stringify(result));
               Promise.all(
                  result.map(obj => GetLevelManagementDetails(obj))
               ).then(  response => {
                  response = response.filter(obj => obj.Level_Assigned);
                  var Activities = [];
                  response.map(obj => {
                     obj['Activities'] = obj['Activities'].filter(obj_1 => obj_1['Activity_Type']['Key'] !== 'Academic');
                     obj['Activities'].map(obj_1 => {
                        obj_1['Level'] = {   Level: obj['_id'], Level_Name: obj['Level_Name'], Level_Status: obj['Level_Status'], ItsBaseLevel: obj['ItsBaseLevel'],
                                             Batch: obj['Batch'], EligiblePoints: obj['EligiblePoints'], EligiblePreviousLevel: obj['EligiblePreviousLevel'] };
                        Activities.push(obj_1);
                     });
                  });

                  Activities = JSON.parse(JSON.stringify(Activities));
                  Promise.all(
                     Activities.map(obj => GetActivitiesManagementDetails(obj))
                  ).then( response_1 => {
                     var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(response_1), 'SecretKeyOut@123');
                     ReturnData = ReturnData.toString();
                     res.status(200).send({Status: true, Response: ReturnData });
                  }).catch( catch_err_1 => {
                     console.log(catch_err_1);
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', catch_err);
                     res.status(417).send({status: false, Message: "Some Error Occurred !."});
                  });

                  function GetActivitiesManagementDetails(Obj) {
                     return new Promise( (resole, reject) => {
                        ActivitiesModel.StudentActivitiesManagementSchema
                           .findOne({'If_Deleted' : false, 'Activity': mongoose.Types.ObjectId(Obj._id), 'Student': mongoose.Types.ObjectId(ReceivingData.Student), 'Level': mongoose.Types.ObjectId(Obj.Level._id)}, {}, {})
                           .exec(function(err_1, result_1) {
                              if(err_1) {
                                 reject(err_1);
                              } else {
                                 var Json_Obj = JSON.parse(JSON.stringify(Obj));
                                 if (result_1 !== null) {
                                    Json_Obj = Object.assign({Activity_Assigned: true}, Json_Obj);
                                    Json_Obj = Object.assign({Activity_Status: result_1.Level_Status}, Json_Obj);
                                 } else {
                                    Json_Obj = Object.assign({Activity_Assigned: false}, Json_Obj);
                                    Json_Obj = Object.assign({Activity_Status: 'In_Progress'}, Json_Obj);
                                 }
                                 resole(Json_Obj);
                              }
                           });
                     })
                  }
               }).catch( catch_err => {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Levels Management Find Query Error', 'Activities.controller.js', catch_err);
                  res.status(417).send({status: false, Message: "Some Error Occurred!."});
               });

               function GetLevelManagementDetails(Obj) {
                  return new Promise( (resole, reject) => {
                     LevelsModel.StudentLevelsManagementSchema
                        .findOne({'If_Deleted' : false, 'Student': mongoose.Types.ObjectId(ReceivingData.Student), 'Level': mongoose.Types.ObjectId(Obj._id)}, {}, {})
                        .exec(function(err_1, result_1) {
                           if(err_1) {
                              reject(err_1);
                           } else {
                              var Json_Obj = JSON.parse(JSON.stringify(Obj));
                              if	(Obj.ItsBaseLevel){
                                 Json_Obj = Object.assign({Level_Assigned: true}, Json_Obj);
                                 if (result_1 !== null) {
                                    Json_Obj = Object.assign({Level_Status: result_1.Level_Status}, Json_Obj);
                                 } else {
                                    Json_Obj = Object.assign({Level_Status: 'In_Progress'}, Json_Obj);
                                 }
                              } else {
                                 if (result_1 !== null) {
                                    Json_Obj = Object.assign({Level_Assigned: true}, Json_Obj);
                                    Json_Obj = Object.assign({Level_Status: result_1.Level_Status}, Json_Obj);
                                 } else {
                                    Json_Obj = Object.assign({Level_Assigned: false}, Json_Obj);
                                 }
                              }
                              resole(Json_Obj);
                           }
                        });
                  })
               }

            }
      });
   }
};
