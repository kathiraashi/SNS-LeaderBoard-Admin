var CryptoJS = require("crypto-js");
var TutorManagementModel = require('./../../models/Tutor-Management.model');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');



// TutorManagement List -----------------------------------------------
exports.TutorManagement_List= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else {
      TutorManagementModel.TutorManagementSchema.aggregate([
         { $match: {'If_Deleted' : false } },
         { $lookup: { from: "Staffs_List", localField: "Staff", foreignField: "_id", as: "Staff" } },
         { $lookup: { from: "InstitutionManagements_List", localField: "Institution_Management", foreignField: "_id", as: "Institution_Management" }},
         { $lookup: { from: "Department_List", localField: "Institution_Management.Department", foreignField: "_id", as: "Department" } },
         { $lookup: { from: "Institution_List", localField: "Institution_Management.Institution", foreignField: "_id", as: "Institution" } },
         { $lookup: { from: "YearlyBatches_List", localField: "Yearly_Badge", foreignField: "_id", as: "Yearly_Badge" }},
         { $lookup: { from: "BatchYears_List", localField: "Year", foreignField: "_id", as: "Batch_Year" }},
         { $lookup: { from: "YearSemesters_List", localField: "Semester", foreignField: "_id", as: "Year_Semester" }},
         { $lookup: { from: "Students_List", localField: "Student", foreignField: "_id", as: "Student" }},
         { $lookup: { from: "User_Management", localField: "Last_Modified_By", foreignField: "_id", as: "Last_Modified" }},
         { $project: { 
            Staff: { $arrayElemAt: [ "$Staff", 0 ] },
            Institution: { $arrayElemAt: [ "$Institution", 0 ] },
            Department: { $arrayElemAt: [ "$Department", 0 ] },
            Yearly_Badge: { $arrayElemAt: [ "$Yearly_Badge", 0 ] },
            Batch_Year: { $arrayElemAt: [ "$Batch_Year", 0 ] },
            Year_Semester: { $arrayElemAt: [ "$Year_Semester", 0 ] },
            Student: { $arrayElemAt: [ "$Student", 0 ] },
            Last_Modified: { $arrayElemAt: [ "$Last_Modified", 0 ] },
            Institution_Management: { $arrayElemAt: [ "$Institution_Management", 0 ] },
            Section: 1,
            updatedAt: 1
         }},
         { $project: {
            "Staff._id": 1,
            "Staff.Name": 1,
            "Staff.StaffRole": 1,
            "Institution._id": 1,
            "Institution.Institution": 1,
            "Department._id": 1,
            "Department.Department": 1,
            "Yearly_Badge._id": 1,
            "Yearly_Badge.Starting_MonthAndYear": 1,
            "Yearly_Badge.Ending_MonthAndYear": 1,
            "Batch_Year._id": 1,
            "Batch_Year.Show_Year": 1,
            "Year_Semester._id": 1,
            "Year_Semester.Semester_Name": 1,
            "Student._id": 1,
            "Student.Name": 1,
            "Student.Roll_No": 1,
            "Last_Modified._id": 1,
            "Last_Modified.Name": 1,
            "Institution_Management._id": 1,
            Section: 1,
            updatedAt: 1
         }},
         { $group : {   _id: { Staff: "$Staff", Institution: "$Institution", Department: "$Department" },
                        Students: { $push: { Yearly_Badge: "$Yearly_Badge", Batch_Year: "$Batch_Year", Year_Semester: "$Year_Semester", Section: "$Section", Student: "$Student", Last_Modified: "$Last_Modified", updatedAt: "$updatedAt" } }
         }},
      ])
      .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Tutor Management Find Query Error', 'Tutor-Management.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Tutor Management !."});
            } else {
               result = JSON.parse(JSON.stringify(result));
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};



// TutorManagement Create -----------------------------------------------
exports.TutorManagement_Create = function(req, res) {
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
   }else if(!ReceivingData.Staff || ReceivingData.Staff === '') {
      res.status(400).send({Status: false, Message: "Staff can not be empty" });
   }else if(!ReceivingData.Students || typeof ReceivingData.Students !== 'object' || ReceivingData.Students.length <= 0 ) {
      res.status(400).send({Status: false, Message: "Students can not be empty" });
   } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
      res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
   }else {
      var Students = [];
      ReceivingData.Students.map(obj => {
         const Student = new TutorManagementModel.TutorManagementSchema({
                                       Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
                                       Institution_Management: mongoose.Types.ObjectId(ReceivingData.Institution_Management),
                                       Yearly_Badge: mongoose.Types.ObjectId(ReceivingData.Yearly_Badge),
                                       Year: mongoose.Types.ObjectId(ReceivingData.Year),
                                       Semester: mongoose.Types.ObjectId(ReceivingData.Semester),
                                       Section: ReceivingData.Section,
                                       Staff: mongoose.Types.ObjectId(ReceivingData.Staff),
                                       Student: mongoose.Types.ObjectId(obj.Student),
                                       Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                                       Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
                                       Active_Status: true,
                                       If_Deleted: false,
                                       createdAt: new Date(),
                                       updatedAt: new Date()
                                    });
         Students.push(Student)
      });
      TutorManagementModel.TutorManagementSchema.collection.insertMany(Students, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Tutor Management Create Query Error', 'TutorManagement.controller.js');
            res.status(417).send({Status: false, Message: "Some error occurred while Creating the Tutor Management!."});
         } else {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result.ops), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }
      });
   }
};



// TutorManagement View -----------------------------------------------
exports.TutorManagement_View= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.TutorManagement || ReceivingData.TutorManagement === ''  ) {
      res.status(400).send({Status: false, Message: "Tutor Management Details can not be empty" });
   } else {
      TutorManagementModel.TutorManagementSchema
         .findOne({'If_Deleted' : false, '_id': mongoose.Types.ObjectId(ReceivingData.TutorManagement)}, {}, {sort: { updatedAt: -1 }})
         .populate({ path: 'Institution_Management', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
         .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears'] } })
         .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
         .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
         .populate({ path: 'Year', select: ['From_Year', 'To_Year', 'Show_Year']})
         .populate({ path: 'Semester', select: ['Semester_Start', 'Semester_End', 'Semester_Name']})
         .populate({ path: 'Student', select: ['Name', 'Roll_No']})
         .populate({ path: 'Staff', select: ['Name', 'StaffRole']})
         .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
         .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Tutor Management Find Query Error', 'Tutor-Management.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Tutor Management !."});
            } else {
               result = JSON.parse(JSON.stringify(result));
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};