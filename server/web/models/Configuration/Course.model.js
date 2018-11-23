var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Course Schema
   var CourseSchema = mongoose.Schema({
      Course: { type : String , required : true},
      Course_ShortCode: { type : String , required : true},
      NoOfYears: { type : String , required : true},
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarCourse = mongoose.model('Course', CourseSchema, 'Course_List');



   
module.exports = {
   CourseSchema : VarCourse
};