var CryptoJS = require("crypto-js");
var StudentsModel = require('./../models/Students.model');
var ErrorManagement = require('./../../handling/ErrorHandling.js');
var mongoose = require('mongoose');



// Students List -----------------------------------------------
exports.Students_List= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else {
      StudentsModel.StudentsSchema
         .find({'If_Deleted' : false}, {}, {sort: { updatedAt: -1 }})
         .populate({ path: 'Institution_Management', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
         .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears'] } })
         .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
         .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear']})
         .populate({ path: 'Year', select: ['From_Year', 'To_Year', 'Show_Year']})
         .populate({ path: 'Semester', select: ['Semester_Start', 'Semester_End', 'Semester_Name']})
         .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
         .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
         .exec(function(err, result) {
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
      var Students_Arr = [];
      ReceivingData.Students_Array.map(obj => {
         const Student= new StudentsModel.StudentsSchema({
                                       Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
                                       Institution_Management: mongoose.Types.ObjectId(ReceivingData.Institution_Management),
                                       Yearly_Badge: mongoose.Types.ObjectId(ReceivingData.Yearly_Badge),
                                       Year: mongoose.Types.ObjectId(ReceivingData.Year),
                                       Semester: mongoose.Types.ObjectId(ReceivingData.Semester),
                                       Section: ReceivingData.Section,
                                       Roll_No: obj.Roll_No,
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


// Student View -----------------------------------------------
exports.Student_View= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Student_Id || ReceivingData.Student_Id === ''  ) {
         res.status(400).send({Status: false, Message: "Student Details can not be empty" });
   } else {
      StudentsModel.StudentsSchema
         .findOne({'_id': mongoose.Types.ObjectId(ReceivingData.Student_Id) }, {}, {})
         .populate({ path: 'Institution_Management', select: 'Institution', populate: { path: 'Institution', select: 'Institution' } })
         .populate({ path: 'Institution_Management', select: 'Course', populate: { path: 'Course', select: ['Course', 'NoOfYears'] } })
         .populate({ path: 'Institution_Management', select: 'Department', populate: { path: 'Department', select: 'Department' } })
         .populate({ path: 'Yearly_Badge', select: ['Starting_MonthAndYear', 'Ending_MonthAndYear', 'Years_Array']})
         .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
         .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Students Find Query Error', 'Students.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Students !."});
            } else {
               result = JSON.parse(JSON.stringify(result));
               var NewYear = {};
               var NewSemester = {};
               result['Yearly_Badge']['Years_Array'].map(obj_1 => {
                  if (obj_1['_id'] === obj['Year']) {
                     NewYear = obj_1;
                     obj_1['Semesters'].map(obj_2 => {
                        if (obj_2['_id'] === obj['Semester']) {
                           NewSemester = obj_2;
                        }
                     })                        
                  }
               });
               delete result['Yearly_Badge']['Years_Array'];
               delete NewSemester['Sections_Arr'];
               delete NewYear['Semesters'];

               result.Year = NewYear;
               result.Semester = NewSemester;

               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};
