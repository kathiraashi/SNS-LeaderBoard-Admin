module.exports = function(app) {

   var Controller = require('./../../Controllers/Student-Panel/Activities.controller.js');

   app.post('/API/Student/Activities/Activities_List', Controller.Activities_List);



};