const mongoose = require("mongoose")
const { type } = require("node:os")

const employeeSchema = new mongoose.Schema({
    //PERSONAL INFO
    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    phone:{
       type:String,
       required:true,
    },
    gender:{
       type:String,
       enum:["Male","Female"]
    },
    DOB:{
        type:Date,
    },
    //JOB INFO
    position:{
        type:String,
        required:true
    },
    department: {
      type: String,
      enum: ["IT", "HR", "Sales", "Marketing", "Finance"],
    },

    salary: {
      type: Number,
      required: true,
    },

    dateOfJoining: {
      type: Date,
    },
    //Address
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: Number,
      },
    },

    //Skills
    skills: {
      type: [String], // e.g. ["JavaScript", "Node.js"]
    },
    //PROFILE IMAGE
    profileImage: {
      filename: {
        type: String,
      },
      path: {
        type: String,
      },
      size: {
        type: Number, // in bytes
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Employee", employeeSchema);