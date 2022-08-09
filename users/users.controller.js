const express = require("express");
const router = express.Router();
const userService = require("./user.service");
const authorize = require("_helpers/authorize");
const Role = require("_helpers/role");

// routes
//login means authentication
router.post("/authenticate", authenticate); // public route

router.post("/register", register); //create -register
router.get("/", authorize(Role.Admin), getAll); // admin only
router.get("/:id", authorize(), getById); // all authenticated users
router.put("/:id", update);
//router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
  //console.log("res:", res.body);

  console.log("req1", req.body.username);

  userService
    .authenticate(req.body)

    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )

    .catch((err) => next(err));
  console.log("userService.athenticate", user);
}

/* function register(req, res, next) {
  userService
    .create(req.body)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "User is registered successfully" })
    )
    .catch((err) => next(err));
}
 */

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  const currentUser = req.user;
  const id = parseInt(req.params.id);

  // only allow admins to access other user records
  if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

//this code is for update

/* function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
 */
function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "User is updated successfully" })
    )
    .catch((err) => next(err));
}
