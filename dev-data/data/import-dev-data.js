const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tours = require("./../../models/tourModel");
const Users = require("./../../models/userModel");
const Reviews = require("./../../models/reviewModel");

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
    console.log("mongo connection success");
  });

//Read
const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
);

const user = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, "utf-8")
);

const review = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
const importData = async () => {
  try {
    await Tours.create(tour);
    await Users.create(user);
    await Reviews.create(review);

    console.log("Data Upload is successfull");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tours.deleteMany();
    await Users.deleteMany();
    await Reviews.deleteMany();

    console.log("Data deleted successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
