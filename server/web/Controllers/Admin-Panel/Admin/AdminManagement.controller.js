var CryptoJS = require("crypto-js");
var AdminModel = require('./../../../models/Admin/AdminManagement.model.js');
var StaffsModel = require('./../../../models/Staffs.model.js');
var ErrorManagement = require('./../../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');
var crypto = require("crypto");


// -------------------------------------------------- User Name Validate -----------------------------------------------
   exports.User_Name_Validate = function(req, res) {

      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Name || ReceivingData.User_Name === '' ) {
         res.status(400).send({Status: false, Message: "User Name can not be empty" });
      }else {
         AdminModel.User_Management.findOne({'User_Name': { $regex : new RegExp("^" + ReceivingData.User_Name + "$", "i") }, 'Active_Status': true }, {}, {}, function(err, result) { // User Name Find Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Name Find Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Users Name!."});
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


// -------------------------------------------------- User Validate ---------------------------------------------------
   exports.User_Login_Validate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Name || ReceivingData.User_Name === '' ) {
         res.status(400).send({Status: false, Message: "User_Name can not be empty" });
      } else if (!ReceivingData.User_Password || ReceivingData.User_Password === ''  ) {
         res.status(400).send({Status: false, Message: "User Password can not be empty" });
      } else {
         AdminModel.User_Management.findOne({'User_Name': { $regex : new RegExp("^" + ReceivingData.User_Name + "$", "i") }, 'User_Password': ReceivingData.User_Password, 'Active_Status': true}, { User_Password: 0 }, {})
         .populate({ path: 'Staff', select: ['Name', 'Email', 'Phone', 'Institution', 'Department'], populate: { path: 'Institution', select: 'Institution' } })
         .populate({ path: 'Staff', select: ['Name', 'Email', 'Phone', 'Institution', 'Department'], populate: { path: 'Department', select: 'Department' } })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Details Validate Query Error', 'RegisterAndLogin.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Validate The User Details!."});
            } else {
               if(result === null){
                  AdminModel.User_Management.findOne({'User_Name': ReceivingData.User_Name }, function(err_1, result_1) {
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Name Validate Query Error', 'RegisterAndLogin.controller.js', err_1);
                        res.status(417).send({Status: false, Error:err_1, Message: "Some error occurred while Validate the User Name!"});           
                     } else {
                        if (result_1 === null) {
                           res.status(200).send({ Status: false, Message: "Invalid account details!" });
                        }else{
                           res.status(200).send({ Status: false, Message: "User Name and password do not match!" });
                        }
                     }
                  });
               }else{
                  const Key = crypto.randomBytes(16).toString("hex");
                  var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), Key);
                  ReturnData = ReturnData.toString();
                  const NewReturnData = (ReturnData + Key).concat('==');
                  AdminModel.User_Management.update(
                     { _id : result._id },
                     { $set: { LoginToken : Key, LoginTime: new Date().toString(), LastActiveTime: new Date() }}
                  ).exec((err_3, result_3) => {
                     if(err_3) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Validate Update Query Error', 'RegisterAndLogin.controller.js', err_3);
                        res.status(417).send({Status: false, Message: "Some error occurred while Validate Update the User Details!"});           
                     } else {
                        res.status(200).send({ Status: true,  Response: NewReturnData });
                     }
                  });
               }
            }
         });
      }
   };


// -------------------------------------------------- User Create -----------------------------------------------
   exports.User_Create = function(req, res) {

      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      } else if(!ReceivingData.User_Name || ReceivingData.User_Name === '' ) {
         res.status(400).send({Status: false, Message: "User Name can not be empty" });
      } else if(!ReceivingData.User_Password || ReceivingData.User_Password === '' ) {
         res.status(400).send({Status: false, Message: "User Password can not be empty" });
      } else if(!ReceivingData.User_Type || ReceivingData.User_Type === '' ) {
         res.status(400).send({Status: false, Message: "User Type can not be empty " });
      } else {
         var Staff_Linked = false;
         if (ReceivingData.Staff && ReceivingData.Staff !== '' && ReceivingData.Staff !== null) {
            ReceivingData.Staff = mongoose.Types.ObjectId(ReceivingData.Staff);
            Staff_Linked = true;
         } else {
            ReceivingData.Staff = null;
         }
         var CreateUser_Management = new AdminModel.User_Management({
            User_Name : ReceivingData.User_Name,
            User_Password : ReceivingData.User_Password,
            Name : ReceivingData.Name || '',
            Phone : ReceivingData.Phone || '',
            Email : ReceivingData.Email || '',
            User_Type: ReceivingData.User_Type,
            Staff_Linked: Staff_Linked,
            Staff: ReceivingData.Staff,
            Created_By : mongoose.Types.ObjectId(ReceivingData.User_Id),
            Last_ModifiedBy : mongoose.Types.ObjectId(ReceivingData.User_Id),
            Active_Status : ReceivingData.Active_Status || true,
         });
         CreateUser_Management.save(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Creation Query Error', 'AdminManagement.controller.js', err);
               res.status(400).send({Status: false, Message: "Some error occurred while creating the User!."});
            } else {
               if(result.Staff_Linked) {
                  StaffsModel.StaffsSchema.update({'_id': result.Staff }, { $set: { UserManagement_Linked: true, UserManagement: result._id } }).exec();
               }
               AdminModel.User_Management.findOne({'_id': result._id }, {User_Password: 0}, {})
                  .populate({ path: 'Staff', select: ['Name', 'Email', 'Phone', 'Institution', 'Department'], populate: { path: 'Institution', select: 'Institution' } })
                  .populate({ path: 'Staff', select: ['Name', 'Email', 'Phone', 'Institution', 'Department'], populate: { path: 'Department', select: 'Department' } })
                  .exec (function(err_1, result_1) { // Users Find Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User List Find Query Error', 'AdminManagement.controller.js', err_1);
                        res.status(417).send({status: false, Message: "Some error occurred while Find Users List!."});
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


// -------------------------------------------------- Users List -----------------------------------------------
   exports.Users_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         AdminModel.User_Management.find({'Active_Status': true }, {User_Password: 0}, {sort: { updatedAt: -1 }})
         .populate({ path: 'Staff', select: ['Name', 'Email', 'Phone', 'Institution', 'Department'], populate: { path: 'Institution', select: 'Institution' } })
         .populate({ path: 'Staff', select: ['Name', 'Email', 'Phone', 'Institution', 'Department'], populate: { path: 'Department', select: 'Department' } })
         .exec (function(err, result) { // Users Find Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User List Find Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Users List!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };




// -------------------------------------------------- Countries List----------------------------------------------------------
   exports.Country_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty!" });
      } else {
         AdminModel.Global_Country.find({}, {Country_Name: 1}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Countries Find Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find the Countries List!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
  
// -------------------------------------------------- States List ----------------------------------------------------------
   exports.State_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty!" });
      }else if(!ReceivingData.Country_Id || ReceivingData.Country_Id === '') {
         res.status(200).send({Status:"True", Output:"False", Message: "Country Id can not be empty" });
      }else{
         AdminModel.Global_State.find({ Country_DatabaseId: ReceivingData.Country_Id }, { State_Name: 1}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'States List Find Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find the States List!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
  
// -------------------------------------------------- Cities List ----------------------------------------------------------
   exports.City_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty!" });
      }else if(!ReceivingData.State_Id || ReceivingData.State_Id === '') {
               res.status(200).send({Status:"True", Output:"False", Message: "State Id can not be empty" });
         }else{
            AdminModel.Global_City.find({ State_DatabaseId: ReceivingData.State_Id }, { City_Name: 1}, {}, function(err, result) {
               if(err) {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cities List Find Query Error', 'AdminManagement.controller.js', err);
                  res.status(417).send({status: false, Message: "Some error occurred while Find the Cities List!."});
               } else {
                  var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                     ReturnData = ReturnData.toString();
                  res.status(200).send({Status: true, Response: ReturnData });
               }
            });
         }
   };