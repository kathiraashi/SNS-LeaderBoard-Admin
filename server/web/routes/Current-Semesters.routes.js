module.exports = function(app) {

   var Controller = require('./../controller/Current-Semesters.controller.js');

   app.post('/API/Current_Semesters/CurrentSemesters_Create', Controller.CurrentSemesters_Create);
   app.post('/API/Current_Semesters/InstitutionManagementBased_CurrentSemestersList', Controller.InstitutionManagementBased_CurrentSemestersList);
   app.post('/API/Current_Semesters/CurrentSemesters_List', Controller.CurrentSemesters_List);

};