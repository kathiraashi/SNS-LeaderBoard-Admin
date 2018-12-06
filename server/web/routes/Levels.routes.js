module.exports = function(app) {

   var Controller = require('./../controller/Levels.controller.js');

   app.post('/API/Levels/Levels_Create_Validate', Controller.Levels_Create_Validate);
   app.post('/API/Levels/DepartmentBased_Levels_SimpleList', Controller.DepartmentBased_Levels_SimpleList);
   app.post('/API/Levels/Levels_Create', Controller.Levels_Create);
   app.post('/API/Levels/Levels_List', Controller.Levels_List);

};