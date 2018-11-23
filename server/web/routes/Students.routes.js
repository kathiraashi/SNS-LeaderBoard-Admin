module.exports = function(app) {

   var Controller = require('./../controller/Students.controller');


   app.post('/API/Students/Students_Import', Controller.Students_Import);
   app.post('/API/Students/Students_List', Controller.Students_List);
   app.post('/API/Students/Student_View', Controller.Student_View);
};