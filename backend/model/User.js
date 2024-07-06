const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    publicKey: {
      type: String,
      require: false,
    },
    privateKey:{
        type:String,
        require:false   
    },
    userId:{
        type:String,
        require:true
    },
    balance:{
        type:Number,
        require:false
    }},
  { collection: "Users", versionKey: false }


);
module.exports = mongoose.model("User", userSchema);