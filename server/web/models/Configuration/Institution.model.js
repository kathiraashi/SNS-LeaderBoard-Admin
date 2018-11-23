var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Institution Schema
   var InstitutionSchema = mongoose.Schema({
      Institution: { type : String , required : true},
      Institution_Code: { type : String , required : true},
      YearOfIncorporation: { type : String , required : true},
      Email: { type : String , required : true},
      Phone: { type : String , required : true},
      Website: { type : String , required : true},
      Address: { type : String , required : true},
      Departments: [ { type: Schema.Types.ObjectId, ref: 'Department', required : true } ],
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarInstitution = mongoose.model('Institution', InstitutionSchema, 'Institution_List');



   
module.exports = {
   InstitutionSchema : VarInstitution
};