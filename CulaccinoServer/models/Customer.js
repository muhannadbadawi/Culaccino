const mongoose =require("mongoose");

const CustomerSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        maxlength:500
    },
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        maxlength:500
    },
    phone:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        maxlength:20
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        maxlength:500
    },
    verificationToken: {
      type: String, 
      default: null, 
    },
    isVerified: {
      type: Boolean, 
      default: false,
    },
    

},
{
    timestamps:true
}
);

const Customer=mongoose.model("Customer",CustomerSchema);
module.exports={
    Customer
}