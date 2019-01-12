module.exports = function(app) {

   var Controller = require('./../../Controllers/Admin-Panel/Current-Semesters.controller.js');

   app.post('/API/Current_Semesters/CurrentSemesters_Create', Controller.CurrentSemesters_Create);
   app.post('/API/Current_Semesters/InstitutionManagementBased_CurrentSemestersList', Controller.InstitutionManagementBased_CurrentSemestersList);
   app.post('/API/Current_Semesters/DepartmentBased_CurrentSemesters_List', Controller.DepartmentBased_CurrentSemesters_List);
   app.post('/API/Current_Semesters/CurrentSemesters_List', Controller.CurrentSemesters_List);


};