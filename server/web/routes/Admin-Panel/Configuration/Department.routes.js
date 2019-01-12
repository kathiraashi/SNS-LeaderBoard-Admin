module.exports = function(app) {

   var Controller = require('./../../../Controllers/Admin-Panel/Configuration/Department.controller.js');


   app.post('/API/Configuration/Department/Department_AsyncValidate', Controller.Department_AsyncValidate);
   app.post('/API/Configuration/Department/Department_Create', Controller.Department_Create);
   app.post('/API/Configuration/Department/Department_List', Controller.Department_List);
   app.post('/API/Configuration/Department/Department_SimpleList', Controller.Department_SimpleList);
   app.post('/API/Configuration/Department/Department_Update', Controller.Department_Update);
   app.post('/API/Configuration/Department/Department_Delete', Controller.Department_Delete);

};