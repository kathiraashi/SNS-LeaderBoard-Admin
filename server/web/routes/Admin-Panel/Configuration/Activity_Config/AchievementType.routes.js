module.exports = function(app) {

   var Controller = require('./../../../../Controllers/Admin-Panel/Configuration/ActivityConfig/AchievementType.controller.js');


   app.post('/API/Configuration/ActivityConfig/AchievementType/AchievementType_AsyncValidate', Controller.AchievementType_AsyncValidate);
   app.post('/API/Configuration/ActivityConfig/AchievementType/AchievementTypeUpdate_AsyncValidate', Controller.AchievementTypeUpdate_AsyncValidate);
   app.post('/API/Configuration/ActivityConfig/AchievementType/AchievementType_Create', Controller.AchievementType_Create);
   app.post('/API/Configuration/ActivityConfig/AchievementType/AchievementType_List', Controller.AchievementType_List);
   app.post('/API/Configuration/ActivityConfig/AchievementType/InstitutionBased_AchievementType_List', Controller.InstitutionBased_AchievementType_List);
   app.post('/API/Configuration/ActivityConfig/AchievementType/AchievementType_SimpleList', Controller.AchievementType_SimpleList);
   app.post('/API/Configuration/ActivityConfig/AchievementType/AchievementType_Update', Controller.AchievementType_Update);
   app.post('/API/Configuration/ActivityConfig/AchievementType/AchievementType_Delete', Controller.AchievementType_Delete);

};