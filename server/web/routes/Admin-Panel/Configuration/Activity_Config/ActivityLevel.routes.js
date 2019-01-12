module.exports = function(app) {

   var Controller = require('./../../../../Controllers/Admin-Panel/Configuration/ActivityConfig/ActivityLevel.controller.js');


   app.post('/API/Configuration/ActivityConfig/ActivityLevel/ActivityLevel_AsyncValidate', Controller.ActivityLevel_AsyncValidate);
   app.post('/API/Configuration/ActivityConfig/ActivityLevel/ActivityLevelUpdate_AsyncValidate', Controller.ActivityLevelUpdate_AsyncValidate);
   app.post('/API/Configuration/ActivityConfig/ActivityLevel/ActivityLevel_Create', Controller.ActivityLevel_Create);
   app.post('/API/Configuration/ActivityConfig/ActivityLevel/ActivityLevel_List', Controller.ActivityLevel_List);
   app.post('/API/Configuration/ActivityConfig/ActivityLevel/InstitutionBased_ActivityLevel_List', Controller.InstitutionBased_ActivityLevel_List);
   app.post('/API/Configuration/ActivityConfig/ActivityLevel/ActivityLevel_SimpleList', Controller.ActivityLevel_SimpleList);
   app.post('/API/Configuration/ActivityConfig/ActivityLevel/ActivityLevel_Update', Controller.ActivityLevel_Update);
   app.post('/API/Configuration/ActivityConfig/ActivityLevel/ActivityLevel_Delete', Controller.ActivityLevel_Delete);

};