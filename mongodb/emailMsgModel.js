/*
  The emailMsg model
  First builds a emailMessage scheme, then exports a model. 
*/
 
var mongoose = require('mongoose');
 
var emailMsgSchema = mongoose.Schema(
      {
      user: { type: String, index: true }, //the email address
      from: { type: [String], index: true },
      to: { type: [String], index: true },
      cc: { type: [String], index: true },
      bcc: { type: [String], index: true },
      subject: String,
      date: { type: Date, index: true },
      labels: [String],
      //flags: [String],
      msgid: { type: String, index: true},
      thrid: {type:String, index: true}
      } 
    ); 
//composite key
emailMsgSchema.index({ user: 1, msgid: -1 }, { unique: true })
    
module.exports = mongoose.model('emailMsg', emailMsgSchema);
