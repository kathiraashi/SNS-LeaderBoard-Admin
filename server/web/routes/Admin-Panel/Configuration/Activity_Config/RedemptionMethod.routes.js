module.exports = function(app) {

   var Controller = require('./../../../../Controllers/Admin-Panel/Configuration/ActivityConfig/RedemptionMethod.controller.js');


   app.post('/API/Configuration/ActivityConfig/RedemptionMethod/RedemptionMethod_AsyncValidate', Controller.RedemptionMethod_AsyncValidate);
   app.post('/API/Configuration/ActivityConfig/RedemptionMethod/RedemptionMethodUpdate_AsyncValidate', Controller.RedemptionMethodUpdate_AsyncValidate);
   app.post('/API/Configuration/ActivityConfig/RedemptionMethod/RedemptionMethod_Create', Controller.RedemptionMethod_Create);
   app.post('/API/Configuration/ActivityConfig/RedemptionMethod/RedemptionMethod_List', Controller.RedemptionMethod_List);
   app.post('/API/Configuration/ActivityConfig/RedemptionMethod/InstitutionBased_RedemptionMethod_List', Controller.InstitutionBased_RedemptionMethod_List);
   app.post('/API/Configuration/ActivityConfig/RedemptionMethod/RedemptionMethod_SimpleList', Controller.RedemptionMethod_SimpleList);
   app.post('/API/Configuration/ActivityConfig/RedemptionMethod/RedemptionMethod_Update', Controller.RedemptionMethod_Update);
   app.post('/API/Configuration/ActivityConfig/RedemptionMethod/RedemptionMethod_Delete', Controller.RedemptionMethod_Delete);

};