var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// ActivityLevel Schema
   var ActivityLevelSchema = mongoose.Schema({
      ActivityLevel: { type : String , required : true},
      Institution : { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarActivityLevel = mongoose.model('ActivityLevel', ActivityLevelSchema, 'ActivityLevel_List');



   
module.exports = {
   ActivityLevelSchema : VarActivityLevel
};