const mongoose =require("mongoose");

const PeopleSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:200
    },
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        maxlength:200
    },
    

},
{
    timestamps:true
}
);

const Login=mongoose.model("Login",PeopleSchema);
module.exports={
    Login
}