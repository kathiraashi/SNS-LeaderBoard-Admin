module.exports = function(app) {

   var Controller = require('./../controller/Staffs.controller');

   app.post('/API/Staffs/Staff_Create', Controller.Staff_Create);
   app.post('/API/Staffs/Staff_List', Controller.Staff_List);
   app.post('/API/Staffs/Staff_View', Controller.Staff_View);
};