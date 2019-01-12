var mongoose = require('mongoose');
var Schema = mongoose.Schema;

   // Staffs Schema
   var StaffsSchema = mongoose.Schema({
      Institution: { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
      Department: { type: Schema.Types.ObjectId, ref: 'Department' },
      StaffRole: { type: String, required : true },
      Name: { type: String, required : true },
      Qualification: { type: String, required : true },
      DateOfJoining: { type: String, required : true },
      Gender: { type: String, required : true },
      BloodGroup: { type: String, required : true },
      DateOfBirth: { type: String, required : true },
      Mobile: { type: String, required : true },
      Email: { type: String, required : true },
      Address: { type: String, required : true },
      UserManagement_Linked: { type : Boolean , required : true},
      UserManagement: { type: Schema.Types.ObjectId, ref: 'User_Management' },
      Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarStaffs = mongoose.model('Staffs', StaffsSchema, 'Staffs_List');





module.exports = {
   StaffsSchema: VarStaffs
};
