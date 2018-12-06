var CryptoJS = require("crypto-js");
var ActivitiesModel = require('./../models/Activities.model.js');
var ErrorManagement = require('./../../handling/ErrorHandling.js');
var mongoose = require('mongoose');



// Activities List -----------------------------------------------
exports.Activities_List= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else {
      ActivitiesModel.ActivitiesSchema
         .find({'If_Deleted' : false}, {}, {sort: { updatedAt: -1 }})
         .populate({ path: 'Institution', select: 'Institution' })
         .populate({ path: 'Activity_Levels', select: ['ActivityLevel'] })
         .populate({ path: 'Achievement_Types', select: ['AchievementType'] })
         .populate({ path: 'MaxPoints_Array.Activity_Level', select: ['ActivityLevel'] })
         .populate({ path: 'MaxPoints_Array.Achievement_Type', select: ['AchievementType'] })
         .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
         .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Activities Find Query Error', 'Activities.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Activities !."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};


// Activities Create -----------------------------------------------
exports.Activities_Create = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
      res.status(400).send({Status: false, Message: "Institution can not be empty" });
   }else if(!ReceivingData.Activity_Name || ReceivingData.Activity_Name === '' ) {
         res.status(400).send({Status: false, Message: "Activity Name can not be empty" });
   }else if(!ReceivingData.Activity_Type || ReceivingData.Activity_Type === '') {
         res.status(400).send({Status: false, Message: "Activity Type can not be empty" });
   }else if(!ReceivingData.Description || ReceivingData.Description === '') {
      res.status(400).send({Status: false, Message: "Description can not be empty" });
   }else if(ReceivingData.Form_Extended === undefined || ReceivingData.Form_Extended === null) {
      res.status(400).send({Status: false, Message: "Form Not Valid" });
   } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
      res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
   }else {
      if (ReceivingData.Form_Extended && ReceivingData.Activity_Levels && ReceivingData.Activity_Levels !== null) {
         ReceivingData.Activity_Levels = ReceivingData.Activity_Levels.map(obj => mongoose.Types.ObjectId(obj['_id']) );
      };
      if (ReceivingData.Form_Extended && ReceivingData.Achievement_Types && ReceivingData.Achievement_Types !== null) {
         ReceivingData.Achievement_Types = ReceivingData.Achievement_Types.map(obj => mongoose.Types.ObjectId(obj['_id']) );
      };
      if (ReceivingData.Form_Extended && ReceivingData.MaxPoints_Array && ReceivingData.MaxPoints_Array !== null) {
         ReceivingData.MaxPoints_Array = ReceivingData.MaxPoints_Array.map(obj => { obj['Activity_Level'] = mongoose.Types.ObjectId(obj['Activity_Level']);
                                                                                    obj['Achievement_Type'] = mongoose.Types.ObjectId(obj['Achievement_Type']);
                                                                                    return obj;
                                                                                 });
      };
      const Create_Activities = new ActivitiesModel.ActivitiesSchema({
         Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
         Activity_Name: ReceivingData.Activity_Name,
         Activity_Type: ReceivingData.Activity_Type,
         Max_Points: ReceivingData.Max_Points,
         Description: ReceivingData.Description,
         Form_Extended: ReceivingData.Form_Extended,
         Activity_Levels: ReceivingData.Activity_Levels || [],
         Achievement_Types: ReceivingData.Achievement_Types || [],
         Skip_Activity: ReceivingData.Skip_Activity,
         MaxPoints_Array: ReceivingData.MaxPoints_Array,
         Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
         Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
         Active_Status: true,
         If_Deleted: false
      });
      Create_Activities.save(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Activities Create Query Error', 'Activities.controller.js');
            res.status(417).send({Status: false, Message: "Some error occurred while Creating the Activities!."});
         } else {
            ActivitiesModel.ActivitiesSchema
               .findOne({ '_id' : result._id}, {}, {})
               .populate({ path: 'Institution', select: 'Institution' })
               .populate({ path: 'Activity_Levels', select: ['ActivityLevel'] })
               .populate({ path: 'Achievement_Types', select: ['AchievementType'] })
               .populate({ path: 'MaxPoints_Array.Activity_Level', select: ['ActivityLevel'] })
               .populate({ path: 'MaxPoints_Array.Achievement_Type', select: ['AchievementType'] })
               .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
               .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
               .exec(function(err_1, result_1) {
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Activities Find Query Error', 'Activities.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Activities !."});
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


// Activities SimpleList -----------------------------------------------
exports.Activities_SimpleList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
         res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else {
      ActivitiesModel.ActivitiesSchema
         .find({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution), 'If_Deleted' : false}, {}, {sort: { updatedAt: -1 }})
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Activities Find Query Error', 'Activities.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Activities !."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};


// Activities View -----------------------------------------------
exports.Activities_View= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Activities_Id || ReceivingData.Activities_Id === ''  ) {
         res.status(400).send({Status: false, Message: "Activities Details can not be empty" });
   } else {
      ActivitiesModel.ActivitiesSchema
         .findOne({'_id': mongoose.Types.ObjectId(ReceivingData.Activities_Id) }, {}, {})
         .populate({ path: 'Institution', select: 'Institution' })
         .populate({ path: 'Department', select: 'Department' })
         .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
         .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Activities Find Query Error', 'Activities.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Activities !."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};
