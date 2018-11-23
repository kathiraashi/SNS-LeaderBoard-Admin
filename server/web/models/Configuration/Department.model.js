var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Department Schema
   var DepartmentSchema = mongoose.Schema({
      Department: { type : String , required : true},
      Department_Code: { type : String , required : true},
      Courses : [{ type: Schema.Types.ObjectId, ref: 'Course', required : true }],
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarDepartment = mongoose.model('Department', DepartmentSchema, 'Department_List');



   
module.exports = {
   DepartmentSchema : VarDepartment
};