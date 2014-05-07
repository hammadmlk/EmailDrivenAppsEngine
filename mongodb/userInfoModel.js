/*
  The userInfo model
  First builds a userInfo scheme, then exports a model. 
*/
 
var mongoose = require('mongoose');
 
var userInfoSchema = mongoose.Schema(
      {
      id: Number,
      email: { type: String, index: true, unique: true },
      name: String,
      given_name: String,
      family_name: String,
      link: String,
      picture: String,
      gender: String,
      date: {type: Date, default: Date.now}, // date of creation
      hd: String,
      verified_email: Boolean,
      refresh_token: String,
      access_token: String,
      role: String, //example CU-undergraduate, CU-AcademicStaff etc
      notes: String, //any notes
      loadingStatus: {type: Number, default: 0}
      } 
    );
    
module.exports = mongoose.model('userInfo', userInfoSchema);
