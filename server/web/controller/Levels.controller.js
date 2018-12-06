var CryptoJS = require("crypto-js");
var LevelsModel = require('./../models/Levels.model.js');
var ErrorManagement = require('./../../handling/ErrorHandling.js');
var mongoose = require('mongoose');



// Level Create Validate -----------------------------------------------
exports.Levels_Create_Validate= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Level_Name || ReceivingData.Level_Name === ''  ) {
      res.status(400).send({Status: false, Message: "Level Name can not be empty" });
   }else if (!ReceivingData.Department || ReceivingData.Department === ''  ) {
      res.status(400).send({Status: false, Message: "Department Details can not be empty" });
   } else {
      Promise.all([
         LevelsModel.LevelsSchema.findOne({'Department': mongoose.Types.ObjectId(ReceivingData.Department), 'Level_Name': ReceivingData.Level_Name, 'If_Deleted' : false}, {}, {}).exec(),
         LevelsModel.LevelsSchema.findOne({'Department': mongoose.Types.ObjectId(ReceivingData.Department), 'If_Deleted' : false}, {}, {}).exec()
      ]).then( response => {
         var NameAvailable = true;
         var ItsBaseLevel = true;
         if (response[0] !== null) { NameAvailable = false; }         
         if (response[1] !== null) { ItsBaseLevel = false; } 
         setTimeout(() => {
            res.status(200).send({Status: true, ItsBaseLevel: ItsBaseLevel, NameAvailable: NameAvailable });
         }, 100);
      }).catch( Catch_err => {
         ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Levels Validate Find Query Error', 'Levels.controller.js', Catch_err);
         res.status(417).send({status: false, Message: "Some error occurred while Validate The Levels!."});
      });
   }
};




// Level Create -----------------------------------------------
exports.Levels_Create = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
      res.status(400).send({Status: false, Message: "Institution can not be empty" });
   }else if(!ReceivingData.Level_Name || ReceivingData.Level_Name === '' ) {
         res.status(400).send({Status: false, Message: "Level Name can not be empty" });
   }else if(!ReceivingData.Department || ReceivingData.Department === '') {
         res.status(400).send({Status: false, Message: "Department can not be empty" });
   }else if(!ReceivingData.Activities || typeof ReceivingData.Activities !== 'object' || ReceivingData.Activities.length <= 0) {
      res.status(400).send({Status: false, Message: "Activities can not be empty" });
   }else if(ReceivingData.ItsBaseLevel === null || ReceivingData.ItsBaseLevel === '') {
      res.status(400).send({Status: false, Message: "Level Details can not be valid" });
   } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
      res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
   }else {
      ReceivingData.Activities = ReceivingData.Activities.map(obj => mongoose.Types.ObjectId(obj));
      if (ReceivingData.EligiblePreviousLevel !== '' && ReceivingData.EligiblePreviousLevel && ReceivingData.EligiblePreviousLevel !== null) {
         ReceivingData.EligiblePreviousLevel = mongoose.Types.ObjectId(ReceivingData.EligiblePreviousLevel);
      } else {
         ReceivingData.EligiblePreviousLevel = null;
      }
      const Create_Levels = new LevelsModel.LevelsSchema({
         Level_Name: ReceivingData.Level_Name,
         Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
         Department: mongoose.Types.ObjectId(ReceivingData.Department),
         Activities: ReceivingData.Activities,
         ItsBaseLevel: ReceivingData.ItsBaseLevel,
         EligiblePoints: ReceivingData.EligiblePoints,
         EligiblePreviousLevel: ReceivingData.EligiblePreviousLevel,
         Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
         Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
         Active_Status: true,
         If_Deleted: false
      });
      Create_Levels.save(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Level Create Query Error', 'Levels.controller.js');
            res.status(417).send({Status: false, Message: "Some error occurred while Creating the Level!."});
         } else {
            LevelsModel.LevelsSchema
            .findOne({'_id': mongoose.Types.ObjectId(result._id) }, {}, {})
            .populate({ path: 'Institution', select: 'Institution' })
            .populate({ path: 'Department', select: 'Department' })
            .populate({ path: 'Activities', select: 'Activity_Name' })
            .populate({ path: 'EligiblePreviousLevel', select: 'Level_Name' })
            .populate({ path: 'Created_By', select: 'Name'})
            .populate({ path: 'Last_Modified_By', select: 'Name' })
            .exec(function(err, result) {
               if(err) {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Level Find Query Error', 'Levels.controller.js', err);
                  res.status(417).send({status: false, Message: "Some error occurred while Find The Level !."});
               } else {
                  var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
                  res.status(200).send({Status: true, Response: ReturnData });
               }
         });
         }
      });
   }
};


// Department Based Levels  Simple List -----------------------------------------------
exports.DepartmentBased_Levels_SimpleList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Department || ReceivingData.Department === ''  ) {
      res.status(400).send({Status: false, Message: "Department Details can not be empty" });
   } else {
      LevelsModel.LevelsSchema
         .find({'Department': mongoose.Types.ObjectId(ReceivingData.Department), 'If_Deleted' : false}, {Level_Name: 1}, {sort: { updatedAt: -1 }})
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Staffs Find Query Error', 'Staffs.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Staffs !."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};

// Levels List -----------------------------------------------
exports.Levels_List= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else {
      LevelsModel.LevelsSchema
         .find({'If_Deleted' : false}, {}, {sort: { updatedAt: -1 }})
         .populate({ path: 'Institution', select: 'Institution' })
         .populate({ path: 'Department', select: 'Department' })
         .populate({ path: 'Activities', select: 'Activity_Name' })
         .populate({ path: 'EligiblePreviousLevel', select: 'Level_Name' })
         .populate({ path: 'Created_By', select: 'Name'})
         .populate({ path: 'Last_Modified_By', select: 'Name' })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Staffs Find Query Error', 'Staffs.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Staffs !."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};