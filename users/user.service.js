const config = require("config.json");
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcryptjs");
const Role = require("_helpers/role");
const db = require("_helpers/db");
const User = db.User;
//const User = require("_helpers/db").User;

console.log("user.service", db.User);
// users hardcoded for simplicity, store in a db for production applications

/* const users = [
  {
    id: 1 ,
    username: "admin",
    password: "admin",
    firstName: "Admin",
    lastName: "User",
    role: Role.Admin,
  },
  {
    id: 2,
    username: "user1",
    password: "user",
    firstName: "Normal",
    lastName: "User",
    role: Role.User,
  },
]; */

//fetch from the database
/* Arun: added to the database
create,
update,
delete: _delete
 */
module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  /*delete: _delete, */
};

/* async function authenticate({ username, password }) {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token,
    };
  }
}
 */
async function authenticate({ username, password }) {
  const user = await User.findOne({ username });
  if (user && user.password) {
    const token = jwt.sign({ sub: user.id }, config.secret, {
      expiresIn: "7d",
    });
    return {
      ...user.toJSON(),
      token,
    };
  }
}

async function getAll() {
  return users.map((u) => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
}

async function getById(id) {
  const user = users.find((u) => u.id === parseInt(id));
  if (!user) return;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
// 09 - August 2022 Arun: added to the database for user registration -create
//we are not using bcrypt for the time being
async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    //user.hash = bcrypt.hashSync(userParam.password, 10);
    user.password = userParam.password;
  }

  // save user
  await user.save();
}

//Arun: this for update the user and password

async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  // hash password is not used
  if (userParam.password) {
    //userParam.hash = bcrypt.hashSync( userParam.password, 10);
    //userParam.hash = userParam.password;
    user.password = userParam.password;
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}
