var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserManagementSchema = mongoose.Schema({
   User_Name: { type : String , unique: true, required : true },
   User_Password: { type : String, required : true,  },
   Name: { type : String , required : true },
   Phone : { type : String},
   Email: { type : String , required : true },
   User_Type: { type : String , required : true } ,
   Staff: { type: Schema.Types.ObjectId } ,
   Reports_To: { type: Schema.Types.ObjectId, ref: 'User_Management' },
   Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management' },
   Last_ModifiedBy: { type: Schema.Types.ObjectId, ref: 'User_Management' },
   Active_Status: { type : Boolean, required : true },
   LoginToken: { type : String },
   LoginTime: { type : Date },
   LastActiveTime: { type : Date },
   LogOutTime: { type : Date },
   },
   { timestamps: true }
);

var UserLoginSchema = mongoose.Schema({
   Request_Ip: { type : String , required : true },
   Request_Origin: { type : String , required : true},
   Request_From: { type : String , required : true},
   Request_DeviceInfo: { type : Object , required : true },
   If_Logged_Out: { type : Boolean},
   User_Id: { type: Schema.Types.ObjectId, ref: 'User_Management' },
   Company_Id: { type: Schema.Types.ObjectId, ref: 'Company_Management' },
   Active_Status: { type : Boolean, required : true },
   },
   { timestamps: true }
);


var CountrySchema = mongoose.Schema({
   Continent_GeoNameId: { type : Number },
   Country_GeoNameId: { type : Number },
   Country_Code: { type : String },
   Country_Name: { type : String },
   Country_Lat: { type : String },
   Country_Lng: { type : String },
});

var StateSchema = mongoose.Schema({
   State_GeoNameId: { type : Number },
   State_Name: { type : String },
   State_Lat: { type : String },
   State_Lng: { type : String },
   Country_GeoNameId: { type : Number },
   Country_DatabaseId: { type: Schema.Types.ObjectId, ref: 'Global_Country' },
});

var CitySchema = mongoose.Schema({
   City_GeoNameId: { type : Number },
   City_Name: { type : String },
   City_Lat: { type : String },
   City_Lng: { type : String },
   Country_GeoNameId: { type : Number },
   State_GeoNameId: { type : Number },
   Country_DatabaseId: [{ type: Schema.Types.ObjectId, ref: 'Global_Country' }],
   State_DatabaseId: [{ type: Schema.Types.ObjectId, ref: 'Global_State' }],
});



var VarUser_Management = mongoose.model('User_Management', UserManagementSchema, 'User_Management');
var VarUserLogin_Management = mongoose.model('UserLogin_Management', UserLoginSchema, 'UserLogin_Management');

var VarGlobal_Country = mongoose.model('Global_Country', CountrySchema, 'Global_Country');
var VarGlobal_State = mongoose.model('Global_State', StateSchema, 'Global_State');
var VarGlobal_City = mongoose.model('Global_City', CitySchema, 'Global_City');

module.exports = {
   User_Management : VarUser_Management,
   UserLogin_Management : VarUserLogin_Management,

   Global_Country : VarGlobal_Country,
   Global_State : VarGlobal_State,
   Global_City : VarGlobal_City,
   
};