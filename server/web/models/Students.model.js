var mongoose = require('mongoose');
var Schema = mongoose.Schema;

   // Students Schema
   var StudentsSchema = mongoose.Schema({
      Institution: { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Institution_Management: { type: Schema.Types.ObjectId, ref: 'InstitutionManagements', required : true },
      Yearly_Badge: { type: Schema.Types.ObjectId, ref: 'YearlyBatches', required : true },
      Year: { type: Schema.Types.ObjectId, ref: 'BatchYears', required : true },
      Semester: { type: Schema.Types.ObjectId, ref: 'YearSemesters', required : true },
      Section: { type: String, required : true },
      Roll_No: { type: String, required : true, unique: true },
      Name: { type: String, required : true },
      Gender: { type: String, required : true },
      Blood_Group: { type: String, required : true },
      Contact_Number: { type: String, required : true },
      Email: { type: String, required : true },
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarStudents = mongoose.model('Students', StudentsSchema, 'Students_List');





module.exports = {
   StudentsSchema: VarStudents
};
