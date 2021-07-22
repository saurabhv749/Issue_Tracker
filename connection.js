const mongoose = require('mongoose')
require('dotenv').config()
const userSchema = new mongoose.Schema({
  issue_title:{
    type: String,
    required: true
  },
  issue_text:{
    type: String,
    required: true
  },
  created_by:{
    type: String,
    required: true
  },
  created_on: {
    type:Date,
   default: Date.now()
    },
  updated_on: {
    type:Date,
   default: Date.now()},
  assigned_to: {
    type: String,
    default:''
  },
  status_text: {
    type: String,
    default:''
  },
  open: {
    type: Boolean,
    default: true
  },
  project:{
    type: String,
    required: true
  }
})

const Issue = new mongoose.model('issue',userSchema)

const dbConnect=  async()=>{
  mongoose.connect(process.env.DB,{useNewUrlParser:true,useFindAndModify:false,useUnifiedTopology:true},()=>console.log('database connected successfully!'))
}
dbConnect()

module.exports = Issue