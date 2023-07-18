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
        minlength:8,
        maxlength:200
    },
    

},
{
    timestamps:true
}
);

const People=mongoose.model("People",PeopleSchema);
module.exports={
    People
}