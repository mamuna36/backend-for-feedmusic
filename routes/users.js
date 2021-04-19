const express = require("express");
// import lowdb
const lowdb = require("lowdb");
// import file interface, to read and write from local files
const FileSync = require("lowdb/adapters/FileSync");
// initialize (mock) Database
const adapter = new FileSync("./data/db.json");
const db = lowdb(adapter);
db.defaults({
  posts: [],
  users: { name: "Mamuna", email: "ma@gmail.com", password: "1234567" },
}).write();
// Add a post
db.get("posts").push({ id: 1, title: "lowdb is awesome" }).write();
// get users collection
const users = db.get("users");
const router = express.Router();

// Log in
router.post("/login", (req, res) => {
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
});

// List all users
router.get("/", (req, res) => {
  res.json(db.get("users").value());
});

router.post("/register", (req, res) => {
  db.get("users").push(req.body).write();
  res.json(db.get("users").value());
});

// Add favourite
router.post("/add-fav", (req, res) => {
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
});

module.exports = router;
