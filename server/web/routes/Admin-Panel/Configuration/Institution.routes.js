module.exports = function(app) {

   var Controller = require('./../../../Controllers/Admin-Panel/Configuration/Institution.controller.js');


   app.post('/API/Configuration/Institution/Institution_AsyncValidate', Controller.Institution_AsyncValidate);
   app.post('/API/Configuration/Institution/Institution_Create', Controller.Institution_Create);
   app.post('/API/Configuration/Institution/Institution_List', Controller.Institution_List);
   app.post('/API/Configuration/Institution/Institution_SimpleList', Controller.Institution_SimpleList);
   app.post('/API/Configuration/Institution/InstitutionBased_DepartmentsSimpleList', Controller.InstitutionBased_DepartmentsSimpleList);
   app.post('/API/Configuration/Institution/Institution_Update', Controller.Institution_Update);
   app.post('/API/Configuration/Institution/Institution_Delete', Controller.Institution_Delete);

};