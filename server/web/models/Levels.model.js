var mongoose = require('mongoose');
var Schema = mongoose.Schema;

   // Levels Schema
   var LevelsSchema = mongoose.Schema({
      Level_Name: { type: String, required : true },
      Institution: { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Department: { type: Schema.Types.ObjectId, ref: 'Department', required : true },
      Activities: [{ type: Schema.Types.ObjectId, ref: 'Activities', required : true }],
      ItsBaseLevel: { type: Boolean },
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





module.exports = {
   LevelsSchema: VarLevels
};
