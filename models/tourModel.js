const mongoose=require('mongoose')
const toursSchema=new mongoose.Schema({
    name:{
      type:String,
      required:[true,"A tour must have a name"],
      unique:true
    },
    rating:{
      type:Number,
      default:4.5
    },
    price:{
      type:Number,
      required:[true,"a tour must have a price"]
    }
  })
  
  const Tours=new mongoose.model('Tours',toursSchema)
  
//   const testTours=new Tours({
//     name:"The Park Camper",
//     price:997
//   })
module.exports=Tours