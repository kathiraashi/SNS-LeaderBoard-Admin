var CryptoJS = require("crypto-js");
var InstitutionManagementModel = require('./../../models/Institution-Management.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');


// Institution List -----------------------------------------------
exports.InstitutionManagement_List= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else {
      InstitutionManagementModel.InstitutionManagementSchema
         .find({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution)}, {}, {})
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

// Department Based Institution Management List -----------------------------------------------
exports.DepartmentBased_InstitutionManagement_List= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else if (!ReceivingData.Department || ReceivingData.Department === ''  ) {
      res.status(400).send({Status: false, Message: "Department Details can not be empty" });
   } else {
      InstitutionManagementModel.InstitutionManagementSchema
         .find({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution), 'Department': mongoose.Types.ObjectId(ReceivingData.Department)}, {}, {})
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
   } else if (!ReceivingData.InstitutionManagement || ReceivingData.InstitutionManagement === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Management Details can not be empty" });
   } else {
      InstitutionManagementModel.InstitutionManagementSchema
      .findOne({ '_id': mongoose.Types.ObjectId(ReceivingData.InstitutionManagement)}, {}, {})
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
               .find({ 'InstitutionManagement': mongoose.Types.ObjectId(ReceivingData.InstitutionManagement)}, {}, { sort: { Ending_MonthAndYear: -1 } })
               .populate({ path: 'InstitutionManagement', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
               .populate({ path: 'InstitutionManagement', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears'] } })
               .populate({ path: 'InstitutionManagement', select: 'Department', populate: { path: 'Department', select: 'Department' } })
               .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
               .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
               .exec(function(err_1, result_1) {
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Yearly Batches Find Query Error', 'Institution-Management.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Yearly Batches!."});
                  } else {
                     Promise.all(
                        result_1.map(obj => YearsArrayFind(obj))
                     ).then(response => {
                        var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                        ReturnData = ReturnData.toString();
                        var ReturnData_1 = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
                        ReturnData_1 = ReturnData_1.toString();
                        res.status(200).send({Status: true, Basic_Data: ReturnData, Response: ReturnData_1,  });
                     }).catch( catch_err => {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Yearly Batches Find Query Error', 'Institution-Management.controller.js', catch_err);
                        res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Yearly Batches!."})
                     });

                     function YearsArrayFind(obj) {
                        return new Promise((resolve, reject ) => {
                           InstitutionManagementModel.BatchYearsSchema
                           .find({ 'YearlyBatch': mongoose.Types.ObjectId(obj._id)}, {}, { sort: { To_Year: 1 } })
                           .exec(function(err_2, result_2) {
                              if (err_2) {
                                 reject(err_2)
                              }else {
                                 Promise.all(
                                    result_2.map(obj_1 => Semesters(obj_1))
                                 ).then(response_1 => {
                                    var Json_obj = JSON.parse(JSON.stringify(obj));
                                       Json_obj =  Object.assign({Years_Array: response_1 }, Json_obj);
                                    resolve(Json_obj);
                                 }).catch( catch_err1 => {
                                    reject(catch_err1);
                                 });

                                 function Semesters(obj_1) {
                                    return new Promise((resolve_1, reject_1) => {
                                       InstitutionManagementModel.YearSemestersSchema
                                          .find({ 'BatchYear': mongoose.Types.ObjectId(obj_1._id)}, {}, { sort: { Semester_End: 1 } })
                                          .exec(function(err_3, result_3) {
                                             if (err_3) {
                                                reject_1(err_3)
                                             }else {
                                                var Json_obj_1 = JSON.parse(JSON.stringify(obj_1));
                                                Json_obj_1 =  Object.assign({Semesters: result_3 }, Json_obj_1)
                                                resolve_1(Json_obj_1);
                                             }
                                          })
                                    });
                                 }
                              }
                           })
                        })
                     }
                  }
               });
            } else {
               res.status(417).send({status: false, Message: "Institution Management Details Not Valid!."});
            }
         }
      });
   }
};


// Batches Simple List -----------------------------------------------
exports.InstitutionManagement_YearlyBatches_SimpleList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.InstitutionManagement || ReceivingData.InstitutionManagement === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Management Details can not be empty" });
   } else {

      InstitutionManagementModel.YearlyBatchesSchema
      .find({ 'InstitutionManagement': mongoose.Types.ObjectId(ReceivingData.InstitutionManagement)}, {InstitutionManagement: 1, Ending_MonthAndYear: 1, Starting_MonthAndYear: 1}, { sort: { Ending_MonthAndYear: -1 } })
      .exec(function(err_1, result_1) {
         if(err_1) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Yearly Batches Find Query Error', 'Institution-Management.controller.js', err_1);
            res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Yearly Batches!."});
         } else {
            Promise.all(
               result_1.map(obj => YearsArrayFind(obj))
            ).then(response => {
               var ReturnData_1 = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
               ReturnData_1 = ReturnData_1.toString();
               res.status(200).send({Status: true, Response: ReturnData_1,  });
            }).catch( catch_err => {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Yearly Batches Find Query Error', 'Institution-Management.controller.js', catch_err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Yearly Batches!."})
            });

            function YearsArrayFind(obj) {
               return new Promise((resolve, reject ) => {
                  InstitutionManagementModel.BatchYearsSchema
                  .find({ 'YearlyBatch': mongoose.Types.ObjectId(obj._id)}, { From_Year: 1, To_Year: 1, Show_Year: 1}, { sort: { To_Year: 1 } })
                  .exec(function(err_2, result_2) {
                     if (err_2) {
                        reject(err_2)
                     }else {
                        Promise.all(
                           result_2.map(obj_1 => Semesters(obj_1))
                        ).then(response_1 => {
                           var Json_obj = JSON.parse(JSON.stringify(obj));
                              Json_obj =  Object.assign({Years_Array: response_1 }, Json_obj);
                           resolve(Json_obj);
                        }).catch( catch_err1 => {
                           reject(catch_err1);
                        });

                        function Semesters(obj_1) {
                           return new Promise((resolve_1, reject_1) => {
                              InstitutionManagementModel.YearSemestersSchema
                                 .find({ 'BatchYear': mongoose.Types.ObjectId(obj_1._id)}, {Semester_Start: 1, Semester_Name: 1, Semester_End: 1, Sections_Arr: 1}, { sort: { Semester_End: 1 } })
                                 .exec(function(err_3, result_3) {
                                    if (err_3) {
                                       reject_1(err_3)
                                    }else {
                                       var Json_obj_1 = JSON.parse(JSON.stringify(obj_1));
                                       Json_obj_1 =  Object.assign({Semesters: result_3 }, Json_obj_1)
                                       resolve_1(Json_obj_1);
                                    }
                                 })
                           });
                        }
                     }
                  })
               })
            }
         }
      });
   }
};
// Batches List -----------------------------------------------
exports.InstitutionManagement_YearlyBatchView= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.YearlyBatch_Id || ReceivingData.YearlyBatch_Id === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Management Yearly Batch Details can not be empty" });
   } else {

      InstitutionManagementModel.YearlyBatchesSchema
      .findOne({ '_id': mongoose.Types.ObjectId(ReceivingData.YearlyBatch_Id)}, {}, {})
      .populate({ path: 'InstitutionManagement', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
      .populate({ path: 'InstitutionManagement', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears'] } })
      .populate({ path: 'InstitutionManagement', select: 'Department', populate: { path: 'Department', select: 'Department' } })
      .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
      .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
      .exec(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Yearly Batches Find Query Error', 'Institution-Management.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Yearly Batches!."});
         } else {
            if (result !== null) {
               InstitutionManagementModel.BatchYearsSchema
                  .find({ 'YearlyBatch': mongoose.Types.ObjectId(result._id)}, {}, { sort: { To_Year: 1 } })
                  .exec(function(err_1, result_1) {
                     if (err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Batch Years Find Query Error', 'Institution-Management.controller.js', err_1);
                        res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Batch Years!."});
                     }else {
                        Promise.all(
                           result_1.map(obj => Semesters(obj))
                        ).then(response_1 => {
                           var Json_result = JSON.parse(JSON.stringify(result));
                           Json_result =  Object.assign({Years_Array: response_1 }, Json_result);
                           var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(Json_result), 'SecretKeyOut@123');
                           ReturnData = ReturnData.toString();
                           res.status(200).send({Status: true, Response: ReturnData  });
                        }).catch( catch_err => {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Yearly Batch Find Query Error', 'Institution-Management.controller.js', catch_err);
                           res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Yearly Batch!."})
                        });

                        function Semesters(obj) {
                           return new Promise((resolve, reject) => {
                              InstitutionManagementModel.YearSemestersSchema
                                 .find({ 'BatchYear': mongoose.Types.ObjectId(obj._id)}, {}, { sort: { Semester_End: 1 } })
                                 .exec(function(err_2, result_2) {
                                    if (err_2) {
                                       reject(err_2)
                                    }else {
                                       var Json_obj = JSON.parse(JSON.stringify(obj));
                                       Json_obj =  Object.assign({Semesters: result_2 }, Json_obj)
                                       resolve(Json_obj);
                                    }
                                 })
                           });
                        }

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
         NoOfYears: ReceivingData.Years_Array.length,
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
            Promise.all(
               ReceivingData.Years_Array.map(Obj => YearsSave(Obj))
            ).then(response => {
               var Json_result = JSON.parse(JSON.stringify(result));
               Json_result =  Object.assign({Years_Array: response }, Json_result)
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(Json_result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            });
            function YearsSave(Obj) {
               return new Promise((resolve, reject) => {
                  var Create_BatchYears = new InstitutionManagementModel.BatchYearsSchema({
                     InstitutionManagement: mongoose.Types.ObjectId(ReceivingData.InstitutionManagement),
                     YearlyBatch: result._id,
                     From_Year: Obj.From_Year,
                     To_Year:  Obj.To_Year,
                     Show_Year: Obj.Show_Year,
                     NoOfSemesters: Obj.NoOfSemesters,
                     Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                     Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                     Active_Status: true,
                     If_Deleted: false,
                  });
                  Create_BatchYears.save(function(err_1, result_1) {
                     if(err_1) {
                        reject(err_1);
                     } else {
                        Promise.all(
                           Obj.Semesters.map(Obj_1 => SemestersSave(Obj_1))
                        ).then(response => {
                           var Json_result_1 = JSON.parse(JSON.stringify(result));
                              Json_result_1 =  Object.assign({Semesters: response }, Json_result_1)
                           resolve(Json_result_1);
                        }).catch(catch_err => {
                           reject(catch_err);
                        });
                        function SemestersSave(Obj_1) {
                           return new Promise((resolve_1, reject_1) => {
                              var Create_YearSemesters = new InstitutionManagementModel.YearSemestersSchema({
                                 InstitutionManagement: mongoose.Types.ObjectId(ReceivingData.InstitutionManagement),
                                 YearlyBatch: result._id,
                                 BatchYear: result_1._id,
                                 Semester_Start: Obj_1.Semester_Start,
                                 Semester_End: Obj_1.Semester_End,
                                 Semester_Name: Obj_1.Semester_Name,
                                 NoOfSections: Obj_1.NoOfSections,
                                 Sections_Arr: Obj_1.Sections_Arr,
                                 Subjects: Obj_1.Subjects || [],
                                 Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                                 Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                                 Active_Status: true,
                                 If_Deleted: false,
                              });
                              Create_YearSemesters.save(function(err_2, result_2) {
                                 if(err_2) {
                                    reject_1(err_2);
                                 } else {
                                    resolve_1(result_2);
                                 }
                              });
                           })
                        };
                     }
                  });
               });
            };
         }
      });
   }
};



// Semester Managements List -----------------------------------------------
exports.InstitutionManagement_SemesterManagementsList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.YearlyBatch_Id || ReceivingData.YearlyBatch_Id === ''  ) {
      res.status(400).send({Status: false, Message: "Yearly Batch Details can not be empty" });
   } else {
      InstitutionManagementModel.YearlyBatchesSchema
      .findOne({ '_id': mongoose.Types.ObjectId(ReceivingData.YearlyBatch_Id)}, {}, {})
      .populate({ path: 'InstitutionManagement', select: 'Institution', populate: { path: 'Institution', select: 'Institution'} })
      .populate({ path: 'InstitutionManagement', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears'] } })
      .populate({ path: 'InstitutionManagement', select: 'Department', populate: { path: 'Department', select: 'Department'} })
      .exec(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Find Query Error', 'Institution-Management.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management !."});
         } else {
            if (result !== null) {
               InstitutionManagementModel.SemestersManagementSchema
               .find({ 'YearlyBatch': mongoose.Types.ObjectId(ReceivingData.YearlyBatch_Id)}, {}, { sort: { createdAt: -1 } })
               .populate({ path: 'InstitutionManagement', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
               .populate({ path: 'InstitutionManagement', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears'] } })
               .populate({ path: 'InstitutionManagement', select: 'Department', populate: { path: 'Department', select: 'Department' } })
               .populate({ path: 'YearSemester', select: ['Semester_Name', 'Sections_Arr'] })
               .populate({ path: 'BatchYear', select: 'Show_Year' })
               .populate({ path: 'YearlyBatch', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear'] })
               .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
               .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
               .exec(function(err_1, result_1) {
                  if(err) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Batch Semesters Find Query Error', 'Institution-Management.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Batch Semesters!."});
                  } else {
                     Promise.all(
                        result_1.map(obj => SemesterSectionArr(obj))
                     ).then(response => {
                        var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                        ReturnData = ReturnData.toString();
                        var ReturnData_1 = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
                        ReturnData_1 = ReturnData_1.toString();
                        res.status(200).send({Status: true, Basic_Data: ReturnData, Response: ReturnData_1,  });
                     }).catch( catch_err => {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Semester Details Find Query Error', 'Institution-Management.controller.js', catch_err);
                        res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Semester Details!."})
                     });

                     function SemesterSectionArr(obj) {
                        return new Promise((resolve, reject ) => {
                              Promise.all(
                                 obj['YearSemester']['Sections_Arr'].map(obj_1 => SubjectStaffSection(obj_1, obj._id))
                              ).then(response_1 => {
                                 var Json_obj = JSON.parse(JSON.stringify(obj));
                                    Json_obj =  Object.assign({Sections_Arr: response_1}, Json_obj);
                                 resolve(Json_obj);
                              }).catch( catch_err1 => {
                                 reject(catch_err1);
                              });
                              function SubjectStaffSection(obj_1, listId) {
                                 return new Promise((resolve_1, reject_1) => {
                                    InstitutionManagementModel.SemesterSubjectStaffSectionManagementSchema
                                       .find({'SemesterManagement': mongoose.Types.ObjectId(listId), 'Section': obj_1, }, {Subject: 1, Staff: 1, Section: 1}, {})
                                       .populate({ path: 'Subject', select: 'Subject' })
                                       .populate({ path: 'Staff', select: 'Name' })
                                       .exec(function(err_3, result_3) {
                                          if (err_3) {
                                             reject_1(err_3)
                                          }else {
                                             var Json_obj_1 = {};
                                             Json_obj_1 =  Object.assign({Section : obj_1}, Json_obj_1);
                                             Json_obj_1 =  Object.assign({More : result_3}, Json_obj_1);
                                             resolve_1(Json_obj_1);
                                          }
                                       })
                                 });
                              }
                        })
                     }
                  }
               });
            } else {
               res.status(417).send({status: false, Message: "Institution Management Yearly Batch Details Not Valid!."});
            }
         }
      });
   }
};

// Batches Create -----------------------------------------------
exports.InstitutionManagement_SemesterManagementsCreate = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.InstitutionManagement || ReceivingData.InstitutionManagement === '' ) {
      res.status(400).send({Status: false, Message: "Institution Management can not be empty" });
   }else if(!ReceivingData.YearlyBatch || ReceivingData.YearlyBatch === '' ) {
         res.status(400).send({Status: false, Message: "Yearly Batch can not be empty" });
   }else if(!ReceivingData.BatchYear || ReceivingData.BatchYear === '' ) {
      res.status(400).send({Status: false, Message: "Batch Year can not be empty" });
   }else if(!ReceivingData.YearSemester || ReceivingData.YearSemester === '') {
         res.status(400).send({Status: false, Message: "Semester can not be empty" });
   }else if(!ReceivingData.Subjects || typeof ReceivingData.Subjects !== 'object' || ReceivingData.Subjects.length <= 0 ) {
      res.status(400).send({Status: false, Message: "Subject Details can not be empty" });
   }else if(!ReceivingData.Sections_Arr || typeof ReceivingData.Sections_Arr !== 'object' || ReceivingData.Sections_Arr.length <= 0 ) {
      res.status(400).send({Status: false, Message: "Section Details can not be empty" });
   } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
      res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
   }else {
      ReceivingData.Subjects = ReceivingData.Subjects.map( obj => mongoose.Types.ObjectId(obj));
      var Create_SemestersManagement = new InstitutionManagementModel.SemestersManagementSchema({
         InstitutionManagement: mongoose.Types.ObjectId(ReceivingData.InstitutionManagement),
         YearlyBatch:  mongoose.Types.ObjectId(ReceivingData.YearlyBatch),
         BatchYear:  mongoose.Types.ObjectId(ReceivingData.BatchYear),
         YearSemester: mongoose.Types.ObjectId(ReceivingData.YearSemester),
         Subjects: ReceivingData.Subjects,
         Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
         Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
         Active_Status: true,
         If_Deleted: false
      });
      Create_SemestersManagement.save(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Semesters Management Creation Query Error', 'Institution-Management.controller.js');
            res.status(417).send({Status: false, Message: "Some error occurred while creating the Semesters Management!."});
         } else {
            Promise.all(
               ReceivingData.Sections_Arr.map(Obj => Sections_Array(Obj))
            ).then(response => {
               var Json_result = JSON.parse(JSON.stringify(result));
               Json_result =  Object.assign({Sections_Arr: response }, Json_result)
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(Json_result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            });
            function Sections_Array(Obj) {
               return new Promise((resolve, reject) => {
                  Promise.all(
                     Obj.More.map(Obj_1 => SemesterSubjectStaffSection(Obj_1))
                  ).then(response => {
                     var Json_result_1 = JSON.parse(JSON.stringify(Obj));
                        Json_result_1 =  Object.assign({More: response }, Json_result_1)
                     resolve(Json_result_1);
                  }).catch(catch_err => {
                     reject(catch_err);
                  });
                  function SemesterSubjectStaffSection(Obj_1) {
                     return new Promise((resolve_1, reject_1) => {
                        var Create_BatchYears = new InstitutionManagementModel.SemesterSubjectStaffSectionManagementSchema({
                           InstitutionManagement: mongoose.Types.ObjectId(ReceivingData.InstitutionManagement),
                           YearlyBatch:  mongoose.Types.ObjectId(ReceivingData.YearlyBatch),
                           BatchYear:  mongoose.Types.ObjectId(ReceivingData.BatchYear),
                           YearSemester: mongoose.Types.ObjectId(ReceivingData.YearSemester),
                           SemesterManagement: mongoose.Types.ObjectId(result._id),
                           Section: Obj.Section,
                           Subject: mongoose.Types.ObjectId(Obj_1.Subject),
                           Staff: mongoose.Types.ObjectId(Obj_1.Staff),
                           Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                           Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                           Active_Status: true,
                           If_Deleted: false,
                        });
                        Create_BatchYears.save(function(err_1, result_1) {
                           if(err_1) {
                              reject_1(err_1);
                           } else {
                              resolve_1(result_1);
                           }
                        });
      
                     });
                  }
               });
            };
         }
      });
   }
};

// Semester Management Async Validate -----------------------------------------------
exports.InstitutionManagement_SemesterManagementsAsyncValidate= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.Semester || ReceivingData.Semester === ''  ) {
      res.status(400).send({Status: false, Message: "Semester Details can not be empty" });
   } else {
      InstitutionManagementModel.SemestersManagementSchema
         .findOne({ 'YearSemester': mongoose.Types.ObjectId(ReceivingData.Semester)}, {}, {})
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Batch Semesters Find Query Error', 'Institution-Management.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Batch Semesters!."});
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

// Semester Management View -----------------------------------------------
exports.InstitutionManagement_SemesterManagementView= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.SemesterManagement_Id || ReceivingData.SemesterManagement_Id === ''  ) {
      res.status(400).send({Status: false, Message: "Yearly Batch Semester Details can not be empty" });
   } else {
      InstitutionManagementModel.SemestersManagementSchema
         .findOne({ '_id': mongoose.Types.ObjectId(ReceivingData.SemesterManagement_Id)}, {}, {})
         .populate({ path: 'InstitutionManagement', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
         .populate({ path: 'InstitutionManagement', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears'] } })
         .populate({ path: 'InstitutionManagement', select: 'Department', populate: { path: 'Department', select: 'Department' } })
         .populate({ path: 'YearSemester', select: ['Semester_Name', 'Sections_Arr'] })
         .populate({ path: 'BatchYear', select: 'Show_Year' })
         .populate({ path: 'YearlyBatch', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear'] })
         .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
         .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
         .exec(function(err_1, result_1) {
            if(err_1) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Batch Semesters Find Query Error', 'Institution-Management.controller.js', err_1);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Batch Semesters!."});
            } else {
               if (result_1 !== null) {
                  Promise.all(
                     result_1['YearSemester']['Sections_Arr'].map(obj_1 => SubjectStaffSection(obj_1, result_1._id))
                  ).then(response_1 => {
                     var Json_obj = JSON.parse(JSON.stringify(result_1));
                        Json_obj =  Object.assign({Sections_Arr: response_1}, Json_obj);
                        var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(Json_obj), 'SecretKeyOut@123');
                        ReturnData = ReturnData.toString();
                        res.status(200).send({Status: true, Response: ReturnData });
                  }).catch( catch_err => {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Management Semester Details Find Query Error', 'Institution-Management.controller.js', catch_err);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Institution Management Semester Details!."})
                  });
                  function SubjectStaffSection(obj_1, listId) {
                     return new Promise((resolve_1, reject_1) => {
                        InstitutionManagementModel.SemesterSubjectStaffSectionManagementSchema
                           .find({'SemesterManagement': mongoose.Types.ObjectId(listId), 'Section': obj_1, }, {Subject: 1, Staff: 1, Section: 1}, {})
                           .populate({ path: 'Subject', select: 'Subject' })
                           .populate({ path: 'Staff', select: 'Name' })
                           .exec(function(err_3, result_3) {
                              if (err_3) {
                                 reject_1(err_3)
                              }else {
                                 var Json_obj_1 = {};
                                 Json_obj_1 =  Object.assign({Section : obj_1}, Json_obj_1);
                                 Json_obj_1 =  Object.assign({More : result_3}, Json_obj_1);
                                 resolve_1(Json_obj_1);
                              }
                           })
                     });
                  }
               } else {
                  res.status(417).send({status: false, Message: "Institution Management Yearly Batch Details Not Valid!."});
               }
            }
      });
   }
};