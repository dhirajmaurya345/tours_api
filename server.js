const dotenv = require("dotenv");
const mongoose=require('mongoose')

process.on('uncaughtException',err=>{
  console.log(err.name,err.message);
  console.log("UNHANDLED Exception, shutting down...")
  process.exit(1)
})

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//const dbConnection=async ()=>{}
mongoose
//.connect(process.env.DATABASE_LOCAL,{
.connect(DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology: true,
}).then(connection=>
  {
    console.log("Database connection is successful")
  })


//testTours.save().then(doc=>{console.log(doc)})

const app = require("./app");
const port = process.env.PORT || 3005;

const server=app.listen(port, () => {
  console.log("Server is running on port :", port);
});

process.on('unhandledRejection',err=>{
  console.log(err.name,err.message);
  console.log("UNHANDLED REJECTION, shutting down...")
server.close(()=>{
  process.exit(1)
})}
)
