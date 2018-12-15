module.exports = function(app) {

   var Controller = require('./../controller/Students.controller');


   app.post('/API/Students/Students_Import', Controller.Students_Import);
   app.post('/API/Students/StudentRegNo_AsyncValidate', Controller.StudentRegNo_AsyncValidate);
   app.post('/API/Students/SemesterUnlinked_StudentsList', Controller.SemesterUnlinked_StudentsList);
   app.post('/API/Students/Students_LinkSection', Controller.Students_LinkSection);
   app.post('/API/Students/InstitutionBased_StudentsList', Controller.InstitutionBased_StudentsList);
   app.post('/API/Students/InstitutionManagementBased_StudentsList', Controller.InstitutionManagementBased_StudentsList);
   app.post('/API/Students/SemesterBased_StudentsList', Controller.SemesterBased_StudentsList);
   app.post('/API/Students/SectionBased_StudentsList', Controller.SectionBased_StudentsList);

};