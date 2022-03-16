const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title:{type:String,required:true},
  author:{type:String,required:true},
  price:{type:Number,required:true},
  imageURL:{type:String,required:true},
  description:{type:String,required:true},
  creator:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
});

module.exports = mongoose.model('Book',bookSchema);