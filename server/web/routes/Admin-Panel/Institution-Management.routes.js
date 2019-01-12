module.exports = function(app) {

   var Controller = require('./../../Controllers/Admin-Panel/Institution-Management.controller.js');


   app.post('/API/Institution-Management/InstitutionManagement_List', Controller.InstitutionManagement_List);
   app.post('/API/Institution-Management/InstitutionManagement_YearlyBatchesList', Controller.InstitutionManagement_YearlyBatchesList);
   app.post('/API/Institution-Management/InstitutionManagement_YearlyBatches_SimpleList', Controller.InstitutionManagement_YearlyBatches_SimpleList);
   app.post('/API/Institution-Management/InstitutionManagement_YearlyBatchesCreate', Controller.InstitutionManagement_YearlyBatchesCreate);
   app.post('/API/Institution-Management/InstitutionManagement_YearlyBatchView', Controller.InstitutionManagement_YearlyBatchView);
   app.post('/API/Institution-Management/DepartmentBased_InstitutionManagement_List', Controller.DepartmentBased_InstitutionManagement_List);


   
   app.post('/API/Institution-Management/InstitutionManagement_SemesterManagementsList', Controller.InstitutionManagement_SemesterManagementsList);
   app.post('/API/Institution-Management/InstitutionManagement_SemesterManagementsCreate', Controller.InstitutionManagement_SemesterManagementsCreate);
   app.post('/API/Institution-Management/InstitutionManagement_SemesterManagementsAsyncValidate', Controller.InstitutionManagement_SemesterManagementsAsyncValidate);
   app.post('/API/Institution-Management/InstitutionManagement_SemesterManagementView', Controller.InstitutionManagement_SemesterManagementView);

};