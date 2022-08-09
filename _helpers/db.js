//form nodejs module - nodejs
//https://jasonwatmore.com/post/2018/06/14/nodejs-mongodb-simple-api-for-authentication-registration-and-user-management

const config = require("config.json");
const mongoose = require("mongoose");
mongoose.set("debug", true);
const connectionOptions = {
  //useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useFindAndModify: false,
};

mongoose
  .connect(
    process.env.MONGODB_URI || config.connectionString,
    connectionOptions
  )
  .then(() => {
    console.log("Successfully connect to Altas MongoDB server  ");
    //initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

mongoose.Promise = global.Promise;
// we should add more data models here

module.exports = {
  User: require("../users/user.model"),
};
