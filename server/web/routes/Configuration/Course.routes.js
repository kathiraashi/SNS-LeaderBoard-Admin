module.exports = function(app) {

   var Controller = require('./../../controller/Configuration/Course.controller.js');


   app.post('/API/Configuration/Course/Course_AsyncValidate', Controller.Course_AsyncValidate);
   app.post('/API/Configuration/Course/Course_Create', Controller.Course_Create);
   app.post('/API/Configuration/Course/Course_List', Controller.Course_List);
   app.post('/API/Configuration/Course/Course_SimpleList', Controller.Course_SimpleList);
   app.post('/API/Configuration/Course/Course_Update', Controller.Course_Update);
   app.post('/API/Configuration/Course/Course_Delete', Controller.Course_Delete);

};