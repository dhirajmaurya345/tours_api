const dotenv = require("dotenv");
const mongoose=require('mongoose')
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
  //  console.log("mongo connection =>>",connection)
  })


//testTours.save().then(doc=>{console.log(doc)})

const app = require("./app");
const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log("Server is running on port :", port);
});
