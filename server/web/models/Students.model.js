var mongoose = require('mongoose');
var Schema = mongoose.Schema;

   // Students Schema
   var StudentsSchema = mongoose.Schema({
      Institution: { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Department: { type: Schema.Types.ObjectId, ref: 'Department', required : true },
      Institution_Management: { type: Schema.Types.ObjectId, ref: 'InstitutionManagements', required : true },
      Yearly_Badge: { type: Schema.Types.ObjectId, ref: 'YearlyBatches', required : true },
      Reg_No: { type: String, required : true, unique: true },
      Name: { type: String, required : true },
      Gender: { type: String, required : true },
      Blood_Group: { type: String, required : true },
      Contact_Number: { type: String, required : true },
      Email: { type: String, required : true },

      DateOfBirth: { type: Date},
      Image: { type: Object },
      Registration_Completed: { type: Boolean, required : true },
      Password: { type: String },
      EmailToken: { type: String },
      LoginToken: { type: String },
      LastActive: { type: Date },

      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarStudents = mongoose.model('Students', StudentsSchema, 'Students_List');

   // Students Linked Sections Schema
   var StudentsLinkedSectionsSchema = mongoose.Schema({
      Student: { type: Schema.Types.ObjectId, ref: 'Students', required : true },
      Institution: { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Department: { type: Schema.Types.ObjectId, ref: 'Department', required : true },
      Institution_Management: { type: Schema.Types.ObjectId, ref: 'InstitutionManagements', required : true },
      Yearly_Badge: { type: Schema.Types.ObjectId, ref: 'YearlyBatches', required : true },
      Year: { type: Schema.Types.ObjectId, ref: 'BatchYears', required : true },
      Semester: { type: Schema.Types.ObjectId, ref: 'YearSemesters', required : true },
      Section: { type: String, required : true },
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarStudentsLinkedSections = mongoose.model('StudentsLinkedSections', StudentsLinkedSectionsSchema, 'StudentsLinkedSections_List');

   // Student Login Details Schema
   var StudentLoginDetailsSchema = mongoose.Schema({
      Student: { type: Schema.Types.ObjectId, ref: 'Students', required : true },
      LoginToken: { type: String, required : true },
      LoginTime: { type : Date , required : true },
      From: { type : Object, required : true },
      Ip: { type : Object, required : true },
      Device_Info: { type : Object },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarStudentLoginDetails = mongoose.model('StudentLoginDetails', StudentLoginDetailsSchema, 'StudentLoginDetails_List');


module.exports = {
   StudentsSchema: VarStudents,
   StudentsLinkedSectionsSchema: VarStudentsLinkedSections,
   StudentLoginDetailsSchema: VarStudentLoginDetails
};
