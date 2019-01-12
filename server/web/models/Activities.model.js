var mongoose = require('mongoose');
var Schema = mongoose.Schema;

   // Activities Schema
   var ActivitiesSchema = mongoose.Schema({
      Institution: { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Activity_Name: { type: String, required : true },
      Activity_Type: { Key : {type: String, required : true },  Value : {type: String, required : true } },
      Max_Points: { type: String },
      Description: { type: String, required : true },
      Form_Extended: { type: Boolean, required : true },
      Activity_Levels: [{ type: Schema.Types.ObjectId, ref: 'ActivityLevel' }],
      Achievement_Types: [{ type: Schema.Types.ObjectId, ref: 'AchievementType' }],
      Skip_Activity: { type: Boolean },
      MaxPoints_Array: [{
         ActivityLevel_And_AchievementType: { type: String },
         Activity_Level: { type: Schema.Types.ObjectId, ref: 'ActivityLevel' },
         Achievement_Type: { type: Schema.Types.ObjectId, ref: 'AchievementType' },
         Max_Points: { type: String },
      }],
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarActivities = mongoose.model('Activities', ActivitiesSchema, 'Activities_List');



   // Student Activities Management Schema
   var StudentActivitiesManagementSchema = mongoose.Schema({
      Activity: { type: Schema.Types.ObjectId, ref: 'Activities', required : true },
      Student: { type: Schema.Types.ObjectId, ref: 'Students',  required : true },
      Level: { type: Schema.Types.ObjectId, ref: 'Levels',  required : true },
      Activity_Status: { type: String, required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarStudentActivitiesManagement = mongoose.model('StudentActivitiesManagement', StudentActivitiesManagementSchema, 'StudentActivitiesManagement_List');



module.exports = {
   ActivitiesSchema: VarActivities,
   StudentActivitiesManagementSchema: VarStudentActivitiesManagement
};
