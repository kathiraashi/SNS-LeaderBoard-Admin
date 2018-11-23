module.exports = function(app) {

   var Controller = require('./../controller/Institution-Management.controller.js');


   app.post('/API/Institution-Management/InstitutionManagement_List', Controller.InstitutionManagement_List);
   app.post('/API/Institution-Management/InstitutionManagement_YearlyBatchesList', Controller.InstitutionManagement_YearlyBatchesList);
   app.post('/API/Institution-Management/InstitutionManagement_YearlyBatchesCreate', Controller.InstitutionManagement_YearlyBatchesCreate);

};