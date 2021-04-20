// initialize (mock) Database
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/db.json");
const db = lowdb(adapter);
var cors = require("cors");
// Login controller
exports.login = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const email = req.body.email;
  const password = req.body.password;
  // get user from database
  const foundUser = db.get("users").find({ email: email }).value();
  if (!foundUser) {
    res.json({ error: "User not found" });
  } else {
    // check password
    if (password === foundUser.password) {
      const loggedInUser = foundUser;
      delete loggedInUser.password;
      res.json({ status: "logged in", user: loggedInUser });
    } else {
      res.json({ error: "Wrong password" });
    }
  }
};
exports.usersList = (req, res) => {
  res.json(db.get("users").value());
};
exports.registerController = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  db.get("users").push(req.body).write();
  res.json(db.get("users").value());
};
exports.addfavourites = (req, res) => {
  const title = req.body.title;
  const userEmail = req.body.auth;
  db
    // get users collection
    .get("users")
    // get specific user
    .find({ email: userEmail })
    // modify user data
    .assign({ favourites: [title] })
    // write to DB
    .write();

  res.json(db.get("users").find({ email: userEmail }).value());
};
