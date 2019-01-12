module.exports = function(app) {

   var Controller = require('./../../Controllers/Student-Panel/RegisterAndLogin.controller.js');

   app.post('/API/Student/RegisterAndLogin/StudentRegistration_Validate', Controller.StudentRegistration_Validate);
   app.post('/API/Student/RegisterAndLogin/StudentAccountActivate_Validate', Controller.StudentAccountActivate_Validate);
   app.post('/API/Student/RegisterAndLogin/StudentActivate_UpdateAndLogin', Controller.StudentActivate_UpdateAndLogin);
   app.post('/API/Student/RegisterAndLogin/StudentLogin_Validate', Controller.StudentLogin_Validate);



};