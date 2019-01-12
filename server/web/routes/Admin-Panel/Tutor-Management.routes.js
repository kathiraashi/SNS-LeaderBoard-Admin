module.exports = function(app) {

   var Controller = require('./../../Controllers/Admin-Panel/Tutor-Management.controller.js');


   app.post('/API/Tutor_Management/TutorManagement_Create', Controller.TutorManagement_Create);
   app.post('/API/Tutor_Management/TutorManagement_List', Controller.TutorManagement_List);
   app.post('/API/Tutor_Management/TutorManagement_View', Controller.TutorManagement_View);


};