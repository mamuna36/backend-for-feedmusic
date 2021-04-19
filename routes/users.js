const express = require("express");
// import lowdb
const lowdb = require("lowdb");
const { login } = require("../controllers/users");
const { usersList } = require("../controllers/users");
const { registerController } = require("../controllers/users");
const { addfavourites } = require("../controllers/users");
// import file interface, to read and write from local files
const FileSync = require("lowdb/adapters/FileSync");
// initialize (mock) Database
const adapter = new FileSync("./data/db.json");
const db = lowdb(adapter);
// db.defaults({
//   users: { name: "Mamuna", email: "ma@gmail.com", password: "1234567" },
// }).write();
// // get users collection
// const users = db.get("users");
const router = express.Router();

// Log in
router.post("/login", login);

// List all users
router.get("/", usersList);

router.post("/register", registerController);

// Add favourite
router.post("/add-fav", addfavourites);

module.exports = router;
