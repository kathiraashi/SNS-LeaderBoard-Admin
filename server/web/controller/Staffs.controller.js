var CryptoJS = require("crypto-js");
var StaffsModel = require('./../models/Staffs.model');
var ErrorManagement = require('./../../handling/ErrorHandling.js');
var mongoose = require('mongoose');



// Staffs List -----------------------------------------------
exports.Staff_List= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else {
      StaffsModel.StaffsSchema
         .find({'If_Deleted' : false}, {}, {sort: { updatedAt: -1 }})
         .populate({ path: 'Institution', select: 'Institution' })
         .populate({ path: 'Department', select: 'Department' })
         .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
         .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
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


// Institution Based Staffs List -----------------------------------------------
exports.InstitutionBased_StaffsList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if(!ReceivingData.Institution || ReceivingData.Institution === ''){
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else {
      StaffsModel.StaffsSchema
         .find({'If_Deleted' : false, Institution: mongoose.Types.ObjectId(ReceivingData.Institution)}, {}, {sort: { updatedAt: -1 }})
         .populate({ path: 'Department', select: 'Department' })
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

// Staffs Import -----------------------------------------------
exports.Staff_Create = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
      res.status(400).send({Status: false, Message: "Institution can not be empty" });
   }else if(!ReceivingData.Name || ReceivingData.Name === '' ) {
         res.status(400).send({Status: false, Message: "Name can not be empty" });
   }else if(!ReceivingData.Qualification || ReceivingData.Qualification === '') {
         res.status(400).send({Status: false, Message: "Qualification can not be empty" });
   }else if(!ReceivingData.DateOfJoining || ReceivingData.DateOfJoining === '') {
      res.status(400).send({Status: false, Message: "Date Of Joining can not be empty" });
   }else if(!ReceivingData.Gender || ReceivingData.Gender === '') {
      res.status(400).send({Status: false, Message: "Gender can not be empty" });
   }else if(!ReceivingData.BloodGroup || ReceivingData.BloodGroup === '') {
      res.status(400).send({Status: false, Message: "Blood Group can not be empty" });
   }else if(!ReceivingData.DateOfBirth || typeof ReceivingData.DateOfBirth === '') {
      res.status(400).send({Status: false, Message: "Date Of Birth can not be empty" });
   }else if(!ReceivingData.Mobile || typeof ReceivingData.Mobile === '') {
      res.status(400).send({Status: false, Message: "Mobile can not be empty" });
   }else if(!ReceivingData.Email || typeof ReceivingData.Email === '') {
      res.status(400).send({Status: false, Message: "Email can not be empty" });
   }else if(!ReceivingData.Address || typeof ReceivingData.Address === '') {
      res.status(400).send({Status: false, Message: "Address can not be empty" });
   } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
      res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
   }else {
      if (ReceivingData.Department !== '') {
         ReceivingData.Department = mongoose.Types.ObjectId(ReceivingData.Department)
      };
      const Create_Staff = new StaffsModel.StaffsSchema({
         Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
         Department: mongoose.Types.ObjectId(ReceivingData.Department),
         StaffRole: ReceivingData.StaffRole,
         Name: ReceivingData.Name,
         Qualification: ReceivingData.Qualification,
         DateOfJoining: ReceivingData.DateOfJoining,
         Gender: ReceivingData.Gender,
         BloodGroup: ReceivingData.BloodGroup,
         DateOfBirth: ReceivingData.DateOfBirth,
         Mobile: ReceivingData.Mobile,
         Email: ReceivingData.Email,
         Address: ReceivingData.Address,
         Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
         Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
         Active_Status: true,
         If_Deleted: false
      });
      Create_Staff.save(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Staff Create Query Error', 'Staffs.controller.js');
            res.status(417).send({Status: false, Message: "Some error occurred while Creating the Staff!."});
         } else {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }
      });
   }
};


// Staff View -----------------------------------------------
exports.Staff_View= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if (!ReceivingData.Staff_Id || ReceivingData.Staff_Id === ''  ) {
         res.status(400).send({Status: false, Message: "Staff Details can not be empty" });
   } else {
      StaffsModel.StaffsSchema
         .findOne({'_id': mongoose.Types.ObjectId(ReceivingData.Staff_Id) }, {}, {})
         .populate({ path: 'Institution', select: 'Institution' })
         .populate({ path: 'Department', select: 'Department' })
         .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
         .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Staff Find Query Error', 'Staffs.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Staff !."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
      });
   }
};


// Department Based Staff's Simple List -----------------------------------------------
exports.DepartmentBased_StaffsSimpleList= function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else  if (!ReceivingData.Institution || ReceivingData.Institution === ''  ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else  if (!ReceivingData.Department || ReceivingData.Department === ''  ) {
      res.status(400).send({Status: false, Message: "Department Details can not be empty" });
   } else {
      StaffsModel.StaffsSchema
         .find({  'If_Deleted' : false,
                  'Institution': mongoose.Types.ObjectId(ReceivingData.Institution),
                  'Department': mongoose.Types.ObjectId(ReceivingData.Department)  
               },
               {Name: 1, StaffRole: 1},
               {sort: { updatedAt: -1 }})
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