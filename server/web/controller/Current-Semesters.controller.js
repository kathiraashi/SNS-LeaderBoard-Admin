var CryptoJS = require("crypto-js");
var CurrentSemestersModel = require('./../models/Current-Semesters.model');
var InstitutionManagementModel = require('./../models/Institution-Management.model');
var ErrorManagement = require('./../../handling/ErrorHandling.js');
var mongoose = require('mongoose');



// Current Semesters List -----------------------------------------------
exports.CurrentSemesters_List= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else {
      InstitutionManagementModel.InstitutionManagementSchema
         .find({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution)}, {Institution: 1, Department: 1, Course: 1}, {})
         .populate({ path: 'Course', select: ['Course', 'NoOfYears']})
         .populate({ path: 'Department', select: 'Department'})
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Current Semesters Find Query Error', 'Current-Semesters .controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Current Semesters !."});
            } else {
               result = JSON.parse(JSON.stringify(result));
               Promise.all(
                  result.map(obj => GetBatchesList(obj))
               ).then(Response => {
                  var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(Response), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
                  res.status(200).send({Status: true, Response: ReturnData });
               }).catch(Catch_Err => {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Current Semesters Find Query Error', 'Current-Semesters .controller.js', Catch_Err);
                  res.status(417).send({status: false, Message: "Some error occurred while Find The Current Semesters !."});
               });

               function GetBatchesList(obj) {
                  return new Promise((resolve, reject ) => {
                     CurrentSemestersModel.CurrentSemestersSchema
                     .find({ 'Institution_Management': mongoose.Types.ObjectId(obj._id), 'If_Deleted' : false}, {}, {})
                     .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
                     .populate({ path: 'Year', select: ['From_Year', 'To_Year', 'Show_Year']})
                     .populate({ path: 'Semester', select: ['Semester_Start', 'Semester_End', 'Semester_Name']})
                     .exec(function(err_1, result_1) {
                        if (err_1) {
                           reject(err_1)
                        }else {
                           var Json_obj = JSON.parse(JSON.stringify(obj));
                           Json_obj =  Object.assign({Batches_Array: result_1 }, Json_obj)
                           resolve(Json_obj);
                        }
                     })
                  })
               }
            }
         })
   }
};


//Institution Management Based Current Semesters List -----------------------------------------------
exports.InstitutionManagementBased_CurrentSemestersList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.InstitutionManagement || ReceivingData.InstitutionManagement === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Management Details can not be empty" });
   } else {
      CurrentSemestersModel.CurrentSemestersSchema
      .find({ 'Institution_Management': mongoose.Types.ObjectId(ReceivingData.InstitutionManagement), 'If_Deleted' : false}, {}, {})
      .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
      .populate({ path: 'Year', select: ['From_Year', 'To_Year', 'Show_Year']})
      .populate({ path: 'Semester', select: ['Semester_Start', 'Semester_End', 'Semester_Name', 'Sections_Arr']})
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Current Semesters Find Query Error', 'Current-Semesters .controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Current Semesters !."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         })
   }
};


// CurrentSemesters Create -----------------------------------------------
exports.CurrentSemesters_Create = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
      res.status(400).send({Status: false, Message: "Institution can not be empty" });
   }else if(!ReceivingData.Institution_Management || ReceivingData.Institution_Management === '' ) {
         res.status(400).send({Status: false, Message: "Institution Management can not be empty" });
   }else if(!ReceivingData.Batches_Array || typeof ReceivingData.Batches_Array !== 'object' || ReceivingData.Batches_Array.length <= 0 ) {
      res.status(400).send({Status: false, Message: "Batches Details can not be empty" });
   } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
      res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
   }else {
      var Batches_Active = [];
      CurrentSemestersModel.CurrentSemestersSchema
         .updateMany(   { 'If_Deleted' : false, 'Institution_Management': mongoose.Types.ObjectId(ReceivingData.Institution_Management) },
                        { $set: { 'If_Deleted' : true,  'Last_Modified_By': mongoose.Types.ObjectId(ReceivingData.Created_By) } })
         .exec( function(err, result) {
            if (err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Current Semesters Create Query Error', 'Current-Semesters.controller.js');
               res.status(417).send({Status: false, Message: "Some error occurred while Creating the Current Semesters!."})
            } else {
               ReceivingData.Batches_Array.map(obj => {
                  const Student = new CurrentSemestersModel.CurrentSemestersSchema({
                                                Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
                                                Institution_Management: mongoose.Types.ObjectId(ReceivingData.Institution_Management),
                                                Yearly_Badge: mongoose.Types.ObjectId(obj.Yearly_Badge),
                                                Year: mongoose.Types.ObjectId(obj.Year),
                                                Semester: mongoose.Types.ObjectId(obj.Semester),
                                                Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                                                Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                                                Active_Status: true,
                                                If_Deleted: false,
                                                createdAt: new Date(),
                                                updatedAt: new Date()
                                             });
                  Batches_Active.push(Student)
               });
               CurrentSemestersModel.CurrentSemestersSchema.collection.insertMany(Batches_Active, function(err_1, result_1) {
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Current Semesters Create Query Error', 'Current-Semesters.controller.js', err_1);
                     res.status(417).send({Status: false, Message: "Some error occurred while Creating the Current Semesters!."});
                  } else {
                     var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_1.ops), 'SecretKeyOut@123');
                     ReturnData = ReturnData.toString();
                     res.status(200).send({Status: true, Response: ReturnData });
                  }
               });
            }
         });
   }
};