module.exports = function(app) {

   var Controller = require('./../../controller/Admin/AdminManagement.controller.js');

   app.post('/API/RegisterAndLogin/User_Login_Validate', Controller.User_Login_Validate);


};
