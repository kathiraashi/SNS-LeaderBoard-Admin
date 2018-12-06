var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// AchievementType Schema
   var AchievementTypeSchema = mongoose.Schema({
      AchievementType: { type : String , required : true},
      Institution : { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarAchievementType = mongoose.model('AchievementType', AchievementTypeSchema, 'AchievementType_List');



   
module.exports = {
   AchievementTypeSchema : VarAchievementType
};