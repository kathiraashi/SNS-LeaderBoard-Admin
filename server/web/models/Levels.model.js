var mongoose = require('mongoose');
var Schema = mongoose.Schema;

   // Levels Schema
   var LevelsSchema = mongoose.Schema({
      Level_Name: { type: String, required : true },
      Institution: { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Activities: [{ type: Schema.Types.ObjectId, ref: 'Activities', required : true }],
      ItsBaseLevel: { type: Boolean },
      Batch: { type: Object, required : true },
      EligiblePoints: { type: String },
      EligiblePreviousLevel: { type: Schema.Types.ObjectId, ref: 'Levels' },
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarLevels = mongoose.model('Levels', LevelsSchema, 'Levels_List');



   // Student Levels Management Schema
   var StudentLevelsManagementSchema = mongoose.Schema({
      Level: { type: Schema.Types.ObjectId, ref: 'Levels',  required : true },
      Student: { type: Schema.Types.ObjectId, ref: 'Students',  required : true },
      Activities: [{ type: Schema.Types.ObjectId, ref: 'Activities', required : true }],
      Level_Status: { type : String, required : true},
      Active_Status: { type : Boolean, required : true},
      If_Deleted: { type : Boolean, required : true }
      },
      { timestamps: true }
   );
   var VarStudentLevelsManagement = mongoose.model('StudentLevelsManagement', StudentLevelsManagementSchema, 'StudentLevelsManagement_List');
   




module.exports = {
   LevelsSchema: VarLevels,
   StudentLevelsManagementSchema: VarStudentLevelsManagement
};
