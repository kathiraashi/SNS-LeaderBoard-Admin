var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//  Institution Management Schema
   var InstitutionManagementSchema = mongoose.Schema({
      Institution: { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Department: { type: Schema.Types.ObjectId, ref: 'Department', required : true },
      Course: { type: Schema.Types.ObjectId, ref: 'Course', required : true },
      Status: { type : String , required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarInstitutionManagements = mongoose.model('InstitutionManagements', InstitutionManagementSchema, 'InstitutionManagements_List');

   //  Yearly Batches Schema
   var YearlyBatchesSchema = mongoose.Schema({
      InstitutionManagement: { type: Schema.Types.ObjectId, ref: 'InstitutionManagements', required : true },
      Starting_MonthAndYear: { type: Date, required : true }, // Ex: 2000
      Ending_MonthAndYear: { type: Date, required : true }, // Ex: 2003
      Years_Array: [{ 
         From_Year: { type: Date, required : true }, // Ex: 2000
         To_Year: { type: Date, required : true }, // Ex: 2001
         Show_Year: { type: String, required : true }, // Ex: 1st Year
         NoOfSemesters: { type: Number, required : true }, // Ex: 2
         Semesters: [{
            Semester_Start: { type: String, required : true }, // Ex: 2000-May
            Semester_End: { type: String, required : true }, // Ex: 2000-Nov
            Semester_Name: { type: String, required : true }, // Ex: Semester-1
            NoOfSections: { type: Number, required : true }, // Ex: 2
            Sections_Arr: [{ type: String, required : true }], // Ex: ['Section-A', 'Section-B']
         }],
      }],
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarYearlyBatches = mongoose.model('YearlyBatches', YearlyBatchesSchema, 'YearlyBatches_List');




   
module.exports = {
   InstitutionManagementSchema : VarInstitutionManagements,
   YearlyBatchesSchema: VarYearlyBatches
};