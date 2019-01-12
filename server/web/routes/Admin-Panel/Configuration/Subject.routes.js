module.exports = function(app) {

   var Controller = require('./../../../Controllers/Admin-Panel/Configuration/Subject.controller.js');


   app.post('/API/Configuration/Subject/Subject_AsyncValidate', Controller.Subject_AsyncValidate);
   app.post('/API/Configuration/Subject/SubjectUpdate_AsyncValidate', Controller.SubjectUpdate_AsyncValidate);
   app.post('/API/Configuration/Subject/Subject_Create', Controller.Subject_Create);
   app.post('/API/Configuration/Subject/Subject_List', Controller.Subject_List);
   app.post('/API/Configuration/Subject/InstitutionBased_SubjectList', Controller.InstitutionBased_SubjectList);
   app.post('/API/Configuration/Subject/Subject_SimpleList', Controller.Subject_SimpleList);
   app.post('/API/Configuration/Subject/Subject_Update', Controller.Subject_Update);
   app.post('/API/Configuration/Subject/Subject_Delete', Controller.Subject_Delete);

};