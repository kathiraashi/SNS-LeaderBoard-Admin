var CryptoJS = require("crypto-js");
var InstitutionManagementModel = require('./../models/Institution-Management.model.js');
var ErrorManagement = require('./../../handling/ErrorHandling.js');
var mongoose = require('mongoose');


// Institution List -----------------------------------------------
exports.InstitutionManagement_List= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.Institution_Id || ReceivingData.Institution_Id === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else {
      InstitutionManagementModel.InstitutionManagementSchema
         .find({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution_Id)}, {}, {})
         .populate({ path: 'Institution', select: ['Institution'] })
         .populate({ path: 'Course', select: ['Course']})
         .populate({ path: 'Department', select: ['Department']})
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Find Query Error', 'Institution-Management.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management !."});
            } else {
               result.sort(function (a, b) {
                  if(a.Course.Course.toLowerCase() < b.Course.Course.toLowerCase()) { return -1; }
                  if(a.Course.Course.toLowerCase() > b.Course.Course.toLowerCase()) { return 1; }
                  return 0; 
               });
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};





// Batches List -----------------------------------------------
exports.InstitutionManagement_YearlyBatchesList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.InstitutionManagement_Id || ReceivingData.InstitutionManagement_Id === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Management Details can not be empty" });
   } else {
      InstitutionManagementModel.InstitutionManagementSchema
      .findOne({ '_id': mongoose.Types.ObjectId(ReceivingData.InstitutionManagement_Id)}, {}, {})
      .populate({ path: 'Institution', select: ['Institution'] })
      .populate({ path: 'Course', select: ['Course', 'NoOfYears']})
      .populate({ path: 'Department', select: ['Department']})
      .exec(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Find Query Error', 'Institution-Management.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management !."});
         } else {
            if (result !== null) {
               InstitutionManagementModel.YearlyBatchesSchema
               .find({ 'InstitutionManagement': mongoose.Types.ObjectId(ReceivingData.InstitutionManagement_Id)}, {}, { sort: { To_Year: -1 } })
               .populate({ path: 'InstitutionManagement', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
               .populate({ path: 'InstitutionManagement', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears'] } })
               .populate({ path: 'InstitutionManagement', select: 'Department', populate: { path: 'Department', select: 'Department' } })
               .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
               .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
               .exec(function(err_1, result_1) {
                  if(err) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Yearly Batches Find Query Error', 'Institution-Management.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Yearly Batches!."});
                  } else {
                     var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                     ReturnData = ReturnData.toString();
                     var ReturnData_1 = CryptoJS.AES.encrypt(JSON.stringify(result_1), 'SecretKeyOut@123');
                     ReturnData_1 = ReturnData_1.toString();
                     res.status(200).send({Status: true, Basic_Data: ReturnData, Response: ReturnData_1,  });
                  }
               });
            } else {
               res.status(417).send({status: false, Message: "Institution Management Details Not Valid!."});
            }
         }
      });
   }
};




// Batches Create -----------------------------------------------
exports.InstitutionManagement_YearlyBatchesCreate = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.InstitutionManagement || ReceivingData.InstitutionManagement === '' ) {
      res.status(400).send({Status: false, Message: "Institution Management can not be empty" });
   }else if(!ReceivingData.Starting_MonthAndYear || ReceivingData.Starting_MonthAndYear === '' ) {
         res.status(400).send({Status: false, Message: "Batches Start Month & Year can not be empty" });
   }else if(!ReceivingData.Ending_MonthAndYear || ReceivingData.Ending_MonthAndYear === '') {
         res.status(400).send({Status: false, Message: "Batches End Month & Year can not be empty" });
   }else if(!ReceivingData.Years_Array || typeof ReceivingData.Years_Array !== 'object' || ReceivingData.Years_Array.length <= 0 ) {
      res.status(400).send({Status: false, Message: "Batches Details can not be empty" });
   } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
      res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
   }else {
      var Create_YearlyBatches= new InstitutionManagementModel.YearlyBatchesSchema({
         InstitutionManagement: mongoose.Types.ObjectId(ReceivingData.InstitutionManagement),
         Starting_MonthAndYear: ReceivingData.Starting_MonthAndYear,
         Ending_MonthAndYear: ReceivingData.Ending_MonthAndYear,
         Years_Array: ReceivingData.Years_Array,
         Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
         Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
         Active_Status: true,
         If_Deleted: false
      });
      Create_YearlyBatches.save(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Yearly Batches Creation Query Error', 'Institution-Management.controller.js');
            res.status(417).send({Status: false, Message: "Some error occurred while creating the Institution!."});
         } else {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }
      });
   }
};