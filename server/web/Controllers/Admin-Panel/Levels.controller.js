var CryptoJS = require("crypto-js");
var LevelsModel = require('./../../models/Levels.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');
var multer = require('multer');


var Batch_Image_Storage = multer.diskStorage({
   destination: (req, file, cb) => { cb(null, './Uploads/Batches'); },
   filename: (req, file, cb) => { cb(null, 'Batch_' + Date.now() + '.png'); }
});
var Batch_Image_Upload = multer({
   storage: Batch_Image_Storage,
   fileFilter: function (req, file, callback) {
       let extArray = file.originalname.split(".");
       let extension = (extArray[extArray.length - 1]).toLowerCase();
       if(extension !== 'png' && extension !== 'jpg' && extension !== 'gif' && extension !== 'jpeg') {
           return callback("Only 'png, gif, jpg and jpeg' images are allowed");
       }
       callback(null, true);
   }
}).single('batch');




// Level Create Validate -----------------------------------------------
exports.Levels_Create_Validate= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Level_Name || ReceivingData.Level_Name === ''  ) {
      res.status(400).send({Status: false, Message: "Level Name can not be empty" });
   }else if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else {
      Promise.all([
         LevelsModel.LevelsSchema.findOne({'Institution': mongoose.Types.ObjectId(ReceivingData.Institution), 'Level_Name': ReceivingData.Level_Name, 'If_Deleted' : false}, {}, {}).exec(),
         LevelsModel.LevelsSchema.findOne({'Institution': mongoose.Types.ObjectId(ReceivingData.Institution), 'If_Deleted' : false}, {}, {}).exec()
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
   Batch_Image_Upload(req, res, function(upload_err) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution can not be empty" });
      }else if(!ReceivingData.Level_Name || ReceivingData.Level_Name === '' ) {
            res.status(400).send({Status: false, Message: "Level Name can not be empty" });
      }else if(!ReceivingData.Activities || typeof ReceivingData.Activities !== 'object' || ReceivingData.Activities.length <= 0) {
         res.status(400).send({Status: false, Message: "Activities can not be empty" });
      }else if(ReceivingData.ItsBaseLevel === null || ReceivingData.ItsBaseLevel === '') {
         res.status(400).send({Status: false, Message: "Level Details can not be valid" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {

         var _Image = {};
         if(req.file !== null && req.file !== undefined && req.file !== ''){
            _Image = { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size };
         }

         ReceivingData.Activities = ReceivingData.Activities.map(obj => mongoose.Types.ObjectId(obj));
         if (ReceivingData.EligiblePreviousLevel !== '' && ReceivingData.EligiblePreviousLevel && ReceivingData.EligiblePreviousLevel !== null) {
            ReceivingData.EligiblePreviousLevel = mongoose.Types.ObjectId(ReceivingData.EligiblePreviousLevel);
         } else {
            ReceivingData.EligiblePreviousLevel = null;
         }
         const Create_Levels = new LevelsModel.LevelsSchema({
            Level_Name: ReceivingData.Level_Name,
            Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
            Activities: ReceivingData.Activities,
            ItsBaseLevel: ReceivingData.ItsBaseLevel,
            Batch: _Image, 
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
   });
};

// Institution Based Levels  Simple List -----------------------------------------------
exports.InstitutionBased_Levels_SimpleList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else {
      LevelsModel.LevelsSchema
         .find({'Institution': mongoose.Types.ObjectId(ReceivingData.Institution), 'If_Deleted' : false}, {Level_Name: 1}, {sort: { updatedAt: -1 }})
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Levels Find Query Error', 'Levels.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Levels !."});
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
         .populate({ path: 'Activities', select: 'Activity_Name' })
         .populate({ path: 'EligiblePreviousLevel', select: 'Level_Name' })
         .populate({ path: 'Created_By', select: 'Name'})
         .populate({ path: 'Last_Modified_By', select: 'Name' })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Levels Find Query Error', 'Levels.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Levels !."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};