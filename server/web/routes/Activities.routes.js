module.exports = function(app) {

   var Controller = require('./../controller/Activities.controller.js');

   app.post('/API/Activities/Activities_Create', Controller.Activities_Create);
   app.post('/API/Activities/Activities_List', Controller.Activities_List);
   app.post('/API/Activities/Activities_SimpleList', Controller.Activities_SimpleList);
   app.post('/API/Activities/Activities_View', Controller.Activities_View);
};