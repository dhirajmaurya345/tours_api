const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tours = require("./../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//const dbConnection=async ()=>{}
mongoose
  //.connect(process.env.DATABASE_LOCAL,{
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connection) => {
      console.log("mongo connection success")
  });

//Read
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours_simple.json`, "utf-8")
    );

const importData = async () => {
  try {
    await Tours.create(tours);
    console.log("Data Upload is successfull");
   
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData=async ()=>{
   try{
    await Tours.deleteMany()
    console.log("Data deleted successfully")
  
   }catch(err){
    console.log(err)
   }
   process.exit();
}

if(process.argv[2]==='--import'){
    importData();
}
if(process.argv[2]==='--delete'){
    deleteData();
}

console.log(process.argv)