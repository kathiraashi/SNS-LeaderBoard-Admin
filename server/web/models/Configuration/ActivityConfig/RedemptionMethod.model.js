var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// RedemptionMethod Schema
   var RedemptionMethodSchema = mongoose.Schema({
      RedemptionMethod: { type : String , required : true},
      MaximumPointsRegarding: { type : String , required : true},
      ConvertedToDescription: { type : String , required : true},
      Institution : { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarRedemptionMethod = mongoose.model('RedemptionMethod', RedemptionMethodSchema, 'RedemptionMethod_List');


   
module.exports = {
   RedemptionMethodSchema : VarRedemptionMethod
};