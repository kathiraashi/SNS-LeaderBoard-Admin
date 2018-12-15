var CryptoJS = require("crypto-js");
var StudentsModel = require('./../models/Students.model');
var CurrentSemestersModel = require('./../models/Current-Semesters.model');
var ErrorManagement = require('./../../handling/ErrorHandling.js');
var mongoose = require('mongoose');



// Course Async Validate -----------------------------------------------
exports.StudentRegNo_AsyncValidate = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Reg_No || ReceivingData.Reg_No === '' ) {
      res.status(400).send({Status: false, Message: "Reg No can not be empty" });
   } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   }else {
      StudentsModel.StudentsSchema.findOne({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution),  'Reg_No': { $regex : new RegExp("^" + ReceivingData.Reg_No + "$", "i") }, 'If_Deleted': false }, {}, {}, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find Students!."});
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


// Students Import -----------------------------------------------
exports.Students_Import = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
      res.status(400).send({Status: false, Message: "Institution can not be empty" });
   }else if(!ReceivingData.Institution_Management || ReceivingData.Institution_Management === '' ) {
         res.status(400).send({Status: false, Message: "Institution Management can not be empty" });
   }else if(!ReceivingData.Yearly_Badge || ReceivingData.Yearly_Badge === '') {
         res.status(400).send({Status: false, Message: "Yearly Badge can not be empty" });
   }else if(!ReceivingData.Students_Array || typeof ReceivingData.Students_Array !== 'object' || ReceivingData.Students_Array.length <= 0 ) {
      res.status(400).send({Status: false, Message: "Students can not be empty" });
   } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
      res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
   }else {
      var Students_Arr = [];
      ReceivingData.Students_Array.map(obj => {
         const Student= new StudentsModel.StudentsSchema({
                                       Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
                                       Institution_Management: mongoose.Types.ObjectId(ReceivingData.Institution_Management),
                                       Yearly_Badge: mongoose.Types.ObjectId(ReceivingData.Yearly_Badge),
                                       Reg_No: obj.Reg_No,
                                       Name: obj.Name,
                                       Gender: obj.Gender,
                                       Blood_Group: obj.Blood_Group,
                                       Contact_Number: obj.Contact_Number,
                                       Email: obj.Email,
                                       Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                                       Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                                       Active_Status: true,
                                       If_Deleted: false,
                                       createdAt: new Date(),
                                       updatedAt: new Date()
                                    });
         Students_Arr.push(Student)
      });
      StudentsModel.StudentsSchema.collection.insertMany(Students_Arr, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Import Query Error', 'Students.controller.js');
            res.status(417).send({Status: false, Message: "Some error occurred while importing the Students!."});
         } else {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result.ops), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }
      });
   }
};


// Semester Unlinked Students List -----------------------------------------------
exports.SemesterUnlinked_StudentsList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if(!ReceivingData.Institution_Management || ReceivingData.Institution_Management === '' ) {
      res.status(400).send({Status: false, Message: "Institution Management can not be empty" });
   }else if(!ReceivingData.Yearly_Badge || ReceivingData.Yearly_Badge === '') {
         res.status(400).send({Status: false, Message: "Yearly Badge can not be empty" });
   }else if(!ReceivingData.Semester || ReceivingData.Semester === '') {
      res.status(400).send({Status: false, Message: "Semester can not be empty" });
   } else {
      ReceivingData.Institution_Management = mongoose.Types.ObjectId(ReceivingData.Institution_Management);
      ReceivingData.Yearly_Badge = mongoose.Types.ObjectId(ReceivingData.Yearly_Badge);
      ReceivingData.Semester = mongoose.Types.ObjectId(ReceivingData.Semester)

      StudentsModel.StudentsSchema.aggregate([
         { $match: {'If_Deleted' : false, 'Institution_Management': ReceivingData.Institution_Management, 'Yearly_Badge': ReceivingData.Yearly_Badge } },
         { $lookup: { from: "StudentsLinkedSections_List", localField: "_id", foreignField: "Student", as: "Semesters" } },
         { $match : { "Semesters.0" : { $exists: false } } },
      ]).exec(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
         } else {
            result = JSON.parse(JSON.stringify(result));
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }
      });
   }
};


// Students Link Section  -----------------------------------------------
exports.Students_LinkSection = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
      res.status(400).send({Status: false, Message: "Institution can not be empty" });
   }else if(!ReceivingData.Institution_Management || ReceivingData.Institution_Management === '' ) {
      res.status(400).send({Status: false, Message: "Institution Management can not be empty" });
   }else if(!ReceivingData.Yearly_Badge || ReceivingData.Yearly_Badge === '') {
      res.status(400).send({Status: false, Message: "Yearly Badge can not be empty" });
   }else if(!ReceivingData.Year || ReceivingData.Year === '') {
      res.status(400).send({Status: false, Message: "Year can not be empty" });
   }else if(!ReceivingData.Semester || ReceivingData.Semester === '') {
      res.status(400).send({Status: false, Message: "Semester can not be empty" });
   }else if(!ReceivingData.Section || ReceivingData.Section === '') {
      res.status(400).send({Status: false, Message: "Section can not be empty" });
   }else if(!ReceivingData.Students_Array || typeof ReceivingData.Students_Array !== 'object' || ReceivingData.Students_Array.length <= 0 ) {
      res.status(400).send({Status: false, Message: "Students can not be empty" });
   } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
      res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
   }else {
      var StudentsLinkedSections_Arr = [];
      ReceivingData.Students_Array.map(obj => {
         const StudentsLinkedSection = new StudentsModel.StudentsLinkedSectionsSchema({
                                       Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
                                       Institution_Management: mongoose.Types.ObjectId(ReceivingData.Institution_Management),
                                       Yearly_Badge: mongoose.Types.ObjectId(ReceivingData.Yearly_Badge),
                                       Year: mongoose.Types.ObjectId(ReceivingData.Year),
                                       Semester: mongoose.Types.ObjectId(ReceivingData.Semester),
                                       Section: ReceivingData.Section,
                                       Student: mongoose.Types.ObjectId(obj),
                                       Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                                       Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                                       Active_Status: true,
                                       If_Deleted: false,
                                       createdAt: new Date(),
                                       updatedAt: new Date()
                                    });
         StudentsLinkedSections_Arr.push(StudentsLinkedSection)
      });
      StudentsModel.StudentsLinkedSectionsSchema.collection.insertMany(StudentsLinkedSections_Arr, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Student Link Sections Query Error', 'Students.controller.js');
            res.status(417).send({Status: false, Message: "Some error occurred while Student Link Sections!."});
         } else {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result.ops), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }
      });
   }
};


// Institution Based Students List -----------------------------------------------
exports.InstitutionBased_StudentsList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
         res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else {
      CurrentSemestersModel.CurrentSemestersSchema
         .find({'If_Deleted' : false, Institution: mongoose.Types.ObjectId(ReceivingData.Institution)}, {Yearly_Badge: 1, Semester: 1}, {sort: { updatedAt: -1 }})
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
            } else {
               result = JSON.parse(JSON.stringify(result));
               var Yearly_Badges_Array = [];
               var Semesters_Array = [];
               result.map(obj => Yearly_Badges_Array.push(mongoose.Types.ObjectId(obj.Yearly_Badge)) );
               result.map(obj => Semesters_Array.push(mongoose.Types.ObjectId(obj.Semester)) );
               StudentsModel.StudentsSchema
                  .find({'If_Deleted' : false, Yearly_Badge: {$in : Yearly_Badges_Array} }, {}, {sort: { updatedAt: -1 }})
                  .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears', 'Course_ShortCode'] } })
                  .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
                  .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
                  .exec(function(err_1, result_1) {
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', err_1);
                        res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
                     } else {
                        result_1 = JSON.parse(JSON.stringify(result_1));
                        Promise.all(
                           result_1.map(obj => GetLinkedSections(obj))
                        ).then( response => {
                           var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
                           ReturnData = ReturnData.toString();
                           res.status(200).send({Status: true, Response: ReturnData });
                        }).catch( catch_err => {
                           console.log(catch_err);
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', catch_err);
                           res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
                        });
         
                        function GetLinkedSections(Obj) {
                           return new Promise( (resole, reject) => {
                              StudentsModel.StudentsLinkedSectionsSchema
                                 .find({'If_Deleted' : false, 'Student': mongoose.Types.ObjectId(Obj._id), 'Semester': {$in : Semesters_Array}}, {}, {sort: { updatedAt: 1 }})
                                 .populate({ path: 'Year', select: ['From_Year', 'To_Year', 'Show_Year']})
                                 .populate({ path: 'Semester', select: ['Semester_Start', 'Semester_End', 'Semester_Name']})
                                 .exec(function(err_2, result_2) {
                                    if(err_2) {
                                       reject(err_2);
                                    } else {
                                       var ReturnData = null;
                                       if (result_2.length > 0) {
                                          ReturnData = result_2[0];
                                       }
                                       var Json_Obj = JSON.parse(JSON.stringify(Obj));
                                       Json_Obj = Object.assign({Linked_Sections: ReturnData}, Json_Obj);
                                       resole(Json_Obj);
                                    }
                                 });
                           })
                           
                        }
                     }
               });
            }
         });
   }
};


// Institution Management Based Students List -----------------------------------------------
exports.InstitutionManagementBased_StudentsList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.InstitutionManagement || ReceivingData.InstitutionManagement === ''  ) {
         res.status(400).send({Status: false, Message: "Course and Department Details can not be empty" });
   } else {
      CurrentSemestersModel.CurrentSemestersSchema
         .find({'If_Deleted' : false, Institution_Management: mongoose.Types.ObjectId(ReceivingData.InstitutionManagement)}, {Yearly_Badge: 1, Semester: 1}, {sort: { updatedAt: -1 }})
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
            } else {
               result = JSON.parse(JSON.stringify(result));
               var Yearly_Badges_Array = [];
               var Semesters_Array = [];
               result.map(obj => Yearly_Badges_Array.push(mongoose.Types.ObjectId(obj.Yearly_Badge)) );
               result.map(obj => Semesters_Array.push(mongoose.Types.ObjectId(obj.Semester)) );
               StudentsModel.StudentsSchema
                  .find({'If_Deleted' : false, Yearly_Badge: {$in : Yearly_Badges_Array} }, {}, {sort: { updatedAt: -1 }})
                  .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears', 'Course_ShortCode'] } })
                  .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
                  .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
                  .exec(function(err_1, result_1) {
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', err_1);
                        res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
                     } else {
                        result_1 = JSON.parse(JSON.stringify(result_1));
                        Promise.all(
                           result_1.map(obj => GetLinkedSections(obj))
                        ).then( response => {
                           var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
                           ReturnData = ReturnData.toString();
                           res.status(200).send({Status: true, Response: ReturnData });
                        }).catch( catch_err => {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', catch_err);
                           res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
                        });
         
                        function GetLinkedSections(Obj) {
                           return new Promise( (resole, reject) => {
                              StudentsModel.StudentsLinkedSectionsSchema
                                 .find({'If_Deleted' : false, 'Student': mongoose.Types.ObjectId(Obj._id), 'Semester': {$in : Semesters_Array}}, {}, {sort: { updatedAt: 1 }})
                                 .populate({ path: 'Year', select: ['From_Year', 'To_Year', 'Show_Year']})
                                 .populate({ path: 'Semester', select: ['Semester_Start', 'Semester_End', 'Semester_Name']})
                                 .exec(function(err_2, result_2) {
                                    if(err_2) {
                                       reject(err_2);
                                    } else {
                                       var ReturnData = null;
                                       if (result_2.length > 0) {
                                          ReturnData = result_2[0];
                                       }
                                       var Json_Obj = JSON.parse(JSON.stringify(Obj));
                                       Json_Obj = Object.assign({Linked_Sections: ReturnData}, Json_Obj);
                                       resole(Json_Obj);
                                    }
                                 });
                           })
                           
                        }
                     }
               });
            }
         });
   }
};



// Semester Based Students List -----------------------------------------------
exports.SemesterBased_StudentsList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Yearly_Badge || ReceivingData.Yearly_Badge === ''  ) {
      res.status(400).send({Status: false, Message: "Yearly Badge Details can not be empty" });
   }else if (!ReceivingData.Semester || ReceivingData.Semester === ''  ) {
      res.status(400).send({Status: false, Message: "Semester Details can not be empty" });
   } else {
      StudentsModel.StudentsSchema
         .find({'If_Deleted' : false, Yearly_Badge: mongoose.Types.ObjectId(ReceivingData.Yearly_Badge) }, {}, {sort: { updatedAt: -1 }})
         .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears', 'Course_ShortCode'] } })
         .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
         .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
            } else {
               result = JSON.parse(JSON.stringify(result));
               Promise.all(
                  result.map(obj => GetLinkedSections(obj))
               ).then( response => {
                  var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
                  res.status(200).send({Status: true, Response: ReturnData });
               }).catch( catch_err => {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', catch_err);
                  res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
               });

               function GetLinkedSections(Obj) {
                  return new Promise( (resole, reject) => {
                     StudentsModel.StudentsLinkedSectionsSchema
                        .find({'If_Deleted' : false, 'Student': mongoose.Types.ObjectId(Obj._id), 'Semester': mongoose.Types.ObjectId(ReceivingData.Semester) }, {}, {sort: { updatedAt: 1 }})
                        .populate({ path: 'Year', select: ['From_Year', 'To_Year', 'Show_Year']})
                        .populate({ path: 'Semester', select: ['Semester_Start', 'Semester_End', 'Semester_Name']})
                        .exec(function(err_1, result_1) {
                           if(err_1) {
                              reject(err_1);
                           } else {
                              var ReturnData = null;
                              if (result_1.length > 0) {
                                 ReturnData = result_1[0];
                              }
                              var Json_Obj = JSON.parse(JSON.stringify(Obj));
                              Json_Obj = Object.assign({Linked_Sections: ReturnData}, Json_Obj);
                              resole(Json_Obj);
                           }
                        });
                  })
                  
               }
            }
      });
   }
};


// Section Based Students List -----------------------------------------------
exports.SectionBased_StudentsList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Yearly_Badge || ReceivingData.Yearly_Badge === ''  ) {
      res.status(400).send({Status: false, Message: "Yearly Badge Details can not be empty" });
   }else if (!ReceivingData.Semester || ReceivingData.Semester === ''  ) {
      res.status(400).send({Status: false, Message: "Semester Details can not be empty" });
   }else if (!ReceivingData.Section || ReceivingData.Section === ''  ) {
      res.status(400).send({Status: false, Message: "Section Details can not be empty" });
   } else {
      var Yearly_Badge = mongoose.Types.ObjectId(ReceivingData.Yearly_Badge);
      var Semester = mongoose.Types.ObjectId(ReceivingData.Semester);
      StudentsModel.StudentsLinkedSectionsSchema
      .find({'If_Deleted' : false, Yearly_Badge: Yearly_Badge, Semester: Semester, Section: ReceivingData.Section }, {}, {sort: { updatedAt: -1 }})
      .populate({ path: 'Year', select: ['From_Year', 'To_Year', 'Show_Year']})
      .populate({ path: 'Semester', select: ['Semester_Start', 'Semester_End', 'Semester_Name']})
      .exec(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
         } else {
            result = JSON.parse(JSON.stringify(result));
            Promise.all(
               result.map(obj => GetStudents_Info(obj))
            ).then( response => {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(response), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }).catch( catch_err => {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', catch_err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
            });

            function GetStudents_Info(Obj) {
               return new Promise( (resole, reject) => {
                  StudentsModel.StudentsSchema
                  .findOne({ _id: mongoose.Types.ObjectId(Obj.Student) }, {}, {})
                  .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears', 'Course_ShortCode'] } })
                  .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
                  .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
                     .exec(function(err_1, result_1) {
                        if(err_1) {
                           reject(err_1);
                        } else {
                           var Json_result = JSON.parse(JSON.stringify(result_1));
                           Json_Obj = Object.assign({Linked_Sections: Obj}, Json_result);
                           resole(Json_Obj);
                        }
                     });
               })
               
            }
         }
      });
   }
};