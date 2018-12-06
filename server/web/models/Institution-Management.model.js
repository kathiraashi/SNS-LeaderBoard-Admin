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
      NoOfYears: { type: Number, required : true }, // Ex: 3
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarYearlyBatches = mongoose.model('YearlyBatches', YearlyBatchesSchema, 'YearlyBatches_List');


   //  BatchYears Schema
   var BatchYearsSchema = mongoose.Schema({
      InstitutionManagement: { type: Schema.Types.ObjectId, ref: 'InstitutionManagements', required : true },
      YearlyBatch: { type: Schema.Types.ObjectId, ref: 'YearlyBatches', required : true },
      From_Year: { type: Date, required : true }, // Ex: 2000
      To_Year: { type: Date, required : true }, // Ex: 2001
      Show_Year: { type: String, required : true }, // Ex: 1st Year
      NoOfSemesters: { type: Number, required : true }, // Ex: 2
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarBatchYears = mongoose.model('BatchYears', BatchYearsSchema, 'BatchYears_List');


   //  YearSemesters Schema
   var YearSemestersSchema = mongoose.Schema({
      InstitutionManagement: { type: Schema.Types.ObjectId, ref: 'InstitutionManagements', required : true },
      YearlyBatch: { type: Schema.Types.ObjectId, ref: 'YearlyBatches', required : true },
      BatchYear: { type: Schema.Types.ObjectId, ref: 'BatchYears', required : true },
      Semester_Start: { type: String, required : true }, // Ex: 2000-May
      Semester_End: { type: String, required : true }, // Ex: 2000-Nov
      Semester_Name: { type: String, required : true }, // Ex: Semester-1
      NoOfSections: { type: Number, required : true }, // Ex: 2
      Sections_Arr: [{ type: String, required : true }], // Ex: ['Section-A', 'Section-B']
      Subjects: [{ type: String, required : true }], // Ex: ['Subject-One', 'Subject-Two']
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarYearSemesters = mongoose.model('YearSemesters', YearSemestersSchema, 'YearSemesters_List');


   // Semesters Management Schema
   var  SemestersManagementSchema = mongoose.Schema({
      InstitutionManagement: { type: Schema.Types.ObjectId, ref: 'InstitutionManagements', required : true },
      YearlyBatch: { type: Schema.Types.ObjectId, ref: 'YearlyBatches', required : true },
      BatchYear: { type: Schema.Types.ObjectId, ref: 'BatchYears', required : true },
      YearSemester: { type: Schema.Types.ObjectId, ref: 'YearSemesters', required : true },
      Subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject', required : true  }],
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarSemestersManagement = mongoose.model('SemestersManagement', SemestersManagementSchema, 'SemestersManagement_List');

   
   // Semester Subject Staff Section Management Schema
   var SemesterSubjectStaffSectionManagementSchema = mongoose.Schema({
      InstitutionManagement: { type: Schema.Types.ObjectId, ref: 'InstitutionManagements', required : true },
      YearlyBatch: { type: Schema.Types.ObjectId, ref: 'YearlyBatches', required : true },
      BatchYear: { type: Schema.Types.ObjectId, ref: 'BatchYears', required : true },
      YearSemester: { type: Schema.Types.ObjectId, ref: 'YearSemesters', required : true },
      SemesterManagement: { type: Schema.Types.ObjectId, ref: 'SemestersManagement', required : true },
      Section: { type: String, required : true },
      Subject: { type: Schema.Types.ObjectId, ref: 'Subject', required : true  },
      Staff: { type: Schema.Types.ObjectId, ref: 'Staffs', required : true  },
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarSemesterSubjectStaffSectionManagement = mongoose.model('SemesterSubjectStaffSectionManagement', SemesterSubjectStaffSectionManagementSchema, 'SemesterSubjectStaffSectionManagement_List');


   
module.exports = {
   InstitutionManagementSchema : VarInstitutionManagements,
   YearlyBatchesSchema: VarYearlyBatches,
   BatchYearsSchema: VarBatchYears,
   YearSemestersSchema: VarYearSemesters,
   SemestersManagementSchema: VarSemestersManagement,
   SemesterSubjectStaffSectionManagementSchema: VarSemesterSubjectStaffSectionManagement
};