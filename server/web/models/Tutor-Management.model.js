var mongoose = require('mongoose');
var Schema = mongoose.Schema;

   // Tutor Management Schema
   var TutorManagementSchema = mongoose.Schema({
      Institution: { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Institution_Management: { type: Schema.Types.ObjectId, ref: 'InstitutionManagements', required : true },
      Yearly_Badge: { type: Schema.Types.ObjectId, ref: 'YearlyBatches', required : true },
      Year: { type: Schema.Types.ObjectId, ref: 'BatchYears', required : true },
      Semester: { type: Schema.Types.ObjectId, ref: 'YearSemesters', required : true },
      Section: { type: String, required : true },
      Student: { type: Schema.Types.ObjectId, ref: 'Students', required : true },
      Staff: { type: Schema.Types.ObjectId, ref: 'Staffs', required : true  },
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarTutorManagement = mongoose.model('TutorManagement', TutorManagementSchema, 'TutorManagement_List');





module.exports = {
   TutorManagementSchema: VarTutorManagement
};