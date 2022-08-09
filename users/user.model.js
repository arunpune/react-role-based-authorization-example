const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//hash field is password
//do not use hash but use password
const schema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    //delete ret.hash;
    delete ret.password;
  },
});

module.exports = mongoose.model("User", schema);
